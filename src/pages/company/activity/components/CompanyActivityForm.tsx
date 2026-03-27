import React, {useContext, useEffect, useState} from 'react';
import {
    CompanyViewDTO,
    CompanyViewDTOFields,
} from 'types/company/companyData';
import {useFormContext} from 'react-hook-form';
import {
    HttpCompanyActivity,
    HttpCompanyAfipActivity,
} from 'http/company/httpCompanyActivity';
import {
    EntityWithIdAndDescriptionFields,
    EntityWithIdFields,
} from 'types/baseEntities';
import {HttpCacheCompany} from 'http/index';
import {
    CompanyActivityFields,
    CompanyAfipActivityFields,
    CompanyAfipActivityView,
} from 'types/company/companyActivityData';
import {Box, Button, Stack, Tooltip, Typography} from '@mui/material';
import {
    ControlledRadio,
    ControlledRadioYesNo,
    ControlledTextFieldFilled,
    RadioOption,
} from 'components/forms';
import CompanyActivityFormSkeleton from './CompanyActivityFormSkeleton';
import {DataWithLabel} from 'components/misc/DataWithLabel';
import CompanyAfipActivityDialog from '../CompanyAfipActivityDialog';
import {dateFormatter} from 'util/formatters/dateFormatter';
import {CardEditingContext} from 'components/cards/CardEditingWithContext';
import {BookTextIcon} from "lucide-react";

export enum CompanyActivityFormFields {
    HasLicense = 'tieneLicencia',
    Company = 'company',
}

interface CompanyActivityFormProps {
    company: CompanyViewDTO;
}

function CompanyActivityForm({company}: CompanyActivityFormProps) {
    const methods = useFormContext();
    const {editing} = useContext(CardEditingContext);
    const baseNameCompany: string = CompanyActivityFormFields.Company;
    const [loading, setLoading] = useState<boolean>(false);
    const [rangeRadioOptions, setRadioOptions] = useState<RadioOption[]>([]);
    const [showActivityTable, setShowActivityTable] = useState<boolean>(false);
    const [mainAfipActivity, setMainAfipActivity] =
        useState<CompanyAfipActivityView>();

    useEffect(() => {
        setLoading(true);
        Promise.all([
            HttpCompanyAfipActivity.getByCompanyId(company[EntityWithIdFields.Id]),
            HttpCompanyActivity.getByCompanyId(company[EntityWithIdFields.Id]),
            HttpCacheCompany.getRanges(),
        ]).then(([afipActivities, activity, companyRangeList]) => {
            methods.reset({
                ...methods.getValues(),
                ...activity,
                [CompanyActivityFormFields.HasLicense]:
                    activity[CompanyActivityFields.Licenses] !== null,
            });
            setMainAfipActivity(
                afipActivities.filter(
                    (a) => a[CompanyAfipActivityFields.IsMainActivity],
                )[0] ?? afipActivities[0],
            );
            setRadioOptions(
                companyRangeList.map((range) => ({
                    value: range[EntityWithIdFields.Id],
                    label: range[EntityWithIdAndDescriptionFields.Description],
                })),
            );
            setLoading(false);
            // value: any;
            // label: string;
            // description?: string
        });
    }, [company]);

    const onUpdateAfipActivity = (activity: CompanyAfipActivityView) => {
        HttpCompanyAfipActivity.updateAfipActivity(
            company[EntityWithIdFields.Id],
            activity[EntityWithIdFields.Id],
        ).then(() => {
            HttpCompanyAfipActivity.getByCompanyId(
                company[EntityWithIdFields.Id],
            ).then((res) => {
                setMainAfipActivity(
                    res.filter((x) => x[CompanyAfipActivityFields.IsMainActivity])[0] ??
                    res[0],
                );
            });
        });
    };

    return (
        <div>
            {loading ? (
                <CompanyActivityFormSkeleton/>
            ) : (
                <Stack direction={'column'} spacing={3} sx={{mt: 2}}>
                    <Box>
                        <Stack
                            direction={'row'}
                            justifyContent={'space-between'}
                            gap={2}
                            mb={1}
                        >
                            <Stack gap={2} mb={3}>
                                <Tooltip title={'Actividad inscripta en ARCA'}>
                                    <div>
                                        <DataWithLabel
                                            label={'Actividad'}
                                            data={
                                                mainAfipActivity?.[
                                                    CompanyAfipActivityFields.AfipActivityDesc
                                                    ]
                                            }
                                            rowDirection
                                        />
                                    </div>
                                </Tooltip>

                                <DataWithLabel
                                    label={'Rubro'}
                                    data={
                                        mainAfipActivity?.[CompanyAfipActivityFields.AfipSectorDesc]
                                    }
                                    rowDirection
                                />

                                <DataWithLabel
                                    label={'Sector'}
                                    data={
                                        mainAfipActivity?.[CompanyAfipActivityFields.AfipAreaDesc]
                                    }
                                    rowDirection
                                />

                                <DataWithLabel
                                    label={'Inicio de Actividad'}
                                    data={dateFormatter.toShortDate(
                                        mainAfipActivity?.[
                                            CompanyAfipActivityFields.ActivityStartDate
                                            ],
                                    )}
                                    rowDirection
                                />
                            </Stack>
                            <Stack alignSelf={'end'}>
                                <Button id={'company-activity-view-all-btn'}
                                        variant={'outlined'}
                                        color={'secondary'}
                                        size={'small'}
                                        startIcon={<BookTextIcon/>}
                                        disabled={!editing}
                                        onClick={() => setShowActivityTable(!showActivityTable)}
                                >
                                    Otras actividades
                                </Button>
                            </Stack>
                        </Stack>
                        <CompanyAfipActivityDialog
                            open={showActivityTable}
                            companyId={company[EntityWithIdFields.Id]}
                            action={onUpdateAfipActivity}
                            onClose={() => setShowActivityTable(false)}
                        />
                        <Stack direction="column" spacing={3}>
                            <ControlledTextFieldFilled
                                label="Descripción de la Actividad"
                                control={methods.control}
                                name={CompanyActivityFields.ActivityDesc}
                                multiline
                                rows={3}
                                maxRows={6}
                                disabled={!editing}
                            />
                            <ControlledTextFieldFilled
                                label="Fuente de Ingresos"
                                control={methods.control}
                                name={CompanyActivityFields.RevenueSource}
                                multiline
                                rows={3}
                                maxRows={6}
                                disabled={!editing}
                            />
                            <Stack spacing={3}>
                                <Stack direction="row" alignItems="center" spacing={1}>
                                    <ControlledRadioYesNo
                                        label="¿Es exportadora?"
                                        control={methods.control}
                                        setValue={methods.setValue}
                                        name={CompanyActivityFields.IsExporter}
                                        disabled={!editing}
                                        disabledAsInput
                                        row
                                    />

                                    <ControlledRadioYesNo
                                        label="¿Es empleadora?"
                                        control={methods.control}
                                        setValue={methods.setValue}
                                        name={CompanyActivityFields.IsEmployer}
                                        disabled={!editing}
                                        disabledAsInput
                                        row
                                    />
                                </Stack>
                                {/*<ControlledTextFieldFilled control={methods.control}
                                                               label={'Antigüedad (años)'}
                                                               name={`${baseNameCompany}.${CompanyViewDTOFields.CompanyAge}`}
                                                               fullWidth
                                    />*/}
                                <ControlledTextFieldFilled
                                    control={methods.control}
                                    label={'Cantidad Empleados'}
                                    name={`${baseNameCompany}.${CompanyViewDTOFields.NumberEmployees}`}
                                    fullWidth
                                    disabled={!editing}
                                />
                            </Stack>
                        </Stack>
                    </Box>

                    <Box sx={{pt: 4}}>
                        <Stack spacing={3}>
                            <Stack direction={'row'} alignItems={'center'} gap={2}>
                                <Typography
                                    fontSize={20}
                                    fontWeight={600}
                                >
                                    Clientes
                                </Typography>
                                <ControlledRadio
                                    row
                                    name={CompanyAfipActivityFields.RangeCustomersCode}
                                    control={methods.control}
                                    radioOptions={rangeRadioOptions}
                                    disabled={!editing}
                                />
                            </Stack>

                            <ControlledTextFieldFilled
                                label="Principal Cliente 1"
                                control={methods.control}
                                name={CompanyAfipActivityFields.MainCustomer1}
                                disabled={!editing}
                            />
                            <ControlledTextFieldFilled
                                label="Principal Cliente 2"
                                control={methods.control}
                                name={CompanyAfipActivityFields.MainCustomer2}
                                disabled={!editing}
                            />
                            <ControlledTextFieldFilled
                                label="Principal Cliente 3"
                                control={methods.control}
                                name={CompanyAfipActivityFields.MainCustomer3}
                                disabled={!editing}
                            />
                            <Stack direction={'row'} alignItems={'center'} gap={2}>
                                <Typography
                                    fontSize={20}
                                    fontWeight={600}
                                >
                                    Proveedores
                                </Typography>
                                <ControlledRadio
                                    row
                                    name={CompanyAfipActivityFields.RangeSuppliersCode}
                                    control={methods.control}
                                    radioOptions={rangeRadioOptions}
                                    disabled={!editing}
                                />
                            </Stack>

                            <ControlledTextFieldFilled
                                label="Principal Proveedor 1"
                                control={methods.control}
                                name={CompanyAfipActivityFields.MainSupplier1}
                                disabled={!editing}
                            />
                            <ControlledTextFieldFilled
                                label="Principal Proveedor 2"
                                control={methods.control}
                                name={CompanyAfipActivityFields.MainSupplier2}
                                disabled={!editing}
                            />
                            <ControlledTextFieldFilled
                                label="Principal Proveedor 3"
                                control={methods.control}
                                name={CompanyAfipActivityFields.MainSupplier3}
                                disabled={!editing}
                            />
                        </Stack>
                    </Box>
                </Stack>
            )}
        </div>
    );
}

export default CompanyActivityForm;
