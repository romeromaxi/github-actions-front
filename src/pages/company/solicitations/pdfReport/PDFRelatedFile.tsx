import { usePDF } from '@react-pdf/renderer';
import { useContext, useEffect, useState } from 'react';
import { HttpFilesSolicitation } from 'http/files/httpFilesSolicitation';
import { FileBase, FileBaseInsertFields } from 'types/files/filesData';
import { PrequalificationStepperContext } from '../../../markets/prequalification/PrequalificationStepper';

interface PDFRelatedFileProps {
  solicitationId: number;
  document: JSX.Element;
}

function PDFRelatedFile({ solicitationId, document }: PDFRelatedFileProps) {
  const {  } = useContext(
    PrequalificationStepperContext,
  );

  const [instance, updateInstance] = usePDF({ document: document });

 /* const saveRelatedFile = async (blobs: Blob) => {
    if (!pdfGeneratedSolicitation.includes(solicitationId)) {
      addGeneratedSolicitation(solicitationId);
      const fileName = `Solicitud_${solicitationId}.pdf`;
      const file = new File([blobs], fileName);
      const fileBase: FileBase = {
        [FileBaseInsertFields.DocumentId]: 0,
        [FileBaseInsertFields.FileSize]: blobs.size,
        [FileBaseInsertFields.ModuleCode]: 1,
        [FileBaseInsertFields.OriginCode]: 1,
        [FileBaseInsertFields.File]: file,
      };

      await HttpFilesSolicitation.saveReport(solicitationId, fileBase, file);
    }
  };*/

  /*useEffect(() => {
    if (instance.blob)
      saveRelatedFile(instance.blob).then(() =>
        addGeneratedSolicitation(solicitationId),
      );
  }, [instance]);*/

  return <></>;
}

export default PDFRelatedFile;
