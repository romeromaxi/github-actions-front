import {
  CompanySectionsWithFileType,
  CompanySectionsWithFileTypeFields,
} from '../../types/company/companyData';
import React from 'react';
import { Stack, Tooltip, Typography } from '@mui/material';
import { fileFormatter } from '../../util/formatters/fileFormatter';
import { ExpandIconButton } from '../buttons/Buttons';
import HelpOutlineIcon from '@mui/icons-material/HelpOutline';

interface RelateSectionDetailProps {
  section: CompanySectionsWithFileType;
  onClickCollapse: () => void;
  collapsed: boolean;
}

const RelateSectionDetail = ({
  section,
  onClickCollapse,
  collapsed,
}: RelateSectionDetailProps) => {
  return (
    <Stack direction={'row'} alignItems={'center'} spacing={0.5}>
      <ExpandIconButton
        onClick={() => onClickCollapse()}
        initialExpanded={'expandMore'}
        tooltipTitle={collapsed ? 'Expandir' : 'Contraer'}
      />
      {fileFormatter.getIconFolderThemeOpen()}
      <Typography fontSize={14} fontWeight={500}>
        {section[CompanySectionsWithFileTypeFields.Description]}
      </Typography>
      {section[CompanySectionsWithFileTypeFields.RelatedData].length !== 0 && (
        <Tooltip
          title={`Para agregar un nuevo dato en ${section[CompanySectionsWithFileTypeFields.Description]} debe realizarlo en el repositorio de su cuenta MiPyME`}
        >
          <HelpOutlineIcon fontSize={'small'} color={'info'} />
        </Tooltip>
      )}
    </Stack>
  );
};

export default RelateSectionDetail;
