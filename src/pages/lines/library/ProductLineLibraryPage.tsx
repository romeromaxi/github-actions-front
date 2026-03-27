import { Card, CardContent, CardHeader, Stack } from '@mui/material';
import {
  Document,
  DocumentDelete,
  DocumentDeleteFields, DocumentToFileLinkRequestOfferer, DocumentToFileRequestLinkFields,
  FileBase,
  FileBaseFields,
} from 'types/files/filesData';
import React, { useEffect, useState } from 'react';
import { HttpFilesProductLine } from '../../../http';
import { Sections } from '../../../types/general/generalEnums';
import FileDocumentList from '../../../components/files/FileDocumentList';
import BoxNewEntity from '../../../components/misc/BoxNewEntity';
import { HttpCacheFiles } from '../../../http/cache/httpCacheFiles';
import FileNewDialog from '../../../components/files/NewFileDialog';
import {BaseRequestFields} from "../../../types/baseEntities";
import useAxios from "../../../hooks/useAxios";
import {useAction} from "../../../hooks/useAction";

interface ProductLineLibraryPageProps {
  lineId: number;
  offererId: number;
}

function ProductLineLibraryPage({
  lineId,
  offererId,
}: ProductLineLibraryPageProps) {
  const [documentsProductLine, setDocumentsProductLine] =
    useState<Document[]>();
  const [open, setOpen] = useState<boolean>(false);
  const { fetchData } = useAxios()
  const { snackbarSuccess } = useAction()

  const deleteBody: DocumentDelete = {
    [DocumentDeleteFields.SectionCod]: Sections.ProductLine,
    [DocumentDeleteFields.RelatedId]: lineId,
  };

  const onOpenDialog = () => setOpen(true);

  const onCloseDialog = () => setOpen(false);

  const searchDocuments = () => {
    setDocumentsProductLine(undefined);
    HttpFilesProductLine.getFilesByIdProductLine(lineId).then(
      setDocumentsProductLine,
    );
  };

  const handleSave = (fileProductLine: FileBase, file: File) =>
    HttpFilesProductLine.insert(lineId, fileProductLine, file);

  const handleSaveFromLibrary = (docIdLst: number[]) => {
      const fileRequest: DocumentToFileLinkRequestOfferer = {
        [DocumentToFileRequestLinkFields.DocumentIdList]: docIdLst,
        [BaseRequestFields.OriginCode]: 1,
        [BaseRequestFields.ModuleCode]: 1,
      };

      fetchData(
          () => HttpFilesProductLine.linkWithExistent(lineId, fileRequest),
          true,
      )
          .then(() => {
            snackbarSuccess('Se relacionaron los archivos correctamente');
          })
          .finally(() => {
            onCloseDialog();
            searchDocuments();
          });
    
  }
  
  useEffect(() => {
    searchDocuments();
  }, []);

  return (
    <Card>
      <CardHeader title={'Documentación Relacionada a la Línea'} />
      <CardContent>
        <Stack spacing={2}>
          <FileDocumentList
            filesDocument={documentsProductLine?.filter(
              (x) => x[FileBaseFields.FileSectionCode] === Sections.ProductLine,
            )}
            download
            delete
            preview
            deleteBody={deleteBody}
            onReload={searchDocuments}
          />
          <BoxNewEntity
            title={'Nuevo documento'}
            subtitle={
              'Hacé click sobre el botón para agregar un nuevo documento'
            }
            onClickNew={onOpenDialog}
            horizontal
          />
        </Stack>
      </CardContent>
      {open && (
        <FileNewDialog
          section={Sections.ProductLine}
          onLoadFileTypes={HttpCacheFiles.getTypes}
          onCloseDialog={onCloseDialog}
          onSubmitDialog={handleSave}
          onReload={searchDocuments}
          allowFromLibrary
          onSubmitFromLibrary={handleSaveFromLibrary}
          lineId={lineId}
          offererId={offererId}
          blockSection
        />
      )}
    </Card>
  );
}

export default ProductLineLibraryPage;
