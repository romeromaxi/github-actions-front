import {Button, Grid, Skeleton, Stack, TextField, Typography} from "@mui/material";
import React, {ChangeEvent, useCallback, useContext, useEffect, useState} from "react";
import {
    SolicitationAnalysisViewDTO,
    SolicitationAnalysisViewDTOFields
} from "types/solicitations/solicitationAnalysisData";
import {TypographyBase} from "components/misc/TypographyBase";
import {useSolicitation} from "hooks/contexts/SolicitationsContext";
import useSecurityObject from "hooks/useSecurityObject";
import {SolicitationProposedApprovalFlowContext} from "../SolicitationProposedApprovalFlow";
import {Document, FileBase} from "types/files/filesData";
import {BaseRequestFields, EntityWithIdFields} from "types/baseEntities";
import SolicitationProposedFiles from "./SolicitationProposedFiles";
import {useAction} from "hooks/useAction";
import useAxios from "hooks/useAxios";
import {
    SolicitationDocumentationAnalysisUpdateConsiderations, SolicitationDocumentationAnalysisUpdateConsiderationsFields
} from "types/solicitations/solicitationDocumentationAnalysisData";
import SolicitationProposedCommunication from "./SolicitationProposedCommunication";
import {OffererSolicitationAnalysisFormDataRequest} from "types/offerer/offererSolicitationData";
import {SolicitationHelper} from "util/helpers/solicitationHelper";

interface SolicitationProposedFormProps {
    dataAnalysis?: SolicitationAnalysisViewDTO,
    safetyComponentName?: string, 
    safetyObjectName?: string,
    handleSave: (considerations: string, aptitude: string, aditionalMessages?: OffererSolicitationAnalysisFormDataRequest[]) => void
}

function SolicitationProposedForm({ dataAnalysis, safetyComponentName, safetyObjectName, handleSave }: SolicitationProposedFormProps) {
    const { solicitation, flowTabs: {proposal}, HttpAnalysis, HttpFiles } = useContext(SolicitationProposedApprovalFlowContext);
    const { snackbarSuccess, snackbarError } = useAction();
    const { fetchData } = useAxios();
    const { isStageResponsible } = useSolicitation();
    const { hasWritePermission } = useSecurityObject();
    const writePermission =
        (!safetyComponentName || !safetyObjectName || hasWritePermission(safetyComponentName, safetyObjectName)) &&
        isStageResponsible;
    const isTabActive = SolicitationHelper.isTabActive(solicitation, proposal);

    const [considerations, setConsiderations] = useState<string>(dataAnalysis?.consideraciones ?? '');
    const [filesSolicitation, setFilesSolicitation] = useState<Document[]>();

    const onChangeTextField = (e: ChangeEvent<HTMLInputElement>) =>
        setConsiderations(e.target.value);
    
    const getDefaultTextField = () => dataAnalysis?.consideraciones ?? '';

    const onSaveCommunication = (aptitude: string, msgs?: OffererSolicitationAnalysisFormDataRequest[]) =>
        handleSave(considerations, aptitude, msgs);
    
    const updateConsiderations = () => {
        const body : SolicitationDocumentationAnalysisUpdateConsiderations = {
            [SolicitationDocumentationAnalysisUpdateConsiderationsFields.Considerations]: considerations,
            [BaseRequestFields.ModuleCode]: 1,
            [BaseRequestFields.OriginCode]: 1
            
        };
        
        fetchData(
            () => HttpAnalysis.updateConsiderations(solicitation[EntityWithIdFields.Id], body),
            true
        )
            .then(() => snackbarSuccess('Las consideraciones se guardaron exitosamente.'))
    }
    
    const onSaveFile = (fileBase: FileBase, file: File) => {
        let solicitationAnalysisId: number =
            dataAnalysis?.[EntityWithIdFields.Id] ?? 0;
        return HttpFiles.insert(
            solicitation[EntityWithIdFields.Id],
            solicitationAnalysisId,
            fileBase,
            file,
        )
            .then(() => {
                snackbarSuccess('El documento se guardó correctamente');
                loadFiles()
            })
            .catch(() => snackbarError('Ocurrió un error al guardar el archivo'));
    };    
    
    const loadFiles = useCallback(() => {
        setFilesSolicitation(undefined);
        if (dataAnalysis) {
            HttpFiles.getList(
                solicitation[EntityWithIdFields.Id],
                dataAnalysis[EntityWithIdFields.Id]
            ).then(setFilesSolicitation)
        }
    }, [solicitation, dataAnalysis])
    
    useEffect(() => {
        if (dataAnalysis) {
            loadFiles()
            setConsiderations(dataAnalysis[SolicitationAnalysisViewDTOFields.Considerations])
        }
    }, [dataAnalysis]);
    
    return (
        <Grid container spacing={2}>
            <Grid item xs={12}>
                <Stack width={1} spacing={1}>
                    <Stack direction={'row'}
                           justifyContent={'space-between'}
                           alignItems={'center'}
                    >
                        <Typography variant={'body2'} fontWeight={500}>
                            Consideraciones de uso interno
                        </Typography>
    
                        {
                            (writePermission && isTabActive && !!dataAnalysis) &&
                                <Button variant={"text"} size="small" onClick={updateConsiderations}>
                                    Guardar
                                </Button>
                        }
                    </Stack>

                    {
                        (!!dataAnalysis) ?
                            (writePermission && isTabActive) ?
                                <TextField size="small"
                                           onChange={onChangeTextField}
                                           defaultValue={getDefaultTextField()}
                                           multiline rows={3} fullWidth
                                />
                                :
                                <TypographyBase variant={'caption'} color={'text.lighter'} whiteSpace={'pre-line'}>
                                    {getDefaultTextField() || "Sin consideraciones."}
                                </TypographyBase>
                            :
                            <Skeleton />
                    }
                </Stack>
            </Grid>
            
            <Grid item xs={12}>
                <SolicitationProposedFiles filesSolicitation={filesSolicitation}
                                           onRealodFiles={loadFiles}
                                           onSaveFile={onSaveFile}
                                           hasPermissions={writePermission && isTabActive}
                />
            </Grid>

            <Grid item xs={12}>
                <SolicitationProposedCommunication dataAnalysis={dataAnalysis}
                                                   handleSaveCommunication={onSaveCommunication}
                                                   safetyObjectName={safetyObjectName}
                                                   safetyComponentName={safetyComponentName}
                                                   hasPermissions={writePermission && isTabActive}
                />
            </Grid>
        </Grid>
    )
}

export default SolicitationProposedForm;