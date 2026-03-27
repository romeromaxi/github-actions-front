import React, { Key, ReactElement, useContext, useState } from 'react';
import {
  Box,
  Button,
  Checkbox,
  Skeleton,
  Stack,
  Typography,
} from '@mui/material';
import { DialogAlert } from 'components/dialog';
import UploadIcon from '@mui/icons-material/Upload';

import { LoaderBlockUI } from 'components/loader';
import {
  ButtonIconDropdown, MenuItemDropdown,
  UploadIconButton,
} from 'components/buttons/Buttons';

import { fileFormatter } from 'util/formatters/fileFormatter';

import { EntityWithIdFields } from 'types/baseEntities';
import {
  Document,
  DocumentDelete,
  DocumentFields,
  FileBlobResponse,
  FileBlobResponseFields,
  FileSolicitation,
} from 'types/files/filesData';

import { HttpFileDocument } from 'http/index';

import FileSelectedDetailStyles from './FileSelectedDetail.styles';
import FileNewDialog, { FileNewDialogProps } from './NewFileDialog';
import { stringFormatter } from 'util/formatters/stringFormatter';
import RelateFileWithFolderDialog from './RelateFileWithFolderDialog';
import { HttpCacheFiles } from '../../http/cache/httpCacheFiles';
import { OffererContext } from '../../pages/offerer/components/OffererContextProvider';
import DialogPreviewFile from './DialogPreviewFile';
import {WrapperIcons} from "../icons/Icons";
import {FolderPlus, MagnifyingGlass, ShareFat, X} from "@phosphor-icons/react";
import {DownloadSimple, PencilSimple, Trash} from "phosphor-react";
import { TypographyBase } from 'components/misc/TypographyBase';
import {useApplicationCommon} from "hooks/contexts/ApplicationCommonContext";

interface FileDocumentDetailProps {
  document: Document;
  onReload?: () => void;
  delete?: boolean;
  share?: boolean;
  onShare?: (i: Document) => void;
  download?: boolean;
  dontGetIcon?: boolean;
  upload?: boolean;
  edit?: boolean;
  onSelect?: (
    event: React.ChangeEvent<HTMLInputElement>,
    document: Document,
    fileSolicitation?: FileSolicitation,
  ) => void;
  uploadComponent?: React.ReactNode;
  uploadDialogProps?: FileNewDialogProps;
  fileSolicitation?: FileSolicitation;
  titleMaxLen?: number;
  descMaxLen?: number;
  selected?: boolean;
  preview?: boolean;
  fileIconSize?: 'small' | 'medium' | 'large';
  deleteBody?: DocumentDelete;
  key?: Key | null;
  action?: (document: Document) => ReactElement;
  dropdown?: boolean;
  relateToFolder?: boolean;
}

function FileDocumentDetail(props: FileDocumentDetailProps) {
  const classes = FileSelectedDetailStyles();
  const isFolder: boolean = props.document[DocumentFields.NumberFiles] > 1;
  const hasActions: boolean =
    !!props.delete ||
    !!props.share ||
    !!props.download ||
    !!props.upload ||
    !!props.onSelect || !props.onShare;
  const filePresent = !!props.document[EntityWithIdFields.Id];
  const [isLoading, showLoading] = useState<boolean>(false);
  const [showConfirmDelete, setShowConfirmDelete] = useState<boolean>(false);
  const [showUploadComponent, setShowUploadComponent] =
    useState<boolean>(false);
  const [showShare, setShowShare] = useState<boolean>(false);
  const [openEdit, setOpenEdit] = useState<boolean>(false);
  const [fileBlob, setFileBlob] = useState<FileBlobResponse>();
  const [openPreview, setOpenPreview] = useState<boolean>(false);
  const { companyId } = useApplicationCommon();
  const offerer = useContext(OffererContext);
  const descLen: number = props.descMaxLen ? props.descMaxLen : 50;

  const onShowConfirmDelete = () => setShowConfirmDelete(true);

  const onCancelDelete = () => setShowConfirmDelete(false);

  const onDeleteDocument = () => {
    showLoading(true);

    HttpFileDocument.delete(
      props.document[EntityWithIdFields.Id],
      props.deleteBody,
    ).then(() => {
      setShowConfirmDelete(false);
      showLoading(false);
      if (props.onReload) props.onReload();
    });
  };

  const onDownload = () => {
    showLoading(true);

    HttpFileDocument.download(props.document[EntityWithIdFields.Id]).then(
      (blobResponse: FileBlobResponse) => {
        const downloadUrl = window.URL.createObjectURL(
          new Blob([blobResponse[FileBlobResponseFields.File]]),
        );

        const link = document.createElement('a');
        link.href = downloadUrl;

        let downloadName: string = isFolder
          ? `${props.document[DocumentFields.TitleDocument]}.zip`
          : props.document[DocumentFields.FileDesc];

        link.setAttribute('download', downloadName);

        document.body.appendChild(link);
        link.click();
        link.remove();

        showLoading(false);
      },
    );
  };

  const onPreview = () => {
    showLoading(true);
    HttpFileDocument.download(props.document[EntityWithIdFields.Id]).then(
      (blob) => {
        setFileBlob(blob);
        setOpenPreview(true);
        showLoading(false);
      },
    );
  };

  const onClosePreview = () => {
    setOpenPreview(false);
    setFileBlob(undefined);
  };
  
  const getDropdownItems = () => {
    const list: MenuItemDropdown[] = []
    if (props.download) {
      list.push({
        label: 'Descargar',
        icon: <WrapperIcons Icon={DownloadSimple} size={'sm'} />,
        onClick: onDownload
      })
    }
    
    if (props.preview) {
      list.push({
        label: 'Ver',
        icon: <WrapperIcons Icon={MagnifyingGlass} size={'sm'} />,
        onClick: onPreview
      })
    }
    
    if (props.delete) {
      list.push({
        label: 'Eliminar',
        icon: <WrapperIcons Icon={Trash} size={'sm'} />,
        onClick: onShowConfirmDelete
      })
    }
    
    if (props.edit) {
      list.push({
        label: 'Editar',
        icon: <WrapperIcons Icon={PencilSimple} size={'sm'} />,
        onClick: () => setOpenEdit(true)
      })
    }
    
    if (props.relateToFolder) {
      list.push({
        label: 'Relacionar',
        icon: <WrapperIcons Icon={FolderPlus} size={'sm'} />,
        onClick: () => setShowShare(true)
      })
    }
    
    if (props.share) {
      list.push({
        label: 'Compartir',
        icon: <WrapperIcons Icon={ShareFat} size={'sm'} />,
        onClick: () => props.onShare ? props.onShare(props.document) : setShowShare(true)
      })
    }
    
    return list
  }

  return (
    <Box className={classes.root} key={props.key}>
      <Stack
        direction={'row'}
        spacing={2}
        justifyContent={'space-between'}
        sx={{ width: '100%' }}
      >
        <Stack
          direction={'row'}
          spacing={2}
          justifyContent={'flex-start'}
          alignItems={'center'}
          sx={{ width: !filePresent ? '50%' : '100%' }}
        >
          {isFolder
            ? fileFormatter.getIconFolder({ fontSize: props.fileIconSize ?? 'large' })
            : filePresent
              ? !props.dontGetIcon &&
                fileFormatter.getIconByFileName(
                  props.document[DocumentFields.FileDesc],
                  { fontSize: props.fileIconSize ?? 'large' },
                )
              : ''}
          <Stack
            direction={'column'}
            sx={{ width: '100%' }}
            justifyContent={'center'}
            alignItems={'center'}
          >
            <Stack
              direction={'row'}
              justifyContent={'space-between'}
              sx={{ width: '100%' }}
              minHeight={'36px'}
              overflow={'hidden'}
            >
              <div style={{overflow: 'hidden !important'}}>
                <TypographyBase variant={'label'} fontWeight={500} maxLines={2} tooltip overflowWrap={'anywhere'}>
                  {props.document[DocumentFields.TitleDocument]}
                </TypographyBase>
                <TypographyBase variant={'caption'} fontWeight={500} maxLines={2} tooltip color='text.lighter' overflowWrap={'anywhere'}>
                  {props.document[DocumentFields.FileDesc]}
                </TypographyBase>

                <Typography
                  variant={'caption'}
                  className={classes.descriptionFile}
                  style={{ wordWrap: 'break-word' }}
                >
                  {!filePresent
                    ? props.upload
                      ? 'Para subir un archivo, presione el botón'
                      : ''
                    : props.document[DocumentFields.DescriptionDocument] !==
                        '' &&
                      stringFormatter.cutIfHaveMoreThan(
                        props.document[DocumentFields.DescriptionDocument],
                        descLen,
                      )}
                </Typography>
              </div>

              {filePresent && !!props.action && (
                <Stack
                  direction={'row'}
                  justifyContent={'space-evenly'}
                  alignItems={'center'}
                  spacing={3}
                >
                  {props.action(props.document)}
                </Stack>
              )}
            </Stack>
          </Stack>
        </Stack>

        {hasActions && (
            props.dropdown ?
                <Stack
                    direction={'row'}
                    spacing={1}
                    justifyContent={'center'}
                    alignItems={'center'}
                >
                  {props.onSelect && (
                        <Checkbox
                            value={props.document[EntityWithIdFields.Id]}
                            checked={
                              props.selected !== undefined ? props.selected : undefined
                            }
                            onChange={(e) =>
                                props.onSelect &&
                                props.onSelect(
                                    e,
                                    props.document,
                                    props?.fileSolicitation && props.fileSolicitation,
                                )
                            }
                        />
                    )}
                  <ButtonIconDropdown label={''}
                                      items={getDropdownItems()}
                                      size={'small'}
                                      sx={{ backgroundColor: 'white' }}
                  />
                </Stack>
                :
              <Stack
                direction={'row'}
                spacing={1}
                justifyContent={'center'}
                alignItems={'center'}
              >
                {props.edit && (
                    <Box sx={{cursor: 'pointer'}} onClick={() => setOpenEdit(true)}>
                      <WrapperIcons Icon={PencilSimple} size={'sm'} />
                    </Box>
                )}
    
                {props.upload ? (
                  filePresent ? (
                    <UploadIconButton
                      color={'secondary'}
                      onClick={() => setShowUploadComponent(true)}
                    />
                  ) : (
                    <Button
                      sx={{ width: 1 }}
                      endIcon={<UploadIcon />}
                      fullWidth
                      onClick={() => setShowUploadComponent(true)}
                    >
                      Subir Archivo
                    </Button>
                  )
                ) : (
                  <></>
                )}
    
                {props.share && (
                    <Box sx={{cursor: 'pointer'}} onClick={() => setShowShare(true)}>
                      <WrapperIcons Icon={ShareFat} size={'sm'} />
                    </Box>
                )}
    
                {props.download && (
                    <Box sx={{cursor: 'pointer'}} onClick={onDownload}>
                      <WrapperIcons Icon={DownloadSimple} size={'sm'} />
                    </Box>
                )}
                {props.preview && (
                    <Box sx={{cursor: 'pointer'}} onClick={onPreview}>
                      <WrapperIcons Icon={MagnifyingGlass} size={'sm'} />
                    </Box>
                )}
                {props.delete &&
                    <Box sx={{cursor: 'pointer'}} onClick={onShowConfirmDelete}>
                      <WrapperIcons Icon={X} size={'sm'} />
                    </Box>
                }
                {props.onSelect && (
                  <Checkbox
                    value={props.document[EntityWithIdFields.Id]}
                    checked={
                      props.selected !== undefined ? props.selected : undefined
                    }
                    onChange={(e) =>
                      props.onSelect &&
                      props.onSelect(
                        e,
                        props.document,
                        props?.fileSolicitation && props.fileSolicitation,
                      )
                    }
                  />
                )}
              </Stack>
        )}
      </Stack>
      {props.delete && (
        <DialogAlert
          open={showConfirmDelete}
          onClose={onCancelDelete}
          onConfirm={onDeleteDocument}
          textContent={`¿Estás seguro de que querés eliminar el documento ${props.document[DocumentFields.TitleDocument]}?`}
        />
      )}
      {props.relateToFolder || props.share && (
        <RelateFileWithFolderDialog
          fileId={props.document[EntityWithIdFields.Id]}
          fileName={props.document[DocumentFields.FileDesc]}
          fileDesc={props.document[DocumentFields.DescriptionDocument]}
          open={showShare}
          onClose={() => {
            setShowShare(false);
          }}
          onReload={props.onReload}
          companyId={companyId}
          offererId={offerer[EntityWithIdFields.Id]}
          completeForm={
            !!(
              offerer &&
              offerer[EntityWithIdFields.Id] &&
              (!companyId || companyId == 0)
            )
          }
        />
      )}

      {showUploadComponent && props.uploadDialogProps && (
        <FileNewDialog
          {...props.uploadDialogProps}
          onCloseDialog={() => setShowUploadComponent(false)}
          onReload={props.onReload}
        />
      )}
      {openEdit && (
        <FileNewDialog
          section={props.document[DocumentFields.FileSectionCode]}
          onCloseDialog={() => {
            setOpenEdit(false);
          }}
          onLoadFileTypes={HttpCacheFiles.getTypes}
          fileType={props.document[DocumentFields.FileTypeCode]}
          fileSubType={props.document[DocumentFields.FileSubtypeCode]}
          fileToEdit={props.document}
          onReload={props.onReload}
        />
      )}

      {fileBlob && (
        <DialogPreviewFile
          open={openPreview}
          onClose={onClosePreview}
          fileBlob={fileBlob}
        />
      )}

      {isLoading && <LoaderBlockUI />}
    </Box>
  );
}

interface FileDocumentDetailLoadingProps {
  key?: Key | null;
}

export function FileDocumentDetailLoading({
  key,
}: FileDocumentDetailLoadingProps) {
  const classes = FileSelectedDetailStyles();

  return (
    <Box className={`${classes.root} ${classes.rootLoading}`} key={key}>
      <Stack direction={'row'} spacing={2} justifyContent={'space-between'}>
        <Stack
          direction={'row'}
          spacing={2}
          justifyContent={'flex-start'}
          alignItems={'center'}
          sx={{ width: '100%' }}
        >
          <Skeleton width="5%" height="150%">
            <Typography>.</Typography>
          </Skeleton>
          <Stack direction={'column'} sx={{ width: '100%' }}>
            <Stack
              direction={'row'}
              justifyContent={'space-between'}
              sx={{ width: '100%' }}
            >
              <Skeleton width="20%">
                <Typography>.</Typography>
              </Skeleton>
            </Stack>

            <Skeleton width="80%">
              <Typography>.</Typography>
            </Skeleton>
          </Stack>
        </Stack>
      </Stack>
    </Box>
  );
}

export default FileDocumentDetail;
