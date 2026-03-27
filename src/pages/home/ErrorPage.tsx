import { FC, startTransition } from "react";
import { Container, Stack, Box, Typography, Button } from "@mui/material";
import ErrorOutlineRoundedIcon from '@mui/icons-material/ErrorOutlineRounded';
import { LoggerService, LogLevels } from "../../http/logger/httpLogger";

interface ErrorPageProps {
    error: Error;
    resetErrorBoundary: () => void;
}

const handleError = (error: Error): void => {
    console.error("Ocurrió el error: ", error);

    LoggerService.log({
        level: LogLevels.Error,
        detail: 'Frontend error: ' + (error.stack || "Stack trace del error no disponible"),
    });
};

const ErrorPage: FC<ErrorPageProps> = ({ error, resetErrorBoundary }) => {
    handleError(error);

    const handleReset = () => {
        startTransition(() => {
            window.location.href = '/';
        });
    }
    
    return (
        <Container
            maxWidth="sm"
            sx={{
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                alignItems: "center",
                height: "100vh",
                textAlign: "center",
            }}
        >
            <Stack spacing={6} alignItems="center">
                <Box
                    sx={{
                        width: 100,
                        height: 100,
                        borderRadius: "50%",
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                    }}
                >
                    <ErrorOutlineRoundedIcon sx={{ fontSize: 160 }} color={'error'}/>
                </Box>
                <Stack spacing={1} alignItems="center">
                    <Typography variant="h3">Ocurrió un error</Typography>
                    <Typography variant="h5" color="text.secondary">
                        Estamos trabajando en ello
                    </Typography>
                </Stack>

                <Button variant="contained" color="primary" onClick={handleReset}>
                    Volver al inicio
                </Button>
            </Stack>
        </Container>
    );
};

export default ErrorPage;
