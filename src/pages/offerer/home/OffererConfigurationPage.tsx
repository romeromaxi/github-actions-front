import React from 'react';
import {userStorage} from 'util/localStorage/userStorage';
import {NavsTabVertical} from "../../../components/navs/NavsTab";
import {useNavigate} from "react-router-dom";
import {OffererProfileType} from "../../../types/offerer/offererData";
import {Box, Button, Stack} from "@mui/material";
import {offererTabs} from "../OffererTabConfiguration";
import {TypographyBase} from "../../../components/misc/TypographyBase";

function OffererConfigurationPage() {
    const profileIds: number[] | undefined = userStorage.getProfileIds();
    const navigate = useNavigate()

    return (
        <Stack spacing={2}>
            <TypographyBase variant={'h3'}>
                Configuración
            </TypographyBase>
            
            <Box sx={{ flexGrow: 1, overflow: 'hidden' }}>
                <NavsTabVertical
                    tabSize={3}
                    lstTabs={[
                        {tabList: offererTabs}
                    ]}
                    alwaysSomeActiveTab
                >
                    {
                        (profileIds && profileIds.includes(OffererProfileType.Administrator)) ?
                            <Button
                                variant={'outlined'}
                                color={'secondary'}
                                size={'small'}
                                onClick={() => navigate('/market/landing')}
                                fullWidth
                            >
                                Ingresá a la tienda
                            </Button>
                            :
                            <></>
                    }
                </NavsTabVertical>
            </Box>
            
        </Stack>
    );
}

export default OffererConfigurationPage
