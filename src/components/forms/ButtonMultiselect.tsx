import React, {useEffect, useRef, useState} from "react";
import {Control, Controller} from "react-hook-form";
import {
    EntityWithIdAndDescription,
    EntityWithIdAndDescriptionFields,
    EntityWithIdFields
} from "../../types/baseEntities";
import {Badge, Box, Button, Checkbox, Menu, MenuItem, Typography} from "@mui/material";
import {Skeleton} from "@mui/lab";


interface ButtonMultiselectProps {
    control: Control,
    name: string,
    label: string,
    startIcon?: React.ReactNode,
    loadOptions?: () => Promise<any[]>,
    options?: EntityWithIdAndDescription[]
}


const ButtonMultiselect = (props: ButtonMultiselectProps) => {
    const [options, setOptions] = useState<EntityWithIdAndDescription[]>([]);
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
    const anchorRef = useRef<HTMLButtonElement>(null);
    const [count, setCount] = useState<number>(0);
    const openMenu = Boolean(anchorEl);

    const onOpenMenu = (event: React.MouseEvent<HTMLButtonElement>) => {
        setAnchorEl(event.currentTarget);
    };

    const onCloseMenu = () => setAnchorEl(null);

    const handleToggle = (selectedValues: number[], value: EntityWithIdAndDescription) => {
        const valueId = value[EntityWithIdFields.Id];
        const currentIndex = selectedValues.indexOf(valueId);
        const newChecked = [...selectedValues];

        if (currentIndex === -1) {
            newChecked.push(valueId);
        } else {
            newChecked.splice(currentIndex, 1);
        }
        setCount(newChecked.length);
        return newChecked;
    };

    const handleClear = (onChange: (value: number[]) => void) => {
        setCount(0);
        onChange([]);
    };

    useEffect(() => {
        props.loadOptions && props.loadOptions().then(setOptions);
    }, []);

    return (
        <Controller
            control={props.control}
            name={props.name}
            render={({ field: { onChange, value } }) => (
                <React.Fragment>

                    <Badge
                        badgeContent={count}
                        color="primary"
                        sx={{
                            '& .MuiBadge-badge': {
                                right: 4,
                                top: 4,
                            }
                        }}
                    >
                        <Button
                            ref={anchorRef}
                            size="small"
                            variant="outlined"
                            color="secondary"
                            startIcon={props.startIcon}
                            onClick={onOpenMenu}
                            sx={{
                                position: 'relative'
                            }}
                        >
                            {props.label}
                        </Button>
                    </Badge>
                    
                    <Menu
                        anchorEl={anchorEl}
                        open={openMenu}
                        onClose={onCloseMenu}
                        anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
                        transformOrigin={{ vertical: 'top', horizontal: 'right' }}
                        MenuListProps={{ onMouseLeave: onCloseMenu }}
                        sx={{ maxHeight: 400 }}
                        PaperProps={{
                            sx: { paddingBottom: '0px', display: 'flex', flexDirection: 'column' }
                        }}
                    >
                        <Box flexGrow={1} sx={{ overflowY: 'auto', minWidth: 250 }}>
                            {props.options
                                ? props.options.map((x, idx) => (
                                    <MenuItem
                                        key={`ButtonMultiselect_${props.name}_${idx}`}
                                        onClick={() => onChange(handleToggle(value || [], x))}
                                    >
                                        <Checkbox
                                            checked={value ? value.indexOf(x[EntityWithIdFields.Id]) !== -1 : false}
                                        />
                                        <Typography>{x[EntityWithIdAndDescriptionFields.Description]}</Typography>
                                    </MenuItem>
                                ))
                                : options
                                    ? options.map((x, idx) => (
                                        <MenuItem
                                            key={`ButtonMultiselect_${props.name}_${idx}`}
                                            onClick={() => onChange(handleToggle(value || [], x))}
                                        >
                                            <Checkbox
                                                checked={value ? value.indexOf(x[EntityWithIdFields.Id]) !== -1 : false}
                                            />
                                            <Typography>{x[EntityWithIdAndDescriptionFields.Description]}</Typography>
                                        </MenuItem>
                                    ))
                                    : Array.from({ length: 3 }).map((_, idx) => (
                                        <MenuItem key={`ButtonMultiselect_loading_${props.name}_${idx}`}>
                                            <Skeleton variant={'text'} width={'100%'} />
                                        </MenuItem>
                                    ))}
                        </Box>

                        {count > 0 && (
                            <Box paddingY={1} sx={{
                                '&:hover': { backgroundColor: 'white !important' },
                                backgroundColor: 'white !important',
                                justifyContent: 'flex-end',
                                display: 'flex',
                                position: 'sticky',
                                zIndex: 1,
                                bottom: 0
                            }}>
                                <Button
                                    onClick={() => handleClear(onChange)}
                                    color="primary"
                                    size={"small"}
                                >
                                    Limpiar filtros
                                </Button>
                            </Box>
                        )}
                    </Menu>
                </React.Fragment>
            )}
        />
    );
};

export default ButtonMultiselect;
