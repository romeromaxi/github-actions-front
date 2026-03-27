import React, {useContext, useEffect, useState} from "react";
import {Card, CardContent, Grid} from "@mui/material";
import FileDocumentList from "components/files/FileDocumentList";
import {HttpFilesClientPortfolio} from "http/files/httpFilesClientPortfolio";
import OffererClientPortfolioFilesHeader from "./OffererClientPortfolioFilesHeader";
import {Document} from "types/files/filesData";
import {NavsTabHorizontal} from "../../../../components/navs/NavsTab";
import OffererLufeTabWrapper from "pages/offerer/solicitation/components/lufe/components/OffererLufeTabWrapper";
import OffererLufeFiles from "pages/offerer/solicitation/components/lufe/OffererLufeFiles";
import { Files } from "@phosphor-icons/react";
import {LufeInformationContext} from "../../../../hooks/contexts/LufeInformationContext";
import {Alert} from "@mui/lab";

interface OffererClientPortfolioFilesProps {
    clientPortfolioGuid?: string 
}

function OffererClientPortfolioFiles(props: OffererClientPortfolioFilesProps) {
    const { lufeData } = useContext(LufeInformationContext);
    const [files, setFiles] = useState<Document[]>();

    const loadClientPortfolioFiles = () => {
        if (props.clientPortfolioGuid) {
            setFiles(undefined);
            
            HttpFilesClientPortfolio.getFiles(props.clientPortfolioGuid)
                .then(setFiles);
        }
    }
    
    useEffect(() => {
        loadClientPortfolioFiles();
    }, [props.clientPortfolioGuid]);
    
    return (
        <Grid container spacing={1}>
            <Grid item xs={12}>
                <NavsTabHorizontal lstTabs={[
                    {
                        tabList: [
                            {
                                label: 'LUFE',
                                content:
                                    (!!lufeData) ? 
                                        <OffererLufeTabWrapper icon={Files} title={'Archivos'}>
                                            <OffererLufeFiles />
                                        </OffererLufeTabWrapper>                                         
                                        : 
                                        <Alert color="info" severity="info">
                                            Para acceder a las funcionalidades de LUFE, ingresá tu API Key y empezá a usar el servicio
                                        </Alert>,
                                default: !!lufeData
                            },
                            {
                                label: 'Otros Documentos',
                                content: 
                                    <Grid container spacing={1}>
                                        <Grid item xs={12}>
                                            {
                                                props.clientPortfolioGuid &&
                                                <OffererClientPortfolioFilesHeader clientPortfolioGuid={props.clientPortfolioGuid}
                                                                                   onReload={loadClientPortfolioFiles}
                                                />
                                            }
                                        </Grid>
                                        <Grid item xs={12}>
                                            <Card>
                                                <CardContent>
                                                    <FileDocumentList filesDocument={files}
                                                                      onReload={loadClientPortfolioFiles}
                                                                      download
                                                                      preview
                                                                      delete
                                                    />
                                                </CardContent>
                                            </Card>
                                        </Grid>
                                    </Grid>,
                                default: !lufeData
                            }
                        ]
                    }
                ]} />
            </Grid>
        </Grid>
    )
}

export default OffererClientPortfolioFiles;