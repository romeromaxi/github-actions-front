import { Card, CardContent, Stack, Box } from '@mui/material';
import {CompanyLogoById} from "pages/company/components/CompanyLogo";
import {PendingActionFields, PendingActionView} from "types/actions/actionData";
import { PersonTypes } from 'types/person/personEnums';
import {TypographyBase} from "./TypographyBase";
import {PendingActionContent} from "./PendingActionContent";

interface PendingActionItemProps {
    action: PendingActionView;
    onReload: () => void;
    showCompanyInfo?: boolean;
    variant?: 'card' | 'box';
    size?: 'small' | 'medium' | 'large';
}

export const PendingActionItem: React.FC<PendingActionItemProps> = ({ 
    action, 
    onReload, 
    showCompanyInfo = true,
    variant = 'card',
    size = 'medium'
}) => {
    const content = (
        <Stack direction={{ xs: 'column', md: "row" }} 
               spacing={2} 
               alignItems="center"
               pl={2}
               py={{ xs: 2, md: 0 }}
        >
            {showCompanyInfo && (
                <>
                    <Stack 
                        direction="row" 
                        spacing={1.5} 
                        alignItems="center"
                        justifyContent={{ xs: 'center', md: 'start' }}
                        sx={{ 
                            width: { xs: '100%', sm: '80%', md: '220px' },
                            height: { xs: 'auto', md: '-webkit-fill-available' },
                            overflow: 'hidden', 
                            minWidth: { xs: 'auto', md: '220px' },
                            maxWidth: { xs: 'auto', md: '220px' },
                            borderRight: { xs: 'none', md: '1px solid #ECECEC' },
                            paddingRight: { xs: 'auto', md: '15px' }
                        }}
                    >
                        <CompanyLogoById 
                            companyId={action[PendingActionFields.CompanyId]}
                            isPhysicalPerson={action[PendingActionFields.CompanyPersonTypeCode] === PersonTypes.Physical}
                            size="sm"
                        />
                        <TypographyBase 
                            variant="button2" 
                            fontWeight={600}
                            tooltip
                            maxLines={2}
                        >
                            {action[PendingActionFields.CompanyBusinessName]}
                        </TypographyBase>
                    </Stack>
                </>
            )}

            <PendingActionContent action={action} size={size} onReload={onReload} />
        </Stack>
    );

    if (variant === 'box') {
        return (
            <Box
                sx={{
                    border: '1px solid #ECECEC',
                    borderRadius: '16px',
                }}
            >
                {content}
            </Box>
        );
    }

    return (
        <Card 
            sx={{ 
                '&:hover': {
                    boxShadow: 3,
                },
                transition: 'box-shadow 0.3s ease',
                borderRadius: '16px',
                p: '0px'
            }}
        >
            <CardContent>
                {content}
            </CardContent>
        </Card>
    );
};

