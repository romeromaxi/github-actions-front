import {Stack, Button, Box, IconButton} from "@mui/material";
import {useFormContext} from "react-hook-form";
import {SolicitationFilterFields, SolicitationFilter} from "types/solicitations/solicitationData";
import React, {useEffect, useState, useRef} from "react";
import {HttpCacheSolicitation, HttpCacheOfferer, HttpCacheProductLine} from "http/index";
import {SolicitationFilterViewDTO, SolicitationFilterViewDTOFields} from "types/solicitations/solicitationApprovalData";
import {SolicitationFilterTypeCode} from "types/solicitations/solicitationFilterEnums";
import {AsyncSelect} from "components/forms/AsyncSelect";
import {ControlledTextFieldFilled} from "components/forms";
import {ControlledMultipleSelectAsync} from "components/forms/ControlledMultipleSelectAsync";
import {TypographyBase} from "components/misc/TypographyBase";
import {SearchIcon, Undo2Icon, XIcon} from "lucide-react";
import {EntityWithIdAndDescription} from "types/baseEntities";

interface OffererSolicitationHeaderProps {
    onSearch: (filter: SolicitationFilter) => void;
    totalRecords?: number;
    offererId: number;
}

interface FilterConfig {
    filterTypeCode: number;
    filterName: string;
}

function OffererSolicitationHeader({onSearch, totalRecords, offererId}: OffererSolicitationHeaderProps) {
    const methods = useFormContext<SolicitationFilter>();
    const {control, watch, handleSubmit, reset} = methods;

    const [availableFilters, setAvailableFilters] = useState<SolicitationFilterViewDTO[]>();
    const [selectedFilter, setSelectedFilter] = useState<FilterConfig | null>(null);
    const [searchExecuted, setSearchExecuted] = useState(false);
    const prevFilterCodeRef = useRef<number | undefined>();
    const [filterKeyVersion, setFilterKeyVersion] = useState<number>(0);

    const watchFilterCode = watch(SolicitationFilterFields.SolicitationFilterCode);
    const watchFilterContent = watch(SolicitationFilterFields.SolicitationFilterContent);

    useEffect(() => {
        HttpCacheSolicitation.getFilters().then((filters) => {
            setAvailableFilters(filters);
            if (filters && filters.length > 0 && !watchFilterCode) {
                methods.setValue(SolicitationFilterFields.SolicitationFilterCode, filters[0].id);
            }
        });
    }, []);

    useEffect(() => {
        if (watchFilterCode !== prevFilterCodeRef.current) {
            prevFilterCodeRef.current = watchFilterCode;
            setFilterKeyVersion(prev => prev + 1);
        }

        if (watchFilterCode) {
            const filter = availableFilters?.find((f) => f.id === watchFilterCode);
            if (filter) {
                const filterTypeCodeFromServer = filter[SolicitationFilterViewDTOFields.SolicitationFilterTypeCode];
                setSelectedFilter({
                    filterTypeCode: filterTypeCodeFromServer,
                    filterName: filter.descripcion,
                });
                reset({
                    [SolicitationFilterFields.SolicitationFilterCode]: watchFilterCode,
                    [SolicitationFilterFields.SolicitationFilterContent]: undefined
                });
                setSearchExecuted(false);
            }
        } else {
            setSelectedFilter(null);
            setSearchExecuted(false);
        }
    }, [watchFilterCode, availableFilters, reset]);

    useEffect(() => {
        const hasContent = watchFilterContent &&
            watchFilterContent !== '' &&
            (!Array.isArray(watchFilterContent) || watchFilterContent.length > 0);

        if (!hasContent && searchExecuted) {
            setSearchExecuted(false);
        }
    }, [watchFilterContent, searchExecuted]);

    const getLoadOptionsForFilter = (): (() => Promise<EntityWithIdAndDescription[]>) | undefined => {
        const filter = availableFilters?.find((f) => f.id === watchFilterCode);
        if (!filter) return undefined;

        switch (filter.id) {
            case 3:
                return () => HttpCacheProductLine.getProductLinesByOfferer(offererId);
            case 4:
                return () => HttpCacheOfferer.getResponsibles(offererId);
            case 5:
                return () => HttpCacheOfferer.getWorkTeams(offererId);
            case 7:
                return () => HttpCacheSolicitation.getSolicitationStatusesForOfferer();
            default:
                return undefined;
        }
    };

    const renderDynamicFilter = () => {
        if (!selectedFilter) return null;
        const {filterTypeCode} = selectedFilter;

        const hasContent = watchFilterContent &&
            watchFilterContent !== '' &&
            (!Array.isArray(watchFilterContent) || watchFilterContent.length > 0);

        switch (filterTypeCode) {
            case SolicitationFilterTypeCode.Text:
            case SolicitationFilterTypeCode.TextNumeric:
                return (
                    <Box sx={{width: 300, minWidth: 300, maxWidth: 300}}>
                        <ControlledTextFieldFilled
                            key={`text-${filterKeyVersion}`}
                            control={control}
                            name={SolicitationFilterFields.SolicitationFilterContent}
                            label={selectedFilter.filterName}
                            fullWidth
                            size="small"
                            InputProps={{
                                endAdornment: hasContent ? (
                                    <Box
                                        sx={{'&:hover': {cursor: 'pointer'}}}
                                    >
                                        <IconButton
                                            edge="end"
                                            size="small"
                                            tabIndex={-1}
                                            onMouseDown={(e) => e.preventDefault()}
                                            onClick={handleClear}
                                        >
                                            <XIcon size={16}/>
                                        </IconButton>
                                    </Box>
                                ) : undefined,
                            }}
                        />
                    </Box>
                );
            case SolicitationFilterTypeCode.MultipleSelect:
                const loadOptions = getLoadOptionsForFilter();
                if (!loadOptions) return null;

                return (
                    <Box sx={{width: 300, minWidth: 300, maxWidth: 300}}>
                        <ControlledMultipleSelectAsync
                            key={`select-${filterKeyVersion}`}
                            control={control}
                            name={SolicitationFilterFields.SolicitationFilterContent}
                            id="dynamic-filter"
                            fullWidth
                            label={selectedFilter.filterName}
                            loadOptions={loadOptions as () => Promise<EntityWithIdAndDescription[]>}
                        />
                    </Box>
                );
            default:
                return null;
        }
    };

    const onSubmit = () => {
        const filter: SolicitationFilter = {
            [SolicitationFilterFields.PageSize]: 100,
            [SolicitationFilterFields.CurrentPage]: 1,
        };

        const currentFilterContent = methods.getValues(SolicitationFilterFields.SolicitationFilterContent);

        if (selectedFilter && currentFilterContent !== undefined && currentFilterContent !== null && currentFilterContent !== '' &&
            (Array.isArray(currentFilterContent) ? currentFilterContent.length > 0 : true)) {
            filter[SolicitationFilterFields.SolicitationFilterCode] = watchFilterCode;
            filter[SolicitationFilterFields.SolicitationFilterContent] = currentFilterContent;
            setSearchExecuted(true);
        } else {
            setSearchExecuted(false);
        }

        onSearch(filter);
    };

    const handleClear = () => {
        methods.setValue(SolicitationFilterFields.SolicitationFilterContent, '');
        const filter: SolicitationFilter = {
            [SolicitationFilterFields.PageSize]: 100,
            [SolicitationFilterFields.CurrentPage]: 1,
            [SolicitationFilterFields.SolicitationFilterContent]: ''
        };

        setSearchExecuted(false);
        onSearch(filter);
    };

    return (
        <Stack spacing={3} width="100%">
            <Stack direction="row" justifyContent="space-between" alignItems="center" spacing={2}>
                <TypographyBase variant="h2">Solicitudes</TypographyBase>
                <Stack direction="row" spacing={2} alignItems="flex-end" justifyContent="flex-end" sx={{flex: 1}}>
                    <Box sx={{width: 200, minWidth: 200, maxWidth: 200}}>
                        <AsyncSelect
                            control={control}
                            name={SolicitationFilterFields.SolicitationFilterCode}
                            label="Buscar por"
                            loadOptions={HttpCacheSolicitation.getFilters}
                            fullWidth
                            disableEmpty
                        />
                    </Box>
                    {selectedFilter && renderDynamicFilter()}
                    <Button
                        variant="contained"
                        type="submit"
                        onClick={handleSubmit(onSubmit)}
                        sx={{height: 40, minWidth: 40, p: 0}}
                    >
                        <SearchIcon size={20}/>
                    </Button>
                </Stack>
            </Stack>

            {searchExecuted && selectedFilter && (totalRecords || 0) > 0 && (
                <Box
                    sx={{
                        backgroundColor: "rgb(238,238,238)",
                        borderRadius: 4,
                        p: 2,
                    }}
                >
                    <Stack direction="row" justifyContent="space-between" alignItems="center">
                        <Stack direction="row" alignItems="center" spacing={2}>
                            <TypographyBase
                                variant="h6"
                            >
                                Resultado de la búsqueda
                            </TypographyBase>
                            <Box sx={{
                                padding: 2,
                                backgroundColor: 'white !important',
                                borderRadius: '100px',
                                width: 24,
                                height: 24,
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center'
                            }}>
                                <TypographyBase variant="body3" color="text.lighter">
                                    {totalRecords || 0}
                                </TypographyBase>
                            </Box>
                        </Stack>
                        <Button
                            onClick={handleClear}
                            variant="text"
                            size="small"
                            sx={{color: "#4CAF50", textDecoration: "none", "&:hover": {textDecoration: "underline"}}}
                            startIcon={<Undo2Icon size={18}/>}
                        >
                            Volver a ver todas
                        </Button>
                    </Stack>
                </Box>
            )}
        </Stack>
    );
}


export default OffererSolicitationHeader;
