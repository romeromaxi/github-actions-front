import {
    Document,
    DocumentFields,
    FileBlobResponse,
    FileBlobResponseFields,
    FileSolicitation
} from "types/files/filesData";
import DrawerBase from "../../../../components/misc/DrawerBase";
import {Alert, Chip, Stack, Tooltip, Typography} from "@mui/material";
import {BaseIconWrapper, WrapperIcons} from "../../../../components/icons/Icons";
import {FileText, MagnifyingGlass} from "@phosphor-icons/react";
import {TypographyBase} from "../../../../components/misc/TypographyBase";
import {ButtonIconDropdown, MenuItemDropdown} from "../../../../components/buttons/Buttons";
import React, {useContext, useState} from "react";
import {Check, DownloadSimple, FloppyDiskBack, Prohibit} from "phosphor-react";
import useAxios from "../../../../hooks/useAxios";
import {HttpFileDocument, HttpFilesSolicitation} from "../../../../http";
import {EntityWithIdFields} from "../../../../types/baseEntities";
import {useAction} from "../../../../hooks/useAction";
import DialogPreviewFile from "../../../../components/files/DialogPreviewFile";
import {DialogAlert} from "../../../../components/dialog";
import RelateFileWithFolderDialog from "../../../../components/files/RelateFileWithFolderDialog";
import {OffererContext} from "../../components/OffererContextProvider";

interface SolicitationRequestedDocumentationApprovedDrawerProps {
    open: boolean,
    onClose: () => void,
    approvedDocs: FileSolicitation[],
    solicitationId: number,
    onReload: () => void,
    canApproveDocumentation?: boolean
}


const SolicitationRequestedDocumentationApprovedDrawer = ({open, onClose, approvedDocs, solicitationId, onReload, canApproveDocumentation} : SolicitationRequestedDocumentationApprovedDrawerProps) => {
    const [shareFile, setShareFile] = useState<Document | undefined>(undefined)
    const [fileBlob, setFileBlob] = useState<FileBlobResponse>();
    const [openPreview, setOpenPreview] = useState<boolean>(false);
    const [invalidateDoc, setInvalidateDoc] = useState<FileSolicitation | undefined>(undefined)
    const [validateDoc, setValidateDoc] = useState<FileSolicitation | undefined>(undefined)
    const offerer  = useContext(OffererContext)
    
    const {fetchData, fetchAndDownloadFile} = useAxios()
    const {showLoader, hideLoader, snackbarSuccess} = useAction()
    const onDownloadAll = () => 
        fetchAndDownloadFile(() =>
            HttpFilesSolicitation.downloadApprovedFiles(solicitationId),
        );

    const onDownload = (doc: Document) => {
        showLoader()

        HttpFileDocument.download(doc[EntityWithIdFields.Id]).then(
            (blobResponse: FileBlobResponse) => {
                const downloadUrl = window.URL.createObjectURL(
                    new Blob([blobResponse[FileBlobResponseFields.File]]),
                );

                const link = document.createElement('a');
                link.href = downloadUrl;

                let downloadName: string = doc[DocumentFields.FileDesc];

                link.setAttribute('download', downloadName);

                document.body.appendChild(link);
                link.click();
                link.remove();

                hideLoader()
            },
        );
    };

    const onPreview = (doc: Document) => {
        showLoader()
        HttpFileDocument.download(doc[EntityWithIdFields.Id]).then(
            (blob) => {
                setFileBlob(blob);
                setOpenPreview(true);
                hideLoader()
            },
        );
    };

    const onClickShare = (doc: Document) => {
        setShareFile(doc)
    }

    const handleInvalidate = () => {
        if (invalidateDoc)
            fetchData(
                () =>
                    HttpFilesSolicitation.removeValidateFile(solicitationId ?? 0, invalidateDoc[EntityWithIdFields.Id]),
                true
            ).then((r) => {
                if (!r.tieneError) {
                    snackbarSuccess('El documento fue invalidado correctamente')
                    setInvalidateDoc(undefined)
                    onReload()
                }
            })
    }

    const handleValidate = () => {
        if (validateDoc)
            fetchData(
                () => HttpFilesSolicitation.validateFile(solicitationId ?? 0, validateDoc[EntityWithIdFields.Id]),
                true
            ).then((r) => {
                if (!r.tieneError) {
                    snackbarSuccess('El documento fue validado correctamente')
                    setValidateDoc(undefined)
                    onReload()
                }
            })
    }

    const onClosePreview = () => {
        setOpenPreview(false);
        setFileBlob(undefined);
    };
    const onClickInvalidate = (doc: FileSolicitation) => setInvalidateDoc(doc)

    const onClickValidate = (doc: FileSolicitation) => setValidateDoc(doc)
    const getDropdownItems = (doc: FileSolicitation) => {
        const list: MenuItemDropdown[] = []
        list.push({
            label: 'Descargar',
            icon: <WrapperIcons Icon={DownloadSimple} size={'sm'} />,
            onClick: () => onDownload(doc)
        })
        list.push({
            label: 'Ver',
            icon: <WrapperIcons Icon={MagnifyingGlass} size={'sm'} />,
            onClick: () => onPreview(doc)
        })
        list.push({
            label: 'Guardar',
            icon: <WrapperIcons Icon={FloppyDiskBack} size={'sm'} />,
            onClick: () => onClickShare(doc)
        })
        const itemApproved: MenuItemDropdown = {
            label: 'Invalidar',
            icon: <WrapperIcons Icon={Prohibit} size={'sm'} />,
            onClick: () => onClickInvalidate(doc)
        }
        const itemInvalid: MenuItemDropdown = {
            label: 'Validar',
            icon: <WrapperIcons Icon={Check} size={'sm'} />,
            onClick: () => onClickValidate(doc)
        }
        !!canApproveDocumentation && list.push(doc[DocumentFields.Approved] ? itemApproved : itemInvalid)

        return list
    }
    
    return (
        <DrawerBase show={open}
                    onCloseDrawer={onClose}
                    title={'Documentos aprobados'}
                    titleAction={
                        approvedDocs.length !== 0 &&
                        <Tooltip title={'Descargar todo'}>
                            <div onClick={onDownloadAll} style={{cursor: 'pointer'}}>
                                <BaseIconWrapper Icon={DownloadSimple} size={'md'} />
                            </div>
                        </Tooltip>
                    }
        >
            <Stack spacing={2}>
                {approvedDocs.length !== 0 ?
                    approvedDocs.map((d) =>
                        <Stack sx={{borderRadius: '16px', border: '1px solid #C3CCD7', backgroundColor: 'white !important', padding: '24px'}}
                               direction={'row'} justifyContent={'space-between'} alignItems={'center'}
                        >
                            <Stack width={'100%'}>
                                <Stack direction={'row'} alignItems={'center'} spacing={1} overflow={'hidden'}>
                                    <WrapperIcons Icon={FileText} size={'sm'} />
                                    <TypographyBase variant={'subtitle1'} maxLines={2} tooltip fontWeight={500}>{d[DocumentFields.FileDesc]}</TypographyBase>
                                </Stack>
                                <Typography fontSize={12} color={'#818992'}>{`${Math.floor(d[DocumentFields.FileSize] / 1000)} Kb`}</Typography>
                            </Stack>

                            <Stack direction={'row'} spacing={2} alignItems={'center'}>
                                {
                                    d[DocumentFields.Approved] &&
                                        <Chip color='success' label='Validado' size='small'/>
                                }

                                <ButtonIconDropdown label={''}
                                                    items={getDropdownItems(d)}
                                                    size='small'
                                />
                            </Stack>
                        </Stack>
                    )
                    :
                    <Alert severity='info'>No hay documentos aprobados por el momento</Alert>
                }
                {fileBlob && (
                    <DialogPreviewFile
                        open={openPreview}
                        onClose={onClosePreview}
                        fileBlob={fileBlob}
                    />
                )}
                {
                    invalidateDoc &&
                    <DialogAlert onClose={() => setInvalidateDoc(undefined)}
                                 open={true}
                                 title={'Invalidar documento'}
                                 textContent={'¿Estás seguro que querés invalidar este documento?'}
                                 onConfirm={handleInvalidate}
                    />
                }
                {
                    validateDoc &&
                    <DialogAlert onClose={() => setValidateDoc(undefined)}
                                 open={true}
                                 title={'Validar documento'}
                                 textContent={'¿Estás seguro que querés validar este documento?'}
                                 onConfirm={handleValidate}
                    />
                }
                {
                    !!shareFile &&
                    <RelateFileWithFolderDialog fileId={shareFile[EntityWithIdFields.Id]}
                                                open={true}
                                                onClose={() => setShareFile(undefined)}
                                                fileName={shareFile[DocumentFields.TitleDocument]}
                                                fileDesc={shareFile[DocumentFields.FileDesc]}
                                                offererId={offerer[EntityWithIdFields.Id]}
                                                solicitationId={solicitationId}
                                                completeForm
                    />
                }
            </Stack>
        </DrawerBase>
    )
}


export default SolicitationRequestedDocumentationApprovedDrawer