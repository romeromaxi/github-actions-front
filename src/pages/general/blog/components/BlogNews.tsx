import {Box, Stack, Theme, useMediaQuery, useTheme} from "@mui/material";
import { TypographyBase } from "components/misc/TypographyBase";
import {WrapperIcons} from "components/icons/Icons";
import { Clock } from "phosphor-react";

interface NewsItem {
    imageSrc: string;
    date: string;
    readTime: string;
    title: string;
    description: string;
    handleClickNews: () => void
}

interface BlogNewsProps {
    variant: 'image-left' | 'image-right' | 'image-top';
    news: NewsItem;
}

const BlogNews = ({
    variant,
    news
}: BlogNewsProps) => {
    const theme = useTheme();
    const isMobile = useMediaQuery((theme: Theme) => theme.breakpoints.down(850));
    
    const containerStyles = {
        '&:hover': {
            '& *': {
                cursor: 'pointer !important',
            },
            '& h2': {
                color: `${theme.palette.primary.main} !important`
            }
        }
    }
        
    const SingleNews = ({ item, isMobile }: { item: NewsItem; isMobile: boolean }) => {
        return (
            <Stack
                spacing={3}
                sx={{
                    width: '100%',
                    alignItems: isMobile ? 'center' : 'flex-start',
                    ...containerStyles
                }}
                onClick={item.handleClickNews}
            >
                <BlogNewImage news={item} variant={variant} isMobile={isMobile} />
                
                <BlogNewContent news={item} variant={variant} isMobile={isMobile} />
            </Stack>
        );
    };
    
    if (isMobile || variant === 'image-top') {
        return (
            <SingleNews item={news} isMobile={isMobile} />
        );
    }
    
    return (
        <Stack direction={variant === 'image-left' ? "row-reverse" : "row"}
               spacing={4.5} 
               sx={{
                   width: '100%', 
                   alignItems: 'center', 
                   minHeight: '400px',
                   ...containerStyles
               }}
               onClick={news.handleClickNews}
        >
            <BlogNewContent news={news} variant={variant} isMobile={isMobile} />
            
            <BlogNewImage news={news} variant={variant} isMobile={isMobile} />
        </Stack>
    );
}


interface BlogNewsChildrenProps extends BlogNewsProps {
    isMobile: boolean
}

function BlogNewImage({ variant, news, isMobile }: BlogNewsChildrenProps) {
    const heightImage = (isMobile || variant === 'image-top') ? '240px' : '425px';
    
    return (
        <Box
            sx={{
                width: '100%',
                height: heightImage,
                minHeight: heightImage,
                maxHeight: heightImage,
                overflow: 'hidden',
                flex: 1,
                display: 'flex',
                alignItems: 'stretch',
            }}
        >
            <Box
                component="img"
                src={news.imageSrc}
                alt={news.title}
                sx={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover',
                    objectPosition: 'object-position',
                }}
            />
        </Box>
    )
}

function BlogNewContent({ news, isMobile }: BlogNewsChildrenProps) {
    return (
        <Stack spacing={4} sx={{ width: '100%', textAlign: 'left', flex: 1, justifyContent: 'center' }}>
            <Stack direction="row" alignItems="center" justifyContent="space-between">
                <TypographyBase
                    variant="body1"
                    color="text.tertiary"
                >
                    {news.date}
                </TypographyBase>
                {/*<Stack direction="row" alignItems="center" spacing={0.5}>
                    <WrapperIcons Icon={Clock} size={"sm"} color={"primary"}/>
                    <TypographyBase variant={'body2'} fontWeight={500} color="primary">
                        {news.readTime}
                    </TypographyBase>
                </Stack>*/}
            </Stack>
            <Stack spacing={2}>
                <TypographyBase variant={isMobile ? 'h3' : 'h2'} color={'text.main'}>
                    {news.title}
                </TypographyBase>

                <TypographyBase variant="body1" color="text.lighter">
                    {news.description}
                </TypographyBase>
            </Stack>
        </Stack>
    )
}

export default BlogNews;