import React, { useEffect, useState } from 'react';
import { Document } from 'types/files/filesData';
import { Alert, Box, Stack, Tab } from '@mui/material';
import { DropzoneField } from 'components/forms/DropzoneField';
import { useFormContext } from 'react-hook-form';
import { Skeleton, TabContext, TabList, TabPanel } from '@mui/lab';
import { HttpFilesProductLine } from 'http/index';
import { EntityWithIdFields } from 'types/baseEntities';
import FileDocumentDetail from 'components/files/FileDocumentDetail';

interface SolicitationRequiredFileNewDialogFormProps {
  lineId: number;
  onSelect: (
    event: React.ChangeEvent<HTMLInputElement>,
    document: Document,
  ) => void;
  name: string;
  currentTab?: '0' | '1';
  onChangeTab?: (tabValue: '0' | '1') => void;
  selectedFiles?: number[];
}

const SolicitationRequiredFileNewDialogForm = ({
  lineId,
  onSelect,
  currentTab,
  onChangeTab,
  name,
  selectedFiles,
}: SolicitationRequiredFileNewDialogFormProps) => {
  const { control, setValue } = useFormContext();
  const [selectedTab, setSelectedTab] = useState(currentTab);
  const [docs, setDocs] = useState<Document[]>();

  const alreadySelected = (id: number) => {
    if (selectedFiles) return selectedFiles.some((sel) => sel == id);
    return false;
  };
  const handleChange = (event: React.SyntheticEvent, newValue: string) => {
    if (newValue == '1' || newValue == '0') {
      setSelectedTab(newValue);
      onChangeTab && onChangeTab(newValue);
    }
  };

  useEffect(() => {
    if (selectedTab == '1' && !docs)
      HttpFilesProductLine.getFilesByIdProductLine(lineId).then((r) =>
        setDocs(r),
      );
  }, [lineId, selectedTab]);

  useEffect(() => {
    if (selectedTab == '0') setDocs(undefined);
  }, [selectedTab]);

  return (
    <Box pr={'4px'} pl={'4px'}>
      <TabContext value={selectedTab ?? '0'}>
        <Box>
          <TabList
            onChange={handleChange}
            aria-label="lab API tabs example"
            variant="fullWidth"
          >
            <Tab label="Subir nuevos archivos" value="0" />
            <Tab label="Relacionar desde la línea" value="1" />
          </TabList>
        </Box>
        <TabPanel value="0">
          <DropzoneField
            name={name}
            multiple={true}
            control={control}
            setValue={setValue}
          />
        </TabPanel>
        <TabPanel value="1">
          {!docs ? (
            Array.from({ length: 3 }).map(() => (
              <Skeleton key={Math.random().toString(36).substring(7)} />
            ))
          ) : docs.length !== 0 ? (
            <Stack spacing={1}>
              {docs.map((doc) => (
                <FileDocumentDetail
                  key={`FileDocumentDetail_${doc[EntityWithIdFields.Id]}`}
                  document={doc}
                  onSelect={onSelect}
                  selected={alreadySelected(doc[EntityWithIdFields.Id])}
                  download
                />
              ))}
            </Stack>
          ) : (
            <Alert severity={'info'}>
              No se encontraron archivos relacionados a la línea
            </Alert>
          )}
        </TabPanel>
      </TabContext>
    </Box>
  );
};

export default SolicitationRequiredFileNewDialogForm;
