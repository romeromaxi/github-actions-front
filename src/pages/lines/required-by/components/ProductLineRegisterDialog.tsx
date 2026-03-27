import {
  ProductLineRegister,
  ProductLineRegisterFields,
} from '../../../../types/lines/productLineData';
import {
  Alert,
  Dialog,
  DialogContent,
  Divider,
  Skeleton,
  Stack,
  Typography,
} from '@mui/material';
import BaseDialogTitle from '../../../../components/dialog/BaseDialogTitle';
import { DataWithLabel } from '../../../../components/misc/DataWithLabel';
import { dateFormatter } from '../../../../util/formatters/dateFormatter';
import { DownloadButton } from '../../../../components/buttons/Buttons';
import { HttpFileDocument } from '../../../../http';
import useAxios from '../../../../hooks/useAxios';
import { useEffect, useState } from 'react';
import { Document } from '../../../../types/files/filesData';
import FileDocumentDetail from '../../../../components/files/FileDocumentDetail';

interface ProductLineRegisterDialogProps {
  register: ProductLineRegister;
  open: boolean;
  onClose: () => void;
}

const ProductLineRegisterDialog = ({
  register,
  open,
  onClose,
}: ProductLineRegisterDialogProps) => {
  const { fetchAndDownloadFile } = useAxios();
  const [files, setFiles] = useState<Document[]>();
  const downloadAll = () =>
    fetchAndDownloadFile(() =>
      HttpFileDocument.download(register[ProductLineRegisterFields.DocumentId]),
    );

  useEffect(() => {
    if (open && register[ProductLineRegisterFields.DocumentId] !== 0) {
      setFiles(undefined);
      HttpFileDocument.getListByDocumentId(
        register[ProductLineRegisterFields.DocumentId],
      ).then((r) => {
        setFiles(r);
      });
    }
  }, [register, open]);

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth={'sm'}>
      <BaseDialogTitle title={'Detalle de registro'} onClose={onClose} />
      <DialogContent>
        <Stack spacing={2}>
          <DataWithLabel
            label={'Requerido Por'}
            data={register[ProductLineRegisterFields.RegisterDesc]}
            rowDirection
          />
          <DataWithLabel
            label={'Fecha de Solicitud'}
            data={dateFormatter.toShortDate(
              register[ProductLineRegisterFields.RegisterDate],
            )}
            rowDirection
          />
          <Stack
            direction={'row'}
            alignItems={'center'}
            justifyContent={'space-between'}
          >
            <Typography fontSize={16} fontWeight={600}>
              Archivos relacionados
            </Typography>
            {register[ProductLineRegisterFields.DocumentId] !== 0 && (
              <DownloadButton onClick={downloadAll} size={'small'}>
                {'Descargar Todo'}
              </DownloadButton>
            )}
          </Stack>
          <Divider />
          {register[ProductLineRegisterFields.DocumentId] !== 0 ? (
            !files ? (
              <Stack>
                <Skeleton width={'100%'} />
                <Skeleton width={'100%'} />
              </Stack>
            ) : (
              files.map((file, k) => (
                <div key={k}>
                  <FileDocumentDetail document={file} download />
                </div>
              ))
            )
          ) : (
            <Alert severity={'info'}>
              Al parecer no se cargaron archivos para este registro
            </Alert>
          )}
        </Stack>
      </DialogContent>
    </Dialog>
  );
};

export default ProductLineRegisterDialog;
