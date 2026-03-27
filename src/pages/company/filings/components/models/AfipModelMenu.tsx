import {
  CompanyViewDTO,
  CompanyViewDTOFields,
} from '../../../../../types/company/companyData';
import {
  Stack,
  Card,
  CardContent,
  Grid,
  Divider,
  Typography,
} from '@mui/material';
import React, { useEffect, useState } from 'react';
import {
  BackButton,
  EditButton,
} from '../../../../../components/buttons/Buttons';
import { DataWithLabel } from '../../../../../components/misc/DataWithLabel';
import MarketTypography from '../../../../markets/components/MarketTypography';
import { dateFormatter } from '../../../../../util/formatters/dateFormatter';
import CompanyAfipActivityList from '../../../activity/CompanyAfipActivityList';
import { EntityWithIdFields } from '../../../../../types/baseEntities';
import { useNavigate } from 'react-router-dom';
import {
  CompanyActivityFields,
  CompanyActivityView,
} from '../../../../../types/company/companyActivityData';
import { HttpCompanyActivity } from '../../../../../http/company/httpCompanyActivity';
import { Skeleton } from '@mui/lab';
import { DialogAlert } from '../../../../../components/dialog';
import {PublicEntityEnums} from "../../../../../util/typification/publicEntityEnums";

interface AfipModelMenuProps {
  onBack: () => void;
  company: CompanyViewDTO;
}

const AfipModelMenu = ({ onBack, company }: AfipModelMenuProps) => {
  const navigate = useNavigate();
  const [clientAndProviders, setClientAndProviders] =
    useState<CompanyActivityView>();
  const [openConfirm, setOpenConfirm] = useState<boolean>(false);

  useEffect(() => {
    HttpCompanyActivity.getByCompanyId(company[EntityWithIdFields.Id]).then(
      (r) => setClientAndProviders(r),
    );
  }, [company]);

  const onConfirmEdit = () =>
    navigate(`/mis-empresas/${company[EntityWithIdFields.Id]}`);

  return (
    <Stack spacing={2}>
      <Stack
        direction={'row'}
        justifyContent={'space-between'}
        alignItems={'center'}
      >
        <Typography variant="h3" fontWeight={600}>
          {PublicEntityEnums.ARCA}
        </Typography>
        <Stack direction="row" alignItems={'center'} spacing={2}>
          <EditButton onClick={() => setOpenConfirm(true)} size={'small'}>
            Editar
          </EditButton>
          <BackButton onClick={onBack} size={'small'}>
            Mis Presentaciones
          </BackButton>
        </Stack>
      </Stack>
      <Card>
        <CardContent>
          <Grid container spacing={2}>
            <Grid item md={4.5}>
              <Stack spacing={1}>
                <MarketTypography
                  sx={{
                    fontSize: 'calc(1.26rem + .12vw)',
                    paddingBottom: 2,
                  }}
                >
                  Información Constitutiva e Impositiva
                </MarketTypography>
                <DataWithLabel
                  label={'Tipo Persona'}
                  data={company[CompanyViewDTOFields.PersonTypeDesc]}
                  rowDirection
                  fullWidth
                />
                <DataWithLabel
                  label={'Tipo Sociedad'}
                  data={
                    company[CompanyViewDTOFields.PersonClassificationTypeDesc]
                  }
                  rowDirection
                  fullWidth
                />
                <DataWithLabel
                  label={'Fecha Contrato Social'}
                  data={dateFormatter.toShortDate(
                    company[CompanyViewDTOFields.SocialContractDate],
                  )}
                  rowDirection
                  fullWidth
                />
                <DataWithLabel
                  label={'Cierre de Ejercicio Económico'}
                  data={`${company[CompanyViewDTOFields.DayClosing]}/${company[CompanyViewDTOFields.MonthClosing]}`}
                  rowDirection
                  fullWidth
                />
                <DataWithLabel
                  label={'Pertenece a Grupo Económico'}
                  data={
                    company[CompanyViewDTOFields.BelongsEconomicGroup]
                      ? 'Sí'
                      : 'No'
                  }
                  rowDirection
                  fullWidth
                />
                <DataWithLabel
                  label={`Fecha Inscripción ${PublicEntityEnums.ARCA}`}
                  data={dateFormatter.toShortDate(
                    company[CompanyViewDTOFields.AfipRegistrationDate],
                  )}
                  rowDirection
                  fullWidth
                />
                <DataWithLabel
                  label={'Condición frente al IVA'}
                  data={
                    company[CompanyViewDTOFields.PersonResponsibilityTypeDesc]
                  }
                  rowDirection
                  fullWidth
                />
                <DataWithLabel
                  label={'Condición IIBB'}
                  data={
                    company[CompanyViewDTOFields.RegisteredAtIIBB] ? 'Sí' : 'No'
                  }
                  rowDirection
                  fullWidth
                />
                <DataWithLabel
                  label={'Posee Convenio Multilateral'}
                  data={
                    company[CompanyViewDTOFields.HasMultilateralAgreement]
                      ? 'Sí'
                      : 'No'
                  }
                  rowDirection
                  fullWidth
                />
                <DataWithLabel
                  label={'Tiene Certificado Pyme'}
                  data={
                    company[CompanyViewDTOFields.HasCertificatePyme]
                      ? 'Sí'
                      : 'No'
                  }
                  rowDirection
                  fullWidth
                />
                <DataWithLabel
                  label={'Vigencia Certificado Pyme'}
                  data={dateFormatter.toShortDate(
                    company[CompanyViewDTOFields.CertificatePymeDate],
                  )}
                  rowDirection
                  fullWidth
                />
                <DataWithLabel
                  label={'Categoria MiPyMEs'}
                  data={company[CompanyViewDTOFields.AfipSectionDesc]}
                  rowDirection
                  fullWidth
                />
                <DataWithLabel
                  label={'Empresa liderada por Mujeres'}
                  data={
                    company[CompanyViewDTOFields.IsLeadByWoman] ? 'Sí' : 'No'
                  }
                  rowDirection
                  fullWidth
                />
              </Stack>
            </Grid>
            <Grid item md={0.5}>
              <Divider orientation="vertical" />
            </Grid>
            <Grid item md={7}>
              <Stack spacing={2}>
                <MarketTypography
                  sx={{
                    fontSize: 'calc(1.26rem + .12vw)',
                    paddingBottom: 1,
                  }}
                >
                  {`Actividades registradas en ${PublicEntityEnums.ARCA}`}
                </MarketTypography>
                <CompanyAfipActivityList
                  companyId={company[EntityWithIdFields.Id]}
                  viewActions={false}
                />
                <Stack
                  direction="row"
                  alignItems="center"
                  justifyContent="space-between"
                >
                  {clientAndProviders ? (
                    <>
                      <DataWithLabel
                        label={'Rango Clientes'}
                        data={
                          clientAndProviders[
                            CompanyActivityFields.RangeCustomersDesc
                          ]
                        }
                        rowDirection
                      />
                      <DataWithLabel
                        label={'Rango Proveedores'}
                        data={
                          clientAndProviders[
                            CompanyActivityFields.RangeSuppliersDesc
                          ]
                        }
                        rowDirection
                      />
                    </>
                  ) : (
                    Array.from({ length: 2 }).map(() => (
                      <Skeleton width={'50%'} />
                    ))
                  )}
                </Stack>
              </Stack>
            </Grid>
          </Grid>
        </CardContent>
      </Card>
      <DialogAlert
        onClose={() => setOpenConfirm(false)}
        open={openConfirm}
        onConfirm={onConfirmEdit}
        title={`Redirección a página de Constitutiva e Impositiva`}
        textContent={`¿Estás seguro que deseás continuar? Serás redireccionado a la página de información constitutiva e impositiva de la empresa para poder editar los datos`}
      />
    </Stack>
  );
};

export default AfipModelMenu;
