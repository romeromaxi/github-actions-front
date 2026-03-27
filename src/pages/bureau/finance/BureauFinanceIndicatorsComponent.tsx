import React from "react";
import {Alert, Skeleton} from "@mui/lab";
import {useTheme} from "@mui/material/styles";
import {Box, Button, Stack, useMediaQuery} from "@mui/material";
import {TypographyBase} from "components/misc/TypographyBase";
import ColouredBoxWithData from "components/misc/ColouredBoxWithData";
import {numberFormatter} from "util/formatters/numberFormatter";
import {themeColorDefinition} from "util/themes/definitions";
import {WrapperIcons} from "components/icons/Icons";
import {InfoIcon, LightbulbIcon} from "lucide-react";

interface BureauFinanceIndicatorsComponentProps {
    title: string,
    description: string,
    direction?: 'row' | 'column',
    value?: number,
    loading?: boolean,
    tooltipTitle?: string,
    helperText?: React.ReactElement,
    onClick?: () => void
}

function BureauFinanceIndicatorsComponent({
    title, description, value, loading, tooltipTitle, helperText, direction = 'column', onClick
}: BureauFinanceIndicatorsComponentProps) {
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('md'));
    
    const HelperComponent = () =>
        !!helperText ?
            <Alert severity={'accent'}
                   role={'text'}
                   variant={'filled'}
                   size={'small'}
                   icon={<LightbulbIcon />}>
                {helperText}
            </Alert>
            :
            <React.Fragment />;
            
    return (
        <Stack spacing={2}>
            <Stack direction={{ xs: 'column', md: direction }}
                   spacing={2}
            >
                <Stack spacing={1}
                       width={(!isMobile && direction === 'row') ? '51.66%' : '100%'}
                >
                    <Stack direction={'row'} justifyContent={'space-between'}>
                        <Stack direction={'row'} 
                               alignItems={'center'}
                               spacing={1}>
                            <TypographyBase variant={'h5'}>
                                {title}
                            </TypographyBase>
    
                            {
                                !!tooltipTitle &&
                                    <WrapperIcons Icon={InfoIcon}
                                                  size={'sm'}
                                                  color={themeColorDefinition.UIElements.texts.lighter}
                                                  tooltip={tooltipTitle}
                                    />
                            }
                            
                        </Stack>
    
                        {
                            onClick &&
                                <Button variant={'text'}
                                        size={'small'}
                                        minPadding
                                >
                                    Saber más
                                </Button>
                        }
                    </Stack>
    
                    <TypographyBase variant={'body3'} color={'text.lighter'}>
                        {description}
                    </TypographyBase>
                </Stack>
                
                <Box width={(!isMobile && direction === 'row') ? '48.34%' : '100%'}>
                    <ColouredBoxWithData value={value ? numberFormatter.toStringWithDecimals(value) : '-'}
                                         color={'#5B6560'}
                                         bgcolor={themeColorDefinition.UIElements.backgrounds.disabled}
                                         loading={loading}
                                         valueProps={{ variant: 'h3' }}
                                         boxProps={{
                                             padding: '16px !important',
                                             alignContent: 'center'
                                         }}
                    />
                </Box>
            </Stack>

            <HelperComponent />
        </Stack>
    )
}

interface BureauFinanceCurrencyIndicatorsComponentProps extends Omit<BureauFinanceIndicatorsComponentProps, 'direction'>{
    currency?: string
}

export function BureauFinanceCurrencyIndicatorsComponent({
    title, description, value, loading, tooltipTitle, helperText, currency = '$', onClick
}: BureauFinanceCurrencyIndicatorsComponentProps) {

    const HelperComponent = () =>
        !!helperText ?
            <Alert severity={'accent'}
                   role={'text'}
                   variant={'filled'}
                   size={'small'}
                   icon={<LightbulbIcon />}>
                {helperText}
            </Alert>
            :
            <React.Fragment />;

    return (
        <Stack spacing={1} width={'100%'}>
            <Stack direction={'row'} justifyContent={'space-between'}>
                {
                    loading ?
                        <Skeleton width={'80%'} />
                        :
                        <TypographyBase variant={'h2'}>
                            {numberFormatter.toStringWithAmount(value, currency)}
                        </TypographyBase>
                }    

                {
                    onClick &&
                    <Button variant={'text'}
                            size={'small'}
                            minPadding
                    >
                        Saber más
                    </Button>
                }
            </Stack>
            
            <Stack direction={'row'} justifyContent={'space-between'}>
                <Stack direction={'row'}
                       alignItems={'center'}
                       spacing={1}>
                    <TypographyBase variant={'h5'}>
                        {title}
                    </TypographyBase>

                    {
                        !!tooltipTitle &&
                        <WrapperIcons Icon={InfoIcon}
                                      size={'sm'}
                                      color={themeColorDefinition.UIElements.texts.lighter}
                                      tooltip={tooltipTitle}
                        />
                    }

                </Stack>

                {
                    onClick &&
                    <Button variant={'text'}
                            size={'small'}
                            minPadding
                    >
                        Saber más
                    </Button>
                }
            </Stack>

            <TypographyBase variant={'body3'} color={'text.lighter'}>
                {description}
            </TypographyBase>
            
            <HelperComponent />
        </Stack>
    )
}

export default BureauFinanceIndicatorsComponent;