import React, { useContext } from "react";
import { Card, Grid, Skeleton, Stack } from "@mui/material";
import NavsTabVerticalHeaderBase from "components/navs/NavsTabVerticalHeaderBase";
import {HomeCompanyPageContext} from "pages/company/HomeCompanyPage";
import { SendIcon } from "lucide-react";
import CompanySolicitationsPage from "pages/company/solicitations/CompanySolicitationsPage";
import CompanyStatusVerificationCard from "../components/home/CompanyStatusVerificationCard";

function HomeCompanyPageSolicitationsTab() {
    const { company } = useContext(HomeCompanyPageContext);
    const tabSize = 3.6;
    
    return (
        <Grid container spacing={2}>
            <Grid item xs={12} md={tabSize}>
                <Card>
                    <Stack spacing={1}>
                        <NavsTabVerticalHeaderBase title={'Solicitudes'}
                                                   Icon={SendIcon}
                                                   description={'Gestioná todas tus solicitudes.'} />
                    </Stack>
                </Card>
            </Grid>
            
            <Grid item xs={12} md={12 - tabSize}>
                <CompanyStatusVerificationCard marginBottom={2} />
                
                {
                    company ?
                        <CompanySolicitationsPage company={company}/>
                        :
                        <Skeleton />
                }
            </Grid>
        </Grid>
    )
}

export default HomeCompanyPageSolicitationsTab;