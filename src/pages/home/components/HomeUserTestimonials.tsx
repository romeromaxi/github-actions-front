import {Card, CardContent, Stack, Typography, Box, Button, styled} from "@mui/material";
// @ts-ignore
import quotes from "assets/img/luc/testimonial-quotes.png"
import {WrapperIcons} from "../../../components/icons/Icons";
import {User} from "@phosphor-icons/react";
import {Autoplay, Navigation, Pagination} from "swiper";
import {AppConfigFields} from "../../../types/appConfigEntities";
import {Swiper, SwiperSlide} from "swiper/react";
import { useInView } from "react-intersection-observer";
import {AppRoutesDefinitions, useAppNavigation} from "../../../hooks/navigation";

const AnimatedTestimonialCard = styled(Card)<{ $inView: boolean; $delay: number }>(
    ({ $inView, $delay }) => ({
        width: "100%",
        opacity: $inView ? 1 : 0,
        transform: $inView ? "translateY(0)" : "translateY(30px)",
        transition: `opacity 0.6s ease-out ${$delay}ms, transform 0.6s ease-out ${$delay}ms`,
    })
);

interface HomeUserTestimonialsProps {
    mobileView: boolean;
}

const HomeUserTestimonials = ({ mobileView }: HomeUserTestimonialsProps) => {
    const { navigate } = useAppNavigation();
    
    const testimonialsData = [
        {
            description:
                "LUC me permitió acceder a propuestas que no conocía. Terminé financiándome más rápido de lo que pensaba",
            user: "Juan",
            role: "Titular de una Bodega",
            companyLogoUrl: "",
            delay: 200,
        },
        {
            description:
                "Una de las cosas que más me gustó es la facilidad para guardar y acceder a los documentos que necesitamos para mandarlos a cualquier lugar",
            user: "Verónica",
            role: "Gte de un comercio de cercanía",
            companyLogoUrl: "",
            delay: 450,
        },
        {
            description:
                "Poder ver y organizar las carpetas de todos mis clientes, empresa por empresa, es lo más. Y la IA para pasar a números los balances me cambió la vida",
            user: "Soledad",
            role: "Contadora",
            companyLogoUrl: "",
            delay: 700,
        },
    ];

    const goToAboutLuc = () => navigate(AppRoutesDefinitions.LucAboutPage);
    
    return (
        <Stack spacing={2}>
            <Typography
                color={"primary"}
                textAlign={"center"}
                fontWeight={500}
                fontFamily={"Geist"}
            >
                TESTIMONIOS DE USUARIOS
            </Typography>
            <Typography variant={"h2"} fontWeight={600} textAlign="center">
                Qué dicen quienes ya confían en LUC
            </Typography>
            {mobileView ? (
                <Swiper
                    modules={[Navigation, Pagination, Autoplay]}
                    spaceBetween={30}
                    slidesPerView={1.1}
                    autoplay={{
                        delay: window.APP_CONFIG[AppConfigFields.BannerDelay],
                        disableOnInteraction: false,
                    }}
                    style={{ padding: 2 }}
                    loop
                >
                    {testimonialsData.map((testimonial, index) => (
                        <SwiperSlide key={index}>
                            <UserTestimonialCard
                                description={testimonial.description}
                                user={testimonial.user}
                                role={testimonial.role}
                                companyLogoUrl={testimonial.companyLogoUrl}
                                mobileView
                                delay={testimonial.delay}
                                animatedInView={index === 0}
                            />
                        </SwiperSlide>
                    ))}
                </Swiper>
            ) : (
                <Stack spacing={2} direction={"row"} paddingTop={6}>
                    {testimonialsData.map((testimonial, index) => (
                        <UserTestimonialCard
                            key={index}
                            description={testimonial.description}
                            user={testimonial.user}
                            role={testimonial.role}
                            companyLogoUrl={testimonial.companyLogoUrl}
                            delay={testimonial.delay}
                            animatedInView
                        />
                    ))}
                </Stack>
            )}
            <Box
                justifyContent={"center"}
                alignItems={"center"}
                width={"100%"}
                display={"flex"}
                paddingTop={3}
            >
                <Button variant="contained" size="small" fullWidth={mobileView}
                        onClick={goToAboutLuc}
                >
                    Conocer más sobre LUC
                </Button>
            </Box>
        </Stack>
    );
};

interface UserTestimonialCardProps {
    description: string;
    user: string;
    role: string;
    companyLogoUrl: string;
    mobileView?: boolean;
    delay?: number;
    animatedInView?: boolean
}

const UserTestimonialCard = ({
                                 description,
                                 user,
                                 role,
                                 companyLogoUrl,
                                 mobileView,
                                 delay = 0,
                                 animatedInView = false
                             }: UserTestimonialCardProps) => {
    const { ref, inView } = useInView({
        triggerOnce: true,
        threshold: 0.2,
    });

    return (
        <AnimatedTestimonialCard
            ref={ref}
            $inView={!animatedInView || inView}
            $delay={delay}
            sx={{ height: mobileView ? "350px" : "-webkit-fill-available" }}
        >
            <CardContent sx={{ height: "100%" }}>
                <Stack
                    justifyContent="space-between"
                    sx={{
                        minHeight: mobileView ? undefined : "240px",
                        height: "100%",
                    }}
                >
                    <Stack spacing={3}>
                        <Box component="img" src={quotes} sx={{ width: "56px" }} />
                        <Typography fontStyle="italic">{description}</Typography>
                    </Stack>
                    <Stack spacing={2} direction="row" alignItems="center">
                        <WrapperIcons Icon={User} size="xl" />
                        <Stack>
                            <Typography fontWeight={600}>{user}</Typography>
                            <Typography>{role}</Typography>
                        </Stack>
                    </Stack>
                </Stack>
            </CardContent>
        </AnimatedTestimonialCard>
    );
};

export default HomeUserTestimonials;