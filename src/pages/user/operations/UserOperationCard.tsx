import {Box, Stack} from "@mui/material";
import { CaretRight } from "phosphor-react";
import {WrapperIcons} from "../../../components/icons/Icons";
import {TypographyBase} from "../../../components/misc/TypographyBase";
import {themeColorDefinition} from "../../../util/themes/definitions";


interface UserOperationCardProps {
    title: string;
    description: string;
    logoUrl: string;
    onClick: () => void;
}


const UserOperationCard = ({ title, description, logoUrl, onClick }: UserOperationCardProps) => {
    return (
        <Box sx={{
            boxShadow: `inset 0 0 0 1px ${themeColorDefinition.UIElements.borders.primary}`,
            borderRadius: '16px',
            padding: '16px',
            cursor: 'pointer',
            transition: 'box-shadow 200ms ease, transform 200ms ease',
            '&:hover': {
                boxShadow: `inset 0 0 0 1px ${themeColorDefinition.UIElements.borders.primary}, 0px 8px 20px rgba(0,0,0,0.12)`
            }
        }} onClick={onClick}>
            <Stack direction="row" justifyContent="space-between" alignItems="center">
                <Stack direction="row" alignItems="center" spacing={2}>
                    <Box component="img" src={logoUrl} />
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
    )
}


export default UserOperationCard;