import React, { useContext } from 'react';
import {
    CurrentDebtDetail,
    CurrentDebtDetailFields,
    SituationType,
    SituationTypeFields,
} from 'types/nosis/nosisData';
import {ITableColumn, TableColumnType, TableList} from 'components/table';
import {Box, Card, CardContent, CardHeader, Stack, Tooltip} from '@mui/material';
import { SituationColorMap } from 'util/typification/situationColor';
import { EntityWithIdAndDescriptionFields } from 'types/baseEntities';
import {BureauInformationContext} from "hooks/contexts/BureauInformationContext";
import {TypographyBase} from "components/misc/TypographyBase";
import EntitySituationBadge from "./EntitySituationBadge";

interface BCRAQuantityTableProps {
    title?: string;
    subtitle?: string;  
    debtList?: CurrentDebtDetail[];
    loading: boolean;
    error: boolean;
}

function BCRAQuantityTable({title, subtitle, debtList, loading, error }: BCRAQuantityTableProps) {
    const { situationTypes, unknownSituationType } = useContext(BureauInformationContext);
    
    const columns: ITableColumn[] = [
        {
            label: 'Entidad', 
            textAlignHeader: 'left',
            textAlign: 'left', 
            onRenderCell: (debtDetail) => (
                <span>{debtDetail[CurrentDebtDetailFields.Entity].toUpperCase()}</span>
            ),
        }, 
        {
            label: 'Situación', 
            textAlignHeader: 'left',
            textAlign: 'left',
            onRenderCell: (debtDetail: CurrentDebtDetail) => {
                const code = debtDetail[CurrentDebtDetailFields.SituationCode];
                const type: SituationType = situationTypes?.find((s) => s.id === code) || unknownSituationType;
                  
                return (
                    <Tooltip title={type?.[SituationTypeFields.LongDesc] || '-'}>
                        <Stack direction={'row'} 
                               spacing={1}
                               alignItems={'center'}
                        >
                            <EntitySituationBadge situationCode={code}
                                                  size={'medium'}
                            />
                            
                            <TypographyBase variant={'body3'} fontWeight={600}
                                            color={SituationColorMap?.[code]?.dark}
                            >
                                {type?.[EntityWithIdAndDescriptionFields.Description] || '-'}
                            </TypographyBase>
                        </Stack>
                    </Tooltip>
                )},
        }, 
        {
            label: 'Monto',
            value: CurrentDebtDetailFields.Amount,
            textAlignHeader: 'right',
            textAlign: 'right',
            type: TableColumnType.Currency,
            currency: "$",
        },
    ];
    
    const TableListComponent = () =>
        (!loading && !!debtList && debtList.length === 0) ?
            <Stack alignItems={'center'}
                   textAlign={'center'}
            >
                <Box component="img"
                     width={{ xs: '100px', sm: '200px' }}
                     height={{ xs: '99px', sm: '200px' }}
                     src={'/images/assets/bureau/debt-current-empty.svg'} />

                <TypographyBase variant={'h5'} color={'text.lighter'}>
                    No tenés financiamiento activo con ninguna entidad.
                </TypographyBase>
            </Stack>
            :
            <TableList<CurrentDebtDetail> variant={'bureauStyle'} 
                                          totalsRowMapList={[
                                              { 
                                                columnIndex: 2, 
                                                entityField: CurrentDebtDetailFields.Amount,
                                              },
                                          ]} 
                                          isLoading={loading} 
                                          error={error} 
                                          columns={columns} 
                                          entityList={debtList}
            />;

    return (
        title ?
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

export default BCRAQuantityTable;
