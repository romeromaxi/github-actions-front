import {AppbarMenuDataItem, AppbarMenuDataItemFields} from "../../../types/menu/menuData";
import React, {ReactNode} from "react";
import {WrapperIcons} from "../../icons/Icons";
import {Box, Menu, Stack, Typography} from "@mui/material";
import UserAvatarWithMenuStyles from "../../../layouts/home/components/UserAvatarWithMenu.styles";
import {MenuItemOptionBase} from "../../../layouts/home/components/UserAvatarWithMenuNew";
import { List } from "@phosphor-icons/react";


interface BurgerMenuProps {
    renderedItems: ReactNode
    dataItems: AppbarMenuDataItem[]
}


const BurgerMenu = ({renderedItems, dataItems} : BurgerMenuProps) => {

    const classes = UserAvatarWithMenuStyles();
    const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
    const open = Boolean(anchorEl);
    const handleClick = (event: React.MouseEvent<HTMLElement>) =>
        setAnchorEl(event.currentTarget);
    const handleClose = () => setAnchorEl(null);

    const handleClickMenuData = (item: AppbarMenuDataItem) => {
        item[AppbarMenuDataItemFields.OnClick] && item[AppbarMenuDataItemFields.OnClick]()
        handleClose()
    }
    
    return (
        <React.Fragment>
            <Box textAlign={'center'} sx={{borderRadius: '100px', padding: '8px 8px 0px 8px', backgroundColor: '#F7FAFC', zIndex: 2,
                '&:hover': { backgroundColor: '#c0c0c0', cursor: 'pointer' }}}
                 onClick={handleClick}
            >
                <WrapperIcons Icon={List} size={'lg'} color={'black'}/>
            </Box>
            <Menu open={open}
                  anchorEl={anchorEl}
                  onClose={handleClose}
                  onClick={undefined}
                  transformOrigin={{ horizontal: 'right', vertical: 'bottom' }}
                  anchorOrigin={{ horizontal: 'right', vertical: 'top' }}
                  PaperProps={{
                      className: classes.menuPaper,
                  }}
                  sx={{
                      marginTop: 8
                  }}
            >
                {
                    dataItems.map((item) => 
                        !!item[AppbarMenuDataItemFields.Component] ?
                            <MenuItemOptionBase onClick={handleClose}>
                                {item[AppbarMenuDataItemFields.Component]}
                            </MenuItemOptionBase>
                            :
                            <MenuItemOptionBase onClick={() => handleClickMenuData(item)}>
                                <Stack direction='row' alignItems='center' spacing={1} sx={item[AppbarMenuDataItemFields.Styles]}>
                                    <WrapperIcons Icon={item[AppbarMenuDataItemFields.Logo]} />
                                    <Typography>{item[AppbarMenuDataItemFields.Title]}</Typography>
                                </Stack>
                            </MenuItemOptionBase>
                    )
                }
                {renderedItems}
            </Menu>
        </React.Fragment>
    )
}



export default BurgerMenu