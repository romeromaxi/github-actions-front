import { SolicitationViewDTO } from '../../../types/solicitations/solicitationData';
import {
  Card,
  CardContent,
  CardHeader,
  Tooltip,
  Typography,
} from '@mui/material';
import { FileDocumentListSectionSolicitations } from '../../../components/files/FileDocumentListSection';
import {
  FileSolicitation,
  FileSolicitationFields,
} from '../../../types/files/filesData';
import { useEffect, useState } from 'react';
import { HttpFilesSolicitation } from '../../../http/files/httpFilesSolicitation';
import { EntityWithIdFields } from '../../../types/baseEntities';
import { dateFormatter } from '../../../util/formatters/dateFormatter';
import FileSelectedDetailStyles from '../../../components/files/FileSelectedDetail.styles';

interface CompanySolicitationSharedFilesProps {
  solicitation: SolicitationViewDTO;
}

const CompanySolicitationSharedFiles = ({
  solicitation,
}: CompanySolicitationSharedFilesProps) => {
  const classes = FileSelectedDetailStyles();
  const [files, setFiles] = useState<FileSolicitation[]>();

  useEffect(() => {
    HttpFilesSolicitation.getFilesList(
      solicitation[EntityWithIdFields.Id],
    ).then((r) => setFiles(r));
  }, [solicitation]);

  const actionFileComponent = (document: FileSolicitation) => {
    return (
      <Tooltip title={'Fecha de Recepción'}>
        <Typography className={classes.informationFile}>
          {dateFormatter.toShortDate(document[FileSolicitationFields.SentDate])}
        </Typography>
      </Tooltip>
    );
  };

  return (
    <Card>
      <CardHeader title={'Documentos enviados por el Oferente'} />
      <CardContent>
        <FileDocumentListSectionSolicitations
          filesDocument={files}
          action={(d) => actionFileComponent(d as FileSolicitation)}
          download
          preview
        />
      </CardContent>
    </Card>
  );
};

export default CompanySolicitationSharedFiles;
