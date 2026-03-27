import DrawerBase from "../../../../components/misc/DrawerBase";
import {SendButton} from "../../../../components/buttons/Buttons";
import {CompanyForm, CompanyViewDTOFields} from "../../../../types/company/companyData";
import React, {useEffect, useState} from "react";
import * as yup from "yup";
import {useForm} from "react-hook-form";
import {yupResolver} from "@hookform/resolvers/yup/dist/yup";
import {EntityWithIdFields} from "../../../../types/baseEntities";
import {HttpCompany, HttpCompanyDeclarationOfAssets, HttpCompanyFinance} from "../../../../http";
import {
    CompanyDeclarationOfAssets,
    CompanyDeclarationOfAssetsFields,
    CompanyDeclarationOfAssetsInsert,
    CompanyDeclarationOfAssetsInsertFields,
    CompanyFinanceHeaderFields,
    CompanyFinancialYearFields
} from "../../../../types/company/companyFinanceInformationData";
import {useAction} from "../../../../hooks/useAction";
import {ControlledTextFieldFilled} from "../../../../components/forms";
import {LoaderBlockUI} from "../../../../components/loader";
import {RequiredPositiveNumberSchema} from "../../../../util/validation/validationSchemas";


interface CompanyEconomicFinancialDateChangeDrawerProps {
    open: boolean,
    onClose: () => void,
    company: CompanyForm
    physicalPerson: boolean,
    declarationOfAssets?: CompanyDeclarationOfAssets,
    onReload: () => void
}


const CompanyEconomicFinancialDateChangeDrawer = ({open, onClose, company, physicalPerson, declarationOfAssets, onReload} : CompanyEconomicFinancialDateChangeDrawerProps) => {
    
    
    return (
        <DrawerBase show={open}
                    onCloseDrawer={onClose}
                    title={physicalPerson ? 'Cambiar última manifestación de bienes' : 'Cambiar año de último balance cerrado'}
                    action={<SendButton type='submit' form={physicalPerson ? 'financialYear-physical-form' : 'financialYear-legal-form'}>Enviar</SendButton>}
        >
            {physicalPerson ? <CompanyDeclarationOfAssetsYearForm companyId={company[EntityWithIdFields.Id]} onReload={onReload} declarationOfAssets={declarationOfAssets}/> : <CompanyBalanceYearForm company={company} onReload={onReload}/>}
        </DrawerBase>
    )
}

interface CompanyChangeYearPhysicalFormProps {
    companyId: number,
    onReload: () => void,
    declarationOfAssets?: CompanyDeclarationOfAssets
}

const CompanyDeclarationOfAssetsYearForm = ({companyId, onReload, declarationOfAssets}:CompanyChangeYearPhysicalFormProps) => {
    const [isLoading, setLoading] = useState<boolean>(false);
    const { snackbarSuccess } = useAction();

    const lastYearFormSchema = yup.object().shape({
        [CompanyDeclarationOfAssetsInsertFields.Year]: RequiredPositiveNumberSchema
    });

    const { control, reset, handleSubmit, clearErrors, watch } =
        useForm<CompanyDeclarationOfAssetsInsert>({
            resolver: yupResolver(lastYearFormSchema),
        });
    const watchDate = watch(CompanyDeclarationOfAssetsInsertFields.Year);

    const onHandleSubmit = (data: CompanyDeclarationOfAssetsInsert) => {
        setLoading(true);

        HttpCompanyDeclarationOfAssets.insert(companyId, data).then(() => {
            setLoading(false);
            onReload();
            snackbarSuccess('Se cambió la fecha de última manifestación de bienes');
        });
    };

    useEffect(() => {
        reset({
            [CompanyDeclarationOfAssetsInsertFields.Date]: declarationOfAssets?.[CompanyDeclarationOfAssetsFields.Date],
        });
    }, [declarationOfAssets]);

    useEffect(() => {
        clearErrors(CompanyFinanceHeaderFields.Date);
    }, [watchDate]);
    
    return (
        <form id={'financialYear-physical-form'} onSubmit={handleSubmit(onHandleSubmit)}>
            <ControlledTextFieldFilled
                control={control}
                name={CompanyDeclarationOfAssetsInsertFields.Year}
                label="Año de la manifestación de bienes"
                helperText={'Formato YYYY'}
            />
            {isLoading && <LoaderBlockUI />}
        </form>
    )
}


enum LastYearFormFields {
    Year = 'year',
}

interface LastYearForm {
    [LastYearFormFields.Year]?: string;
}

interface CompanyChangeYearLegalFormProps {
    company: CompanyForm,
    onReload: () => void,
}
const CompanyBalanceYearForm = ({company, onReload}:CompanyChangeYearLegalFormProps) => {
    const [isLoading, setLoading] = useState<boolean>(false);
    const {snackbarSuccess} = useAction()

    const lastYearFormSchema = yup.object().shape({
        [LastYearFormFields.Year]: yup
            .string()
            .required('Campo obligatorio')
            .length(4, 'Deben ser 4 dígitos')
            .test('AñoPasado', 'El año no puede superar al corriente', (value) => {
                return !!value && new Date().getFullYear() >= parseInt(value);
            })
            .test(
                'FechaCierre',
                'La fecha de cierre no puede ser posterior a la fecha actual',
                (value) => {
                    if (!value || !company) return false;
                    if (
                        !!company[CompanyViewDTOFields.MonthClosing] &&
                        !!company[CompanyViewDTOFields.DayClosing]
                    ) {
                        let lastDate: Date = new Date(
                            parseInt(value),
                            // @ts-ignore
                            company[CompanyViewDTOFields.MonthClosing] - 1,
                            company[CompanyViewDTOFields.DayClosing],
                        );

                        return new Date() >= lastDate;
                    }

                    return false;
                },
            ),
    });

    const { control, reset, handleSubmit } = useForm<LastYearForm>({
        resolver: yupResolver(lastYearFormSchema),
    });

    const onHandleSubmit = (data: LastYearForm) => {
        let year: number = parseInt(data[LastYearFormFields.Year] || '0');

        if (company && company[EntityWithIdFields.Id] && year) {
            setLoading(true);
            Promise.all([
                HttpCompany.updateLastFinancialYear(
                    company[EntityWithIdFields.Id],
                    year,
                ),
                HttpCompanyFinance.insert(company[EntityWithIdFields.Id], {
                    [CompanyFinancialYearFields.Year]: year,
                }),
                HttpCompanyFinance.insert(company[EntityWithIdFields.Id], {
                    [CompanyFinancialYearFields.Year]: year - 1,
                })
            ]).then(() => {
                onReload();
                snackbarSuccess('Se cambió el año de último balance');
                setLoading(false);
            });
        }
    };

    useEffect(() => {
        if (company && company[EntityWithIdFields.Id]) {
            let lastYear: number | undefined =
                company[CompanyViewDTOFields.YearLastClosing];

            if (lastYear)
                reset({
                    [LastYearFormFields.Year]: lastYear.toString(),
                });
        }
    }, [company]);
    
    return (
        <form id={'financialYear-legal-form'} onSubmit={handleSubmit(onHandleSubmit)}>
            <ControlledTextFieldFilled control={control}
                                       name={LastYearFormFields.Year}
                                       disabled={isLoading}
                                       label={'Ingrese nuevo año de último balance'}
                                       fullWidth
            />
            {isLoading && <LoaderBlockUI />}
        </form>
    )
}


export default CompanyEconomicFinancialDateChangeDrawer