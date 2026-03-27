import {Control, Controller} from "react-hook-form";
import {
    EntityWithIdAndDescription,
    EntityWithIdAndDescriptionFields,
    EntityWithIdFields
} from "../../types/baseEntities";
import {useEffect, useRef, useState} from "react";
import {Badge, Box, Button, Checkbox, Menu, MenuItem, Stack, Typography} from "@mui/material";
import {WrapperIcons} from "../icons/Icons";
import {CaretDown} from "@phosphor-icons/react";
import {Skeleton} from "@mui/lab";
import {stringFormatter} from "../../util/formatters/stringFormatter";


interface ChipMultiselectProps {
    control: Control,
    name: string,
    label: string,
    loadOptions?: () => Promise<any[]>,
    options?: EntityWithIdAndDescription[]
}


const ChipMultiselect = (props: ChipMultiselectProps) => {
    const [options, setOptions] = useState<EntityWithIdAndDescription[]>([]);
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
    const anchorRef = useRef<HTMLDivElement>(null);
    const [count, setCount] = useState<number>(0);
    const openMenu = Boolean(anchorEl);

    const onOpenMenu = () => setAnchorEl(anchorRef.current ?? null);

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
                <Stack
                    ref={anchorRef}
                    direction='row'
                    alignItems='center'
                    spacing={1.5}
                    onClick={onOpenMenu}
                    sx={{
                        padding: '12px',
                        borderRadius: '100px',
                        backgroundColor: '#F7FAFC',
                        transition: 'all 0.3s ease-in-out',
                        cursor: 'pointer',
                        '&:hover': {
                            backgroundColor: '#e4eafc',
                        },
                        maxWidth: '215px !important'
                    }}
                >
                    <Typography variant={'caption'} color={'black'}>
                        {stringFormatter.cutIfHaveMoreThan(props.label, 18)}
                    </Typography>
                    <Stack direction='row' alignItems={'center'} spacing={2}>
                        { !!count && <Badge badgeContent={count} color={'primary'} /> }
                        
                        <WrapperIcons Icon={CaretDown} size={'sm'} />
                    </Stack>
                    <Menu
                        anchorEl={anchorEl}
                        open={openMenu}
                        onClose={onCloseMenu}
                        anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
                        transformOrigin={{ vertical: 'top', horizontal: 'right' }}
                        MenuListProps={{ onMouseLeave: onCloseMenu }}
                        sx={{ maxHeight: 400 }}
                        PaperProps={{
                            sx: { paddingBottom: '0px', display: 'flex', flexDirection: 'row' }
                        }}
                    >
                        <Box flexGrow={1} sx={{ overflowY: 'auto' }}>
                            {props.options
                                ? props.options.map((x, idx) => (
                                    <MenuItem
                                        key={`MarketLookingFilterWithMenu_${props.name}_${idx}`}
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
                                            key={`MarketLookingFilterWithMenu_${props.name}_${idx}`}
                                            onClick={() => onChange(handleToggle(value || [], x))}
                                        >
                                            <Checkbox
                                                checked={value ? value.indexOf(x[EntityWithIdFields.Id]) !== -1 : false}
                                            />
                                            <Typography>{x[EntityWithIdAndDescriptionFields.Description]}</Typography>
                                        </MenuItem>
                                    ))
                                    : Array.from({ length: 3 }).map((_, idx) => (
                                        <MenuItem key={`MarketLookingFilterWithMenuLoading_${props.name}_${idx}`}>
                                            <Skeleton variant={'text'} width={'100%'} />
                                        </MenuItem>
                                    ))}
                        </Box>

                        <Box paddingY={1} sx={{'&:hover': {backgroundColor: 'white !important'},
                            backgroundColor: 'white !important', justifyContent: 'flex-end', 
                            display: 'flex', position: 'sticky', zIndex: 1, bottom: 0
                        }}>
                            <Button onClick={() => handleClear(onChange)} color="primary" size={"small"} disabled={count == 0}>
                                Limpiar filtros
                            </Button>
                        </Box>
                    </Menu>
                </Stack>
            )}
        />
    );
};



export default ChipMultiselect