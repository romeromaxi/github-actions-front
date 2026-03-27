import {Box, Grid, Stack, Typography, styled} from "@mui/material";
import React from "react";
import { useInView } from "react-intersection-observer";
// @ts-ignore
import financial from "assets/img/luc/home-financial-options.svg"
// @ts-ignore
import clipboard from "assets/img/luc/home-clipboard.svg"
// @ts-ignore
import bubbleChat from "assets/img/luc/home-bubble-chart.svg"
// @ts-ignore
import headInspect from "assets/img/luc/home-head-inspection.svg"
// @ts-ignore
import files from "assets/img/luc/home-files.svg"

const AnimatedStack = styled(Stack)<{ $inView: boolean; $delay: number }>(
    ({ $inView, $delay }) => ({
        opacity: $inView ? 1 : 0,
        transform: $inView ? "translateY(0)" : "translateY(30px)",
        transition: `opacity 0.6s ease-out ${$delay}ms, transform 0.6s ease-out ${$delay}ms`,
    })
);

const AnimatedGrid = styled(Grid)<{ $inView: boolean; $delay: number }>(
    ({ $inView, $delay }) => ({
        opacity: $inView ? 1 : 0,
        transform: $inView ? "translateY(0)" : "translateY(30px)",
        transition: `opacity 0.6s ease-out ${$delay}ms, transform 0.6s ease-out ${$delay}ms`,
    })
);

interface HomeAboutLucMainSectionProps {
    mobileView?: boolean;
}

const HomeAboutLucMainSection = ({ mobileView }: HomeAboutLucMainSectionProps) => {
    const data: AboutLucSectionComponentProps[] = [
        {
            mobileView: mobileView,
            image: financial,
            title: "Decenas de opciones de financiamiento para tu PyME",
            description: "Avales, descuento de cheques, facturas y pagarés, préstamos para Capital de Trabajo e Inversión, Leasing. Usá filtros y encontrá fácilmente el producto que mejor se ajusta a tus necesidades.",
            section: "TIENDA LUC",
            sectionColor: "primary",
            imgPosition: "right",
            delay: 300,
        },
        {
            mobileView: mobileView,
            image: clipboard,
            title: "Aplicá de forma simple, sin tramites complejos",
            description: "Con LUC cargás tu información una sola vez, aplicás en minutos y gestionás todas tus solicitudes desde la plataforma. Recibí propuestas, hacé seguimiento online y mantené tu documentación siempre lista.",
            section: "SOLICITUDES RÁPIDAS",
            sectionColor: "#3A6188",
            imgPosition: "left",
            delay: 300,
        },
        {
            mobileView: mobileView,
            image: bubbleChat,
            title: "Un especialista te ayuda si preferís",
            description: "A través de la búsqueda asistida un experto de LUC analiza tu caso y te recomienda los productos y entidades más convenientes o te acompaña a conseguir lo que necesitás sin cargo adicional.",
            section: "BÚSQUEDA ASISTIDA",
            sectionColor: "#C47F30",
            imgPosition: "right",
            delay: 300,
        },
        {
            mobileView: mobileView,
            image: headInspect,
            title: "Entendé cómo las entidades ven a tu empresa",
            description: "Accedé a una herramienta exclusiva que te muestra cómo evalúan tu empresa las entidades financieras. Más claridad antes de aplicar, mejores decisiones para tu negocio.",
            section: "VER COMO ME VEN",
            sectionColor: "primary",
            imgPosition: "left",
            delay: 300,
        },
        {
            mobileView: mobileView,
            image: files,
            title: "Todos tus documentos en un solo lugar",
            description: "Organizá contratos, balances y papeles clave en un entorno digital seguro de acceso exclusivo de tu Pyme. Usalos para todas tus solicitudes y mantenelos siempre actualizados sin esfuerzo.",
            section: "TUS DOCUMENTOS A MANO",
            sectionColor: "#A35367",
            imgPosition: "right",
            delay: 300,
        },
    ]

    return (
        <Stack spacing={5.75}>
            {data.map((item, index) =>
                <AboutLucSectionComponent
                    key={index}
                    image={item.image}
                    title={item.title}
                    description={item.description}
                    section={item.section}
                    sectionColor={item.sectionColor}
                    imgPosition={item.imgPosition}
                    mobileView={item.mobileView}
                    delay={item.delay}
                />
            )}
        </Stack>
    )
}

interface AboutLucSectionComponentProps {
    mobileView?: boolean;
    image: string;
    title: string;
    description: string;
    section: string;
    sectionColor: string;
    imgPosition: "right" | "left";
    delay: number;
}

const AboutLucSectionComponent = ({
                                      mobileView, image, title, description, section, sectionColor, imgPosition, delay
                                  }: AboutLucSectionComponentProps) => {

    const { ref, inView } = useInView({
        triggerOnce: true,
        threshold: 0.25,
    });

    return (
        mobileView ?
            <AnimatedStack
                ref={ref}
                $inView={inView}
                $delay={delay}
                spacing={2}
            >
                <Box sx={{width: 'clamp(120px, 85%, 200px)'}}
                     component="img"
                     src={image}
                />
                <Typography color={sectionColor} fontFamily={'Geist'} fontWeight={500}>
                    {section}
                </Typography>
                <Typography fontSize={'1.85rem'} fontWeight={600}>
                    {title}
                </Typography>
                <Typography textAlign="left"
                            color="text.lighter"
                >
                    {description}
                </Typography>
            </AnimatedStack>
            :
            <AnimatedGrid
                ref={ref}
                $inView={inView}
                $delay={delay}
                container
                spacing={2}
                alignItems="center"
                flexDirection={imgPosition === "left" ? "row" : "row-reverse"}
            >
                <Grid item xs={6} textAlign={'center'}>
                    <Box sx={{width: 'clamp(300px, 85%, 400px)'}}
                         component="img"
                         src={image}
                    />
                </Grid>
                <Grid item xs={6}>
                    <Stack spacing={2}>
                        <Typography color={sectionColor} fontFamily={'Geist'} fontWeight={500}>
                            {section}
                        </Typography>
                        <Typography variant="h2" fontWeight={600}>
                            {title}
                        </Typography>
                        <Typography textAlign="left"
                                    color="text.lighter"
                        >
                            {description}
                        </Typography>
                    </Stack>
                </Grid>
            </AnimatedGrid>
    )
}

export default HomeAboutLucMainSection