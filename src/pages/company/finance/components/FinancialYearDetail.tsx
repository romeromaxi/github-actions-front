import {Box, Button, Card, CardContent, CardHeader, Chip, CircularProgress, Grid, Skeleton, Stack} from '@mui/material';
import {useFormContext} from 'react-hook-form';
import {useContext, useEffect, useMemo, useRef, useState} from 'react';
import {EntityWithIdFields} from '../../../../types/baseEntities';
import FinancialYearEditComponent from './FinancialYearEditComponent';
import CardEditingBaseWithoutDetail from '../../../../components/cards/CardEditingBaseWithoutDetail';
import {SaveButton} from '../../../../components/buttons/Buttons';
import {ButtonExportDropdown} from '../../../../components/buttons/ButtonExportDropdown';
import CompanyFinancialYearDocumentList from './CompanyFinancialYearDocumentList';
import {WrapperIcons} from "../../../../components/icons/Icons";
import {File, FileText, FolderSimple, List} from 'phosphor-react';
import {NavsTabHorizontal} from "../../../../components/navs/NavsTab";
import {BalancesContext, BalancesSourceType} from "../../../../hooks/contexts/BalancesContext";
import {
    BalanceTypes,
    FinancialYear,
    FinancialYearFields,
    IncomeStatementWithPrevious, PatrimonialStatement, IncomeStatement,
    PatrimonialStatementWithPrevious
} from "../../../../types/general/generalFinanceData";
import DialogLoadBalanceByOcr from "../../../../components/dialog/DialogLoadBalanceByOcr";
import FinancialStatementIAButton from "./ia/FinancialStatementIAButton";
import {FinancialYearStatus} from '../../../../types/general/generalEnums';
import DialogLoadBalanceByOcrDynamic from '../../../../components/dialog/DialogLoadBalanceByOcrDynamic';
import FinancialYearDynamicEditComponent from "./FinancialYearDynamicEditComponent";

interface FinancialYearDetailProps {
  financialYear: FinancialYear;
  dataSource?: BalancesSourceType;
  dataId?: number | string;
  onAfterUpdate?: () => void;
  isCollapsible?: boolean;
  shouldSubmit?: boolean;
  setShouldSubmit?: (value: boolean) => void;
  localPatrimonialData?: PatrimonialStatement;
  localIncomeData?: IncomeStatement;
  localLoading?: boolean;
}

export enum FinancialYearEditFormFields {
  PatrimonialStatement = 'estadoPatrimonial',
  IncomeStatement = 'estadoResultado',
}

export interface FinancialYearEditFormType {
  [FinancialYearEditFormFields.PatrimonialStatement]: PatrimonialStatementWithPrevious;
  [FinancialYearEditFormFields.IncomeStatement]: IncomeStatementWithPrevious;
}

function FinancialYearDetail({
  financialYear, dataSource, dataId, onAfterUpdate, isCollapsible, shouldSubmit, setShouldSubmit, localPatrimonialData, localIncomeData, localLoading
}: FinancialYearDetailProps) {
  const { handleUpdate, handleExportExcel, enableLoadsIA, getDetail, patrimonialData, incomeData, loading } = useContext(BalancesContext)
  const methods = useFormContext<FinancialYearEditFormType>()
  const financialId: number = financialYear[EntityWithIdFields.Id];
  const patrimonialStatementId: number =
    financialYear[FinancialYearFields.PatrimonialStatementId];
  const incomeStatementId: number =
    financialYear[FinancialYearFields.IncomeStatementId];
  const [openOcrResult, setOpenOcrResult] = useState<boolean>(false);
  const [openOcrDynamic, setOpenOcrDynamic] = useState<boolean>(false);
  const domElementRef = useRef(null);

  const hasLocalData = !!localPatrimonialData || !!localIncomeData;
  const effectivePatrimonialData = localPatrimonialData ?? patrimonialData;
  const effectiveIncomeData = localIncomeData ?? incomeData;
  const isLoading = hasLocalData ? localLoading : loading;
  
  const isAdvancedBalance = useMemo(() => {
      if (!effectivePatrimonialData) return false;
      
      return effectivePatrimonialData[FinancialYearFields.BalanceTypeCode] === BalanceTypes.Detailed;
  }, [effectivePatrimonialData])
  
  const renderOcrStatusChip = (ocrStatusCode?: FinancialYearStatus) => {
    if (!ocrStatusCode) {
      return null;
    }
    
    switch (ocrStatusCode) {
      case FinancialYearStatus.Processing:
        return (
          <Box display="flex" alignItems="center" gap={1}>
            <CircularProgress size={16} />
            <Chip label="Procesando" color="primary" size="small" variant="outlined" />
          </Box>
        );
      case FinancialYearStatus.ProcessedSuccessfully:
        return (
            <Button variant='outlined' 
                    size='small' 
                    onClick={handleOpenOcr} 
                    id={'financial-view-ocr-result-btn'}
            >
                Ver resultado IA
            </Button>
        );
      case FinancialYearStatus.ProcessedFailed:
        return <Chip label="Error al procesar" color="error" size="small" />;
      case FinancialYearStatus.Created:
      default:
        return null;
    }
  };

  const handleOpenOcr = () => {
    if (isAdvancedBalance)
        setOpenOcrDynamic(true);
    else
        setOpenOcrResult(true);
  };
  
  const handleCloseOcr = () => { 
      setOpenOcrResult(false);
      setOpenOcrDynamic(false); 
  };


  const onHandleSubmit = (data: FinancialYearEditFormType) => 
      handleUpdate(data, patrimonialStatementId, incomeStatementId, onAfterUpdate);

  const handleLoadData = () => {
      // No longer needed
  }
  
  useEffect(() => {
    if (shouldSubmit && isCollapsible) {
      methods.handleSubmit(onHandleSubmit)();
      setShouldSubmit?.(false);
    }
  }, [shouldSubmit, isCollapsible]);
  
  useEffect(() => {
    if (hasLocalData) return;

    if (effectivePatrimonialData?.[EntityWithIdFields.Id] !== patrimonialStatementId ||
        effectiveIncomeData?.[EntityWithIdFields.Id] !== incomeStatementId) {
      getDetail(patrimonialStatementId, incomeStatementId)
    }
  }, [hasLocalData, patrimonialStatementId, incomeStatementId, effectivePatrimonialData, effectiveIncomeData, getDetail]);
  
  const viewDocsButton = () => {
    if (isCollapsible) return null;
    
    const ocrStatusCode = effectivePatrimonialData ?
        effectivePatrimonialData[FinancialYearFields.OcrBalanceStatusCode] : financialYear[FinancialYearFields.OcrBalanceStatusCode];
    const isProcessing = ocrStatusCode === FinancialYearStatus.Processing;
    
    return (
      <Stack direction='row-reverse' alignItems='center' justifyContent='space-between'>
          <Stack direction='row' alignItems='center' spacing={1}>
            <SaveButton onClick={methods.handleSubmit(onHandleSubmit)} 
                        id={"entity-financial-year-save-btn"} 
                        disabled={isProcessing}
                        size={'small'}
            >
              Guardar
            </SaveButton>
            <ButtonExportDropdown size={'small'} onExportExcel={() => handleExportExcel(financialYear[EntityWithIdFields.Id])} id={"entity-financial-year-export-btn"}/>
          </Stack>
          <Stack direction='row' alignItems='center' spacing={2}>
            {renderOcrStatusChip(ocrStatusCode)}
              
            {
              (enableLoadsIA && !isProcessing) &&
                <FinancialStatementIAButton dataId={dataId}
                                            dataSource={dataSource}
                                            financialId={financialId}
                                            onReload={handleLoadData}
                                            size={'small'}
                />
            }
          </Stack>
      </Stack>
    );
  };

  const loadingComponent = () => {
    return (
        <Card>
          <CardHeader title={<Skeleton width={'20%'} />} />
          <CardContent>
            <Grid container spacing={1}>
              {Array.from(Array(10).keys()).map((item) => (
                  <Grid
                      item
                      xs={12}
                      key={`keyCardBaseLoading_${item}`}
                      alignItems={'center'}
                  >
                    <Skeleton sx={{ width: '100%' }} />
                  </Grid>
              ))}
            </Grid>
          </CardContent>
        </Card>
    )
  }

  const renderFinancialContent = () => {
    const content = (
      <div ref={domElementRef} style={{display: 'flex', justifyContent: 'center', width: '100% !important', margin: '0 auto !important'}}>
        <FinancialYearEditComponent
          incomeStatement={effectiveIncomeData}
          patrimonialStatement={effectivePatrimonialData}
          year={financialYear[FinancialYearFields.Year]}
          patrimonialNameBase={FinancialYearEditFormFields.PatrimonialStatement}
          incomeNameBase={FinancialYearEditFormFields.IncomeStatement}
        />
      </div>
    );

    if (!isAdvancedBalance) {
      return content;
    }

    return (
      <NavsTabHorizontal lstTabs={[
        {
          tabList: [
            {
              label: 'Resumen',
              icon: <WrapperIcons Icon={FileText} size={'sm'}/>,
              iconPosition: 'start',
              default: true,
              content: content
            },
            {
              label: 'Detalle',
              icon: <WrapperIcons Icon={List} size={'sm'}/>,
              iconPosition: 'start',
              content: (
                <div style={{display: 'flex', justifyContent: 'center', width: '100% !important', margin: '0 auto !important'}}>
                  <FinancialYearDynamicEditComponent
                    year={financialYear[FinancialYearFields.Year]}
                    patrimonialNameBase={FinancialYearEditFormFields.PatrimonialStatement}
                    incomeNameBase={FinancialYearEditFormFields.IncomeStatement}
                  />
                </div>
              )
            }
          ]
        }
      ]} />
    );
  };
  
  return (
    <Stack gap={1}>
        {
          isCollapsible ? (
            renderFinancialContent()
          ) : dataSource !== BalancesSourceType.Company ?
                isLoading ? (
                    loadingComponent()
                ) : (
                        <CardEditingBaseWithoutDetail
                            title={''}
                            spacedActions={viewDocsButton()}
                            editContent={renderFinancialContent()}
                            onSubmitEdit={onHandleSubmit}
                            disableActions={financialYear[FinancialYearFields.OcrBalanceStatusCode] === FinancialYearStatus.Processing}
                        />
                )
                :
                  <NavsTabHorizontal lstTabs={[
                    {
                      tabList: [
                        {
                          label: 'Información general',
                          icon: <WrapperIcons Icon={File} size={'sm'}/>,
                          iconPosition: 'start',
                          default: true,
                          content:
                              isLoading ? (
                                  loadingComponent()
                              ) : (
                                      <CardEditingBaseWithoutDetail
                                          title={''}
                                          spacedActions={viewDocsButton()}
                                          editContent={renderFinancialContent()}
                                          onSubmitEdit={onHandleSubmit}
                                          disableActions={financialYear[FinancialYearFields.OcrBalanceStatusCode] === FinancialYearStatus.Processing}
                                      />
                              )
                        },
                        {
                          label: 'Documentación asociada',
                          icon: <WrapperIcons Icon={FolderSimple} size={'sm'}/>,
                          content: <CompanyFinancialYearDocumentList financialYearId={financialYear[EntityWithIdFields.Id]}/>,
                          iconPosition: 'start'
                        }
                      ]
                    }
                  ]
                  }
                  />
        }

        <DialogLoadBalanceByOcr open={openOcrResult} 
                                onClose={handleCloseOcr} 
                                patrimonialId={patrimonialStatementId} 
                                incomeId={incomeStatementId} 
                                guid={financialYear[FinancialYearFields.OCRProcessGuid]} 
                                documentId={financialYear[FinancialYearFields.DocumentId]}
        />

        <DialogLoadBalanceByOcrDynamic open={openOcrDynamic} 
                                       onClose={handleCloseOcr} 
                                       patrimonialId={financialYear[FinancialYearFields.PatrimonialStatementId]} 
                                       incomeId={financialYear[FinancialYearFields.IncomeStatementId]} 
                                       guid={financialYear[FinancialYearFields.OCRProcessGuid]} 
                                       documentId={financialYear[FinancialYearFields.DocumentId]}
        />
    </Stack>
  );
}

export default FinancialYearDetail;
