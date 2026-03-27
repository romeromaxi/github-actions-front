import { Box, Button, Stack, Typography } from '@mui/material';
import {
  CompanySectionsWithFileType,
  CompanySectionsWithFileTypeFields,
} from 'types/company/companyData';
import { fileFormatter } from 'util/formatters/fileFormatter';
import { EntityWithIdAndDescriptionFields } from 'types/baseEntities';
import React from 'react';

interface CompanyLibraryAllCustomTreeProps {
  section?: CompanySectionsWithFileType;
  fileType?: number;
  onClickSection: (sec?: CompanySectionsWithFileType) => void;
  onClickFileType: (id?: number) => void;
  sections?: CompanySectionsWithFileType[];
}

const CompanyLibraryAllCustomTree = ({
  section,
  fileType,
  onClickSection,
  onClickFileType,
  sections,
}: CompanyLibraryAllCustomTreeProps) => {
  return (
    <Stack>
      <Box textAlign="center" mb={1}>
        {section && (
          <Button
            color={'secondary'}
            variant={'contained'}
            onClick={() => {
              onClickSection(undefined);
              onClickFileType(undefined);
            }}
            size={'small'}
          >
            Ver todos los archivos
          </Button>
        )}
      </Box>
      {sections &&
        sections.length !== 0 &&
        sections.map((sec) => (
          <Stack>
            <Stack
              direction={'row'}
              spacing={1}
              alignItems={'center'}
              onClick={() => onClickSection(sec)}
              key={sec[CompanySectionsWithFileTypeFields.Id]}
              className={`MuiTreeItem-content ${section === sec ? 'Mui-expanded' : ''}`}
              sx={{
                '&:hover': {
                  backgroundColor: 'rgba(191, 225, 245, 0.2)',
                  cursor: 'pointer',
                },
              }}
            >
              {section === sec
                ? fileFormatter.getIconFolderThemeOpen()
                : fileFormatter.getIconFolderTheme()}
              <Typography
                className={`MuiTreeItem-label ${section === sec ? 'Mui-expanded' : ''}`}
              >
                {sec[CompanySectionsWithFileTypeFields.Description]}
              </Typography>
            </Stack>
            {section === sec &&
              sec[CompanySectionsWithFileTypeFields.FileTypes] &&
              sec[CompanySectionsWithFileTypeFields.FileTypes].length !== 0 &&
              sec[CompanySectionsWithFileTypeFields.FileTypes].map((fileT) => (
                <Stack
                  direction={'row'}
                  alignItems={'center'}
                  onClick={() =>
                    onClickFileType(fileT[EntityWithIdAndDescriptionFields.Id])
                  }
                  key={fileT[EntityWithIdAndDescriptionFields.Id]}
                  spacing={1}
                  className={`MuiTreeItem-content ${fileType === fileT[EntityWithIdAndDescriptionFields.Id] ? 'Mui-expanded' : ''}`}
                  sx={{
                    '&:hover': {
                      cursor: 'pointer',
                    },
                    marginLeft: '18px',
                  }}
                >
                  {fileType === fileT[EntityWithIdAndDescriptionFields.Id]
                    ? fileFormatter.getIconFolderThemeOpen()
                    : fileFormatter.getIconFolderTheme()}
                  <Typography
                    className={`MuiTreeItem-label ${fileType === fileT[EntityWithIdAndDescriptionFields.Id] ? 'Mui-expanded' : ''}`}
                  >
                    {fileT[EntityWithIdAndDescriptionFields.Description]}
                  </Typography>
                </Stack>
              ))}
          </Stack>
        ))}
    </Stack>
  );
};

export default CompanyLibraryAllCustomTree;
