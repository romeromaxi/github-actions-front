import React, { useContext, useEffect, useState } from 'react';
import { Box, Chip, Grid, Stack, Tooltip } from '@mui/material';
import { FormProvider, useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup/dist/yup';
import {
  CompanyPersonRelationship,
  CompanyPersonRelationshipFields,
  RelatedPersonWithReferentialDataFields,
  SocietyPerson,
  SocietyPersonaUpdate,
  SocietyPersonFields,
} from 'types/company/companySocietyData';
import {
  CompanyPersonAddressViewDTO,
  CompanyPersonMailViewDTO,
  CompanyPersonPersonalDataInsert,
  CompanyPersonPersonalDataView,
  CompanyPersonPhoneViewDTO,
} from 'types/company/companyPersonReferentialData';
import {
  HttpCompanyPersonAddress,
  HttpCompanyPersonMail,
  HttpCompanyPersonPhoneNumber,
  HttpCompanyRelationship,
  HttpCompanySociety,
} from 'http/index';
import { CompanyRelatedPersonBaseListContext } from './CompanyRelatedPersonBaseList';
import RelatedPersonDocumentList from './components/RelatedPersonDocumentList';
import {
  EntityAddress,
  EntityAddressFields,
  EntityAddressInsert,
  EntityMail,
  EntityMailFields,
  EntityMailInsert,
  EntityPhoneNumber
} from 'types/general/generalReferentialData';
import * as yup from 'yup';
import {
  RequiredPercentSchema,
  RequiredSelectSchema,
} from 'util/validation/validationSchemas';

import { EntityWithIdFields } from 'types/baseEntities';
import { PersonMailFields } from 'types/person/personReferentialData';
import { MailTypes } from 'types/general/generalEnums';
import RelatedPersonEditComponent from './components/RelatedPersonEditComponent';
import { useAction } from 'hooks/useAction';
import { stringFormatter } from 'util/formatters/stringFormatter';
import CardEditingBaseWithoutDetail from 'components/cards/CardEditingBaseWithoutDetail';
import { TitlePage } from 'components/text/TitlePage';
import { BackButton, SaveIconButton } from 'components/buttons/Buttons';
import { ButtonIconExportDropdown } from 'components/buttons/ButtonExportDropdown';
import { HttpCompanyRelationshipExport } from 'http/company/HttpCompanyRelationshipExport';
import { PersonRelationshipTypeClassification } from 'types/company/companyEnums';
import { downloadFileBlobHelper } from 'util/helpers';
import useAxios from '../../../hooks/useAxios';

interface RelatedPersonDetailProps {
  relationship: CompanyPersonRelationship;
  onShowList: () => void;
}

export enum RelationshipEditFormFields {
  SocietyPerson = 'relationship',
  PersonInformation = 'personInformation',
  Phone = 'phone',
  Mail = 'mail',
  AddressList = 'otherAddresses',
}

export interface RelationshipEditFormType {
  [RelationshipEditFormFields.SocietyPerson]: SocietyPerson;
  [RelationshipEditFormFields.PersonInformation]: CompanyPersonPersonalDataView;
  [RelationshipEditFormFields.Phone]: EntityPhoneNumber[];
  [RelationshipEditFormFields.Mail]: EntityMail;
  [RelationshipEditFormFields.AddressList]: EntityAddress[];
}

export const RelatedPersonDetailContext = React.createContext({
  isLoading: false,
  relationship: {} as CompanyPersonRelationship | undefined,
  personData: {} as CompanyPersonPersonalDataView | undefined,
  personPhones: [] as CompanyPersonPhoneViewDTO[] | undefined,
  personMail: {} as CompanyPersonMailViewDTO | undefined,
  personAddresses: [] as CompanyPersonAddressViewDTO[] | undefined,
});

function RelatedPersonDetail({
  relationship,
  onShowList,
}: RelatedPersonDetailProps) {
  const { showLoader, hideLoader } = useAction();
  const { fetchData } = useAxios();
  const { reloadRelatedPerson, relationshipClassification } = useContext(
    CompanyRelatedPersonBaseListContext,
  );

  const companyId: number = relationship[SocietyPersonFields.CompanyId];
  const personId: number = relationship[SocietyPersonFields.PersonId];
  const hasParticipation = !!relationship[
      CompanyPersonRelationshipFields.ParticipationPercent
      ];
  const representative: boolean =
    relationshipClassification ===
    PersonRelationshipTypeClassification.Representatives;

  const [isLoading, setLoading] = useState<boolean>(true);
  const { snackbarSuccess, snackbarError } = useAction();
  const [personData, setPersonaData] = useState<CompanyPersonPersonalDataView>(
    {} as CompanyPersonPersonalDataView,
  );
  const [personPhones, setPersonPhones] = useState<CompanyPersonPhoneViewDTO[]>(
    [],
  );
  const [personMail, setPersonMail] = useState<CompanyPersonMailViewDTO>(
    {} as CompanyPersonMailViewDTO,
  );
  const [personAddresses, setPersonAddresses] = useState<
    CompanyPersonAddressViewDTO[]
  >([]);
  const relationshipUpdateFormSchema = hasParticipation
    ? yup.object().shape({
        controlParticipation: yup.boolean(),
        [RelationshipEditFormFields.SocietyPerson]: yup.object({
          [CompanyPersonRelationshipFields.PersonRelationshipTypeCode]:
            RequiredSelectSchema,
          [CompanyPersonRelationshipFields.ParticipationPercent]:
            RequiredPercentSchema,
        }),
      })
    : yup.object().shape({
        controlParticipation: yup.boolean(),
        [RelationshipEditFormFields.SocietyPerson]: yup.object({
          [CompanyPersonRelationshipFields.PersonRelationshipTypeCode]:
            RequiredSelectSchema,
        }),
      });
  const methods = useForm<RelationshipEditFormType>({
    resolver: yupResolver(relationshipUpdateFormSchema),
  });

  useEffect(() => {
    setLoading(true);
    HttpCompanyRelationship.getPersonWithReferentialData(
      companyId,
      personId,
    ).then((data) => {
      setPersonaData(data[RelatedPersonWithReferentialDataFields.Person]);
      setPersonPhones(data[RelatedPersonWithReferentialDataFields.Phone]);
      setPersonMail(data[RelatedPersonWithReferentialDataFields.Mail]);
      setPersonAddresses(
        data[RelatedPersonWithReferentialDataFields.ListAddressess],
      );
      methods.reset({
        [RelationshipEditFormFields.SocietyPerson]: relationship,
        [RelationshipEditFormFields.PersonInformation]:
          data[RelatedPersonWithReferentialDataFields.Person],
        [RelationshipEditFormFields.Phone]:
          data[RelatedPersonWithReferentialDataFields.Phone],
        [RelationshipEditFormFields.Mail]:
          data[RelatedPersonWithReferentialDataFields.Mail],
        [RelationshipEditFormFields.AddressList]:
          data[RelatedPersonWithReferentialDataFields.ListAddressess],
      });
      setLoading(false);
    });
  }, []);

  const updateCompanySociety = async (relationship: SocietyPerson) => {
    let relationshipUpdate: SocietyPersonaUpdate = {
      [CompanyPersonRelationshipFields.PersonRelationshipTypeCode]:
        relationship[
          CompanyPersonRelationshipFields.PersonRelationshipTypeCode
        ],
      [CompanyPersonRelationshipFields.ParticipationPercent]:
        relationship[CompanyPersonRelationshipFields.ParticipationPercent],
    };

    return HttpCompanySociety.update(
      relationship[CompanyPersonRelationshipFields.CompanyId],
      relationship[EntityWithIdFields.Id],
      relationshipUpdate,
    );
  };

  const insertPhoneNumbers = async (phoneList: EntityPhoneNumber[]) => {
    return HttpCompanyPersonPhoneNumber.insertList(
      relationship[CompanyPersonRelationshipFields.CompanyId],
      personId,
      phoneList,
    );
  };

  const insertMail = async (mail: EntityMail) => {
    if (mail[PersonMailFields.Mail]) {
      let mailInsert: EntityMailInsert = {
        ...mail,
        [EntityMailFields.MailTypeCode]: MailTypes.Main,
      };

      return HttpCompanyPersonMail.insert(
        relationship[CompanyPersonRelationshipFields.CompanyId],
        personId,
        mailInsert,
      );
    }
  };

  const insertListAddresses = async (otherAddresses: EntityAddressInsert[]) => {
    let listAddressesToInsert: EntityAddressInsert[] = [];

    otherAddresses.forEach((oneAddress) => {
      if (!!oneAddress[EntityAddressFields.AddressTypeCode])
        listAddressesToInsert.push(oneAddress);
    });

    return HttpCompanyPersonAddress.insertList(
      relationship[CompanyPersonRelationshipFields.CompanyId],
      personId,
      listAddressesToInsert,
    );
  };

  const updatePersonalInformation = (
    person: CompanyPersonPersonalDataInsert,
  ) => {
    return HttpCompanyRelationship.updatePersonalDataByIdPerson(
      companyId,
      personId,
      person,
    );
  };

  const onHandleSubmit = (data: RelationshipEditFormType) => {
    fetchData(
      () =>
        updateCompanySociety(data[RelationshipEditFormFields.SocietyPerson]),
      true,
    ).then(() => {
      showLoader();
      Promise.all([
        updatePersonalInformation(
          data[
            RelationshipEditFormFields.PersonInformation
          ] as CompanyPersonPersonalDataInsert,
        ),
        insertPhoneNumbers(data[RelationshipEditFormFields.Phone]),
        insertMail(data[RelationshipEditFormFields.Mail]),
        insertListAddresses(data[RelationshipEditFormFields.AddressList]),
      ])
        .then(() => {
          hideLoader();
          reloadRelatedPerson();
          snackbarSuccess('El registro se ha guardado correctamente');
        })
        .catch(() => snackbarError('Ocurrió un error al guardar el registro'));
    });
  };

  const onExportExcel = () => {
    HttpCompanyRelationshipExport.exportPersonToExcel(
      companyId,
      personId,
      relationship[
        CompanyPersonRelationshipFields.PersonRelationshipTypeClassificationCode
      ] as PersonRelationshipTypeClassification,
    ).then(downloadFileBlobHelper);
  };

  const renderTitle = () => (
    <Stack
      direction={'row'}
      justifyContent={'space-between'}
      alignItems={'center'}
    >
      <Stack
        direction={'row'}
        justifyContent={'space-between'}
        spacing={3}
        alignItems={'center'}
      >
        {relationship[CompanyPersonRelationshipFields.LegalName]}
        <ButtonIconExportDropdown onExportExcel={onExportExcel} />
        <SaveIconButton
          onClick={methods.handleSubmit(onHandleSubmit)}
          tooltipTitle={'Guardar'}
        />
      </Stack>

      <Tooltip arrow title="CUIT" placement="top" sx={{ mb: 1 }}>
        <Chip
          color="info"
          size="small"
          label={stringFormatter.formatCuit(
            relationship?.[CompanyPersonRelationshipFields.CUIT] ?? '',
          )}
        />
      </Tooltip>
    </Stack>
  );

  return (
    <Grid container spacing={1}>
      <Grid item xs={12}>
        <Stack
          direction="row"
          justifyContent="space-between"
          alignItems="center"
        >
          <TitlePage text="Edición de personal" />
          <Tooltip
            title={
              hasParticipation
                ? 'Volver a todos los Socios'
                : representative
                  ? 'Volver a todos los Representantes'
                  : 'Volver a todos los Responsables'
            }
            placement={'top'}
          >
            <Box>
              <BackButton onClick={onShowList}>
                {hasParticipation
                  ? 'Socios'
                  : representative
                    ? 'Representantes'
                    : 'Responsables'}
              </BackButton>
            </Box>
          </Tooltip>
        </Stack>
      </Grid>
      <Grid item xs={12} md={6}>
        <RelatedPersonDetailContext.Provider
          value={{
            isLoading,
            relationship,
            personData,
            personMail,
            personPhones,
            personAddresses,
          }}
        >
          <FormProvider {...methods}>
            <CardEditingBaseWithoutDetail
              title={renderTitle()}
              editContent={
                <RelatedPersonEditComponent
                  hasParticipation={hasParticipation}
                />
              }
              onSubmitEdit={onHandleSubmit}
            />
          </FormProvider>
        </RelatedPersonDetailContext.Provider>
      </Grid>
      <Grid item xs={12} md={6}>
        <RelatedPersonDocumentList companyId={companyId} personId={personId} />
      </Grid>
    </Grid>
  );
}

export default RelatedPersonDetail;
