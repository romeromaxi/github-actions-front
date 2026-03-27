import {createStyles, makeStyles} from "@mui/styles";
import {Theme} from "@mui/material/styles";

export default makeStyles((theme: Theme) =>
    createStyles({
        cardContainer: {
            width: "100%",
            height: "100%",
            display: "flex",
            zIndex: theme.zIndex.appBar - 1,
            p: 2,
            paddingTop: '32px',
            maxWidth: '670px !important',

            position: 'absolute',
            transform: 'translate(40dvh, 0%)',

            '@supports (justify-self: anchor-center)': {
                justifySelf: 'anchor-center',
                transform: 'none !important',
            },
        },
        cardContainerMobile: {
            maxWidth: '72dvw !important',
            transform: 'translate(14%, 0%)',

            '@supports (justify-self: anchor-center)': {
                justifySelf: 'anchor-center',
                transform: 'none !important',
            },
        },
        card: {
            maxWidth: '600 !important',
            width: "100%",
            boxShadow: `inset 0 0 0 2px ${theme.palette.primary.main} !important`,
        },
        childrenContainer: {
            transition: "filter 0.3s ease-in-out",
            width: "100%",
            filter: "none",
            pointerEvents: "auto",
        },
        childrenContainerBlurred: {
            filter: "blur(5px)",
            pointerEvents: "none",
        },
        childrenContainerMinBlurred: {
            filter: "blur(2px)",
            pointerEvents: "none",
        }
    })
);