import {Box, Card, SxProps, Typography} from "@mui/material";
import {useEffect, useRef} from "react";

interface HomeLucExploreCardProps {
    color?: 'primary' | 'secondary';
    onClick?: () => void;
    iconSrc?: string;
    iconSx?: SxProps;
    title?: string;
    mobileView?: boolean;
}

const balanceText = (element: HTMLElement, isMobile: boolean = false) => {
    const text = element.textContent || '';
    const words = text.split(' ');

    if (!isMobile && words.length >= 2) {
        let bestSplit = Math.ceil(words.length / 2);
        let bestBalance = Infinity;

        for (let i = 1; i < words.length; i++) {
            const firstLine = words.slice(0, i).join(' ');
            const secondLine = words.slice(i).join(' ');
            const lengthDiff = Math.abs(firstLine.length - secondLine.length);

            if (lengthDiff < bestBalance) {
                bestBalance = lengthDiff;
                bestSplit = i;
            }
        }

        const firstLine = words.slice(0, bestSplit).join(' ');
        const secondLine = words.slice(bestSplit).join(' ');
        element.innerHTML = `${firstLine}<br />${secondLine}`;
        return;
    }

    if (words.length >= 3) {
        const midpoint = Math.ceil(words.length / 2);
        const firstLine = words.slice(0, midpoint).join(' ');
        const secondLine = words.slice(midpoint).join(' ');

        const lengthDiff = Math.abs(firstLine.length - secondLine.length);
        const maxLength = Math.max(firstLine.length, secondLine.length);

        if (lengthDiff / maxLength < 0.4) {
            element.innerHTML = `${firstLine}<br />${secondLine}`;
        }
    } else if (words.length === 2 && !isMobile) {
        element.innerHTML = `${words[0]}<br />${words[1]}`;
    }
};

const HomeLucExploreCard = ({ color = 'primary', onClick, iconSrc, iconSx, title, mobileView } : HomeLucExploreCardProps) => {

    const titleRef = useRef<HTMLSpanElement>(null);

    useEffect(() => {
        if (titleRef.current && title) {
            titleRef.current.innerHTML = title;

            const timeoutId = setTimeout(() => {
                if (titleRef.current) {
                    balanceText(titleRef.current, mobileView);
                }
            }, 50);

            return () => clearTimeout(timeoutId);
        }
    }, [title, mobileView]);
    
    return (
        <Card sx={{
            width: mobileView ? '200px' : '100%',
            backgroundColor: color === 'primary' ? '#D9EEDE' : '#D7E5F4',
            cursor: onClick ? 'pointer' : 'default',
            padding: 0,
            height: mobileView ? '200px' : '155px',
            position: 'relative',
            display: 'flex',
            '&:hover': {
                boxShadow: onClick ? '0px 4px 20px rgba(0, 0, 0, 0.1)' : 'none',
            }
        }}
              onClick={onClick}
        >
            <Box sx={{
                position: 'absolute',
                bottom: 16,
                left: 16,
                maxWidth: mobileView ? '89%' : '55%'
            }}>
                <Typography
                    variant="h4"
                    fontSize={'1.125rem'}
                    fontWeight={600}
                    color={color === 'primary' ? '#008547' : '#164293'}
                    lineHeight={1.2}
                    ref={titleRef}
                    component="span"
                >
                    {title}
                </Typography>
            </Box>
            <Box
                component="img"
                src={iconSrc}
                sx={mobileView ? {
                    position: 'absolute',
                    top: -12,
                    right: -15,
                    width: '60px',
                    height: 'auto',
                    ...iconSx
                } : {
                    position: 'absolute',
                    right: -5,
                    ...iconSx
                }}
            />
        </Card>
    )
}

export default HomeLucExploreCard