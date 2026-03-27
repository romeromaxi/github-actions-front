import {Stack, Theme, Tooltip, Typography, useMediaQuery} from "@mui/material";
import {stringFormatter} from "util/formatters/stringFormatter";
import CompanyLabelWithValueComponentStyles from "./CompanyLabelWithValueComponent.styles";
import clsx from "clsx";
import {WrapperIcons} from "components/icons/Icons";
import {Question} from "phosphor-react";
import {TypographyBase} from "components/misc/TypographyBase";
import { typographyStyles } from "../../../markets/lines/detail/components/TypographyStyles";
import React from "react";


interface CompanyLabelWithValueComponentProps {
    label: string,
    value: any,
    variant?: 'default' | 'disabled',
    labelHelper?: string,
    secondaryValue?: any
}
const CompanyLabelWithValueComponent = ({label, value, variant = 'default', labelHelper, secondaryValue} : CompanyLabelWithValueComponentProps) => {
    const classes = CompanyLabelWithValueComponentStyles()
    const isPending = !value;
    const isMobileScreenSize = useMediaQuery((theme: Theme) => theme.breakpoints.down('sm'));
    
    return (
        <Stack 
            sx={{ 
                padding: '24px 16px', 
                borderRadius: '16px', 
                position: isMobileScreenSize ? 'relative' : undefined,
                width: '100%',
            }}
            direction= { isMobileScreenSize ? undefined : 'row' } 
            justifyContent={ isMobileScreenSize ? undefined : 'space-between' } 
            alignItems={ isMobileScreenSize ?  undefined : 'center' } 
            className={clsx(classes[variant])}
        >
            {isMobileScreenSize && (
                <Typography 
                    sx={typographyStyles.tableLabel} 
                    variant="caption"
                >
                    {label}
                </Typography>
            )}
            <Stack direction='row' alignItems='center' spacing={1} sx={{ display: isMobileScreenSize ? 'none' : 'flex' }}>
                <Typography fontSize={16}>{label}</Typography>
                {labelHelper && (
                    <Tooltip title={labelHelper}>
                        <div style={{ marginTop: 4 }}>
                            <WrapperIcons Icon={Question} size={'sm'} />
                        </div>
                    </Tooltip>
                )}
            </Stack>
            <Stack 
                maxWidth={'100%'} 
                overflow={'auto'} 
                direction="column" 
                justifyContent="flex-end" 
                alignItems="flex-end" 
            >
                <Typography
                    variant={isPending ? 'caption' : 'label'}
                    fontWeight={500}
                    textAlign={'end'}
                    color={isPending ? 'warning.main' : undefined}
                    tooltip
                    maxLines={1}
                    sx={typographyStyles.tableValue}
                >
                    {value || 'Pendiente de carga'}
                </Typography>
                {secondaryValue && secondaryValue !== '' && (
                    <Typography 
                        variant="caption" 
                        color={'#818992'} 
                        textAlign={'end'}
                        ml={isMobileScreenSize ? 0 : 1}
                    >
                        {secondaryValue}
                    </Typography>
                )}
            </Stack>
        </Stack>
    );
}



export const CompanyLabelWithValueComponentForm = ({label, value} : CompanyLabelWithValueComponentProps) => {

    return (
        <Stack sx={{backgroundColor: '#F7FAFC', padding: '12px', borderRadius: '12px', border: '1px solid #EDF2F7'}}>
            <Typography variant={'caption'} color={'#ADADAD'}>{label}</Typography>
            {
                value.length > 84 ?
                    <Tooltip title={value}>
                        <Typography fontSize={16} variant={'caption'} color={'#ADADAD'}>{stringFormatter.cutIfHaveMoreThan(value, 84)}</Typography>
                    </Tooltip>
                    :
                    <Typography fontSize={16} variant={'caption'} color={'#ADADAD'}>{value}</Typography>
            }
        </Stack>
    )
}


export default CompanyLabelWithValueComponent