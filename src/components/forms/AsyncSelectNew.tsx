import React, {ReactElement, ReactNode, useEffect, useRef, useState} from 'react';
import {
    ControlledTextFieldProps
} from './ControlledTextField';
import { EntityWithIdAndDescription } from '../../types/baseEntities';
import {Controller} from "react-hook-form";
import {Box, Menu, MenuItem, Stack} from "@mui/material";
import HelperInputText from "../text/HelperInputText";
import {WrapperIcons} from "../icons/Icons";
import {CaretDown, CaretUp} from "@phosphor-icons/react";
import {stringFormatter} from "../../util/formatters/stringFormatter";
import {TypographyBase} from "../misc/TypographyBase";
import {themeColorDefinition} from "../../util/themes/definitions";

interface AsyncSelectNewProps extends ControlledTextFieldProps {
    loadOptions: () => Promise<EntityWithIdAndDescription[]> | undefined;
    filled?: boolean;
    autoSelect?: boolean;
    action?: ReactNode;
    icon?: ReactElement;
    companyId?: string;
    labelVariant?: string;
    onChangeSelect: (id?: string) => void;
    customMenuItemRender?: (option: EntityWithIdAndDescription) => ReactNode;
    customTitleRender?: (option: EntityWithIdAndDescription | undefined, label: ReactNode) => ReactNode;
    customLastMenuItemRender?: () => ReactNode;
    maxWidth?: string | number;
}

export const AsyncSelectNew = ({ autoSelect = false, ...props}: AsyncSelectNewProps) => {
    const [loading, setLoading] = useState(false);
    const [options, setOptions] = useState<EntityWithIdAndDescription[]>([]);
    const [autoSelectValue, setAutoSelectValue] = useState<number>();
    const [entity, setEntity] = useState<EntityWithIdAndDescription>()
    const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
    const anchorRef = useRef<HTMLDivElement>(null);
    const openMenu = Boolean(anchorEl)

    const { loadOptions, filled } = props;

    useEffect(() => {
        const request = loadOptions();

        if (request) {
            setLoading(true);

            request.then((options) => {

                if (autoSelect && options.length === 1) {
                    const uniqueValue = options[0].id;

                    // @ts-ignore
                    props.control._formValues[props.name] = uniqueValue;
                    setAutoSelectValue(uniqueValue);
                }

                setOptions(options);
                
                if (props.companyId) {
                    setEntity(options.find((o) => o.id == parseInt(props.companyId || '0')))
                } else {
                    const defaultOption = options.find((o) => o.id === 0);
                    if (defaultOption) {
                        setEntity(defaultOption);
                    }
                }
                
                setLoading(false);
            });
        }
    }, [loadOptions]);
    
    useEffect(() => {
        if (props.companyId && options.length > 0) {
            const selectedEntity = options.find((o) => o.id == parseInt(props.companyId || '0'));
            if (selectedEntity) {
                setEntity(selectedEntity);
            }
        }
    }, [props.companyId, options]);
    
    const onOpenMenu = () => setAnchorEl(anchorRef.current ?? null);

    const onCloseMenu = () => setAnchorEl(null);

    return (
        <Controller
            control={props.control}
            key={autoSelectValue}
            name={props.name || ''}
            render={({ field: { onChange, value }, fieldState: { error } }) => (
                <Stack 
                    sx={{
                        maxWidth: '100%',
                        backgroundColor: filled ? 'white !important' : '',
                        borderRadius: '32px',
                        flexBasis: props.labelVariant ? '80%' : '33.33%'
                    }} 
                    spacing={1} 
                    ref={anchorRef}
                >
                    <Stack direction='row' alignItems='center' justifyContent='space-between'>
                        <Stack direction='row' alignItems='center' spacing={2} sx={{width: props.action ? '90%' : '100%'}}>
                            {props.icon && props.icon}
                            {props.customTitleRender ? (
                                props.customTitleRender(entity, props.label)
                            ) : (
                                <TypographyBase variant={props.labelVariant as any || 'h3'} maxLines={2} tooltip>
                                    {entity ? !entity.id ? props.label : `${props.label}: ${stringFormatter.cutIfHaveMoreThan(entity.descripcion, props.labelVariant ? 60 : 24)}` : props.label}
                                </TypographyBase>
                            )}
                            <Box textAlign={'center'} sx={{borderRadius: '100px', padding: '4px 6px 0px 6px', backgroundColor: '#F7FAFC', zIndex: 2,
                                '&:hover': { backgroundColor: '#c0c0c0', cursor: 'pointer' }}}
                                 onClick={onOpenMenu}
                            >
                                <WrapperIcons Icon={openMenu ? CaretUp : CaretDown} size={'sm'} />
                            </Box>
                        </Stack>
                        <Box sx={{width: props.action ? '10%' : '0%'}}>
                            {props.action && props.action}
                        </Box>
                    </Stack>
                    <Menu open={openMenu} anchorEl={anchorEl} onClose={onCloseMenu}
                          anchorOrigin={{ horizontal: 'left', vertical: 'bottom' }}
                          transformOrigin={{ vertical: 'top', horizontal: 'left', }}
                          slotProps={{
                              paper: {
                                  style: {
                                      // @ts-ignore
                                      width: anchorRef.current ? anchorRef.current.offsetWidth : 'auto',
                                      maxWidth: props.maxWidth ? (typeof props.maxWidth === 'number' ? `${props.maxWidth}px` : props.maxWidth) : '100% !important',
                                      overflow: 'hidden !important',
                                      border: `1px solid ${themeColorDefinition.UIElements.backgrounds.tertiary}`,
                                      boxShadow: '0px 4px 4px -1px rgba(12, 12, 13, 0.1), 0px 4px 4px -1px rgba(12, 12, 13, 0.05)',
                                  },
                              }
                          }}
                          MenuListProps={{ onMouseLeave: onCloseMenu }}
                    >
                        {options.map((option) => {
                            const isSelected = entity?.id === option.id;
                            
                            return (
                                <MenuItem key={option.id} value={option.id} disableRipple onClick={() => {
                                    setEntity(option)
                                    onCloseMenu()
                                    props.onChangeSelect(option.id ? option.id.toString() : undefined)
                                }}
                                sx={{
                                    borderRadius: '16px',
                                    paddingX: '12px',
                                    paddingY: '8px',
                                    marginX: '8px',
                                    marginY: '4px',
                                    backgroundColor: isSelected ? '#D8F3E6 !important' : 'white',
                                    color: '#232926',
                                    '&:hover': {
                                        backgroundColor: '#D8F3E6 !important',
                                        color: '#232926'
                                    },
                                    '&.Mui-focusVisible': {
                                        backgroundColor: '#D8F3E6 !important',
                                        color: '#232926'
                                    }
                                }}
                                >
                                    {props.customMenuItemRender ? props.customMenuItemRender(option) : option.descripcion}
                                </MenuItem>
                            );
                        })}
                        {props.customLastMenuItemRender && (
                            <Box sx={{ 
                                paddingX: '8px',
                                paddingY: '4px',
                            }}>
                                {props.customLastMenuItemRender()}
                            </Box>
                        )}
                    </Menu>
                    
                    {error && <HelperInputText text={error.message} error />}

                    {props.helperText && !error && <HelperInputText text={props.helperText} />}
                </Stack>
            )}
        />
    );
};
