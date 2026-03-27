import React, {useMemo} from 'react';
import {Card, CardContent, CardHeader, Stack} from "@mui/material";
import {BouncedChequeDetail, BouncedChequeDetailFields} from 'types/nosis/nosisData';
import {ITableColumn, TableColumnType, TableList} from 'components/table';
import {TypographyBase} from "components/misc/TypographyBase";

interface BouncedChequeTableProps {
    title?: string,
    subtitle?: string,
    bouncedCheques?: BouncedChequeDetail[];
    isLegalPerson: boolean;
    businessNamePerson?: string;
    loading: boolean;
    error: boolean;
}

const columnsBase: ITableColumn[] = [
    {
        label: 'Monto',
        value: BouncedChequeDetailFields.Amount,
        textAlign: 'left',
        textAlignHeader: 'left',
        type: TableColumnType.Currency,
    },
    {
        label: 'Fecha Pago',
        value: BouncedChequeDetailFields.PaymentDate,
        textAlign: 'left',
        textAlignHeader: 'left',
        type: TableColumnType.Date,
    },
    {
        label: 'Causal',
        textAlign: 'left',
        textAlignHeader: 'left',
        value: BouncedChequeDetailFields.Reason 
    },
    {
        label: 'Rechazo',
        value: BouncedChequeDetailFields.BounceDate,
        textAlign: 'left',
        textAlignHeader: 'left',
        type: TableColumnType.Date,
    },
    {
        label: 'Pago multa',
        value: BouncedChequeDetailFields.PenaltyPaymentDate,
        textAlign: 'left',
        textAlignHeader: 'left',
        type: TableColumnType.Date,
    }
];

const sortBouncedByDateDesc = (a: BouncedChequeDetail, b: BouncedChequeDetail) => {
  if (a[BouncedChequeDetailFields.BounceDate] > b[BouncedChequeDetailFields.BounceDate]) return -1;
  if (a[BouncedChequeDetailFields.BounceDate] < b[BouncedChequeDetailFields.BounceDate]) return 1;
  return 0;
}

function BouncedChequesTable({
    title, subtitle, bouncedCheques, isLegalPerson, businessNamePerson, loading, error,
}: BouncedChequeTableProps) {
    const bouncedChequesSorted = useMemo(() => 
            bouncedCheques?.sort(sortBouncedByDateDesc)
    , [bouncedCheques]);
    
    const columns: ITableColumn[] = !isLegalPerson ? [
        {
            label: 'Denominación', 
            value: BouncedChequeDetailFields.JudicialName,
            textAlign: "left", 
            onRenderCell: (e: BouncedChequeDetail) => (
                <Stack>
                    {e[BouncedChequeDetailFields.JudicialName] || businessNamePerson || '-'}

                    {
                        !!e[BouncedChequeDetailFields.ChequeNumber] &&
                            <TypographyBase variant={'body4'} fontWeight={400}>
                                {`Nro ${e[BouncedChequeDetailFields.ChequeNumber]}`}
                            </TypographyBase>
                    }
                </Stack>
            )
        },
        ...columnsBase] 
        : 
        columnsBase;

    const TableListComponent = () =>
        <TableList<BouncedChequeDetail> variant={'bureauStyle'}
                                        entityList={bouncedChequesSorted}
                                        columns={columns}
                                        isLoading={loading}
                                        error={error}
        />;
  
    return (
        !!title ?
            <Card>
                <CardHeader title={title}
                            subheader={subtitle}
                />

                <CardContent>
                    <TableListComponent />
                </CardContent>
            </Card>
            :
            <TableListComponent />
    );
}

export default BouncedChequesTable;
