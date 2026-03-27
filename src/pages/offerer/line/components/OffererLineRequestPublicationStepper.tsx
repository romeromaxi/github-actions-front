
import React, { useState, ReactNode } from 'react';
import {
    Box,
    Button,
    Typography,
    Stack,
    styled,
    Paper,
    Divider
} from '@mui/material';
import {
    ArrowBack as ArrowBackIcon,
    ArrowForward as ArrowForwardIcon,
    Check as CheckIcon
} from '@mui/icons-material';
import {SendButton} from "../../../../components/buttons/Buttons";

interface StepContent {
    label: string;
    content: ReactNode;
}

interface OffererLineRequestPublicationStepperProps {
    steps: StepContent[]
}

const StepNumber = styled(Box, {
    shouldForwardProp: (prop) => prop !== 'active' && prop !== 'completed'
})<{
    active?: boolean;
    completed?: boolean;
}>(({ theme, active, completed }) => ({
    width: '32px',
    height: '32px',
    borderRadius: '50%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    color: completed ? theme.palette.common.white : active ? theme.palette.common.white : theme.palette.text.primary,
    backgroundColor: completed ? theme.palette.success.main : active ? theme.palette.primary.main : theme.palette.grey[200],
    fontWeight: 600,
    transition: 'all 0.3s ease'
}));

const StepContainer = styled(Box)(({ theme }) => ({
    padding: theme.spacing(2),
    marginBottom: theme.spacing(1),
}));

const OffererLineRequestPublicationStepper: React.FC<OffererLineRequestPublicationStepperProps> = ({ steps }) => {
    const [activeStep, setActiveStep] = useState<number>(0);
    const isLastStep = activeStep === steps.length - 1;
    const isFirstStep = activeStep === 0
    const handleNext = () => {
        setActiveStep((prevStep) => prevStep + 1);
    };

    const handleBack = () => {
        setActiveStep((prevStep) => prevStep - 1);
    };

    return (
        <Box sx={{ width: '100%' }}>
            <Paper elevation={0} sx={{ mb: 2, p: 2, bgcolor: 'background.default' }}>
                {steps.map((step, index) => (
                    <Stack
                        key={index}
                        direction="row"
                        alignItems="center"
                        spacing={2}
                        sx={{
                            mb: index !== steps.length - 1 ? 1 : 0,
                            opacity: index < activeStep ? 0.7 : 1
                        }}
                    >
                        <StepNumber
                            active={index === activeStep}
                            completed={index < activeStep}
                        >
                            {index < activeStep ? <CheckIcon fontSize="small" /> : index + 1}
                        </StepNumber>
                        <Typography
                            variant="body2"
                            fontWeight={index === activeStep ? 600 : 400}
                            color={index === activeStep ? 'primary' : 'textPrimary'}
                        >
                            {step.label}
                        </Typography>
                    </Stack>
                ))}
            </Paper>

            <Divider sx={{ mb: 2 }} />

            <StepContainer>
                {steps[activeStep].content}
            </StepContainer>

            <Stack direction="row"
                   spacing={2}
                   justifyContent="space-between"
                   position={'absolute'}
                   bottom={2}
                   width={'92%'}
                   alignItems='center'
                   sx={{
                       padding: '8px'
                   }}
            >
                {
                    !isFirstStep &&
                    <Button
                        variant='outlined'
                        size='small'
                        startIcon={<ArrowBackIcon />}
                        onClick={handleBack}
                    >
                        Atrás
                    </Button>
                }
                {
                    isLastStep &&
                    <SendButton variant='contained' type='submit'
                                form="line-publication-form"
                                size='small'
                    >
                        Publicar línea
                    </SendButton>
                }
                {
                    !isLastStep &&
                    <Button
                        variant="contained"
                        size='small'
                        endIcon={<ArrowForwardIcon />}
                        onClick={handleNext}
                        fullWidth={isFirstStep}
                    >
                        Siguiente
                    </Button>
                }
            </Stack>
        </Box>
    );
};

export default OffererLineRequestPublicationStepper;