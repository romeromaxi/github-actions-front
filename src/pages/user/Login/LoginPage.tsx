import {Box, Card, CardContent} from "@mui/material";
import React, {useState} from "react";
import LoginFormNew from "./LoginFormNew";
import {MailRecoveryFormNew} from "./MailRecoveryForm";
import {PasswordRecoveryFormNew} from "./PasswordRecoveryForm";

const LoginPage = () => {
    const [mailRecovery, setMailRecovery] = useState<boolean>(false);
    const [passwordRecovery, setPasswordRecovery] = useState<boolean>(false);
    const onClickMailRecovery = () => setMailRecovery(true)
    
    const onClickPasswordRecovery = () => setPasswordRecovery(true)
    
    return (
        <Box sx={{width: '100%' , justifyContent: 'center', display: 'flex', alignItems: 'center' }}>
            <Card variant={'onboarding'}>
                <CardContent sx={{width: '100%', height: '100%', display: 'flex', flexDirection: 'column'}}>
                    {
                        !mailRecovery && !passwordRecovery &&
                        <LoginFormNew onClickPasswordRecovery={onClickPasswordRecovery}
                                      onClickMailRecovery={onClickMailRecovery}
                        />
                    }
                    {
                        mailRecovery &&
                        <MailRecoveryFormNew onClickReturn={() => setMailRecovery(false)} />
                    }
                    {
                        passwordRecovery &&
                        <PasswordRecoveryFormNew onClickReturn={() => setPasswordRecovery(false)} />
                    }
                </CardContent>
            </Card>
        </Box>
    )
}


export default LoginPage