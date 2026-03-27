import React, { useContext } from 'react';
import { Skeleton } from '@mui/lab';
import FoldersTreeView from 'components/files/FoldersTreeView';
import { DocumentFolderViewDTO } from 'types/files/filesFoldersData';
import { CompanyLibraryFoldersContext } from './CompanyLibraryFolders';
import { folderToTreeView } from '../../../../util/helpers';

interface CompanyLibraryFoldersTreeProps {
  foldersHierarchy: DocumentFolderViewDTO[] | undefined;
  omitCustomIds?: boolean;
  onClickFolder?: (id?: number) => void;
}

const CompanyLibraryFoldersTree = ({
  foldersHierarchy,
  onClickFolder, omitCustomIds
}: CompanyLibraryFoldersTreeProps) => {
  const { currentFoldersIds, setCurrentFoldersIds } = useContext(
    CompanyLibraryFoldersContext,
  );

  return foldersHierarchy ? (
    foldersHierarchy.length ? (
      <FoldersTreeView
        items={folderToTreeView(foldersHierarchy)}
        currentFoldersIds={currentFoldersIds}
        setCurrentFoldersIds={setCurrentFoldersIds}
        onClickFolder={onClickFolder}
        omitIds={omitCustomIds}
      />
    ) : (
      <></>
    )
  ) : (
    <>
      <Skeleton />
      <Skeleton />
      <Skeleton />
    </>
  );
};

export default CompanyLibraryFoldersTree;
