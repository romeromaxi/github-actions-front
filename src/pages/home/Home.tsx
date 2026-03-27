import React, {useEffect, useState} from 'react';
import {Box, Stack} from "@mui/material";
import {BannerWithTextAndComponent} from "../../components/cards/NavigableBannerWithText";
import HomeLucVideo from "./components/HomeLucVideo";
import HomeWelcome from "./components/HomeWelcome";
import HomeSummaryLuc from "./components/HomeSummaryLuc";
import HomeSummarySearchings from "./components/HomeSummarySearchings";
import HomeSummaryReviews from "./components/HomeSummaryReviews";
import {
    AppConfigFields,
    AppConfigResourcesHomeFields,
    AppConfigResourcesHomeVideoFields
} from "../../types/appConfigEntities";
import { userStorage } from 'util/localStorage/userStorage';
import {useModuleNavigate} from "../../hooks/useModuleNavigate";
import {useUser} from "../../hooks/contexts/UserContext";

function Home() {
  const { user } = useUser();
  const [openLucVideo, setOpenLucVideo] = useState<boolean>(false)
  const moduleNavigate = useModuleNavigate();

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
  
  const onPlayLucVideo = () => setOpenLucVideo(true)
  
  const onCloseLucVideo = () => setOpenLucVideo(false)
    
  return (
      <Stack spacing={8}>
        <HomeWelcome />
          {
              (!window.IS_PRODUCTION_ENV) &&
                <BannerWithTextAndComponent section={'¿QUÉ TIENE LUC PARA TU MIPYME?'}
                                            mainTitle={'LUC tiene mucho para ofrecerte, mirá el video de presentación y empezá a explorar el mundo LUC'}
                                            onClick={onPlayLucVideo}
                >
                    <Box sx={{
                        width: '100%',
                        height: '90px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                    }}
                    >
                        <Box sx={{
                            width: '170px',
                            height: '100%'
                        }}
                             component="img"
                             alt=""
                             src={window.APP_CONFIG[AppConfigFields.ResourcesHome][AppConfigResourcesHomeFields.Video][AppConfigResourcesHomeVideoFields.PosterUrl]}
                        />
                    </Box>
                </BannerWithTextAndComponent>
          }
          <HomeSummaryLuc />
          <HomeSummarySearchings />
          <HomeSummaryReviews />
          
          <Box width={'10px'} />
          
          <HomeLucVideo open={openLucVideo}
                        onClose={onCloseLucVideo}
          />
      </Stack>
      )
}

export default Home;
