import * as React from 'react';
import {useState} from 'react';
import {Stack, useTheme, useMediaQuery} from '@mui/material';
import HomeHeaderDashboard from './components/HomeHeaderDashboard';
import HomeSolicitationsReview from './components/HomeSolicitationsReview';
import HomePublishedLines from './components/HomePublishedLines';
import HomeSuggestedActions from './components/HomeSuggestedActions';

function HomeOfferer() {
    const [publishedLinesCount, setPublishedLinesCount] = useState<number>(-1);
    const theme = useTheme();
    const isSmallScreen = useMediaQuery(theme.breakpoints.down('md'));

    return (
        <Stack spacing={{xs: 3, md: 4}} width="100%">
            <HomeHeaderDashboard />
            
            <HomeSolicitationsReview />

            <Stack direction={isSmallScreen ? 'column' : 'row'} spacing={{xs: 3, md: 4}} width="100%">
                <Stack flex={isSmallScreen ? 1 : '1 1 50%'} width={isSmallScreen ? '100%' : 'auto'}>
                    <HomePublishedLines onLinesLoaded={setPublishedLinesCount} />
                </Stack>
                <Stack flex={isSmallScreen ? 1 : '1 1 50%'} width={isSmallScreen ? '100%' : 'auto'}>
                    <HomeSuggestedActions publishedLinesCount={publishedLinesCount} />
                </Stack>
            </Stack>
        </Stack>
    );
}

export default HomeOfferer;
