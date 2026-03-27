import React, {useContext, useMemo, useState} from "react";
import clsx from 'clsx';
import {
    DocumentFields,
    FileSolicitationFields,
    SolicitationFileRequested,
    SolicitationFileRequestedFields
} from "types/files/filesData";
import {useAction} from "hooks/useAction";
import useAxios from "hooks/useAxios";
import {HttpFileDocument, HttpFilesSolicitation} from "http/index";
import {EntityWithIdFields} from "types/baseEntities";
import {Button, Stack, Theme, Tooltip, useMediaQuery} from "@mui/material";
import {WrapperIcons} from "components/icons/Icons";
import {ButtonIconDropdown, MenuItemDropdown} from "components/buttons/Buttons";
import {DownloadSimple, MagnifyingGlass, Paperclip} from "@phosphor-icons/react";
import {dateFormatter} from "util/formatters/dateFormatter";
import {SolicitationRequestedDocumentationContext} from "./SolicitationRequestedDocumentation";
import SolicitationRequestedFileDocumentsDrawer, {
    SolicitationFileDocumentsDrawer
} from "pages/company/solicitations/requestedDocs/SolicitationRequestedFileDocumentsDrawer";
import {
    SolicitationDirectionTypeFileEnum,
    SolicitationInterchangedDocsContainer,
    SolicitationInterchangedDocsContainerFields,
    SolicitationViewDTO,
    SolicitationViewDTOFields
} from "../../../types/solicitations/solicitationData";
import {DialogAlert} from "../../../components/dialog";
import {TypographyBase} from "../../../components/misc/TypographyBase";
import {ArrowUpFromLineIcon, SendIcon, TrashIcon} from "lucide-react";
import SolicitationRequestedDocumentationComponentStyles from "./SolicitationRequestedDocumentationComponent.styles";
import {CompanySolicitationFileHistory, CompanySolicitationFileHistoryFields} from "../../../types/company/companyData";
import {useNavigate} from "react-router-dom";

interface SolicitationRequestedDocumentationComponentProps {
    file: SolicitationFileRequested,
    hasPermissions: boolean
}

function SolicitationRequestedDocumentationComponent({ file, hasPermissions }: SolicitationRequestedDocumentationComponentProps) {
    const classes = SolicitationRequestedDocumentationComponentStyles();
    const {snackbarSuccess} = useAction()
    const {fetchAndDownloadFile, fetchData} = useAxios()
    const fullWidthButtons = useMediaQuery((theme: Theme) => theme.breakpoints.down('sm'));

    const { isSender, companyId, onReloadRequestedFiles } = useContext(SolicitationRequestedDocumentationContext);
    const sent = file[SolicitationFileRequestedFields.Sent];

    const [openDrawer, setOpenDrawer] = useState<boolean>(false);
    const [openDelete, setOpenDelete] = useState<boolean>(false);

    const handleOpenFileDialog = () => {
        if (isSender || sent) setOpenDrawer(true);
    }

    const handleCloseFileDialog = (reload?: boolean) => {
        setOpenDrawer(false);
        if (reload) {
            onReloadRequestedFiles()
        }
    }

    const onDownloadDocuments = () => {
        fetchAndDownloadFile(() =>
            HttpFilesSolicitation.downloadRequiredFiles(
                file[SolicitationFileRequestedFields.SolicitationId],
                file[EntityWithIdFields.Id],
            ),
        ).then(() => {
            snackbarSuccess('Los documentos fueron descargados con éxito')
        });
    }

    const handleOpenDeleteDialog = () => setOpenDelete(true);

    const handleCloseDeleteDialog = () => setOpenDelete(false);

    const onDeleteRequestedFiles = () => {
        fetchData(
            () =>
                HttpFilesSolicitation.inactivateRequestedFiles(
                    file[SolicitationFileRequestedFields.SolicitationId],
                    file[EntityWithIdFields.Id],
                ),
            true,
        )
            .then(() => {
                snackbarSuccess('El pedido de documentación se eliminó correctamente');
                onReloadRequestedFiles();
            })
            .catch(handleCloseDeleteDialog)
    };

    const itemsDropdownMenu: MenuItemDropdown[] = useMemo(() => {
        const items: MenuItemDropdown[] = [];

        if (sent) {
            items.push({
                label: 'Descargar documentos',
                icon: <WrapperIcons Icon={DownloadSimple} size={'sm'} />,
                onClick: onDownloadDocuments
            });
            items.push({
                label: 'Ver detalle',
                icon: <WrapperIcons Icon={MagnifyingGlass} size={'sm'} />,
                onClick: handleOpenFileDialog
            });
        } else if (hasPermissions) {
            items.push({
                label: 'Cancelar pedido',
                icon: <WrapperIcons Icon={TrashIcon} size={'sm'} />,
                onClick: handleOpenDeleteDialog
            });
        }

        return items;
    }, [sent]);

    return (
        <React.Fragment>
            <Stack className={clsx(classes.containerRoot, {
                    [classes.containerSent]: sent,
                    [classes.containerPending]: !sent
                   })} 
                   onClick={handleOpenFileDialog}
            >
                <Stack direction={{ xs: 'column', sm: 'row' }}
                       alignItems={{ xs: 'start', sm: 'center' }}
                       justifyContent={'space-between'}
                       spacing={{ xs: 1, sm: 3 }}
                >
                    <Stack direction={'column'} spacing={0.25}>
                        {
                            !isSender ?
                                <TypographyBase variant='body3' color={sent ? 'primary.main' : 'warning.main'}>
                                    {sent ? 'Recibido' : 'Pendiente de respuesta'}
                                </TypographyBase>
                                :
                                <TypographyBase variant='body3' color={sent ? 'primary.main' : 'warning.main'}>
                                    {sent ? 'Presentado' : 'Solicitud pendiente'}
                                </TypographyBase>
                        }

                        <TypographyBase variant="body2" fontWeight={600}>
                            {file[SolicitationFileRequestedFields.Title]}
                        </TypographyBase>

                        <Stack direction={'row'} spacing={2}>
                            <TypographyBase color={'text.lighter'} variant="body3">
                                {!isSender ? sent ?
                                        `Recibido el ${dateFormatter.toShortDate(file[SolicitationFileRequestedFields.SentDate] || file[SolicitationFileRequestedFields.BeginDate])}`
                                        :
                                        `Pedido el ${dateFormatter.toShortDate(file[SolicitationFileRequestedFields.SentDate] || file[SolicitationFileRequestedFields.BeginDate])}`
                                    :
                                    sent ?
                                        `Presentado el ${dateFormatter.toShortDate(file[SolicitationFileRequestedFields.SentDate] || file[SolicitationFileRequestedFields.BeginDate])}`
                                        :
                                        `Solicitado el ${dateFormatter.toShortDate(file[SolicitationFileRequestedFields.SentDate] || file[SolicitationFileRequestedFields.BeginDate])}`
                                }
                            </TypographyBase>

                            {
                                (isSender || sent) &&
                                <Stack spacing={0.5} direction={'row'} alignItems={'center'}>
                                    <WrapperIcons Icon={Paperclip} size={'xs'} />
                                    <TypographyBase color={'text.lighter'} variant="body3">
                                        {`${!!file[SolicitationFileRequestedFields.DocumentsQuantity] ? file[SolicitationFileRequestedFields.DocumentsQuantity] : 0}`}
                                    </TypographyBase>
                                </Stack>
                            }
                        </Stack>
                    </Stack>

                    {(isSender && !sent) ?
                        <Button size="small" variant="contained" 
                                startIcon={<WrapperIcons Icon={ArrowUpFromLineIcon} /> } 
                                onClick={handleOpenFileDialog}
                                sx={{ minWidth: 'fit-content' }}
                                fullWidth={fullWidthButtons}
                        >
                            Subir Documento
                        </Button>
                        :
                        
                        (!sent && hasPermissions) ?
                            <Tooltip title={"Cancelar pedido"}>
                                <Button variant="outlined" size="small" onClick={handleOpenDeleteDialog} color="secondary"
                                        sx={{ minWidth: 'fit-content' }}
                                        fullWidth={fullWidthButtons}
                                >
                                    <WrapperIcons Icon={TrashIcon} size={'xs'} />
                                </Button>
                            </Tooltip>
                            :
                            <Button variant="outlined" size="small" onClick={handleOpenFileDialog}
                                    color="secondary"
                                    fullWidth={fullWidthButtons}
                            >
                                Ver
                            </Button>
                    }
                </Stack>
            </Stack>

            <SolicitationRequestedFileDocumentsDrawer open={openDrawer}
                                                      onClose={handleCloseFileDialog}
                                                      file={file}
                                                      companyId={companyId}
            />

            <DialogAlert open={openDelete}
                         title="Eliminar pedido de documentación"
                         textContent="¿Estás seguro que deseás eliminar el pedido de documentación?"
                         onClose={handleCloseDeleteDialog}
                         onConfirm={onDeleteRequestedFiles}
            />
        </React.Fragment>
    )
}

export default SolicitationRequestedDocumentationComponent;


interface SolicitationDocumentationComponentProps {
    file: SolicitationInterchangedDocsContainer, solicitationId: number
}


export const SolicitationDocumentationComponent = ({file, solicitationId} : SolicitationDocumentationComponentProps) => {
    const classes = SolicitationRequestedDocumentationComponentStyles();
    const {snackbarSuccess} = useAction()
    const {fetchAndDownloadFile} = useAxios()
    const { isSender, companyId, onReloadRequestedFiles } = useContext(SolicitationRequestedDocumentationContext);
    const sent = file[FileSolicitationFields.Sent]
    const directionTypeFileCode = file[SolicitationInterchangedDocsContainerFields.DirectionTypeFileCode];
    const isSenderDocument = !isSender ?
        directionTypeFileCode === SolicitationDirectionTypeFileEnum.DocumentationSendFromReceiver :
        directionTypeFileCode === SolicitationDirectionTypeFileEnum.DocuementationSendToReceiver;
    const fullWidthButtons = useMediaQuery((theme: Theme) => theme.breakpoints.down('sm'));

    const headerSection = useMemo(() => {
        const headerTitle = isSenderDocument ? sent ? 'Enviado' : 'Pendiente de envío' : 'Recibido';

        return (
            <TypographyBase variant='body3' color={isSenderDocument ? sent ? 'primary.main' : 'warning.main' : 'primary.main'}>
                {headerTitle}
            </TypographyBase>
        )
    }, [file, isSender]);

    const [openDrawer, setOpenDrawer] = useState<boolean>(false);

    const handleOpenFileDialog = () => {
        setOpenDrawer(true);
    }

    const handleCloseFileDialog = (reload?: boolean) => {
        setOpenDrawer(false);
        if (reload) {
            onReloadRequestedFiles();
        }
    }

    const onDownloadDocuments = () => {
        fetchAndDownloadFile(() =>
            HttpFileDocument.download(file[SolicitationInterchangedDocsContainerFields.Data][EntityWithIdFields.Id])
        ).then(() => {
            snackbarSuccess('Los archivos fueron descargados con éxito')
        });
    }

    const dropdownMenu =
        <ButtonIconDropdown label={''}
                            size={'small'} color={"inherit"} items={[
            {
                label: 'Descargar documentos', icon: <WrapperIcons Icon={DownloadSimple} size={'sm'} />,
                onClick: onDownloadDocuments
            },
            {
                label: 'Ver detalle', icon: <WrapperIcons Icon={MagnifyingGlass} size={'sm'} />,
                onClick: handleOpenFileDialog
            }]}
        />

    return (
        <React.Fragment>
            <Stack className={`${classes.containerRoot} ${classes.containerSent}`} 
                   onClick={handleOpenFileDialog}
            >
                <Stack direction={{ xs: 'column', sm: 'row' }}
                       alignItems={{ xs: 'start', sm: 'center' }}
                       justifyContent={'space-between'}
                       spacing={{ xs: 1, sm: 3 }}
                >
                    <Stack direction={'column'} spacing={0.25}>
                        {headerSection}

                        <TypographyBase variant="body2" fontWeight={600}>{file[SolicitationInterchangedDocsContainerFields.Title]}</TypographyBase>

                        <Stack direction={'row'} spacing={2}>
                            <TypographyBase color={'text.lighter'} variant='body3'>
                                {isSenderDocument ?
                                    `Enviado el ${dateFormatter.toShortDate(file[SolicitationInterchangedDocsContainerFields.SendDate] || file[SolicitationInterchangedDocsContainerFields.BeginDate])}`
                                    :
                                    `Recibido el ${dateFormatter.toShortDate(file[SolicitationInterchangedDocsContainerFields.SendDate] || file[SolicitationInterchangedDocsContainerFields.BeginDate])}`
                                }
                            </TypographyBase>

                            {
                                (isSender || sent) &&
                                <Stack spacing={0.5} direction={'row'} alignItems={'center'}>
                                    <WrapperIcons Icon={Paperclip} size={'xs'} />
                                    <TypographyBase color={'text.lighter'} variant='body3'>
                                        {`${!!file[SolicitationInterchangedDocsContainerFields.Data][DocumentFields.NumberFiles] ?
                                            file[SolicitationInterchangedDocsContainerFields.Data][DocumentFields.NumberFiles] : 0}`}
                                    </TypographyBase>
                                </Stack>
                            }
                        </Stack>
                    </Stack>
                    
                    {(isSenderDocument && !sent) ?
                        <Button size="small" variant="contained"
                                startIcon={<WrapperIcons Icon={ArrowUpFromLineIcon} /> } 
                                onClick={handleOpenFileDialog}
                                sx={{ minWidth: 'fit-content' }}
                                fullWidth={fullWidthButtons}
                        >
                            Subir Documento
                        </Button>
                        :
                        <Button variant="outlined" size="small" 
                                onClick={handleOpenFileDialog} color="secondary"
                                fullWidth={fullWidthButtons}
                        >
                            Ver
                        </Button>
                    }
                </Stack>
            </Stack>

            <SolicitationFileDocumentsDrawer open={openDrawer}
                                             onClose={handleCloseFileDialog}
                                             file={file}
                                             companyId={companyId}
                                             solicitationId={solicitationId}
            />
        </React.Fragment>
    )
}

interface SolicitationCompanyFileSentComponentProps {
    file: SolicitationInterchangedDocsContainer, 
    solicitation?: SolicitationViewDTO
}

export const SolicitationCompanyFileSentComponent = ({ file, solicitation }: SolicitationCompanyFileSentComponentProps) => {
    const classes = SolicitationRequestedDocumentationComponentStyles();
    const navigate = useNavigate();
    const fullWidthButtons = useMediaQuery((theme: Theme) => theme.breakpoints.down('sm'));
    
    // @ts-ignore
    const isFirstFile = file[SolicitationInterchangedDocsContainerFields.Data][CompanySolicitationFileHistoryFields.Index] === 1

    const onShowCompanyFile = (e: any) => {
        e.stopPropagation();
        
        if (solicitation) {
            const fileHistory: CompanySolicitationFileHistory = file[SolicitationInterchangedDocsContainerFields.Data] as CompanySolicitationFileHistory
            const state = {
                mode: 'view' as const,
                title: `Legajo de contacto`,
                companyFileId: fileHistory[EntityWithIdFields.Id],
                fileTypeCode: solicitation[SolicitationViewDTOFields.FileTypeCode],
                sentDate: fileHistory[CompanySolicitationFileHistoryFields.Date]
            };
            navigate(`/mis-solicitudes/${solicitation[SolicitationViewDTOFields.CompanyId]}/${solicitation[EntityWithIdFields.Id]}/legajo`, { state });
        }
    }
    
    return (
        <Stack className={`${classes.containerRoot} ${classes.containerSent}`}
               onClick={onShowCompanyFile}
        >
            <Stack direction={{ xs: 'column', sm: 'row' }}
                   alignItems={{ xs: 'start', sm: 'center' }}
                   justifyContent={'space-between'}
                   spacing={{ xs: 1, sm: 3 }}
            >
                <Stack direction={'column'} spacing={0.25}>
                    <TypographyBase variant='body3' color={'primary.main'}>
                        {`Enviado${isFirstFile ? ' automaticamente' : ''}`}
                    </TypographyBase>

                    <TypographyBase variant="body2" fontWeight={600}>{file[SolicitationInterchangedDocsContainerFields.Title]}</TypographyBase>

                    <Stack direction={'row'} spacing={2}>
                        <TypographyBase color={'text.lighter'} variant='body3'>
                            {`Enviado el ${dateFormatter.toShortDate(file[SolicitationInterchangedDocsContainerFields.SendDate] || file[SolicitationInterchangedDocsContainerFields.BeginDate])}`}
                        </TypographyBase>
                    </Stack>
                </Stack>

                <Button variant="outlined" size="small"
                        onClick={onShowCompanyFile}
                        color="secondary"
                        fullWidth={fullWidthButtons}
                >
                    Ver
                </Button>
            </Stack>
        </Stack>
    )
}


export const SolicitationCompanyFilePendingComponent = ({ file, solicitation }: SolicitationCompanyFileSentComponentProps) => {
    const classes = SolicitationRequestedDocumentationComponentStyles();
    const navigate = useNavigate();
    const fullWidthButtons = useMediaQuery((theme: Theme) => theme.breakpoints.down('sm'));

    const onShowCompanyFileEdit = (e: any) => {
        e.stopPropagation();

        if (solicitation) {
            const state = {
                mode: 'edit' as const,
                title: `Legajo de ${solicitation[SolicitationViewDTOFields.CompanyBusinessName]}`,
                fileTypeCode: solicitation[SolicitationViewDTOFields.FileTypeCode]
            };
            navigate(`/mis-solicitudes/${solicitation[SolicitationViewDTOFields.CompanyId]}/${solicitation[EntityWithIdFields.Id]}/legajo`, { state });
        }
    }
    
    return (
        <Stack className={`${classes.containerRoot} ${classes.containerPending}`}
               onClick={onShowCompanyFileEdit}
        >
            <Stack direction={{ xs: 'column', sm: 'row' }}
                   alignItems={{ xs: 'start', sm: 'center' }}
                   justifyContent={'space-between'}
                   spacing={{ xs: 1, sm: 3 }}
            >
                <Stack direction={'column'} spacing={0.25}>
                    <TypographyBase variant='body3' color={'warning.main'}>
                        Actualización solicitada
                    </TypographyBase>

                    <TypographyBase variant="body2" fontWeight={600}>{file[SolicitationInterchangedDocsContainerFields.Title]}</TypographyBase>

                    <Stack direction={'row'} spacing={2}>
                        <TypographyBase color={'text.lighter'} variant='body3'>
                            {`Solicitado el ${dateFormatter.toShortDate(file[SolicitationInterchangedDocsContainerFields.SendDate] || file[SolicitationInterchangedDocsContainerFields.BeginDate])}`}
                        </TypographyBase>
                    </Stack>
                </Stack>

                <Button size="small" variant="contained"
                        startIcon={<WrapperIcons Icon={SendIcon} /> }
                        onClick={onShowCompanyFileEdit}
                        sx={{ minWidth: 'fit-content' }}
                        fullWidth={fullWidthButtons}
                >
                    Actualizar
                </Button>
            </Stack>
        </Stack>
    )
}