import React, {useContext, useEffect, useState} from 'react';
import {Stack, Typography, Box, Card, Button, useTheme, useMediaQuery} from '@mui/material';
import {TypographyBase} from 'components/misc/TypographyBase';
import {OffererContext} from '../../components/OffererContextProvider';
import {HttpOffererProductLine} from 'http/index';
import {
    EntityListWithPagination,
    EntityListWithPaginationFields,
    EntityPaginationFields,
    EntityWithIdFields
} from 'types/baseEntities';
import {
    ProductLineOffererFilterFields,
    ProductLineViewSummaryWithPublicationData,
    ProductLineFields
} from 'types/lines/productLineData';
import {ProductLineStatesType} from 'types/lines/productLineEnums';
import {useNavigate} from 'react-router-dom';
import {Skeleton} from '@mui/lab';
import {StoreIcon} from "lucide-react";
import {WrapperIcons} from "components/icons/Icons";

interface HomePublishedLinesProps {
    onLinesLoaded: (count: number) => void;
}

function LineCard({line}: { line: ProductLineViewSummaryWithPublicationData }) {
    return (
        <Card sx={{p: 2, borderRadius: 2, display: 'flex', alignItems: 'center', gap: 2}}>
            <Box sx={{
                borderRadius: '8.75px',
                backgroundColor: '#E1F3D6',
                width: 42,
                height: 42,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
            }}>
                <WrapperIcons Icon={StoreIcon} size={'md'} color={'#5A9437'}/>
            </Box>
            <Stack flex={1} overflow="hidden">
                <TypographyBase variant="body3" color="text.secondary" noWrap>
                    {line[ProductLineFields.ProductDesc]}
                </TypographyBase>
                <TypographyBase variant="h6" noWrap>
                    {line[ProductLineFields.Line]}
                </TypographyBase>
            </Stack>
            <Stack alignItems="flex-end" sx={{minWidth: 'max-content'}}>
                <TypographyBase variant="body3" color="text.lighter">
                    Estado
                </TypographyBase>
                <Typography variant="body2" color="success.main" fontWeight={600}>
                    {line[ProductLineFields.ProductLineStatusDesc] || 'En la Tienda'}
                </Typography>
            </Stack>
        </Card>
    );
}

function HomePublishedLines({onLinesLoaded}: HomePublishedLinesProps) {
    const offerer = useContext(OffererContext);
    const navigate = useNavigate();
    const theme = useTheme();
    const isSmallScreen = useMediaQuery(theme.breakpoints.down('sm'));
    const [loading, setLoading] = useState(true);
    const [lines, setLines] = useState<ProductLineViewSummaryWithPublicationData[]>([]);
    const [totalLines, setTotalLines] = useState(0);

    useEffect(() => {
        setLoading(true);
        HttpOffererProductLine.getListByOffererId(offerer[EntityWithIdFields.Id], {
            [ProductLineOffererFilterFields.LineStateCods]: [ProductLineStatesType.Published]
        })
            .then((res: EntityListWithPagination<ProductLineViewSummaryWithPublicationData>) => {
                const list = res[EntityListWithPaginationFields.List] || [];
                setTotalLines(res[EntityListWithPaginationFields.Pagination]?.[EntityPaginationFields.CantRecords] || list.length);
                setLines(list.slice(0, 5)); // show up to 5
                onLinesLoaded(res[EntityListWithPaginationFields.Pagination]?.[EntityPaginationFields.CantRecords] || list.length);
            })
            .finally(() => setLoading(false));
    }, [offerer[EntityWithIdFields.Id], onLinesLoaded]);

    if (!loading && lines.length === 0) {
        return null;
    }

    return (
        <Stack spacing={3} width="100%">
            <Stack direction={isSmallScreen ? 'column' : 'row'} justifyContent="space-between"
                   alignItems={isSmallScreen ? 'flex-start' : 'center'} spacing={isSmallScreen ? 2 : 0}>
                <TypographyBase variant="h4" fontWeight={600}>
                    Líneas publicadas
                </TypographyBase>
                <Button
                    variant="text"
                    color="primary"
                    onClick={() => navigate('/offerer/lines')}
                    minPadding
                >
                    Ver todas
                </Button>
            </Stack>

            <Stack spacing={3}>
                {loading ? (
                    Array.from(new Array(3)).map((_, i) => <Skeleton key={i} variant="rectangular" height={80}
                                                                     sx={{borderRadius: 2}}/>)
                ) : (
                    lines.map(line => (
                        <LineCard key={line[EntityWithIdFields.Id]} line={line}/>
                    ))
                )}
            </Stack>
        </Stack>
    );
}

export default HomePublishedLines;
