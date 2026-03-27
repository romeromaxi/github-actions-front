import {Box, Button, Stack} from "@mui/material";
import React, {useContext, useEffect, useRef, useState} from "react";
import {OffererContext} from "../components/OffererContextProvider";
import {
    CarpetaBatchConDetallesResponse,
    CarpetaBatchSincronizacionResponse,
    OffererClientPortfolioFilter,
    OffererClientPortfolioFilterFields,
    OffererClientPortfolioFilterForm,
    OffererClientPortfolioView
} from "../../../types/offerer/clientPortfolioData";
import OffererClientPortfolioTable from "../clientPortfolio/OffererClientPortfolioTable";
import {HttpClientPortfolio} from "../../../http/clientPortfolio/httpClientPortfolio";
import {EntityListWithPagination, EntityPaginationFields, EntityWithIdFields} from "../../../types/baseEntities";
import BatchTrackingModal from "../clientPortfolio/OffererClientPortfolioBatchTrackingModal";
import {StackPlus} from "@phosphor-icons/react";
import {AddButton} from "../../../components/buttons/Buttons";
import OffererClientPortfolioDrawerNew, {
    OffererClientPortfolioSourceType
} from "../clientPortfolio/OffererClientPortfolioDrawerNew";
import {SafetyComponent} from "../../../components/security";
import {OffererButtonSecObjects, SecurityComponents} from "../../../types/security";
import {TypographyBase} from "../../../components/misc/TypographyBase";
import OffererClientPortfolioFilterComponent from "../clientPortfolio/OffererClientPortfolioFilterComponent";
import {FormProvider, useForm} from "react-hook-form";

const defaultFilter: OffererClientPortfolioFilter = {
    [OffererClientPortfolioFilterFields.BusinessName]: '',
    [OffererClientPortfolioFilterFields.CUIT]: '',
    [OffererClientPortfolioFilterFields.PageSize]: 10,
    [OffererClientPortfolioFilterFields.CurrentPage]: 1,
    [OffererClientPortfolioFilterFields.OrderBy]: ''
}

const emptyPaginatedList: EntityListWithPagination<OffererClientPortfolioView> = {
    lista: [],
    paginacion: {
        [EntityPaginationFields.ActualPage]: 1,
        [EntityPaginationFields.CantPages]: 0,
        [EntityPaginationFields.PageSize]: 10,
        [EntityPaginationFields.CantRecords]: 0
    }
};

const HomeOffererClientPortfolio = () => {
    const offerer = useContext(OffererContext);
    const [loading, setLoading] = useState<boolean>(true);
    const [filter, setFilter] = useState<OffererClientPortfolioFilter>(defaultFilter);
    const [activeBatches, setActiveBatches] = useState<CarpetaBatchSincronizacionResponse[]>([]);
    const [dataSourceNewClient, setDataSourceNewClient] = useState<OffererClientPortfolioSourceType>();
    const [showBatchTrackingModal, setShowBatchTrackingModal] = useState<boolean>(false);
    const [open, setOpen] = useState<boolean>(false);
    const [batchToExpand, setBatchToExpand] = useState<string | undefined>(undefined);
    const [paginatedProspectList, setPaginatedProspectList] = useState<EntityListWithPagination<OffererClientPortfolioView>>(emptyPaginatedList);
    const [activeBatchIds, setActiveBatchIds] = useState<string[]>([]);
    const [justCompletedRows, setJustCompletedRows] = useState<Set<string>>(new Set());
    const pollingIntervalRef = useRef<NodeJS.Timeout | null>(null);
    const methods = useForm<OffererClientPortfolioFilterForm>({
        defaultValues: defaultFilter
    });

    useEffect(() => {
        HttpClientPortfolio.getActiveBatches(offerer[EntityWithIdFields.Id])
            .then((response) => setActiveBatches(response.data))
            .catch(console.error);
    }, [offerer]);

    const searchProspects = (fil: OffererClientPortfolioFilter) => {
        setLoading(true);
        HttpClientPortfolio.searchFolders(offerer[EntityWithIdFields.Id], fil)
            .then((r) => {
                setPaginatedProspectList(r)
                setLoading(false)
            })
            .catch((error) => {
                console.error("Error searching prospects:", error);
                setPaginatedProspectList(emptyPaginatedList);
                setLoading(false);
            });
    };

    useEffect(() => {
        searchProspects(filter)
    }, [filter]);

    const onPaging = (currentPage: number) => {
        const currentFilter: OffererClientPortfolioFilter = {
            ...filter,
            [OffererClientPortfolioFilterFields.CurrentPage]: currentPage
        }
        setFilter(currentFilter)
        searchProspects(currentFilter)
    }

    const onSubmitFilter = (data: OffererClientPortfolioFilterForm) => {
        const currentFilter: OffererClientPortfolioFilter = {
            ...filter,
            ...data,
            [OffererClientPortfolioFilterFields.CurrentPage]: 1
        }
        setFilter(currentFilter)
        searchProspects(currentFilter)
    }

    const handleRefreshFolders = (newFilter: OffererClientPortfolioFilter) => {
        searchProspects(newFilter);
    };

    const handleBatchStarted = (batchResponse: CarpetaBatchSincronizacionResponse) => {
        setActiveBatches(prev => [...prev, batchResponse]);
        setShowBatchTrackingModal(true);
        setBatchToExpand(batchResponse.id);
    };

    const handleBatchCompleted = (batchId: string) => {
        searchProspects(filter);
    };

    const onClickMySearch = () => {
        setShowBatchTrackingModal(true);
        setBatchToExpand(undefined);
    }

    const onAddClientPortfolio = (sourceType: OffererClientPortfolioSourceType) => {
        setDataSourceNewClient(sourceType);
        setOpen(true)
    }
    
    const onAddSinglePortfolio = () => onAddClientPortfolio(OffererClientPortfolioSourceType.Single);
    
    const onAddBatchPortfolio = () => onAddClientPortfolio(OffererClientPortfolioSourceType.Batch);

    const onBatchStarted = (batchResponse: CarpetaBatchSincronizacionResponse) => {
        handleBatchStarted(batchResponse);

        if (batchResponse.id) {
            setActiveBatchIds(prev => [...prev, batchResponse.id]);
            startPollingBatch(batchResponse.id);
        }
    };

    const startPollingBatch = (batchId: string) => {
        const pollBatchStatus = async () => {
            try {
                const response = await HttpClientPortfolio.getBatchStatus(batchId);
                const batchStatus: CarpetaBatchConDetallesResponse = response.data;

                const allCompleted = batchStatus.carpetas.every(carpeta => carpeta.bitProcesado === 1);
                if (allCompleted) {
                    setActiveBatchIds(prev => prev.filter(id => id !== batchId));
                    handleRefreshFolders(filter);


                    const newlyCompletedCuit = new Set<string>();
                    batchStatus.carpetas.forEach(carpeta => {
                        if (carpeta.bitProcesado === 1) {
                            newlyCompletedCuit.add(carpeta.cuit);
                        }
                    });
                    if (newlyCompletedCuit.size > 0) {
                        setJustCompletedRows(newlyCompletedCuit);
                        setTimeout(() => {
                            setJustCompletedRows(new Set());
                        }, 3000);
                    }
                }
            } catch (error) {
                console.error('Error polling batch status:', error);
            }
        };

        pollBatchStatus();
        pollingIntervalRef.current = setInterval(pollBatchStatus, 2000);
    };
    
    return (
        <Stack spacing={3} width={"100%"}>
            <Stack direction={'row'} alignItems='center' justifyContent={'space-between'}>
                <TypographyBase variant="h3">Base de Clientes</TypographyBase>
                    <Stack direction='row' 
                           alignItems='center'
                           spacing={2}
                           sx={{ placeItems: 'start' }}
                    >
                        <SafetyComponent componentName={SecurityComponents.HomeOffererClientPortfolio}
                                         objectName={OffererButtonSecObjects.OffererButtonClientPortfolioBatchSearch}
                        >
                            <Stack>
                                <Button size='small'
                                        color={'secondary'}
                                        variant={'outlined'}
                                        startIcon={<StackPlus />}
                                        onClick={onAddBatchPortfolio}>
                                    Carga por lote
                                </Button>
    
                                <Button variant='text'
                                        size='extra-small'
                                        onClick={onClickMySearch}
                                        sx={{ alignSelf: 'start' }}
                                >
                                    Historial de cargas por lote
                                </Button>
                            </Stack>
                        </SafetyComponent>
                        
                        <SafetyComponent componentName={SecurityComponents.HomeOffererClientPortfolio}
                                         objectName={OffererButtonSecObjects.OffererButtonClientPortfolioIndividualSearch}
                        >
                            <AddButton size='small'
                                       onClick={onAddSinglePortfolio}
                            >
                                Carga individual
                            </AddButton>
                        </SafetyComponent>
                    </Stack>
            </Stack>
            <Box sx={{display: 'flex', justifyContent: 'flex-end'}}>
                <FormProvider {...methods}>
                    <OffererClientPortfolioFilterComponent onSubmit={onSubmitFilter}/>
                </FormProvider>
            </Box>
            <Stack spacing={4}>
                <OffererClientPortfolioTable 
                    loading={loading}
                    prospects={paginatedProspectList}
                    onPaging={onPaging}
                    onRefreshFolders={handleRefreshFolders}
                    currentFilter={filter}
                    onSearch={onSubmitFilter}
                    activeBatchIds={activeBatchIds}
                    justCompletedRows={justCompletedRows}
                />
            </Stack>
            
            <BatchTrackingModal
                open={showBatchTrackingModal}
                onClose={() => {
                    setShowBatchTrackingModal(false);
                    setBatchToExpand(undefined);
                }}
                initialBatchId={batchToExpand}
                activeBatches={activeBatches}
                onBatchCompleted={handleBatchCompleted}
                onRefreshFolders={handleRefreshFolders}
                currentFilter={filter}
            />
            <OffererClientPortfolioDrawerNew
                open={open}
                onClose={() => setOpen(false)}
                offererId={offerer[EntityWithIdFields.Id]}
                onRefreshFolders={handleRefreshFolders}
                currentFilter={filter}
                onBatchStarted={onBatchStarted}
                dataSource={dataSourceNewClient}
            />
        </Stack>
    );
}

export default HomeOffererClientPortfolio