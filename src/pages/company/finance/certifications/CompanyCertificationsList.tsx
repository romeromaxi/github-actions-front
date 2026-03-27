import React, { useContext, useEffect, useState } from 'react';
import { Alert, Grid } from '@mui/material';

import { AddButton } from 'components/buttons/Buttons';

import { HttpCompanyCertifications } from 'http/index';

import { CompanyFinanceHeader } from 'types/company/companyFinanceInformationData';

import CompanyFinanceHeaderDrawer from '../CompanyFinanceHeaderDrawer';
import { LayoutHomeContext } from '../../../../layouts/home/LayoutHome';
import CardLoading from '../../../../components/cards/CardLoading';
import CompanyCertificationEditCard from './CompanyCertificationEditCard';
import CompanyCertificacionCard from './CompanyCertificationCard';
import BoxNewEntity from '../../../../components/misc/BoxNewEntity';
import {useApplicationCommon} from "hooks/contexts/ApplicationCommonContext";

export const CompanyCertificationListContext = React.createContext({
  isEditing: false,
  certificationHeader: undefined as CompanyFinanceHeader | undefined,
  reloadCertificationHeader: () => {},
});
function CompanyCertificationsList() {
  const { companyId } = useApplicationCommon();

  const [editing, setEditing] = useState<boolean>(false);
  const [openDrawerNew, setOpenDrawerNew] = useState<boolean>(false);
  const [listHeaderCertifications, setListHeaderCertifications] =
    useState<CompanyFinanceHeader[]>();
  const [newCertification, setNewCertification] =
    useState<CompanyFinanceHeader>();

  const onShowList = () => {
    setNewCertification(undefined);
    setEditing(false);
  };

  const handleEdit = (companyFinanceHeader: CompanyFinanceHeader) => {
    setEditing(true);
    setNewCertification(companyFinanceHeader);
  };

  useEffect(() => {
    searchHeaderCertifications();
  }, []);

  const searchHeaderCertifications = () => {
    setListHeaderCertifications(undefined);

    HttpCompanyCertifications.getHeaderByCompany(companyId).then((res) => {
      onShowList();
      setListHeaderCertifications(res);
    });
  };

  const mapWithoutData = () => (
    <Grid item xs={12}>
      <Alert severity={'info'}>
        Al parecer no encontramos certificaciones sobre la empresa
      </Alert>
    </Grid>
  );

  const mapLoading = () =>
    Array.from(Array(3).keys()).map((item) => (
      <Grid item xs={12} key={`keyCardBaseLoading_${item}`}>
        <CardLoading />
      </Grid>
    ));
  const onNewCertification = () => {
    setOpenDrawerNew(false);
    searchHeaderCertifications();
  };

  return (
    <>
      <Grid container item xs={12} justifyContent="center">
        <Grid container spacing={2} item xs={12} sx={{ marginTop: '5px' }}>
          {!listHeaderCertifications ? (
            mapLoading()
          ) : newCertification ? (
            <CompanyCertificationListContext.Provider
              value={{
                isEditing: editing,
                certificationHeader: newCertification,
                reloadCertificationHeader: searchHeaderCertifications,
              }}
            >
              <Grid item xs={12}>
                <CompanyCertificationEditCard
                  certificationHeader={newCertification}
                  onShowList={onShowList}
                />
              </Grid>
            </CompanyCertificationListContext.Provider>
          ) : !listHeaderCertifications.length ? (
            mapWithoutData()
          ) : (
            listHeaderCertifications.map((headerCertification, idx) => (
              <Grid item xs={12} md={6} key={`certification_${idx}`}>
                <CompanyCertificacionCard
                  certificationHeader={headerCertification}
                  onReload={searchHeaderCertifications}
                  triggerEdit={handleEdit}
                />
              </Grid>
            ))
          )}
        </Grid>
      </Grid>

      {!editing && (
        <Grid
          container
          item
          xs={12}
          md={6}
          sx={{ marginTop: '24px' }}
          justifyContent={'flex-end'}
        >
          <BoxNewEntity
            title={'Agregar Certificación'}
            subtitle={`Hacé click sobre el botón para agregar una Certificación`}
            onClickNew={() => setOpenDrawerNew(true)}
            horizontal={false}
          />
        </Grid>
      )}

      <CompanyFinanceHeaderDrawer
        show={openDrawerNew}
        title="Certificación"
        companyId={companyId}
        onFinishProcess={onNewCertification}
        onSubmit={HttpCompanyCertifications.insert}
        onCloseDrawer={() => setOpenDrawerNew(false)}
      />
    </>
  );
}

export default CompanyCertificationsList;
