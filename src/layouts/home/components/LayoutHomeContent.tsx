import React from "react";
import {Box, Grid} from "@mui/material";
import {navigateToConfigUrl} from "util/configurations/configType";
import {useNavigate} from "react-router-dom";
import {
    AppConfigFields,
    AppConfigImage,
    AppConfigResourcesHomeVideoFields,
    AppConfigImageFields,
    AppConfigResourcesHomeFields
} from "types/appConfigEntities";
// @ts-ignore
import newHome1 from 'assets/img/luc/newHome1.png'
// @ts-ignore
import newHome2 from 'assets/img/luc/newHome2.png'
// @ts-ignore
import newHome3 from 'assets/img/luc/newHome3.png'
// @ts-ignore
import newHome4 from 'assets/img/luc/newHome4.png'



interface LayoutHomeContentProps {
    withoutSlide?: boolean    
}

function LayoutHomeContent({withoutSlide} : LayoutHomeContentProps) {
    const videoDataConfig = window.APP_CONFIG[AppConfigFields.ResourcesHome][AppConfigResourcesHomeFields.Video];
    const homeImages =window.APP_CONFIG[AppConfigFields.ResourcesHome][AppConfigResourcesHomeFields.Images] as AppConfigImage[];
        
    return (
        <React.Fragment>
            <Box component={'img'}
                 src={newHome1}
            />
            <Box component={'img'}
                 src={newHome2}
            />
            <Box component={'img'}
                 src={newHome3}
            />
            <Box component={'img'}
                 src={newHome4}
            />
            {
                /*
                    <Box mt={8} mb={8} height={"500px"}>
                        <Grid container spacing={0}>
                            <Grid xs={4} textAlign={'end'}>
                                <Box component={'img'} height={"500px"} src={videoDataConfig[AppConfigResourcesHomeVideoFields.DescriptionUrl]}/>
                            </Grid>
                            <Grid xs={8}>
                                <video width={"100%"} height={"500px"}
                                       controls
                                       controlsList="nodownload noremoteplayback"
                                       poster={videoDataConfig[AppConfigResourcesHomeVideoFields.PosterUrl]}
                                >
                                    <source src={videoDataConfig[AppConfigResourcesHomeVideoFields.PresentationUrl]} type="video/mp4" />
                                    
                                    Your browser does not support the video tag.
                                </video>
                            </Grid>
                        </Grid>
                    </Box>
                 */
            }
            {/*
                homeImages.map((image, idx) => (
                    <LayoutHomeContentBoxImage image={image}
                                               mt={idx === 0 ? 0 : 2}
                    />
                ))*/
            }
        </React.Fragment>
    )
}

interface LayoutHomeContentBoxImageProps {
    image: AppConfigImage,
    mt?: number
}

function LayoutHomeContentBoxImage({ image, mt }: LayoutHomeContentBoxImageProps) {
    const navigate = useNavigate();
    const isClickeable = !!image[AppConfigImageFields.Navigate];
    
    const onClickImage = () =>
        navigateToConfigUrl(image[AppConfigImageFields.Navigate], navigate);
    
    return (
        <Box component={'img'}
             mt={mt}
             src={image[AppConfigImageFields.URL]}
             onClick={isClickeable ? onClickImage : undefined}
             sx={isClickeable ? {
                 '&:hover': {
                     cursor: 'pointer',
                     transform: 'scale(0.99)',
                 }
             } : {}}
        />
    )
}


export default LayoutHomeContent;