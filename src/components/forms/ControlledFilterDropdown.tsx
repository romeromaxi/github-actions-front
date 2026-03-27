import React, {useEffect, useRef, useState} from "react";
import {Control, Controller} from "react-hook-form";
import {CaretDown, CaretUp} from "@phosphor-icons/react";
import {Badge, Box, Button, Checkbox, Menu, MenuItem, Stack, SxProps, Typography, useMediaQuery, useTheme} from "@mui/material";
import {
    EntityWithIdAndDescription,
    EntityWithIdAndDescriptionFields,
    EntityWithIdFields
} from "../../types/baseEntities";
import {WrapperIcons} from "../icons/Icons";
import {Skeleton} from "@mui/lab";
import {TypographyBase} from "components/misc/TypographyBase";

export enum ItemFilterDropdownFields {
    Disabled = 'deshabilitado'
}

export interface ItemFilterDropdown extends EntityWithIdAndDescription {
    [ItemFilterDropdownFields.Disabled]: boolean
}


interface ControlledFilterDropdownProps {
    labelSx: SxProps;
    control: Control,
    name: string,
    onSelect: () => void,
    selected: boolean,
    label: string,
    description?: string,
    loadOptions?: () => Promise<ItemFilterDropdown[]>,
    options?: ItemFilterDropdown[],
    onMouseEnter?: () => void,
    sx?: SxProps,
    hideDescription?: boolean,
    smallSize?: boolean,
}


const ControlledFilterDropdown = (props : ControlledFilterDropdownProps) => {
    const [options, setOptions] = useState<ItemFilterDropdown[]>([]);
    const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
    const anchorRef = useRef<HTMLDivElement>(null);
    const openMenu = Boolean(anchorEl);

    const onOpenMenu = () => setAnchorEl(anchorRef.current ?? null);

    const onCloseMenu = () => setAnchorEl(null);

    const theme = useTheme()
    const isMediumScreen = useMediaQuery(theme.breakpoints.down('md'));

    const handleToggle = (selectedValues: number[], value: EntityWithIdAndDescription) => {
        const valueId = value[EntityWithIdFields.Id];
        const currentIndex = selectedValues.indexOf(valueId);
        const newChecked = [...selectedValues];

        if (currentIndex === -1) {
            newChecked.push(valueId);
        } else {
            newChecked.splice(currentIndex, 1);
        }

        return newChecked;
    };

    useEffect(() => {
        props.loadOptions &&
            props.loadOptions().then(setOptions)
    }, []);

    const handleClear = (onChange: (value: number[]) => void) => {
        onChange([]);
    };
    
    const getAvailableOpts = () => {
        const available = props.options?.filter((opt) => !opt.deshabilitado).length
        // return `${available === props.options?.length ? 'Todos' : available === 0 ? 'No hay opciones disponibles' : available === 1 ? '1 opción disponible' : `${available} opciones disponibles`}`
        return `${available === props.options?.length ? 'Todos' : `\u200B`}`
    }

    return (
        <Controller control={props.control}
                    name={props.name}
                    render={({field: { onChange, value }}) => {
                        const containsSelectedItems = value && value.length !== 0 &&
                            ((props.options ? value.length !== props.options.length : options && value.length !== options.length));

                        return (
                            <Stack ref={anchorRef} direction={'row'} justifyContent={'space-between'}
                                   alignItems={'center'} onClick={props.onSelect}
                                   onMouseEnter={props.onMouseEnter}
                                   sx={{
                                       backgroundColor: props.selected ? 'white !important' : 'transparent !important',
                                       padding: '24px',
                                       borderRadius: '100px',
                                       flexBasis: '33.33%',
                                       cursor: props.selected ? 'default' : 'pointer',
                                       ...props.sx
                                   }}
                            >
                                <Stack maxWidth={'90%'}>
                                    <Stack direction='row' alignItems='center' spacing={2}>
                                        {containsSelectedItems && <Badge variant={'standard'} badgeContent={value.length} color={'primary'}/>}
                                        <Typography 
                                            fontSize={props.smallSize ? 14 : 16} 
                                            fontWeight={600} 
                                            sx={{
                                                maxWidth: '100%',
                                                overflow: 'hidden',
                                                textOverflow: 'ellipsis',
                                                whiteSpace: 'nowrap',
                                                color: containsSelectedItems ? '#4CAF50' : undefined,
                                                ...props.labelSx
                                            }}
                                        >
                                            {props.label}
                                        </Typography>
                                    </Stack>

                                    {
                                        (!props.hideDescription || (!!value && !!value.length)) &&
                                            <Typography className={"text-ellipsis"} color={'#818992'}
                                                        fontSize={props.smallSize ? 12 : 16}
                                                        fontWeight={containsSelectedItems ? 400 : 300}
                                                        fontStyle={containsSelectedItems ? "" : "italic"}
                                            >
                                                {
                                                    (!value || !value.length || (!options && !props.options)) ?
                                                        props.description ?? getAvailableOpts()
                                                        :
                                                        value.length == 1 ?
                                                            props.options ? props.options.find(x => x[EntityWithIdFields.Id] === value[0])?.[EntityWithIdAndDescriptionFields.Description] ?? '-' :
                                                                options.find(x => x[EntityWithIdFields.Id] === value[0])?.[EntityWithIdAndDescriptionFields.Description] ?? '-'
                                                            :
                                                            ((props.options && value.length === props.options.length) || (options && value.length === options.length)) ?
                                                                "Todos"
                                                                :
                                                                `${value.length} opciones seleccionadas`
                                                }
                                            </Typography>
                                    }
                                </Stack>

                                <Box 
                                    textAlign={'center'} 
                                    sx={{
                                        borderRadius: isMediumScreen ? '50px' : '100px',
                                        padding: isMediumScreen ? '3px 3px 0px 3px' : '4px 4px 0px 4px',
                                        marginLeft: 1,
                                        backgroundColor: '#F7FAFC',
                                        zIndex: 2,
                                        display: 'flex',
                                        justifyContent: 'flex-end',
                                        alignItems: 'center',
                                        width: isMediumScreen ? '20px' : '25px', 
                                        height: isMediumScreen ? '20px' : '25px',
                                        '&:hover': { 
                                            backgroundColor: '#c0c0c0', 
                                            cursor: 'pointer' 
                                        }
                                    }}
                                    onClick={props.selected ? onOpenMenu : undefined}
                                >
                                    {props.selected && (
                                        <WrapperIcons 
                                            Icon={openMenu ? CaretUp : CaretDown} 
                                            size={isMediumScreen ? 'xs' : 'sm'}
                                        />
                                    )}
                                </Box>
                                <Menu anchorEl={anchorEl}
                                      open={openMenu}
                                      onClose={onCloseMenu}
                                      anchorOrigin={{horizontal: 'left', vertical: 'bottom'}}
                                      transformOrigin={{vertical: 'top', horizontal: 'left',}}
                                      PaperProps={{
                                          style: {
                                              paddingBottom: '0px', display: 'flex', flexDirection: 'row',
                                              // @ts-ignore
                                              width: anchorRef.current ? `${anchorRef.current.offsetWidth}px` : 'auto',
                                          },
                                      }}
                                      MenuListProps={{ sx: { width: '100%' }, onMouseLeave: onCloseMenu }}
                                >
                                    <Box flexGrow={1} sx={{overflowY: 'auto'}}>
                                        {
                                            props.options ?
                                                props.options.map((x, idx) => (
                                                    <MenuItem key={`MarketLookingFilterWithMenu_${props.name}_${idx}`}
                                                              onClick={() => onChange(handleToggle(value || [], x))}
                                                              disabled={x[ItemFilterDropdownFields.Disabled]}
                                                    >
                                                        <Checkbox
                                                            checked={value ? value.indexOf(x[EntityWithIdFields.Id]) !== -1 : false}
                                                            disabled={x[ItemFilterDropdownFields.Disabled]}
                                                        />
                                                        <TypographyBase tooltip maxLines={1}>
                                                            {x[EntityWithIdAndDescriptionFields.Description]}
                                                        </TypographyBase>
                                                    </MenuItem>
                                                ))
                                                :
                                                options ?
                                                    options.map((x, idx) => (
                                                        <MenuItem key={`MarketLookingFilterWithMenu_${props.name}_${idx}`}
                                                                  onClick={() => onChange(handleToggle(value || [], x))}
                                                                  disabled={x[ItemFilterDropdownFields.Disabled]}
                                                        >
                                                            <Checkbox
                                                                checked={value ? value.indexOf(x[EntityWithIdFields.Id]) !== -1 : false}
                                                                disabled={x[ItemFilterDropdownFields.Disabled]}/>
                                                            <Typography>{x[EntityWithIdAndDescriptionFields.Description]}</Typography>
                                                        </MenuItem>
                                                    ))
                                                    :
                                                    Array.from({length: 3}).map((_, idx) => (
                                                        <MenuItem key={`MarketLookingFilterWithMenuLoading_${props.name}_${idx}`}>
                                                            <Skeleton variant={'text'} width={'100%'}/>
                                                        </MenuItem>
                                                    ))
                                        }
                                    </Box>
                                    <Box paddingY={1} sx={{'&:hover': {backgroundColor: 'white !important'},
                                        backgroundColor: 'white !important', justifyContent: 'flex-end',
                                        display: 'flex', position: 'sticky', zIndex: 1, bottom: 0
                                    }}>
                                        <Button onClick={() => handleClear(onChange)} color="primary" size={"small"} disabled={!value || value && value.length == 0}>
                                            Limpiar filtros
                                        </Button>
                                    </Box>
                                </Menu>
                            </Stack>
                        )
                    }}
        />
    )
}


export default ControlledFilterDropdown