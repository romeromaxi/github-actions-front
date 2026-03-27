import React, {useEffect, useState} from "react";
import {Box, Container, Grid} from "@mui/material";
import ScrollTop from "./ScrollTop";
import {INavTab, NavsTabInsideAppBar} from "components/navs/NavsTab";
import {HttpCacheMarketDynamic} from "http/cache/httpCacheMarketDynamic";
import {MarketIntermadiateDynamicSearchFields} from "types/market/marketIntermediateData";
import MarketGuidTabContent from "pages/markets/home/components/landingFilter/MarketGuidTabContent";
import BlurredLoginGate from "pages/user/components/BlurredLoginGate";
import MarketFakeGondola from "pages/markets/home/components/landingFilter/MarketFakeGondola";
import {useUser} from "hooks/contexts/UserContext";

function LayoutMarketAdvancedSearch() {
    const { isLoggedIn } = useUser();
    const [tabLst, setTabLst] = useState<INavTab[]>();

    useEffect(() => {
        HttpCacheMarketDynamic.getAdvancedMarketsTabs()
            .then((items) => {
                const dynamicTabs: INavTab[] = (items || []).map((it) => ({
                    label: it[MarketIntermadiateDynamicSearchFields.Title],
                    content: isLoggedIn ?
                        <MarketGuidTabContent guid={it[MarketIntermadiateDynamicSearchFields.GuiId]} /> :
                        <BlurredLoginGate visible>
                            <Grid item xs={12}>
                                <MarketFakeGondola />
                            </Grid>
                        </BlurredLoginGate>,
                    id: it[MarketIntermadiateDynamicSearchFields.GuiId],
                    queryParam: it[MarketIntermadiateDynamicSearchFields.GuiId]
                }));

                setTabLst([...dynamicTabs]);
            })
            .catch((err) => {
                console.error('Error loading market tabs:', err);
            });
    }, [isLoggedIn]);
    
    return (
        <Box sx={{ position: 'relative' }}>
            <Container>
                <NavsTabInsideAppBar title={'Búsqueda Avanzada'} 
                                     tabList={tabLst ?? []}
                                     alwaysSomeActiveTab
                />
            </Container>

            <ScrollTop />
        </Box>
    )
}

export default LayoutMarketAdvancedSearch;
