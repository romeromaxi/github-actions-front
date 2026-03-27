import React, {useCallback, useEffect, useMemo, useState} from "react";
import {useLocation, useNavigate} from "react-router-dom";
import {useForm} from "react-hook-form";
import {AsyncSelectNew} from "components/forms/AsyncSelectNew";
import {Stack} from "@mui/material";
import {CompanyLogoById} from "./CompanyLogo";
import {PersonTypes} from "types/person/personEnums";
import {TypographyBase} from "components/misc/TypographyBase";
import {stringFormatter} from "util/formatters/stringFormatter";
import {AddButton} from "components/buttons/Buttons";
import {EntityWithIdAndDescription, EntityWithIdAndDescriptionFields} from "types/baseEntities";
import {CompanyFields, CompanyViewDTO, CompanyViewDTOFields} from "types/company/companyData";
import {HttpCompany} from "http/index";
import {useSnackbarActions} from "hooks/useSnackbarActions";
import {CryptoJSHelper} from "util/helpers";

interface CompanyUserSelectorProps {
    companyId: number
}

function CompanyUserSelector({ companyId }: CompanyUserSelectorProps) {
    const routerDomNavigate = useNavigate();
    const location = useLocation();
    const { addSnackbarSuccess } = useSnackbarActions();

    const [companies, setCompanies] = useState<CompanyViewDTO[]>();
    const methods = useForm<Record<string, any>>();

    const encryptedCurrentRoute = useMemo(() => {
        return CryptoJSHelper.encryptRoute(location.pathname ?? `/mis-empresas/${companyId}?tab=summary`);
    }, [location.pathname, companyId]);
    
    const loadCompaniesSelect = useCallback(() => {
        if (companies) {
            const sortedCompanies = [...companies].sort((a, b) => {
                if (a.id === companyId) return -1;
                if (b.id === companyId) return 1;
                return 0;
            });

            return Promise.resolve(
                sortedCompanies.map((x) => {
                    return {
                        [EntityWithIdAndDescriptionFields.Id]: x.id,
                        [EntityWithIdAndDescriptionFields.Description]: x[CompanyFields.BusinessName],
                        // @ts-ignore
                        personTypeCode: x[CompanyViewDTOFields.PersonTypeCode],
                        cuit: x[CompanyFields.CUIT]
                    } as EntityWithIdAndDescription;
                }),
            );
        }
        return Promise.resolve([]);
    }, [companies, companyId]);

    const onSaveLogo = (file: File) => {
        if (companyId) {
            HttpCompany.updateCompanyLogo(companyId, file)
                .then(() => addSnackbarSuccess("La foto de perfil se ha actualizado con éxito!"))
        }
    };

    const onSelectCompany = (id?: string) => {
        if (id === undefined || id === null || id === '') {
            return;
        }

        const parsed = parseInt(id as string);
        const isValidNumber = !isNaN(parsed);

        if (isValidNumber && parsed !== companyId) {
            routerDomNavigate(`/mis-empresas/${parsed}?tab=summary`, { replace: true });
        }
    };

    const handleNewCompany = () => {
        routerDomNavigate({
            pathname: `/nueva-pyme`,
            search: `?redirect=${encryptedCurrentRoute}`
        });
    };

    const loadCompanies = useCallback(async () => {
        HttpCompany.getCompaniesByUser()
            .then(setCompanies)
    }, []);

    useEffect(() => {
        loadCompanies();
    }, [loadCompanies]);
    
    useEffect(() => {
        if (companyId && companies) {
            methods.setValue('selectedCompany', companyId.toString());
        }
    }, [companyId, companies, methods]);
    
    return (
        <AsyncSelectNew
            // @ts-ignore
            loadOptions={loadCompaniesSelect}
            onChangeSelect={onSelectCompany}
            control={methods.control}
            name={'selectedCompany'}
            companyId={companyId?.toString()}
            label={''}
            labelVariant={"h4"}
            maxWidth={'450px'}
            customTitleRender={(option) => {
                if (!option) {
                    return null;
                }

                // @ts-ignore
                const personTypeCode = option.personTypeCode;
                const companyIdOption = option.id;

                return (
                    <Stack direction='row' alignItems='center' spacing={2}>
                        <CompanyLogoById
                            companyId={companyIdOption}
                            isPhysicalPerson={personTypeCode === PersonTypes.Physical}
                            size={'lg'}
                            onSaveLogo={onSaveLogo}
                        />
                        <TypographyBase variant="h5" maxLines={2} tooltip>
                            {option.descripcion}
                        </TypographyBase>
                    </Stack>
                );
            }}
            customMenuItemRender={(option) => {
                // @ts-ignore
                const personTypeCode = option.personTypeCode;
                // @ts-ignore
                const cuit = option.cuit;
                const companyIdOption = option.id;

                return (
                    <Stack direction='row' alignItems='center' spacing={2} sx={{ py: 1, overflow: 'hidden' }}>
                        <CompanyLogoById
                            companyId={companyIdOption}
                            isPhysicalPerson={personTypeCode === PersonTypes.Physical}
                            size={'sm'}
                        />
                        <Stack sx={{ overflow: 'hidden'}}>
                            <TypographyBase variant="button2"
                                            fontWeight={600}
                                            color={'text.main'}
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
            customLastMenuItemRender={() => (
                <AddButton
                    variant='text'
                    size='medium'
                    onClick={handleNewCompany}
                    fullWidth
                >
                    Vincular nueva PyME
                </AddButton>
            )}
        />
    );
}

export default CompanyUserSelector;