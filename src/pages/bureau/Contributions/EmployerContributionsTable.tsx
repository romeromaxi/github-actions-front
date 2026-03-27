import React, {useEffect, useState} from 'react';
import {
  SocialSecurityContributionDetail,
  SocialSecurityContributionDetailFields,
} from '../../../types/nosis/nosisData';
import { ITableColumn, TableList } from '../../../components/table';
import Typography from '@mui/material/Typography';
import { dateFormatter } from '../../../util/formatters/dateFormatter';
import {
  ContributionStatus
} from '../../../types/general/generalEnums';
import { Chip } from '@mui/material';
import { contributionColors } from '../../../util/typification/contributionColors';


interface EmployerContributionsTableProps {
  contributionList?: SocialSecurityContributionDetail[];
  loading: boolean;
  error: boolean;
}

function EmployerContributionsTable({
  contributionList,
  loading,
  error,
}: EmployerContributionsTableProps) {
  const [contributions, setContributions] = useState<SocialSecurityContributionDetail[]>();

  useEffect(() => {
    if (contributionList) {
      const ordered = contributionList.sort((a, b) => {
        return b[SocialSecurityContributionDetailFields.Period].localeCompare(a[SocialSecurityContributionDetailFields.Period]);
      });
      
      setContributions(ordered)
    }
  }, [contributionList]);
  
  const getChip = (status: ContributionStatus) => (
    <Chip
        size={'small'}
      label={status}
      sx={{
        color: contributionColors[status].dark,
        backgroundColor: contributionColors[status].light,
      }}
    />
  );

  const columns: ITableColumn[] = [
    {
      label: 'Período', textAlignHeader: 'center', minPadding: true,
      onRenderCell: (contribution) => (
        <Typography>
          {dateFormatter.toFormat(contribution[SocialSecurityContributionDetailFields.Period], 'YYYY/MM')}
        </Typography>
      ),
    },
    {
      label: 'Aportes de Seg.Social', textAlignHeader: 'center', minPadding: true,
      onRenderCell: (contribution) =>
        getChip(
          contribution[SocialSecurityContributionDetailFields.SSContribution],
        ),
    },
    {
      label: 'Aportes de Obra Social', textAlignHeader: 'center', minPadding: true,
      onRenderCell: (contribution) =>
        getChip(
          contribution[SocialSecurityContributionDetailFields.OOSSAporte],
        ),
    },
    {
      label: 'Contribución Patronal Obra Social', textAlignHeader: 'center', minPadding: true,
      onRenderCell: (contribution) =>
        getChip(
          contribution[SocialSecurityContributionDetailFields.OOSSContribution],
        ),
    },
  ];

  return (
      <TableList
        title={'Detalle por período y tipo de aporte'}
        entityList={contributions}
        columns={columns}
        isLoading={loading}
        error={error}
        keepBorderRadius
      />
  );
}

export default EmployerContributionsTable;
