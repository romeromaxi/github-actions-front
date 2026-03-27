import React, {useContext, useEffect, useState} from 'react';
import {Stack} from '@mui/material';
import {FormProvider, useForm} from 'react-hook-form';
import {
    RelatedPersonWithReferentialDataFields,
    SocietyPersonFields,
} from 'types/company/companySocietyData';
import {
    EntityAddress,
    EntityMail,
    EntityPhoneNumber,
} from 'types/general/generalReferentialData';
import CardEditingBaseWithoutDetail from 'components/cards/CardEditingBaseWithoutDetail';
import {SaveButton} from 'components/buttons/Buttons';
import {ButtonExportDropdown} from 'components/buttons/ButtonExportDropdown';
import {PersonRelationshipTypeClassification} from 'types/company/companyEnums';
import RelatedPersonMultipleRelationshipEditComponent
    from './components/RelatedPersonMultipleRelationshipEditComponent';
import {EntityWithIdFields} from 'types/baseEntities';
import * as yup from 'yup';
import {REQUIRED_FIELD_MESSAGE, RequiredPercentSchema, RequiredStringSchema,} from 'util/validation/validationSchemas';
import {yupResolver} from '@hookform/resolvers/yup/dist/yup';
import {CompanyRelatedPersonTableContext} from './RelatedPersonTable';
import RelatedPersonDocumentList from './components/RelatedPersonDocumentList';
import {WrapperIcons} from "../../../components/icons/Icons";
import {FolderSimple} from "phosphor-react";
import {NavsTabHorizontal} from "../../../components/navs/NavsTab";
import {FileText} from "@phosphor-icons/react";
import {
    PersonPersonalDataView, PersonRelationship,
    PersonRelationshipFields,
    PersonRelationshipFilterFields,
    PersonRelationshipFormFields,
    PersonRelationshipInsertFormType
} from 'types/person/personData';
import {RelatedPersonContext} from 'hooks/contexts/RelatedPersonContext';

interface RelatedPersonMultipleRelationshipDetailProps {
  relationship: PersonRelationship;
  reloadTable: () => void;
  legalPerson?: boolean;
  isCollapsible?: boolean;
  shouldSubmit?: boolean;
  setShouldSubmit?: (value: boolean) => void;
  onDirtyChange?: (isDirty: boolean) => void;
  onResetReady?: (reset: () => void) => void;
  onAfterSave?: () => void;
}

export enum RelationshipEditFormFields {
  SocietyPerson = 'relationship',
  PersonInformation = 'personInformation',
  Phone = 'phone',
  Mail = 'mail',
  AddressList = 'otherAddresses',
}

export interface RelationshipEditFormType {
  [RelationshipEditFormFields.SocietyPerson]: PersonRelationshipInsertFormType;
  [RelationshipEditFormFields.PersonInformation]: PersonPersonalDataView;
  [RelationshipEditFormFields.Phone]: EntityPhoneNumber[];
  [RelationshipEditFormFields.Mail]: EntityMail;
  [RelationshipEditFormFields.AddressList]: EntityAddress[];
}

export const RelatedPersonMultipleRelationshipDetailContext =
  React.createContext({
    isLoading: false,
    relationship: {} as PersonRelationship | undefined,
    personData: {} as PersonPersonalDataView | undefined,
    personPhones: [] as EntityPhoneNumber[] | undefined,
    personMail: {} as EntityMail | undefined,
    personAddresses: [] as EntityAddress[] | undefined,
  });

function RelatedPersonMultipleRelationshipDetail({
  relationship,
  legalPerson,
  reloadTable,
  isCollapsible,
  shouldSubmit,
  setShouldSubmit,
  onDirtyChange,
  onResetReady,
  onAfterSave
}: RelatedPersonMultipleRelationshipDetailProps) {
  const { reloadRelatedPerson } = useContext(CompanyRelatedPersonTableContext);
  const { handleUpdate, handleExport, promiseReferentialData, allowsExport, allowsDocumentation } = useContext(RelatedPersonContext)

  const [fianceId, setFianceId] = useState<number>()
  const companyPersonId: number = relationship[EntityWithIdFields.Id];
  const personId: number = relationship[SocietyPersonFields.PersonId];
  const relationshipId: number = relationship[EntityWithIdFields.Id];
  const relationshipForm: PersonRelationshipInsertFormType = {
    ...relationship,
    [PersonRelationshipFormFields.IsMember]:
      !!relationship[PersonRelationshipFields.ParticipationPercent],
    [PersonRelationshipFormFields.IsSpouse]:
      !!relationship[PersonRelationshipFields.PositionSpouseDesc],
    [PersonRelationshipFormFields.IsAuthority]:
      !!relationship[PersonRelationshipFields.PositionAuthorityDesc],
    [PersonRelationshipFormFields.IsEmployee]:
      !!relationship[PersonRelationshipFields.PositionEmployeeDesc],
    [PersonRelationshipFormFields.IsOther]:
      !!relationship[PersonRelationshipFields.PositionOthersDesc],
  };

  const [isLoading, setLoading] = useState<boolean>(true);
  const [personData, setPersonaData] = useState<PersonPersonalDataView>(
    {} as PersonPersonalDataView,
  );
  const [personPhones, setPersonPhones] = useState<EntityPhoneNumber[]>(
    [],
  );
  const [personMail, setPersonMail] = useState<EntityMail>(
    {} as EntityMail,
  );
  const [personAddresses, setPersonAddresses] = useState<
    EntityAddress[]
  >([]);
  const [resetValues, setResetValues] = useState<RelationshipEditFormType>();

  const relationshipUpdateFormSchema = yup
    .object()
    .test(
      PersonRelationshipFields.ParticipationPercent,
      REQUIRED_FIELD_MESSAGE,
      async (obj) => {
        if (
          !legalPerson ||
          !obj[RelationshipEditFormFields.SocietyPerson][
            PersonRelationshipFormFields.IsMember
          ]
        )
          return true;

        let errorDesc;
        try {
          await RequiredPercentSchema.validate(
            obj[RelationshipEditFormFields.SocietyPerson][
              PersonRelationshipFields.ParticipationPercent
            ],
          );
        } catch (err: any) {
          errorDesc = err.message;
        }

        if (!!errorDesc)
          return new yup.ValidationError(
            errorDesc,
            null,
            `${RelationshipEditFormFields.SocietyPerson}.${PersonRelationshipFields.ParticipationPercent}`,
          );

        return true;
      },
    )
    .test(
      PersonRelationshipFields.PositionSpouseDesc,
      REQUIRED_FIELD_MESSAGE,
      async (obj) => {
        if (
          legalPerson ||
          !obj[RelationshipEditFormFields.SocietyPerson][
            PersonRelationshipFormFields.IsSpouse
          ]
        )
          return true;

        let errorDesc;
        try {
          await RequiredStringSchema.validate(
            obj[RelationshipEditFormFields.SocietyPerson][
              PersonRelationshipFields.PositionSpouseDesc
            ],
          );
        } catch (err: any) {
          errorDesc = err.message;
        }

        if (!!errorDesc)
          return new yup.ValidationError(
            errorDesc,
            null,
            `${RelationshipEditFormFields.SocietyPerson}.${PersonRelationshipFields.PositionSpouseDesc}`,
          );

        return true;
      },
    )
    .test(
      PersonRelationshipFields.PositionAuthorityDesc,
      REQUIRED_FIELD_MESSAGE,
      async (obj) => {
        if (
          !obj[RelationshipEditFormFields.SocietyPerson][
            PersonRelationshipFormFields.IsAuthority
          ]
        )
          return true;

        let errorDesc;
        try {
          await RequiredStringSchema.validate(
            obj[RelationshipEditFormFields.SocietyPerson][
              PersonRelationshipFields.PositionAuthorityDesc
            ],
          );
        } catch (err: any) {
          errorDesc = err.message;
        }

        if (!!errorDesc)
          return new yup.ValidationError(
            errorDesc,
            null,
            `${RelationshipEditFormFields.SocietyPerson}.${PersonRelationshipFields.PositionAuthorityDesc}`,
          );

        return true;
      },
    )
    .test(
      PersonRelationshipFields.PositionEmployeeDesc,
      REQUIRED_FIELD_MESSAGE,
      async (obj) => {
        if (
          !obj[RelationshipEditFormFields.SocietyPerson][
            PersonRelationshipFormFields.IsEmployee
          ]
        )
          return true;

        let errorDesc;
        try {
          await RequiredStringSchema.validate(
            obj[RelationshipEditFormFields.SocietyPerson][
              PersonRelationshipFields.PositionEmployeeDesc
            ],
          );
        } catch (err: any) {
          errorDesc = err.message;
        }

        if (!!errorDesc)
          return new yup.ValidationError(
            errorDesc,
            null,
            `${RelationshipEditFormFields.SocietyPerson}.${PersonRelationshipFields.PositionEmployeeDesc}`,
          );

        return true;
      },
    )
    .test(
      PersonRelationshipFields.PositionOthersDesc,
      REQUIRED_FIELD_MESSAGE,
      async (obj) => {
        if (
          !obj[RelationshipEditFormFields.SocietyPerson][
            PersonRelationshipFormFields.IsOther
          ]
        )
          return true;

        let errorDesc;
        try {
          await RequiredStringSchema.validate(
            obj[RelationshipEditFormFields.SocietyPerson][
              PersonRelationshipFields.PositionOthersDesc
            ],
          );
        } catch (err: any) {
          errorDesc = err.message;
        }

        if (!!errorDesc)
          return new yup.ValidationError(
            errorDesc,
            null,
            `${RelationshipEditFormFields.SocietyPerson}.${PersonRelationshipFields.PositionOthersDesc}`,
          );

        return true;
      },
    );

  const methods = useForm<RelationshipEditFormType>({
    defaultValues: {
      [RelationshipEditFormFields.SocietyPerson]: relationshipForm,
    },
    resolver: yupResolver(relationshipUpdateFormSchema),
  });

  useEffect(() => {
    setLoading(true);
      promiseReferentialData(
      personId
    ).then((data) => {
      setPersonaData(data[RelatedPersonWithReferentialDataFields.Person]);
      setPersonPhones(data[RelatedPersonWithReferentialDataFields.Phone]);
      setPersonMail(data[RelatedPersonWithReferentialDataFields.Mail]);
      setPersonAddresses(
        data[RelatedPersonWithReferentialDataFields.ListAddressess],
      );

      const values = {
        [RelationshipEditFormFields.SocietyPerson]: relationshipForm,
        [RelationshipEditFormFields.PersonInformation]:
          data[RelatedPersonWithReferentialDataFields.Person],
        [RelationshipEditFormFields.Phone]:
          data[RelatedPersonWithReferentialDataFields.Phone],
        [RelationshipEditFormFields.Mail]:
          data[RelatedPersonWithReferentialDataFields.Mail],
        [RelationshipEditFormFields.AddressList]:
          data[RelatedPersonWithReferentialDataFields.ListAddressess],
      };

      methods.reset(values);
      setResetValues(values);
      setLoading(false);
    });
  }, []);

  useEffect(() => {
    onDirtyChange?.(methods.formState.isDirty);
  }, [methods.formState.isDirty, onDirtyChange]);

  useEffect(() => {
    if (!onResetReady) return;

    onResetReady(() => {
      if (resetValues) {
        methods.reset(resetValues);
      }
    });
  }, [methods, onResetReady, resetValues]);

  const afterUpdate = () => {
      reloadRelatedPerson({
          [PersonRelationshipFilterFields.ListRelationshipTypes]: [],
      })
  }
  const onHandleSubmit = (data: RelationshipEditFormType) => {
      handleUpdate(data, relationshipId, fianceId, () => {
        afterUpdate();
        onAfterSave?.();
      })
  };

  useEffect(() => {
    if (shouldSubmit && setShouldSubmit) {
      methods.handleSubmit(onHandleSubmit)();
      setShouldSubmit(false);
    }
  }, [shouldSubmit, setShouldSubmit]);

  const onExportExcel = () => {
      handleExport(
          personId,
          relationship[
            PersonRelationshipFields.PersonRelationshipTypeClassificationCode
          ] as PersonRelationshipTypeClassification,
      );
  };

  const renderTitle = () => (
      <Stack
        direction={'row-reverse'}
        spacing={1}
        alignItems={'center'}
      >
        <SaveButton onClick={methods.handleSubmit(onHandleSubmit)} id={"company-related-person-save-btn"}>
            Guardar
        </SaveButton>
          {allowsExport && <ButtonExportDropdown onExportExcel={onExportExcel} id={"company-related-person-export-btn"}/>}
      </Stack>
  );

  return (
    isCollapsible ? (
      <RelatedPersonMultipleRelationshipDetailContext.Provider
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
          <RelatedPersonMultipleRelationshipEditComponent
            legalPerson={legalPerson} 
            setPersonId={setFianceId}
          />
        </FormProvider>
      </RelatedPersonMultipleRelationshipDetailContext.Provider>
    ) : allowsDocumentation ? (
        <NavsTabHorizontal lstTabs={[
            {
                tabList: [
                    {
                        label: 'Información general',
                        icon: <WrapperIcons Icon={FileText} size={'sm'} />,
                        iconPosition: 'start', default: true,
                        content: 
                            <RelatedPersonMultipleRelationshipDetailContext.Provider
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
                                        <RelatedPersonMultipleRelationshipEditComponent
                                            legalPerson={legalPerson} setPersonId={setFianceId}
                                        />
                                    }
                                    onSubmitEdit={onHandleSubmit}
                                />
                            </FormProvider>
                        </RelatedPersonMultipleRelationshipDetailContext.Provider>
                    },
                    {
                        label: 'Documentación asociada',
                        icon: <WrapperIcons Icon={FolderSimple} size={'sm'} />,
                        content: <RelatedPersonDocumentList companyPersonId={companyPersonId} reloadTable={reloadTable}/>, iconPosition: 'start'
                    }
                ]
            }
        ]}
        />
          ) : (
          <RelatedPersonMultipleRelationshipDetailContext.Provider
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
                          <RelatedPersonMultipleRelationshipEditComponent
                              legalPerson={legalPerson} setPersonId={setFianceId}
                          />
                      }
                      onSubmitEdit={onHandleSubmit}
                  />
              </FormProvider>
          </RelatedPersonMultipleRelationshipDetailContext.Provider>
      )
  );
}

export default RelatedPersonMultipleRelationshipDetail;

