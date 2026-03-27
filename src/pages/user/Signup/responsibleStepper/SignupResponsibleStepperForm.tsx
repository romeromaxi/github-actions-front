
import React, {useState} from "react";
import {Box, Card, CardContent, CardHeader, Stack, Step, Stepper} from "@mui/material";
import {PrequalificationDataSteps} from "../../../markets/prequalification/PrequalificationStepper";
import ResponsibleInvitationFirstStep from "./steps/ResponsibleInvitationFirstStep";
import ResponsibleInvitationSecondStep from "./steps/ResponsibleInvitationSecondStep";
import ResponsibleInvitationThirdStep from "./steps/ResponsibleInvitationThirdStep";
import {CompanyUserInvitation, CompanyUserInvitationFields} from "../../../../types/user/userInvitation";
import StepLabelBase from "../../../../components/steppers/components/StepLabelBase";
import {CloseButton, SendButton} from "../../../../components/buttons/Buttons";
import {DialogAlert} from "../../../../components/dialog";
import {useNavigate} from "react-router-dom";
import {UserResponseInvitation} from "../../../../types/user";
import {HttpInvitations} from "../../../../http/invitations";
import {EntityWithIdFields} from "../../../../types/baseEntities";
import useAxios from "../../../../hooks/useAxios";
import {userStorage} from "../../../../util/localStorage";
import { useSecurityReload } from "../../../managers/SecurityManager";
import {useUser} from "../../../../hooks/contexts/UserContext";
import {useAction} from "../../../../hooks/useAction";


interface SignupResponsibleStepperFormProps {
    invitation: CompanyUserInvitation,
    userData: UserResponseInvitation,
    identifier: string
}

export const SignupResponsibleStepperFormContext = React.createContext({
    identifier: '' as string,
    userData: undefined as UserResponseInvitation | undefined, 
    invitation: undefined as CompanyUserInvitation | undefined,
    setInvitation: (a: CompanyUserInvitation) => { },
    onBack: () => { },
    onContinue: () => { },
    onFinishProcess: () => { },
    reloadSecurityObjects: async () => { }
})


const steps : PrequalificationDataSteps[] = [
    {label: 'Paso 1', description: '', component: <ResponsibleInvitationFirstStep />},
    {label: 'Paso 2', description: '', component: <ResponsibleInvitationSecondStep />},
    {label: 'Paso 3', description: '', component: <ResponsibleInvitationThirdStep />}
]

const SignupResponsibleStepperForm = ({invitation, userData, identifier} : SignupResponsibleStepperFormProps) => {
    const navigate = useNavigate()
    const { fetchData } = useAxios();
    const { reloadSecurityObjects } = useSecurityReload();
    const { refreshUser } = useUser();
    const { showLoader, hideLoader } = useAction();
    
    const [formInvitation, setFormInvitation] = useState<CompanyUserInvitation>(invitation);
    const [step, setStep] = useState<number>(0);
    const [openReject, setOpenReject] = useState<boolean>(false);
    const [openConfirmReject, setOpenConfirmReject] = useState<boolean>(false);
    const [acceptInvitation, setAcceptInvitation] = useState<boolean>(false);
    const [completed, setCompleted] = useState<{
        [k: number]: boolean;
    }>({});

    const handleBack = () => {
        if (step - 1 < 0) return;
        setCompleted({
            ...completed,
            [step]: false,
            [step - 1]: false,
        });
        setStep(step - 1);
    };

    const handleNext = () => {
        if (step + 1 > steps.length) return;
        setCompleted({
            ...completed,
            [step]: true,
        });
        setStep(step + 1);
    };

    const isFirstStep = (step: number) => step === 0;
    const isLastStep = (step: number) => step + 1 === steps.length;
    
    const onAcceptInvitation = () => {
        setAcceptInvitation(true);
        handleNext();
    }
    
    const handleReject = () => setOpenReject(true)
    
    const handleConfirmReject = () => {
        setAcceptInvitation(false);
        setOpenConfirmReject(false)
        handleNext()
    }
    
    const handleRejectKeepCompany = () => {
        fetchData(
            () => HttpInvitations.rejectInvitation(invitation[EntityWithIdFields.Id]),
            true
        )
            .then(() => {
                userStorage.removeFromStorage();
                navigate('/')
            })
    }

    const handleFinish = () => {
        fetchData(
            acceptInvitation
                ? () => HttpInvitations.acceptInvitationCompany(invitation[EntityWithIdFields.Id])
                : () => HttpInvitations.rejectInvitation(invitation[EntityWithIdFields.Id]),
            true
        )
            .then(async () => {
                showLoader()
                
                Promise.all([
                    refreshUser(),
                    reloadSecurityObjects()
                ])
                    .then(() => navigate('/'))
                    .finally(() => hideLoader())
            })
    };
    
    const renderTitleByStep = () => {
        let title = '';
        
        if (isLastStep(step))
            title = 'Validá tu identidad para terminar';
        else if (!isFirstStep(step))
            title = 'Creá tu usuario para continuar';
                
        if (!title) return <React.Fragment />
        
        return <CardHeader title={title} />
    }
    
    return (
        <Box sx={{width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center'}} mt={6}>
            <Stepper activeStep={step} alternativeLabel sx={{width: '100%'}}>
                {steps.map((s, idx) => (
                    <Step key={idx} completed={completed[idx]}>
                        <StepLabelBase label={s.label} StepIconProps={{ sx: { fontSize: '2.125rem' } }} />
                    </Step>
                ))}
            </Stepper>
            <SignupResponsibleStepperFormContext.Provider
                value={{ 
                    identifier: identifier,
                    userData: userData,
                    invitation: formInvitation,
                    setInvitation: setFormInvitation,
                    onBack: handleBack,
                    onContinue: handleNext,
                    onFinishProcess: handleFinish,
                    reloadSecurityObjects
            }}
            >
                <Card sx={{ mt: 2, width: '75%' }}>
                    {renderTitleByStep()}
                    <CardContent sx={{ mt: isFirstStep(step) ? 4 : 0 }}>
                        {step < steps.length &&
                            React.cloneElement(steps[step].component, {
                                onBack: step === 0 ? null : handleBack,
                                onNext: handleNext,
                        })}
                        <Stack 
                            direction={{ xs: 'column', sm: 'row' }} 
                            alignItems="center" 
                            justifyContent="space-between" 
                            spacing={{ xs: 2, sm: 0 }} 
                            mt={4}
                            width="100%"
                            >
                            {isFirstStep(step) && (
                                <CloseButton 
                                color='secondary' 
                                onClick={handleReject} 
                                size={'small'}
                                sx={{ 
                                    width: { xs: '100%', sm: 'auto' },
                                    whiteSpace: 'nowrap',
                                    minWidth: 'unset',
                                }}
                                >
                                Rechazar
                                </CloseButton>
                            )}
                            {isFirstStep(step) && (
                                <SendButton 
                                onClick={onAcceptInvitation} 
                                size={'small'}
                                sx={{ 
                                    width: { xs: '100%', sm: 'auto' },
                                    whiteSpace: 'nowrap',
                                    minWidth: 'unset',
                                }}
                                >
                                Aceptar
                                </SendButton>
                            )}
                        </Stack>
                    </CardContent>
                </Card>
                <DialogAlert onClose={() => setOpenReject(false)}
                             open={openReject}
                             textContent={`¿Estás seguro de que deseas rechazar la solicitud de ${invitation[CompanyUserInvitationFields.OwnUserInvitationBusinessName]}?`}
                             textClose={'No'} textConfirm={'Si'}
                             onConfirm={() => {
                                 setOpenReject(false)
                                 setOpenConfirmReject(true)
                             }}
                                 
                />
                <DialogAlert onClose={() => setOpenConfirmReject(false)}
                             open={openConfirmReject}
                             textContent={`¿Deseás obtener un usuario LUC y mantener la información de la empresa?`}
                             textClose={'No'}
                             onReject={handleRejectKeepCompany}
                             textConfirm={'Si'}
                             onConfirm={handleConfirmReject}
                />
            </SignupResponsibleStepperFormContext.Provider>
        </Box>
    )
}


export default SignupResponsibleStepperForm