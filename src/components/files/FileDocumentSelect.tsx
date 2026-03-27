

import React, { Key, useState } from 'react';
import {
    Box,
    Checkbox,
    Stack,
    Typography,
} from '@mui/material';
import { DialogAlert } from 'components/dialog';

import { LoaderBlockUI } from 'components/loader';

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
import DialogPreviewFile from './DialogPreviewFile';
import {WrapperIcons} from "../icons/Icons";
import {FileText, MagnifyingGlass, X} from "@phosphor-icons/react";
import {DownloadSimple} from "phosphor-react";
import {TypographyBase} from "../misc/TypographyBase";

interface FileDocumentSelectProps {
    document: Document;
    onReload?: () => void;
    delete?: boolean;
    download?: boolean;
    onSelect?: (
        event: React.ChangeEvent<HTMLInputElement>,
        document: Document,
        fileSolicitation?: FileSolicitation,
    ) => void;
    selected?: boolean;
    preview?: boolean;
    deleteBody?: DocumentDelete;
    fileSolicitation?: FileSolicitation;
    key?: Key | null;
}

function FileDocumentSelect(props: FileDocumentSelectProps) {
    const classes = FileSelectedDetailStyles();
    const isFolder: boolean = props.document[DocumentFields.NumberFiles] > 1;
    
    const [isLoading, showLoading] = useState<boolean>(false);
    const [showConfirmDelete, setShowConfirmDelete] = useState<boolean>(false);
    
    const [fileBlob, setFileBlob] = useState<FileBlobResponse>();
    const [openPreview, setOpenPreview] = useState<boolean>(false);

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

    return (
        <Box className={classes.root} key={props.key}>
            <Stack direction={'row'} spacing={2} justifyContent={'space-between'}>
                <Stack>
                    <Stack direction={'row'} alignItems={'center'} spacing={1}>
                        <WrapperIcons Icon={FileText} size={'sm'} />
                        <Stack>
                            <TypographyBase variant={'subtitle1'} fontWeight={500} maxLines={2} tooltip
                                            overflowWrap={'anywhere'}
                            >
                                {props.document[DocumentFields.TitleDocument]}
                            </TypographyBase>
                            <TypographyBase variant={'caption'} fontWeight={500} maxLines={2} tooltip color='text.lighter'
                                            overflowWrap={'anywhere'}
                            >
                                {props.document[DocumentFields.FileDesc]}
                            </TypographyBase>
                        </Stack>
                    </Stack>
                    <Typography fontSize={12} color={'#818992'}>{`${Math.floor(props.document[DocumentFields.FileSize] / 1000)} Kb`}</Typography>
                </Stack>
                <Stack
                    direction={'row'}
                    spacing={2}
                    alignItems={'center'}
                >
                    {props.delete && <Box sx={{cursor: 'pointer'}} onClick={onShowConfirmDelete}>
                        <WrapperIcons Icon={X} size={'sm'} />
                    </Box>}
                    {props.preview && (<Box sx={{cursor: 'pointer'}} onClick={onPreview}>
                        <WrapperIcons Icon={MagnifyingGlass} size={'sm'} />
                    </Box>)}
                    {
                        props.download &&
                        <Box sx={{cursor: 'pointer'}} onClick={onDownload}>
                            <WrapperIcons Icon={DownloadSimple} size={'sm'} />
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
            </Stack>
            {props.delete && (
                <DialogAlert
                    open={showConfirmDelete}
                    onClose={onCancelDelete}
                    onConfirm={onDeleteDocument}
                    textContent={`¿Estás seguro de que querés eliminar el documento ${props.document[DocumentFields.TitleDocument]}?`}
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

export default FileDocumentSelect;
