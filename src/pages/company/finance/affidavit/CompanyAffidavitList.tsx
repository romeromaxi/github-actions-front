import React, { useContext, useEffect, useState } from 'react';
import { Alert, Grid } from '@mui/material';

import { AddButton } from 'components/buttons/Buttons';

import { HttpCompanyAffidavit } from 'http/index';
import { CompanyFinanceHeader } from 'types/company/companyFinanceInformationData';
import CompanyFinanceHeaderDrawer from '../CompanyFinanceHeaderDrawer';
import { LayoutHomeContext } from '../../../../layouts/home/LayoutHome';
import CompanyAffidavitEditCard from './CompanyAffidavitEditCard';
import CardLoading from '../../../../components/cards/CardLoading';
import CompanyAffidavitCard from './CompanyAffidavitCard';
import BoxNewEntity from '../../../../components/misc/BoxNewEntity';
import {useApplicationCommon} from "hooks/contexts/ApplicationCommonContext";
export const CompanyAffidavitListContext = React.createContext({
  isEditing: false,
  affidavitHeader: undefined as CompanyFinanceHeader | undefined,
  reloadAffidavitHeader: () => {},
});
function CompanyAffidavitList() {
  const { companyId } = useApplicationCommon();

  const [editing, setEditing] = useState<boolean>(false);
  const [openDrawerNew, setOpenDrawerNew] = useState<boolean>(false);
  const [listHeaderAffidavits, setListHeaderAffidavits] =
    useState<CompanyFinanceHeader[]>();
  const [newAffidavit, setNewAffidavit] = useState<CompanyFinanceHeader>();

  const onShowList = () => {
    setNewAffidavit(undefined);
    setEditing(false);
  };

  const handleEdit = (companyFinanceHeader: CompanyFinanceHeader) => {
    setEditing(true);
    setNewAffidavit(companyFinanceHeader);
  };

  useEffect(() => {
    searchHeaderAffidavits();
  }, []);

  const searchHeaderAffidavits = () => {
    setListHeaderAffidavits(undefined);
    HttpCompanyAffidavit.getHeaderByCompany(companyId).then((res) => {
      onShowList();
      setListHeaderAffidavits(res);
    });
  };

  const mapWithoutData = () => (
    <Grid item xs={12}>
      <Alert severity={'info'}>
        Al parecer no encontramos declaraciones juradas sobre la empresa
      </Alert>
    </Grid>
  );

  const mapLoading = () =>
    Array.from(Array(3).keys()).map((item) => (
      <Grid item xs={12} key={`keyCardBaseLoading_${item}`}>
        <CardLoading />
      </Grid>
    ));

  const onNewAffidavit = () => {
    setOpenDrawerNew(false);
    searchHeaderAffidavits();
  };

  return (
    <>
      <Grid container item xs={12} justifyContent="center">
        <Grid container spacing={2} item xs={12} sx={{ marginTop: '5px' }}>
          {!listHeaderAffidavits ? (
            mapLoading()
          ) : newAffidavit ? (
            <CompanyAffidavitListContext.Provider
              value={{
                isEditing: editing,
                affidavitHeader: newAffidavit,
                reloadAffidavitHeader: searchHeaderAffidavits,
              }}
            >
              <Grid item xs={12}>
                <CompanyAffidavitEditCard
                  affidavitHeader={newAffidavit}
                  onShowList={onShowList}
                />
              </Grid>
            </CompanyAffidavitListContext.Provider>
          ) : !listHeaderAffidavits.length ? (
            mapWithoutData()
          ) : (
            listHeaderAffidavits.map((headerAffidavit, idx) => (
              <Grid item xs={12} md={6} key={`affidavit_${idx}`}>
                <CompanyAffidavitCard
                  affidavitHeader={headerAffidavit}
                  onReload={searchHeaderAffidavits}
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
          sx={{ marginTop: '18px' }}
          justifyContent={'flex-end'}
        >
          {
            /*
                     
                        <AddButton onClick={() => setOpenDrawerNew(true)}>
                            Agregar
                        </AddButton>
                         */
            <BoxNewEntity
              title={'Agregar Declaración Jurada'}
              subtitle={`Hacé click sobre el botón para agregar una Declaración Jurada`}
              onClickNew={() => setOpenDrawerNew(true)}
              horizontal={false}
            />
          }
        </Grid>
      )}

      <CompanyFinanceHeaderDrawer
        show={openDrawerNew}
        title="Declaración Jurada"
        companyId={companyId}
        onFinishProcess={onNewAffidavit}
        onSubmit={HttpCompanyAffidavit.insert}
        onCloseDrawer={() => setOpenDrawerNew(false)}
      />
    </>
  );
}

export default CompanyAffidavitList;
