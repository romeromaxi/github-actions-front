import {Box, Card, CardContent, Stack, Typography} from "@mui/material";
import {
    AppConfigAlliedOfferer,
    AppConfigAlliedOffererFields,
    AppConfigAlliedOfferersFields,
    AppConfigFields
} from "types/appConfigEntities";

interface HomeLucAlliesProps {
    mobileView: boolean;
}

interface OffererAllyItemProps {
    name: string,
    urlImage: string
}

const OffererAllyItem = ({ name, urlImage }: OffererAllyItemProps) => (
    <Box component="img"
         src={urlImage}
         alt={`${name} logo`}
         sx={{ filter: 'brightness(0) invert(0.99)', height: '50px', maxWidth: '240px' }}
    />
);

const HomeLucAllies = ({ mobileView }: HomeLucAlliesProps) => {
    const alliedOfferers: AppConfigAlliedOfferer[] = window.APP_CONFIG[AppConfigFields.AlliedOfferers]?.[AppConfigAlliedOfferersFields.List];
    
    const cardStyles = {
        width: '100%',
        backgroundColor: '#016938',
        backgroundImage: 'url(/images/allies-texture.png)',
        backgroundSize: 'cover',
    };

    const headerSection = (
        <Stack spacing={2}>
            <Typography
                color="#A9FF7B"
                fontFamily="Geist"
                textAlign="center"
                fontWeight={500}
            >
                NUESTROS ALIADOS
            </Typography>
            <Typography
                variant={mobileView ? undefined : 'h2'}
                fontSize={mobileView ? '1.85rem' : undefined}
                textAlign="center"
                color="white"
                fontWeight={600}
            >
                Las entidades que ya se sumaron a LUC
            </Typography>
        </Stack>
    );

    return (
        <Card sx={{
            paddingX: { xs: 2, md: 7 },
            paddingY: 6,
            ...cardStyles
        }}>
            <CardContent>
                <Stack spacing={5.75}>
                    {headerSection}
                    
                    <Stack direction={{ xs: 'column', sm: 'row' }}
                           gap={{ xs: 3, md: 4, lg: 6 }}
                           alignItems="center"
                           justifyContent="center"
                           flexWrap="wrap"
                    >
                        {
                            alliedOfferers.map(o => (
                                <OffererAllyItem name={o[AppConfigAlliedOffererFields.Name]} 
                                                 urlImage={o[AppConfigAlliedOffererFields.UrlImage]}
                                />
                            ))
                        }
                    </Stack>
                </Stack>
            </CardContent>
        </Card>
    );
};

export default HomeLucAllies;