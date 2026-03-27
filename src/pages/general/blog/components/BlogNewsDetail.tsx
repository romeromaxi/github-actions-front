import {Box, Link as MuiLink, Stack, Theme, useMediaQuery} from "@mui/material";
import {TypographyBase} from "components/misc/TypographyBase";
import {useParams} from "react-router";
import {BackButton} from "components/buttons/Buttons";
import {useNavigate} from "react-router-dom";
import React, {useEffect, useState} from "react";
import { Helmet } from "react-helmet-async";
import {AppConfigFields} from "types/appConfigEntities";
// @ts-ignore
import chart from "../../../../assets/img/luc/home-chart-flyer.svg";
// @ts-ignore
import head from "../../../../assets/img/luc/home-head-inspection.svg";
import FlyerBase from "../../../../components/flyers/FlyerBase";
import {useUser} from "../../../../hooks/contexts/UserContext";
import {MarketRoute} from "../../../../routes/market/routeAppMarketData";
import {useAppNavigation} from "../../../../hooks/navigation";
import {HttpCompany} from "../../../../http";
import {EntityWithIdFields} from "../../../../types/baseEntities";
import {CompanyViewDTO} from "../../../../types/company/companyData";
import CompaniesSelectDialog from "../../../company/components/CompaniesSelectDialog";
import MustHaveRelatedCompanyDialog from "../../../markets/lines/shoppingbag/dialogs/MustHaveRelatedCompanyDialog";
import FailRedirectMarketDialog from "../../../markets/home/components/FailRedirectMarketDialog";
import {blogData, BlogFlyerType, SectionContent} from "./BlogCommonData";


interface DetailedSectionProps {
    sections: SectionContent[];
}

const BlogNewsDetail = () => {
    const { navigate } = useAppNavigation();
    const generalNavigate = useNavigate();
    let params = useParams();
    const blogGuid = params.blogGuid ?? '';
    const isMobile = useMediaQuery((theme: Theme) => theme.breakpoints.down(850));
    const { isLoggedIn } = useUser();
    const blogItem = blogData.find(b => b.id === blogGuid) || blogData[3];
    const [companies, setCompanies] = useState<CompanyViewDTO[]>();
    const [companiesDrawer, setCompaniesDrawer] = useState<boolean>(false);
    const [openNoCompanies, setOpenNoCompanies] = useState<boolean>(false);
    const [failRedirect, setFailRedirect] = useState<{ open: boolean, message?: string }>({ open: false});
    
    const ImageBox = () => (
        <Box
            sx={{
                width: '100%',
                maxHeight: isMobile ? '420px !important' : '543px !important',
                overflow: 'hidden',
                flex: 1,
                display: 'flex',
                alignItems: 'stretch'
            }}
        >
            <Box
                component="img"
                src={blogItem.imageSrc}
                alt={blogItem.title}
                sx={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover',
                    display: 'block'
                }}
            />
        </Box>
    );

    const ContentBox = () => (
        <Stack sx={{ width: '100%', minHeight: '-webkit-fill-available', height: '100% !important', textAlign: 'left', flex: 1 }}
               justifyContent={'space-between'}
        >
            <Stack direction={"row"} alignItems="flex-start" sx={{marginTop: isMobile ? '0px' : '48px'}}>
                <BackButton variant="text" onClick={() => generalNavigate(-1)}>
                    Volver al Blog
                </BackButton>
            </Stack>
            <Stack spacing={2} justifyContent="flex-end" alignItems="flex-start" sx={{ flex: 1, justifyContent: 'flex-end', alignItems: 'flex-start', width: '100%' }}>
                <TypographyBase variant={isMobile ? 'h2' : 'h1'} color={'#232926'}>
                    {blogItem.title}
                </TypographyBase>
                <TypographyBase
                    variant="body1"
                    color="text.lighter"
                >
                    {blogItem.description}
                </TypographyBase>
            </Stack>
        </Stack>
    );

    const loadCompanies = () => {
        HttpCompany.getCompaniesByUser().then((r) => {
            if (r.length === 0) setOpenNoCompanies(true)
            else if (r.length === 1) generalNavigate(`/mis-empresas/${r[0][EntityWithIdFields.Id]}?tab=bureau`)
            else {
                setCompanies(r)
                setCompaniesDrawer(true)
            }
        })
    }
    
    const handleClickFinancialFlyer = () => {
        if (isLoggedIn) {
            loadCompanies()       
        } else {
            setFailRedirect({ 
                open: true, 
                message: 'En LUC podés conocer qué saben de tu perfil crediticio clientes, proveedores y entidades' 
            })
        }
    }
    
    const handleClickFlyerRegister = () => {
        isLoggedIn ? navigate(MarketRoute.MarketLanding) : setFailRedirect({ open: true })
    }
    
    const DetailedSections = ({ sections }: DetailedSectionProps) => {
        const blocks: SectionContent[][] = [];
        let currentBlock: SectionContent[] = [];
        sections.forEach((section, idx) => {
            if (section.type === 'title' && currentBlock.length > 0) {
                blocks.push(currentBlock);
                currentBlock = [section];
            } else {
                currentBlock.push(section);
            }
        });
        if (currentBlock.length > 0) blocks.push(currentBlock);

        return (
            <Stack
                spacing={isMobile ? 5.25 : 7}
                sx={{
                    maxWidth: isMobile ? 'calc(100% - 32px)' : '850px',
                    margin: '0 auto',
                    width: '100%'
                }}
            >
                {blocks.map((block, blockIdx) => (
                    <Stack key={blockIdx} spacing={3}>
                        {block.map((section, idx) => {
                            switch (section.type) {
                                case 'title':
                                    return (
                                        <TypographyBase key={idx} variant={isMobile ? "h4" : "h3"} color="#232926">
                                            {section.content}
                                        </TypographyBase>
                                    );
                                case 'subtitle':
                                    return (
                                        <TypographyBase key={idx} variant={isMobile ? "h5" : "h4"} color="#232926">
                                            {section.content}
                                        </TypographyBase>
                                    );
                                case 'description':
                                    return (
                                        <TypographyBase key={idx} variant="body1" color="text.lighter" sx={{ lineHeight: 1.6 }}>
                                            {
                                                typeof section.content === 'string'
                                                ? (section.content as string).split('\n').map((line, i, arr) => (
                                                    line ?
                                                        <React.Fragment>
                                                            <div dangerouslySetInnerHTML={{ __html: line }} />
                                                            {i !== arr.length - 1 && <br />}
                                                        </React.Fragment>
                                                        :
                                                        null
                                                ))
                                                : section.content
                                            }
                                        </TypographyBase>
                                    );
                                case 'list':
                                    return (
                                        <Stack key={idx} spacing={1.5}>
                                            {Array.isArray(section.content) && section.content.map((item, itemIndex) => (
                                                <Stack key={itemIndex} direction="row" spacing={1.5}>
                                                    <Box
                                                        sx={{
                                                            width: '16px',
                                                            height: '16px',
                                                            borderRadius: '4.8px',
                                                            backgroundColor: '#164293',
                                                            marginTop: '5.5px !important',
                                                            flexShrink: 0,
                                                        }}
                                                    />
                                                    <TypographyBase variant="body1" color="text.lighter" sx={{ lineHeight: 1.6 }}>
                                                        {item}
                                                    </TypographyBase>
                                                </Stack>
                                            ))}
                                        </Stack>
                                    );
                                case 'link':
                                    return (
                                        <MuiLink key={idx} href={section.href} sx={{ color: 'primary.main', cursor: 'pointer' }}>
                                            <TypographyBase variant="body1" color="inherit" sx={{ fontWeight: 600 }}>
                                                {section.content}
                                            </TypographyBase>
                                        </MuiLink>
                                    );
                                default:
                                    return null;
                            }
                        })}
                    </Stack>
                ))}
            </Stack>
        );
    }

    useEffect(() => {
        return () => {
            document.title = window.APP_CONFIG[AppConfigFields.Title];
        };
    }, []);

    return (
        <React.Fragment>
            <Helmet>
                <title>{`${window.APP_CONFIG[AppConfigFields.Title]} | ${blogItem.title}`}</title>
                <meta name="description" content={blogItem.description} />
                <meta name="meta-og-tittle" content={blogItem.title} />
                <meta name="meta-og-description" content={blogItem.description} />
                <meta name="meta-description" content={blogItem.description} />
            </Helmet>
            
            <Stack spacing={isMobile ? 7 : 15} alignItems="center">
                <Stack
                    direction={isMobile ? "column" : "row"}
                    spacing={isMobile ? 3 : 4.5}
                    sx={{
                        width: '100%',
                        minHeight: isMobile ? 'auto' : '450px',
                        alignItems: isMobile ? 'center' : 'flex-start'
                    }}
                >
                    {isMobile ? <ImageBox /> : <ContentBox />}
                    {isMobile ? <ContentBox /> : <ImageBox />}
                </Stack>
                <DetailedSections sections={blogItem.sections} />
                {
                    (blogItem.flyerType === BlogFlyerType.Bureau) ?
                        <FlyerBase
                            variant={'success'}
                            title={'Conocé cómo las entidades ven a tu PyME a la hora de ofrecerte financiamiento'}
                            ImageProps={{
                                source: head,
                                leftPosition: isMobile ? undefined : '23px',
                                desktopWidth: '385px',
                                desktopHeight: '385px',
                                mobileWidth: '184px',
                                mobileHeight: '184px',
                                absoluteOnDesktop: true,
                                alignSelfMobile: 'flex-start',
                                opacity: 0.87
                            }}
                            ButtonProps={{
                                label: 'Ir a Ver como me ven',
                                id: "btn-ver-como-me-ven-flyer",
                                onClick: handleClickFinancialFlyer
                            }}
                            maxWidth={'100%'}
                            minHeight={isMobile ? 'auto' : '321px'}
                            paddingMobile={'48px 24px 24px'}
                            paddingDesktop={'48px 71px 48px 481px'}
                            typographyVariants={{
                                titleDesktop: 'h3',
                                titleMobile: 'h4',
                                descriptionDesktop: 'body2',
                                descriptionMobile: 'body2',
                                eyebrowDesktop: 'eyebrow3',
                                eyebrowMobile: 'eyebrow3',
                            }}
                            buttonLayout={'below-title'}
                            contentSpacing={1}
                        />
                        :
                        <FlyerBase
                            variant={'success'}
                            title={'Encontrá en LUC los mejores productos de financiamento para tu PyME'}
                            ImageProps={{
                                source: chart,
                                leftPosition: isMobile ? undefined : '23px',
                                desktopWidth: '385px',
                                desktopHeight: '385px',
                                mobileWidth: '184px',
                                mobileHeight: '184px',
                                absoluteOnDesktop: true,
                                alignSelfMobile: 'flex-start',
                                mixBlendMode: 'hard-light',
                                opacity: 0.87
                            }}
                            ButtonProps={{
                                label: 'Empezar ahora',
                                id: "btn-registrate-flyer-crecimiento",
                                onClick: handleClickFlyerRegister
                            }}
                            maxWidth={'100%'}
                            minHeight={isMobile ? 'auto' : '321px'}
                            paddingMobile={'48px 24px 24px'}
                            paddingDesktop={'48px 71px 48px 481px'}
                            typographyVariants={{
                                titleDesktop: 'h3',
                                titleMobile: 'h4',
                                descriptionDesktop: 'body2',
                                descriptionMobile: 'body2',
                                eyebrowDesktop: 'eyebrow3',
                                eyebrowMobile: 'eyebrow3',
                            }}
                            buttonLayout={'below-title'}
                            contentSpacing={1}
                        />
                }
            </Stack>
            <CompaniesSelectDialog open={companiesDrawer}
                                   onClose={() => setCompaniesDrawer(false)}
                                   title={'Selecciona la empresa que querés ver'}
                                   onSelect={(id: number) => {
                                       setCompaniesDrawer(false)
                                       generalNavigate(`/mis-empresas/${id}?tab=bureau`)
                                   }}
                                   onReloadCompanies={loadCompanies}
                                   companies={companies}
            />
            <MustHaveRelatedCompanyDialog open={openNoCompanies}
                                          onClose={() => setOpenNoCompanies(false)}
            />
            <FailRedirectMarketDialog open={failRedirect.open}
                                      onClose={() => setFailRedirect({ open: false })}
                                      description={failRedirect.message}
            />
        </React.Fragment>
    )
}


export default BlogNewsDetail;
