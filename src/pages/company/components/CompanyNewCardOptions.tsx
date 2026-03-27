import {Grid} from "@mui/material";
import ValidateIdentityHandle from "../../user/components/ValidateIdentityHandle";
import React, {Fragment, useMemo, useState} from "react";
import {useUser} from "../../../hooks/contexts/UserContext";
import {CompanyViewDTO, CompanyViewDTOFields} from "../../../types/company/companyData";
import {DialogAlert} from "../../../components/dialog";
import {HttpCompany, HttpPersonNosis} from "../../../http";
import {useLoaderActions} from "../../../hooks/useLoaderActions";
import {useSnackbarActions} from "../../../hooks/useSnackbarActions";
import {PersonCompanyConsultantResponseDTOFields} from "../../../types/person/personNosisData";
import useAxios from "../../../hooks/useAxios";
import {CompanyJoinExistingOptionCard, CompanySelfEmplyedOptionCard} from "./cardButton/CompanyTypeOptionCard";
import SelfEmployedBox from "./companyOption/SelfEmployedBox";
import CompanyJoinBox from "./companyOption/CompanyJoinBox";


interface CompanyNewCardOptionsProps {
    companies?: CompanyViewDTO[];
    hasAnyCompanyData: boolean;
    onReload?: () => void;
    onClickJoin: () => void;
    redirectUrl?: string;
    onValidationRedirectUrl?: string;
}

const CompanyNewCardOptions = ({
    companies,
    hasAnyCompanyData,
    onReload,
    onClickJoin,
    redirectUrl = '/nueva-pyme?redirect=mi-cuenta',
    onValidationRedirectUrl = '/mi-cuenta'
}: CompanyNewCardOptionsProps) => {
    const { user } = useUser();
    const { addSnackbarSuccess } = useSnackbarActions();
    const [openOwn, setOpenOwn] = useState<boolean>(false);
    
    const hasPersonalCompany = useMemo(() => 
        !!companies &&
        companies.some((c) => c[CompanyViewDTOFields.IsUserCompany])
    , [companies]);
    
    const allowRegisteredAsSelfEmployed = useMemo(() => {
        if (!companies) return false;
        
        return !hasPersonalCompany && user && user.hasTaxActivity;
    }, [companies, hasPersonalCompany, user]);
    
    const handleOpenCreateOwn = () => {
        setOpenOwn(true);
    }

    const handleCloseCreateOwn = () => setOpenOwn(false);
    
    const handleInsertOwnCompany = () => {
        const cuit = user?.cuit;
        if (!cuit) return;

        addSnackbarSuccess('Se creó correctamente tu cuenta de autónomo o monotributista');
        handleCloseCreateOwn();
        if (onReload) {
            onReload();
        }
    }
    
    return (
        <Fragment>
            {
                allowRegisteredAsSelfEmployed &&
                <Grid item xs={12} sm={6} md={4} lg={3} sx={{paddingX: 0}}>
                    <ValidateIdentityHandle onClick={() => {}}
                                            waitBackgroundProcessing
                    >
                        <SelfEmployedBox onClick={() => {}} 
                                         userName={user?.fullName || ''} 
                                         userCuit={user?.cuit || ''}
                        />
                    </ValidateIdentityHandle>
                </Grid>
            }

            {
                !hasAnyCompanyData &&
                <Grid item xs={12} sm={6} md={4} lg={3}>
                    <ValidateIdentityHandle redirectUrl={redirectUrl} onClick={onClickJoin}>
                        <CompanyJoinBox onClick={onClickJoin} />
                    </ValidateIdentityHandle>
                </Grid>
            }
            
            <DialogAlert onClose={handleCloseCreateOwn}
                         open={openOwn}
                         onConfirm={handleInsertOwnCompany}
                         title={'Vincularme como autónomo o monotributista'}
                         textContent={'¿Estás seguro que querés vincularte como autónomo o monotributista?'}
                         validateIdentity
                         validationRedirectUrl={onValidationRedirectUrl}
                         waitValidationProcessing
            />
        </Fragment>
    )
}

export default CompanyNewCardOptions;


export const CompanyNewCardOptionsMarket = ({
                                                companies,
                                                hasAnyCompanyData,
                                                onReload,
                                                onClickJoin,
                                                redirectUrl = '/nueva-pyme?redirect=mi-cuenta',
                                                onValidationRedirectUrl = '/mi-cuenta'
                                            }: CompanyNewCardOptionsProps) => {
    const { user } = useUser();
    const {showLoader, hideLoader} = useLoaderActions();
    const { addSnackbarSuccess } = useSnackbarActions();
    const { fetchData } = useAxios();
    const [openOwn, setOpenOwn] = useState<boolean>(false);

    const hasPersonalCompany = useMemo(() =>
            !!companies &&
            companies.some((c) => c[CompanyViewDTOFields.IsUserCompany])
        , [companies]);

    const allowRegisteredAsSelfEmployed = useMemo(() => {
        if (!companies) return false;

        return !hasPersonalCompany && user && user.hasTaxActivity;
    }, [companies, hasPersonalCompany, user]);

    const handleOpenCreateOwn = () => {
        setOpenOwn(true);
    }

    const handleCloseCreateOwn = () => setOpenOwn(false);

    const handleInsertOwnCompany = () => {
        const cuit = user?.cuit;
        if (!cuit) return;
        
        addSnackbarSuccess('Se creó correctamente tu cuenta de autónomo o monotributista');
        handleCloseCreateOwn();
        if (onReload) {
            onReload();
        }
    }
    
    const handleAfterValidate = () => {
        if (onReload)
            onReload();
    }

    return (
        <Grid item xs={12} container justifyContent="center" spacing={3}>
            {
                allowRegisteredAsSelfEmployed &&
                <Grid item xs={12} sm={6} md={hasAnyCompanyData ? 4 : 6} lg={hasAnyCompanyData ? 2 : 4}>
                    <ValidateIdentityHandle onClick={handleAfterValidate}>
                        <CompanySelfEmplyedOptionCard transparent={hasAnyCompanyData}
                                                      onClick={() => {}}
                                                      userName={user?.fullName || ''}
                                                      userCuit={user?.cuit || ''}
                        />
                    </ValidateIdentityHandle>
                </Grid>
            }

            {
                !hasAnyCompanyData &&
                <Grid item xs={12} sm={allowRegisteredAsSelfEmployed ? 6 : 12} lg={allowRegisteredAsSelfEmployed ? 4 : 8}>
                    <ValidateIdentityHandle redirectUrl={redirectUrl} onClick={onClickJoin}>
                        <CompanyJoinExistingOptionCard />
                    </ValidateIdentityHandle>
                </Grid>
            }

            <DialogAlert onClose={handleCloseCreateOwn}
                         open={openOwn}
                         onConfirm={handleInsertOwnCompany}
                         title={'Vincularme como autónomo o monotributista'}
                         textContent={'¿Estás seguro que querés vincularte como autónomo o monotributista?'}
                         validateIdentity
                         validationRedirectUrl={onValidationRedirectUrl}
                         waitValidationProcessing
            />
        </Grid>
    )
}
