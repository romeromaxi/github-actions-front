import React, {useContext, useEffect, useMemo, useState} from "react";
import {Box, Stack, Tooltip, Typography} from "@mui/material";
import {BaseIconWrapper, WrapperIcons} from "../../../../components/icons/Icons";
import {DownloadSimple, Files} from "phosphor-react";
import {CaretLeft} from "@phosphor-icons/react";
import {
    Document,
    FileSolicitation,
    SolicitationFileRequested,
    SolicitationFileRequestedFields
} from "../../../../types/files/filesData";
import {HttpFileDocument, HttpFiles, HttpFilesSolicitation} from "../../../../http";
import {EntityWithIdFields} from "../../../../types/baseEntities";
import {useAction} from "../../../../hooks/useAction";
import SolicitationRequestedFileFormDocuments from "./components/SolicitationRequestedFileFormDocuments";
import SolicitationRequestedFileSendDocuments from "./components/SolicitationRequestedFileSendDocuments";
import useAxios from "../../../../hooks/useAxios";
import DrawerBase from "../../../../components/misc/DrawerBase";
import SolicitationRequestedNewDocument from "./components/SolicitationRequestedNewDocument";
import {
    SolicitationDirectionTypeFileEnum,
    SolicitationInterchangedDocsContainer,
    SolicitationInterchangedDocsContainerFields
} from "../../../../types/solicitations/solicitationData";
import {SendButton} from "../../../../components/buttons/Buttons";
import {
    SolicitationRequestedDocumentationContext
} from "../../../solicitations/components/SolicitationRequestedDocumentation";


interface SolicitationRequestedFileDocumentsDrawerProps {
    open: boolean,
    onClose: (reload?: boolean) => void,
    file: SolicitationFileRequested,
    companyId: number
}


const SolicitationRequestedFileDocumentsDrawer = (props: SolicitationRequestedFileDocumentsDrawerProps) => {
    const { isSender } = useContext(SolicitationRequestedDocumentationContext);
    const [loading, setLoading] = useState<boolean>(false)
    const [formFiles, setFormFiles] = useState<Document[]>()
    const [fileDocuments, setFileDocuments] = useState<Document[]>()
    const [openNew, setOpenNew] = useState<boolean>(false)
    const [onCloseReload, setOnCloseReload] = useState<boolean>(false);
    const {snackbarError, snackbarSuccess} = useAction()
    const {fetchData, fetchAndDownloadFile} = useAxios()
    const disableComponent = props.file[SolicitationFileRequestedFields.Sent]
    
    const loadData = () => {
        if (props.open) {
            setLoading(true)
            const promises = []
            if (props.file[SolicitationFileRequestedFields.DocumentId] !== 0) 
                promises.push(HttpFileDocument.getListByDocumentId(props.file[SolicitationFileRequestedFields.DocumentId]))
            
            promises.push(HttpFilesSolicitation.getRelatedDocs(props.file[SolicitationFileRequestedFields.SolicitationId], props.file[EntityWithIdFields.Id]))
            
            Promise.all(promises).then((values) => {
                if (props.file[SolicitationFileRequestedFields.DocumentId] !== 0) {
                    setFormFiles(values[0])
                    setFileDocuments(values[1])
                } else {
                    setFormFiles([])
                    setFileDocuments(values[0])
                }
            }).catch(() => snackbarError('Ocurrió un error al cargar los archivos'))
                .finally(() => setLoading(false))
            }
    }
    
    const handleReloadPymeDocs = () => {
        setLoading(true)
        HttpFilesSolicitation.getRelatedDocs(props.file[SolicitationFileRequestedFields.SolicitationId], props.file[EntityWithIdFields.Id]).then((r) => 
            setFileDocuments(r)
        ).finally(() => {
            setLoading(false)
        })
    }
    
    useEffect(() => {
        loadData()
    }, [props.open])
    
    
    const handleRemove = (id: number) => {
        fetchData(
            () => 
                HttpFilesSolicitation.removeRequiredFile(props.file[SolicitationFileRequestedFields.SolicitationId], props.file[EntityWithIdFields.Id], id),
            true
        ).then(() => {
            handleReloadPymeDocs()
            setOnCloseReload(true)
        })
    }

    const handleSaveNew = () => {
        handleReloadPymeDocs()
        setOnCloseReload(true);
        setOpenNew(false)
    }
    
    const onSubmitDocumentation = () => {
        fetchData(
            () => HttpFilesSolicitation.sendRequestListToOfferer(props.file[SolicitationFileRequestedFields.SolicitationId], [props.file[EntityWithIdFields.Id]]),
            true
        ).then(() => {
            props.onClose(true)
            snackbarSuccess('El pedido fue actualizado correctamente')
        })
    }
    
    const handleDownloadForms = () => {
        fetchAndDownloadFile(
            () => HttpFileDocument.download(props.file[SolicitationFileRequestedFields.DocumentId])
        ).then(() => snackbarSuccess('El formulario adjunto fue descargado correctamente'))
    }
    
    const drawerIcon = (!openNew) ?
      <BaseIconWrapper Icon={Files} size={"md"}/> : 
      <Box sx={{ cursor: 'pointer' }} onClick={() => setOpenNew(false)}>
          <WrapperIcons Icon={CaretLeft} size={'md'} />
      </Box>;
    
    const drawerActions = (!openNew && !disableComponent) ?
        <SendButton variant={'contained'}
                    onClick={onSubmitDocumentation}
        >
            Enviar
        </SendButton>
      : <div></div>;

    const onDownloadAll = () => {
        if(props.file[SolicitationFileRequestedFields.DocumentsQuantity] > 0 || fileDocuments?.length !== 0) {
            fetchAndDownloadFile(() =>
                HttpFilesSolicitation.downloadRequiredFiles(
                    props.file[SolicitationFileRequestedFields.SolicitationId],
                    props.file[EntityWithIdFields.Id],
                ),
            ).then(() => {
                snackbarSuccess('Los documentos fueron descargados con éxito')
            });
        } else {
            snackbarError('No hay documentos para descargar')
        }
    }

    const handleCloseDrawer = () => {
        props.onClose(onCloseReload);
        setOpenNew(false);
    }
    
    return (
      <DrawerBase show={props.open}
                  title={!openNew ? 'Pedido de documentación' : 'Adjuntar nuevo documento'}
                  Icon={drawerIcon}
                  onCloseDrawer={handleCloseDrawer}
                  action={drawerActions}
      >
          <Stack spacing={2} width={1}>
              <Stack spacing={1}>
                  <Typography variant={'h3'}>{props.file[SolicitationFileRequestedFields.Title]}</Typography>
                  <Typography color={'#818992'}>{props.file[SolicitationFileRequestedFields.Observations]}</Typography>
              </Stack>

              {
                  !openNew ?
                    <React.Fragment>
                        <SolicitationRequestedFileFormDocuments docs={formFiles}
                                                                loading={loading}
                                                                onDownloadAll={handleDownloadForms}
                        />
                        <Stack spacing={1}>
                            <Stack direction='row' alignItems='center' justifyContent='space-between'>
                                <Typography variant={'h4'}>
                                    {
                                        disableComponent ?
                                            `Documentos ${isSender ? 'enviados' : 'recibidos'}`
                                            :
                                            'Documentos a enviar'
                                    }
                                </Typography>
                                {fileDocuments && fileDocuments.length !== 0 &&
                                    <Tooltip title={'Descargar todo'}>
                                        <div onClick={onDownloadAll} style={{cursor: 'pointer'}}>
                                            <BaseIconWrapper Icon={DownloadSimple} size={'md'} />
                                        </div>
                                    </Tooltip>
                                }
                            </Stack>
                            <SolicitationRequestedFileSendDocuments docs={fileDocuments}
                                                                    loading={loading}
                                                                    onRemove={handleRemove}
                                                                    addNewDoc={() => setOpenNew(true)}
                                                                    disable={disableComponent}
                                                                    received={!isSender}
                                                                    solicitationId={props.file[SolicitationFileRequestedFields.SolicitationId]}
                                                                    onReload={loadData}
                            />
                        </Stack>
                    </React.Fragment>
                    :
                    <SolicitationRequestedNewDocument onFinishSave={handleSaveNew}
                                                      fileSolicitationRequestId={props.file[EntityWithIdFields.Id]}
                                                      solicitationId={props.file[SolicitationFileRequestedFields.SolicitationId]}
                                                      companyId={props.companyId}
                    />
              }
          </Stack>
      </DrawerBase>
    )
}

export default SolicitationRequestedFileDocumentsDrawer


interface SolicitationFileDocumentsDrawerProps {
    open: boolean,
    onClose: (reload?: boolean) => void,
    file: SolicitationInterchangedDocsContainer,
    companyId: number,
    solicitationId: number
}

export const SolicitationFileDocumentsDrawer = (props: SolicitationFileDocumentsDrawerProps) => {
    const { isSender } = useContext(SolicitationRequestedDocumentationContext);
    
    const [loading, setLoading] = useState<boolean>(false)
    const [fileDocuments, setFileDocuments] = useState<Document[]>()
    const [openNew, setOpenNew] = useState<boolean>(false)
    const [onCloseReload, setOnCloseReload] = useState<boolean>(false);
    const {snackbarError, snackbarSuccess} = useAction()
    const {fetchData, fetchAndDownloadFile} = useAxios()
    const fileSolicitation = props.file[SolicitationInterchangedDocsContainerFields.Data] as FileSolicitation
    const disableComponent = props.file[SolicitationFileRequestedFields.Sent];
    
    const headerTitle = useMemo(() => {
        if (!disableComponent) 
            return isSender ? 'Documentos a enviar' : '';
        
        const directionTypeFileCode = props.file[SolicitationInterchangedDocsContainerFields.DirectionTypeFileCode];
        const isSenderDocument = !isSender ? 
            directionTypeFileCode === SolicitationDirectionTypeFileEnum.DocumentationSendFromReceiver : 
            directionTypeFileCode === SolicitationDirectionTypeFileEnum.DocuementationSendToReceiver;
        
        return `Documentos ${isSenderDocument ? 'enviados' : 'recibidos'}`
    }, [disableComponent, isSender, props.file]);
    
    const loadData = () => {
        if (props.open) {
            HttpFilesSolicitation.getFilesListByDocumentId(props.solicitationId, fileSolicitation[EntityWithIdFields.Id])
                .then(setFileDocuments)
                .catch(() => snackbarError('Ocurrió un error al cargar los archivos'))
                .finally(() => {
                    setLoading(false)
                })
        }
    }

    useEffect(() => {
        loadData()
    }, [props.open])

    const handleRemove = (id: number) => {
        fetchData(
            () =>
                HttpFiles.delete(id),
            true
        ).then(() => {
            loadData()
            setOnCloseReload(true)
        })
    }

    const handleSaveNew = () => {
        loadData()
        setOnCloseReload(true);
    }

    const onSubmitDocumentation = () => {
        fetchData(
            () => HttpFilesSolicitation.sendSharedFiles(props.solicitationId, [fileSolicitation[EntityWithIdFields.Id]]),
            true
        ).then(() => {
            props.onClose(true)
            snackbarSuccess('El documento fue enviado correctamente')
        })
    }

    const onDownloadAll = () => {
        fetchAndDownloadFile(
            () => HttpFileDocument.download(fileSolicitation[EntityWithIdFields.Id])
        ).then(() => snackbarSuccess('Los archivos subidos fueron descargados correctamente'))
    }

    const drawerIcon = (!openNew) ?
        <BaseIconWrapper Icon={Files} size={"md"}/> :
        <Box sx={{ cursor: 'pointer' }} onClick={() => setOpenNew(false)}>
            <WrapperIcons Icon={CaretLeft} size={'md'} />
        </Box>;

    const drawerActions = (!openNew && !disableComponent) ?
        <SendButton variant={'contained'}
                onClick={onSubmitDocumentation}
        >
            Enviar
        </SendButton>
        : <div></div>;

    
    const handleCloseDrawer = () => {
        props.onClose(onCloseReload);
    }

    return (
        <DrawerBase show={props.open}
                    title={'Documentación'}
                    Icon={drawerIcon}
                    onCloseDrawer={handleCloseDrawer}
                    action={drawerActions}
        >
            <Stack spacing={2} width={1}>
                {
                    !openNew ?
                        <React.Fragment>
                            <Stack spacing={1}>
                                <Stack direction='row' alignItems='center' justifyContent='space-between'>
                                    <Typography variant={'h4'}>
                                        {headerTitle}
                                    </Typography>
                                    {fileDocuments && fileDocuments.length !== 0 &&
                                        <Tooltip title={'Descargar todo'}>
                                            <div onClick={onDownloadAll} style={{cursor: 'pointer'}}>
                                                <BaseIconWrapper Icon={DownloadSimple} size={'md'} />
                                            </div>
                                        </Tooltip>
                                    }
                                </Stack>
                                <SolicitationRequestedFileSendDocuments docs={fileDocuments}
                                                                        loading={loading}
                                                                        onRemove={handleRemove}
                                                                        addNewDoc={() => setOpenNew(true)}
                                                                        disable
                                                                        received={!isSender}
                                                                        solicitationId={props.solicitationId}
                                                                        onReload={loadData}
                                />
                            </Stack>
                        </React.Fragment>
                        :
                        <SolicitationRequestedNewDocument onFinishSave={handleSaveNew}
                                                          solicitationId={props.solicitationId}
                                                          companyId={props.companyId}
                        />
                }
            </Stack>
        </DrawerBase>
    )
}