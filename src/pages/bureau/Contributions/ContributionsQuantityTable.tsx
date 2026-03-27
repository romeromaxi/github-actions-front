import React, {useEffect, useState} from 'react';
import {ITableColumn, TableColumnType, TableList,} from '../../../components/table';
import {SocialSecurityContributions, SocialSecurityContributionsFields,} from '../../../types/nosis/nosisData';
import {ContributionStatus} from '../../../types/general/generalEnums';
import {contributionColors} from '../../../util/typification/contributionColors';
import {Chip} from '@mui/material';

enum ContributionsQuantityTableRowFields {
  Reason = 'motivo',
  Quantity = 'cantidad',
}

type ContributionsQuantityTableRow = {
  [ContributionsQuantityTableRowFields.Reason]: ContributionStatus;
  [ContributionsQuantityTableRowFields.Quantity]: number;
};

interface ContributionsQuantityTableProps {
  contributions?: SocialSecurityContributions;
  loading: boolean;
  error: boolean;
}

function ContributionsQuantityTable({
  contributions,
  loading,
  error,
}: ContributionsQuantityTableProps) {
  const [contributionList, setContributionList] = useState<
    ContributionsQuantityTableRow[]
  >([]);

  const columns: ITableColumn[] = [
    {
      label: 'Motivo', textAlignHeader: 'center', minPadding: true, 
      onRenderCell: (contribution: ContributionsQuantityTableRow) => (
        <Chip
            size={'small'}
          label={contribution[ContributionsQuantityTableRowFields?.Reason]}
          sx={{
            color:
              contributionColors[
                contribution[ContributionsQuantityTableRowFields?.Reason]
              ].dark,
            backgroundColor:
              contributionColors[
                contribution[ContributionsQuantityTableRowFields?.Reason]
              ].light,
          }}
        />
      ),
    },
    { 
      label: 'Cantidad', value: ContributionsQuantityTableRowFields.Quantity, minPadding: true,
      textAlignHeader: 'center', type: TableColumnType.NumberWithoutDecimal
    },
  ];
  

  useEffect(() => {
    contributions &&
      setContributionList([
        {
          [ContributionsQuantityTableRowFields.Reason]: ContributionStatus.Paid,
          [ContributionsQuantityTableRowFields.Quantity]:
            contributions[SocialSecurityContributionsFields.TotalContributions],
        },
        {
          [ContributionsQuantityTableRowFields.Reason]:
            ContributionStatus.Partial,
          [ContributionsQuantityTableRowFields.Quantity]:
            contributions[
              SocialSecurityContributionsFields.PartialContributions
            ],
        },
        {
          [ContributionsQuantityTableRowFields.Reason]:
            ContributionStatus.Unpaid,
          [ContributionsQuantityTableRowFields.Quantity]:
            contributions[
              SocialSecurityContributionsFields.UnpaidContributions
            ],
        },
      ]);
  }, [contributions]);

  return (
      <TableList
        title={'Cantidad'}
        entityList={contributionList}
        columns={columns}
        isLoading={loading}
        error={error}
        keepBorderRadius
      />
  );
}

export default ContributionsQuantityTable;
