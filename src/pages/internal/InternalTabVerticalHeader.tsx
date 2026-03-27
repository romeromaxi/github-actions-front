import { useUser } from "hooks/contexts/UserContext";
import {Avatar, Stack, Typography} from "@mui/material";
import {TypographyBase} from "../../components/misc/TypographyBase";
import {stringFormatter} from "../../util/formatters/stringFormatter";


const InternalTabVerticalHeader = () => {
    const { user, displayName, initialsName } = useUser();
    
    return (
        <Stack direction={'row'} alignItems={'center'} spacing={1}>
            <Avatar
                sx={{
                    fontSize: '1.05rem !important',
                    width: 48,
                    height: 48,
                    color: 'primary.contrastText',
                    backgroundColor: 'primary.main',
                }}
            >
                {initialsName}
            </Avatar>
            <Stack width={'100%'} overflow={'hidden'}>
                <TypographyBase variant={'h5'} fontWeight={500} maxLines={2} tooltip>
                    {displayName}
                </TypographyBase>
                {user?.cuit && (
                    <Typography variant={'caption'} color={'text.lighter'}>
                        {stringFormatter.formatCuit(user.cuit)}
                    </Typography>
                )}
            </Stack>
        </Stack>
    )
}


export default InternalTabVerticalHeader