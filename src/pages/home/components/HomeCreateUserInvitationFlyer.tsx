import {useNavigate} from "react-router-dom";
// @ts-ignore
import chart from "../../../assets/img/luc/home-chart-flyer.svg"
import FlyerBase from "../../../components/flyers/FlyerBase";


interface HomeCreateUserInvitationFlyerProps {
    mobileView: boolean;
}

const HomeCreateUserInvitationFlyer = ({mobileView} : HomeCreateUserInvitationFlyerProps) => {
    const navigate = useNavigate();

    return (
        <FlyerBase
            variant={'success'}
            title={'Encontrá la financiación para hacer crecer tu PyME ahora!'}
            ImageProps={{
                source: chart,
                leftPosition: mobileView ? undefined : '23px',
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
                label: 'Crear Usuario Gratis',
                id: "btn-registrate-flyer-crecimiento",
                onClick: () => navigate('/signup')
            }}
            maxWidth={'100%'}
            minHeight={mobileView ? '508px' : '321px'}
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
    )
}


export default HomeCreateUserInvitationFlyer;