import {useUser} from "../../../../hooks/contexts/UserContext";
import React, {Fragment, useEffect, useMemo, useState} from "react";
import {useNavigate} from "react-router-dom";
import {Button, Grid, useMediaQuery, useTheme} from "@mui/material";
import {INavTab, NavsTabHorizontal} from "../../../../components/navs/NavsTab";
import {HttpCacheMarketDynamic} from "../../../../http/cache/httpCacheMarketDynamic";
import {MarketIntermadiateDynamicSearchFields} from "../../../../types/market/marketIntermediateData";
import MarketGuidTabContent from "./landingFilter/MarketGuidTabContent";
import BlurredLoginGate from "../../../user/components/BlurredLoginGate";
import MarketFakeGondola from "./landingFilter/MarketFakeGondola";
import {SearchIcon} from "lucide-react";
import MarketLandingMainTabContent from "./landingTabs/MarketLandingMainTabContent";
import FailRedirectMarketDialog from "./FailRedirectMarketDialog";

function MarketLandingMainTabs() {
    const { isLoggedIn } = useUser();

    const [dynamicTabsLst, setDynamicTabsLst] = useState<INavTab[]>([]);
    const navigate = useNavigate();
    const theme = useTheme();
    const isMobileScreenSize = useMediaQuery(theme.breakpoints.down("sm"));
    const [failRedirect, setFailRedirect] = useState<boolean>(false);

    const defaultTabs: INavTab[] = useMemo(() => (
        [
            {
                label: isLoggedIn ? 'Recomendado para vos' : 'Destacados',
                content: <MarketLandingMainTabContent />,
                default: true
            }
        ]
    ), [isLoggedIn]);
    
    const handleNavigateAdvancedSearch = () => {
        if (isLoggedIn) navigate('/market/lines');
        else setFailRedirect(true);
    }

    useEffect(() => {
        HttpCacheMarketDynamic.getGeneralMarketsTabs()
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
                }));

                setDynamicTabsLst(dynamicTabs);
            })
            .catch((err) => {
                console.error('Error loading market tabs:', err);
            });
    }, [isLoggedIn]);
    
    return (
        <Fragment>

            {
                isMobileScreenSize && (
                <Button variant="text"
                        onClick={handleNavigateAdvancedSearch}
                        endIcon={<SearchIcon />}
                        fullWidth
                >
                    Búsqueda avanzada
                </Button>
            )}
            
            <NavsTabHorizontal
                data-cy={'market-landing-search-filter'}
                lstTabs={[{ tabList: [ ...defaultTabs, ...dynamicTabsLst ] }]}
                fullWidth
                alignLeft
                action={!isMobileScreenSize ? <Button variant="text"
                                                      onClick={handleNavigateAdvancedSearch}
                                                      endIcon={<SearchIcon />}
                                                      sx={{mb: 1}}
                >
                    Búsqueda avanzada
                </Button> : undefined}
            />
            <FailRedirectMarketDialog open={failRedirect}
                                      onClose={() => setFailRedirect(false)}
            />
        </Fragment>
    )
}

export default MarketLandingMainTabs;