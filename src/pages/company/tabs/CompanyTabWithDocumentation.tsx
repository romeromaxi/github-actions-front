import React, {ElementType, ReactElement, useState} from "react";
import {INavTab} from "../../../components/navs/NavsTab";
import {BaseIconWrapper, WrapperIcons} from "../../../components/icons/Icons";
import {FolderSimple} from "phosphor-react";
import {Box, Card, CardContent, Stack, Tab, Tabs, Typography} from "@mui/material";
import {TypographyBase} from "../../../components/misc/TypographyBase";


interface CompanyTabWithDocumentationProps {
    title?: string,
    header?: ReactElement,
    icon?: ElementType,
    dataTab: INavTab,
    docsComponent: ReactElement
}


const CompanyTabWithDocumentation = ({title, icon, header, dataTab, docsComponent} : CompanyTabWithDocumentationProps) => {
    const [activeTab, setActiveTab] = useState<number>(0);
    
    const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
        setActiveTab(newValue);
    };
    
    return (
        <Stack spacing={1.5}>
            <Card>
                <CardContent sx={{ paddingBottom: '16px !important' }}>
                    <Stack 
                        direction={'row'} 
                        justifyContent={'space-between'} 
                        alignItems={'center'}
                    >
                        {header ? header :
                            <Stack direction={'row'} alignItems={'center'} spacing={2}>
                                {icon && <BaseIconWrapper Icon={icon} size={'md'} bg={'#F7FAFC'}/>}
                                <TypographyBase variant={'h5'}>{title}</TypographyBase>
                            </Stack>
                        }
                        
                        <Tabs 
                            value={activeTab} 
                            onChange={handleTabChange}
                            sx={{
                                minHeight: 'auto',
                                '& .MuiTab-root': {
                                    minHeight: 'auto',
                                    paddingY: 1.5,
                                    textTransform: 'none',
                                    fontSize: 14,
                                    fontWeight: 500
                                },
                                '& .MuiTabs-indicator': {
                                    backgroundColor: 'primary.main'
                                }
                            }}
                        >
                            <Tab 
                                label={dataTab.label}
                                icon={dataTab.icon as ReactElement}
                                iconPosition={dataTab.iconPosition || 'start'}
                                sx={{ gap: 1 }}
                            />
                            <Tab 
                                label="Documentación asociada"
                                icon={<WrapperIcons Icon={FolderSimple} size={'sm'} />}
                                iconPosition="start"
                                sx={{ gap: 1 }}
                            />
                        </Tabs>
                    </Stack>
                </CardContent>
            </Card>
            
            <Box>
                {activeTab === 0 && dataTab.content}
                {activeTab === 1 && docsComponent}
            </Box>
        </Stack>
    )
}


export default CompanyTabWithDocumentation