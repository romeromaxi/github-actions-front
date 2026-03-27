import React from "react";
import {Sparkle} from "@phosphor-icons/react";
import {Box, Stack, Typography} from "@mui/material";
import {WrapperIcons} from "components/icons/Icons";
import ProductLineDetailAlignedWithCompaniesStyles from "./ProductLineDetailAlignedWithCompanies.styles";

interface ProductLineDetailAlignedWithCompaniesProps {
    numberOfCompanies: number,
    description: string
}

export default function ProductLineDetailAlignedWithCompanies({ numberOfCompanies, description }: ProductLineDetailAlignedWithCompaniesProps) {
    const classes = ProductLineDetailAlignedWithCompaniesStyles();
    
    const title : string = numberOfCompanies > 1 ?
        `Alineado con ${numberOfCompanies} de tus empresas` :
        `Alineado con tu empresa` 
    
    return (
        <Box className={classes.container}>
            <Stack direction={'row'} spacing={1}>
                <WrapperIcons Icon={Sparkle} size={'md'} weight={'thin'} />

                <Stack>
                    <Typography variant={'caption'}>{title}</Typography>
                    <Typography className={classes.description} fontWeight={500}>{description}</Typography>
                </Stack>
            </Stack>
        </Box>
    )
}