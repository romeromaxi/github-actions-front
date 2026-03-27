import {useUser} from "../../hooks/contexts/UserContext";
import {useEffect} from "react";
import {useModuleNavigate} from "../../hooks/useModuleNavigate";
import {userStorage} from "../../util/localStorage";
import {Box, Stack, useMediaQuery} from "@mui/material";
import HomeWelcomeNew from "./components/HomeWelcomeNew";
import {useTheme} from "@mui/material/styles";
import HomeLucChoose from "./components/HomeLucChoose";
import HomeUserTestimonials from "./components/HomeUserTestimonials";
import HomeCreateUserInvitationFlyer from "./components/HomeCreateUserInvitationFlyer";
import HomeLucAllies from "./components/HomeLucAllies";
import HomeLucExplore from "./components/HomeLucExplore";
import {AppConfigAlliedOfferersFields, AppConfigFields} from "../../types/appConfigEntities";


const HomeNew = () => {
    const { user } = useUser();
    const moduleNavigate = useModuleNavigate();
    const theme = useTheme();
    const isExtraSmallScreen = useMediaQuery(theme.breakpoints.down(420));
    const isSmallScreen = useMediaQuery(theme.breakpoints.down('sm'));
    const isMediumScreen = useMediaQuery(theme.breakpoints.down('md'));
    const isMediumLargeScreen = useMediaQuery(theme.breakpoints.down(1440));

    const showAlliedOfferers: boolean = !!window.APP_CONFIG[AppConfigFields.AlliedOfferers]?.[AppConfigAlliedOfferersFields.Show];
    
    useEffect(() => {
        if (user) {
            if (userStorage.isLackConfirmation()) {
                if (!window.location.pathname.startsWith('/signup')) {
                    userStorage.removeFromStorage();
                }
            } else {
                moduleNavigate(user.userType);
            }
        }
    }, [user]);

    return (
        <Stack spacing={8}>
            <HomeWelcomeNew mobileView={isSmallScreen || isExtraSmallScreen}/>
            
            <HomeLucChoose mobileView={isSmallScreen || isExtraSmallScreen}/>

            {
                showAlliedOfferers &&
                    <HomeLucAllies mobileView={isMediumScreen || isSmallScreen || isExtraSmallScreen }/>
            }

            <HomeLucExplore mobileView={isSmallScreen || isExtraSmallScreen || isMediumScreen} />

            <HomeUserTestimonials mobileView={isSmallScreen || isExtraSmallScreen}/>
            
            <HomeCreateUserInvitationFlyer mobileView={isMediumScreen || isSmallScreen || isExtraSmallScreen}/>

            <Box width={'10px'} />
        </Stack>
    )
}


export default HomeNew;