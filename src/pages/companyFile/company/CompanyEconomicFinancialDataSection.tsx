import {
    CompanyFileCompletenessFields,
    CompanyFileCompletenessView,
    CompanyForm,
    CompanyViewDTOFields
} from "../../../types/company/companyData";
import React, {useContext, useEffect, useState} from "react";
import {Accordion, Alert, Box, Button, Collapse, Stack, Theme, Typography, useMediaQuery, useTheme} from "@mui/material";
import {BaseIconWrapper} from "../../../components/icons/Icons";
import {CaretDown, CaretUp, PresentationChart} from "@phosphor-icons/react";
import CompanyFlowYearlyTotals from "../../company/flow/CompanyFlowYearlyTotals";
import CompanyFlowTableDetail, {CompanyFlowTableEditDetail} from "../finance/components/CompanyFlowTableDetail";
import {
    CompanyBasePatrimonialStatementFields,
    CompanyDeclarationOfAssetsFields, CompanyDeclarationOfAssetsTotals,
    CompanyDeclarationOfAssetsTotalsFields, CompanyFinancialTotalsFields,
    CompanyIncomeLastYearStatementFields,
    CompanyLastYearDeclarationOfAssets,
    CompanyLastYearDeclarationOfAssetsFields,
    CompanyPatrimonialStatementFields
} from "../../../types/company/companyFinanceInformationData";
import {EntityWithIdFields} from "../../../types/baseEntities";
import CompanyFinancialPatrimonialYearlyTotals, {
    FinancialPatrimonialYearlyEditTotals
} from "../finance/components/CompanyFinancialPatrimonialYearlyTotals";
import CompanyFinancialResultYearlyTotals, {
    FinancialResultYearlyEditTotals
} from "../finance/components/CompanyFinancialResultYearlyTotals";
import {dateFormatter} from "../../../util/formatters/dateFormatter";
import CompanyFinancialDeclarationOfAssetsTotals
    , { CompanyFinancialDeclarationOfAssetsEditTotals }    from "../../company/finance/components/CompanyFinancialDeclarationOfAssetsTotals";
import {useFormContext} from "react-hook-form";
import {CompanyFileContext, CompanyFileEditFormFields} from "../../../hooks/contexts/CompanyFileContext";
import CompanyFileWithPercentage from "../components/CompanyFileWithPercentage";
import CompanyEconomicFinancialDateChangeDrawer from "../finance/components/CompanyEconomicFinancialDateChangeDrawer";
import {ButtonXs} from "../../../components/buttons/Buttons";


interface CompanyEconomicFinancialDataSectionProps {
    company: CompanyForm;
    canEdit?: boolean;
    context: React.Context<any>,
    completenessPercentage?: CompanyFileCompletenessView
}


const CompanyEconomicFinancialDataSection = ({company, canEdit, context, completenessPercentage} : CompanyEconomicFinancialDataSectionProps) => {
    const methods = useFormContext();
    const [expanded, setExpanded] = useState<boolean>(false);
    const [childrenExpanded, setChildrenExpanded] = useState<boolean>(false);
    const [openChangeDate, setOpenChangeDate] = useState<boolean>(false)
    const [highlightButton, setHighlightButton] = useState<boolean>(false);
    const {editing, setEditing} = useContext(context)
    const {reloadData} = useContext(CompanyFileContext)
    const { watch } = useFormContext();
    const declarationOfAssets = watch(CompanyFileEditFormFields.DeclarationOfAssets)
    const flows = watch(CompanyFileEditFormFields.Flow)

    const isMobileScreenSize = useMediaQuery((theme: Theme) => theme.breakpoints.down('sm'));
    const isPhysicalPerson: boolean = !!methods.watch(`${CompanyFileEditFormFields.IsPhyisicalPerson}`);

    useEffect(() => {
        if (!declarationOfAssets && !editing) {
            const interval = setInterval(() => {
                setHighlightButton(prev => !prev);
            }, 3500);
            
            return () => clearInterval(interval);
        } else {
            setHighlightButton(false);
        }
    }, [declarationOfAssets, editing]);

    const onClickEdit = (e: any) => {
        setEditing(true);
        setExpanded(true);
        setChildrenExpanded(true);
        e.stopPropagation();
    }
    
    const onClickEditFinanceDate = (e: any) => {
        setOpenChangeDate(true)
        e.stopPropagation()
    }

    const EditButton = canEdit && !editing && ( <Button onClick={onClickEdit} variant={'outlined'} color={'secondary'} size='small'>Editar</Button> );
    const ExpansionButton = (
        <Box onClick={() => setExpanded(!expanded)} sx={{ cursor: 'pointer'}}>
            <BaseIconWrapper Icon={expanded ? CaretUp : CaretDown} size={'md'} bg={'#F7FAFC'} />
        </Box>
    );
    
    return (
         <Stack sx={{ padding: '24px', borderRadius: '32px', backgroundColor: 'white', width: '100%', boxSizing: 'border-box' }}>
            <Accordion sx={{ backgroundColor: 'white !important', width: '100%' }} expanded={expanded}>
                <Stack width={1} spacing={2} sx={{ width: '100%', boxSizing: 'border-box' }}>
                    <Stack direction='row' justifyContent='space-between' sx={{ width: '100%' }} onClick={() => setExpanded(!expanded)}>
                        <Stack direction='row' spacing={2} sx={{ maxWidth:'65%' }}>
                            <BaseIconWrapper Icon={PresentationChart} size={'md'} bg={'#F7FAFC'} />
                            <Stack spacing={1}>
                                <Typography variant={'h4'} fontWeight={500}>Información económica financiera</Typography>
                                {
                                    isPhysicalPerson ?
                                        <>
                                            <Typography variant={'caption'} color={'#818992'}>
                                                {`Fecha de cierre: ${company[CompanyViewDTOFields.DayClosing]}/${company[CompanyViewDTOFields.MonthClosing]}`}
                                            </Typography>
                                            <Stack spacing={1} direction={'row'} alignItems={'center'}>
                                                <Typography variant={'caption'} color={'#818992'}>
                                                    {`Última manifestación de bienes: ${dateFormatter.toShortDate(declarationOfAssets?.[CompanyDeclarationOfAssetsFields.Date]) || '-'}`}
                                                </Typography>
                                                    {!editing && canEdit &&
                                                       <Box 
                                                            sx={{
                                                                position: "relative",
                                                                "&::before": {
                                                                    content: '""',
                                                                    position: "absolute",
                                                                    top: -1,
                                                                    left: -1,
                                                                    right: -1,
                                                                    bottom: -1,
                                                                    borderRadius: (theme) => theme.shape.borderRadius,
                                                                    boxShadow: highlightButton ? "0px 0px 2px 0.5px rgba(144, 238, 144, 0.4)" : "none",
                                                                    border: highlightButton ? "0.5px solid lightgreen" : "none",
                                                                    transition: "box-shadow 0.5s ease-in-out, border 0.5s ease-in-out",
                                                                    pointerEvents: "none",
                                                                    zIndex: 1
                                                                },
                                                            }}
                                                        >
                                                            <ButtonXs onClick={onClickEditFinanceDate}>
                                                                Cambiar
                                                            </ButtonXs>
                                                        </Box>
                                                    }
                                            </Stack>
                                        </>
                                        :
                                        <>
                                            <Typography variant={'caption'} color={'#818992'}>
                                                {`Fecha de cierre: ${company[CompanyViewDTOFields.DayClosing]}/${company[CompanyViewDTOFields.MonthClosing]}`}
                                            </Typography>
                                            <Stack spacing={1} direction='row' alignItems='center'>
                                                <Typography variant={'caption'} color={'#818992'}>
                                                    {`Último balance cerrado: ${company[CompanyViewDTOFields.YearLastClosing] || '-'}`}
                                                </Typography>
                                                {!editing && canEdit &&
                                                    <ButtonXs onClick={onClickEditFinanceDate}>
                                                    Cambiar
                                                    </ButtonXs>
                                                }
                                            </Stack>
                                        </>
                                }

                                {completenessPercentage && canEdit && !editing && (
                                    <CompanyFileWithPercentage percentage={completenessPercentage[CompanyFileCompletenessFields.FinancialInformationCompletenessPercentage]}
                                                               completeHeaderLabel={'La información económica financiera está completa!'}
                                                               incompleteHeaderLabel={'Información económica financiera incompleta'}
                                    />
                                )}
                            </Stack>
                        </Stack>
                        <Stack spacing={2} alignItems={'center'} direction={isMobileScreenSize ? 'column' : 'row'}>
                            {isMobileScreenSize ? 
                                <>
                                    {ExpansionButton}
                                    {EditButton}
                                </>
                            : 
                                <> 
                                    {EditButton}
                                    {ExpansionButton}
                                </>
                            }
                        </Stack>
                    </Stack>
                </Stack>
                    <Stack spacing={3}  sx={{ mt: 1 }}>
                        {
                            isPhysicalPerson ?
                                <CompanyEconomicFinancialDeclarationOfAssets declarationOfAssets={declarationOfAssets} editing={editing} childrenExpanded={childrenExpanded}/> : 
                                <CompanyEconomicFinancialExercises editing={editing} childrenExpanded={childrenExpanded}/>
                        }

                        {!editing &&
                          <EconomicFinancialTableWrapper title={'Totales por año'} expanded={childrenExpanded}>
                              <CompanyFlowYearlyTotals flowList={flows} />
                          </EconomicFinancialTableWrapper>
                        }
                        
                        <EconomicFinancialTableWrapper title={'Movimientos'} expanded={childrenExpanded}>
                            {
                                editing ?
                                    <CompanyFlowTableEditDetail /> : 
                                    <CompanyFlowTableDetail physicalPerson={isPhysicalPerson} flowList={flows} />
                            }
                        </EconomicFinancialTableWrapper>
                    </Stack>
            </Accordion>
            <CompanyEconomicFinancialDateChangeDrawer open={openChangeDate}
                                                      onClose={() => setOpenChangeDate(false)}
                                                      company={company}
                                                      physicalPerson={isPhysicalPerson}
                                                      declarationOfAssets={declarationOfAssets}
                                                      onReload={reloadData}
            />
        </Stack>
    )
}

interface EconomicFinancialTableWrapperProps {
  title: string;
  children?: React.ReactNode;
  expanded?: boolean;
  expandable?: boolean;
}

export const EconomicFinancialTableWrapper = ({ 
  title, 
  children,  
  expanded: expandedFromParent,
  expandable = true
}: EconomicFinancialTableWrapperProps) => {
  const theme = useTheme();
  const isDesktop = useMediaQuery(theme.breakpoints.up('md'));
  const [expanded, setExpanded] = useState(expandedFromParent ?? false);

  useEffect(() => {
    if (expandedFromParent !== undefined) {
      setExpanded(expandedFromParent);
    }
  }, [expandedFromParent]);

  const cannotToggleExpandabilityOnDesktop = !expandable && isDesktop;
  const isExpanded = cannotToggleExpandabilityOnDesktop ? true : expanded;

  return (
    <Box sx={{ 
      border: '1px solid #EDF2F7', 
      borderRadius: '24px', 
      padding: '0px !important', 
      overflow: 'hidden',
      width: '100%'
    }}>
      {title && (
        <Box 
          display="flex" 
          alignItems="center" 
          justifyContent={isDesktop || isExpanded ? "space-between" : "center"} 
          px={3}
          py={2}
          sx={{
            width: '100%',
            position: 'relative',
            cursor: !isDesktop ? 'pointer' : undefined
          }}
          onClick={!isDesktop ? () => setExpanded(!expanded) : undefined}
        >
          <Typography variant="body2" fontWeight={500}>
            {title}
          </Typography>
          
           
          {(!isDesktop) && (
            <Box sx={{ 
              position: !isExpanded ? 'absolute' : 'static',
              right: !isExpanded ? '16px' : 'auto'
            }}>
              <BaseIconWrapper 
                Icon={isExpanded ? CaretUp : CaretDown} 
                size={'md'} 
                bg={'#F7FAFC'} 
              />
            </Box>
          )}
          
          {(isDesktop && expandable && !cannotToggleExpandabilityOnDesktop) && ( // Desktop caret
            <Box onClick={() => setExpanded(!expanded)} sx={{ cursor: 'pointer' }}>
              <BaseIconWrapper 
                  Icon={isExpanded ? CaretUp : CaretDown} 
                  size={'md'} 
                  bg={'#F7FAFC'} 
              />
            </Box>
          )}
        </Box>
      )}
      <Collapse in={isExpanded} timeout="auto" unmountOnExit>
        <Box>{children}</Box>
      </Collapse>
    </Box>
  );
};

interface CompanyEconomicFinancialDataSectionEditProps extends CompanyEconomicFinancialDataSectionProps {
    editing: boolean,
    childrenExpanded?: boolean,
}

interface CompanyEconomicFinancialExercisesProps {
    editing: boolean,
    childrenExpanded?: boolean,
}

const CompanyEconomicFinancialExercises = ({ editing, childrenExpanded } : CompanyEconomicFinancialExercisesProps) => {
    const { watch } = useFormContext();

    const lastPatrimonialStatement = watch(CompanyFileEditFormFields.LastPatrimonialStatement)
    const lastIncomeStatement = watch(CompanyFileEditFormFields.LastIncomeStatement)
    const prevPatrimonialStatement = watch(CompanyFileEditFormFields.PreviousPatrimonialStatement)
    const prevIncomeStatement = watch(CompanyFileEditFormFields.PreviousIncomeStatement)
    
    const lastFinancialDate = lastPatrimonialStatement ? 
        `Ejercicio ${lastPatrimonialStatement[CompanyBasePatrimonialStatementFields.Year]}` : '';

    const prevFinancialDate = prevPatrimonialStatement ?
        `Ejercicio ${prevPatrimonialStatement[CompanyBasePatrimonialStatementFields.Year]}` : '';
    
    const lastFinancialTotals = (lastPatrimonialStatement && lastIncomeStatement) ? 
        [ 
            { 
                ...lastPatrimonialStatement, ...lastIncomeStatement, 
                [CompanyFinancialTotalsFields.Date]: new Date(lastPatrimonialStatement[CompanyBasePatrimonialStatementFields.Year], 1, 1) 
            }, 
            {
                ...lastPatrimonialStatement[CompanyPatrimonialStatementFields.LastPatrimonialStatement],
                ...lastIncomeStatement[CompanyIncomeLastYearStatementFields.LastYearIncomeStatement],
                [CompanyFinancialTotalsFields.Date]: new Date(lastPatrimonialStatement[CompanyPatrimonialStatementFields.LastPatrimonialStatement][CompanyBasePatrimonialStatementFields.Year], 1, 1)
            }
        ] : undefined;

    const prevFinancialTotals = (prevPatrimonialStatement && prevIncomeStatement) ?
        [
            { 
                ...prevPatrimonialStatement, ...prevIncomeStatement,
                [CompanyFinancialTotalsFields.Date]: new Date(prevPatrimonialStatement[CompanyBasePatrimonialStatementFields.Year], 1, 1)
            },
            {
                ...prevPatrimonialStatement[CompanyPatrimonialStatementFields.LastPatrimonialStatement],
                ...prevIncomeStatement[CompanyIncomeLastYearStatementFields.LastYearIncomeStatement],
                [CompanyFinancialTotalsFields.Date]: new Date(prevPatrimonialStatement[CompanyPatrimonialStatementFields.LastPatrimonialStatement][CompanyBasePatrimonialStatementFields.Year], 1, 1)
            }
        ] : undefined;
    
    return (
        (lastFinancialTotals && prevFinancialTotals) ?
            !editing ?
                <Stack spacing={3}>
                    <EconomicFinancialTableWrapper title={lastFinancialDate}>
                        <Stack spacing={2}>
                            <CompanyFinancialPatrimonialYearlyTotals totals={lastFinancialTotals} />
                            <CompanyFinancialResultYearlyTotals totals={lastFinancialTotals} />
                        </Stack>
                    </EconomicFinancialTableWrapper>
                    <EconomicFinancialTableWrapper title={prevFinancialDate}>
                        <Stack spacing={2}>
                            <CompanyFinancialPatrimonialYearlyTotals totals={prevFinancialTotals} />
                            <CompanyFinancialResultYearlyTotals totals={prevFinancialTotals} />
                        </Stack>
                    </EconomicFinancialTableWrapper>
                </Stack>
            :
                <Stack spacing={3}>
                    <EconomicFinancialTableWrapper title={lastFinancialDate} expanded={childrenExpanded}>
                        <Stack spacing={2}>
                            <FinancialPatrimonialYearlyEditTotals totals={lastFinancialTotals}
                                                                  patrimonialNameBase={`${CompanyFileEditFormFields.LastPatrimonialStatement}`}
                            />
                            <FinancialResultYearlyEditTotals totals={lastFinancialTotals}
                                                             incomeNameBase={`${CompanyFileEditFormFields.LastIncomeStatement}`}/>
                        </Stack>
                    </EconomicFinancialTableWrapper>
                    <EconomicFinancialTableWrapper title={prevFinancialDate} expanded={childrenExpanded}>
                        <Stack spacing={2}>
                            <FinancialPatrimonialYearlyEditTotals totals={prevFinancialTotals}
                                                                  patrimonialNameBase={`${CompanyFileEditFormFields.PreviousPatrimonialStatement}`}/>
                            <FinancialResultYearlyEditTotals totals={prevFinancialTotals}
                                                             incomeNameBase={`${CompanyFileEditFormFields.PreviousIncomeStatement}`}/>
                        </Stack>
                    </EconomicFinancialTableWrapper>
                </Stack> 
            :
            <div></div>
    );
}


interface CompanyEconomicFinancialDeclarationOfAssetsProps {
    declarationOfAssets?: CompanyLastYearDeclarationOfAssets,
    editing: boolean,
    childrenExpanded?: boolean,
}

const isCompleteDeclaration = (mainDeclaration: CompanyLastYearDeclarationOfAssets) => {
    return (
        (mainDeclaration[CompanyDeclarationOfAssetsFields.ActiveTotal] !==
            0 ||
            mainDeclaration[CompanyDeclarationOfAssetsFields.PassiveTotal] !==
            0) &&
        mainDeclaration[CompanyDeclarationOfAssetsFields.ActiveTotal] ===
        mainDeclaration[
            CompanyDeclarationOfAssetsFields.NetPatrimonyTotal
            ] +
        mainDeclaration[CompanyDeclarationOfAssetsFields.PassiveTotal]
    );
};

const CompanyEconomicFinancialDeclarationOfAssets = ({declarationOfAssets, editing, childrenExpanded} : CompanyEconomicFinancialDeclarationOfAssetsProps) => {
    const hasDeclarationOfAssets = declarationOfAssets && declarationOfAssets[EntityWithIdFields.Id]
    const completeDeclaration = !!declarationOfAssets && isCompleteDeclaration(declarationOfAssets);

    // @ts-ignore
    const declarationOfAssetsTotals : CompanyDeclarationOfAssetsTotals[] = declarationOfAssets ? [
        { ...declarationOfAssets },
        { ...declarationOfAssets[CompanyLastYearDeclarationOfAssetsFields.LastDeclarationOfAssets] }
    ] : [];
    
    return (
        <Stack>
            {
                (hasDeclarationOfAssets && !completeDeclaration && !editing) &&
                    <Stack spacing={2}>
                        <Typography variant={'body2'} fontWeight={500} ml={2} mt={2}>
                            Manifestación de bienes
                        </Typography>
                        <Alert severity={'warning'}>
                            Para que el legajo se considere completo, el Valor Mercado del
                            Estado de Situación Patrimonial no puede tener todos los valores
                            en 0 (cero).
                        </Alert>
                    </Stack>
            }
            
            {
                hasDeclarationOfAssets ?
                    editing ?
                        <EconomicFinancialTableWrapper title={`Manifestación de bienes ${dateFormatter.toShortDate(declarationOfAssets?.[CompanyDeclarationOfAssetsTotalsFields.Date])}`} expanded={childrenExpanded}>
                            <CompanyFinancialDeclarationOfAssetsEditTotals totals={declarationOfAssetsTotals} nameBase={`${CompanyFileEditFormFields.DeclarationOfAssets}`}/>
                        </EconomicFinancialTableWrapper>
                    :
                        <EconomicFinancialTableWrapper title={`Manifestación de bienes ${dateFormatter.toShortDate(declarationOfAssets?.[CompanyDeclarationOfAssetsTotalsFields.Date])}`}>
                            <CompanyFinancialDeclarationOfAssetsTotals totals={declarationOfAssetsTotals} nameBase={`${CompanyFileEditFormFields.DeclarationOfAssets}`}/>
                        </EconomicFinancialTableWrapper>
                :
                
                    <Stack spacing={0} mt={2}>
                        <Typography variant={'body2'} fontWeight={500} ml={2} mt={2}>
                            Manifestación de bienes
                        </Typography>
                        <Alert severity={'warning'}>
                            Para que el legajo se considere completo, 
                            debe cargar el año de la última manifestación de bienes.
                        </Alert>
                    </Stack>
            }
        </Stack>
    )
}

export default CompanyEconomicFinancialDataSection