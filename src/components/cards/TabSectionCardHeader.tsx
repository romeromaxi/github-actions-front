import {Box, Card, CardContent, Collapse, Stack} from "@mui/material";
import {BaseIconWrapper} from "../icons/Icons";
import {TypographyBase} from "../misc/TypographyBase";
import React, {ReactElement, ReactNode, useCallback, useMemo, useState} from "react";
import {CaretDown, CaretUp} from "@phosphor-icons/react";


interface TabSectionCardHeaderProps {
    icon: React.ElementType | string,
    sectionTitle: string;
    sectionSubheader?: string | React.ReactElement;
    actions?: ReactNode,
    children?: ReactElement | ReactElement[],
    alwaysVisible?: boolean,
    spacingChildren?: number,
    size?: 'small' | 'medium' | 'large',
    defaultCollapsed?: boolean,
}

interface SizeConfigurationBySize {
    iconSize: string,
    titleVariant: 'h3' | 'h4' | 'h5',
}

const IconSizeBySectionSize: Record<string, SizeConfigurationBySize> = {
    small: { iconSize: 'sm', titleVariant: 'h5' },
    medium: { iconSize: 'md', titleVariant: 'h4' },
    large: { iconSize: 'lg', titleVariant: 'h3' }
}


const TabSectionCardHeader = ({ size = 'medium', ...props}: TabSectionCardHeaderProps) => {
    const [isExpanded, setIsExpanded] = useState<boolean>(!props.defaultCollapsed);
    const isCollapsible = useMemo(() => !!props.children && !props.alwaysVisible, [props]);
    
    const titleVariant = useMemo(() => (IconSizeBySectionSize[size].titleVariant || 'h4'), [size]);
    const iconSize = useMemo(() => (IconSizeBySectionSize[size].iconSize || 'md'), [size]);
    
    const toggleExpanded = useCallback(() => {
        setIsExpanded(!isExpanded);
    }, [isExpanded]);
    
    const cardActions = useMemo(() => {
        if (!props.actions && !isCollapsible) {
            return null;
        }
        
        if (!isCollapsible) return props.actions;
        
        return (
            <Stack direction='row' alignItems='center' spacing={2}>
                {props.actions}

                <Box onClick={toggleExpanded} sx={{ cursor: 'pointer'}}>
                    <BaseIconWrapper Icon={isExpanded ? CaretUp : CaretDown} size={iconSize} bg={'#F7FAFC'} width={'30px'} height={'30px'} />
                </Box>
            </Stack>
        )
    }, [props.actions, isExpanded, isCollapsible])
    
    return (
        <Card sx={{ paddingBottom: (isExpanded || !isCollapsible) ? 'auto' : '0.6rem' }}>
            <CardContent>
                <Stack direction={'column'} spacing={2}>
                    <Stack direction='row' alignItems='center' justifyContent='space-between'>
                        <Stack direction={'row'} alignItems={'center'} spacing={2}>
                            <BaseIconWrapper Icon={props.icon} size={iconSize} bg={'#F7FAFC'} width={'30px'} height={'30px'} />
                            <Stack>
                                <TypographyBase variant={titleVariant} fontWeight={500}>
                                    {props.sectionTitle}
                                </TypographyBase>
                                {
                                    props.sectionSubheader &&
                                        <TypographyBase variant={'caption'} color={'text.lighter'} fontWeight={500}>
                                            {props.sectionSubheader}
                                        </TypographyBase>
                                }
                            </Stack>
                        </Stack>
                        {cardActions}
                    </Stack>
    
                    {
                        props.children &&
                            <Collapse in={isExpanded}>
                                {
                                    !!props.spacingChildren ?
                                        <Stack spacing={props.spacingChildren}>
                                            {props.children}
                                        </Stack>
                                        :
                                        props.children    
                                }
                            </Collapse>
                    }
                </Stack>
            </CardContent>
        </Card>
    )
}


export default TabSectionCardHeader