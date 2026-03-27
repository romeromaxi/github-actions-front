import React, { useContext, useEffect, useRef, useState } from 'react';
import { Alert, Grid, Stack } from '@mui/material';

import { TitlePage } from 'components/text/TitlePage';

import {
  CompanyPersonRelationship,
  SocietyPerson,
} from 'types/company/companySocietyData';
import { PersonRelationshipTypeClassification } from 'types/company/companyEnums';

import { HttpCompanyRelationship } from 'http/index';

import RelatedPersonCard from './RelatedPersonCard';
import NewRelatedPersonDialog from './NewRelatedPersonDialog';
import { EntityWithIdFields } from 'types/baseEntities';
import RelatedPersonDetail from './RelatedPersonDetail';
import CardLoading from 'components/cards/CardLoading';
import { LayoutHomeContext } from 'layouts/home/LayoutHome';
import html2canvas from 'html2canvas';
import JsPDF from 'jspdf';
import { HttpCompanyRelationshipExport } from 'http/company/HttpCompanyRelationshipExport';
import { ButtonExportDropdown } from 'components/buttons/ButtonExportDropdown';
import { downloadFileBlobHelper } from 'util/helpers';
import BoxNewEntity from '../../../components/misc/BoxNewEntity';
import {useApplicationCommon} from "hooks/contexts/ApplicationCommonContext";

interface CompanyRelatedPersonBaseListProps {
  title?: string;
  titleDrawer: string;
  labelButton: string;
  textIfDataNotFound: string;
  relationshipClassification: PersonRelationshipTypeClassification;
}

export const CompanyRelatedPersonBaseListContext = React.createContext({
  relationshipClassification:
    PersonRelationshipTypeClassification.Society as PersonRelationshipTypeClassification,
  hasParticipation: false,
  editing: false,
  reloadRelatedPerson: () => {},
});

function CompanyRelatedPersonBaseList({
  title,
  titleDrawer,
  labelButton,
  textIfDataNotFound,
  relationshipClassification,
}: CompanyRelatedPersonBaseListProps) {
  const { companyId } = useApplicationCommon();

  const [openDialogNew, setOpenDialogNew] = useState<boolean>(false);
  const [listRelationships, setListRelationships] = useState<SocietyPerson[]>();
  const [personDetail, setPersonDetail] = useState<CompanyPersonRelationship>();
  const [editing, setEditing] = useState<boolean>(false);
  const [exportPdf, setExportPdf] = useState<boolean>(false);
  const showList: boolean = !personDetail;
  const hasParticipation: boolean =
    relationshipClassification === PersonRelationshipTypeClassification.Society;
  const domElementRef = useRef(null);

  const onShowList = () => {
    setPersonDetail(undefined);
    setEditing(false);
  };

  const onHandleEdit = (relationship: CompanyPersonRelationship) => {
    setEditing(true);
    setPersonDetail(relationship);
  };

  useEffect(() => {
    searchRelatedPerson();
  }, []);

  const searchRelatedPerson = () => {
    setListRelationships(undefined);

    HttpCompanyRelationship.getRelationshipByClassification(
      companyId,
      relationshipClassification,
    ).then((response) => {
      setListRelationships(response);
      onShowList();
    });
  };

  const onNewPersonSubmit = () => {
    setOpenDialogNew(false);
    searchRelatedPerson();
  };

  const mapRelatedPerson = () =>
    listRelationships?.map((relationship) => (
      <Grid
        item
        xs={12}
        sm={6}
        md={4}
        key={`key_RelatedPerson_${relationshipClassification}_${relationship[EntityWithIdFields.Id]}`}
      >
        <RelatedPersonCard
          relationship={relationship as CompanyPersonRelationship}
          onEdit={onHandleEdit}
          onReload={searchRelatedPerson}
        />
      </Grid>
    ));

  const onExportExcel = () => {
    HttpCompanyRelationshipExport.exportListToExcel(
      companyId,
      relationshipClassification,
    ).then(downloadFileBlobHelper);
  };

  const buildExportButton = () =>
    listRelationships?.length !== 0 && (
      <ButtonExportDropdown onExportExcel={onExportExcel} />
    );

  const renderPdfView = () => {
    if (domElementRef?.current && exportPdf) {
      // @ts-ignore
      html2canvas(domElementRef.current, {
        /*onclone: document => {
                    // @ts-ignore
                    document.querySelector(".hideButtonsInPdf").style.visibility = "hidden"
                }*/
      }).then((canvas: HTMLCanvasElement) => {
        const imgData = canvas.toDataURL('image/png');

        const pdf = new JsPDF({
          unit: 'mm',
          format: 'a4',
          orientation: 'l',
        });

        pdf.addImage(imgData, 'JPEG', 5, 5, 297, 40);
        pdf.save('personasEmpresa.pdf');
      });
    }
  };
  renderPdfView();

  return (
    <>
      <Grid container item xs={12} justifyContent="center">
        <Grid item xs={12} mb={2}>
          <Stack
            direction="row-reverse"
            justifyContent="space-between"
            alignItems="center"
          >
            {showList && (
              <>
                <Stack direction={'row'} spacing={3}>
                  {buildExportButton()}
                </Stack>

                {title && <TitlePage text={title} />}
              </>
            )}
          </Stack>
        </Grid>

        {listRelationships ? (
          <CompanyRelatedPersonBaseListContext.Provider
            value={{
              reloadRelatedPerson: searchRelatedPerson,
              relationshipClassification: relationshipClassification,
              hasParticipation: hasParticipation,
              editing: editing,
            }}
          >
            {personDetail ? (
              <Grid container spacing={1}>
                <Grid item xs={12}>
                  <RelatedPersonDetail
                    relationship={personDetail}
                    onShowList={onShowList}
                  />
                </Grid>
              </Grid>
            ) : listRelationships.length ? (
              <Grid container spacing={2} item xs={12} ref={domElementRef}>
                {mapRelatedPerson()}
                <Grid item xs={12} sm={6} md={4}>
                  <BoxNewEntity
                    title={labelButton}
                    subtitle={`Hacé click sobre el botón para ${labelButton}`}
                    onClickNew={() => setOpenDialogNew(true)}
                    horizontal={false}
                  />
                </Grid>
              </Grid>
            ) : (
              <Grid container spacing={2}>
                {/*<Grid item xs={12}>
                                                <Alert severity={'info'}>{textIfDataNotFound}</Alert>
                                            </Grid>*/}
                <Grid item xs={12} sm={6} md={4}>
                  <BoxNewEntity
                    title={labelButton}
                    subtitle={`Hacé click sobre el botón para ${labelButton}`}
                    onClickNew={() => setOpenDialogNew(true)}
                    horizontal={false}
                  />
                </Grid>
              </Grid>
            )}
          </CompanyRelatedPersonBaseListContext.Provider>
        ) : (
          <Grid container spacing={2} item xs={12}>
            {Array.from(Array(3).keys()).map((item) => (
              <Grid item xs={4} key={`keyCardLoading_${item}`}>
                <CardLoading />
              </Grid>
            ))}
          </Grid>
        )}
      </Grid>

      <NewRelatedPersonDialog
        show={openDialogNew}
        title={titleDrawer}
        companyId={companyId}
        relationshipTypeClassification={relationshipClassification}
        onCloseDrawer={() => setOpenDialogNew(false)}
        onFinishProcess={onNewPersonSubmit}
      />
    </>
  );
}

export default CompanyRelatedPersonBaseList;
