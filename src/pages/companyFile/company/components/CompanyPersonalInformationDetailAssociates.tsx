import {
  CompanyForm,
  CompanyViewDTOFields,
} from '../../../../types/company/companyData';
import {
  Button,
  Card,
  CardContent,
  CardHeader,
  Divider,
  Grid,
  Skeleton,
  Stack,
  Typography,
} from '@mui/material';
import React, { useEffect, useState } from 'react';
import {
  CompanyPersonRelationship,
  CompanyPersonRelationshipFields,
  SocietyPersonFields,
} from '../../../../types/company/companySocietyData';
import { HttpCompanyFile, HttpCompanyRelationship } from '../../../../http';
import { EntityWithIdFields } from '../../../../types/baseEntities';
import { PersonRelationshipTypeClassification } from '../../../../types/company/companyEnums';
import { stringFormatter } from '../../../../util/formatters/stringFormatter';
import SearchRoundedIcon from '@mui/icons-material/SearchRounded';
import { Alert } from '@mui/lab';
import CompanyAssociatesDialog from './CompanyAssociatesDialog';
import { SolicitationViewDTOFields } from '../../../../types/solicitations/solicitationData';

interface CompanyPersonalInformationDetailAssociatesProps {
  company: CompanyForm | undefined;
}

function CompanyPersonalInformationDetailAssociates({
  company,
}: CompanyPersonalInformationDetailAssociatesProps) {
  const [listRelationships, setListRelationships] =
    useState<CompanyPersonRelationship[]>();
  const [associatesDialog, setAssociatesDialog] = useState<boolean>(false);

  const showAssociatesDialog = () => setAssociatesDialog(true);
  const hideAssociatesDialog = () => setAssociatesDialog(false);

  useEffect(() => {
    if (company) {
      if (company[SolicitationViewDTOFields.FileId]) {
        HttpCompanyFile.getRelationshipByFileId(
          company[SolicitationViewDTOFields.FileId] ?? 0,
        ).then((response) => {
          setListRelationships(response);
        });
      } else {
        HttpCompanyRelationship.getRelationshipByClassification(
          company[EntityWithIdFields.Id],
          PersonRelationshipTypeClassification.Society as PersonRelationshipTypeClassification,
        ).then((response) => {
          setListRelationships(response);
        });
      }
    }
  }, [company]);

  const drawAssociatesInfo = (associates: CompanyPersonRelationship[]) => {
    return associates.length !== 0 ? (
      <Grid container>
        <Grid item xs={3}>
          <Typography
            fontSize={14}
            fontWeight={600}
            textAlign={'center'}
            color={'#7e8299'}
          >
            CUIT
          </Typography>
        </Grid>
        <Grid item xs={6}>
          <Typography
            fontSize={14}
            fontWeight={600}
            textAlign={'center'}
            color={'#7e8299'}
          >
            Nombre y apellido
          </Typography>
        </Grid>
        <Grid item xs={3}>
          <Typography
            fontSize={14}
            fontWeight={600}
            textAlign={'center'}
            color={'#7e8299'}
          >
            % Participación
          </Typography>
        </Grid>
        <Grid item xs={12} pt={1}>
          <Divider />
        </Grid>
        {associates.slice(0, 3).map((associate) => (
          <Grid container spacing={2} alignItems={'center'} pt={1} pb={1}>
            <Grid item xs={3}>
              <Typography
                fontSize={13}
                fontWeight={500}
                color={'#7e8299'}
                textAlign={'center'}
              >
                {stringFormatter.formatCuit(
                  associate[CompanyViewDTOFields.CUIT],
                )}
              </Typography>
            </Grid>
            <Grid item xs={6}>
              <Typography
                fontSize={13}
                fontWeight={500}
                color={'#7e8299'}
                textAlign={'center'}
              >
                {associate[CompanyPersonRelationshipFields.LegalName]}
              </Typography>
            </Grid>
            <Grid item xs={3}>
              <Typography
                fontSize={13}
                fontWeight={500}
                color={'#7e8299'}
                textAlign={'center'}
              >
                {
                  associate[
                    CompanyPersonRelationshipFields.ParticipationPercent
                  ]
                }{' '}
                %
              </Typography>
            </Grid>
          </Grid>
        ))}
        {associates.length > 3 && (
          <Stack mt={1}>
            <Button
              variant="contained"
              color={'inherit'}
              size={'small'}
              startIcon={<SearchRoundedIcon />}
              onClick={showAssociatesDialog}
              sx={{ padding: '0.5rem !important' }}
            >
              Todos los socios
            </Button>
          </Stack>
        )}
        <CompanyAssociatesDialog
          open={associatesDialog}
          data={associates}
          onClose={hideAssociatesDialog}
        />
      </Grid>
    ) : (
      <Grid xs={12}>
        <Alert color={'info'} severity={'info'}>
          Al parecer no se han encontrado socios.
        </Alert>
      </Grid>
    );
  };

  return (
    <Card>
      <CardHeader title={'Socios'} />
      <CardContent>
        {company && listRelationships ? (
          drawAssociatesInfo(listRelationships)
        ) : (
          <Stack width={'100%'} spacing={1}>
            <Skeleton />
            <Skeleton />
            <Skeleton />
            <Skeleton />
          </Stack>
        )}
      </CardContent>
    </Card>
  );
}

export default CompanyPersonalInformationDetailAssociates;
