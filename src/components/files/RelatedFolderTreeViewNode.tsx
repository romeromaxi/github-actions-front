import {
  DocumentFolderViewDTO,
  DocumentFolderViewDTOFields,
} from '../../types/files/filesFoldersData';
import RelateFolderDetail from './RelateFolderDetail';
import { Stack } from '@mui/material';
import React, { useState } from 'react';

interface RelatedFolderTreeViewNodeProps {
  folder: DocumentFolderViewDTO;
  onSelect?: (event: React.ChangeEvent<HTMLInputElement>, id?: number) => void;
}

const RelatedFolderTreeViewNode = ({
  folder,
  onSelect,
}: RelatedFolderTreeViewNodeProps) => {
  const [showDaughters, setShowDaughters] = useState<boolean>(false);

  const triggerShowDaughters = () => setShowDaughters(!showDaughters);

  return (
    <Stack sx={{ ml: '20px', mb: '5px' }}>
      <RelateFolderDetail
        folder={folder}
        onSelect={onSelect}
        collapsed={!showDaughters}
        onClickCollapse={triggerShowDaughters}
      />
      {folder[DocumentFolderViewDTOFields.DaughtersFolders].length !== 0 &&
        showDaughters &&
        folder[DocumentFolderViewDTOFields.DaughtersFolders].map((daughter) => (
          <div style={{ marginLeft: 25 }}>
            <RelatedFolderTreeViewNode folder={daughter} onSelect={onSelect} />
          </div>
        ))}
    </Stack>
  );
};

export default RelatedFolderTreeViewNode;
