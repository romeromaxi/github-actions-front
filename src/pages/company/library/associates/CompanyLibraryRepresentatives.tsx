import React, { useCallback, useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';

import { Grid, Stack, Typography } from '@mui/material';

import { HttpCompanyRelationship, HttpFileDocument } from 'http/index';

import {
  Document,
  DocumentFields,
  FileBlobResponse,
  FileBlobResponseFields,
  FileFilterSearchFields,
  PeopleDocument,
  PeopleDocumentFields,
  RelatedPeopleFileFilter,
  RelatedPeopleFileFilterFields,
} from 'types/files/filesData';
import {
  SocietyPerson,
  SocietyPersonFields,
} from 'types/company/companySocietyData';
import {
  EntityListWithPagination,
  EntityPaginationFields,
  EntityWithIdAndDescription,
  EntityWithIdAndDescriptionFields,
  EntityWithIdFields,
} from 'types/baseEntities';

import { removeDuplicatesByField } from 'util/helpers';
import { stringFormatter } from 'util/formatters/stringFormatter';
import { ControlledTextFieldFilled } from 'components/forms';
import { ITableColumn, TableWithPaging } from '../../../../components/table';
import {
  DeleteIconButton,
  DownloadIconButton,
  SearchButton,
} from '../../../../components/buttons/Buttons';
import {
  FileSubtype,
  FileSubtypeFields,
  FileType,
} from '../../../../types/files/filesDataCache';
import { dateFormatter } from '../../../../util/formatters/dateFormatter';
import { HttpCacheFiles } from '../../../../http/cache/httpCacheFiles';
import { Sections } from '../../../../types/general/generalEnums';
import { HttpFilesCompanySearch } from '../../../../http/files/httpFilesCompanySearch';
import { fileFormatter } from '../../../../util/formatters/fileFormatter';

interface CompanyLibraryRelatedPeopleProps {
  isPhysicalPerson?: boolean;
  companyId: number;
}

function CompanyLibraryRelatedPeople(props: CompanyLibraryRelatedPeopleProps) {
  const [filesPerson, setFilesPerson] =
    useState<EntityListWithPagination<PeopleDocument>>();
  const [relatedPeople, setRelatedPeople] =
    useState<EntityWithIdAndDescription[]>();
  const [error, setError] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);
  const [libraryFilter, setLibraryFilter] = useState<RelatedPeopleFileFilter>({
    [RelatedPeopleFileFilterFields.PersonId]: 0,
    [EntityPaginationFields.PageSize]: 10,
    [EntityPaginationFields.ActualPage]: 1,
  });
  const [shouldSearch, setShouldSearch] = useState<boolean>(true);
  const { control, watch, reset, handleSubmit, getValues, setValue } =
    useForm<RelatedPeopleFileFilter>({
      defaultValues: {
        ...libraryFilter,
      },
    });
  const watchPersonId = watch(RelatedPeopleFileFilterFields.PersonId);
  const watchTypeCode = watch(FileFilterSearchFields.Type);
  const [fileTypes, setFileTypes] = useState<FileType[]>();
  const [fileSubtypes, setFileSubtypes] = useState<FileSubtype[]>();
  const [fileSubtypesFiltered, setFileSubtypesFiltered] =
    useState<FileSubtype[]>();

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
    { label: 'Representante', value: PeopleDocumentFields.BusinessName },
    { label: 'Tipo', value: DocumentFields.FileTypeDesc },
    { label: 'Subtipo', value: DocumentFields.FileSubtypeDesc },
    { label: 'Titulo', value: DocumentFields.TitleDocument },
    {
      label: 'Fecha Subida',
      onRenderCell: (file: PeopleDocument) => (
        <Typography>
          {dateFormatter.toShortDate(file[DocumentFields.BeginDate])}
        </Typography>
      ),
    },
    {
      label: 'Peso',
      onRenderCell: (file: PeopleDocument) => (
        <Typography>{`${Math.floor(file[DocumentFields.FileSize] / 1000)} Kb`}</Typography>
      ),
    },
    {
      label: 'Acciones',
      onRenderCell: (file: PeopleDocument) => (
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

  useEffect(() => {
    if (watchTypeCode === 0) setValue(FileFilterSearchFields.Subtype, 0);
  }, [watchTypeCode]);

  useEffect(() => {
    Promise.all([
      HttpCacheFiles.getTypesBySection(Sections.RelatedPerson),
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

  const searchDocuments = useCallback(() => {
    setFilesPerson(undefined);
    setLoading(true);
    HttpFilesCompanySearch.searchRepresentatives(props.companyId, libraryFilter)
      .then((r) => {
        setFilesPerson(r);
        setShouldSearch(false);
        setLoading(false);
      })
      .catch(() => setError(true));
  }, [libraryFilter]);

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

  const onSubmit = (data: RelatedPeopleFileFilter) => {
    setLibraryFilter({ ...data });
    setShouldSearch(true);
  };

  useEffect(() => {
    if (relatedPeople && !watchPersonId)
      reset({
        [RelatedPeopleFileFilterFields.PersonId]: 0,
      });
  }, [watchPersonId]);

  const createListRelationship = (list: SocietyPerson[]) => {
    let listRelationship: any[] = removeDuplicatesByField(
      list,
      SocietyPersonFields.PersonId,
    );

    let finalList: EntityWithIdAndDescription[];
    finalList = listRelationship.map((relation) => {
      return {
        [EntityWithIdAndDescriptionFields.Id]:
          relation[SocietyPersonFields.PersonId],
        [EntityWithIdAndDescriptionFields.Description]: `${relation[SocietyPersonFields.LegalName]} - ${stringFormatter.formatCuit(relation[SocietyPersonFields.CUIT])}`,
      } as EntityWithIdAndDescription;
    });

    if (finalList.length > 0)
      reset({
        [RelatedPeopleFileFilterFields.PersonId]: 0,
      });

    setRelatedPeople(finalList);
  };

  const loadRelatedPeople = () => {
    HttpCompanyRelationship.getRelationshipRepresentatives(
      props.companyId,
    ).then((r) => {
      createListRelationship(r);
    });
  };

  useEffect(() => {
    loadRelatedPeople();
  }, []);

  useEffect(() => {
    shouldSearch && searchDocuments();
  }, [shouldSearch, searchDocuments]);

  const renderTitle = () => {
    return (
      <Grid container spacing={3} alignItems="center" pb={2}>
        <Grid item xs={3}>
          <Typography variant="h5" sx={{ fontWeight: 600 }}>
            Documentación Respaldatoria
          </Typography>
        </Grid>
        <Grid item xs={9}>
          <form onSubmit={handleSubmit(onSubmit)}>
            <Grid spacing={3} direction="row" alignItems="center" container>
              <Grid item xs={3.5}>
                <ControlledTextFieldFilled
                  select
                  label="Socio"
                  control={control}
                  options={relatedPeople || []}
                  disabled={!relatedPeople || relatedPeople.length <= 1}
                  name={RelatedPeopleFileFilterFields.PersonId}
                  fullWidth
                />
              </Grid>
              <Grid item xs={3.25}>
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
              <Grid item xs={3.25}>
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
          entityPaginada={filesPerson}
          columns={columns}
          isLoading={loading}
          error={error}
          onPaging={onPaging}
        />
      </Grid>
    </Grid>
  );
}

export default CompanyLibraryRelatedPeople;
