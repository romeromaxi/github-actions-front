import React, { useState } from 'react';
import { ProductLineRequisiteDescriptionFields, ProductLineRequisiteDescriptionView } from 'types/lines/productLineData';
import { Collapse, Stack, TableCell, TableRow, Typography, useMediaQuery, useTheme } from '@mui/material';
import { typographyStyles } from './TypographyStyles';

interface ProductLineDetailRequirementsRowGroupProps {
    requisiteDescription: ProductLineRequisiteDescriptionView;
}

function ProductLineDetailRequirementsRowGroup({
    requisiteDescription,
}: ProductLineDetailRequirementsRowGroupProps) {
    const theme = useTheme();
    const isMobileScreenSize = useMediaQuery(theme.breakpoints.down("sm"));

    const [showListDetail, setShowListDetail] = useState<boolean>(false);
    const requisiteRowData = requisiteDescription[ProductLineRequisiteDescriptionFields.DetailDescription];

    const rowList = requisiteRowData.map((requisite, index) => (
        <Typography
            key={`requisiteRow_${index}`}
            sx={{
                whiteSpace: 'normal',
                wordBreak: 'break-word',
            }}
        >
            {`\u2022 ${requisite}`}
        </Typography>
    ));

    const toggleCollapse = () => setShowListDetail(!showListDetail);

    const requirementRowDetailedContent = !requisiteRowData.length ? 
        "Todos" 
        : 
            requisiteRowData.length === 1 ? 
                requisiteRowData[0] 
            : 
                <Typography
                    onClick={toggleCollapse}
                    variant={typographyStyles.variants.tableClickableValue(isMobileScreenSize)}
                    sx={{
                        ...typographyStyles.tableClickableValue,
                        fontSize: "inherit !important",
                        fontWeight: "inherit !important",
                    }}
                >
                    {`${showListDetail ? "Ocultar" : "Ver"} Detalle`}
                </Typography>
    ;

    return (
        <TableRow sx={{
            position: 'relative',
            display: 'flex',
            flexDirection: { xs: 'column', sm: 'row' },
            alignItems: 'center',
            padding: { xs: '16px 16px', sm: '0' },
        }}>
            <Typography
                variant={typographyStyles.variants.tableLabel(isMobileScreenSize)}
                sx={typographyStyles.tableLabel}
            >
                {requisiteDescription[ProductLineRequisiteDescriptionFields.Description]}
            </Typography>

            <TableCell
                align="left"
                sx={{
                    width: { xs: '100%', sm: '50%' },
                    border: 'none',
                    display: { xs: 'none', sm: 'table-cell' },
                }}
            >
                {requisiteDescription[ProductLineRequisiteDescriptionFields.Description]}
            </TableCell>


            <TableCell
                sx={{
                    width: { xs: '100%', sm: '50%' },
                    padding: { xs: '8px 0', sm: '8px 16px' },
                    border: 'none',
                }}
            >
                <Typography
                    variant={typographyStyles.variants.tableValue(isMobileScreenSize)}
                    sx={{
                        ...(typographyStyles.tableValue),
                    }}
                >
                    {requirementRowDetailedContent}
                </Typography>


                <Collapse in={showListDetail} timeout={500}>
                    <Stack spacing={0.5} pl={2} mt={0.5}>
                        {rowList}
                    </Stack>
                </Collapse>
            </TableCell>
        </TableRow>
    );
}

export default ProductLineDetailRequirementsRowGroup;