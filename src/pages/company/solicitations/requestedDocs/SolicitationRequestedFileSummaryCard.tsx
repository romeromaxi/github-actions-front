import {Chip, Stack, Typography} from "@mui/material";
import {WrapperIcons} from "../../../../components/icons/Icons";
import {CaretRight, Check, Clock, DownloadSimple, Paperclip} from "phosphor-react";
import {SolicitationFileRequested, SolicitationFileRequestedFields} from "../../../../types/files/filesData";
import {dateFormatter} from "../../../../util/formatters/dateFormatter";
import {ButtonIconDropdown} from "../../../../components/buttons/Buttons";
import {useAction} from "../../../../hooks/useAction";
import useAxios from "../../../../hooks/useAxios";
import {HttpFilesSolicitation} from "../../../../http";
import {EntityWithIdFields} from "../../../../types/baseEntities";
import {useState} from "react";
import SolicitationRequestedFileDocumentsDrawer from "./SolicitationRequestedFileDocumentsDrawer";
import {MagnifyingGlass} from "@phosphor-icons/react";
import React from "react";


interface SolicitationRequestedFileSummaryCardProps {
    file: SolicitationFileRequested,
    companyId: number,
    onReload: () => void
}


const SolicitationRequestedFileSummaryCard = ({file, companyId, onReload} : SolicitationRequestedFileSummaryCardProps) => {
    const sent = file[SolicitationFileRequestedFields.Sent]
    const {snackbarSuccess} = useAction()
    const {fetchAndDownloadFile} = useAxios()
    const [open, setOpen] = useState<boolean>(false)
    
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
    
    const handleOpenFileDialog = () => setOpen(true)
    
    const handleCloseFileDialog = (reload?: boolean) => {
        setOpen(false)
        if (reload) {
            onReload()
        }
    }
    
    return (
        <React.Fragment>
            <Stack spacing={1}
                   onClick={handleOpenFileDialog}
                   sx={{padding: '16px', border: '1px solid #EDF2F7', borderRadius: '16px', backgroundColor: sent ? '#F7FAFC' : 'white', cursor: 'pointer'}}>
                <Stack direction='row' alignItems='center' justifyContent={'space-between'}>
                    <Chip size={'small'} label={
                        <Stack direction='row' alignItems='center' spacing={1}>
                            <WrapperIcons Icon={sent ? Check : Clock} size={'sm'} />
                            <Typography fontSize={12}>{sent ? 'Presentado' : 'Pendiente'}</Typography>
                        </Stack>
                    }
                          color={sent ? 'success' : 'warning'}
                    />
                    {
                        sent &&
                            <ButtonIconDropdown label={''}
                                size={'small'} color={"inherit"} items={[
                                {label: 'Descargar documentos', icon: <WrapperIcons Icon={DownloadSimple} size={'sm'} />,
                                 onClick: onDownloadDocuments
                                },
                                {
                                    label: 'Ver detalle', icon: <WrapperIcons Icon={MagnifyingGlass} size={'sm'} />,
                                    onClick: handleOpenFileDialog
                                }
                            ]}
                            />
                    }
                </Stack>
                <Stack direction={'row'} alignItems={'center'} justifyContent={'space-between'} spacing={3}>
                    <Typography fontWeight={500}>{file[SolicitationFileRequestedFields.Title]}</Typography>
                    {!sent && <WrapperIcons Icon={CaretRight} size={'sm'} />}
                </Stack>
                <Stack direction='row' alignItems='center' spacing={2}>
                    <Typography color={'#818992'} fontSize={12}>
                        {dateFormatter.toShortDate(file[SolicitationFileRequestedFields.BeginDate])}
                    </Typography>
                    <Stack spacing={0.5} direction={'row'} alignItems={'center'}>
                        <WrapperIcons Icon={Paperclip} size={'xs'} />
                        <Typography color={'#818992'} fontSize={12}>
                            {`${!!file[SolicitationFileRequestedFields.DocumentsQuantity] ? file[SolicitationFileRequestedFields.DocumentsQuantity] : 0}`}
                        </Typography>
                    </Stack>
                </Stack>
            </Stack>
            <SolicitationRequestedFileDocumentsDrawer open={open}
                                                      onClose={handleCloseFileDialog}
                                                      file={file}
                                                      companyId={companyId}
            />
        </React.Fragment>
    )
}


export default SolicitationRequestedFileSummaryCard