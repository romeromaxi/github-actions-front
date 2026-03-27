import DrawerBase from "../../../components/misc/DrawerBase";
import {SearchButton} from "../../../components/buttons/Buttons";
import * as yup from 'yup';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import {
    OffererClientPortfolioNewBatchFormFields,
    OffererClientPortfolioNewForm,
    OffererClientPortfolioNewFormFields,
    OffererClientPortfolioFilter,
    CarpetaBatchSincronizacionResponse
} from "../../../types/offerer/clientPortfolioData";
import {RequiredCuitSchema} from "../../../util/validation/validationSchemas";
import {Stack, Alert, Box, Typography, Tabs, Tab} from "@mui/material";
import {ControlledTextFieldFilled} from "../../../components/forms";
import React, {useEffect, useState} from "react";
import {HttpClientPortfolio} from "../../../http/clientPortfolio/httpClientPortfolio";
import useAxios from "../../../hooks/useAxios";
import {useAction} from "../../../hooks/useAction";
import {useNavigate} from "react-router-dom";
import {ClientPortfolioTypes} from "../../../types/offerer/clientPortfolioEnums";
import { Button } from "@mui/material";
import { InsertDriveFile } from '@mui/icons-material';

export enum OffererClientPortfolioSourceType {
    Single = 'single',
    Batch = 'batch'
}

interface OffererClientPortfolioDrawerNewProps {
    open: boolean,
    onClose: () => void,
    offererId: number,
    onRefreshFolders: (filter: OffererClientPortfolioFilter) => void,
    currentFilter: OffererClientPortfolioFilter;
    onBatchStarted: (batchResponse: CarpetaBatchSincronizacionResponse) => void;
    dataSource?: OffererClientPortfolioSourceType;
}

const OffererClientPortfolioDrawerNew = ({
    open, 
    onClose, 
    offererId, 
    onRefreshFolders, 
    currentFilter,
    onBatchStarted,
    dataSource
} : OffererClientPortfolioDrawerNewProps) => {
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [fileError, setFileError] = useState<string>('');
    const [activeTab, setActiveTab] = useState<OffererClientPortfolioSourceType>(dataSource ?? OffererClientPortfolioSourceType.Single);
    
    const newPortfolioSchema = yup.object().shape({
    [OffererClientPortfolioNewFormFields.CUIT]: activeTab === OffererClientPortfolioSourceType.Single ? RequiredCuitSchema : yup.string().notRequired()
    })

    const { control, handleSubmit, watch, resetField } = useForm<OffererClientPortfolioNewForm>({
        resolver: yupResolver(newPortfolioSchema)
    })
    
    const navigate = useNavigate()
    const {fetchData} = useAxios()
    const {snackbarSuccess, snackbarError} = useAction()

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        setFileError('');
        
        if (!file) {
            setSelectedFile(null);
            return;
        }
        
        const validExtensions = ['.xlsx', '.xls'];
        const fileExtension = file.name.toLowerCase().substring(file.name.lastIndexOf('.'));
        
        if (!validExtensions.includes(fileExtension)) {
            setFileError('El archivo debe ser un archivo Excel (.xlsx o .xls)');
            setSelectedFile(null);
            event.target.value = '';
            return;
        }
        
        setSelectedFile(file);
        resetField(OffererClientPortfolioNewFormFields.CUIT, { defaultValue: '' });
    }
    
    const handleCuitChange = () => {
        if (selectedFile) {
            setSelectedFile(null);
            const fileInput = document.querySelector('input[type="file"]') as HTMLInputElement;
            if (fileInput) fileInput.value = '';
        }
    }
    
    const onSubmit = (data: OffererClientPortfolioNewForm) => {
        if (activeTab === OffererClientPortfolioSourceType.Batch && selectedFile) {
            const formData = new FormData();
            formData.append(OffererClientPortfolioNewBatchFormFields.ExcelCuits, selectedFile);
            formData.append(OffererClientPortfolioNewBatchFormFields.OffererId, offererId.toString());
            formData.append(OffererClientPortfolioNewBatchFormFields.ClientPortfolioTypeCode, ClientPortfolioTypes.Prospect.toString());
            
            fetchData(
                () => HttpClientPortfolio.syncBatch(formData),
                true
            ).then((batchResponse: CarpetaBatchSincronizacionResponse) => {
                snackbarSuccess(`Procesamiento por lotes iniciado para ${batchResponse.totalCuits} CUITs`);
                
                onBatchStarted(batchResponse);
                
                onClose();
                setSelectedFile(null);
            }).catch((error) => {
                snackbarError(error?.descripcionError || 'Error al procesar el archivo Excel');
                onClose();
                setSelectedFile(null);
            });
        } else if (activeTab === OffererClientPortfolioSourceType.Single) {
            const submitData = {
                ...data,
                [OffererClientPortfolioNewFormFields.ClientPortfolioTypeCode]: ClientPortfolioTypes.Prospect,
                [OffererClientPortfolioNewFormFields.OffererId]: offererId
            }
            
            fetchData(
                () => HttpClientPortfolio.insertNew(submitData),
                true
            ).then((data) => {
                if (data.carpetaExistente) snackbarSuccess('Los datos del CUIT ingresado se han actualizado correctamente');
                else snackbarSuccess('Búsqueda finalizada correctamente');
                navigate(`/offerer/clientPortfolio/${data.id}`);
                onClose();
            }).catch((error) => {
                snackbarError(error?.descripcionError || 'Error al realizar la búsqueda');
                onClose();
            });
        } else {
            snackbarError('Debe ingresar un CUIT o seleccionar un archivo Excel.');
        }
    }
    
    const onHandleClose = () => {
        setActiveTab(OffererClientPortfolioSourceType.Single);
        setFileError('');
        setSelectedFile(null);
        resetField(OffererClientPortfolioNewFormFields.CUIT, { defaultValue: '' });
        onClose();
    }

    useEffect(() => {
        if (open && dataSource !== activeTab) {
            setActiveTab(dataSource ?? OffererClientPortfolioSourceType.Single)
        }
    }, [open, dataSource]);
    
    return (
        <DrawerBase show={open}
                    onCloseDrawer={onHandleClose}
                    title={'Nueva consulta'}
                    action={
                        <SearchButton onClick={handleSubmit(onSubmit)}>
                            Consultar
                        </SearchButton>
                    }
        >
            <Stack spacing={3}>
                {
                    !dataSource && 
                        <Tabs value={activeTab} 
                              onChange={(e, newValue) => setActiveTab(newValue)}
                              aria-label="new query tabs"
                        >
                            <Tab label="Búsqueda simple" value={OffererClientPortfolioSourceType.Single} />

                            <Tab label="Búsqueda por lote" value={OffererClientPortfolioSourceType.Batch} />
                        </Tabs>
                }

                {activeTab === OffererClientPortfolioSourceType.Single && (
                    <ControlledTextFieldFilled
                        label={'CUIT'}
                        control={control}
                        name={OffererClientPortfolioNewFormFields.CUIT}
                        fullWidth
                        disabled={!!selectedFile}
                        onChange={handleCuitChange}
                    />
                )}

                {activeTab === OffererClientPortfolioSourceType.Batch && (
                    <Stack spacing={2}>
                        <Box>
                            <Button
                                variant="outlined"
                                component="label"
                                startIcon={<InsertDriveFile />}
                                fullWidth
                                sx={{
                                    justifyContent: 'flex-start',
                                    textTransform: 'none',
                                    padding: 2
                                }}
                            >
                                {selectedFile ? selectedFile.name : 'Seleccionar archivo Excel'}
                                <input
                                    type="file"
                                    hidden
                                    accept=".xlsx,.xls"
                                    onChange={handleFileChange}
                                />
                            </Button>
                            <Typography variant="caption" color="textSecondary" sx={{ mt: 1, display: 'block' }}>
                                El archivo Excel debe tener una única columna con título ‘CUIT’. Los CUITs deben contener solo números, sin caracteres especiales (ejemplo: -).
                            </Typography>
                        </Box>

                        {fileError && (
                            <Alert severity="error">
                                {fileError}
                            </Alert>
                        )}

                        {selectedFile && !fileError && (
                            <Alert severity="info">
                                Archivo seleccionado: {selectedFile.name}
                            </Alert>
                        )}
                    </Stack>
                )}
            </Stack>
        </DrawerBase>
    )
}

export default OffererClientPortfolioDrawerNew;