import React, {useMemo, useState} from 'react';
import {
    Box, Button,
    Dialog,
    IconButton,
    Stack,
    Typography,
} from '@mui/material';
import {AddButton} from 'components/buttons/Buttons';
import ValidateIdentityHandle from '../../../../user/components/ValidateIdentityHandle';
import OwnCompanyDrawer from '../../../../company/newCompany/OwnCompanyDrawer';
import { NewCompanyContext } from 'pages/company/components/MyCompaniesList';
import NewCompanyBaseDrawer from "../../../../company/components/new/NewCompanyBaseDrawer";
import {DialogAlertLUC} from "components/dialog/DialogAlertLUC";
import {useLocation, useNavigate} from "react-router-dom";
import {TypographyBase} from "components/misc/TypographyBase";
import {WrapperIcons} from "components/icons/Icons";
import { XIcon } from "lucide-react";
import {CryptoJSHelper} from "util/helpers";


interface MustHaveRelatedCompanyDialogProps {
    open: boolean;
    onClose: () => void;
}

function MustHaveRelatedCompanyDialog(
    props: MustHaveRelatedCompanyDialogProps,
) {
    const navigate = useNavigate();
    const location = useLocation();
    const encryptedCurrentRoute = useMemo(() => (
        CryptoJSHelper.encryptRoute(location.pathname ?? '/mi-cuenta')
    ), [location.pathname]);
    
    const onCancelCreateCompany = () => props.onClose();

    const handleNewCompany = () => {
        props.onClose();        
        navigate({
            pathname: `/nueva-pyme`,
            search: `?redirect=${encryptedCurrentRoute}`
        });
    }
    
    return (
        <Dialog open={props.open}
                onClose={onCancelCreateCompany}
                PaperProps={{
                    sx: {
                        boxShadow: (theme) => `inset 0 0 0 2px ${theme.palette.primary.main} !important`,
                    }
                }}
                fullWidth
        >
            <Box position="relative" width={1}>
                <Box position="absolute" top={0} right={0} display="flex" justifyContent="flex-start">
                    <IconButton color="default" onClick={onCancelCreateCompany}>
                        <WrapperIcons Icon={XIcon} size={'md'} />
                    </IconButton>
                </Box>
                
                <Stack spacing={2} width={1} alignItems={'center'}>
                    <Box component="img"
                         width={{ xs: '100px', sm: '120px' }}
                         height={{ xs: '99px', sm: '119px' }}
                         src={'/images/homeCompanies/existing-company.svg'} />
                    <Stack spacing={4} width={1} alignItems={'center'}>
                        <Stack spacing={0.75}>
                            <TypographyBase variant={'eyebrow2'} color={"primary"} textTransform={'uppercase'} textAlign='center'>
                                La información pertenece a una Pyme. Para verla necesitas vincularla a tu cuenta
                            </TypographyBase>
                            <TypographyBase variant={'h4'} textAlign='center'>
                                Vinculá tu Pyme en pocos pasos
                            </TypographyBase>
                        </Stack>

                        <Stack spacing={1.5} width={1}>
                            <ValidateIdentityHandle
                                onClick={handleNewCompany}
                                redirectUrl={`/nueva-pyme?redirect=${encryptedCurrentRoute}&return=${encryptedCurrentRoute}`}
                                returnUrl={location.pathname}
                            >
                                <Button color={'primary'}
                                        variant={'contained'}
                                        size={'medium'}
                                        fullWidth
                                >
                                    Vincular nueva PyME
                                </Button>
                            </ValidateIdentityHandle>
                        </Stack>
                    </Stack>
                </Stack>
            </Box>
        </Dialog>
    );
}

export default MustHaveRelatedCompanyDialog;


export const NoCompaniesWithCreateNewDialog = (props: MustHaveRelatedCompanyDialogProps) => {
    const [openNewCompany, setOpenNewCompany] = useState<boolean>(false);
    const [openOwnCompany, setOpenOwnCompany] = useState<boolean>(false);
    const onCancelCreateCompany = () => props.onClose();

    const onCloseNewRepo = () => setOpenNewCompany(false);

    const onConfirmCreateCompany = () => setOpenNewCompany(true);

    const onSameCuit = () => {
        setOpenOwnCompany(true);
        setOpenNewCompany(false);
    };

    const onCloseOwnCompany = () => setOpenOwnCompany(false);

    return (
        <React.Fragment>
            <DialogAlertLUC open={props.open && (!openNewCompany && !openOwnCompany)}
                            onClose={onCancelCreateCompany}
                            title={'Ver cómo me ven'}
                            actions={
                                <Stack justifyContent={'center'} alignItems={'center'} textAlign={'center'} sx={{width: '100%'}}>
                                    <ValidateIdentityHandle onClick={onConfirmCreateCompany}>
                                        <AddButton>Nueva empresa</AddButton>
                                    </ValidateIdentityHandle>
                                </Stack>
                            }
            >
                <Typography fontSize={13} color={'text.lighter'} textAlign={'center'}
                >
                    En LUC podés conocer qué saben de vos clientes, proveedores y entidades. Creá tu cuenta empresa de persona humana o jurídica para aprovechar esta y otras soluciones de LUC para vos.
                </Typography>
            </DialogAlertLUC>
            <NewCompanyContext.Provider value={{ onCloseDrawer: onCloseNewRepo }}>
                <NewCompanyBaseDrawer open={openNewCompany}
                                      onClose={() => setOpenNewCompany(false)}
                                      onSubmit={() => {
                                          setOpenNewCompany(false);
                                          onCancelCreateCompany();
                                          // window.location.reload();
                                      }}
                                      onReload={() => {}}
                                      onSamePerson={onSameCuit}
                />
            </NewCompanyContext.Provider>
            <OwnCompanyDrawer
                show={openOwnCompany}
                onCloseDrawer={onCloseOwnCompany}
            />
        </React.Fragment>
    );
}