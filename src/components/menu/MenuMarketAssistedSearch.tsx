import React, {useState} from "react";
import {Box, Menu, MenuItem, Stack, Typography, useMediaQuery} from "@mui/material";
import {useNavigate} from "react-router-dom";
import {useTheme} from "@mui/material/styles";
import {WrapperIcons} from "../icons/Icons";
import {ListMagnifyingGlass} from "@phosphor-icons/react";
import {AppBarButton} from "../buttons/HomeButtons";


interface MenuMarketAssistedSearchProps {
    mobileView?: boolean;
}

const MenuMarketAssistedSearch = ({mobileView}: MenuMarketAssistedSearchProps) => {
    const [assistedSearch, setAssistedSearch] = useState<HTMLElement | null>(null);
    const open = Boolean(assistedSearch);
    const navigate = useNavigate();
    const theme = useTheme()
    const isMediumScreen = useMediaQuery(theme.breakpoints.down('md'))

    const stylesMenuItem = {
        '&:hover': {
            backgroundColor: 'transparent !important',
            color: `${theme.palette.primary.main} !important`
        },
    }
    
    const onOpenMenu = (event: React.MouseEvent<HTMLButtonElement>) => setAssistedSearch(event.currentTarget);

    const onCloseMenu = () => setAssistedSearch(null);
    
    const onClickMatcherLuc = () =>
        navigate('/market/luc?redirect=ac08111f742d99c360628ede782615800ab2b5e0ef3fbd90ed919c0b919447a9b60e27623ee78fcc7021a47e7144df4ec044368bbd4452bb8e80e90600778c72e1721c923214746df1a57d1c1577c2db')

    const onClickOrienteerLuc = () =>
      navigate('/market/luc-te-orienta?redirect=ac08111f742d99c360628ede78261580dfb05dec36a39b209e41003262f5fdd8f703eef5c6848a8a98ca46f05a2d5ed4d83bbedc823f4c14b7a8c824f8be672f1a046c785baa1804a7b87f7b4dfd36a7')
    
    const onClickCasfogLink = () => navigate('/market/casfog?redirect=ac08111f742d99c360628ede78261580097098d9b8b5212a530e5a1bfa048dd9b6ea1960726b42a682c7c2a4a627d36289f71106fc62d464b9c60e65e80641ac361c45a9fad4eca117b804d8557382cd')

    return (
        <React.Fragment>
            {
                (mobileView || isMediumScreen) ?
                    <MenuItem onClick={onOpenMenu} 
                              color={'black !important'}
                              sx={{ ...stylesMenuItem }}
                              disableRipple
                    >
                        <Stack direction='row' alignItems='center' justifyContent={'center'} width={1}>
                            <Typography variant={'subtitle2'} fontWeight={500} sx={{paddingLeft: 1}}>
                                Búsqueda Asistida
                            </Typography>
                        </Stack>
                    </MenuItem>
                    :
                    <AppBarButton onClick={onOpenMenu}>
                        Búsqueda Asistida
                    </AppBarButton>
            }

            <Menu
                id="useful-info-menu"
                anchorEl={assistedSearch}
                open={open}
                onClick={onCloseMenu}
                onClose={onCloseMenu}
                anchorOrigin={{
                    vertical: "bottom", 
                    horizontal: "center",
                }}
                PaperProps={{
                    sx: { minWidth:  '275px !important'},
                }}
            >
                <MenuItem id="luc-te-asiste" onClick={onClickMatcherLuc} disableRipple>
                    <Box>LUC te asiste</Box>
                </MenuItem>
                <MenuItem id="link-avales-con-casfog" onClick={onClickCasfogLink} disableRipple>
                    <Box>Avales con Casfog</Box>
                </MenuItem>
            </Menu>
        </React.Fragment>
    )
}

export default MenuMarketAssistedSearch