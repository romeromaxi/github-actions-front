import {
  Card,
  CardContent,
  CardHeader,
  Grid,
  Stack,
  Typography,
  Alert
} from '@mui/material';
import {
  SaveButton,
  SearchIconButton,
} from '../../../components/buttons/Buttons';
import { ControlledTextFieldFilled } from '../../../components/forms';
import { useForm } from 'react-hook-form';
import { ControlledDatePicker } from '../../../components/forms/ControlledDatePicker';
import moment from 'moment';
import * as yup from 'yup';
import { DropzoneField } from '../../../components/forms/DropzoneField';
import { FileSelectedDetail } from '../../../components/files/FileSelectedDetail';
import React, { useEffect, useState } from 'react';
import {
  FileBase,
  FileBaseFields,
  FileBaseInsert,
  FileBaseInsertFields,
} from '../../../types/files/filesData';
import {
  ProductLineRegister,
  ProductLineRegisterFields,
  ProductLineRegisterPost,
  ProductLineRegisterPostFields,
} from '../../../types/lines/productLineData';
import useAxios from '../../../hooks/useAxios';
import { HttpProductLineRegisters } from '../../../http/line/httpProductLineRegisters';
import { useAction } from '../../../hooks/useAction';
import { ITableColumn, TableList } from '../../../components/table';
import { dateFormatter } from '../../../util/formatters/dateFormatter';
import ProductLineRegisterDialog from './components/ProductLineRegisterDialog';
import {RequiredDateSchema, RequiredStringSchema} from "../../../util/validation/validationSchemas";
import {yupResolver} from "@hookform/resolvers/yup/dist/yup";

interface ProductLineRequiredByPageProps {
  lineId: number;
}

const ProductLineRequiredByPage = ({
  lineId,
}: ProductLineRequiredByPageProps) => {
  const [files, setFiles] = useState<FileBaseInsert[]>();
  const [currentRegisters, setCurrentRegisters] =
    useState<ProductLineRegister[]>();
  const [openDetail, setOpenDetail] = useState<boolean>(false);
  const [viewRegister, setViewRegister] = useState<ProductLineRegister>();
  const { fetchData } = useAxios();
  const { snackbarSuccess } = useAction();
  
  const productLineRegisterSchema = yup.object().shape({
    [ProductLineRegisterPostFields.RegisterDate]: RequiredDateSchema,
    [ProductLineRegisterPostFields.RegisterDesc]: RequiredStringSchema
  })
  
  const { control, setValue, handleSubmit, getValues, watch, reset } =
    useForm<ProductLineRegisterPost>({
      resolver: yupResolver(productLineRegisterSchema)
    });

  const watchFile = watch(ProductLineRegisterPostFields.Files);
  const remove = (fileToRemove: FileBase) => {
    let newFiles: FileBaseInsert[] | undefined = files?.filter(
      (x) => x !== fileToRemove,
    );

    if (newFiles?.length) setFiles(newFiles);
    else {
      setValue(ProductLineRegisterPostFields.Files, undefined);
      setFiles(undefined);
    }
  };

  const loadRegisters = () => {
    setCurrentRegisters(undefined);
    HttpProductLineRegisters.getList(lineId).then((r) => {
      setCurrentRegisters(r);
    });
  };

  useEffect(() => {
    loadRegisters();
  }, []);

  const onCloseDetail = () => {
    setOpenDetail(false);
    setViewRegister(undefined);
  };

  const onSubmitRegister = (data: ProductLineRegisterPost) => {
    fetchData(() => HttpProductLineRegisters.insert(lineId, data), true).then(
      () => {
        snackbarSuccess('El registro se insertó correctamente');
        setFiles(undefined)
        reset({
          [ProductLineRegisterPostFields.RegisterDesc]: '',
          [ProductLineRegisterPostFields.RegisterDate]: undefined,
        });
        setValue(ProductLineRegisterPostFields.Files, undefined)
        loadRegisters();
      },
    );
  };

  const onViewRegister = (reg: ProductLineRegister) => {
    setViewRegister(reg);
    setOpenDetail(true);
  };

  const cols: ITableColumn[] = [
    { label: 'Requerido Por', value: ProductLineRegisterFields.RegisterDesc },
    {
      label: 'Fecha de Solicitud',
      value: ProductLineRegisterFields.RegisterDate,
      onRenderCell: (row: ProductLineRegister) => (
        <Typography>
          {dateFormatter.toShortDate(
            row[ProductLineRegisterFields.RegisterDate],
          )}
        </Typography>
      ),
    },
    {
      label: 'Evidencia',
      value: '',
      onRenderCell: (row: ProductLineRegister) => (
        <SearchIconButton
          onClick={() => {
            onViewRegister(row);
          }}
        />
      ),
    },
  ];

  useEffect(() => {
    const watchedFiles = getValues(ProductLineRegisterPostFields.Files);
    if (watchedFiles) {
      const newFilesArray = Array.from(watchedFiles);
      const listFilesBase: FileBaseInsert[] = newFilesArray.map((f) => ({
        [FileBaseFields.FileDesc]: f.name,
        [FileBaseFields.BeginDate]: new Date(),
        [FileBaseFields.FileSize]: f.size,
        [FileBaseInsertFields.File]: f,
      } as FileBaseInsert));
      setFiles(listFilesBase);
    } else {
      setFiles(undefined);
    }
  }, [watchFile, getValues]);
  
  
  return (
    <Card>
      <form onSubmit={handleSubmit(onSubmitRegister)}>
        <CardHeader
          title={'Registro interno de requerimiento de publicación de línea'}
          action={<SaveButton size='small' type="submit">Guardar</SaveButton>}
          subheader={
            <Alert color='info' severity='info'>
              <Typography variant='caption' color='text.lighter'>
                  Completá la información de este apartado en caso de que quieras mantener registro de quién o qué sector te requirió el alta de esta línea. Esta información no se publicará junto con la línea
              </Typography>
            </Alert>
        }
        />
        <CardContent>
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <ControlledTextFieldFilled
                control={control}
                label={'Requerido Por'}
                name={ProductLineRegisterPostFields.RegisterDesc}
                fullWidth
              />
            </Grid>
            <Grid item xs={3}>
              <ControlledDatePicker
                control={control}
                label={'Fecha de solicitud'}
                name={ProductLineRegisterPostFields.RegisterDate}
                filled
                maxDate={moment().toDate()}
              />
            </Grid>
            <Grid item xs={12}>
              <Grid item xs={12}>
                {!files ? (
                  <Stack>
                    <Typography color={'#A1A5B7'} fontWeight={500}>
                      Adjuntar evidencia
                    </Typography>
                    <DropzoneField
                      name={ProductLineRegisterPostFields.Files}
                      multiple={true}
                      control={control}
                      setValue={setValue}
                    />
                  </Stack>
                ) : (
                  <Grid container spacing={1}>
                    {files.length > 1
                      ? files.map?.((file) => (
                          <Grid item xs={12}>
                            <FileSelectedDetail
                              file={file}
                              actions
                              onDelete={remove}
                            />
                          </Grid>
                        ))
                      : files.length === 1 && (
                          <Grid item xs={12}>
                            <FileSelectedDetail
                              file={files[0]}
                              actions
                              onDelete={remove}
                            />
                          </Grid>
                        )}
                  </Grid>
                )}
              </Grid>
            </Grid>
            <Grid item xs={12} mt={1}>
              <Typography fontSize={16} fontWeight={600}>
                Registros publicados
              </Typography>
            </Grid>
            <Grid item xs={12}>
              <TableList<ProductLineRegister>
                entityList={currentRegisters}
                error={false}
                isLoading={!currentRegisters}
                columns={cols}
              />
            </Grid>
          </Grid>
        </CardContent>
      </form>
      {viewRegister && (
        <ProductLineRegisterDialog
          register={viewRegister}
          open={openDetail}
          onClose={onCloseDetail}
        />
      )}
    </Card>
  );
};

export default ProductLineRequiredByPage;
