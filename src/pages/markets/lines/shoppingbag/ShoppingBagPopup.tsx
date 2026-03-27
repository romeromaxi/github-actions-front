import React, {Dispatch, SetStateAction, useEffect, useState} from 'react';
import {Button, Dialog, DialogActions, DialogContent, Stack, useMediaQuery, useTheme} from '@mui/material';
import BaseDialogTitle from 'components/dialog/BaseDialogTitle';
import {useNavigate} from 'react-router-dom';
import {
    CompanyLineStatusViewDTO,
    CompanyLineStatusViewDTOFields,
    ProductLineFields,
    ProductLineView,
    ProductLineRequisiteValidation,
    ProductLineRequisiteValidationFields,
    ProductLineRequisiteValidationRequest,
    ProductLineRequisiteValidationRequestFields,
} from 'types/lines/productLineData';
import Box from '@mui/material/Box';
import List from '@mui/material/List';
import {BaseResponse, BaseResponseFields, EntityWithIdFields,} from 'types/baseEntities';
import {CompanyTotalsShoppingCart, CompanyTotalsShoppingCartFields,} from 'types/market/marketData';
import {CompanyTotalsListItem} from './components/CompanyTotalsListItem';
import {Skeleton} from '@mui/lab';
import {CompanyLineStatusListItem} from './components/CompanyLineStatusListItem';
import {NewCompanyContext} from '../../../company/components/MyCompaniesList';
import NewCompanyBaseDrawer from "../../../company/components/new/NewCompanyBaseDrawer";
import MustHaveRelatedCompanyDialog from "./dialogs/MustHaveRelatedCompanyDialog";
import { useShoppingCartActions } from 'hooks/useShoppingCartActions';
import {useLoaderActions} from "../../../../hooks/useLoaderActions";
import {useWishlistActions} from "../../../../hooks/useWishlistActions";
import {OffererLogoWithName} from "../../../offerer/components/OffererLogo";
import {TypographyBase} from "../../../../components/misc/TypographyBase";
import {SendButtonNew} from "../../../../components/buttons/Buttons";
import {SolicitationTypes} from "../../../../types/solicitations/solicitationEnums";
import {CompanyFileType} from "../../../../types/company/companyEnums";
import {
    MarketSolicitationFields,
    marketSolicitationStorage
} from "../../../../util/sessionStorage/marketSolicitationStorage";
import useAxios from "../../../../hooks/useAxios";
import {useSnackbarActions} from "../../../../hooks/useSnackbarActions";
import {HttpProductLine} from "../../../../http/line/httpProductLine";

interface ShoppingBagPopupProps {
    open: boolean;
    setOpen: Dispatch<SetStateAction<boolean>>;
    line?: ProductLineView;
    action?: () => void;
    onAfterAddAction?: (response?: BaseResponse) => void;
    callFromCard: boolean;
    onReloadCompanies: () => void;
}

function ShoppingBagPopup({
                              open,
                              setOpen,
                              line,
                              action,
                              onAfterAddAction,
                              onReloadCompanies,
                              callFromCard,
                          }: ShoppingBagPopupProps) {
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
    const { addLineToCompanies } = useShoppingCartActions();
    const { removeLineFromWishlist } = useWishlistActions();
    const { showLoader, hideLoader } = useLoaderActions();
    const { addSnackbarSuccess } = useSnackbarActions();
    const { fetchData } = useAxios();

    const [showConfirmCreateCompany, setShowConfirmCreateCompany] = useState<boolean>(false);

    const [selectedIndexes, setSelectedIndexes] = useState<number[]>([]);
    const [uniqueIdx, setUniqueIdx] = useState<number>(0)
    const [companiesStatusLine, setCompaniesStatusLine] =
        useState<CompanyLineStatusViewDTO[]>();
    const [companiesTotals, setCompaniesTotals] =
        useState<CompanyTotalsShoppingCart[]>();
    const [openNewCompany, setOpenNewCompany] = useState<boolean>(false);
    const [restrictionsValidation, setRestrictionsValidation] =
        useState<ProductLineRequisiteValidation[]>([]);

    const navigate = useNavigate();
    const title = callFromCard
        ? 'Agregar a Solicitudes'
        : '¿De qué empresa querés ver las líneas que seleccionaste?';

    const onCloseDialog = () => {
        setOpen(false);
        setRestrictionsValidation([]);
    };

    const onCancelCreateCompany = () => {
        onCloseDialog();
        setShowConfirmCreateCompany(false);
    }

    const handleListItemClick = (index: number, checked: boolean | null) => {
        if (checked !== null) {
            let newSelectedIdxs: number[];
            if (checked) {
                newSelectedIdxs = [...selectedIndexes, index];
                setSelectedIndexes(newSelectedIdxs);
            } else {
                newSelectedIdxs = [...selectedIndexes].filter(
                    (id) => id !== index,
                );
                setSelectedIndexes(newSelectedIdxs);
            }
        } else {
            setUniqueIdx(index)
        }
    };
    
    const isCompanyRestrictionValid = (companyId: number): boolean => {
        const validation = restrictionsValidation.find(
            (v) => v[ProductLineRequisiteValidationFields.CompanyId] === companyId
        );
        return validation ? validation[ProductLineRequisiteValidationFields.IsValid] : true;
    };
    
    const handleSendNow = () => {
        if (line) {
            fetchData(
                () => addLineToCompanies(line[EntityWithIdFields.Id], selectedIndexes),
                false
            ).then((r) => {
                const solicitationType = line[ProductLineFields.SolicitationTypeCode] ?? SolicitationTypes.None;
                const fileType = line[ProductLineFields.FileTypeCode] ?? CompanyFileType.Long;
        
                marketSolicitationStorage.setCurrentSolicitation({
                    [MarketSolicitationFields.CompanyId]: selectedIndexes[0],
                    [MarketSolicitationFields.SolicitationIdList]: r,
                    [MarketSolicitationFields.SolicitationType]: solicitationType,
                    [MarketSolicitationFields.FileType]: fileType,
                });
                
                navigate(`/market/lines/${selectedIndexes[0]}/prequalification`);
                addSnackbarSuccess('La línea fue agregada correctamente a tu selección y ya podés enviar la solicitud.');
            })
        }
    }

    const handleOnClick = () => {
        callFromCard ? handleOnAdd() : handleOnFilter();
    };

    const deleteFromWishlist = (line: ProductLineView | undefined) => {
        if (line) {
            removeLineFromWishlist(
                line[ProductLineFields.Id],
                () => {
                    action && action();
                    onAfterAddAction && onAfterAddAction();
                    onCloseDialog();
                }
            )
        } else {
            onAfterAddAction && onAfterAddAction();
        }
    };

    const handleOnAdd = async () => {
        if (line && companiesStatusLine) {
            showLoader();
            try {
                const response: BaseResponse | undefined = await addLineToCompanies(
                    line[ProductLineFields.Id],
                    selectedIndexes,
                );

                if (response && !response[BaseResponseFields.HasError]) {
                    deleteFromWishlist(line);
                    onAfterAddAction && onAfterAddAction(response);
                }
            } catch (err) {
                console.error('Error adding line to companies:', err);
            } finally {
                hideLoader();
            }
        }
    };

    const handleOnFilter = () => {
        if (line)
            navigateToShoppingCartDetail(
                companiesStatusLine?.[uniqueIdx][EntityWithIdFields.Id],
            );
        else
            navigateToShoppingCartDetail(
                companiesTotals?.[uniqueIdx][EntityWithIdFields.Id],
            );
    };

    const navigateToShoppingCartDetail = (companyId: number | undefined) => {
        if (companyId) {
            navigate(`/market/lines/carrito/${companyId}`);
            onCloseDialog();
        }
    };

    const loadCompaniesStatusLine = async (lineId: number) => {
        setCompaniesStatusLine(undefined);

        try {
            const { HttpMarketShoppingCart } = await import('../../../../http/market/httpMarketShoppingCart');

            const response = await HttpMarketShoppingCart.getAvailabilityList(lineId);

            if (!response || !response.length) {
                setShowConfirmCreateCompany(true);
                return;
            }

            setCompaniesStatusLine(response);
            
            const companyIds = response.map(company => company[EntityWithIdFields.Id]);
            const validationRequest: ProductLineRequisiteValidationRequest = {
                [ProductLineRequisiteValidationRequestFields.ProductLineIds]: [lineId],
                [ProductLineRequisiteValidationRequestFields.CompanyIds]: companyIds,
                [ProductLineRequisiteValidationRequestFields.CheckAll]: false,
            };
            
            try {
                const validations = await HttpProductLine.validateRestrictions(validationRequest);
                setRestrictionsValidation(validations);
            } catch (validationError) {
                console.error("Error validating restrictions:", validationError);
                setRestrictionsValidation([]);
            }
            
            !callFromCard && setUniqueIdx(
                response.findIndex(
                    (x) =>
                        !x[CompanyLineStatusViewDTOFields.InShoppingCart] &&
                        !x[CompanyLineStatusViewDTOFields.SolicitationInProgress] &&
                        x[CompanyLineStatusViewDTOFields.HasPermissions],
                ),
            );
            
            if (callFromCard && line && line[ProductLineFields.RecommendationCompanyId]) {
                const recommendedCompanyId = line[ProductLineFields.RecommendationCompanyId];
                const recommendedCompany = response.find((company) => company[EntityWithIdFields.Id] === recommendedCompanyId);
                
                if (recommendedCompany && 
                    recommendedCompany[CompanyLineStatusViewDTOFields.HasPermissions] &&
                    !recommendedCompany[CompanyLineStatusViewDTOFields.SolicitationInProgress] &&
                    !recommendedCompany[CompanyLineStatusViewDTOFields.InShoppingCart]) {
                    setSelectedIndexes([recommendedCompanyId]);
                }
            }
        } catch (error) {
            console.error("Error loading companies status line:", error);
        } finally {
            setOpenNewCompany(false);
        }
    };

    const loadCompaniesTotals = async () => {
        setCompaniesTotals(undefined);

        const { HttpMarketShoppingCart } = await import('../../../../http/market/httpMarketShoppingCart');
        const response = await HttpMarketShoppingCart.getCompanyTotalsByUser();

        if (!response || !response.length) {
            setShowConfirmCreateCompany(true);
            return
        }

        if (response.length === 1) {
            navigateToShoppingCartDetail(response[0][EntityWithIdFields.Id])
            return;
        }

        setCompaniesTotals(response);
        !callFromCard && setUniqueIdx(
            response.findIndex(
                (x) => x[CompanyTotalsShoppingCartFields.HasPermissions],
            ),
        );

        setOpenNewCompany(false);
    }

    useEffect(() => {
        if (open) {
            setSelectedIndexes([]);
            setUniqueIdx(0);

            if (line)
                loadCompaniesStatusLine(line[EntityWithIdFields.Id])
            else
                loadCompaniesTotals();
        }
    }, [line, open]);

    return (
        <React.Fragment>
            <Dialog
                open={open && !showConfirmCreateCompany}
                maxWidth={'sm'}
                fullWidth
                onClose={onCloseDialog}
                PaperProps={{
                    elevation: 0,
                    sx: {
                        padding: '32px',
                        m: isMobile ? 0 : 2,
                        width: isMobile ? '100vw' : undefined,
                        height: isMobile ? '100vh' : undefined,
                        maxHeight: isMobile ? '100vh' : undefined,
                        maxWidth: isMobile ? '100vw' : undefined,
                        borderRadius: isMobile ? '0 !important' : undefined,
                    }
                }}
                sx={{
                    ...(isMobile ? {
                        '& .MuiDialog-paper': {
                            borderRadius: '0 !important'
                        },
                        '& .MuiDialog-paperScrollPaper': {
                            borderRadius: '0 !important'
                        },
                        '& .MuiDialog-container': {
                            '& .MuiPaper-root': {
                                borderRadius: '0 !important'
                            }
                        }
                    } : {})
                }}

                slotProps={{
                    backdrop: {
                        sx: {
                            backgroundColor: isMobile ? 'white' : undefined
                        }
                    }
                }}
            >
                <BaseDialogTitle onClose={onCloseDialog} title={title} />
                <DialogContent sx={{ paddingX: '4px !important' }}>
                    {
                        callFromCard &&
                        <Stack direction={'column'}
                               justifyContent={'center'}
                               alignItems={'center'}
                               spacing={1.5}
                               sx={{width: '100%'}}
                        >
                            <Stack spacing={1.25} sx={{padding: '16px', border: '1px solid #EDF2F7',
                                borderRadius: '24px', width: '100%', overflow: 'hidden !important'}}
                            >
                                <Stack direction={'row'} alignItems={'center'} justifyContent={'space-between'}>
                                    <OffererLogoWithName offererId={line?.[ProductLineFields.OffererId]}
                                                         offererBusinessName={line?.[ProductLineFields.OffererBusinessName]}
                                                         size="sm"
                                                         NameProps={{color: 'text.main', fontWeight: 400, maxLines: 1, tooltip: true }}
                                    />
                                    
                                    <Stack direction='row' alignItems='center' spacing={2}>
                                        <TypographyBase color="text.lighter" variant="body4" fontWeight={400}
                                                        textAlign={'end'}
                                                        sx={{ textWrapStyle: 'balance' }}>
                                            {line?.[ProductLineFields.ProductServiceDesc]}
                                        </TypographyBase>
                                    </Stack>
                                </Stack>

                                <TypographyBase variant={'h5'} maxLines={1} tooltip>
                                  {line?.[ProductLineFields.Line]}
                                </TypographyBase>
                                
                                <TypographyBase variant="body3"
                                                color={'text.lighter'}
                                                maxLines={3}
                                                tooltip
                                >
                                    {line?.[ProductLineFields.LineLarge]}
                                </TypographyBase>
                            </Stack>
                        </Stack>
                    }
                    <Box sx={{ width: '100%', bgcolor: 'background.paper', marginTop: callFromCard ? 2 : 0 }}>
                        <List component="nav" aria-label="secondary mailbox folder" sx={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                            {!companiesStatusLine && !companiesTotals && <Skeleton />}

                            {companiesStatusLine?.map((companyStatus, idx) => (
                                <CompanyLineStatusListItem
                                    companyLineStatus={companyStatus}
                                    selected={callFromCard ? selectedIndexes.some((i) => i === companyStatus[EntityWithIdFields.Id]) : uniqueIdx === idx}
                                    onClick={(selected) => handleListItemClick(callFromCard ? companyStatus[EntityWithIdFields.Id] : idx, selected)}
                                    key={`companyLineStatusListItem_${idx}`}
                                    multiple={callFromCard}
                                    isRestrictionValid={isCompanyRestrictionValid(companyStatus[EntityWithIdFields.Id])}
                                />
                            ))}

                            {companiesTotals?.map((companyTotal, idx) => (
                                <CompanyTotalsListItem
                                    companyTotal={companyTotal}
                                    selected={callFromCard ? selectedIndexes.some((i) => i === companyTotal[EntityWithIdFields.Id]) : uniqueIdx === idx}
                                    onClick={(selected) => handleListItemClick(callFromCard ? companyTotal[EntityWithIdFields.Id] : idx, selected)}
                                    key={`companyTotalsListItem_${idx}`}
                                    multiple={callFromCard}
                                />
                            ))}
                        </List>
                        {
                            /*
                                <BoxListNewEntity
                                    title={'Nueva Empresa'}
                                    onClickNew={() => {
                                        setOpenNewCompany(true);
                                        onCloseDialog()
                                    }}
                                />
                             */
                        }
                    </Box>
                </DialogContent>
                <DialogActions>
                    <Stack direction="row" alignItems={'center'} spacing={2} width={1} mt={2}>
                        <Button variant={!(selectedIndexes.length == 0 || selectedIndexes.length > 1) && callFromCard  ? 'outlined' : 'contained'}
                                color={!(selectedIndexes.length == 0 || selectedIndexes.length > 1) && callFromCard ? 'secondary' : 'primary'}
                                onClick={handleOnClick}
                                fullWidth
                                sx={{ marginTop: '4px'}}
                                disabled={callFromCard && selectedIndexes.length == 0}
                        >
                            {callFromCard ? 'Agregar a Solicitudes' : 'Continuar'}
                        </Button>
                        {
                            !(selectedIndexes.length == 0 || selectedIndexes.length > 1) && callFromCard &&
                            <SendButtonNew variant="contained"
                                           color={'primary'}
                                           fullWidth
                                           disabled={callFromCard && (selectedIndexes.length == 0 || selectedIndexes.length > 1)}
                                           onClick={handleSendNow}
                            >
                                Enviar Ahora
                            </SendButtonNew>
                        }
                    </Stack>
                </DialogActions>
            </Dialog>

            <MustHaveRelatedCompanyDialog
                open={open && showConfirmCreateCompany}
                onClose={onCancelCreateCompany}
            />

            <NewCompanyContext.Provider
                value={{ onCloseDrawer: () => setOpenNewCompany(false) }}
            >
                <NewCompanyBaseDrawer open={openNewCompany}
                                      onClose={() => setOpenNewCompany(false)}
                                      onSubmit={() => {
                                          setOpenNewCompany(false);
                                          onReloadCompanies();
                                          setOpen(true);
                                      }}
                                      onReload={onReloadCompanies}
                />
            </NewCompanyContext.Provider>
        </React.Fragment>
    );
}

export default ShoppingBagPopup;
