import React, { useContext, useEffect, useState } from 'react';

import {
  Box,
  Card,
  CardContent,
  CardHeader,
  Chip,
  Divider,
  Grid,
  Skeleton,
  Stack,
  Typography,
} from '@mui/material';

import { HttpCompanyFile, HttpCompanyPhoneNumber } from 'http/index';
import { CompanyActivityView } from 'types/company/companyActivityData';
import {
  CompanyFields,
  CompanyForm,
  CompanyViewDTO,
  CompanyViewDTOFields,
} from 'types/company/companyData';
import { stringFormatter } from 'util/formatters/stringFormatter';

import CompanyPersonalInformationDetailActivity from './components/CompanyPersonalInformationDetailActivity';
import { Alert } from '@mui/lab';
import { AddressFormBoxComponentLoading } from '../../company/components/addresses/AddressFormBoxComponent';
import {
  CompanyFileSourceType,
  CompanyFileType,
} from 'types/company/companyEnums';
import {
  EntityAddress,
  EntityAddressFields,
} from 'types/general/generalReferentialData';
import { AddressFormatter } from 'util/formatters/addressFormatter';
import { PersonTypes } from 'types/person/personEnums';
import {
  DataWithLabel,
  DataWithLabelCompanyFile,
} from 'components/misc/DataWithLabel';
import { AddressTypes } from 'types/general/generalEnums';
import { dateFormatter } from 'util/formatters/dateFormatter';
import SectionDivider from 'components/cards/SectionDivider';
import CompanyPersonalInformationDetailFiscal from './components/CompanyPersonalInformationDetailFiscal';
import CompanyFinancialPhysicalPersonHomeView from '../finance/home/CompanyFinancialPhysicalPersonHomeView';
import CompanyFinancialLegalPersonHomeView from '../finance/home/CompanyFinancialLegalPersonHomeView';
import {
  marketSolicitationStorage,
} from 'util/sessionStorage/marketSolicitationStorage';
import { CompanyPhoneNumberFields } from 'types/company/companyReferentialData';
import { CompanyPersonalInformationContext } from './CompanyPersonalInformationHome';

interface CompanyPersonalInformationDetailProps {
  company?: CompanyForm;
  activity?: CompanyActivityView;
  allowEdit?: boolean;
  dataSource?: CompanyFileSourceType;
}

function CompanyPersonalInformationDetail({
  dataSource = CompanyFileSourceType.Company,
  ...props
}: CompanyPersonalInformationDetailProps) {
  const currentSolicitation =
    marketSolicitationStorage.getCurrentSolicitation();
  const typeQueryParam = window.location.toString().includes('?tipo');
  const longFileQueryParam = window.location.toString().includes('?tipo=2');
  const fileType = CompanyFileType.Long
  /*const fileType = typeQueryParam
    ? longFileQueryParam
      ? CompanyFileType.Long
      : CompanyFileType.Short
    : currentSolicitation
      ? currentSolicitation[MarketSolicitationFields.FileType]
      : CompanyFileType.Short;*/
  
  return (
    <Grid container spacing={1}>
      <Card sx={{ width: '100%' }}>
        <CardContent>
          <Grid item xs={12} container spacing={3}>
            <Grid item xs={12}>
              <Typography fontWeight={600} fontSize={18}>
                Información general de la empresa
              </Typography>
            </Grid>
            <Grid item xs={12}>
              <Divider />
            </Grid>
            {props.company ? (
              <Grid item xs={12} md={6}>
                <CompanyPersonalInformationDetailHeader
                  company={props.company}
                />
              </Grid>
            ) : (
              <Grid item container xs={12} md={6}>
                <Grid item xs={12}>
                  <SectionDivider title={'Datos de Contacto'} />
                </Grid>
                <Grid item xs={12} mt={2}>
                  {Array.from({ length: 9 }).map(() => (
                    <Skeleton />
                  ))}
                </Grid>
              </Grid>
            )}
            {props.activity && props.company ? (
              <Grid item xs={12} md={6}>
                <CompanyPersonalInformationDetailActivity
                  company={props.company}
                  activity={props.activity}
                  inDetail
                />
              </Grid>
            ) : (
              <Grid item container xs={12} md={6}>
                <Grid item xs={12}>
                  <SectionDivider title={'Actividad'} />
                </Grid>
                <Grid item xs={12} mb={8}>
                  {Array.from({ length: 5 }).map(() => (
                    <Skeleton />
                  ))}
                </Grid>
              </Grid>
            )}
            {props.company ? (
              <Grid item xs={12} md={6}>
                <CompanyPersonalInformationCertifications
                  company={props.company}
                  isPhysical={
                    props.company[CompanyViewDTOFields.PersonTypeCode] ===
                    PersonTypes.Physical
                  }
                />
              </Grid>
            ) : (
              <Grid item container xs={12} md={6}>
                <Grid item xs={12}>
                  <SectionDivider title={'Certificado MiPyME'} />
                </Grid>
                <Grid item xs={12} container mt={2} spacing={1}>
                  {Array.from({ length: 4 }).map(() => (
                    <Grid item xs={12} md={6}>
                      <Skeleton />
                    </Grid>
                  ))}
                </Grid>
              </Grid>
            )}
            {props.company ? (
              <Grid item xs={12} md={6}>
                <CompanyPersonalInformationDetailFiscal
                  company={props.company}
                  isPhysical={
                    props.company[CompanyViewDTOFields.PersonTypeCode] ===
                    PersonTypes.Physical
                  }
                />
              </Grid>
            ) : (
              <Grid item container xs={12} md={6}>
                <Grid item xs={12}>
                  <SectionDivider title={'Información Fiscal'} />
                </Grid>
                <Grid item xs={12} container mt={2} spacing={1}>
                  {Array.from({ length: 4 }).map(() => (
                    <Grid item xs={12} md={6}>
                      <Skeleton />
                    </Grid>
                  ))}
                </Grid>
              </Grid>
            )}
            {fileType === CompanyFileType.Long && (
              <>
                <Grid item xs={12} mt={4}>
                  <Typography fontWeight={600} fontSize={18}>
                    Información económica financiera
                  </Typography>
                </Grid>
                <Grid item xs={12}>
                  <Divider />
                </Grid>
                <Grid item xs={12}>
                  {props.company ? (
                    <>
                      {props.company[CompanyViewDTOFields.PersonTypeCode] ===
                      PersonTypes.Physical ? (
                        <CompanyFinancialPhysicalPersonHomeView allowEdit={props.allowEdit}
                          company={props.company as CompanyViewDTO}
                        />
                      ) : (
                        <CompanyFinancialLegalPersonHomeView allowEdit={props.allowEdit}
                          company={props.company as CompanyViewDTO}
                        />
                      )}
                    </>
                  ) : (
                    <Grid item container xs={12}>
                      <Grid item xs={12}>
                        <Skeleton />
                      </Grid>
                      <Grid item xs={12} container spacing={1} mt={3}>
                        {Array.from({ length: 50 }).map(() => (
                          <Grid item xs={12} md={6}>
                            <Skeleton />
                          </Grid>
                        ))}
                      </Grid>
                    </Grid>
                  )}
                </Grid>
              </>
            )}
          </Grid>
        </CardContent>
      </Card>

      {/*<Grid item xs={12}>
            <Grid item xs={12} md={5} container spacing={1} height={'fit-content'}>
                <Grid item xs={12}>
                    <CompanyPersonalInformationDetailAddresses company={props.company}/>
                </Grid>
                <Grid item xs={12}>
                    <Card>
                        <CardHeader title={"Información Impositiva y Constitutiva"}/>
                        <CardContent>
                            <CompanyPersonalInformationDetailTaxSituation company={props.company}/>
                        </CardContent>
                    </Card>
                </Grid>
                    <Card>
                        <CardHeader title={"Información Constitutiva"} />
                        <CardContent>
                            <CompanyPersonalInformationDetailConstituveInformation company={props.company} />
                        </CardContent>
                    </Card>
                {
                    isLegalPerson &&
                    <Grid item xs={12}>
                        <CompanyPersonalInformationDetailAssociates company={props.company}/>
                    </Grid>
                }
            </Grid>
                </Grid>*/}
    </Grid>
  );
}

interface CompanyPersonalInformationDetailAddressesProps {
  company?: CompanyForm;
}

export function CompanyPersonalInformationDetailAddresses(
  props: CompanyPersonalInformationDetailAddressesProps,
) {
  return (
    <Card>
      <CardHeader title={'Domicilios'} />
      <CardContent>
        {props.company ? (
          props.company[CompanyViewDTOFields.Address] &&
          props.company[CompanyViewDTOFields.Address].length ? (
            <Stack spacing={2}>
              {props.company[CompanyViewDTOFields.Address].map((address) => (
                <Grid container alignItems="center">
                  {!address[EntityAddressFields.StreetWithNumber] && (
                    <Typography
                      fontWeight={400}
                      fontSize={'0.85rem'}
                      color="dark"
                      fontStyle="italic"
                    >
                      Pendiente de carga
                    </Typography>
                  )}
                  <Grid item xs={6} md={3.5}>
                    <Chip
                      color="info"
                      size="small"
                      label={AddressFormatter.getLabel(address)}
                    />
                  </Grid>
                  <Grid item xs={12} md={8.5}>
                    <Typography
                      fontWeight={500}
                      fontSize={'0.8rem'}
                      color={'text.disabled'}
                    >
                      {AddressFormatter.toFullAddress(address)}
                    </Typography>
                  </Grid>
                </Grid>
              ))}
            </Stack>
          ) : (
            <Alert color={'info'} severity={'info'}>
              Al parecer no se han encontrado domicilios cargados.
            </Alert>
          )
        ) : (
          <Grid container spacing={1}>
            {Object.keys([1, 1]).map((key) => (
              <Grid item xs={12} key={`addressFormBoxComponentLoading_${key}`}>
                <AddressFormBoxComponentLoading />
              </Grid>
            ))}
          </Grid>
        )}
      </CardContent>
    </Card>
  );
}

export function CompanyPersonalInformationDetailLoading() {
  return (
    <>
      {Array.from(Array(5).keys()).map((item) => (
        <Box
          width="100%"
          key={`companyPersonalInformationDetailLoading_${item}`}
        >
          <Skeleton width={'100%'} />
        </Box>
      ))}
    </>
  );
}

interface CompanyPersonalInformationCertificationsProps {
  company: CompanyForm;
  isPhysical?: boolean;
}

export const CompanyPersonalInformationCertifications = ({
  company,
  isPhysical,
}: CompanyPersonalInformationCertificationsProps) => {
  const hasCertificatePyme: boolean =
    !!company[CompanyViewDTOFields.HasCertificatePyme];
  const certificatePymeDate: string = !hasCertificatePyme
    ? '-'
    : dateFormatter.toShortDate(
          company[CompanyViewDTOFields.CertificatePymeDate],
        ) === '-'
      ? ''
      : dateFormatter.toShortDate(
          company[CompanyViewDTOFields.CertificatePymeDate],
        );

  return (
    <Grid container>
      <Grid item xs={12} mb={2}>
        <SectionDivider title={'Certificado MiPyME'} />
      </Grid>
      <Grid item xs={12} md={6}>
        <DataWithLabel
          label="Certificado MiPyME"
          data={company[CompanyViewDTOFields.HasCertificatePyme] ? 'Si' : 'No'}
          rowDirection
        />
      </Grid>
      <Grid item xs={12} md={6}>
        <DataWithLabel
          label="Vigencia"
          data={certificatePymeDate}
          rowDirection
        />
      </Grid>
      <Grid item xs={12} md={6}>
        <DataWithLabel
          label="Categoría MiPyME"
          data={
            hasCertificatePyme
              ? company[CompanyViewDTOFields.AfipSectionDesc]
              : company[CompanyViewDTOFields.AfipSectionDesc] || '-'
          }
          rowDirection
        />
      </Grid>
      {!isPhysical && (
        <Grid item xs={12} md={6}>
          <DataWithLabel
            label="Grupo Económico"
            data={
              company[CompanyViewDTOFields.BelongsEconomicGroup] ? 'Si' : 'No'
            }
            rowDirection
          />
        </Grid>
      )}
    </Grid>
  );
};

interface CompanyPersonalInformationDetailHeaderProps {
  company: CompanyForm;
}

function CompanyPersonalInformationDetailHeader(
  props: CompanyPersonalInformationDetailHeaderProps,
) {
  const { dataId, dataSource } = useContext(CompanyPersonalInformationContext);
  const isPhysicalPerson: boolean =
    props.company[CompanyViewDTOFields.PersonTypeCode] == PersonTypes.Physical;

  const [isLoading, setLoading] = useState<boolean>(true);
  const [phoneNumber, setPhoneNumber] = useState<string>();

  useEffect(() => {
    if (dataId && dataSource) {
      const callbackPhone =
        dataSource == CompanyFileSourceType.Company
          ? HttpCompanyPhoneNumber.getMain
          : HttpCompanyFile.getCompanyPhoneNumberByFileId;

      callbackPhone(dataId).then((phone) => {
        setPhoneNumber(
          stringFormatter.phoneNumberWithAreaCode(
            phone[CompanyPhoneNumberFields.AreaCode],
            phone[CompanyPhoneNumberFields.PhoneNumber],
          ),
        );
        setLoading(false);
      });
    }
  }, [dataId, dataSource]);

  const getActivityAddress = (addresses?: EntityAddress[]) => {
    if (addresses && addresses.length !== 0) {
      const activityAddress = addresses.find(
        (x) => x[EntityAddressFields.AddressTypeCode] === AddressTypes.Activity,
      );
      if (activityAddress) {
        const completeAddress: string =
          AddressFormatter.toFullAddress(activityAddress);
        if (completeAddress) {
          return (
            <Typography fontWeight={600} fontSize={'1.1rem'}>
              {AddressFormatter.toFullAddress(activityAddress)}
            </Typography>
          );
        } else {
          return (
            <Typography
              fontStyle={'italic'}
              color={'#eac276 !important'}
              fontWeight={600}
            >
              Pendiente de carga
            </Typography>
          );
        }
      } else {
        return (
          <Typography
            fontStyle={'italic'}
            color={'#eac276 !important'}
            fontWeight={600}
          >
            Pendiente de carga
          </Typography>
        );
      }
    } else {
      return (
        <Typography
          fontStyle={'italic'}
          color={'#eac276 !important'}
          fontWeight={600}
        >
          Pendiente de carga
        </Typography>
      );
    }
  };


  const isLegalPerson: boolean = !!props.company && props.company[CompanyViewDTOFields.PersonTypeCode] === PersonTypes.Legal;

  return (
    <Grid container>
      <Grid item xs={12}>
        <SectionDivider title={'Datos de Contacto'} />
      </Grid>
      <Grid item xs={12} mt={2}>
        <DataWithLabelCompanyFile
          label={'Razón Social'}
          data={props.company[CompanyViewDTOFields.BusinessName]}
        />

        <DataWithLabelCompanyFile
          label={'CUIT'}
          data={stringFormatter.formatCuit(
            props.company[CompanyViewDTOFields.CUIT],
          )}
        />

        {isPhysicalPerson && (
          <>
            <DataWithLabelCompanyFile
              label={'Tipo Documento'}
              data={props.company[CompanyViewDTOFields.DocumentTypeDesc] || '-'}
            />

            <DataWithLabelCompanyFile
              label={'Nro. Documento'}
              data={props.company[CompanyViewDTOFields.DocumentNumber]}
            />

            <DataWithLabelCompanyFile
              label={'Fecha de Nacimiento'}
              data={
                props.company[CompanyViewDTOFields.BirthdayDate]
                  ? dateFormatter.toShortDate(
                      props.company[CompanyViewDTOFields.BirthdayDate],
                    )
                  : null
              }
            />
          </>
        )}

        <DataWithLabel
          label={'Domicilio de Actividad'}
          data={getActivityAddress(props.company[CompanyViewDTOFields.Address])}
          rowDirection
          mediumWidth
        />

        <DataWithLabelCompanyFile
          label={'Mail'}
          data={props.company[CompanyViewDTOFields.Mail]}
        />

        {!isLoading && (
          <DataWithLabelCompanyFile label={'Teléfono'} data={phoneNumber} />
        )}

        <DataWithLabelCompanyFile
          label={'Sitio Web'}
          data={props.company[CompanyFields.Web] || '-'}
        />

        <DataWithLabelCompanyFile
          label={'Red Social'}
          data={props.company[CompanyFields.SocialNetwork] || '-'}
        />

        <DataWithLabel
          label={'¿Es liderada por mujeres?'}
          data={
            <Typography fontWeight={600} fontSize={'1.1rem'}>
              {props.company[CompanyViewDTOFields.IsLeadByWoman] ? 'Si' : 'No'}
            </Typography>
          }
          rowDirection
          mediumWidth
        />
        {
          !isLegalPerson &&
          <DataWithLabel
              label={'Persona políticamente expuesta (PEP)'}
              data={
                <Typography fontWeight={600} fontSize={'1.1rem'}>
                  {props.company[CompanyViewDTOFields.IsPoliticallyExposed] ? 'Si' : 'No'}
                </Typography>
              }
              rowDirection
              mediumWidth
          />
        }
      </Grid>
    </Grid>
  );
}

export default CompanyPersonalInformationDetail;
