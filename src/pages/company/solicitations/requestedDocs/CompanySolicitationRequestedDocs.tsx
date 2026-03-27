
import {Box, Card, CardContent, Stack, Typography} from "@mui/material";
import SolicitationRequestedFileSummaryCard from "./SolicitationRequestedFileSummaryCard";
import React, {useCallback, useEffect, useState} from "react";
import {HttpFilesSolicitation} from "../../../../http";
import {useParams} from "react-router-dom";
import {SolicitationFileRequested} from "../../../../types/files/filesData";
import {Skeleton} from "@mui/lab";
import {AppConfigFields, AppConfigLogosFields} from "../../../../types/appConfigEntities";

const CompanySolicitationRequestedDocs = () => {
    const params = useParams()
    const [requiredFiles, setRequiredFiles] = useState<SolicitationFileRequested[]>([])
    const [loading, setLoading] = useState<boolean>(false)
    
    const loadFiles = useCallback(() => {
        setLoading(true)
        HttpFilesSolicitation.getOffererRequestedFiles(
            parseInt(params.solicitationId),
        ).then((list) => {
            setRequiredFiles(list.reverse())
        }).finally(() => setLoading(false));
    }, [params]);

    useEffect(() => {
        loadFiles();
    }, [loadFiles]);
    
    return (
        <Card>
            <CardContent>
                <Stack spacing={4}>
                    <Typography variant={'h4'} fontWeight={500}>Documentación</Typography>
                    <Stack spacing={2}>
                        {loading ?
                            <Stack>
                                <Skeleton sx={{width: '100%' }} height={50}/>
                                <Skeleton sx={{width: '100%' }} height={50}/>
                                <Skeleton sx={{width: '100%' }} height={50}/>                        
                            </Stack>
                            :
                            requiredFiles.length !== 0 ?
                                requiredFiles.map((file, idx) => 
                                    <SolicitationRequestedFileSummaryCard key={`requiredFile_${idx}_cardDetail`}
                                                                          file={file} companyId={parseInt(params.companyId)}
                                                                          onReload={loadFiles}
                                    />
                                )
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
                                        No hay pedidos de documentación para esta solicitud
                                    </Typography>
                                </Stack>
                        }
                    </Stack>
                </Stack>
            </CardContent>
        </Card>
    )
}

export default CompanySolicitationRequestedDocs