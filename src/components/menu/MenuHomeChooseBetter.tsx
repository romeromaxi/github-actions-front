import {AppBarButton} from "../buttons/HomeButtons";
import React, {useMemo, useState} from "react";
import {Box, Menu, MenuItem, Stack, Tooltip, Typography} from "@mui/material";
import {WrapperIcons} from "../icons/Icons";
import {BookBookmark} from "phosphor-react";
import {userStorage} from "../../util/localStorage/userStorage";
import FailRedirectMarketDialog from "../../pages/markets/home/components/FailRedirectMarketDialog";
import {CompanyViewDTO} from "../../types/company/companyData";
import {HttpCompany} from "../../http";
import {useLocation, useNavigate} from "react-router-dom";
import {EntityWithIdFields} from "types/baseEntities";
import {
    NoCompaniesWithCreateNewDialog
} from "pages/markets/lines/shoppingbag/dialogs/MustHaveRelatedCompanyDialog";
import CompaniesSelectDialog from "pages/company/components/CompaniesSelectDialog";
import MenuHomeStyles from "./MenuHome.styles";
import {AppRoutesDefinitions, useAppNavigation} from "../../hooks/navigation";


interface MenuHomeChooseBetterProps {
    mobileView?: boolean;
}

const MenuHomeChooseBetter = ({mobileView} : MenuHomeChooseBetterProps) => {
    const classes = MenuHomeStyles();
    const routerDomNavigate = useNavigate();
    const { navigate } = useAppNavigation();
    const location = useLocation();    
    const [chooseBetter, setChooseBetterRef] = useState<HTMLElement | null>(null);
    const openChooseBetter = Boolean(chooseBetter);
    const isLoggedIn = useMemo(() => userStorage.isLogged(), []);
    const [openErrorDrawer, setOpenErrorDrawer] = useState<boolean>(false)
    const [companies, setCompanies] = useState<CompanyViewDTO[]>()
    const [openNoCompanies, setOpenNoCompanies] = useState<boolean>(false)
    const [companiesDrawer, setCompaniesDrawer] = useState<boolean>(false);

    const classNameButton = useMemo(() => {
        if (location.pathname.startsWith('/informacion-para-elegir-mejor'))
            return classes.selectedAppBarButton;

        return undefined;
    }, [location]);
    
    const onOpenMenu = (event: React.MouseEvent<HTMLButtonElement>) => setChooseBetterRef(event.currentTarget);

    const onCloseMenu = () => setChooseBetterRef(null);
    
    const openGlossaryPage = () => navigate(AppRoutesDefinitions.LucGlossaryPage);
    
    const loadCompanies = () => {
        HttpCompany.getCompaniesByUser().then((r) => {
            if (r.length == 0) setOpenNoCompanies(true)
            else if (r.length == 1) routerDomNavigate(`/mis-empresas/${r[0][EntityWithIdFields.Id]}?tab=bureau`)
            else {
                setCompanies(r)
                setCompaniesDrawer(true)
            }
        })
    }
    
    const onOpenPublicInfo = () => {
        if (!isLoggedIn) {
            setOpenErrorDrawer(true)
        } else {
            loadCompanies()
        }
    }
    
    return (
        <React.Fragment>
            {
                !mobileView ?
                    <AppBarButton className={classNameButton} onClick={onOpenMenu}>
                        Información para Elegir Mejor
                    </AppBarButton>
                :
                    <MenuItem onClick={onOpenMenu} color={'black !important'} disableRipple>
                        <Stack direction='row' alignItems='center'>
                            <WrapperIcons Icon={BookBookmark} />
                            <Typography sx={{paddingLeft: 1}}>Información para Elegir Mejor</Typography>
                        </Stack>
                    </MenuItem>
            }
            <Menu
                id="choose-better-menu"
                anchorEl={chooseBetter}
                open={openChooseBetter}
                onClick={onCloseMenu}
                onClose={onCloseMenu} 
                PaperProps={{
                    sx: { minWidth:  '275px !important'},
                }}
            >
                <MenuItem disableRipple onClick={onOpenPublicInfo}>
                    <Box>Ver como me ven</Box>
                </MenuItem>
                <MenuItem onClick={openGlossaryPage} 
                          disableRipple>
                    <Box>Glosario</Box>
                </MenuItem>
                <Tooltip title={'Próximamente...'}>
                    <div>
                        <MenuItem disableRipple disabled>
                            <Box>Información Útil</Box>
                        </MenuItem>
                    </div>
                </Tooltip>
                <Tooltip title={'Próximamente...'}>
                    <div>
                        <MenuItem disableRipple disabled>
                            <Box>Artículos</Box>
                        </MenuItem>
                    </div>
                </Tooltip>
                <Tooltip title={'Próximamente...'}>
                    <div>
                        <MenuItem disableRipple disabled>
                            <Box>Capacitación</Box>
                        </MenuItem>
                    </div>
                </Tooltip>
            </Menu>
            <FailRedirectMarketDialog open={openErrorDrawer}
                                      onClose={() => setOpenErrorDrawer(false)}
                                      description={'En LUC podés conocer qué saben de vos clientes, proveedores y entidades. Ingresá o da de alta tu usuario para aprovechar esta y otras soluciones de LUC para vos.'}
                                      
            />
            <NoCompaniesWithCreateNewDialog open={openNoCompanies}
                                          onClose={() => setOpenNoCompanies(false)}
            />
            <CompaniesSelectDialog open={companiesDrawer}
                                   onClose={() => setCompaniesDrawer(false)}
                                   title={'Selecciona la empresa que querés ver'}
                                   onSelect={(id: number) => {
                                       setCompaniesDrawer(false)
                                       routerDomNavigate(`/mis-empresas/${id}?tab=bureau`)
                                   }}
                                   onReloadCompanies={loadCompanies}
                                   companies={companies}
            />
        </React.Fragment>
    )
}


export default MenuHomeChooseBetter