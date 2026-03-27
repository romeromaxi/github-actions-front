import React, {useEffect, useState} from "react";
import {Skeleton} from "@mui/lab";
import {Box, Button, Card, CardActions, CardContent, CardHeader, Stack, Typography} from "@mui/material";
import {Document, FileSolicitation, SolicitationFileRequested} from "../../../types/files/filesData";
import {AppConfigFields, AppConfigLogosFields} from "../../../types/appConfigEntities";
import SolicitationRequestedDocumentationComponent, {
    SolicitationCompanyFilePendingComponent,
    SolicitationCompanyFileSentComponent,
    SolicitationDocumentationComponent
} from "./SolicitationRequestedDocumentationComponent";
import {HttpFilesSolicitation, HttpSolicitation} from "../../../http/index";
import {WrapperIcons} from "../../../components/icons/Icons";
import {FolderSimpleStar} from "@phosphor-icons/react";
import SolicitationRequiredFileNewDialog
    from "../../offerer/components/OffererSolicitation/OffererSolicitationRequestedFiles/SolicitationRequiredFileNewDialog";
import {
    FileRequestedSolicitationInsert,
    FileRequestedSolicitationInsertFields,
    SolicitationDirectionTypeFileEnum,
    SolicitationInterchangedDocsContainer,
    SolicitationInterchangedDocsContainerFields,
    SolicitationViewDTO,
    SolicitationViewDTOFields
} from "../../../types/solicitations/solicitationData";
import {useAction} from "../../../hooks/useAction";
import useAxios from "../../../hooks/useAxios";
import SolicitationRequestedDocumentationApprovedDrawer
    from "../../offerer/solicitation/components/SolicitationRequestedDocumentationApprovedDrawer";
import {
    SolicitationDerivationSenderNewFileDrawer
} from "./SolicitationDerivationSenderNewFileDialog";
import {useCompanySolicitation} from "../../company/solicitations/CompanySolicitationContext";
import {AddButton} from "../../../components/buttons/Buttons";
import {CompanySolicitationFileHistoryFields} from "../../../types/company/companyData";

export enum SolicitationRequestedDocumentationVariant {
  UploadOnly,
  RequestAndSend,
  SendAndUpload
}

interface SolicitationRequestedDocumentationProps {
  variant: SolicitationRequestedDocumentationVariant,
  solicitationId?: number,
  solicitation?: SolicitationViewDTO,
  companyId?: number,
  offererId?: number,
  allowRequestNewFile?: boolean,
  includesCompanyFiles?: boolean,
  height?: string,
  minHeight?: string,
  maxHeight?: string,
  buttonPosition?: 'top' | 'bottom';
}

export const SolicitationRequestedDocumentationContext = React.createContext({
  isSender: false as boolean,
  companyId: 0 as number,
  onReloadRequestedFiles: () => { }
})

const getFileDate = (file: SolicitationInterchangedDocsContainer): number => {
  return new Date(file[SolicitationInterchangedDocsContainerFields.SendDate] ||
      file[SolicitationInterchangedDocsContainerFields.BeginDate]).getTime();
};

const sortByDateDesc = (a: SolicitationInterchangedDocsContainer, b: SolicitationInterchangedDocsContainer) =>
    getFileDate(b) - getFileDate(a);

const sortFilesByVariant = (
    files: SolicitationInterchangedDocsContainer[],
    variant: SolicitationRequestedDocumentationVariant
): SolicitationInterchangedDocsContainer[] => {

  if (variant === SolicitationRequestedDocumentationVariant.RequestAndSend) {
    return [...files].sort(sortByDateDesc)
  }

  const pendingSolicitations = files.filter(f =>
      (f[SolicitationInterchangedDocsContainerFields.Requested] && !f[SolicitationInterchangedDocsContainerFields.Sent])
      ||
      (f[SolicitationInterchangedDocsContainerFields.DirectionTypeFileCode] === SolicitationDirectionTypeFileEnum.CompanySolicitationFilePending)
  ).sort(sortByDateDesc);
  
  const sentSolicitations = files.filter(f =>
      f[SolicitationInterchangedDocsContainerFields.Requested] &&
      f[SolicitationInterchangedDocsContainerFields.Sent] &&
      f[SolicitationInterchangedDocsContainerFields.DirectionTypeFileCode] !== SolicitationDirectionTypeFileEnum.CompanySolicitationFilePending
  ).sort(sortByDateDesc);

  const sendFromReceiver = files.filter(f =>
      f[SolicitationInterchangedDocsContainerFields.DirectionTypeFileCode] === SolicitationDirectionTypeFileEnum.DocumentationSendFromReceiver
  ).sort(sortByDateDesc);

  const sendToReceiver = files.filter(f =>
      f[SolicitationInterchangedDocsContainerFields.DirectionTypeFileCode] ===
      SolicitationDirectionTypeFileEnum.DocuementationSendToReceiver
  ).sort(sortByDateDesc);

  if (variant === SolicitationRequestedDocumentationVariant.UploadOnly) {
    return [...pendingSolicitations, ...sendFromReceiver, ...sentSolicitations];
  }

  if (variant === SolicitationRequestedDocumentationVariant.SendAndUpload) {
    return [...pendingSolicitations, ...sendFromReceiver, ...sendToReceiver, ...sentSolicitations];
  }

  return files;
};

function SolicitationRequestedDocumentation({ 
  solicitation, solicitationId, variant, companyId, offererId, allowRequestNewFile, includesCompanyFiles, height, minHeight, maxHeight, buttonPosition = 'bottom' 
}: SolicitationRequestedDocumentationProps) {
  const { fetchData } = useAxios();
  const { snackbarSuccess, showLoader, hideLoader } = useAction();
  const [requiredFiles, setRequiredFiles] = useState<SolicitationInterchangedDocsContainer[]>();
  const [open, setOpen] = useState<boolean>(false);
  const [openNewFile, setOpenNewFile] = useState<boolean>(false);
  const [selectedFiles, setSelectedFiles] = useState<number[]>([]);
  const [approvedFiles, setApprovedFiles] = useState<FileSolicitation[]>()
  const [openApproved, setOpenApproved] = useState<boolean>(false)
  const {reloadAlertCode } = useCompanySolicitation();

  const loadRequestedFiles = (id: number) => {
    setRequiredFiles(undefined);
    
    Promise.all([
        HttpFilesSolicitation.getInterchangedFiles(id),
        HttpSolicitation.getCompanyFileSolicitations(id)
    ])
        .then(([response, companyFiles]) => {
            let finalFiles: SolicitationInterchangedDocsContainer[] = [...response]
            if (includesCompanyFiles) {
                const a = companyFiles.map((x, idx) => {
                    const fileIndex = companyFiles.length - idx;
                    
                    return {
                        [SolicitationInterchangedDocsContainerFields.Title]: companyFiles.length > 1 ? `Tu legajo de contacto N° ${fileIndex}` : 'Tu legajo de contacto',
                        [SolicitationInterchangedDocsContainerFields.Sent]: true,
                        [SolicitationInterchangedDocsContainerFields.Requested]: true,
                        [SolicitationInterchangedDocsContainerFields.SendDate]: x[CompanySolicitationFileHistoryFields.Date],
                        [SolicitationInterchangedDocsContainerFields.BeginDate]: x[CompanySolicitationFileHistoryFields.Date],
                        [SolicitationInterchangedDocsContainerFields.DirectionTypeFileCode]: SolicitationDirectionTypeFileEnum.CompanySolicitationFileSent,
                        [SolicitationInterchangedDocsContainerFields.Data]: {
                            ...x,
                            index: fileIndex
                        }
                    }
                })
                
                finalFiles = [...response, ...a]

                if (solicitation && solicitation[SolicitationViewDTOFields.RequestEditCompanyFile]) {
                    finalFiles.push({
                        [SolicitationInterchangedDocsContainerFields.Title]: 'Pedido actualización del legajo de contacto',
                        [SolicitationInterchangedDocsContainerFields.Sent]: true,
                        [SolicitationInterchangedDocsContainerFields.Requested]: true,
                        [SolicitationInterchangedDocsContainerFields.SendDate]: solicitation[SolicitationViewDTOFields.LastRequestEditCompanyFileDate],
                        [SolicitationInterchangedDocsContainerFields.BeginDate]: solicitation[SolicitationViewDTOFields.LastRequestEditCompanyFileDate],
                        [SolicitationInterchangedDocsContainerFields.DirectionTypeFileCode]: SolicitationDirectionTypeFileEnum.CompanySolicitationFilePending,
                        [SolicitationInterchangedDocsContainerFields.Data]: {}
                    })
                }
            }
            
            const sortedFiles = sortFilesByVariant(finalFiles, variant);
            setRequiredFiles(sortedFiles);
        })
    
    if (!!reloadAlertCode)
      reloadAlertCode();
  }

  const onReloadRequestedFiles = () =>
      loadRequestedFiles(solicitationId ?? 0)


  const loadApprovedFiles = (id: number) =>  {
    HttpFilesSolicitation.getApprovedFileList(id)
        .then(setApprovedFiles)
  }

  useEffect(() => {
    if (solicitationId) {
      loadRequestedFiles(solicitationId);
    }
  }, [solicitationId, variant]);//esto parece ser necesario porque variant en algunos casos cambia

  const handleCheckboxChange = (
      event: React.ChangeEvent<HTMLInputElement>,
      document: Document,
  ) => {
    let newSelectedFiles;
    if (event.target.checked) {
      newSelectedFiles = [...selectedFiles, parseInt(event.target.value)];
      setSelectedFiles(newSelectedFiles);
    } else {
      newSelectedFiles = selectedFiles.filter(
          (id) => id !== parseInt(event.target.value),
      );
      setSelectedFiles(newSelectedFiles);
    }
  };

  const onSaveFile = (fileRequested: FileRequestedSolicitationInsert) => {
    const submitData: FileRequestedSolicitationInsert = {
      ...fileRequested,
      [FileRequestedSolicitationInsertFields.DocumentIds]: selectedFiles,
    };

    fetchData(
        () => HttpFilesSolicitation.requestNewFile(solicitationId ?? 0, submitData),
        true,
    ).then(() => {
      snackbarSuccess('El documento se solicitó correctamente');
      onReloadRequestedFiles();
    });
  };

  const actionComponent =
      <Stack direction='row' alignItems='center' spacing={2} width={1}>
        {(allowRequestNewFile && variant === SolicitationRequestedDocumentationVariant.RequestAndSend) &&
            <AddButton size="small" fullWidth onClick={() => setOpen(true)} variant="outlined" color="secondary">
              Subir nuevo documento
            </AddButton>
        }
        {variant === SolicitationRequestedDocumentationVariant.SendAndUpload &&
            <AddButton size="small" fullWidth onClick={() => setOpenNewFile(true)} variant="outlined" color="secondary">
              Subir nuevo documento
            </AddButton>    
        }
      </Stack>

  const onViewApproved = () => {
    if (solicitationId) {
      showLoader()
      HttpFilesSolicitation.getApprovedFileList(solicitationId)
          .then((r) => {
            setApprovedFiles(r)
            setOpenApproved(true)
            hideLoader()
          })
    }
  }

  return (
      <Card sx={{ display: 'flex', flexDirection: 'column', minHeight: minHeight, maxHeight: maxHeight, width: '100%' }}>
        <CardHeader title={"Documentos compartidos"}
                    subheader={
                      variant === SolicitationRequestedDocumentationVariant.RequestAndSend ?
                          <Button variant='text' size='small'
                                  startIcon={<WrapperIcons Icon={FolderSimpleStar} size='sm' />}
                                  onClick={onViewApproved}
                          >
                            Ver archivos aprobados
                          </Button>
                          :
                          <></>
                    }
                    sx={{ flexShrink: 0 }}
        />
        <CardContent sx={{ flex: 1, overflow: 'auto', scrollbarGutter: 'stable', pr: 1, p: 2 }} >
          <Stack spacing={3}>
            {buttonPosition === 'top' && (
              <CardActions sx={{ paddingY: 0 }}>
                {actionComponent}
              </CardActions>
            )}
            <Stack spacing={1.5}>
              {!requiredFiles ?
                  <Stack>
                    <Skeleton />
                    <Skeleton />
                    <Skeleton />
                  </Stack>
                  :
                  requiredFiles.length !== 0 ?
                      <SolicitationRequestedDocumentationContext.Provider
                          value={{
                            isSender: variant === SolicitationRequestedDocumentationVariant.UploadOnly || variant === SolicitationRequestedDocumentationVariant.SendAndUpload,
                            companyId: companyId ?? 0,
                            onReloadRequestedFiles
                          }}>
                        {
                          requiredFiles.map((file, idx) =>
                              file[SolicitationInterchangedDocsContainerFields.DirectionTypeFileCode] === SolicitationDirectionTypeFileEnum.CompanySolicitationFileSent ?
                                  <SolicitationCompanyFileSentComponent key={`solicitationDocumentationComponent_${variant}_${idx}`}
                                                                        file={file} 
                                                                        solicitation={solicitation}
                                  /> 
                                  :
                                  file[SolicitationInterchangedDocsContainerFields.DirectionTypeFileCode] === SolicitationDirectionTypeFileEnum.CompanySolicitationFilePending ?
                                      <SolicitationCompanyFilePendingComponent key={`solicitationDocumentationComponent_${variant}_${idx}`} 
                                                                               file={file}
                                                                               solicitation={solicitation}
                                      />
                                      :
                              file[SolicitationInterchangedDocsContainerFields.Requested] ?
                                  <SolicitationRequestedDocumentationComponent key={`solicitationRequestedDocumentationComponent_${variant}_${idx}`}
                                                                               file={file[SolicitationInterchangedDocsContainerFields.Data] as SolicitationFileRequested}
                                                                               hasPermissions={!!allowRequestNewFile}
                                  />
                                  :
                                  <SolicitationDocumentationComponent file={file}
                                                                      solicitationId={solicitationId}
                                                                      key={`solicitationDocumentationComponent_${variant}_${idx}`}
                                  />
                          )
                        }
                      </SolicitationRequestedDocumentationContext.Provider>
                      :
                      <Stack spacing={3} sx={{ justifyContent: 'center', alignItems: 'center', paddingY: 10}}>
                        <Box
                            component={'img'}
                            sx={{
                              height: 70,
                              width: 110,
                              m: '0 auto !important',
                            }}
                            src={window.APP_CONFIG[AppConfigFields.Logos][AppConfigLogosFields.Full]}
                        />
                        <Typography variant={'body2'} color={'text.lighter'} textAlign={'center'}>
                          No hay pedidos de documentación ni documentos enviados para esta solicitud
                        </Typography>
                      </Stack>
              }
            </Stack>
          </Stack>
        </CardContent>
        {buttonPosition === 'bottom' && (
          <CardActions sx={{ paddingBottom: 0, flexShrink: 0 }}>
            {actionComponent}  
          </CardActions>
        )}
        {
            solicitation &&
            <SolicitationRequiredFileNewDialog
                solicitation={solicitation}
                open={open}
                onClose={() => setOpen(false)}
                onSubmitDialog={onSaveFile}
                onSelect={handleCheckboxChange}
                onReload={onReloadRequestedFiles}
                selectedFiles={selectedFiles}
            />
        }
        {
            approvedFiles && solicitationId &&
            <SolicitationRequestedDocumentationApprovedDrawer open={openApproved}
                                                              onClose={() => setOpenApproved(false)}
                                                              approvedDocs={approvedFiles}
                                                              solicitationId={solicitationId}
                                                              onReload={() => loadApprovedFiles(solicitationId)}
                                                              canApproveDocumentation={variant === SolicitationRequestedDocumentationVariant.RequestAndSend}
            />
        }

          {
              openNewFile && solicitationId && 
                <SolicitationDerivationSenderNewFileDrawer open={openNewFile}
                                                           onClose={() => setOpenNewFile(false)}
                                                           solicitationId={solicitationId}
                                                           onReload={onReloadRequestedFiles}
                                                           offererId={offererId}
                                                           companyId={companyId}
                />
          }
      </Card>
  )
}

export default SolicitationRequestedDocumentation;
