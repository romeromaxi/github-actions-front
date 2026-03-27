import {ReactNode} from "react";
import {Box, Card, CardContent, Typography} from "@mui/material";
import {AppConfigFields, AppConfigLogosFields} from "types/appConfigEntities";


interface CardItemsNotFoundProps {
    title: string,
    description?: string | ReactNode,
    actions?: ReactNode
}


const CardItemsNotFound = ({title, description, actions} : CardItemsNotFoundProps) => {
    
    return (
        <Card sx={{ width: '100%' }}>
            <CardContent
                sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'center',
                    alignItems: 'center',
                    width: '100%'
                }}
            >
                <Box sx={{
                    gap: '24px',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'center',
                    alignItems: 'center',
                    width: '60%'
                }}>
                    {/*<Box component="img"
                         src={window.APP_CONFIG[AppConfigFields.Logos][AppConfigLogosFields.Full]}
                         sx={{height: '100px !important', width: '184px !important'}}
                    />*/}
                    <Typography variant={'h4'} fontWeight={500} textAlign={'center'}>
                        {title}
                    </Typography>
                    {
                        !!description &&
                        <Typography textAlign={'center'} color={'text.lighter'} variant={'subtitle1'}>
                            {description}
                        </Typography>
                    }
                    {actions && actions}
                </Box>
            </CardContent>
        </Card>
    )
}


export default CardItemsNotFound