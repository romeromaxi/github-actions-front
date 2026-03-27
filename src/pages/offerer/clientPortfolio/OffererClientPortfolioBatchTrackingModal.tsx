import React, { Fragment, useEffect, useRef, useState, useMemo } from 'react';
import {
    Modal,
    Box,
    Typography,
    IconButton,
    CircularProgress,
    Chip,
    Tooltip,
    Stack,
    Accordion,
    AccordionSummary,
    AccordionDetails,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { HttpClientPortfolio } from '../../../http/clientPortfolio/httpClientPortfolio';
import {
    CarpetaBatchConDetallesResponse,
    CarpetaBatchSincronizacionResponse,
    CarpetaBatchSincronizacionDetalleResponse,
    CarpetaBatchSincronizacionDetalleResponseFields,
} from '../../../types/offerer/clientPortfolioData';
import { ITableColumn, TableColumnType, TableWithPaging } from '../../../components/table';
import { EntityWithIdFields } from '../../../types/baseEntities';
import { keyframes, styled } from '@mui/system';
import { NextButton } from '../../../components/buttons/Buttons';
import { useNavigate } from 'react-router-dom';

interface BatchDetailTableRow {
    id: number; 
    cuit: string;
    razonSocial: string;
    processingStatus: 'processing' | 'completed' | 'error';
    errorMessage?: string;
    isProcessing: boolean;
    justCompleted?: boolean; 
    idPersona?: number;
}
interface BatchTrackingModalProps {
    open: boolean;
    onClose: () => void;
    initialBatchId?: string;
    activeBatches: CarpetaBatchSincronizacionResponse[];
    onBatchCompleted: (batchId: string) => void;
    onRefreshFolders: (filter: any) => void;
    currentFilter: any;
}

const highlightAnimation = keyframes`
  0% {
    background-color: rgba(76, 175, 80, 0.3);
    transform: scale(1.02);
  }
  50% {
    background-color: rgba(76, 175, 80, 0.2);
  }
  100% {
    background-color: transparent;
    transform: scale(1);
  }
`;

const AnimatedTableRow = styled('div')<{ justCompleted?: boolean }>`
  ${({ justCompleted }) =>
        justCompleted &&
        `
    animation: ${highlightAnimation} 3s ease-in-out;
  `}
`;

const modalStyle = {
    position: 'absolute' as 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: '80%',
    maxWidth: 900,
    bgcolor: 'background.paper',
    border: '2px solid #000',
    boxShadow: 24,
    p: 4,
    maxHeight: '90vh',
    overflowY: 'auto',
};

const uuidToNumber = (uuid: string): number => {
    let hash = 0;
    for (let i = 0; i < uuid.length; i++) {
        const char = uuid.charCodeAt(i);
        hash = ((hash << 5) - hash) + char;
        hash = hash & hash;
    }
    return Math.abs(hash);
};

const BatchTrackingModal: React.FC<BatchTrackingModalProps> = ({
    open,
    onClose,
    initialBatchId,
    activeBatches,
    onBatchCompleted,
    onRefreshFolders,
    currentFilter,
}) => {
    const [expandedBatchId, setExpandedBatchId] = useState<string | null>(initialBatchId || null);
    const [batchDetails, setBatchDetails] = useState<Map<string, CarpetaBatchConDetallesResponse>>(new Map());
    const [justCompletedRows, setJustCompletedRows] = useState<Set<string>>(new Set());
    const pollingIntervalsRef = useRef<Map<string, NodeJS.Timeout>>(new Map());
    const navigate = useNavigate();

    const handleAccordionChange = (batchId: string) => (event: React.SyntheticEvent, isExpanded: boolean) => {
        setExpandedBatchId(isExpanded ? batchId : null);
    };

    const startPollingBatch = async (batchId: string) => {
        const pollBatchStatus = async () => {
            try {
                const response = await HttpClientPortfolio.getBatchStatus(batchId);
                const status: CarpetaBatchConDetallesResponse = response.data;

                setBatchDetails(prev => {
                    const newDetails = new Map(prev);
                    const prevStatus = newDetails.get(batchId);
                    
                    const newlyCompletedCuits = new Set<string>();

                    status.carpetas.forEach(newCarpeta => {
                        const prevCarpeta = prevStatus?.carpetas.find(c => c.cuit === newCarpeta.cuit);
                        if (newCarpeta.bitProcesado === 1 && (!prevCarpeta || prevCarpeta.bitProcesado !== 1)) {
                            newlyCompletedCuits.add(newCarpeta.cuit);
                        }
                    });

                    if (newlyCompletedCuits.size > 0) {
                        setJustCompletedRows(prev => new Set([...prev, ...newlyCompletedCuits]));
                        setTimeout(() => {
                            setJustCompletedRows(prev => {
                                const remaining = new Set(prev);
                                newlyCompletedCuits.forEach(cuit => remaining.delete(cuit));
                                return remaining;
                            });
                        }, 3000);
                    }

                    newDetails.set(batchId, status);
                    return newDetails;
                });

                const allCompleted = status.carpetas.every(carpeta => carpeta.bitProcesado === 1);
                if (allCompleted) {
                    stopPollingBatch(batchId);
                    onBatchCompleted(batchId);
                    onRefreshFolders(currentFilter);
                }
            } catch (error) {
                console.error(`Error polling batch ${batchId} status:`, error);
            }
        };

        stopPollingBatch(batchId);
        pollBatchStatus();
        pollingIntervalsRef.current.set(batchId, setInterval(pollBatchStatus, 2000));
    };

    const stopPollingBatch = (batchId: string) => {
        const interval = pollingIntervalsRef.current.get(batchId);
        if (interval) {
            clearInterval(interval);
            pollingIntervalsRef.current.delete(batchId);
        }
    };

    useEffect(() => {
        if (open) {
            activeBatches.forEach(batch => {
                if (batch.id) {
                    startPollingBatch(batch.id);
                }
            });
        } else {
            pollingIntervalsRef.current.forEach((_, batchId) => stopPollingBatch(batchId));
            setBatchDetails(new Map());
            setJustCompletedRows(new Set());
        }

        if (initialBatchId && open) {
            setExpandedBatchId(initialBatchId);
        }

        return () => {
            pollingIntervalsRef.current.forEach((_, batchId) => stopPollingBatch(batchId));
        };
    }, [open, activeBatches, initialBatchId]);

    const renderProcessingStatus = (row: BatchDetailTableRow) => {
        if (!row.isProcessing && !row.processingStatus) {
            return <Fragment />;
        }

        switch (row.processingStatus) {
            case 'processing':
                return (
                    <Box display="flex" alignItems="center" gap={1}>
                        <CircularProgress size={16} />
                        <Chip
                            label="Procesando"
                            color="primary"
                            size="small"
                            variant="outlined"
                        />
                    </Box>
                );
            case 'completed':
                return (
                    <Chip
                        label="Completado"
                        color="success"
                        size="small"
                    />
                );
            case 'error':
                return (
                    <Tooltip title={row.errorMessage || 'Error desconocido'}>
                        <Chip
                            label="Error"
                            color="error"
                            size="small"
                        />
                    </Tooltip>
                );
            default:
                return <Fragment />; 
        }
    };

    const renderActionButton = (row: BatchDetailTableRow) => {
        if (row.isProcessing || row.processingStatus === 'error') {
            return renderProcessingStatus(row);
        }

        return (
            <NextButton
                size={'small'}
                variant={'contained'}
                onClick={() => {
                    if (row.idPersona) {
                        navigate(`/offerer/clientPortfolio/${row.idPersona}`);
                        onClose();
                    } else {
                        console.warn("Cannot navigate: idPersona is missing for this row.");
                    }
                }}
            >
                Detalle
            </NextButton>
        );
    };

    const columns: ITableColumn[] = [
        {
            label: 'CUIT',
            value: 'cuit', textAlignHeader: 'center',
            type: TableColumnType.CUIT,
            onRenderCell: (row: BatchDetailTableRow) => {
                const isJustCompleted = justCompletedRows.has(row.cuit);
                return (
                    <AnimatedTableRow justCompleted={isJustCompleted}>
                        {row.cuit}
                    </AnimatedTableRow>
                );
            },
        },
        {
            label: 'Razón Social',
            value: 'razonSocial', textAlignHeader: 'center',
            onRenderCell: (row: BatchDetailTableRow) => {
                const isJustCompleted = justCompletedRows.has(row.cuit);
                return (
                    <AnimatedTableRow justCompleted={isJustCompleted}>
                        {row.razonSocial}
                    </AnimatedTableRow>
                );
            },
        },
        {
            label: 'Estado',
            value: 'processingStatus',
            textAlignHeader: 'center',
            onRenderCell: (row: BatchDetailTableRow) => renderProcessingStatus(row),
        },
        /*{
            label: '',
            onRenderCell: (row: BatchDetailTableRow) => renderActionButton(row)
        }*/
    ];

    return (
        <Modal
            open={open}
            onClose={onClose}
            aria-labelledby="batch-tracking-modal-title"
            aria-describedby="batch-tracking-modal-description"
        >
            <Box sx={modalStyle}>
                <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
                    <Typography id="batch-tracking-modal-title" variant="h6" component="h2">
                        Mis Búsquedas por Lote
                    </Typography>
                    <IconButton onClick={onClose}>
                        <CloseIcon />
                    </IconButton>
                </Box>
                <Stack spacing={2}>
                    {activeBatches.length === 0 && (
                        <Typography variant="body2">
                            No hay búsquedas por lote activas.
                        </Typography>
                    )}
                    {activeBatches.map(batch => (
                        <Accordion
                            key={batch.id}
                            expanded={expandedBatchId === batch.id}
                            onChange={handleAccordionChange(batch.id || '')}
                        >
                            <AccordionSummary
                                expandIcon={<ExpandMoreIcon />}
                                aria-controls={`panel-${batch.id}-content`}
                                id={`panel-${batch.id}-header`}
                            >
                                <Typography>
                                    Lote {batch.id?.substring(0, 8)}... - {batch.totalCuits} CUITs
                                    ({batchDetails.get(batch.id || '')?.carpetas.filter(c => c.bitProcesado === 1 && !c.mensajeError).length || 0}/{batch.totalCuits} Completados)
                                </Typography>
                            </AccordionSummary>
                            <AccordionDetails>
                                
                                {batchDetails.get(batch.id || '') ? (
                                    <TableWithPaging
                                        columns={columns}
                                        entityPaginada={{
                                            lista: batchDetails.get(batch.id || '')!.carpetas.map(carpeta => ({
                                                id: uuidToNumber(carpeta.id),
                                                cuit: carpeta.cuit,
                                                razonSocial:
                                                    carpeta.bitProcesado === 1 ?
                                                        carpeta.mensajeError ? "No se pudo procesar" : carpeta.razonSocial
                                                        :
                                                        carpeta.razonSocial || 'Procesando...',
                                                bitProcesado: carpeta.bitProcesado !== 1,
                                                processingStatus: carpeta.mensajeError ? 'error' :
                                                    carpeta.bitProcesado === 1 ? 'completed' : 'processing',
                                                errorMessage: carpeta.mensajeError,
                                                justCompleted: justCompletedRows.has(carpeta.cuit),
                                                idPersona: carpeta.idPersona,
                                            })),
                                            paginacion: {
                                                currentPage: 1,
                                                pageSize: batchDetails.get(batch.id || '')!.carpetas.length,
                                                cantRecords: batchDetails.get(batch.id || '')!.carpetas.length,
                                                totalPage: 1
                                            }
                                        }}
                                        isLoading={false}
                                        onPaging={() => { }} title={''} error={undefined}
                                    />
                                ) : (
                                    <Box display="flex" justifyContent="center" py={2}>
                                        <CircularProgress />
                                        <Typography ml={1}>Cargando detalles del lote...</Typography>
                                    </Box>
                                )}
                            </AccordionDetails>
                        </Accordion>
                    ))}
                </Stack>
            </Box>
        </Modal>
    );
};

export default BatchTrackingModal;