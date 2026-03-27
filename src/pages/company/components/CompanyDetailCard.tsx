import React, {
  useCallback,
  useEffect,
  useRef,
  useState,
} from 'react';
import CompanyDetailForm from './CompanyDetailForm';
import { FormProvider, useForm, useFormState } from 'react-hook-form';
import {
  CompanyAddressInsertDTO,
  CompanyAddressInsertDTOFields,
  CompanyMailFields,
  CompanyMailInsert,
  CompanyPhoneInsertDTO,
} from 'types/company/companyReferentialData';
import {
  NotRequiredWebSchema,
  REQUIRED_FIELD_MESSAGE,
  RequiredDayMonthSchema,
  RequiredMailSchema,
} from 'util/validation/validationSchemas';
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup/dist/yup';
import {
  HttpCompany,
  HttpCompanyAddress,
  HttpCompanyMail,
  HttpCompanyPhoneNumber,
} from 'http/index';
import { EntityWithIdFields } from 'types/baseEntities';
import {
  CompanyDetailFormFields,
  CompanyFormData,
  CompanyViewDTO,
  CompanyViewDTOFields,
} from 'types/company/companyData';
import { useAction } from 'hooks/useAction';
import { PersonTypes } from 'types/person/personEnums';
import html2canvas from 'html2canvas';
import JsPDF from 'jspdf';
import { Button, Grid } from '@mui/material';
import { EntityPhoneNumberFields } from '../../../types/general/generalReferentialData';
import { Skeleton } from '@mui/lab';
import {useApplicationCommon} from "hooks/contexts/ApplicationCommonContext";
import CardEditingWithContext from "components/cards/CardEditingWithContext";
import { PaperclipIcon } from 'lucide-react';

interface CompanyDetailCardProps {
  company: CompanyViewDTO;
  onReload?: () => void;
  onScrollToDocs?: () => void;
}

function CompanyDetailCard({ company, onReload, onScrollToDocs }: CompanyDetailCardProps) {
  const { shouldWarnBeforeSwitch, setShouldWarnBeforeSwitch } =
    useApplicationCommon();
  const [initialShouldWarn, _] = useState<boolean>(shouldWarnBeforeSwitch);

  const { showLoader, hideLoader, snackbarSuccess, snackbarError } =
    useAction();
  const companyId: number = company ? company[EntityWithIdFields.Id] : 0;
  const domElementRef = useRef(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [exportPdf] = useState<boolean>(false);
  const [previousCompany, setPreviousCompany] = useState<CompanyFormData>();

  const companyDetailFormSchema = yup.object().shape(
    {
      [CompanyDetailFormFields.Mail]: RequiredMailSchema,
      [CompanyDetailFormFields.DateClosing]: RequiredDayMonthSchema,
      [CompanyDetailFormFields.Web]: NotRequiredWebSchema(
        CompanyDetailFormFields.Web,
      ),
      // [CompanyDetailFormFields.Address]: yup.array()
      //     .of(object().shape(addressSchema)),
      [CompanyDetailFormFields.Company]: yup
        .object()
        .test(
          'CompanyDetailFormFields.Company',
          REQUIRED_FIELD_MESSAGE,
          (obj) => {
            if (obj[CompanyViewDTOFields.CurrencyCode] > 0) {
              return true;
            }

            return new yup.ValidationError(
              REQUIRED_FIELD_MESSAGE,
              null,
              `${CompanyDetailFormFields.Company}.${CompanyViewDTOFields.CurrencyCode}`,
            );
          },
        )
        .test(
          'CompanyDetailFormFields.Company',
          REQUIRED_FIELD_MESSAGE,
          (obj) => {
            if (
              obj[CompanyViewDTOFields.PersonTypeCode] ===
                PersonTypes.Physical ||
              obj[CompanyViewDTOFields.PersonClassificationTypeCode] > 0
            ) {
              return true;
            }

            return new yup.ValidationError(
              REQUIRED_FIELD_MESSAGE,
              null,
              `${CompanyDetailFormFields.Company}.${CompanyViewDTOFields.PersonClassificationTypeCode}`,
            );
          },
        ),
    },
    [[CompanyDetailFormFields.Web, CompanyDetailFormFields.Web]],
  );

  const methods = useForm<CompanyFormData>({
    resolver: yupResolver(companyDetailFormSchema),
    defaultValues: {
      ...company,
      [CompanyDetailFormFields.Company]: {
        ...company,
      },
    },
  });

  const { isDirty, isSubmitted } = useFormState({ control: methods.control });

  useEffect(() => {
    if (isDirty) {
      setShouldWarnBeforeSwitch(isDirty);
    }
  }, [isDirty]);

  useEffect(() => {
    if (isSubmitted && !initialShouldWarn) {
      setShouldWarnBeforeSwitch(false);
    }
  }, [isSubmitted]);

  const insertCompanyMail = (mail: string): Promise<void> => {
    let companyMail: CompanyMailInsert = {
      [CompanyMailFields.MailTypeCode]: 0,
      [CompanyMailFields.Mail]: mail,
    };
    return HttpCompanyMail.insert(companyId, companyMail);
  };

  const insertCompanyPhoneNumber = (
    phoneList: CompanyPhoneInsertDTO[],
  ): Promise<void> => {
    return HttpCompanyPhoneNumber.insertList(companyId, phoneList);
  };

  const insertCompanyAddressList = (
    addressList: CompanyAddressInsertDTO[],
  ): Promise<void> => {
    return HttpCompanyAddress.insertList(companyId, addressList);
  };

  const updateClosingDate = (date?: string): Promise<void> => {
    if (!date) return new Promise((resolve) => resolve());

    let [day, month] = date.split('/').map((x) => parseInt(x)) || [0, 0];

    return HttpCompany.updateClosingDate(companyId, day, month);
  };

  const loadData = useCallback(() => {
    setLoading(true);

    Promise.all([
      HttpCompanyPhoneNumber.get(companyId),
      HttpCompanyMail.get(companyId),
      HttpCompanyAddress.get(companyId),
      HttpCompany.getCompanyById(companyId),
    ])
      .then(([phonesList, mail, addressList, company]) => {
        const hasClosingDate: boolean =
          !!company[CompanyViewDTOFields.DayClosing] &&
          !!company[CompanyViewDTOFields.MonthClosing];
        const dateClosing: string = hasClosingDate
          ? `${company[CompanyViewDTOFields.DayClosing]}/${company[CompanyViewDTOFields.MonthClosing]}`
          : '';

        let companyData: CompanyFormData = {
          ...methods.getValues(),
          [CompanyDetailFormFields.Company]: { ...company },
          [CompanyDetailFormFields.DateClosing]: dateClosing,
          [CompanyDetailFormFields.PhonesList]: phonesList,
          [CompanyDetailFormFields.Mail]: mail[CompanyMailFields.Mail],
          // @ts-ignore
          [CompanyDetailFormFields.Address]: addressList,
        };
        methods.reset(companyData);
        setPreviousCompany(companyData);
        setLoading(false);
      })
      .catch(() => {
        snackbarError('Error al cargar los datos');
        setLoading(false);
      });
  }, []);

  const onSubmit = (data: CompanyFormData) => {
    showLoader();
    const mappedAddressList: CompanyAddressInsertDTO[] = (data[
      CompanyDetailFormFields.Address
    ] as CompanyAddressInsertDTO[]).map((address: CompanyAddressInsertDTO) => {
      return {
        ...address,
        [CompanyAddressInsertDTOFields.Apartment]:
          address[CompanyAddressInsertDTOFields.Floor],
        codModulo: 1,
        codOrigen: 1,
      };
    });

    const mappedPhonesList: CompanyPhoneInsertDTO[] = data[
      CompanyDetailFormFields.PhonesList
    ].map((phone) => {
      return {
        ...phone,
        [EntityPhoneNumberFields.MainPhone]:
          phone[EntityPhoneNumberFields.MainPhone] || false,
        codModulo: 1,
        codOrigen: 1,
      };
    });

    data[CompanyDetailFormFields.Company][CompanyViewDTOFields.Web] =
      data[CompanyDetailFormFields.Web];

    Promise.all([
      insertCompanyPhoneNumber(mappedPhonesList),
      insertCompanyMail(data[CompanyDetailFormFields.Mail]),
      insertCompanyAddressList(mappedAddressList),
      updateClosingDate(data[CompanyDetailFormFields.DateClosing]),
      HttpCompany.updateCompany(companyId, {
        ...data[CompanyDetailFormFields.Company],
      }),
    ])
      .then(() => {
        loadData();
        hideLoader();
        snackbarSuccess('Datos de la empresa guardado correctamente');
        onReload && onReload();
      })
      .catch(() => {
        snackbarError('Error al guardar los datos de la empresa');
        loadData();
        hideLoader();
      });
  };

  const onCloseEdit = () => methods.reset(previousCompany);

  const renderPdfView = () => {
    if (domElementRef?.current && exportPdf) {
      // @ts-ignore
      html2canvas(domElementRef.current, {
        onclone: (document) => {
          // @ts-ignore
          document.getElementById('hideThis').style.visibility = 'hidden';
        },
      }).then((canvas: HTMLCanvasElement) => {
        const imgData = canvas.toDataURL('image/png');

        const pdf = new JsPDF({
          unit: 'mm',
          format: 'a4',
        });

        pdf.addImage(imgData, 'JPEG', 35, 5, 142, 280);
        pdf.save('datosEmpresa.pdf');
      });
    }
  };

  useEffect(() => {
    if (companyId) loadData();
  }, [companyId]);

  const handleSubmit = async () => {
    await methods.handleSubmit(onSubmit)();
  };

  const handleDiscard = () => {
    onCloseEdit();
  };

  renderPdfView();

  const docsButton = onScrollToDocs ? (
    <Button 
      variant={'outlined'}
      color={'secondary'}
      size={'small'}
      onClick={onScrollToDocs}
      startIcon={<PaperclipIcon size={18} />}
    >
      Documentos relacionados
    </Button>
  ) : null;

  return (
    <FormProvider {...methods}>
      {company && !loading ? (
        <CardEditingWithContext 
          title="General"
          onDiscard={handleDiscard}
          onSubmit={handleSubmit}
          useAppCommon
          additionalActions={docsButton}
          btnProps={{variant: 'contained'}}
        >
          <div ref={domElementRef}>
            <CompanyDetailForm />
          </div>
        </CardEditingWithContext>
      ) : (
        <CardEditingWithContext 
          title="General"
          onDiscard={() => {}}
          onSubmit={async () => {}}
          btnProps={{variant: 'contained', size: 'medium'}}
          discardBtnProps={{size: 'medium'}}
          additionalActions={docsButton}
        >
          <Grid container spacing={2}>
            {Array.from({ length: 10 }).map((d, k) => (
              <Grid item md={6} xs={12} key={k}>
                <Skeleton height={60} />
              </Grid>
            ))}
          </Grid>
        </CardEditingWithContext>
      )}
    </FormProvider>
  );
}

export default CompanyDetailCard;
