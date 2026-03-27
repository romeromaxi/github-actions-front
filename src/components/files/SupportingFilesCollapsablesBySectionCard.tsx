import { Sections } from '../../types/general/generalEnums';
import {
  Document,
  DocumentFields,
  FileBase,
} from '../../types/files/filesData';
import { Grid, Stack } from '@mui/material';
import { FileType } from '../../types/files/filesDataCache';
import React, { useEffect, useState } from 'react';
import { HttpCacheFiles } from '../../http/cache/httpCacheFiles';
import SupportingFilesCollapsableBySection from './SupportingFilesCollapsableBySection';
import { EntityWithIdAndDescriptionFields } from '../../types/baseEntities';
import { Skeleton } from '@mui/lab';

interface SupportingFilesColapsabllesBySectionCardProps {
  section: Sections;
  files?: Document[];
  onSaveFile?: (fileBase: FileBase, file: File) => Promise<any>;
  share?: boolean;
  download?: boolean;
  canDelete?: boolean;
  onReload: () => void;
  relateToFolder?: boolean;
}

const SupportingFilesCollapsablesBySectionCard = ({
  section,
  files,
  onSaveFile,
  share,
  download,
  canDelete,
  onReload, relateToFolder
}: SupportingFilesColapsabllesBySectionCardProps) => {
  const [fileTypes, setFileTypes] = useState<FileType[]>();
  const [loading, setLoading] = useState<boolean>(false);

  const loadFileTypes = () => {
    setLoading(true);
    HttpCacheFiles.getTypesBySection(section).then((r) => {
      setFileTypes(r);
      setLoading(false);
    });
  };

  useEffect(() => {
    loadFileTypes();
  }, [files]);

  const drawColapsable = (type: FileType) => {
    if (files) {
      const filesByType: Document[] = files.filter(
        (r) =>
          r[DocumentFields.FileTypeCode] ===
          type[EntityWithIdAndDescriptionFields.Id],
      );

      return (
        <SupportingFilesCollapsableBySection
          files={filesByType}
          fileType={type}
          section={section}
          onReload={onReload}
          onSaveFile={onSaveFile}
          share={share}
          download={download}
          canDelete={canDelete}
          relateToFolder={relateToFolder}
        />
      );
    }
  };

  return (
        <Stack spacing={3}>
          {!loading ? (
            fileTypes && fileTypes.length !== 0 ? (
              fileTypes.map((type) => drawColapsable(type))
            ) : (
              <></>
            )
          ) : (
            Array.from(Array(4).keys()).map((item) => (
              <Grid
                item
                xs={12}
                key={`keySupportingFilesCollapsablesBySectionCard_${section}_${item}`}
              >
                <Skeleton />
              </Grid>
            ))
          )}
        </Stack>
  );
};

export default SupportingFilesCollapsablesBySectionCard;
