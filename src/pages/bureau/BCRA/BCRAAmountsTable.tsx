import React, { useContext, useEffect, useState } from 'react';
import {
  CurrentDebt,
  SituationType,
  SituationTypeFields,
} from '../../../types/nosis/nosisData';
import { arrayChunks } from '../../../util/helpers';
import { BureauInformationContext } from 'hooks/contexts/BureauInformationContext';
import { EntityWithIdAndDescriptionFields } from '../../../types/baseEntities';
import {Box, Card, CardContent, CardHeader} from '@mui/material';
import { SituationTypeCodes } from '../../../types/general/generalEnums';
import {PieChart} from "@mui/x-charts";
import {
  formatDebtListDataToChartType
} from "../../../util/formatters/chartFormatters";
import {Skeleton} from "@mui/lab";
import {SolicitationWithoutDataChart} from "../../markets/solicitations/components/UserSolicitationsSummary";
import {SituationColorMap} from "../../../util/typification/situationColor";

enum DebtQuantityTableRowFields {
  SituationDesc = 'situacion',
  SituationLongDesc = 'situacionDetalle',
  SituationCode = 'codSituacion',
  Amount = 'monto',
  Quantity = 'cantidad',
}

export type DebtQuantityTableRow = {
  [DebtQuantityTableRowFields.SituationDesc]: string;
  [DebtQuantityTableRowFields.SituationLongDesc]: string;
  [DebtQuantityTableRowFields.SituationCode]: SituationTypeCodes;
  [DebtQuantityTableRowFields.Amount]: number;
  [DebtQuantityTableRowFields.Quantity]: number;
};

interface BcraAmountsTableProps {
  debtAmounts?: CurrentDebt;
  loading: boolean;
  error: boolean;
}

function BcraAmountsTable({
  debtAmounts,
  loading
}: BcraAmountsTableProps) {
  const { situationTypes } = useContext(BureauInformationContext);
  const [debtList, setDebtList] = useState<DebtQuantityTableRow[]>([]);
  

  const debtToList = (debt: CurrentDebt, situationTypes: SituationType[]) =>
    arrayChunks(
      Object.entries(debt).slice(0, Object.entries(debt).length - 3),
      2,
    ).map((e, idx) => {
      return {
        [DebtQuantityTableRowFields.Amount]: e[0][1],
        [DebtQuantityTableRowFields.Quantity]: e[1][1],
        [DebtQuantityTableRowFields.SituationCode]: idx + 1,
        [DebtQuantityTableRowFields.SituationDesc]:
          situationTypes.find((s) => s.id === idx + 1)?.[
            EntityWithIdAndDescriptionFields.Description
          ] || '',
        [DebtQuantityTableRowFields.SituationLongDesc]:
          situationTypes.find((s) => s.id === idx + 1)?.[
            SituationTypeFields.LongDesc
          ] || '',
      };
    });

  useEffect(() => {
    debtAmounts &&
      situationTypes.length &&
      setDebtList(debtToList(debtAmounts, situationTypes));
  }, [debtAmounts, situationTypes]);

  return (
    <Card>
      <CardHeader title={'Montos agrupados por Situación'} />
      <CardContent>
          {
            loading ?
                <Box sx={{display: 'flex', justifyContent: 'center', width: '100%'}}>
                  <Skeleton variant={'circular'} sx={{height: 210, width: 210}}/>
                </Box>
                :
                debtList && (debtList.length !== 0 && !debtList.every((i) => i.monto === 0 || i.monto == null)) ?
                  <Box
                      sx={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        width: '100%',
                        height: '100%',
                      }}
                  >
                    <PieChart
                        height={210}
                        colors={Object.values(SituationTypeCodes).filter(
                            (value) => value > 0
                        ).map(value => SituationColorMap[value]?.dark)}
                        series={[
                          {
                            data: formatDebtListDataToChartType(debtList),
                            innerRadius: 45,
                          },
                        ]}
                        slotProps={{
                          legend: {
                            direction: "column",
                            position: {
                              vertical: 'middle',
                              horizontal: 'right',
                            },
                            itemMarkWidth: 2,
                            itemMarkHeight: 15,
                            markGap: 5,
                            itemGap: 10,
                            labelStyle: {
                              fontSize: 11,
                            }
                          },
                        }}
                    />
                  </Box>
                    :
                    <SolicitationWithoutDataChart description={'Acá podrás visualizar como se distribuyen los montos según la situación'}/>
          }
      </CardContent>
    </Card>
  );
}

export default BcraAmountsTable;
