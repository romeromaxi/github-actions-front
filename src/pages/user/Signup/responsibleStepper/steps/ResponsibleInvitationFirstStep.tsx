import React, {useContext} from "react";
import {SignupResponsibleStepperFormContext} from "../SignupResponsibleStepperForm";
import {CompanyUserInvitationFields} from "../../../../../types/user/userInvitation";
import {Typography} from "@mui/material";


const ResponsibleInvitationFirstStep = () => {
    const {invitation} = useContext(SignupResponsibleStepperFormContext)
    
    
    return (
        <Typography
            component="div"
            color="text.disabled"
            fontSize={17}
            sx={{ whiteSpace: 'pre-wrap', textAlign: 'center' }}
        >
            {`¿Deseás aprobar el vínculo de `}
            <Typography component="span" fontWeight={600} color="primary" fontSize={17}>
                {invitation?.[CompanyUserInvitationFields.OwnUserInvitationBusinessName]}
            </Typography>
            {` con `}
            <Typography component="span" fontWeight={600} color="primary" fontSize={17}>
                {invitation?.[CompanyUserInvitationFields.CompanyBusinessName].toUpperCase()}
            </Typography>
            {`?`}
        </Typography>
    )
}


export default ResponsibleInvitationFirstStep