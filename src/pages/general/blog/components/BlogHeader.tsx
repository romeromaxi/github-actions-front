import {Box, Stack, Theme, useMediaQuery} from "@mui/material";
import {TypographyBase} from "components/misc/TypographyBase";
import {themeColorDefinition} from "util/themes/definitions";
// @ts-ignore
import rocket from "assets/img/luc/blog-rocket.png";
// @ts-ignore
import rocketMobile from "assets/img/luc/blog-rocket-mobile.png";

const BlogHeader = () => {
    const isMobile = useMediaQuery((theme: Theme) => theme.breakpoints.down('md'));
    
    return (
        <Box sx={{ 
            width: 1,
            padding: 4,
            backgroundColor: themeColorDefinition.systemFeedback.accent.primary,
            minHeight: '500px',
            backgroundImage: 'url(/images/allies-texture.png)',
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            borderRadius: '0 0 32px 32px',
            position: 'relative',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center'
        }}
        >
            <Stack
                direction={{ xs: 'column-reverse', md: 'row' }}
                spacing={6}
                maxWidth={'1046px'}
                sx={{
                    width: '100%',
                    height: '100%',
                    justifyContent: 'center',
                    alignItems: isMobile ? 'start' : 'center',
                }}
            >
                <Stack>
                    <Stack spacing={1.5}>
                        <TypographyBase variant={"eyebrow1"} color={'text.altMain'}>
                            LUC BLOG
                        </TypographyBase>
                        <TypographyBase variant={isMobile ? 'h2' : 'h1'} color={'text.altMain'}>
                            Información que impulsa decisiones inteligentes
                        </TypographyBase>
                        <TypographyBase variant={'body1'} color={'text.altMain'}>
                            Exploramos tendencias, productos de financiamiento y buenas prácticas para que tu PyME crezca con respaldo y claridad.
                        </TypographyBase>
                    </Stack>
                </Stack>
                <Box component="img"
                     src={isMobile ? rocketMobile : rocket} 
                     sx={{
                        xs: {
                            width: '180px',
                            height: '180px',
                            minWidth: '180px',
                            minHeight: '180px',
                        },
                        md: { width: '450px', height: '450px' }
                     }}
                />
            </Stack>
        </Box>
    )
}


export default BlogHeader