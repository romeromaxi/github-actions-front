import {
  Box,
  Card,
  CardContent,
  CardHeader,
  List,
  ListItem,
  Skeleton,
  Stack,
  Typography,
} from '@mui/material';
import { Alert } from '@mui/lab';
import { DefaultStylesButton } from '../../../components/buttons/Buttons';
import { SearchRounded } from '@mui/icons-material';
import React, { useState, useEffect } from 'react';
import {
  OffererFields,
  OffererSummaryView,
} from '../../../types/offerer/offererData';
import { HttpSolicitation } from '../../../http';
import CompanyContactedOfferersDialog from './CompanyContactedOfferersDialog';

interface CompanyOffererSolicitationsSummaryProps {
  companyId: number;
}

const CompanyOffererSolicitationsSummary = ({
  companyId,
}: CompanyOffererSolicitationsSummaryProps) => {
  const [offererSummary, setOffererSummary] = useState<OffererSummaryView[]>(
    [],
  );
  const [open, setOpen] = useState<boolean>(false);

  useEffect(() => {
    HttpSolicitation.getOffererSummaryByCompanyId(companyId).then(
      (response) => {
        setOffererSummary(response);
      },
    );
  }, []);

  return (
    <>
      {offererSummary.length !== 0 ? (
        <>
          <Card sx={{ height: '20rem' }}>
            <CardHeader
              title={
                <Typography fontSize={36} fontWeight={600}>
                  {offererSummary.length}
                </Typography>
              }
              subheader={'Oferentes contactados'}
              sx={{ paddingBottom: 2 }}
            />
            <CardContent>
              <List dense sx={{ listStyleType: 'disc', marginTop: -1.5 }}>
                {offererSummary.slice(0, 3).map((offerer) => (
                  <ListItem sx={{ display: 'list-item' }}>
                    <Typography fontWeight={600}>
                      {offerer[OffererFields.BusinessName]}
                    </Typography>
                  </ListItem>
                ))}
              </List>
              {offererSummary.length > 3 && (
                <Stack direction={'row'} justifyContent={'center !important'}>
                  <Box sx={{ width: '30%' }}>
                    <DefaultStylesButton
                      startIcon={<SearchRounded />}
                      size="small"
                      onClick={() => {
                        setOpen(true);
                      }}
                    >
                      Ver más
                    </DefaultStylesButton>
                  </Box>
                </Stack>
              )}
            </CardContent>
          </Card>
          <CompanyContactedOfferersDialog
            open={open}
            data={offererSummary}
            onClose={() => setOpen(false)}
          />
        </>
      ) : (
        <Card sx={{ height: '20rem' }}>
          <CardHeader
            title={
              <Typography fontSize={36} fontWeight={600}>
                0
              </Typography>
            }
            subheader={'Oferentes contactados'}
            sx={{ paddingBottom: 2 }}
          />
          <CardContent>
            <Box sx={{ width: '100%', marginTop: 4.5 }}>
              <Alert severity="info">
                Al parecer no se han encontrado solicitudes
              </Alert>
            </Box>
          </CardContent>
        </Card>
      )}
    </>
  );
};

export default CompanyOffererSolicitationsSummary;
