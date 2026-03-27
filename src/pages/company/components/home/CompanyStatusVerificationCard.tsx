import React, {useContext, useState} from 'react';
import {Button, Card, CardContent, Stack} from '@mui/material';
import {TypographyBase} from "components/misc/TypographyBase";
import {NextButtonNew} from "components/buttons/Buttons";
import {ClockIcon} from "lucide-react";
import {HomeCompanyPageContext} from "../../HomeCompanyPage";
import CompanyInviteThroughMailDrawer from "../CompanyInviteThroughMailDrawer";
import CompanyAfipFormDrawer from "../CompanyAfipFormDrawer";
import {CompanyViewDTOFields} from "types/company/companyData";
import {EntityWithIdFields} from "types/baseEntities";
import {themeColorDefinition} from "util/themes/definitions";


interface CompanyStatusVerificationCardProps {
    marginBottom?: number
}

const CompanyStatusVerificationCard = ({ marginBottom }: CompanyStatusVerificationCardProps) => {
    const { company, reloadCompany } = useContext(HomeCompanyPageContext);
    const [openInvite, setOpenInvite] = useState<boolean>(false);
    const [openProve, setOpenProve] = useState<boolean>(false);
    const [inProcess, setInProcess] = useState<boolean>(false);

    if (!company) return null;

    const mailInvited = !!company[CompanyViewDTOFields.MailInvitationResponsible];

    let shouldShow = false;
    let needsVerification = false;

    if (company[CompanyViewDTOFields.AllowResponsibleInvitation]) {
        shouldShow = true;
        needsVerification = !mailInvited;
    } else if (company[CompanyViewDTOFields.AllowGetResponsability]) {
        shouldShow = true;
        needsVerification = true;
    } else if (company[CompanyViewDTOFields.AllowViewDocumentationResponsability]) {
        shouldShow = true;
        needsVerification = false;
    }

    if (!shouldShow) return null;


    const onOpenInvite = () => {
        setOpenInvite(true);
        if (!needsVerification) setInProcess(true);
    };

    const onCloseInvite = () => {
        setOpenInvite(false);
        setInProcess(false);
    };

    const afterSubmitInvite = () => {
        onCloseInvite();
        reloadCompany();
    };

    const onOpenProve = () => {
        setOpenProve(true);
        if (!needsVerification) setInProcess(true);
    };

    const onCloseProve = () => {
        setOpenProve(false);
        setInProcess(false);
    };

    const afterSubmitProve = () => {
        onCloseProve();
        reloadCompany();
    };

    const onVerifyClick = () => {
        if (company[CompanyViewDTOFields.AllowResponsibleInvitation]) {
            onOpenInvite();
        } else {
            onOpenProve();
        }
    };

    return (
        <React.Fragment>
            <Card sx={{
                backgroundColor: themeColorDefinition.systemFeedback.warning.secondary,
                boxShadow: `inset 0 0 0 1px ${themeColorDefinition.systemFeedback.warning.primary}`,
                marginBottom: marginBottom || 'none'
            }}
            >
                <CardContent>
                    <Stack direction="row" spacing={4} justifyContent="space-between" alignItems="center">
                        <Stack spacing={1} maxWidth={{ xs: 1, md: 0.75 }}>
                            <TypographyBase variant={'h5'} color="warning.secondaryContrastText">
                                {needsVerification ? 'Esta PyME necesita ser verificada' : 'Verificación en proceso'}
                            </TypographyBase>
                            <TypographyBase variant="body2" color="warning.secondaryContrastText">
                                Por cuestiones de seguridad, hay cierta información que no podés visualizar o editar hasta asegurarnos que pertenezcas a esta PyME
                            </TypographyBase>
                        </Stack>
                        
                        {
                            needsVerification ?
                                <NextButtonNew size="small" color='warning' variant='contained' onClick={onVerifyClick}>
                                    Verificar ahora
                                </NextButtonNew>
                                :
                                <Button size="small"
                                        startIcon={<ClockIcon color={themeColorDefinition.systemFeedback.warning.secondaryContrastText}/>}
                                        variant='outlined'
                                        onClick={onVerifyClick}
                                        sx={{
                                            borderColor: themeColorDefinition.systemFeedback.warning.secondaryContrastText, 
                                            color: themeColorDefinition.systemFeedback.warning.secondaryContrastText}}
                                        color='inherit'
                                        
                                >
                                    Verificando
                                </Button>
                        }
                    </Stack>
                </CardContent>
            </Card>
            <CompanyInviteThroughMailDrawer
                open={openInvite}
                onClose={onCloseInvite}
                onConfirm={afterSubmitInvite}
                company={company}
                inProcess={inProcess}
            />
            <CompanyAfipFormDrawer
                show={openProve}
                companyId={company[EntityWithIdFields.Id]}
                companyName={company[CompanyViewDTOFields.BusinessName]}
                onClose={onCloseProve}
                onConfirmed={afterSubmitProve}
                viewFiles={!company[CompanyViewDTOFields.AllowGetResponsability]}
                alreadySent={company[CompanyViewDTOFields.AllowViewDocumentationResponsability]}
                inProcess={inProcess}
            />
        </React.Fragment>
    );
};


export default CompanyStatusVerificationCard;