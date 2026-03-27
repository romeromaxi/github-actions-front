import React, { Fragment, useState } from 'react';
import {Grid} from '@mui/material';
import { userStorage } from 'util/localStorage/userStorage';
import { SubTitle } from 'components/text/SubTitle';
import NewCompanyAfipData from '../../../../company/newCompany/NewCompanyAfipData';
import FromMarketNewCompanyForm from '../../../components/forms/FromMarketNewCompanyForm';
import { HttpUser } from 'http/index';
import { UserModelViewFields } from 'types/user';
import { ValidationStatesType } from 'types/person/personEnums';
import {
  CompanyKeyData,
  CompanyKeyDataFields,
} from 'types/company/companyData';
import ValidateUserIdentityDialog from "../../../../user/components/ValidateUserIdentityDialog";
import { PublicEntityEnums } from 'util/typification/publicEntityEnums';
import NewCompanyFinishProcessForm from "../../../../company/newCompany/NewCompanyFinishProcessForm";

interface NewCompanyBaseFormProcessProps {
  onSubmit: () => void;
  forbidOwnCuit?: boolean;
  onSamePerson?: () => void;
  currentProcess?: NewCompanyBaseProcess,
  setCurrentProcess: (arg?: NewCompanyBaseProcess) => void,
  setHideButton: (arg: boolean) => void,
  onReload: () => void;
  setIsResponsible: (arg: boolean) => void;
}

export enum NewCompanyBaseProcess {
  Validation = 'validacion',
  Synchronization = 'sincronizacion',
  CompanyForm = 'formEmpresa',
  FinishCreate = 'finalizacionCreacion'
}
const NewCompanyBaseFormProcess = ({
  onSubmit,
  forbidOwnCuit = false,
  onSamePerson,
  currentProcess,
  setCurrentProcess,
  setHideButton,
  onReload, setIsResponsible
}: NewCompanyBaseFormProcessProps) => {
  const validatedIdentity = userStorage.hasValidatedIdentity();
  const [openValidation, setOpenValidation] = useState<boolean>(!validatedIdentity)
  const [sameCuit, setSameCuit] = useState<boolean>(false);
  const [isResponsible, setIsResp] = useState<boolean>(false);
  const [showTitle, setShowTitle] = useState<boolean>(true);
  const [cuit, setCuit] = useState<string>();
  const [companyKeyData, setCompanyKeyData] = useState<CompanyKeyData>();

  const onSubmitNewCompany = (companyData: CompanyKeyData) => {
    const companyCuit = companyData[CompanyKeyDataFields.CUIT];
    if (cuit) {
      setSameCuit(cuit === companyCuit);
      cuit === companyCuit && onSamePerson && onSamePerson();
    } else {
      const cuitUserStorage = userStorage.getCuit();
      setSameCuit(cuitUserStorage === companyCuit);
      cuitUserStorage === companyCuit && onSamePerson && onSamePerson();
    }
    setCurrentProcess(NewCompanyBaseProcess.CompanyForm);
    setCuit(companyCuit);
    setCompanyKeyData(companyData);
  };
  const onValidate = (cuit?: string) => {
    setOpenValidation(false)
    HttpUser.getValidateIdentity().then((r) => {
      const statusCode = r[UserModelViewFields.ValidationIdentityStatusCode];
      userStorage.setValidatedIdentityCode(statusCode);
      if (statusCode === ValidationStatesType.Validated)
        userStorage.setValidatedIdentity(true);
      setCurrentProcess(NewCompanyBaseProcess.Synchronization);
      setCuit(cuit);
    });
  };
  
  const onSubmitCompanyForm = (isResponsible: boolean, closeDrawer: boolean) => {
    if (closeDrawer) onSubmit()
    else {
      onReload()
      setCurrentProcess(NewCompanyBaseProcess.FinishCreate)
      setIsResp(isResponsible)
      setIsResponsible(isResponsible)
    }
  }
  
  const renderProcess = () => {
    if (currentProcess == NewCompanyBaseProcess.Validation)
      return (
        <Fragment>
          <ValidateUserIdentityDialog open={openValidation} onClose={() => {}} onReload={onValidate} />
        </Fragment>
      );
    else if (currentProcess == NewCompanyBaseProcess.Synchronization)
      return (
        <Fragment>
          {showTitle && (
            <Grid item xs={12}>
              <SubTitle text={`Sincronización con ${PublicEntityEnums.ARCA}`} />
            </Grid>
          )}
          <Grid item xs={12}>
            <NewCompanyAfipData
              onSubmitted={onSubmitNewCompany}
              canSyncOwnCuit={!forbidOwnCuit}
              marketRegister
              onHideTitle={() => {
                setShowTitle(!showTitle)
              }}
              handleWithoutForm={() => setHideButton(true)}
              handleBackForm={() => {
                setHideButton(false)
              }}
            />
          </Grid>
        </Fragment>
      );
    else if (currentProcess == NewCompanyBaseProcess.CompanyForm)
      return (
        <Grid item xs={12}>
          {companyKeyData && (
            <FromMarketNewCompanyForm
              onSubmitted={onSubmitCompanyForm}
              samePerson={sameCuit}
              companyKeyData={companyKeyData}
              handleWithoutForm={() => {
                setHideButton(true)
                setCuit(undefined)
              }}
            />
          )}
        </Grid>
      );
    else if (currentProcess == NewCompanyBaseProcess.FinishCreate) {
      return (
          <Grid item xs={12}>
            {
              companyKeyData && (
                  <NewCompanyFinishProcessForm
                      isResponsible={isResponsible}
                      companyKeyData={companyKeyData}
                      onSubmit={onSubmit}
                  />
              )
            }
          </Grid>
      )
    } 
  };

  return (
    <Grid container spacing={2}>
      {renderProcess()}
    </Grid>
  );
};

export default NewCompanyBaseFormProcess;
