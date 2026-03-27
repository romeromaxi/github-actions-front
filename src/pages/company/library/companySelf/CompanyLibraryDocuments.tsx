import React, { useCallback, useEffect, useState } from 'react';
import { Grid, Stack, Typography } from '@mui/material';

import { HttpFileDocument } from 'http/index';

import {
  Document,
  DocumentFields,
  FileBlobResponse,
  FileBlobResponseFields,
  FileFilterSearch,
  FileFilterSearchFields,
} from 'types/files/filesData';
import {
  EntityListWithPagination,
  EntityPaginationFields,
  EntityWithIdAndDescriptionFields,
  EntityWithIdFields,
} from '../../../../types/baseEntities';
import { Sections } from '../../../../types/general/generalEnums';
import { ITableColumn, TableWithPaging } from '../../../../components/table';
import {
  DeleteIconButton,
  DownloadIconButton,
  SearchButton,
} from '../../../../components/buttons/Buttons';
import { dateFormatter } from '../../../../util/formatters/dateFormatter';
import { useForm } from 'react-hook-form';
import { ControlledTextFieldFilled } from '../../../../components/forms';
import {
  FileSubtype,
  FileSubtypeFields,
  FileType,
} from '../../../../types/files/filesDataCache';
import { HttpCacheFiles } from '../../../../http/cache/httpCacheFiles';
import { HttpFilesCompanySearch } from '../../../../http/files/httpFilesCompanySearch';
import { fileFormatter } from '../../../../util/formatters/fileFormatter';

interface CompanyLibraryDocumentsProps {
  isPhysicalPerson?: boolean;
  companyId: number;
}

function CompanyLibraryDocuments({
  isPhysicalPerson,
  companyId,
}: CompanyLibraryDocumentsProps) {
  const [filesCompany, setFilesCompany] =
    useState<EntityListWithPagination<Document>>();
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<boolean>(false);
  const [libraryFilter, setLibraryFilter] = useState<FileFilterSearch>({
    [EntityPaginationFields.PageSize]: 10,
    [EntityPaginationFields.ActualPage]: 1,
  });
  const [shouldSearch, setShouldSearch] = useState<boolean>(true);

  const { control, handleSubmit, reset, getValues, setValue, watch } =
    useForm<FileFilterSearch>({
      defaultValues: {
        ...libraryFilter,
      },
    });

  const watchTypeCode = watch(FileFilterSearchFields.Type);
  const [fileTypes, setFileTypes] = useState<FileType[]>();
  const [fileSubtypes, setFileSubtypes] = useState<FileSubtype[]>();
  const [fileSubtypesFiltered, setFileSubtypesFiltered] =
    useState<FileSubtype[]>();

  useEffect(() => {
    Promise.all([
      HttpCacheFiles.getTypesBySection(
        isPhysicalPerson ? Sections.CompanyPhysical : Sections.CompanyLegal,
      ),
      HttpCacheFiles.getSubtypes(),
    ]).then((values) => {
      setFileTypes(values[0]);
      setFileSubtypes(values[1]);

      if (values[0].length === 1) {
        let idType: number = values[0][0][EntityWithIdFields.Id];
        setValue(FileFilterSearchFields.Type, idType);
        setFileSubtypesFiltered(
          values[1].filter((x) => x[FileSubtypeFields.FileTypeCode] === idType),
        );
      }
    });
  }, []);

  useEffect(() => {
    if (watchTypeCode)
      setFileSubtypesFiltered(
        fileSubtypes?.filter(
          (x) => x[FileSubtypeFields.FileTypeCode] === watchTypeCode,
        ),
      );
    else setFileSubtypesFiltered([]);
    reset({ ...getValues() });
  }, [watchTypeCode, fileSubtypes]);

  useEffect(() => {
    if (!!fileSubtypesFiltered && fileSubtypesFiltered.length === 1)
      setValue(
        FileFilterSearchFields.Subtype,
        fileSubtypesFiltered[0][EntityWithIdAndDescriptionFields.Id],
      );
  }, [fileSubtypesFiltered]);

  useEffect(() => {
    if (watchTypeCode === 0) setValue(FileFilterSearchFields.Subtype, 0);
  }, [watchTypeCode]);

  const onDownload = (file: Document) => {
    const isFolder: boolean = file[DocumentFields.NumberFiles] > 1;

    HttpFileDocument.download(file[EntityWithIdFields.Id]).then(
      (blobResponse: FileBlobResponse) => {
        const downloadUrl = window.URL.createObjectURL(
          new Blob([blobResponse[FileBlobResponseFields.File]]),
        );

        const link = document.createElement('a');
        link.href = downloadUrl;

        let downloadName: string = isFolder
          ? `${file[DocumentFields.TitleDocument]}.zip`
          : file[DocumentFields.FileDesc];

        link.setAttribute('download', downloadName);

        document.body.appendChild(link);
        link.click();
        link.remove();
      },
    );
  };

  const onDelete = (file: Document) => {
    HttpFileDocument.delete(file[EntityWithIdFields.Id]).then(() => {
      setShouldSearch(true);
    });
  };

  const columns: ITableColumn[] = [
    {
      label: 'Archivo',
      textAlign: 'left',
      onRenderCell: (file: Document) => (
        <Grid container alignItems={'center'} spacing={2}>
          <Grid item xs={3} md={1.5}>
            {file[DocumentFields.NumberFiles] > 1
              ? fileFormatter.getIconFolder({ fontSize: 'large' })
              : fileFormatter.getIconByFileName(file[DocumentFields.FileDesc], {
                  fontSize: 'large',
                })}
          </Grid>
          <Grid item xs={9} md={10.5} textAlign={'left'}>
            <Typography>{file[DocumentFields.FileDesc]}</Typography>
          </Grid>
        </Grid>
      ),
    },
    { label: 'Tipo', value: DocumentFields.FileTypeDesc },
    { label: 'Subtipo', value: DocumentFields.FileSubtypeDesc },
    { label: 'Titulo', value: DocumentFields.TitleDocument },
    {
      label: 'Fecha Subida',
      onRenderCell: (file: Document) => (
        <Typography>
          {dateFormatter.toShortDate(file[DocumentFields.BeginDate])}
        </Typography>
      ),
    },
    {
      label: 'Peso',
      onRenderCell: (file: Document) => (
        <Typography>{`${Math.floor(file[DocumentFields.FileSize] / 1000)} Kb`}</Typography>
      ),
    },
    {
      label: 'Acciones',
      onRenderCell: (file: Document) => (
        <Stack direction="row" alignItems="center" spacing={2}>
          <DownloadIconButton
            onClick={() => {
              onDownload(file);
            }}
            tooltipTitle={'Descargar'}
          />
          <DeleteIconButton
            onClick={() => {
              onDelete(file);
            }}
            tooltipTitle={'Eliminar'}
          />
        </Stack>
      ),
    },
  ];

  const searchDocuments = useCallback(() => {
    setFilesCompany(undefined);
    setLoading(true);

    HttpFilesCompanySearch.search(companyId, libraryFilter)
      .then((r) => {
        setFilesCompany(r);
        setLoading(false);
        setShouldSearch(false);
      })
      .catch(() => setError(true));
  }, [libraryFilter]);

  useEffect(() => {
    shouldSearch && searchDocuments();
  }, [searchDocuments, shouldSearch]);

  const onPaging = useCallback(
    (page: number) => {
      setLibraryFilter({
        ...libraryFilter,
        [EntityPaginationFields.ActualPage]: page,
      });

      setShouldSearch(true);
    },
    [libraryFilter],
  );

  const onSubmit = (data: FileFilterSearch) => {
    setLibraryFilter({ ...data });
    setShouldSearch(true);
  };

  const renderTitle = () => {
    return (
      <Grid container spacing={3} alignItems="center" pb={2}>
        <Grid item xs={5}>
          <Typography variant="h5" sx={{ fontWeight: 600 }}>
            Documentación Respaldatoria
          </Typography>
        </Grid>
        <Grid item xs={7}>
          <form onSubmit={handleSubmit(onSubmit)}>
            <Grid spacing={3} direction="row" alignItems="center" container>
              <Grid item xs={5}>
                <ControlledTextFieldFilled
                  select
                  label="Tipo"
                  control={control}
                  options={fileTypes || []}
                  disabled={!fileTypes || fileTypes.length <= 1}
                  name={FileFilterSearchFields.Type}
                  fullWidth
                />
              </Grid>
              <Grid item xs={5}>
                <ControlledTextFieldFilled
                  label="Subtipo"
                  select
                  control={control}
                  options={fileSubtypesFiltered || []}
                  disabled={
                    !fileSubtypesFiltered || fileSubtypesFiltered.length <= 1
                  }
                  name={FileFilterSearchFields.Subtype}
                  fullWidth
                />
              </Grid>
              <Grid item xs={2}>
                <SearchButton type="submit" fullWidth>
                  Buscar
                </SearchButton>
              </Grid>
            </Grid>
          </form>
        </Grid>
      </Grid>
    );
  };

  return (
    <Grid container spacing={2}>
      <Grid item xs={12}>
        <TableWithPaging
          title={renderTitle()}
          entityPaginada={filesCompany}
          columns={columns}
          isLoading={loading}
          error={error}
          onPaging={onPaging}
        />
      </Grid>
    </Grid>
  );
}

export default CompanyLibraryDocuments;
