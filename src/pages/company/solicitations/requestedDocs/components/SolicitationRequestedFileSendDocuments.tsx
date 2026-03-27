import {Document, DocumentFields, FileBlobResponse, FileBlobResponseFields} from "../../../../../types/files/filesData";
import {Chip, Stack, Typography} from "@mui/material";
import {Skeleton} from "@mui/lab";
import React, {useContext, useState} from "react";
import {WrapperIcons} from "../../../../../components/icons/Icons";
import {Check, DownloadSimple, FloppyDiskBack, Paperclip, Prohibit} from "phosphor-react";
import {FileText, MagnifyingGlass, X} from "@phosphor-icons/react";
import {EntityWithIdFields} from "../../../../../types/baseEntities";
import ButtonFileNew from "../../../../../components/buttons/ButtonFileNew";
import {TypographyBase} from "../../../../../components/misc/TypographyBase";
import RelateFileWithFolderDialog from "../../../../../components/files/RelateFileWithFolderDialog";
import {OffererContext} from "../../../../offerer/components/OffererContextProvider";
import {ButtonIconDropdown, MenuItemDropdown} from "../../../../../components/buttons/Buttons";
import {HttpFileDocument, HttpFilesSolicitation} from "../../../../../http";
import {useAction} from "../../../../../hooks/useAction";
import DialogPreviewFile from "../../../../../components/files/DialogPreviewFile";
import useAxios from "../../../../../hooks/useAxios";
import {DialogAlert} from "../../../../../components/dialog";


interface SolicitationRequestedFileSendDocumentsProps {
    docs?: Document[],
    loading: boolean,
    onRemove: (docId: number) => void,
    addNewDoc: () => void,
    disable: boolean,
    received?: boolean,
    solicitationId?: number,
    onReload?: () => void;
}


const SolicitationRequestedFileSendDocuments = ({docs, loading, onRemove, addNewDoc, disable, received, solicitationId, onReload} : SolicitationRequestedFileSendDocumentsProps) => {
    const [shareFile, setShareFile] = useState<Document | undefined>(undefined)
    const [invalidateDoc, setInvalidateDoc] = useState<Document | undefined>(undefined)
    const [validateDoc, setValidateDoc] = useState<Document | undefined>(undefined)
    const offerer  = useContext(OffererContext)
    const [fileBlob, setFileBlob] = useState<FileBlobResponse>();
    const [openPreview, setOpenPreview] = useState<boolean>(false);
    const {showLoader, hideLoader, snackbarSuccess} = useAction()
    const {fetchData} = useAxios()
    const onClickShare = (doc: Document) => {
        setShareFile(doc)
    }

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
                    onReload && onReload()
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
                    onReload && onReload()
                }
            })
    }
    const onClickInvalidate = (doc: Document) => setInvalidateDoc(doc)
    
    const onClickValidate = (doc: Document) => setValidateDoc(doc)
    
    const getDropdownItems = (doc: Document) => {
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
        if (!disable)
            list.push({
                label: 'Eliminar',
                icon: <WrapperIcons Icon={X} size={'sm'} />,
                onClick: () => onRemove(doc[EntityWithIdFields.Id])
            })
        if (received) {
            list.push({
                label: 'Guardar',
                icon: <WrapperIcons Icon={FloppyDiskBack} size={'sm'} />,
                onClick: () => onClickShare(doc)
            })
        }
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
        received && list.push(doc[DocumentFields.Approved] ? itemApproved : itemInvalid)
        
        return list
    }

    const onClosePreview = () => {
        setOpenPreview(false);
        setFileBlob(undefined);
    };
    
    return (
        <Stack spacing={2}>
            {loading ?
                <Stack sx={{borderRadius: '16px', border: '1px solid #C3CCD7', backgroundColor: 'white !important', padding: '24px'}}>
                    <Skeleton width={'100%'}/>
                </Stack>
                :
                docs && docs.length !== 0 &&
                docs.map((d) =>
                    <Stack sx={{borderRadius: '16px', border: '1px solid #C3CCD7', backgroundColor: 'white !important', padding: '24px'}}
                           direction={'row'} justifyContent={'space-between'} alignItems={'center'}
                    >
                        <Stack width={disable ? '100%' : '85%'}>
                            <Stack direction={'row'} alignItems={'center'} spacing={1} overflow={'hidden'}>
                                <WrapperIcons Icon={FileText} size={'sm'} />
                                <TypographyBase variant={'subtitle1'} maxLines={2} tooltip fontWeight={500}>{d[DocumentFields.FileDesc]}</TypographyBase>
                            </Stack>
                            <Typography fontSize={12} color={'#818992'}>{`${Math.floor(d[DocumentFields.FileSize] / 1000)} Kb`}</Typography>
                        </Stack>
                        
                        <Stack direction={'row'} spacing={2} alignItems={'center'}>
                            {
                                (d[DocumentFields.Approved] && !!received) &&
                                    <Chip color='success' label='Validado' size='small'/>
                            }
                            
                            <ButtonIconDropdown label={''}
                                                items={getDropdownItems(d)}
                                                size='small'
                            />
                        </Stack>
                    </Stack>
                )
            }
            {!disable && <ButtonFileNew title={'Adjuntar nuevo documento'} onClick={addNewDoc} icon={Paperclip} />}
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
        </Stack>
    )
}


export default SolicitationRequestedFileSendDocuments