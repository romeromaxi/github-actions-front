import { Card, CardContent, Box, Stack, Typography, styled } from "@mui/material";
import {WrapperIcons} from "../../../components/icons/Icons";
import {useInView} from "react-intersection-observer";

const AnimatedCard = styled(Card)<{ $delay: number; $mobileView: boolean; $inView: boolean; }>(
    ({ $delay, $mobileView, $inView }) => ({
        width: '100%',
        maxWidth: $mobileView ? 'none' : '320px',
        height: '100%',
        minHeight: $mobileView ? 'auto' : '325px',
        opacity: $inView ? 1 : 0,
        transform: $inView ? "translateY(0)" : "translateY(30px)",
        transition: `opacity 0.6s ease-out ${$delay}ms, transform 0.6s ease-out ${$delay}ms`,
    })
);

const IconContainer = styled(Box)<{ mobileView: boolean }>(
    ({ mobileView }) => ({
        color: '#164293',
        backgroundColor: '#D6E0F3',
        padding: mobileView ? '12px' : '16px',
        borderRadius: mobileView ? '12px' : '16px',
        width: 'fit-content',
        height: 'fit-content',
        display: 'flex',
        justifyContent: 'center',
        flexShrink: 0,
    })
);

export interface HomeChooseCardData {
    id: number;
    icon: React.ComponentType<any>;
    title: string;
    description: string;
    delay: number;
}

interface HomeChooseAnimatedCardProps {
    data: HomeChooseCardData;
    mobileView: boolean;
}

const HomeChooseAnimatedCard = ({ data, mobileView }: HomeChooseAnimatedCardProps) => {
    const { icon, title, description, delay } = data;
    const { ref, inView } = useInView({
        triggerOnce: true,
        threshold: 0.2,
    });

    return (
        <AnimatedCard
            ref={ref}
            $delay={delay}
            $mobileView={mobileView}
            $inView={inView}
        >
            <CardContent sx={{ height: '100%' }}>
                <Stack
                    direction={mobileView ? 'row' : 'column'}
                    spacing={3}
                    sx={{ height: '100%' }}
                >
                    <IconContainer mobileView={mobileView}>
                        <WrapperIcons Icon={icon} size={mobileView ? 'md' : 'xl'} />
                    </IconContainer>

                    <Stack spacing={1.5} sx={{ flex: 1, minWidth: 0 }}>
                        <Typography
                            variant="h4"
                            fontWeight={600}
                        >
                            {title}
                        </Typography>
                        <Typography
                            sx={{
                                fontSize: { xs: '0.875rem', sm: '1rem' },
                                lineHeight: 1.5,
                                color: 'text.secondary',
                            }}
                        >
                            {description}
                        </Typography>
                    </Stack>
                </Stack>
            </CardContent>
        </AnimatedCard>
    );
};

export default HomeChooseAnimatedCard;