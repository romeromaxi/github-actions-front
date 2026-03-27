import React, { useState } from 'react';
import {Accordion, AccordionDetails, AccordionSummary, Box, Card, Chip, Stack, Typography} from '@mui/material';

import SupportingFilesCollapsableDetailType from './SupportingFilesCollapsableDetailType';

import { FileType } from 'types/files/filesDataCache';
import { Sections } from 'types/general/generalEnums';
import { Document, FileBase } from 'types/files/filesData';
import { EntityWithIdAndDescriptionFields } from 'types/baseEntities';
import {BaseIconWrapper} from "../icons/Icons";
import {CaretDown, CaretUp} from "@phosphor-icons/react";

interface SupportingFilesCollapsableBySectionProps {
  fileType: FileType;
  files: Document[];
  section: Sections;
  onReload: () => void;
  onSaveFile?: (fileCompany: FileBase, file: File) => Promise<any>;
  share?: boolean;
  download?: boolean;
  canDelete?: boolean;
  relateToFolder?: boolean;
}

const SupportingFilesCollapsableBySection = ({
  fileType,
  files,
  section,
  onReload,
  onSaveFile,
  share,
  download,
  canDelete,
  relateToFolder
}: SupportingFilesCollapsableBySectionProps) => {
  const [expand, setExpand] = useState<boolean>(false);

  return (
    <Card key={`documentsType_${fileType[EntityWithIdAndDescriptionFields.Id]}`}>
      <Accordion expanded={expand}>
        <AccordionSummary>
          <Stack direction='row' justifyContent='space-between' sx={{width: '100%'}} onClick={() => setExpand(!expand)} alignItems={'center'}>
            <Typography variant={'h5'} fontWeight={500}>
              {`${fileType[EntityWithIdAndDescriptionFields.Description]}`}
            </Typography>
            <Stack direction='row' spacing={2} alignItems={'center'}>
              {
                  files.length !== 0 &&
                  <Chip label={`${files.length} ${files.length == 1 ? 'documento' : 'documentos'}`} color={'primary'} size={'small'}/>
              }
              <Box onClick={() => setExpand(!expand)} sx={{cursor: 'pointer'}}>
                <BaseIconWrapper Icon={expand ? CaretUp : CaretDown} size={'md'} bg={'#F7FAFC'} />
              </Box>
            </Stack>
          </Stack>
        </AccordionSummary>
        <AccordionDetails>
          <SupportingFilesCollapsableDetailType
              fileType={fileType}
              files={files}
              onReload={onReload}
              section={section}
              onSaveFile={onSaveFile}
              share={share}
              download={download}
              canDelete={canDelete}
              relateToFolder={relateToFolder}
          />
        </AccordionDetails>
      </Accordion>
    </Card>
  );
};

export default SupportingFilesCollapsableBySection;
