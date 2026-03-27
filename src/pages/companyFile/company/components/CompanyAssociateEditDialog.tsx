import {
  CompanyPersonRelationship,
  CompanyPersonRelationshipFields,
  RelatedPersonWithReferentialDataFields,
  SocietyPerson,
  SocietyPersonaUpdate,
  SocietyPersonFields,
} from '../../../../types/company/companySocietyData';
import { Dialog, DialogContent } from '@mui/material';
import BaseDialogTitle from '../../../../components/dialog/BaseDialogTitle';
import {
  CompanyPersonAddressViewDTO,
  CompanyPersonMailViewDTO,
  CompanyPersonPersonalDataInsert, CompanyPersonPersonalDataInsertFields,
  CompanyPersonPersonalDataView,
  CompanyPersonPhoneViewDTO,
} from '../../../../types/company/companyPersonReferentialData';
import {
  EntityAddress,
  EntityAddressFields,
  EntityAddressInsert,
  EntityMail,
  EntityMailFields,
  EntityMailInsert,
  EntityPhoneNumber,
} from '../../../../types/general/generalReferentialData';
import React, { useContext, useEffect, useState } from 'react';
import { useAction } from '../../../../hooks/useAction';
import { CompanyRelatedPersonBaseListContext } from '../../../company/relatedPeople/CompanyRelatedPersonBaseList';
import * as yup from 'yup';
import {
  RequiredPercentSchema,
  RequiredSelectSchema,
} from '../../../../util/validation/validationSchemas';
import { FormProvider, useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup/dist/yup';
import {
  HttpCompanyPersonAddress,
  HttpCompanyPersonMail,
  HttpCompanyPersonPhoneNumber,
  HttpCompanyRelationship,
  HttpCompanySociety,
} from '../../../../http';
import { EntityWithIdFields } from '../../../../types/baseEntities';
import { PersonMailFields } from '../../../../types/person/personReferentialData';
import { MailTypes } from '../../../../types/general/generalEnums';
import RelatedPersonEditComponent from '../../../company/relatedPeople/components/RelatedPersonEditComponent';
import CardEditingBaseWithoutDetail from '../../../../components/cards/CardEditingBaseWithoutDetail';

interface CompanyAssociateEditDialogProps {
  open: boolean;
  onClose: () => void;
  person: CompanyPersonRelationship;
  onSubmitEdit: () => void;
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

const CompanyAssociateEditDialog = (props: CompanyAssociateEditDialogProps) => {
  const { showLoader, hideLoader } = useAction();
  const [fianceId, setFianceId] = useState<number>()
  const { reloadRelatedPerson } = useContext(
    CompanyRelatedPersonBaseListContext,
  );
  const hasParticipation = !!props.person[
      CompanyPersonRelationshipFields.ParticipationPercent
      ];
  const companyId: number = props.person[SocietyPersonFields.CompanyId];
  const personId: number = props.person[SocietyPersonFields.PersonId];

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
        [RelationshipEditFormFields.SocietyPerson]: props.person,
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

  const insertPhoneNumbers = async (phones: EntityPhoneNumber[]) => {
    return HttpCompanyPersonPhoneNumber.insertList(
      props.person[CompanyPersonRelationshipFields.CompanyId],
      personId,
      phones,
    );
  };

  const insertMail = async (mail: EntityMail) => {
    if (mail[PersonMailFields.Mail]) {
      let mailInsert: EntityMailInsert = {
        ...mail,
        [EntityMailFields.MailTypeCode]: MailTypes.Main,
      };

      return HttpCompanyPersonMail.insert(
        props.person[CompanyPersonRelationshipFields.CompanyId],
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
      props.person[CompanyPersonRelationshipFields.CompanyId],
      personId,
      listAddressesToInsert,
    );
  };

  const updatePersonalInformation = (
    person: CompanyPersonPersonalDataInsert,
  ) => {
    const personData: CompanyPersonPersonalDataInsert = {
      ...person,
      [CompanyPersonPersonalDataInsertFields.FiancePersonId]: fianceId
    }
    
    return HttpCompanyRelationship.updatePersonalDataByIdPerson(
      companyId,
      personId, personData,
    );
  };

  const onHandleSumbit = (data: RelationshipEditFormType) => {
    showLoader();
    Promise.all([
      updateCompanySociety(data[RelationshipEditFormFields.SocietyPerson]),
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
        props.onSubmitEdit();
        snackbarSuccess('El registro se ha guardado correctamente');
      })
      .catch(() => snackbarError('Ocurrió un error al guardar el registro'));
  };
  return (
    <Dialog open={props.open} onClose={props.onClose} maxWidth={'md'} fullWidth>
      <BaseDialogTitle
        title={`Edición del socio ${props.person[CompanyPersonRelationshipFields.LastName]} ${props.person?.[CompanyPersonRelationshipFields.Name]}`}
        onClose={props.onClose}
      />
      <DialogContent>
        <RelatedPersonDetailContext.Provider
          value={{
            isLoading,
            relationship: props.person,
            personData,
            personMail,
            personPhones,
            personAddresses,
          }}
        >
          <FormProvider {...methods}>
            <CardEditingBaseWithoutDetail
              editContent={
                <RelatedPersonEditComponent
                  hasParticipation={hasParticipation} setPersonId={setFianceId}
                />
              }
              onSubmitEdit={onHandleSumbit}
            />
          </FormProvider>
        </RelatedPersonDetailContext.Provider>
      </DialogContent>
    </Dialog>
  );
};

export default CompanyAssociateEditDialog;
