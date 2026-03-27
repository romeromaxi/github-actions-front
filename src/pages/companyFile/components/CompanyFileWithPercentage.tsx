import {Button, Stack, useMediaQuery, useTheme} from "@mui/material";
import {WrapperIcons} from "components/icons/Icons";
import {Eye, PencilSimpleLine, WarningCircle} from "phosphor-react";
import {TypographyBase} from "components/misc/TypographyBase";
import {LinearProgressNew} from "components/misc/LinearProgressWithLabel";
import { CheckCircle } from "@phosphor-icons/react";

interface CompanyFileWithPercentageProps {
    percentage: number,
    goto?: () => void,
    hideTitle?: boolean,
    description?: string,
    columnPerc?: boolean
    completeHeaderLabel?: string,
    incompleteHeaderLabel?: string,
    titleOnly?: boolean,
}

const CompanyFileWithPercentage = ({percentage, goto, hideTitle, description, columnPerc, completeHeaderLabel, incompleteHeaderLabel, titleOnly} : CompanyFileWithPercentageProps) => {
    const theme = useTheme();
    const isMobileScreenSize = useMediaQuery(theme.breakpoints.down('sm'));
    const isComplete = percentage >= 100;
    const handleClick = (e: any) => {
        e.stopPropagation();
        goto && goto();
    }
    
    titleOnly = true;

    return (
        <Stack 
            sx={{
                cursor: goto && !hideTitle ? 'pointer' : 'default', 
                padding: !hideTitle ? '10px 0px' : '10px 16px', 
                backgroundColor: 'transparent', 
                border: 'none', 
                borderColor: '#transparent', 
                borderRadius: '12px', 
                width: '100%',
                boxSizing: 'border-box',
            }}
            onClick={goto && !hideTitle ? handleClick : undefined}
        >
            {!hideTitle && (
                <Stack 
                    direction={{xs: 'column', sm: 'row'}} 
                    spacing={2} 
                    width="100%"
                    alignItems={{xs: 'center', sm: 'flex-start'}}
                >
                    {isComplete ? 
                        <CompanyFileWithPercentageBodyComplete headerLabel={completeHeaderLabel} titleOnly={titleOnly} goTo={goto} /> : 
                        <CompanyFileWithPercentageBodyIncomplete headerLabel={incompleteHeaderLabel} titleOnly={titleOnly} goTo={goto} percentage={percentage} />
                    }
                </Stack>
            )}
            
            {hideTitle && (
                <Stack 
                    direction={{xs: 'column', sm: 'row'}} 
                    alignItems={{xs: 'stretch', sm: 'center'}} 
                    spacing={2} 
                    width="100%"
                >
                    <Stack sx={{width: {xs: '100%', sm: '75%'}}}>
                        <TypographyBase variant={'label'} color={'text.lighter'} fontSize={'0.82rem'}>
                            {description}
                        </TypographyBase>
                    </Stack>
                    <Stack 
                        direction={isMobileScreenSize ? 'column' : columnPerc ? 'column' : 'row'} 
                        alignItems={isMobileScreenSize ? 'stretch' : 'center'} 
                        spacing={isMobileScreenSize || columnPerc ? 2 : 2} 
                        sx={{width: {xs: '100%', sm: '25%'}}}
                    >
                        <LinearProgressNew 
                            value={percentage} 
                        />
                        <Button 
                            onClick={goto} 
                            variant='contained' 
                            size='small'
                            fullWidth={isMobileScreenSize}
                        >
                            Ver legajo
                        </Button>
                    </Stack>
                </Stack>
            )}
        </Stack>
    )
}

const CompanyFileWithPercentageBodyComplete = ({ headerLabel, titleOnly, goTo }: { headerLabel?: string; titleOnly?: boolean; goTo?: () => void }) => {
    const theme = useTheme();
    const isMobileScreenSize = useMediaQuery(theme.breakpoints.down(740));

    return (
        <Stack
            direction={'column'}
            alignItems={isMobileScreenSize && titleOnly ? 'center' : 'flex-start'}
            justifyContent="space-between"
            sx={{ width: (isMobileScreenSize && titleOnly) ? 'auto' : (!isMobileScreenSize && titleOnly) ? 'auto' : undefined }}
        >
            <Stack direction="row" alignItems="center" justifyContent="space-between" spacing={1} sx={{ flex: 1 }}>
                <WrapperIcons Icon={CheckCircle} size={'sm'} color={'green'} />
                <TypographyBase variant={isMobileScreenSize ? 'caption' : 'label'} fontWeight={500} color={'#69b54c'}>
                    {headerLabel || (titleOnly ? 'Legajo completo' : `¡El legajo está completo!`)}
                </TypographyBase>
                {goTo && (
                <WrapperIcons Icon={Eye} size={'sm'} sx={{ ml: 2 }} />
            )}
            </Stack>
            {!titleOnly && (
                <TypographyBase variant={isMobileScreenSize ? 'caption' : 'label'}>
                    Ya podés enviar solicitudes y aprovechar las búsquedas asistidas
                </TypographyBase>
            )}
        </Stack>
    );
};

const CompanyFileWithPercentageBodyIncomplete = ({ headerLabel, titleOnly, goTo, percentage }: { headerLabel?: string; titleOnly?: boolean; goTo?: () => void, percentage: number }) => {
    const theme = useTheme();
    const isMobileScreenSize = useMediaQuery(theme.breakpoints.down(740));

    return (
        <Stack
            direction={!isMobileScreenSize && titleOnly ? 'row' : 'column'}
            alignItems={titleOnly ? 'center' : 'flex-start'}
            justifyContent="space-between"
            sx={{ width: (isMobileScreenSize && titleOnly) ? 'auto ' : (!isMobileScreenSize && titleOnly) ? 'auto' : undefined }}
        >
            <Stack direction="row" alignItems="center" spacing={1} sx={{ flex: 1 }}>
                <WrapperIcons Icon={WarningCircle} size={'sm'} />
                <TypographyBase variant={isMobileScreenSize ? 'caption' : 'label'} fontWeight={500}>
                    {headerLabel || (titleOnly ? 'Legajo incompleto' : 'Completá el legajo de contacto')}
                </TypographyBase>
            </Stack>

            <Stack
                direction={(isMobileScreenSize && !titleOnly) ? 'column' : 'row'}
                alignItems={'center'}
                spacing={2}
                ml={isMobileScreenSize ? 0 : 2}
                sx={{ width: { xs: 'auto' } }}
            >
                {!titleOnly && (
                    <TypographyBase variant={isMobileScreenSize ? 'caption' : 'label'} color={'text.lighter'}>
                        Con pocos datos más vas a poder enviar solicitudes y aprovechar las búsquedas asistidas
                    </TypographyBase>
                )}
                <LinearProgressNew
                    value={percentage}
                    sx={{
                        width: '100%',
                        padding: '0.25rem !important',
                        '& .MuiTypography-root': {
                            whiteSpace: 'nowrap',
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                        },
                    }}
                />
                {goTo && <WrapperIcons Icon={PencilSimpleLine} size={'sm'} />}
            </Stack>
            
        </Stack>
    );
};

export default CompanyFileWithPercentage;