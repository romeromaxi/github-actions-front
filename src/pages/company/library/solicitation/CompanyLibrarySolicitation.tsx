import { Grid, Stack, Typography } from '@mui/material';
import { ITableColumn, TableWithPaging } from '../../../../components/table';
import React, { useCallback, useEffect, useState } from 'react';
import {
  EntityFilterPagination,
  EntityListWithPagination,
  EntityListWithPaginationFields,
  EntityPagination,
  EntityPaginationFields,
  EntityWithIdFields,
} from '../../../../types/baseEntities';
import {
  Document,
  DocumentFields,
  FileBaseFields,
  FileBlobResponse,
  FileBlobResponseFields,
} from '../../../../types/files/filesData';
import { useForm } from 'react-hook-form';
import { Sections } from '../../../../types/general/generalEnums';
import { HttpFileDocument, HttpFilesCompany } from '../../../../http';
import { dateFormatter } from '../../../../util/formatters/dateFormatter';
import {
  DeleteIconButton,
  DownloadIconButton,
  SearchButton,
} from '../../../../components/buttons/Buttons';
import { ControlledTextFieldFilled } from '../../../../components/forms';
import { fileFormatter } from '../../../../util/formatters/fileFormatter';

enum SolicitationFileFilterFields {
  ProductCode = 'codProducto',
  OffererCode = 'idOferente',
}

interface SolicitationFileFilter extends EntityFilterPagination {
  [SolicitationFileFilterFields.ProductCode]?: number;
  [SolicitationFileFilterFields.OffererCode]?: number;
}

const defaultPagination: EntityPagination = {
  [EntityPaginationFields.CantPages]: 1,
  [EntityPaginationFields.ActualPage]: 1,
  [EntityPaginationFields.CantRecords]: 1,
  [EntityPaginationFields.PageSize]: 10,
};

interface CompanyLibrarySolicitationProps {
  companyId: number;
}

const CompanyLibrarySolicitation = ({
  companyId,
}: CompanyLibrarySolicitationProps) => {
  const [error, setError] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);
  const [filesCompany, setFilesCompany] =
    useState<EntityListWithPagination<Document>>();
  const [libraryFilter, setLibraryFilter] = useState<SolicitationFileFilter>({
    [EntityPaginationFields.PageSize]: 10,
    [EntityPaginationFields.ActualPage]: 1,
  });
  const [shouldSearch, setShouldSearch] = useState<boolean>(true);

  const { control, handleSubmit } = useForm<SolicitationFileFilter>({
    defaultValues: {
      ...libraryFilter,
    },
  });

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
    {
      label: 'Tipo de Producto',
      onRenderCell: () => <Typography>*Tipo*</Typography>,
    },
    {
      label: 'Solicitud Nro.',
      onRenderCell: () => <Typography>*idSolicitud*</Typography>,
    },
    {
      label: 'Nombre Línea',
      onRenderCell: () => <Typography>*Nombre*</Typography>,
    },
    {
      label: 'Oferente',
      onRenderCell: () => <Typography>*Oferente*</Typography>,
    },
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
    HttpFilesCompany.getFilesByIdCompany(companyId)
      .then((r) => {
        const files: EntityListWithPagination<Document> = {
          [EntityListWithPaginationFields.List]: r.filter(
            (x) => x[FileBaseFields.FileSectionCode] === Sections.Solicitations,
          ),
          [EntityListWithPaginationFields.Pagination]: defaultPagination,
        };

        setFilesCompany(files);
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

  const onSubmit = (data: SolicitationFileFilter) => {
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
                  label="Tipo de Producto"
                  control={control}
                  name={SolicitationFileFilterFields.ProductCode}
                  fullWidth
                />
              </Grid>
              <Grid item xs={5}>
                <ControlledTextFieldFilled
                  label="Oferente"
                  control={control}
                  name={SolicitationFileFilterFields.OffererCode}
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
    <Grid container>
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
};

export default CompanyLibrarySolicitation;
