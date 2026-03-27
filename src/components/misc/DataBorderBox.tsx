import React from 'react';
import {Box, Stack, Skeleton} from '@mui/material';
import {TypographyBase} from "./TypographyBase";
import {ButtonIconDropdown, MenuItemDropdown} from "../buttons/Buttons";

interface DataBorderBoxProps {
    icon?: React.ReactNode;
    title: string;
    subtitle?: string;
    description?: string;
    items?: MenuItemDropdown[];
    loading?: boolean;
}

const DataBorderBox = ({
    icon,
    title,
    subtitle,
    description,
    items,
    loading = false,
}: DataBorderBoxProps) => {
    return (
        <Box
            sx={{
                width: '100%',
                border: '1px solid #BFBFBF',
                borderRadius: 4,
                padding: 2,
                display: 'flex',
                flexDirection: 'column',
                gap: 1.5,
            }}
        >
            <Stack direction="row" spacing={2} alignItems='flex-start'>
                {loading ? (
                    <Skeleton variant="circular" width={32} height={32} sx={{ pt: 0.75 }} />
                ) : (
                    icon && <Box sx={{display: 'flex', alignItems: 'center', pt: 0.75}}>{icon}</Box>
                )}
                <Stack spacing={0.5} width={1}>
                    <Stack direction="row" alignItems="center" justifyContent="space-between">
                        <Stack spacing={0.5} width={1}>
                            <Stack direction="row" alignItems="baseline" spacing={1}>
                                {loading ? (
                                    <Skeleton variant="text" width={120} height={24} />
                                ) : (
                                    <TypographyBase variant="body2" fontWeight={600} color="text.primary">
                                        {title}
                                    </TypographyBase>
                                )}
                                {loading ? (
                                    <Skeleton variant="text" width={80} height={20} />
                                ) : (
                                    subtitle && (
                                        <TypographyBase variant="body3" color="text.lighter">
                                            {subtitle}
                                        </TypographyBase>
                                    )
                                )}
                            </Stack>

                            <Box sx={{width: '70%', overflow: 'hidden'}}>
                                {loading ? (
                                    <Skeleton variant="text" width="100%" height={20} />
                                ) : (
                                    description && (
                                        <TypographyBase variant="body3" color="text.lighter" maxLines={1} tooltip>
                                            {description}
                                        </TypographyBase>
                                    )
                                )}
                            </Box>
                        </Stack>
                        {loading ? (
                            <Skeleton variant="rectangular" width={32} height={32} />
                        ) : (
                            items && items.length > 0 && (
                                <ButtonIconDropdown items={items} label='' />
                            )
                        )}
                    </Stack>
                </Stack>
            </Stack>
        </Box>
    );
};

export default DataBorderBox;
