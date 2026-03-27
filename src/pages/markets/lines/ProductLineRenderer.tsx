import { ProductLineView } from "types/lines/productLineData";
import {useUser} from "../../../hooks/contexts/UserContext";
import {Box, Button, Collapse, Grid, Stack, useMediaQuery, useTheme} from "@mui/material";
import React, {useMemo, useState} from "react";
import {arrayChunks} from "../../../util/helpers";
import ProductLineCarousel from "./components/ProductLineCarousel";
import ProductLineCard from "./components/ProductLineCard";
import BlurredLoginGate from "../../user/components/BlurredLoginGate";
import ProductLineCardLoading from "./components/ProductLineCardLoading";
import {TypographyBase} from "../../../components/misc/TypographyBase";

const initialRowsToShow = 1;
const mobileCarouselBreakpoints = {
    "0": { slidesPerView: 1.2, spaceBetween: 10 },
    "400": { slidesPerView: 1.5, spaceBetween: 15 },
    "600": { slidesPerView: 2.2, spaceBetween: 15 },
    "800": { slidesPerView: 2.5, spaceBetween: 20 },
};

interface ProductLineRendererProps {
    lines?: ProductLineView[],
    title?: string,
    showOnlyFirstLine?: boolean,
    showBlurredLogin?: boolean,
    id?: string,
    actions?: React.ReactElement,
    minPadding?: boolean
}

function ProductLineRenderer({ lines, title, showOnlyFirstLine, showBlurredLogin, id, actions, minPadding }: ProductLineRendererProps) {
    const { isLoggedIn } = useUser();
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('md'));
    const isMdUp = useMediaQuery(theme.breakpoints.up('md'));
    const isXlUp = useMediaQuery(theme.breakpoints.up(1240));

    const [expanded, setExpanded] = useState<boolean>(!isLoggedIn);

    const itemsPerRow = useMemo(() => isXlUp ? 4 : isMdUp ? 3 : 0, [isXlUp, isMdUp]);

    const balancedItemsPerRow = useMemo(() => {
        if (!lines) return 12;
                
        const total = lines.length;
        
        if (showOnlyFirstLine)
            return (total < itemsPerRow && total >= itemsPerRow - 1) ? total : itemsPerRow;
            //return (total < itemsPerRow) ? total : itemsPerRow;

        if (total > itemsPerRow * 2) return itemsPerRow;
        if (total <= itemsPerRow) return itemsPerRow;

        const perRow = Math.ceil(total / 2);

        return perRow < itemsPerRow ? perRow : itemsPerRow;
    }, [lines, itemsPerRow, showOnlyFirstLine]);

    const rows = useMemo(() => (
        (lines && balancedItemsPerRow) ? arrayChunks(lines, balancedItemsPerRow) : []
    ), [lines, balancedItemsPerRow]);

    const total = useMemo(() => lines?.length || 0, [lines]);
    const initialVisibleCount = useMemo(() => {
        if (!lines) return 4;

        const total = lines.length;

        const initial = itemsPerRow * initialRowsToShow;
        
        if ((total <= itemsPerRow * 2) && (!showOnlyFirstLine)) {
            const half = Math.ceil(total / 2);

            if (half < itemsPerRow && total - half <= itemsPerRow) {
                return half;
            }
        }

        return initial;
    }, [lines, itemsPerRow, showOnlyFirstLine]);

    const hiddenCount = Math.max(0, total - initialVisibleCount);
    const toggle = () => setExpanded((s) => !s);

    return (
        <Box id={id} 
             sx={{
                minHeight: '100% !important',
                maxHeight: '100% !important',
                maxWidth: 'auto',
                backgroundColor: 'transparent',
             }}
        >
            <Stack sx={minPadding ? {} : { padding: '8px 4px' }} spacing={4}>
                <Grid container>
                    <Grid item xs={12} container spacing={3}>
                        {
                            title &&
                                <Grid item xs={12}>
                                    <Stack direction={{ xs: 'column', sm: 'row' }}
                                           alignItems={{ xs: 'auto', sm: 'center' }}
                                           justifyContent={'space-between'}
                                    >
                                        <TypographyBase variant={'h4'}>
                                            {title}
                                        </TypographyBase>
    
                                        { !!actions && actions }
                                    </Stack>
                                </Grid>
                        }
                        
                        {
                            lines ?
                                lines.length !== 0 ?
                                    <Grid item xs={12}>
                                        <BlurredLoginGate visible={!isLoggedIn && !!showBlurredLogin}
                                                          minBlurred
                                        >
                                            <Grid container spacing={3}>
                                                {
                                                    isMobile ?
                                                        <Grid container item xs={12}>
                                                            <ProductLineCarousel
                                                                productLines={lines}
                                                                breakpoints={mobileCarouselBreakpoints}
                                                                loop
                                                            />
                                                        </Grid>
                                                        :
                                                        <Grid item xs={12}>
                                                            <Grid container spacing={3}>
                                                                {rows[0].map((p) => (
                                                                    <Grid item key={p.id} xs={12} sm={6} md={Math.floor(12 / balancedItemsPerRow)}>
                                                                        <ProductLineCard productLine={p}
                                                                                         onReload={() => { }}
                                                                                         fromLanding
                                                                        />
                                                                    </Grid>
                                                                ))}
        
                                                                {rows.slice(1).map((row, idx) => (
                                                                    <Grid item xs={12} key={`row-${idx + 1}`}>
                                                                        <Collapse in={expanded}
                                                                                  timeout={{ appear: 350, enter: 350, exit: 250 }}
                                                                                  unmountOnExit={false}
                                                                        >
                                                                            <Grid container spacing={3}>
                                                                                {row.map((p) => (
                                                                                    <Grid item key={p.id} xs={12} sm={6} md={Math.floor(12 / balancedItemsPerRow)}>
                                                                                        <ProductLineCard productLine={p}
                                                                                                         onReload={() => { }}
                                                                                                         fromLanding
                                                                                        />
                                                                                    </Grid>
                                                                                ))}
                                                                            </Grid>
                                                                        </Collapse>
                                                                    </Grid>
                                                                ))}
        
                                                                {
                                                                    (hiddenCount > 0 && isLoggedIn && !showOnlyFirstLine) && (
                                                                        <Grid item xs={12} justifyItems={'center'}>
                                                                            <Button onClick={toggle}
                                                                                    variant="text"
                                                                            >
                                                                                {expanded ? 'Ver menos' : `Ver ${hiddenCount} más`}
                                                                            </Button>
                                                                        </Grid>
                                                                    )
                                                                }
                                                            </Grid>
                                                        </Grid>
                                                }
                                            </Grid>
                                        </BlurredLoginGate> 
                                    </Grid>
                                    :
                                    <></>
                                :
                                isMobile ?
                                    <ProductLineCarousel productLines={undefined} breakpoints={mobileCarouselBreakpoints} />
                                    :
                                    Array.from({ length: itemsPerRow }).map((_, idx) => (
                                        <Grid item xl={3} md={Math.floor(12 / (itemsPerRow || 1))} pr={3} pb={3} key={`gridLoadingSelectedProductLineCard_${idx}`}>
                                            <ProductLineCardLoading />
                                        </Grid>
                                    ))
                        }
                    </Grid>
                </Grid>
            </Stack>
        </Box>
    );
}

export default ProductLineRenderer;