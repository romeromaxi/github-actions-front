import React from 'react';
import { Box, Card, Stack, Typography, useMediaQuery, useTheme } from '@mui/material';
import { ProceedLinesRequestButton } from 'components/buttons/Buttons';
import { ProductLineFields } from '../../../../../types/lines/productLineData';
import { CompanyFileType } from '../../../../../types/company/companyEnums';

interface FloatingCartProps {
  title: string;
  selectedLines: any[];
  onProceed: () => void;
}

const FloatingCart: React.FC<FloatingCartProps> = ({ title, selectedLines, onProceed }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const isMatcherCasfog = selectedLines.some(line => line[ProductLineFields.FileTypeCode] === CompanyFileType.MatcherCasfog);
  const isSingleSelectionExceeded = isMatcherCasfog && selectedLines.length > 1;

  return (
    <Box
      sx={{
        position: 'fixed',
        bottom: 0,
        left: 0,
        right: 0,
        backgroundColor: 'white',
        boxShadow: '0px -2px 10px rgba(0, 0, 0, 0.1)',
        zIndex: 1000,
      }}
    >
      <Card>
        <Stack 
          direction={isMobile ? 'column' : 'row'} 
          alignItems="center" 
          justifyContent="space-between" 
          spacing={2} 
          sx={{ px: 1}}
        >
          <Stack>
            <Typography variant="h6">{title}</Typography>
            <Typography variant="subtitle1" ml={1}>
              Líneas en la selección: {selectedLines.length}
            </Typography>
            {isSingleSelectionExceeded && (
              <Typography variant="subtitle1" color="error">
                Solo se puede seleccionar una línea de este tipo.
              </Typography>
            )}
          </Stack>
          <ProceedLinesRequestButton
            disabled={selectedLines.length === 0 || isSingleSelectionExceeded}
            onClick={onProceed}
            sx={{ width: isMobile ? '100%' : 'auto' }}
          />
        </Stack>
      </Card>
    </Box>
  );
};

export default FloatingCart;