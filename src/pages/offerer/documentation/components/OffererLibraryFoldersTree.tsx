import { DocumentFolderViewDTO } from '../../../../types/files/filesFoldersData';
import React, { useContext } from 'react';
import { OffererDocumentationFoldersContext } from '../OffererDocumentation';
import FoldersTreeView from '../../../../components/files/FoldersTreeView';
import { folderToTreeView } from '../../../../util/helpers';
import { Skeleton } from '@mui/lab';
import { Alert, Button, Stack } from '@mui/material';

interface OffererLibraryFoldersTreeProps {
  foldersHierarchy?: DocumentFolderViewDTO[];
}

const OffererLibraryFoldersTree = ({
  foldersHierarchy,
}: OffererLibraryFoldersTreeProps) => {
  const { currentFoldersIds, setCurrentFoldersIds } = useContext(
    OffererDocumentationFoldersContext,
  );

  return foldersHierarchy ? (
    foldersHierarchy.length !== 0 ? (
      <Stack spacing={1}>
        {currentFoldersIds && currentFoldersIds.length !== 0 && (
          <Button
            color={'secondary'}
            variant={'contained'}
            onClick={() => {
              setCurrentFoldersIds(undefined);
            }}
            size={'small'}
          >
            Volver a la raíz
          </Button>
        )}
        <FoldersTreeView
          items={folderToTreeView(foldersHierarchy)}
          currentFoldersIds={currentFoldersIds}
          setCurrentFoldersIds={setCurrentFoldersIds}
        />
      </Stack>
    ) : (
      <Alert severity={'info'}>Aún no se crearon carpetas</Alert>
    )
  ) : (
    <>
      <Skeleton />
      <Skeleton />
      <Skeleton />
    </>
  );
};

export default OffererLibraryFoldersTree;
