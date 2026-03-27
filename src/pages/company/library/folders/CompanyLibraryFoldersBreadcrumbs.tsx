import { useContext } from 'react';
import { CompanyLibraryFoldersContext } from './CompanyLibraryFolders';
import { Box, Breadcrumbs, Link, Typography } from '@mui/material';
import {
  DocumentFolderFields,
  DocumentFolderViewDTO,
  DocumentFolderViewDTOFields,
} from 'types/files/filesFoldersData';
import { EntityWithIdFields } from 'types/baseEntities';
import {ROOT_FOLDER_NAME} from "types/general/generalEnums";

function findItem(
  data: DocumentFolderViewDTO[] | undefined,
  id: number,
): any | undefined {
  if (data) {
    for (let i of data) {
      if (i[EntityWithIdFields.Id] === id) {
        return [i];
      } else if (i[DocumentFolderViewDTOFields.DaughtersFolders].length) {
        let found = findItem(
          i[DocumentFolderViewDTOFields.DaughtersFolders],
          id,
        );
        if (found.length) {
          return [...found, i];
        }
      }
    }
  }

  return [];
}
interface CompanyLibraryFoldersBreadcrumbsProps {
  foldersHierarchy: DocumentFolderViewDTO[] | undefined;
}

const CompanyLibraryFoldersBreadcrumbs = ({
  foldersHierarchy,
}: CompanyLibraryFoldersBreadcrumbsProps) => {
  const { currentFolderId, setCurrentFolder, setCurrentFoldersIds } =
    useContext(CompanyLibraryFoldersContext);
  const parentItems = findItem(foldersHierarchy, currentFolderId || 0);

  function getItem(
    item: DocumentFolderViewDTO,
    parentIds: number[],
  ): JSX.Element {
    const current = item[EntityWithIdFields.Id] === currentFolderId;

    return (
      <Link
        underline="hover"
        color="GrayText"
        fontWeight={current ? '600' : 'normal'}
        sx={{ textDecoration: current ? 'underline' : 'none' }}
        key={item.id}
        fontSize="0.975rem"
        onClick={() => setCurrentFoldersIds(parentIds)}
      >
        {item[DocumentFolderFields.FolderName]}
      </Link>
    );
  }

  function getBreadcrumb(items: DocumentFolderViewDTO[]): JSX.Element[] {
    const crumbs: JSX.Element[] = [];
    const parentIds: number[] = [];
    items.reverse();

    let index = 0;
    while (index < items.length) {
      const item = items[index];

      crumbs.push(getItem(item, [...parentIds, item[EntityWithIdFields.Id]]));

      parentIds.push(item[EntityWithIdFields.Id]);

      index++;
    }

    return crumbs;
  }

  const breadcrumbs =
    parentItems.length > 0 ? getBreadcrumb(parentItems) : null;

  if (!currentFolderId) {
    return (
      <Box display="flex" borderRadius="5px" px={1}>
        <Breadcrumbs aria-label="breadcrumb">
          <Typography fontSize="0.975rem" color="text.primary">
            {ROOT_FOLDER_NAME}
          </Typography>
        </Breadcrumbs>
      </Box>
    );
  }

  return (
    <Box display="flex" borderRadius="5px" px={1}>
      <Breadcrumbs aria-label="breadcrumb">
        <Link
          underline="hover"
          color="inherit"
          fontSize="0.975rem"
          onClick={() => setCurrentFolder(undefined)}
        >
          {ROOT_FOLDER_NAME}
        </Link>

        {breadcrumbs}
      </Breadcrumbs>
    </Box>
  );
};

export default CompanyLibraryFoldersBreadcrumbs;
