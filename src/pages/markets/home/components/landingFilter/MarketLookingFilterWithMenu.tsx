import React, {useEffect, useRef, useState} from "react";
import {CaretDown, CaretUp} from "@phosphor-icons/react";
import {Box, Checkbox, Menu, MenuItem, Stack, Typography} from "@mui/material";
import {WrapperIcons} from "components/icons/Icons";
import {EntityWithIdAndDescription, EntityWithIdAndDescriptionFields, EntityWithIdFields} from "types/baseEntities";
import {Skeleton} from "@mui/lab";
import {IntermediateDataView} from "types/market/marketIntermediateData";

interface MarketLookingFilterWithMenuProps {
    title: string,
    subtitle: string,
    isActive?: boolean,
    onClick: () => void,
    loadOptions: () => Promise<IntermediateDataView[]>
}

function MarketLookingFilterWithMenu({ title, subtitle, isActive, onClick, loadOptions }: MarketLookingFilterWithMenuProps) {
    const [options, setOptions] = useState<EntityWithIdAndDescription[]>();
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
    const anchorRef = useRef<HTMLDivElement>(null);
    const showMenu = Boolean(anchorEl);
    
    const onOpenMenu = () => setAnchorEl(anchorRef.current ?? null);
    
    const onCloseMenu = () => setAnchorEl(null);

    useEffect(() => {
        loadOptions().then(setOptions)
    }, []);
    
    return (
        <Stack ref={anchorRef} 
               direction={'row'} spacing={2} alignItems={'center'} onClick={onClick}
               sx={{ backgroundColor: isActive ? 'white !important' : 'transparent !important', padding: '24px', borderRadius: '100px', cursor: 'pointer' }}
        >
            <Stack>
                <Typography fontSize={16} fontWeight={600}>{title}</Typography>
                <Typography color={'#818992'} fontSize={16}>
                    {subtitle}
                </Typography>
            </Stack>
            {
                isActive &&
                <Box textAlign={'center'} sx={{borderRadius: '100px', padding: '8px 8px 0px 8px', backgroundColor: '#F7FAFC', zIndex: 2,
                    '&:hover': { backgroundColor: '#c0c0c0' }}} onClick={onOpenMenu}
                >
                    <WrapperIcons Icon={showMenu ? CaretUp : CaretDown} size={'md'} />
                </Box>
            }

            <Menu
                anchorEl={anchorEl}
                open={showMenu}
                onClose={onCloseMenu}
                anchorOrigin={{
                    vertical: 'bottom',
                    horizontal: 'left',
                }}
                transformOrigin={{
                    vertical: 'top',
                    horizontal: 'left',
                }}
                PaperProps={{
                    style: {
                        width: anchorRef.current ? anchorRef.current.offsetWidth : 'auto', // Ajustar el ancho del Menu
                    },
                }}
                MenuListProps={{
                    onMouseLeave: onCloseMenu, 
                }}
            >
                {
                    options ?
                        options.map((x, idx) => (
                            <MenuItem key={`MarketLookingFilterWithMenu_${x[EntityWithIdFields.Id]}_${idx}`}>
                                <Checkbox />
                                <Typography>{x[EntityWithIdAndDescriptionFields.Description]}</Typography>
                            </MenuItem>
                        ))
                        :
                        Array.from({ length: 3 }).map((_, idx) => (
                            <MenuItem key={`MarketLookingFilterWithMenuLoading_${idx}`}>
                                <Skeleton variant={'text'} width={'100%'} />
                            </MenuItem>
                        ))
                }
            </Menu>
        </Stack>
    )
}

export default MarketLookingFilterWithMenu;