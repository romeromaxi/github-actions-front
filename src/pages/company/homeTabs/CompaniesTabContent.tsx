import React, {useEffect, useMemo, useState} from "react";
import {Alert, AlertTitle, Card, CardContent, Grid, Link, Stack, Typography} from "@mui/material";
import {BaseIconWrapper} from "../../../components/icons/Icons";
import {BuildingOffice} from "@phosphor-icons/react";
import {AddButton} from "../../../components/buttons/Buttons";
import ValidateIdentityHandle from "../../user/components/ValidateIdentityHandle";
import CardBaseLoading from "../../../components/cards/CardBaseLoading";
import {EnumColors} from "../../../types/general/generalEnums";
import {CompanyViewDTO, CompanyViewDTOFields} from "../../../types/company/companyData";
import CompanyCardButton from "../components/CompanyCardButton";
import {CompanyUserState} from "../../../types/company/companyEnums";
import NewCompanyBaseDrawer from "../components/new/NewCompanyBaseDrawer";
import {NewCompanyContext} from "../components/MyCompaniesList";
import CardItemsNotFound from "../../../components/cards/CardItemsNotFound";
import {useNavigate} from "react-router-dom";
import {useUser} from "../../../hooks/contexts/UserContext";
import {DialogAlert} from "../../../components/dialog";
import {HttpCompany, HttpPersonNosis} from "../../../http";
import {useLoaderActions} from "../../../hooks/useLoaderActions";
import {useSnackbarActions} from "../../../hooks/useSnackbarActions";
import {PersonCompanyConsultantResponseDTOFields} from "../../../types/person/personNosisData";
import useAxios from "../../../hooks/useAxios";
import CompanyJoinBox from "../components/companyOption/CompanyJoinBox";
import SelfEmployedBox from "../components/companyOption/SelfEmployedBox";


const sortedCompany = (a: CompanyViewDTO, b: CompanyViewDTO): number => {
    const aIsBlocked =
        a[CompanyViewDTOFields.CompanyUserQueryStateCode] ===
        CompanyUserState.Blocked;
    const bIsBlocked =
        b[CompanyViewDTOFields.CompanyUserQueryStateCode] ===
        CompanyUserState.Blocked;

    if (aIsBlocked && !bIsBlocked) return 1;

    if (!aIsBlocked && bIsBlocked) return -1;

    return a[CompanyViewDTOFields.BusinessName].localeCompare(
        b[CompanyViewDTOFields.BusinessName],
    );
};

interface CompaniesTabContentProps {
    invitationAlert?: boolean;
}

const CompaniesTabContent = ({invitationAlert} : CompaniesTabContentProps) => {
    const [isLoading, setLoading] = useState<boolean>(true);
    const [companies, setCompanies] = useState<CompanyViewDTO[]>();
    const [openDrawerNewCompany, setOpenDrawerNewCompany] = useState<boolean>(false);
    const [personalCompany, setPersonalCompany] = useState<CompanyViewDTO>();
    const [openOwnDialog, setOpenOwnDialog] = useState<boolean>(false);
    
    const navigate = useNavigate();
    const { user } = useUser();
    const {showLoader, hideLoader} = useLoaderActions();
    const { addSnackbarSuccess } = useSnackbarActions();
    const { fetchData } = useAxios();
    
    const onCloseNewRepo = () => setOpenDrawerNewCompany(false);

    const hasAnyCompanyData = useMemo(() => {
        return !!companies && companies.length > 0;
    }, [companies]);

    const hasPersonalCompany = useMemo(() => 
        !!companies && companies.some((c) => c[CompanyViewDTOFields.IsUserCompany])
    , [companies]);
    
    const shouldShowSelfEmployedBox = useMemo(() => {
        if (!companies || !user) return false;
        return !hasPersonalCompany && user.hasTaxActivity;
    }, [companies, hasPersonalCompany, user]);

    const shouldShowJoinBox = useMemo(() => {
        if (!companies) return false;
        return !hasAnyCompanyData;
    }, [companies, hasAnyCompanyData]);

    const loadCompanies = async () => {
        setLoading(true);
        try {
            const { HttpCompany } = await import("../../../http/company/httpCompany");
            const response = await HttpCompany.getCompaniesByUser();
            setCompanies(response);
            setPersonalCompany(response.find((c) => c[CompanyViewDTOFields.IsUserCompany]));
        } catch (error) {
            console.error("Error loading companies:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleOpenCreateOwn = () => {
        setOpenOwnDialog(true);
    };

    const handleCloseCreateOwn = () => setOpenOwnDialog(false);
    
    const handleInsertOwnCompany = () => {
        addSnackbarSuccess('Se creó correctamente tu cuenta de autónomo o monotributista');
        handleCloseCreateOwn();
        loadCompanies();
    };

    useEffect(() => {
        loadCompanies();
    }, []);
    const mapLoadings = () =>
        <Stack spacing={2}>
            {Array.from(Array(3).keys()).map((_item, index) => (
                <CardBaseLoading key={index} baseColor={EnumColors.GREY_GRADIENT} />
            ))}
        </Stack>
    
    const mapCompanies = () => {
        return (
            <Stack spacing={2}>
                {invitationAlert && 
                    <Alert severity='info'>
                        <AlertTitle>Tenés invitaciones pendientes</AlertTitle>
                        Dirigite a la solapa 'Invitaciones pendientes' o hace <Link underline={'none'} onClick={() => navigate('/mi-cuenta?tab=invitaciones')}>click acá</Link>
                    </Alert>}
                
                {personalCompany && (
                    <CompanyCardButton
                        company={personalCompany}
                        onReload={loadCompanies}
                    />
                )}

                {companies
                    ?.filter((comp) => !comp[CompanyViewDTOFields.IsUserCompany])
                    .sort(sortedCompany)
                    .map((company) => (
                        <CompanyCardButton key={company[CompanyViewDTOFields.CompanyId]} company={company} onReload={loadCompanies} />
                    ))
                }

                {(shouldShowJoinBox || shouldShowSelfEmployedBox) && (
                    <Grid container spacing={2}>
                        {shouldShowJoinBox && (
                            <Grid item xs={12} md={shouldShowSelfEmployedBox ? 6 : 12}>
                                <ValidateIdentityHandle redirectUrl="/nueva-pyme?redirect=mi-cuenta" onClick={() => setOpenDrawerNewCompany(true)}>
                                    <CompanyJoinBox onClick={() => setOpenDrawerNewCompany(true)} />
                                </ValidateIdentityHandle>
                            </Grid>
                        )}
                        {shouldShowSelfEmployedBox && (
                            <Grid item xs={12} md={shouldShowJoinBox ? 6 : 12}>
                                <ValidateIdentityHandle onClick={loadCompanies}>
                                    <SelfEmployedBox onClick={() => {}} 
                                                     userName={user?.fullName || ''} 
                                                     userCuit={user?.cuit || ''}
                                    />
                                </ValidateIdentityHandle>
                            </Grid>
                        )}
                    </Grid>
                )}

                {companies?.length === 0 && !shouldShowJoinBox && !shouldShowSelfEmployedBox &&
                    <CardItemsNotFound title={'No hay empresas agregadas'}
                                       description={'Agregá una nueva empresa para usar más funciones de LUC'}
                    />
                }
            </Stack>
        );
    };
    
    return (
        <Stack spacing={2} sx={{mb: 2}}>
           <Card>
                <CardContent>
                    <Stack 
                        direction={{ xs: "column", sm: "row" }} 
                        spacing={2} 
                        alignItems={{ xs: "center", sm: "center" }}
                        justifyContent="space-between"
                    >
                        <Stack 
                            direction="row" 
                            alignItems="center" 
                            spacing={2} 
                            sx={{ width: "100%", justifyContent: { xs: "center", sm: "flex-start" } }}
                        >
                            <BaseIconWrapper Icon={BuildingOffice} size={'md'} bg={'#F7FAFC'} />
                            <Typography variant={'h4'} fontWeight={500}>Empresas vinculadas</Typography>
                        </Stack>

                        <ValidateIdentityHandle onClick={() => setOpenDrawerNewCompany(true)}>
                            <AddButton 
                                size="small" 
                                data-cy="user-companies-new-company-button"
                                sx={{ width: { xs: "100%", sm: 'auto' }, minWidth: '200px' }}
                                id={"company-new-btn"}
                            >
                                Nueva empresa
                            </AddButton>
                        </ValidateIdentityHandle>
                    </Stack>
                </CardContent>
            </Card>
            <Card>
                <CardContent>
                    {isLoading ? mapLoadings() : mapCompanies()}
                </CardContent>
            </Card>
            <NewCompanyContext.Provider value={{ onCloseDrawer: onCloseNewRepo }}>
                <NewCompanyBaseDrawer open={openDrawerNewCompany}
                                      onReload={loadCompanies}
                                      onClose={() => {
                                          setOpenDrawerNewCompany(false)
                                      }}
                                      onSubmit={() => {
                                          setOpenDrawerNewCompany(false);
                                          loadCompanies();
                                      }}
                />
            </NewCompanyContext.Provider>
            
            <DialogAlert onClose={handleCloseCreateOwn}
                         open={openOwnDialog}
                         onConfirm={handleInsertOwnCompany}
                         title={'Vincularme como autónomo o monotributista'}
                         textContent={'¿Estás seguro que querés vincularte como autónomo o monotributista?'}
                         validateIdentity
                         validationRedirectUrl={'/mi-cuenta'}
                         waitValidationProcessing
            />
            {/*companies && <UserSuggestedProductLines />*/}
        </Stack>    
    )
}


export default CompaniesTabContent