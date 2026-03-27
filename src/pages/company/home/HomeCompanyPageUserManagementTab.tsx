import React, { useContext } from "react";
import { Card, Grid, Skeleton, Stack } from "@mui/material";
import NavsTabVerticalHeaderBase from "components/navs/NavsTabVerticalHeaderBase";
import {HomeCompanyPageContext} from "pages/company//HomeCompanyPage";
import CompanyRolesList from "pages/company/roles/CompanyRolesList";
import { UsersIcon } from "lucide-react";
import CompanyStatusVerificationCard from "../components/home/CompanyStatusVerificationCard";

function HomeCompanyPageUserManagementTab() {
    const { company } = useContext(HomeCompanyPageContext);
    const tabSize = 3.6;
    
    return (
        <Grid container spacing={2}>
            <Grid item xs={12} md={tabSize}>
                <Card>
                    <Stack spacing={1}>
                        <NavsTabVerticalHeaderBase title={'Gestión de usuarios'}
                                                   Icon={UsersIcon}
                                                   description={'Designá y gestioná usuarios con diferentes permisos.'} />
                    </Stack>
                </Card>
            </Grid>
            
            <Grid item xs={12} md={12 - tabSize}>
                <CompanyStatusVerificationCard marginBottom={2} />
                
                {
                    company ?
                        <CompanyRolesList company={company}/>
                        :
                        <Skeleton />
                }
            </Grid>
        </Grid>
    )
}

export default HomeCompanyPageUserManagementTab;