import {Box, Button, Stack} from "@mui/material";
import {TypographyBase} from "components/misc/TypographyBase";
import CompanyOptionBoxStyles from "./CompanyOptionBox.styles";

interface CompanyOptionBoxProps {
    icon: React.ReactNode;
    title: string;
    subtitle?: string;
    buttonText: string;
    onClick: () => void;
}

function CompanyOptionBox({icon, title, subtitle, buttonText, onClick}: CompanyOptionBoxProps) {
    const classes = CompanyOptionBoxStyles();

    return (
        <Box className={classes.root} onClick={onClick}>
            <Stack spacing={3} 
                   sx={{ width: '100% !important'}}
                   justifyContent={'space-between'}
                   alignContent={'space-between'}
            >
                <Stack spacing={2}>
                    {icon}
                    <Stack spacing={0.5}>
                        <TypographyBase variant={'h5'} fontWeight={600}>
                            {title}
                        </TypographyBase>
                        {subtitle && (
                            <TypographyBase variant={'body3'} color={'text.secondary'}>
                                {subtitle}
                            </TypographyBase>
                        )}
                    </Stack>
                </Stack>

                <Button variant={'contained'}
                        color={'primary'}
                        fullWidth
                        onClick={onClick}
                        size={'small'}
                >
                    {buttonText}
                </Button>
            </Stack>
        </Box>
    )
}

export default CompanyOptionBox;

