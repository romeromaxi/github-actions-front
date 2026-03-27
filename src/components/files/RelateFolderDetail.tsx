import {
  DocumentFolderFields,
  DocumentFolderViewDTO,
  DocumentFolderViewDTOFields,
} from '../../types/files/filesFoldersData';
import { fileFormatter } from '../../util/formatters/fileFormatter';
import { Checkbox, Chip, Stack, Typography } from '@mui/material';
import { EntityWithIdFields } from '../../types/baseEntities';
import React, { useState } from 'react';
import { ExpandIconButton } from '../buttons/Buttons';

interface RelateFolderDetailProps {
  folder: DocumentFolderViewDTO;
  onSelect?: (event: React.ChangeEvent<HTMLInputElement>, id?: number) => void;
  onClickCollapse: () => void;
  collapsed: boolean;
}

const RelateFolderDetail = ({
  folder,
  onSelect,
  onClickCollapse,
  collapsed,
}: RelateFolderDetailProps) => {
  const isPresent = folder[DocumentFolderViewDTOFields.IsPresent];
  const [presentState, setPresentState] = useState<boolean>(isPresent);

  return (
    <Stack direction="row" alignItems={'center'}>
      {folder[DocumentFolderViewDTOFields.DaughtersFolders].length !== 0 && (
        <ExpandIconButton
          onClick={() => onClickCollapse()}
          initialExpanded={'expandMore'}
          tooltipTitle={collapsed ? 'Expandir' : 'Contraer'}
        />
      )}
        {
            onSelect &&
              <Checkbox
                value={folder[EntityWithIdFields.Id]}
                onChange={(e) => {
                  setPresentState(!presentState);
                  onSelect(e, folder[EntityWithIdFields.Id]);
                }}
                checked={presentState}
                defaultValue={isPresent ? folder[EntityWithIdFields.Id] : undefined}
                size={'small'}
              />
        }
      <Stack direction={'row'} alignItems={'center'} spacing={0.5}>
        {collapsed ? fileFormatter.getIconFolderTheme() : fileFormatter.getIconFolderThemeOpen()}
        <Typography fontSize={14} fontWeight={500}>
          {folder[DocumentFolderFields.FolderName]}
        </Typography>
      </Stack>
      {isPresent && (
        <Chip color={'info'} label={'Ya vinculado'} size={'small'} />
      )}
    </Stack>
  );
};

export default RelateFolderDetail;
