import {themeColorDefinition} from "../../../../../util/themes/definitions";
import {Box, Stack, Tooltip} from "@mui/material";
import {TypographyBase} from "../../../../../components/misc/TypographyBase";
import {WrapperIcons} from "../../../../../components/icons/Icons";
import {CaretRight} from "phosphor-react";
import React from "react";

interface FinancialStatementIAOptionButtonProps {
    logoUrl: string,
    title: string,
    description: string,
    onClick: () => void,
    disabled?: boolean
}

function FinancialStatementIAOptionButton({ logoUrl, title, description, onClick, disabled }: FinancialStatementIAOptionButtonProps) {
    const cursor: string = disabled ? 'not-allowed' : 'pointer';
    
    return (
        <Tooltip title={disabled ? "Próximamente..." : ""}>
            <Box sx={{
                boxShadow: `inset 0 0 0 1px ${themeColorDefinition.UIElements.borders.primary}`,
                borderRadius: '16px',
                padding: '16px',
                cursor: cursor,
                transition: 'box-shadow 200ms ease, transform 200ms ease',
                opacity: !disabled ? 1 : 0.3,
                '& *': {
                    cursor: `${cursor} !important`,
                },
                '&:hover': {
                    boxShadow: `inset 0 0 0 1px ${themeColorDefinition.UIElements.borders.primary}, 0px 8px 20px rgba(0,0,0,0.12)`
                }
            }} onClick={!disabled ? onClick : undefined}>
                <Stack direction="row" justifyContent="space-between" alignItems="center">
                    <Stack direction="row" alignItems="center" spacing={2}>
                        {/*<Box component="img" src={logoUrl} />*/}
                        <Stack spacing={0.25}>
                            <TypographyBase variant={'button2'} fontWeight={600}>
                                {title}
                            </TypographyBase>
                            <TypographyBase variant={'button3'} fontWeight={400} color="text.lighter">
                                {description}
                            </TypographyBase>
                        </Stack>
                    </Stack>
                    <WrapperIcons Icon={CaretRight} size="md" />
                </Stack>
            </Box>
        </Tooltip>
    )
}

export default FinancialStatementIAOptionButton;