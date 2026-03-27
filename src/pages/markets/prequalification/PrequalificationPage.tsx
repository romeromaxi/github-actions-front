import React, {useMemo} from 'react';
import PrequalificationStepper from './PrequalificationStepper';
import {marketSolicitationStorage} from 'util/sessionStorage/marketSolicitationStorage';
import {
  CompanyFileContextProvider,
} from "hooks/contexts/CompanyFileContext";
import {CompanyFileSourceType} from "types/company/companyEnums";
import {useSolicitationCheckoutSteps} from "hooks/useSolicitationCheckoutSteps";
import {SolicitationSurveyContextProvider} from "hooks/contexts/SolicitationSurveyContext";
import {Box, Container, useMediaQuery, useTheme} from "@mui/material";
import {useApplicationCommon} from "hooks/contexts/ApplicationCommonContext";
import PrequalificationAppBarPage from "./PrequalificationAppBarPage";

function PrequalificationPage() {
    const { paddingTopContent } = useApplicationCommon();
    const { companyId } = marketSolicitationStorage.getCurrentSolicitation();
    const { steps } = useSolicitationCheckoutSteps();
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
    
    const paddingBottomContent = useMemo(() => (
        isMobile ? '200px' : paddingTopContent
    ), [isMobile, paddingTopContent])
  
    return (
        <SolicitationSurveyContextProvider>
            <CompanyFileContextProvider dataId={companyId} 
                                        dataSource={CompanyFileSourceType.Company}
            >
                <Box sx={{ position: 'relative' }}>
                    <Container>
                        <PrequalificationAppBarPage />
                    
                        <Box pt={paddingTopContent} 
                             pb={paddingBottomContent}>
                            <PrequalificationStepper steps={steps} 
                                                     activityId={0}
                            />
                        </Box>
                    </Container>
                </Box>
            </CompanyFileContextProvider>
        </SolicitationSurveyContextProvider>
    );
}


export default PrequalificationPage;
