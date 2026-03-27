import {Avatar, Stack, Typography} from "@mui/material";
import {TypographyBase} from "../../../components/misc/TypographyBase";
import {stringFormatter} from "../../../util/formatters/stringFormatter";
import AccountCircleRoundedIcon from "@mui/icons-material/AccountCircleRounded";
import {grey} from "@mui/material/colors";
import {Skeleton} from "@mui/lab";
import React, {useEffect, useState} from "react";
import {HttpOffererRoles} from "../../../http";
import {useUser} from "../../../hooks/contexts/UserContext";


interface OffererTabVerticalHeaderProps {
    offererId?: number;
}

const OffererTabVerticalHeader = ({offererId} : OffererTabVerticalHeaderProps) => {
    const { user, displayName, initialsName } = useUser();
    const [groupsName, setGroupsName] = useState<string>();
    
    useEffect(() => {
        setGroupsName(undefined);
        if (!!offererId)
            HttpOffererRoles.getRolesByLoggedUser(offererId).then(setGroupsName);
    }, [offererId]);
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
                {groupsName ? (
                    <Stack direction='row' alignItems='center'>
                        <AccountCircleRoundedIcon
                            fontSize={'small'}
                            sx={{ color: grey[500] }}
                        />
                        <Typography
                            fontSize={13}
                            fontWeight={500}
                            color={grey[500]}
                        >
                            {groupsName}
                        </Typography>
                    </Stack>
                ) : (
                    <Skeleton width={'100%'} />
                )}
            </Stack>
        </Stack>
    )
}


export default OffererTabVerticalHeader