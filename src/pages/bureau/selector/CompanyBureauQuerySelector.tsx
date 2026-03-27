import React, {useContext, useMemo, useState} from "react";
import clsx from 'clsx';
import {BureauInformationContext} from "hooks/contexts/BureauInformationContext";
import {Box, Stack} from "@mui/material";
import CompanyBureauQuerySelectorStyles from "./CompanyBureauQuerySelector.styles";
import {TypographyBase} from "components/misc/TypographyBase";
import {ChevronRightIcon} from "lucide-react";
import {WrapperIcons} from "components/icons/Icons";
import CompanyBureauQuerySelectorDialog from "./CompanyBureauQuerySelectorDialog";
import {NosisQueryFields} from "types/nosis/nosisData";

interface CompanyBureauQuerySelectorProps {
    companyId?: number
}

function CompanyBureauQuerySelector({ companyId }: CompanyBureauQuerySelectorProps) {
    const classes = CompanyBureauQuerySelectorStyles();
    const {options, optionSelected, selectedQueryId, setSelectedQueryId} = useContext(BureauInformationContext);
    
    const [openSelectorDialog, setOpenSelectorDialog] = useState<boolean>(false);
    
    const titleButton = useMemo(() => {
        if (!options || options.length <= 1) return '';

        if (optionSelected && !optionSelected[NosisQueryFields.IsDefaultPerson])
            return 'Estás viendo la información de ';
        
        const quantity: number = options.length - 1;
        const plural: string = quantity > 1 ? 's' : '';
        
        return `Hay ${quantity} persona${plural} relacionada${plural}`
    }, [options, optionSelected]);
    
    const descriptionButton = useMemo(() => {
        if (optionSelected && !optionSelected[NosisQueryFields.IsDefaultPerson])
            return optionSelected[NosisQueryFields.BusinessName]
        
        return 'Cambiar visualización'
    }, [optionSelected])
    
    const showSelectorDialog = () => setOpenSelectorDialog(true);

    const closeSelectorDialog = () => setOpenSelectorDialog(false);
    
    const onSelectNewNosisQuery = (queryId: number) => {
        setSelectedQueryId(queryId);
        setOpenSelectorDialog(false);
    }
    
    if (!options || options.length <= 1) 
        return null
    
    return (
        <React.Fragment>        
            <Box className={clsx(classes.rootContainer, {
                    [classes.containerSelected]: !!optionSelected && !optionSelected[NosisQueryFields.IsDefaultPerson]
                 })} 
                 onClick={showSelectorDialog}
            >
                <Stack direction={'row'} 
                       alignItems={'center'}
                       justifyContent={'space-between'}
                >
                    <Stack direction={'column'} spacing={0.25}>
                        <TypographyBase variant={'body2'}>
                            {titleButton}
                        </TypographyBase>
                        <TypographyBase variant={'button1'} color={'primary'}>
                            {descriptionButton}
                        </TypographyBase>
                    </Stack>
                    
                    <WrapperIcons Icon={ChevronRightIcon} size={'md'} />
                </Stack>
            </Box>
            
            <CompanyBureauQuerySelectorDialog open={openSelectorDialog}
                                              companyId={companyId}
                                              options={options}
                                              onClose={closeSelectorDialog}
                                              onSubmit={onSelectNewNosisQuery}
                                              defaultValue={selectedQueryId}
            />
        </React.Fragment>
    )
}

export default CompanyBureauQuerySelector;