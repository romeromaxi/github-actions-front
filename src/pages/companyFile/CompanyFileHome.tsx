import React, { useEffect, useRef, useState } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';

import { useQuery } from 'hooks/useQuery';

import {
  Button,
  Card,
  CardActionArea,
  CardContent,
  CardMedia,
  Grid,
  Stack,
  Step,
  Stepper,
  Typography,
} from '@mui/material';
import CheckRoundedIcon from '@mui/icons-material/CheckRounded';

import CompanyFinancialSummary from './finance/CompanyFinancialSummary';
import CompanyFileHomeEditProfile from './homesEdit/CompanyFileHomeEditProfile';

import {
  HttpCompany,
  HttpCompanyAddress,
  HttpCompanyFinance,
  HttpCompanyMail,
  HttpCompanyPhoneNumber,
  HttpExportCompanyFile,
} from 'http/index';
import {
  CompanyDetailFormFields,
  CompanyFileCompletenessView,
  CompanyForm,
  CompanyViewDTO,
  CompanyViewDTOFields,
} from 'types/company/companyData';
import { CompanyMailFields } from '../../types/company/companyReferentialData';
import { HttpCompanyActivity } from '../../http/company/httpCompanyActivity';
import {
  BaseResponseFields,
  EntityWithIdFields,
} from '../../types/baseEntities';
import { CompanyActivityView } from '../../types/company/companyActivityData';
import CompanyFileHomeEditFinance from './homesEdit/CompanyFileHomeEditFinance';
import CompanyPersonalInformationSummary from './company/CompanyPersonalInformationSummary';
import { DefaultStylesButton } from '../../components/buttons/Buttons';
import KeyboardBackspaceIcon from '@mui/icons-material/KeyboardBackspace';
import { DialogAlert } from '../../components/dialog';
import StepLabelBase from '../../components/steppers/components/StepLabelBase';
import { useAction } from '../../hooks/useAction';
import CompanyPersonalInformationHome from './company/CompanyPersonalInformationHome';
// @ts-ignore
import bureauImg from '../../assets/img/bureau/info-bp.png';
import CompanyHeader from '../company/components/CompanyHeader';
import { ButtonExportDropdown } from '../../components/buttons/ButtonExportDropdown';
import useAxios from '../../hooks/useAxios';

function CompanyFileHome() {
  let { companyId } = useParams();
  let paramEdit = useQuery().get('edit');
  let paramLines = useQuery().get('lines');

  const [company, setCompany] = useState<CompanyForm>();
  const [companyFileCompleteness, setCompanyFileCompleteness] =
    useState<CompanyFileCompletenessView>();

  useEffect(() => {
    setCompany(undefined);
    let id: number = parseInt(companyId!);

    Promise.all([
      HttpCompany.getCompanyById(id),
      HttpCompanyPhoneNumber.get(id),
      HttpCompanyMail.get(id),
      HttpCompanyAddress.get(id),
      HttpCompany.getCompletenessPercentage(id),
    ]).then(([company, phone, mail, addresses, completeness]) => {
      setCompany({
        ...company,
        [CompanyDetailFormFields.Phone]: phone,
        [CompanyDetailFormFields.Mail]: mail[CompanyMailFields.Mail],
        [CompanyDetailFormFields.Address]: addresses,
      });
      setCompanyFileCompleteness(completeness);
    });
  }, [companyId, paramEdit]);

  return (
    <Stack mt={3} spacing={1}>
      {!paramEdit ? (
        <CompanyFileHomeBase
          company={company}
          companyFileCompleteness={companyFileCompleteness}
          allowConfirm={!!paramLines}
        />
      ) : (
        company && (
          <CompanyFileHomeEdit
            company={company}
            companyFileCompleteness={companyFileCompleteness}
            paramEdit={paramEdit}
          />
        )
      )}
    </Stack>
  );
}

export const CompanyFileHomeContext = React.createContext({
  company: {} as CompanyViewDTO | undefined,
  companyFileCompleteness: {} as CompanyFileCompletenessView | undefined,
  setClosingDate: (day: number, month: number) => {},
  labelButton: '' as string,
});

export interface CompanyFileHomeBaseProps {
  company?: CompanyViewDTO;
  companyFileCompleteness?: CompanyFileCompletenessView;
  allowConfirm?: boolean;
  marketSave?: boolean,
  marketEdit?: boolean,
  updateDirtyValue?: (arg: boolean) => void,
  afterSubmit?: () => void
}

export function CompanyFileHomeBase(props: CompanyFileHomeBaseProps) {
  const navigate = useNavigate();
  const { setTitle } = useAction();
  const { fetchAndDownloadFile } = useAxios();
  let paramLines = useQuery().get('lines');
  let labelButton = paramLines ? 'Ver' : 'Verificar';
  const location = useLocation();

  const [company, setCompany] = useState<CompanyViewDTO | undefined>();
  const [activity, setActivity] = useState<CompanyActivityView>();
  const [responseError, setResponseError] = useState<string>();
  const [exportPdf, setExportPdf] = useState<boolean>(false);
  const domElementRef = useRef(null);

  useEffect(() => {
    if (props.company) {
      setCompany(props.company);

      HttpCompanyActivity.getByCompanyId(
        props.company[EntityWithIdFields.Id],
      ).then(setActivity);
    }
  }, [props.company]);

  const setClosingDate = (day: number, month: number) => {
    // @ts-ignore
    setCompany({
      ...company,
      [CompanyViewDTOFields.DayClosing]: day,
      [CompanyViewDTOFields.MonthClosing]: month,
    });
  };

  const goToNextStep = () => {
    if (company) {
      let location: string = window.location.pathname.split('/legajo')[0];
      navigate(
        `${location}?companyId=${company[EntityWithIdFields.Id]}&id=${paramLines}`,
        { replace: true },
      );
    }
  };

  const onBack = () => {
    if (paramLines && company) {
      let location: string = window.location.pathname.split('/legajo')[0];
      navigate(`${location}?companyId=${company[EntityWithIdFields.Id]}`, {
        replace: true,
      });
    } else {
      navigate(-1);
    }
  };

  const onConfirm = () => {
    setResponseError(undefined);

    if (props.company)
      Promise.all([
        HttpCompany.validate(props.company[EntityWithIdFields.Id]),
        HttpCompanyFinance.validate(props.company[EntityWithIdFields.Id]),
      ]).then(([responseCompany, responseFinance]) => {
        let finalError: string = '';

        if (responseCompany[BaseResponseFields.HasError]) {
          finalError =
            'Datos constitutivos y de actividad. ' +
            responseCompany[BaseResponseFields.ErrorDescription];
        }

        if (responseFinance[BaseResponseFields.HasError]) {
          finalError =
            finalError +
            '\n Datos Económicos. ' +
            responseCompany[BaseResponseFields.ErrorDescription];
        }

        if (finalError) setResponseError(finalError);
        else goToNextStep();
      });
  };

  const onExportExcel = () => {
    if (company && company[EntityWithIdFields.Id]) {
      const exportFunction = window.location.toString().includes('?tipo=1')
        ? HttpExportCompanyFile.exportShortFileToExcelByCompany
        : HttpExportCompanyFile.exportLongFileToExcelByCompany;

      fetchAndDownloadFile(() =>
        exportFunction(company[EntityWithIdFields.Id]),
      );
    }
  };

  const mapActionTitle = () => (
    <Stack direction={'row'} spacing={2}>
      <ButtonExportDropdown size={'small'} onExportExcel={onExportExcel} />

      <Button
        size={'small'}
        variant={'contained'}
        color={'inherit'}
        onClick={onBack}
        startIcon={<KeyboardBackspaceIcon />}
      >
        {location.state
          ? location.state.prevPathname.includes('carrito') && 'Selección'
          : 'Mis Presentaciones'}
      </Button>
    </Stack>
  );

  //renderPdfView()
  return (
    <Grid container spacing={4}>
      <Grid item xs={12}>
        {company && (
          <Card>
            <CardContent>
              <CompanyHeader company={company} />
            </CardContent>
          </Card>
        )}
      </Grid>
      <Stack ref={domElementRef} spacing={1}>
        {exportPdf && <CompanyPersonalInformationHome />}
      </Stack>
      {props.allowConfirm && (
        <Grid item xs={12}>
          <Card sx={{ mt: 2.5 }}>
            <Grid item xs={12}>
              <CompanyFileHomeMarketStepperHeader />
            </Grid>
          </Card>
        </Grid>
      )}
      <CompanyFileHomeContext.Provider
        value={{
          company,
          companyFileCompleteness: props.companyFileCompleteness,
          setClosingDate,
          labelButton,
        }}
      >
        <Grid item xs={6}>
          <CompanyPersonalInformationSummary />
        </Grid>
        {!window.location.toString().includes('?tipo=1') ? (
          <Grid item xs={6}>
            <CompanyFinancialSummary />
            {setTitle('Legajo de Contacto', mapActionTitle())}
          </Grid>
        ) : (
          setTitle('Legajo Abreviado', mapActionTitle())
        )}

        <Grid item xs={12}>
          <Card>
            <CardActionArea
              onClick={() =>
                navigate(`/bureau/${company?.[EntityWithIdFields.Id]}/detalle`)
              }
              sx={{
                '& > img': {
                  opacity: 0.7,
                  '&:hover': {
                    opacity: 0.9,
                  },
                },
              }}
            >
              <CardContent>
                <Typography
                  fontSize={26}
                  fontWeight={600}
                  textAlign={'center'}
                  pb={1}
                  color={'#0791E3'}
                >
                  ¿Querés conocer como te ve el mercado?
                </Typography>
              </CardContent>
              <CardMedia
                component="img"
                height="200"
                image="/images/info-bureau.png"
              />
            </CardActionArea>
          </Card>
        </Grid>
      </CompanyFileHomeContext.Provider>

      {responseError && (
        <DialogAlert
          onClose={() => setResponseError(undefined)}
          open={true}
          textContent={responseError}
        />
      )}

      {props.allowConfirm && (
        <DefaultStylesButton
          onClick={onConfirm}
          startIcon={<CheckRoundedIcon />}
          sx={{ position: 'fixed !important', right: '15%', bottom: 25 }}
        >
          Confirmar
        </DefaultStylesButton>
      )}
    </Grid>
  );
}

interface CompanyFileHomeEditProps {
  company?: CompanyViewDTO;
  companyFileCompleteness?: CompanyFileCompletenessView;
  paramEdit: string;
}

enum CompanyParamEdit {
  Profile = 'profile',
  Finance = 'finance',
}

function CompanyFileHomeEdit({
  company,
  companyFileCompleteness,
  paramEdit,
}: CompanyFileHomeEditProps) {
  const setClosingDate = (day: number, month: number) => {};

  return (
    <Grid container spacing={2} justifyContent="end" mt={1}>
      <CompanyFileHomeContext.Provider
        value={{
          company,
          companyFileCompleteness: companyFileCompleteness,
          setClosingDate,
          labelButton: '',
        }}
      >
        <Grid item xs={12}>
          {(() => {
            switch (paramEdit) {
              case CompanyParamEdit.Profile:
                return <CompanyFileHomeEditProfile company={company} />;

              case CompanyParamEdit.Finance:
                return <CompanyFileHomeEditFinance company={company} />;
            }
          })()}
        </Grid>
      </CompanyFileHomeContext.Provider>
    </Grid>
  );
}

function CompanyFileHomeMarketStepperHeader() {
  let params = useParams();
  const lineId: number = parseInt(params.idLine ?? '');

  const steps: string[] = [
    'Elegí tu Empresa',
    lineId ? 'Confirmá la Línea elegida' : 'Seleccioná las Líneas',
    'Confirmá tu Legajo',
    'Datos especiales',
    '¡Completado!',
  ];

  return (
    <Stepper nonLinear activeStep={2} alternativeLabel sx={{ width: '100%' }}>
      {steps.map((oneStep, index) => (
        <Step key={index} completed={index < 2}>
          <StepLabelBase label={oneStep} />
        </Step>
      ))}
    </Stepper>
  );
}

export default CompanyFileHome;
