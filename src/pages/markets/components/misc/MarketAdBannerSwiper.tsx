import {Autoplay, Navigation, Pagination} from "swiper";
import React, {useEffect, useRef, useState} from "react";
import {useNavigate} from "react-router-dom";
import {Swiper, SwiperSlide} from "swiper/react";
import {AppConfigFields} from "types/appConfigEntities";
import FlyerBase from "components/flyers/FlyerBase";
import FlyerBaseLoading from "components/flyers/FlyerBaseLoading";
import {AdDestinationTypes, AdView, AdViewFields} from "types/ad/adData";
import {CompanyViewDTO} from "types/company/companyData";
import MustHaveRelatedCompanyDialog from "../../lines/shoppingbag/dialogs/MustHaveRelatedCompanyDialog";
import CompaniesSelectDialog from "pages/company/components/CompaniesSelectDialog";
import {HttpCompany} from "http/company";
import {EntityWithIdFields} from "types/baseEntities";
import {useUser} from "hooks/contexts/UserContext";
import FailRedirectMarketDialog from "../../home/components/FailRedirectMarketDialog";
import {Module} from "types/form/login/login-enum";


interface MarketAdBannerSwiperProps {
    ads?: AdView[];
    disabledAction?: boolean
}


const MarketAdBannerSwiper = ({ads, disabledAction}: MarketAdBannerSwiperProps) => {
    const swiperRef = useRef<HTMLDivElement>(null);
    const variants = ['info', 'success', 'warning', 'error'] as const;
    const { isLoggedIn, user } = useUser();
    const navigate = useNavigate();

    const [companies, setCompanies] = useState<CompanyViewDTO[]>();
    const [openFailRedirect, setOpenFailRedirect] = useState<boolean>(false);
    const [openNoCompanies, setOpenNoCompanies] = useState<boolean>(false);
    const [companiesDrawer, setCompaniesDrawer] = useState<boolean>(false);

    const loadCompanies = () => {
        HttpCompany.getCompaniesByUser().then((r) => {
            if (r.length === 0) setOpenNoCompanies(true)
            else if (r.length === 1) navigate(`/mis-empresas/${r[0][EntityWithIdFields.Id]}?tab=bureau`)
            else {
                setCompanies(r)
                setCompaniesDrawer(true)
            }
        })
    }
    
    const closeFailRedirect = () => setOpenFailRedirect(false);

    const handleNavigateToCompanyBureau = () => {
        if (!isLoggedIn) {
            setOpenFailRedirect(true);
        } else if (!!user && user.userType === Module.Company){
            loadCompanies()
        }
    }

    const adjustSlideHeights = () => {
        if (!swiperRef.current) return;
        const slides = swiperRef.current.querySelectorAll<HTMLDivElement>('.swiper-slide');
        let maxHeight = 0;

        slides.forEach(slide => (slide.style.height = 'auto'));

        slides.forEach(slide => {
            maxHeight = Math.max(maxHeight, slide.offsetHeight);
        });

        slides.forEach(slide => (slide.style.height = `${maxHeight}px`));
    };

    useEffect(() => {
        adjustSlideHeights();
        window.addEventListener('resize', adjustSlideHeights);
        return () => window.removeEventListener('resize', adjustSlideHeights);
    }, [ads]);
    
    const handleNavigate = (ad: AdView) => {
        if (disabledAction) return;
        
        switch (ad[AdViewFields.AdDestinationTypeCode]) {
            case AdDestinationTypes.Platform:
            case AdDestinationTypes.MarketAdvancedSearch:
                navigate(ad[AdViewFields.DestinationUrl]);
                break;
                
            case AdDestinationTypes.CompanyBureau:
                handleNavigateToCompanyBureau();
                break;
                
            case AdDestinationTypes.Video:
                break;

            case AdDestinationTypes.External:
            default:
                window.open(ad[AdViewFields.DestinationUrl], '_blank')
        }
    }
    
    return (
        <div ref={swiperRef}>
            {
                ads ? 
                    <Swiper
                        id={`marketAdBannerSwiper`}
                        key={`flyerBaseContent`}
                        modules={[Pagination, Autoplay]}
                        spaceBetween={32}
                        slidesPerView={1.3}
                        centeredSlides
                        pagination={{ clickable: true }}
                        autoplay={{
                            delay: window.APP_CONFIG[AppConfigFields.BannerDelay],
                            disableOnInteraction: false
                        }}
                        loop
                    >
                        {ads.map((ad, index) => (
                            <SwiperSlide key={`flyerBase_${index}`} style={{ width: '100%', height: '-webkit-fill-available' }}>
                                <FlyerBase title={ad[AdViewFields.Description]}
                                           description={ad[AdViewFields.Detail]}
                                           eyebrow={ad[AdViewFields.Header]}
                                           ButtonProps={{
                                               label: ad[AdViewFields.ButtonName] || 'Ver más', 
                                               onClick: () => handleNavigate(ad)
                                           }}
                                           variant={variants[index % 4]}
                                           maxWidth={'1024px'}
                                />
                            </SwiperSlide>
                        ))}
                    </Swiper>
                    :
                    <Swiper
                        id={`marketAdBannerSwiperLoading`}
                        key={`flyerBaseContentLoading`}
                        modules={[Navigation, Pagination, Autoplay]}
                        spaceBetween={32}
                        slidesPerView={1.3}
                        centeredSlides
                        navigation
                        pagination={{ clickable: true }}
                        autoplay={{
                            delay: window.APP_CONFIG[AppConfigFields.BannerDelay],
                            disableOnInteraction: false
                        }}
                        loop
                    >
                        {variants.map((variant, index) => (
                            <SwiperSlide key={`flyerBaseLoading_${index}`} style={{ height: '-webkit-fill-available' }}>
                                <FlyerBaseLoading variant={variant} maxWidth={'1024px'} />
                            </SwiperSlide>
                        ))}
                    </Swiper>
            }

            <FailRedirectMarketDialog open={openFailRedirect} 
                                      onClose={closeFailRedirect}
                                      description={'En LUC podés conocer qué saben de tu perfil crediticio clientes, proveedores y entidades'}
            />
            
            <MustHaveRelatedCompanyDialog open={openNoCompanies}
                                          onClose={() => setOpenNoCompanies(false)}
            />
            
            <CompaniesSelectDialog open={companiesDrawer}
                                   onClose={() => setCompaniesDrawer(false)}
                                   title={'Selecciona la empresa que querés ver'}
                                   onSelect={(id: number) => {
                                       setCompaniesDrawer(false)
                                       navigate(`/mis-empresas/${id}?tab=bureau`)
                                   }}
                                   onReloadCompanies={loadCompanies}
                                   companies={companies}
            />
        </div>
    )
}


export default MarketAdBannerSwiper;