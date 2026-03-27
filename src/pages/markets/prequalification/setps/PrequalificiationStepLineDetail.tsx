import React, { useContext, useEffect, useState } from 'react';
import { PrequalificationStepperContext } from '../PrequalificationStepper';
import { useNavigate } from 'react-router-dom';
import {
    SolicitationReadyToSendFilter, SolicitationReadyToSendFilterFields,
    SolicitationViewDTO,
    SolicitationViewDTOFields,
} from 'types/solicitations/solicitationData';
import {HttpProductLine, HttpSolicitation} from 'http/index';
import {DialogAlert} from 'components/dialog';
import useAxios from 'hooks/useAxios';
import {useSnackbarActions} from 'hooks/useSnackbarActions';
import {Box, Checkbox, Collapse, Divider, Grid, Link, Stack, Typography} from '@mui/material';
import {
    ProductLineFields, 
    ProductLineViewDetail,
    ProductLineRequisiteValidation,
    ProductLineRequisiteValidationFields,
    ProductLineRequisiteValidationRequest,
    ProductLineRequisiteValidationRequestFields,
} from 'types/lines/productLineData';
import ProductLineDetailCardComponent from "../../lines/components/ProductLineDetailCardComponent";
import ProductLineSummaryComponentLoading from "../../lines/components/ProductLineSummaryComponentLoading";
import {OffererLogoWithName} from "../../../offerer/components/OffererLogo";
import {Skeleton} from "@mui/lab";
import {
    MarketSolicitationFields,
    marketSolicitationStorage
} from "../../../../util/sessionStorage/marketSolicitationStorage";
import {EntityWithIdFields} from "../../../../types/baseEntities";
import {TypographyBase} from "../../../../components/misc/TypographyBase";
// @ts-ignore
import { ReactComponent as WithoutSolicitationImg } from "assets/svgs/checkout-without-solicitations.svg";
import {ChevronDownIcon, ChevronUpIcon, AlertTriangle} from "lucide-react";

interface PrequalificiationStepLineDetailProps {
  startDisplayMessage?: boolean,
  allowModifyMessage?: boolean
}

export function PrequalificiationStepLineDetail({ startDisplayMessage, allowModifyMessage }: PrequalificiationStepLineDetailProps) {
  const { solicitationIdList, companyId, setDisableNext } = useContext(PrequalificationStepperContext);
  
  const [selectedSolicitationIds, setSelectedSolicitationIds] = useState<number[]>(
    solicitationIdList.filter(id => id !== null && id !== undefined)
  );
  const [allSolicitations, setAllSolicitations] = useState<SolicitationViewDTO[]>([]);
  const [restrictionsValidation, setRestrictionsValidation] = useState<ProductLineRequisiteValidation[]>([]);
  const marketSolicitation = marketSolicitationStorage.getCurrentSolicitation()
  const [isExpanded, setIsExpanded] = useState<boolean>(true);
  
  const filter: SolicitationReadyToSendFilter = {
      [SolicitationReadyToSendFilterFields.SolicitationTypeCode]: marketSolicitation[MarketSolicitationFields.SolicitationType],
      [SolicitationReadyToSendFilterFields.CompanyFileCode]: marketSolicitation[MarketSolicitationFields.FileType]
  }
  
    useEffect(() => {
        HttpSolicitation.getSolicitationsReadyToSend(companyId, filter).then((r) => {
            Promise.all(solicitationIdList.map(id => HttpSolicitation.getById(id))).then((initialSolicitations) => {
                const initialIds = new Set(initialSolicitations.map(s => s[EntityWithIdFields.Id]));
                const filteredR = r.filter(s => !initialIds.has(s[EntityWithIdFields.Id]));
                const allSolicitationsData = [...initialSolicitations, ...filteredR];
                setAllSolicitations(allSolicitationsData);
                
                const productLineIds = allSolicitationsData.map(s => s[SolicitationViewDTOFields.ProductLineId]);
                const validationRequest: ProductLineRequisiteValidationRequest = {
                    [ProductLineRequisiteValidationRequestFields.ProductLineIds]: productLineIds,
                    [ProductLineRequisiteValidationRequestFields.CompanyIds]: [companyId],
                    [ProductLineRequisiteValidationRequestFields.CheckAll]: true,
                };
                
                HttpProductLine.validateRestrictions(validationRequest)
                    .then((validations) => {
                        setRestrictionsValidation(validations);
                        
                        const validSelectedIds = solicitationIdList.filter(solicitationId => {
                            const solicitation = allSolicitationsData.find(s => s[EntityWithIdFields.Id] === solicitationId);
                            if (!solicitation) return false;
                            
                            const validation = validations.find(
                                v => v[ProductLineRequisiteValidationFields.CompanyId] === companyId &&
                                     v[ProductLineRequisiteValidationFields.ProductLineId] === solicitation[SolicitationViewDTOFields.ProductLineId]
                            );
                            
                            return !validation || validation[ProductLineRequisiteValidationFields.IsValid];
                        });
                        
                        setSelectedSolicitationIds(validSelectedIds);
                    })
                    .catch((error) => {
                        console.error("Error validating restrictions:", error);
                        setRestrictionsValidation([]);
                    });
            });
        });
    }, []);

    useEffect(() => {
        setDisableNext(selectedSolicitationIds.length === 0);
    }, [selectedSolicitationIds, setDisableNext]);

    const isSolicitationRestrictionValid = (solicitation: SolicitationViewDTO): boolean => {
        const validation = restrictionsValidation.find(
            (v) => v[ProductLineRequisiteValidationFields.CompanyId] === companyId &&
                   v[ProductLineRequisiteValidationFields.ProductLineId] === solicitation[SolicitationViewDTOFields.ProductLineId]
        );
        return validation ? validation[ProductLineRequisiteValidationFields.IsValid] : true;
    };
  
  const toggleSelection = (id: number) => {
    setSelectedSolicitationIds(prev => {
      const newListId =
          prev.includes(id) ?
              prev.filter(selectedId => selectedId !== id)    
              :
              [...prev, id];


        marketSolicitationStorage.setCurrentSolicitation({
            ...marketSolicitation,
            [MarketSolicitationFields.SolicitationIdList]: newListId
        });
        
        return newListId;
    });
  };

  const unselectedSolicitations = allSolicitations.filter(s => !selectedSolicitationIds.includes(s[EntityWithIdFields.Id]));
  
  return (
      <Grid container spacing={2}>
        <Grid item xs={12} md={4}>
          <Stack spacing={3}>
            <Stack spacing={1}>
              {selectedSolicitationIds.map((id) => {
                const sol = allSolicitations.find(s => s[EntityWithIdFields.Id] === id);
                return sol ? (
                  <PrequalificationLinePreview
                    key={`selected_${id}`}
                    solicitation={sol}
                    isSelected={true}
                    onToggleSelect={() => toggleSelection(id)}
                    isRestrictionValid={isSolicitationRestrictionValid(sol)}
                    setSelectedSolicitationIds={setSelectedSolicitationIds}
                    setAllSolicitations={setAllSolicitations}
                  />
                ) : null;
              })}
            </Stack>
            {unselectedSolicitations.length > 0 && (
              <Stack spacing={3}>
                  {
                      selectedSolicitationIds.length > 0 &&
                        <Stack spacing={3}>
                            <Divider />
                            
                            <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{cursor: 'pointer'}} onClick={() => setIsExpanded(!isExpanded)}>
                              <Typography variant={'h6'}>
                                Otras solicitudes listas para enviar
                              </Typography>
                              {isExpanded ? <ChevronUpIcon /> : <ChevronDownIcon />}
                            </Stack>
                        </Stack>  
                  }  
                <Collapse in={isExpanded}>
                  <Stack spacing={1}>
                    {unselectedSolicitations.map((r) => (
                      <PrequalificationLinePreview
                        key={`unselected_${r[EntityWithIdFields.Id]}`}
                        solicitation={r}
                        isSelected={false}
                        onToggleSelect={() => toggleSelection(r[EntityWithIdFields.Id])}
                        isRestrictionValid={isSolicitationRestrictionValid(r)}
                        setSelectedSolicitationIds={setSelectedSolicitationIds}
                        setAllSolicitations={setAllSolicitations}
                      />
                    ))}
                  </Stack>
                </Collapse>
              </Stack>
            )}
          </Stack>
        </Grid>
        <Grid item xs={12} md={8}>
          <Box
            sx={{
              height: '-webkit-fill-available',  
              minHeight: '400px',
              overflowY: 'auto',
              overflowX: 'hidden',
              pr: 1,
              '&::-webkit-scrollbar': {
                width: '8px',
              },
              '&::-webkit-scrollbar-track': {
                background: '#f1f1f1',
                borderRadius: '4px',
              },
              '&::-webkit-scrollbar-thumb': {
                background: '#888',
                borderRadius: '4px',
              },
              '&::-webkit-scrollbar-thumb:hover': {
                background: '#555',
              },
            }}
          >
            <Stack spacing={2} height={'-webkit-fill-available'}>
              {selectedSolicitationIds.map((id, idx) => (
                <PrequalificationLineDetail
                  key={`productLineDetail_${idx}_${id}`}
                  solicitationId={id}
                  allowModifyMessage={allowModifyMessage}
                  startDisplayMessage={startDisplayMessage}
                  setSelectedSolicitationIds={setSelectedSolicitationIds}
                />
              ))}
              {selectedSolicitationIds.length === 0 && (
                <Box
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    height: '-webkit-fill-available',
                  }}
                >
                    <Stack spacing={1}>
                        <Box sx={{width: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center'}}>
                            <WithoutSolicitationImg style={{width: '250px', height: '250px'}}/>
                        </Box>
                        <Stack spacing={1.5}>
                            <TypographyBase color="text.lighter" variant="h4" textAlign="center">
                                No hay solicitudes seleccionadas
                            </TypographyBase>
                            <TypographyBase variant="body2" color="text.lighter" textAlign="center">
                                Seleccioná una solicitud para añadir un mensaje y enviarla a la entidad
                            </TypographyBase>
                        </Stack>
                    </Stack>
                </Box>
              )}
            </Stack>
          </Box>
        </Grid>
      </Grid>
  );
}

interface PrequalificationLinePreviewProps {
  solicitationId?: number;
  isSelected: boolean;
  onToggleSelect: () => void;
  solicitation?: SolicitationViewDTO;
  isRestrictionValid?: boolean;
  setSelectedSolicitationIds?: React.Dispatch<React.SetStateAction<number[]>>;
  setAllSolicitations?: React.Dispatch<React.SetStateAction<SolicitationViewDTO[]>>;
}

export function PrequalificationLinePreview({
  solicitationId,
  isSelected,
  onToggleSelect,
  solicitation: propSolicitation,
  isRestrictionValid = true,
  setSelectedSolicitationIds,
  setAllSolicitations
}: PrequalificationLinePreviewProps) {
  const navigate = useNavigate();
  const { fetchData } = useAxios();
  const { addSnackbarSuccess } = useSnackbarActions();
  
  const [solicitation, setSolicitation] = useState<SolicitationViewDTO | undefined>(propSolicitation);
  const [productLine, setProductLine] = useState<ProductLineViewDetail>();
  const [loading, setLoading] = useState<boolean>(true);
  const [openDiscardDialog, setOpenDiscardDialog] = useState<boolean>(false);

  useEffect(() => {
    if (propSolicitation) {
      HttpProductLine.getByProductLineId(propSolicitation[SolicitationViewDTOFields.ProductLineId]).then((productLine) => {
        setProductLine(productLine);
        setLoading(false);
      });
    } else if (solicitationId) {
      HttpSolicitation.getById(solicitationId).then((solicitation) => {
        setSolicitation(solicitation);
        HttpProductLine.getByProductLineId(solicitation[SolicitationViewDTOFields.ProductLineId]).then((productLine) => {
          setProductLine(productLine);
          setLoading(false);
        });
      });
    }
  }, [solicitationId, propSolicitation]);

  if (loading || !productLine) {
    return (
      <Box
        sx={{
          height: '100px',
          padding: '16px',
          borderRadius: '24px',
          border: '1px solid #EDF2F7',
          backgroundColor: 'white',
          display: 'flex',
          alignItems: 'center',
        }}
      >
        <Skeleton />
      </Box>
    );
  }
  

  const handleDiscardSolicitation = () => {
    if (!solicitation) return;
    
    const solicitationId = solicitation[EntityWithIdFields.Id];
    
    fetchData(
        () => HttpSolicitation.cancelSolicitation(solicitationId),
        true
    ).then(() => {
        addSnackbarSuccess("La solicitud se descartó con éxito");
        setOpenDiscardDialog(false);
        
        if (setAllSolicitations) {
            setAllSolicitations(prev => prev.filter(s => s[EntityWithIdFields.Id] !== solicitationId));
        }
        
        if (setSelectedSolicitationIds) {
            setSelectedSolicitationIds(prev => {
                const newIds = prev.filter(id => id !== solicitationId);
                
                if (newIds.length === 0) {
                    setTimeout(() => navigate(-1), 500);
                }
                
                return newIds;
            });
        }
    }).catch(() => {
    });
  }

  return (
    <Box
      sx={{
        padding: '16px',
        borderRadius: '16px',
        boxShadow: isSelected ? `inset 0 0 0 1px #309D6A` : 'none',
        backgroundColor: 'white',
        cursor: !isRestrictionValid ? 'not-allowed' : 'pointer',
        display: 'flex',
        flexDirection: 'column',
        transition: 'all 0.2s ease-in-out',
        opacity: !isRestrictionValid ? 0.6 : 1,
        '&:hover': {
          borderColor: isSelected ? '#48BB78' : '#CBD5E0',
        }
      }}
    >
        <Stack direction='row' width={'100%'} spacing={1.875}>
            <Checkbox
                disabled={!isRestrictionValid}
                onClick={onToggleSelect}
                checked={isSelected}
            />
          <Stack spacing={1} width={'100%'}>
            <Box
              sx={{
                display: 'flex',
                flexDirection: 'row',
                alignItems: 'flex-start',
                justifyContent: 'space-between',
              }}
            >
              <Box
                sx={{
                  flex: 1,
                  minWidth: 0,
                  maxWidth: '100%',
                  wordWrap: 'break-word',
                  display: 'flex',
                  alignItems: 'flex-start',
                  flexDirection: 'column',
                }}
              >

                  <OffererLogoWithName offererId={productLine[SolicitationViewDTOFields.OffererId]}
                                       offererUrlLogo={productLine[SolicitationViewDTOFields.OffererUrlLogo]}
                                       offererBusinessName={productLine[SolicitationViewDTOFields.OffererBusinessName]}
                                       NameProps={{variant: 'body4', fontWeight: 400, color: 'text.lighter', tooltip: true, maxLines: 1}}
                                       size={'xs'}
                  />
              </Box>
    
              <Box sx={{ alignSelf: 'flex-start' }}>
                <Stack direction="row" alignItems="center" spacing={2}>
                  <TypographyBase variant={'body3'} color="text.lighter" sx={{width: 'fit-content'}}>
                    {productLine[ProductLineFields.ProductServiceDesc]}
                  </TypographyBase>
                </Stack>
              </Box>
            </Box>
    
            <Stack direction="row" alignItems="flex-start" justifyContent="space-between" sx={{ width: '100%' }}>
              <Box 
                onClick={isRestrictionValid ? onToggleSelect : undefined}
                sx={{ flex: 1, minWidth: 0, wordWrap: 'break-word' }}
              >
                <Typography
                  fontFamily={'Poppins'}  
                  fontWeight={600}
                  sx={{
                    cursor: isRestrictionValid ? 'pointer' : 'not-allowed',
                    '&:hover': isRestrictionValid ? { color: 'primary.main' } : {},
                    wordWrap: 'break-word',
                  }}
                >
                  {productLine[ProductLineFields.Line]}
                </Typography>
              </Box>
            </Stack>
              {!isRestrictionValid && (
                  <Stack spacing={0.5}>
                      <Stack direction="row" spacing={0.5} alignItems="flex-start">
                          <AlertTriangle size={15} />
                          <TypographyBase
                              variant={'body5'}
                              maxLines={2}
                          >
                              Este producto no es compatible con el perfil de esta PyME
                          </TypographyBase>
                      </Stack>
                      <Link onClick={() => setOpenDiscardDialog(true)} fontSize={12} sx={{ cursor: 'pointer', color: 'text.lighter' }}>Descartar solicitud</Link>
                  </Stack>
              )}
          </Stack>
        </Stack>
        
        <DialogAlert 
            open={openDiscardDialog}
            onClose={() => setOpenDiscardDialog(false)}
            title='Descartar Solicitud'
            textContent='¿Estás seguro de descartar esta solicitud?'
            onConfirm={handleDiscardSolicitation}
            textConfirm={'Sí, Descartar Solicitud'}
            maxWidth={'sm'}
        />
    </Box>
  );
}

interface PrequalificationLineDetailProps {
  solicitationId: number;
  startDisplayMessage?: boolean,
  allowModifyMessage?: boolean,
  setSelectedSolicitationIds: React.Dispatch<React.SetStateAction<number[]>>;
}

export function PrequalificationLineDetail({
  solicitationId, allowModifyMessage, startDisplayMessage, setSelectedSolicitationIds
}: PrequalificationLineDetailProps) {
  const { solicitationIdList } = useContext(PrequalificationStepperContext);
  const [solicitation, setSolicitation] = useState<SolicitationViewDTO>();
  const [loading, setLoading] = useState<boolean>(false);
  const [selectedLine, setSelectedLine] = useState<ProductLineViewDetail>();

  const initialIds = solicitationIdList.filter(id => id !== null && id !== undefined);
  const isInitial = initialIds.includes(solicitationId);

  const loadData = () => {
    setLoading(true);
    HttpSolicitation.getById(solicitationId).then((solicitation) => {
      setInitialMessage(solicitation[SolicitationViewDTOFields.InitialMessage]);
      setSolicitation(solicitation);
      HttpProductLine.getByProductLineId(
          solicitation[SolicitationViewDTOFields.ProductLineId],
      ).then((productLine) => {
        setSelectedLine({
          ...productLine,
          [ProductLineFields.InitialMessage]: solicitation[SolicitationViewDTOFields.InitialMessage],
          [ProductLineFields.SolicitationId]: solicitationId,
        });
        setLoading(false);
      });
    });
  }  
  
  useEffect(() => {
    loadData()
  }, [solicitationId]);
  

  const setInitialMessage = (message?: string) =>
    setSolicitation({
      ...solicitation,
      [SolicitationViewDTOFields.InitialMessage]: message,
    } as SolicitationViewDTO);

  return (
        <React.Fragment>
          {!loading && selectedLine ?
              <ProductLineDetailCardComponent 
                productLine={selectedLine}
                allowsViewMessage
                allowsModifyMessage={allowModifyMessage}
                startDisplayMessage={startDisplayMessage}
                allowsOpenDetail={isInitial}
                handleDeselectClick={() => setSelectedSolicitationIds(prev => prev.filter(id => id !== solicitationId))}
              />
            :
            <ProductLineSummaryComponentLoading />
          }
        </React.Fragment>
    )
}
