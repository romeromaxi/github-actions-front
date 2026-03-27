window.API_PROTOCOL = "https";
//window.API_DOMAIN = "luctest.qua.com.ar:446/api";
//window.API_PUBLIC_BASES_DOMAIN = "luctest.qua.com.ar:446/apiBasesPublicas";
window.API_DOMAIN = "localhost:7239";
window.API_PUBLIC_BASES_DOMAIN = "localhost:7160"
window.API_VERSION = "v1";
window.API_TIMEOUT = 300000;
window.reCAPTCHA_SITE_KEY = "6Leq4ksgAAAAADKU1Zc1PIkr4DNKgeV8W-DsmNf4";
window.URL_ABOUT_LUC = "/sobre-luc";
window.URL_SOLUTIONS_FOR_PYMES_LUC = "/ayuda/soluciones";
window.URL_FAQ_LUC = "/ayuda/preguntas-frecuentes";
window.URL_CONTACT_LUC = "/contacto";
window.URL_GLOSSARY_LUC = "/informacion-para-elegir-mejor/glosario";
window.URL_INSTRUCTIVE_LUC = "/ayuda/instructivos"
window.URL_X_LUC = "https://x.com"
window.URL_INSTAGRAM_LUC = "https://www.instagram.com"
window.URL_FACEBOOK_LUC = "https://www.facebook.com"
window.URL_LINKEDIN_LUC = "https://www.linkedin.com"
window.ID_GOOGLE_ANALYTICS = "G-VBE8C2NPTR";
window.GOOGLE_DRIVE_API = "https://www.googleapis.com/drive/v3/files"
window.GOOGLE_DRIVE_API_CLIENT_ID = "937528683749-1cdcomt21tl3i8nbs8dg63ft897l7feq.apps.googleusercontent.com"
window.GOOGLE_DRIVE_API_KEY = "AIzaSyD86vWCjD5PUCJuC4xy-dVU_boWeUDkx9w"
window.DROPBOX_APP_KEY = "xnk54eff9ked814"
window.EDITORHTML_TINY_KEY = "wheb7qfrbdml89i29tajw33tbbahaa5upxjlunm6lavsf8hi"
window.IS_PRODUCTION_ENV = false

window.APP_CONFIG = {
    title: 'LUC',
    description: 'El camino de las pymes al financiamiento',
    fontFamily: 'Poppins',
    logos: {
        ico: '/images/logos/luc_icon.ico',
        full: '/images/logos/luc_full.svg',
        icon: '/images/logos/luc_icon.svg',
        fullNegative: '/images/logos/luc_full_negative.svg',
        iconNegative: '/images/logos/luc_icon_negative.svg',
        icon192: '/images/logos/luc_icon_192.png',
        icon300: '/images/logos/luc_icon_300.png',
    },
    
    appbar: {
        height: '74px',
        logo: {
            width: '89px',
            height: '28.8px',
        }
    },
    
    footer: {
        logo: {
            width: '201px',
            height: '65.04px',
        },
        socialMedia: {
            youtube: "",
            facebook: "",
            x: "",
            instagram: "",
            linkedin: "https://www.linkedin.com/company/luc-byqua"
        },
        rightReservedText: "\u00A9 LUC 2025 - All rights reserved."
    },

    allies: {
        show: true,
        list: [
            {
                name: 'CASFOG',
                urlImage: '/images/offerers/Casfog.png'
            },
            {
                name: 'Trend SGR',
                urlImage: '/images/offerers/Trend SGR.png'
            },
            {
                name: 'Meridiano',
                urlImage: '/images/offerers/Meridiano.png'
            },
            {
                name: 'Trend Capital',
                urlImage: '/images/offerers/Trend Capital.png'
            },
            /*{
                name: 'Evolución',
                urlImage: ''
            },*/
            {
                name: 'BIND Garantías',
                urlImage: '/images/offerers/Bind Garantias.png'
            },
            {
                name: 'Resiliencia SGR',
                urlImage: '/images/offerers/Resiliencia SGR.png'
            },
            {
                name: 'Innova SGR',
                urlImage: '/images/offerers/Innova SGR.png'
            },
            {
                name: 'Momentum',
                urlImage: '/images/offerers/Momentum.png'
            },
            {
                name: 'PPI',
                urlImage: '/images/offerers/PPI.png'
            },
            {
                name: 'Bill',
                urlImage: '/images/offerers/Bill.png'
            }
        ]
    },
    
    palette: {
        primary: {
            light: '#DEFFCC',
            main: '#008547',
            dark: '#006A39',
            contrastText: '#FFFFFF'
        },
        secondary: {
            light: '#DEFFCC',
            main: '#DEFFCC',
            dark: '#008547',
            contrastText: '#01360A'
        }

        /* Colores más pasteles
                light: '#DEFFCC',
                main: '#C2F5D8',
                dark: '#4DAB2B',
                contrastText: '#01360A'*/
    },
    
    termsAndConditionsUrl: "/LUC-T&C.pdf",
    privacyPoliciesUserUrl: "/LUC-PrivacyPoliciesUser.pdf",

    bannerDelay: 6000,

    resourcesHome: {
        video: {
            descriptionUrl: "/images/home/descripcion-video.png",
            presentationUrl: "/images/home/video-presentacion.mp4",
            posterUrl: "/images/home/poster-video.png"
        },
        banner: [
            {
                title: "",
                description: "Con un aval accedés a mejores tasas, plazos y condiciones en los bancos",
                url: "/images/home/luc_sabias_que.png",
                position: "",
                navigate: "/market/lines/alterSearch?guid=7F15C662-317E-4B02-91D1-AEDB4CE3EAD1"
            },
            {
                title: "",
                description: "Con un aval de SGR o Fondo de Garantía podés acceder a créditos en los principales bancos del país",
                url: "/images/home/luc_sabias_que.png",
                position: "",
                navigate: "/market/lines/alterSearch?guid=7F15C662-317E-4B02-91D1-AEDB4CE3EAD1"
            },
            {
                title: "",
                description: "Si facturás a grandes empresas podés descontar las facturas fácilmente para obtener liquidez inmediata",
                url: "/images/home/luc_sabias_que.png",
                position: "",
                navigate: "/market/landing"
            },
            {
                title: "",
                description: "El descuento de cheques puede ser una alternativa rápida de financiamiento de corto plazo",
                url: "/images/home/luc_sabias_que.png",
                position: "",
                navigate: "/market/landing"
            },
            {
                title: "",
                description: "Podés conocer cómo sos visto en el mercado en la sección de ‘Ver cómo me ven’",
                url: "/images/home/luc_sabias_que.png",
                position: "",
                navigate: "/market/landing"
            },
            {
                title: "",
                description: "Completando tus datos o los de tu empresa una sola vez, quedan habilitados para utilizarlos en múltiples solicitudes de financiamiento y gestiones, tanto dentro como fuera de LUC",
                url: "/images/home/luc_sabias_que.png",
                position: "",
                navigate: "/market/landing"
            }
        ],
        images: [
            {
                url: "/images/home/soluciones-para-tu-empresa.png",
                navigate: "{{URL_SOLUTIONS_FOR_PYMES_LUC}}"
            },
            {
                url: "/images/home/testimonios.png"
            }
        ]
    }
}