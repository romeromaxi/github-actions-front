import {AsyncSelectNew} from "components/forms/AsyncSelectNew";
import {Box, Button, Stack} from "@mui/material";
import {useForm} from "react-hook-form";
import {CompanyFields, CompanyViewDTO, CompanyViewDTOFields} from "types/company/companyData";
import {useCallback, useEffect, useMemo, useRef, useState} from "react";
import {
    BaseRequestFields,
    EntityWithIdAndDescription,
    EntityWithIdAndDescriptionFields
} from "types/baseEntities";
import {ArchiveXIcon, SendIcon} from "lucide-react";
import {
    GeneralSolicitationFilter,
    GeneralSolicitationFilterFields,
    SolicitationCancelMultiple, SolicitationCancelMultipleFields,
    SolicitationFilterFields,
    SolicitationViewDTO,
    SolicitationViewDTOFields
} from "types/solicitations/solicitationData";
import {SendButtonNew} from "components/buttons/Buttons";
import {SolicitationClassificationTypesStatusType, SolicitationTypes} from "types/solicitations/solicitationEnums";
import {CompanyFileType} from "types/company/companyEnums";
import {
    MarketSolicitationFields,
    marketSolicitationStorage
} from "util/sessionStorage/marketSolicitationStorage";
import {useNavigate} from "react-router-dom";
import {CompanyLogoById} from "../../../company/components/CompanyLogo";
import {PersonTypes} from "types/person/personEnums";
import {TypographyBase} from "components/misc/TypographyBase";
import {stringFormatter} from "util/formatters/stringFormatter";
import {themeColorDefinition} from "util/themes/definitions";
import {WrapperIcons} from "components/icons/Icons";
import {useTheme} from "@mui/material/styles";
import useAxios from "hooks/useAxios";
import {HttpSolicitation} from "http/index";
import {useSnackbarActions} from "hooks/useSnackbarActions";
import {DialogAlert} from "components/dialog";


interface UserSolicitationsFormProps {
    onSearch: (filter: Partial<GeneralSolicitationFilter>) => void,
    companies?: CompanyViewDTO[],
    selectedSolicitations: SolicitationViewDTO[],
    selectedCompanyId?: number,
    setComboSelectedCompany?: (value: boolean) => void
}

const UserSolicitationsForm = ({onSearch, companies, selectedSolicitations, selectedCompanyId, setComboSelectedCompany} : UserSolicitationsFormProps) => {
    const theme = useTheme();
    const methods = useForm<Record<string, any>>()
    const prevValuesRef = useRef<string>('')
    const watchValues = methods.watch()
    const watchCompany = methods.watch(GeneralSolicitationFilterFields.CompanyIds)
    const navigate = useNavigate();
    const { fetchData } = useAxios();
    const { addSnackbarSuccess } = useSnackbarActions();
    const [openDeleteConfirmDialog, setOpenDeleteConfirmDialog] = useState<boolean>(false);
    
    const loadCompaniesSelect = useCallback(() => {
        if (companies) {
            return Promise.resolve([
                {
                    [EntityWithIdAndDescriptionFields.Id]: 0,
                    [EntityWithIdAndDescriptionFields.Description]: 'Todas las solicitudes',
                    // @ts-ignore
                    personTypeCode: undefined
                } as EntityWithIdAndDescription,
                ...companies.map((x) => {
                    return {
                        [EntityWithIdAndDescriptionFields.Id]: x.id,
                        [EntityWithIdAndDescriptionFields.Description]:
                            x[CompanyFields.BusinessName],
                        // @ts-ignore
                        personTypeCode: x[CompanyViewDTOFields.PersonTypeCode],
                        cuit: x[CompanyFields.CUIT]
                    } as EntityWithIdAndDescription;
                }),
            ]);
        }
    }, [companies])

    useEffect(() => {
        const currentValuesString = JSON.stringify(watchValues);
        
        if (prevValuesRef.current && prevValuesRef.current !== currentValuesString) {
            onSearch({
                ...watchValues,
                [SolicitationFilterFields.CurrentPage]: 1
            } as Partial<GeneralSolicitationFilter>);
        } else if (!prevValuesRef.current) {
            onSearch(watchValues as Partial<GeneralSolicitationFilter>);
        }

        prevValuesRef.current = currentValuesString;
    }, [watchValues, onSearch]);

    const onSelectCompany = (id?: string) => {
        if (id === undefined || id === null || id === '' ) {
            if (setComboSelectedCompany) setComboSelectedCompany(false);
            methods.setValue(GeneralSolicitationFilterFields.CompanyIds, [])
            return;
        }

        const parsed = parseInt(id as string);
        const isValidNumber = !isNaN(parsed);
        const comboSelected = isValidNumber && parsed !== 0;

        if (setComboSelectedCompany) setComboSelectedCompany(comboSelected);

        methods.setValue(GeneralSolicitationFilterFields.CompanyIds, comboSelected ? [parsed] : [])
    }

    const canDeleteSelected = useMemo(() => (
        false
        /*selectedSolicitations.length > 0 && selectedSolicitations.every(
            s => {
                const classType = s[SolicitationViewDTOFields.CompanySolicitationClassificationStatusTypeCod] as SolicitationClassificationTypesStatusType | undefined;
                return classType === SolicitationClassificationTypesStatusType.InCart;
            }
        )*/
    ), []);

    const canSendSelected = useMemo(() => (
        selectedSolicitations.length > 0 && selectedSolicitations.every(
            s => {
                const classType = s[SolicitationViewDTOFields.CompanySolicitationClassificationStatusTypeCod] as SolicitationClassificationTypesStatusType | undefined;
                return classType === SolicitationClassificationTypesStatusType.InCart;
            }
        )
    ), [selectedSolicitations]);
    
    const showDeleteConfirmDialog = () => setOpenDeleteConfirmDialog(true);
    
    const closeDeleteConfirmDialog = () => setOpenDeleteConfirmDialog(false);
    
    const handleDeleteSelected = () => {
        if (!selectedCompanyId || selectedSolicitations.length === 0) return;

        const solicitationToCancel : SolicitationCancelMultiple = {
            [SolicitationCancelMultipleFields.SolicitationsIdsList]: selectedSolicitations.map(s => s.id),
            [BaseRequestFields.ModuleCode]: 1,
            [BaseRequestFields.OriginCode]: 1
        }

        fetchData(
            () => HttpSolicitation.cancelMultipleSolicitations(solicitationToCancel),
            true
        )
            .then(() => {
                addSnackbarSuccess("Las solicitudes fueron canceladas con éxito");
                setOpenDeleteConfirmDialog(false);
                onSearch({
                    ...watchValues,
                    [SolicitationFilterFields.CurrentPage]: 1
                } as Partial<GeneralSolicitationFilter>);
            })
    }
    
    const handleSendSelected = () => {
        if (!canSendSelected || !selectedCompanyId || selectedSolicitations.length === 0) return;
        
        const solicitationIds = selectedSolicitations.map(s => s.id);
        const referenceSolicitation = selectedSolicitations[0];
        const solicitationType = referenceSolicitation[SolicitationViewDTOFields.SolicitationTypeCode] ?? SolicitationTypes.General;
        const fileType = referenceSolicitation[SolicitationViewDTOFields.FileTypeCode] ?? CompanyFileType.Long;
        
        marketSolicitationStorage.setCurrentSolicitation({
            [MarketSolicitationFields.CompanyId]: selectedCompanyId,
            [MarketSolicitationFields.SolicitationIdList]: solicitationIds,
            [MarketSolicitationFields.SolicitationType]: solicitationType,
            [MarketSolicitationFields.FileType]: fileType,
        });
        
        navigate(`/market/lines/${selectedCompanyId}/prequalification`);
    }
    
    return (
        <Stack direction="row" alignItems="center" spacing={2} sx={{ width: '100%' }}>
            <Box sx={{ flex: 1 }}>
                <AsyncSelectNew 
                                // @ts-ignore
                                loadOptions={loadCompaniesSelect}
                                onChangeSelect={onSelectCompany}
                                control={methods.control}
                                name={GeneralSolicitationFilterFields.CompanyIds}
                                label={!!watchCompany ? watchCompany.length !== 0 ? '' : 'Todas las solicitudes' : 'Todas las solicitudes'}
                                labelVariant={"h4"}
                                maxWidth={'350px'}
                                customTitleRender={(option, label) => {
                                    if (!option || option.id === 0) {
                                        return (
                                            <Stack direction='row' alignItems='center' spacing={2}>
                                                <WrapperIcons Icon={SendIcon} size={'lg'} 
                                                              color={theme.palette.primary.dark} />
                                                
                                                <TypographyBase variant="h4" maxLines={2} tooltip>
                                                    {label}
                                                </TypographyBase>
                                            </Stack>
                                        );
                                    }
                                    
                                    // @ts-ignore
                                    const personTypeCode = option.personTypeCode;
                                    const companyId = option.id;
                                    
                                    return (
                                        <Stack direction='row' alignItems='center' spacing={2}>
                                            <CompanyLogoById 
                                                companyId={companyId}
                                                isPhysicalPerson={personTypeCode === PersonTypes.Physical}
                                                size={'md'}
                                            />
                                            <TypographyBase variant="h4" maxLines={2} tooltip>
                                                {`Solicitudes de ${option.descripcion}`}
                                            </TypographyBase>
                                        </Stack>
                                    );
                                }}
                                customMenuItemRender={(option) => {
                                    // @ts-ignore
                                    const personTypeCode = option.personTypeCode;
                                    // @ts-ignore
                                    const cuit = option.cuit;
                                    const companyId = option.id;
                                    
                                    if (companyId === 0) {
                                        return (
                                            <Stack direction='row' alignItems='center' spacing={2} sx={{ py: 1, overflow: 'hidden' }}>
                                                <SendIcon color="#006A39" size={20} />
                                                <TypographyBase variant="button2"
                                                                fontWeight={600}
                                                                color={'#232926'}
                                                                maxLines={1}
                                                                tooltip
                                                >
                                                    {option.descripcion}
                                                </TypographyBase>
                                            </Stack>
                                        );
                                    }
                                    
                                    return (
                                        <Stack direction='row' alignItems='center' spacing={2} sx={{ py: 1, overflow: 'hidden' }}>
                                            <CompanyLogoById 
                                                companyId={companyId}
                                                isPhysicalPerson={personTypeCode === PersonTypes.Physical}
                                                size={'sm'}
                                            />
                                            <Stack sx={{ overflow: 'hidden'}}>
                                                <TypographyBase variant="button2"
                                                                fontWeight={600}
                                                                color={themeColorDefinition.UIElements.texts.main}
                                                                maxLines={1}
                                                                tooltip
                                                >
                                                    {option.descripcion}
                                                </TypographyBase>
                                                <TypographyBase variant="body4" color="text.lighter" fontWeight={500}>
                                                    {cuit ? stringFormatter.formatCuit(cuit) : '-'}
                                                </TypographyBase>
                                            </Stack>
                                        </Stack>
                                    );
                                }}
                />
            </Box>
            <Box sx={{ display: 'flex', gap: 2 }}>
                {selectedSolicitations.length > 0 && (
                    <>
                        {
                            canDeleteSelected &&
                                <Button variant="outlined" color={'secondary'} size="small" onClick={showDeleteConfirmDialog} startIcon={<ArchiveXIcon />}>
                                    Descartar seleccionadas
                                </Button>
                        }
                        
                        {canSendSelected && (
                            <SendButtonNew size="small" onClick={handleSendSelected}>
                                Enviar seleccionadas
                            </SendButtonNew>
                        )}
                    </>
                )}
            </Box>

            <DialogAlert open={openDeleteConfirmDialog}
                         onClose={closeDeleteConfirmDialog} 
                         title={'Cancelar solicitudes'} 
                         textContent={`¿Estás seguro que deseás cancelar las solicitudes seleccionadas?`} 
                         onConfirm={handleDeleteSelected}
                         severity={'error'}
            />
        </Stack>
    )
}


export default UserSolicitationsForm