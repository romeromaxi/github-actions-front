import React, { useState } from "react";
import {Button, Stack} from "@mui/material";
import {BaseIconWrapper, WrapperIcons} from "components/icons/Icons";
import {AppConfigFields, AppConfigPaletteColorFields, AppConfigPaletteFields} from "types/appConfigEntities";
import {TypographyBase} from "components/misc/TypographyBase";
import {Play} from "phosphor-react";
import DialogVideoSource from "../../../components/dialog/DialogVideoSource";

interface HomeSummaryLucSectionProps {
    title: string,
    Icon: React.ElementType | string,
    content: React.ReactNode,
    sourceVideo: string
}

const HomeSummaryLucSection = (props: HomeSummaryLucSectionProps) => {
    const [showVideo, setShowVideo] = useState<boolean>(false);
    
    const openVideo = () => setShowVideo(true);
    
    const hideVideo = () => setShowVideo(false);
    
    return (
        <Stack spacing={{ xs: 1, md: 4 }} sx={{ height: '100%', justifyContent: 'space-between' }}>
            <Stack spacing={2} alignItems='center'>
                <BaseIconWrapper
                    Icon={props.Icon}
                    bg={`${window.APP_CONFIG[AppConfigFields.Palette][AppConfigPaletteFields.Primary][AppConfigPaletteColorFields.Main]}`}
                    color='white'
                    size={'xl'}
                    boxStyles={{ padding: '35px' }}
                />
                <TypographyBase variant='h4' textAlign='center' fontWeight={600} sx={{ display: 'flex', alignItems: 'center' }}>
                    {props.title}
                </TypographyBase>
            </Stack>
            <Stack spacing={2} alignItems='center'>
                <TypographyBase variant='h5' minLines={4} flexWrap={'wrap'} textAlign='center' alignContent='start' sx={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                }}>
                    {props.content}
                </TypographyBase>

                <Button variant='outlined' size='small'
                        onClick={openVideo}
                        endIcon={<WrapperIcons Icon={Play} size={'sm'} />}
                        id={`view-video-${props.sourceVideo}`}
                >
                    Ver video
                </Button>
            </Stack>
            
            <DialogVideoSource open={showVideo}
                               onClose={hideVideo}
                               source={props.sourceVideo}
            />
        </Stack>
    )
}

export default HomeSummaryLucSection;