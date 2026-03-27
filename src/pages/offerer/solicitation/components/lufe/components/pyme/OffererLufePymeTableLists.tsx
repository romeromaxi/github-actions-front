import {Divider, Stack, Typography} from "@mui/material";
import {ITableColumn, TableColumnType, TableList} from "components/table";
import {
    LufePymeActivity,
    LufePymeActivityFields,
    LufePymeEmployment,
    LufePymeEmploymentFields,
    LufePymeRequest,
    LufePymeRequestFields,
    LufePymeTax,
    LufePymeTaxFields
} from "types/lufe/lufePymeData";
import React, {useMemo} from "react";
import {dateFormatter} from "util/formatters/dateFormatter";


interface OffererLufePymeTableListsProps {
    loading: boolean,
    error: boolean,
    pymeData?: LufePymeRequest
}


const OffererLufePymeTableLists = ({loading, error, pymeData} : OffererLufePymeTableListsProps) => {
    const employmentSorted = useMemo(() => {
        return [...(pymeData?.[LufePymeRequestFields.Employment] || [])].reverse();
    }, [pymeData]);
    
    const taxCols: ITableColumn[] = [
        {label: 'Impuesto', value: LufePymeTaxFields.TaxDesc, textAlign: 'left'},
        {label: 'Estado', value: LufePymeTaxFields.StateDesc},
        //{label: 'Origen', value: LufePymeTaxFields.Origin},
        //{label: 'Identif. Estado', value: LufePymeTaxFields.CurrentIdentificationState},
        {
            label: 'Periodo', value: LufePymeTaxFields.CurrentPeriod,
            onRenderCell: (entity: LufePymeTax) => (
                <React.Fragment>{dateFormatter.parsePeriod(entity[LufePymeTaxFields.CurrentPeriod])}</React.Fragment>
            )
        },
        {label: 'Fecha act.', value: LufePymeTaxFields.UpdateDate, type: TableColumnType.Date}
    ]

    const activityCols: ITableColumn[] = [
        {label: 'Actividad', value: LufePymeActivityFields.ActivityDesc, textAlign: 'left'},
        {label: 'Estado', value: LufePymeActivityFields.StateDesc},
        //{label: 'Origen', value: LufePymeActivityFields.Origin},
        {
            label: 'Vigente', value: LufePymeActivityFields.Current,
            onRenderCell: (entity: LufePymeActivity) => (
                <React.Fragment>{
                    entity[LufePymeActivityFields.Current] === 'S' ? 'Si' : 'No'
                }</React.Fragment>
            )
        },
        {
            label: 'Período vigencia', value: LufePymeActivityFields.CurrentPeriod,
            onRenderCell: (entity: LufePymeActivity) => (
                <React.Fragment>{dateFormatter.parsePeriod(entity[LufePymeActivityFields.CurrentPeriod])}</React.Fragment>
            )
        },
        {label: 'Fecha act.', value: LufePymeActivityFields.UpdateDate, type: TableColumnType.Date}
    ]

    const employmentCols: ITableColumn[] = [
        {
            label: 'Periodo', value: LufePymeEmploymentFields.Period,
            onRenderCell: (entity: LufePymeEmployment) => (
                <React.Fragment>{dateFormatter.parsePeriod(entity[LufePymeEmploymentFields.Period])}</React.Fragment>
            )
        },
        {label: 'Fecha pres.', value: LufePymeEmploymentFields.PresentationDate, type: TableColumnType.Date},
        {label: 'Nro. rectif.', value: LufePymeEmploymentFields.RectificationNumber},
        {label: 'Cant. empleados', value: LufePymeEmploymentFields.EmployeeQuantity},
        {label: 'Masa salarial bruta', value: LufePymeEmploymentFields.GrossSalaryMass, type: TableColumnType.Currency}
    ]
    
    
    return (
        <Stack spacing={2}>
            <Typography variant='h5'>Impuestos</Typography>
            <TableList<LufePymeTax> entityList={pymeData?.[LufePymeRequestFields.Taxes]}
                                    columns={taxCols}
                                    isLoading={loading}
                                    error={error}
            />
            <Divider />
            <Typography variant='h5'>Actividades</Typography>
            <TableList<LufePymeActivity> entityList={pymeData?.[LufePymeRequestFields.Activities]}
                                         columns={activityCols}
                                         isLoading={loading}
                                         error={error}
            />
            <Divider />
            <Typography variant='h5'>Empleo</Typography>
            <TableList<LufePymeEmployment> entityList={employmentSorted}
                                           columns={employmentCols}
                                           isLoading={loading}
                                           error={error}
            />
        </Stack>
    )
}


export default OffererLufePymeTableLists