import React from "react";
import {IconButton, Stack} from "@mui/material";
import {WrapperIcons} from "components/icons/Icons";
import {
    AppConfigFields, AppConfigFooterFields, AppConfigFooterSocialMedia, AppConfigFooterSocialMediaFields
} from "types/appConfigEntities";

// @ts-ignore
import {ReactComponent as FacebookSVG} from 'assets/svgs/facebook-vector.svg';
// @ts-ignore
import {ReactComponent as LinkedInSVG} from 'assets/svgs/linkedin-vector.svg';
// @ts-ignore
import {ReactComponent as YouTubeSVG} from 'assets/svgs/youtube-vector.svg';
// @ts-ignore
import {ReactComponent as InstagramSVG} from 'assets/svgs/instagram-vector.svg';
// @ts-ignore
import {ReactComponent as XTwitterSVG} from 'assets/svgs/x-twitter-vector.svg';

function MarketFooterSocialMedia() {
    
    const appConfigFooter: AppConfigFooterSocialMedia | undefined = 
        window.APP_CONFIG?.[AppConfigFields.Footer]?.[AppConfigFooterFields.SocialMedia];

    if (!appConfigFooter) 
        return null;
    
    return (
        <Stack direction={'row'}
               spacing={1.6}
               alignContent={'center'}
               flexWrap={'wrap'}
        >
            {/* YouTube */}
            <MarketFooterSocialMediaButton Icon={YouTubeSVG} 
                                           path={appConfigFooter[AppConfigFooterSocialMediaFields.YouTube]}
            />
            
            {/* Facebook */}
            <MarketFooterSocialMediaButton Icon={FacebookSVG}
                                           path={appConfigFooter[AppConfigFooterSocialMediaFields.Facebook]}
            />
            
            {/* X */}
            <MarketFooterSocialMediaButton Icon={XTwitterSVG}
                                           path={appConfigFooter[AppConfigFooterSocialMediaFields.X]}
            />

            {/* Instagram */}
            <MarketFooterSocialMediaButton Icon={InstagramSVG}
                                           path={appConfigFooter[AppConfigFooterSocialMediaFields.Instagram]}
            />
            
            {/* LinkedIn */}
            <MarketFooterSocialMediaButton Icon={LinkedInSVG}
                                           path={appConfigFooter[AppConfigFooterSocialMediaFields.LinkedIn]}
            />
        </Stack>
    )
}

interface MarketFooterSocialMediaProps {
    Icon: React.ElementType | string,
    path?: string
}

function MarketFooterSocialMediaButton(props: MarketFooterSocialMediaProps) {
    if (!props.path) return null;
    
    const onClick = () => 
        window.open(props.path, '_blank');
    
    return (
        <IconButton sx={{ color: '#009850', '&:hover': { opacity: 0.6 } }}
                    onClick={onClick}>
            <WrapperIcons Icon={props.Icon} size={'xs'} />
        </IconButton>
    )
}

export default MarketFooterSocialMedia;
