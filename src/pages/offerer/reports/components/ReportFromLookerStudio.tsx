import {Box, Card, CardContent, CardHeader, Grid, Stack, Typography } from "@mui/material";
import {useEffect, useState } from "react"
import {HttpOffererReports} from "../../../../http/offerer/httpOffererReports";
import {HttpReports} from "../../../../http/reports/httpReports";
import {OffererReportSummary, OffererReportSummaryFields} from "../../../../types/offerer/offererReports";
import {Skeleton} from "@mui/lab";
import useAxios from "../../../../hooks/useAxios";
import {useAction} from "../../../../hooks/useAction";
import {BaseResponseFields} from "../../../../types/baseEntities";
import {ButtonExportDropdown} from "../../../../components/buttons/ButtonExportDropdown";
import * as React from "react";

interface ReportFromLookerStudioProps {
    reportId: number,
    offererId?: number,
}

function ReportFromLookerStudio({ offererId, reportId }: ReportFromLookerStudioProps) {
    const [src, setSrc] = useState<string>();
    const [report, setReport] = useState<OffererReportSummary>()
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<boolean>(false);
    
    const {snackbarSuccess} = useAction()
    const { fetchAndDownloadFile } = useAxios()
    
    const generateReport = () => {
        setLoading(true)
        setError(false)
        
        let createReportInstancePromise = !offererId ?
            HttpReports.createReportInstance(reportId, {})
            :
            HttpOffererReports.createReportInstance(offererId, reportId, {});

        createReportInstancePromise
            .then((instance) => {
                setSrc(instance[BaseResponseFields.Data])
            })
            .catch(() => setError(true))
            .finally(() => setLoading(false))
    }
    
    const loadReportData = () => {
        HttpReports.getById(reportId)
            .then(setReport)
        
        generateReport();
    }
    
    useEffect(() => {
        if (!report)
            loadReportData();
    }, []);
    
    const downloadReport = () => {
        fetchAndDownloadFile(
            () => HttpReports.export(reportId, {})
        ).then(() => snackbarSuccess('El reporte fue descargado correctamente'))
    }
    
    return (
        <Grid container>
            <Grid item xs={12}>
                <Card>
                    <CardHeader title={!report ? <Skeleton /> : `Detalle de "${report[OffererReportSummaryFields.ReportTitle]}"`}
                                action={<ButtonExportDropdown onExportExcel={downloadReport} size={'small'} />}
                    />
                    <CardContent style={{alignItems: 'center', padding: '20px 0px'}}>
                        <Grid container item xs={12}>
                            {loading ?
                                <Box
                                    style={{
                                        padding: '20px',
                                        borderRadius: '24px',
                                        border: '1px solid #818992',
                                        width: '550px',
                                        margin: '0 auto',
                                        backgroundColor: '#f0f4f8',
                                        boxShadow: '0 4px 10px rgba(0, 0, 0, 0.1)',
                                        textAlign: 'center'
                                    }}
                                >
                                    <Stack justifyContent={'center'} alignItems={'center'} spacing={5}>
                                        <Typography
                                            style={{
                                                fontSize: '24px',
                                                fontWeight: '500',
                                                color: '#29b6f6',
                                                animation: 'bounce 1.5s infinite'
                                            }}
                                        >
                                            Aguarde mientras generamos su reporte...
                                        </Typography>
                                    </Stack>
    
                                    <style jsx global>{`
                                    @keyframes spin {
                                        0% {
                                            transform: rotate(0deg);
                                        }
                                        100% {
                                            transform: rotate(360deg);
                                        }
                                    }
        
                                    @keyframes bounce {
                                        0%, 100% {
                                            transform: translateY(0);
                                        }
                                        50% {
                                            transform: translateY(-10px);
                                        }
                                    }
                                `}</style>
                                </Box>
    
                                :
                                error ?
                                    <Box style={{
                                        padding: '20px',
                                        borderRadius: '24px',
                                        border: '1px solid #818992',
                                        width: '550px',
                                        margin: '0 auto'
                                    }}>
                                        <Stack justifyContent={'center'} alignItems={'center'} spacing={5}>
                                            <Stack spacing={1} justifyContent={'center'} alignItems={'center'}>
                                                <Typography style={{
                                                    fontSize: '24px',
                                                    fontWeight: '500',
                                                    color: '#f44336',
                                                    textAlign: 'center'
                                                }}>
                                                    Ocurrió un error al generar su reporte
                                                </Typography>
                                                {/*<Button onClick={generateReport} startIcon={<SyncIcon/>} variant={'contained'} color={'primary'}>
                                                Volver a generar
                                            </Button>*/}
                                            </Stack>
                                        </Stack>
                                    </Box>
                                    :
                                    <div style={{width: '100%', display: 'flex', justifyContent: 'center', marginTop: 6}}>
                                        <iframe
                                            title="Report"
                                            width="100%"
                                            height="1250"
                                            src={src}
                                            frameBorder="0"
                                            style={{border: 0}}
                                            allowFullScreen
                                            sandbox="allow-storage-access-by-user-activation allow-scripts allow-same-origin allow-popups allow-popups-to-escape-sandbox allow-downloads"
                                        />
                                    </div>
                            }
                        </Grid>
                    </CardContent>
                </Card>
            </Grid>
        </Grid>
    )
}

export default ReportFromLookerStudio;