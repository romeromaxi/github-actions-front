import React, {useState} from "react";
import {Button, Card, CardContent, CardHeader, Stack} from "@mui/material";
import {DialogAlert} from "components/dialog";
import {EntityWithIdFields} from "types/baseEntities";
import {HttpExportCompanyFile, HttpSolicitation} from "http/index";
import {useSolicitation} from "hooks/contexts/SolicitationsContext";
import {useAction} from "hooks/useAction";
import useAxios from "hooks/useAxios";
import {SolicitationFlagsFields, SolicitationViewDTOFields} from "types/solicitations/solicitationData";
import {CompanyFileContextProvider} from "hooks/contexts/CompanyFileContext";
import {CompanyFileSourceType} from "types/company/companyEnums";
import CompanyPersonalInformationDetailSections, {
  CompanyFileSectionsContext
} from "../../../companyFile/company/CompanyPersonalInformationDetailSections";
import {dateFormatter} from "util/formatters/dateFormatter";
import OffererSolicitationCompanyFilesTable from "../components/OffererSolicitationCompanyFilesTable";
import {
  CompanySolicitationFileHistory,
  CompanySolicitationFileHistoryFields
} from "types/company/companyData";
import {ButtonExportDropdown} from "../../../../components/buttons/ButtonExportDropdown";

export const OffererSolicitationTabCompanyFilesContext = React.createContext({
  fileToDisplay: undefined as CompanySolicitationFileHistory | undefined,
  setFileToDisplay: (_: CompanySolicitationFileHistory | undefined) => { }
})

function OffererSolicitationTabCompanyFiles() {
  const { solicitation, getSolicitation, flags } = useSolicitation();
  const { fetchData, fetchAndDownloadFile } = useAxios();
  const { snackbarSuccess } = useAction();
  
  const [openUpdate, setOpenUpdate] = useState<boolean>(false);
  const [fileToDisplay, setFileToDisplay] = useState<CompanySolicitationFileHistory>();

  const requestUpdate = () => setOpenUpdate(true);

  const onAcceptUpdate = () => {
    if (solicitation)
      fetchData(
        () =>
          HttpSolicitation.requestSolicitationCompanyFile(
            solicitation[EntityWithIdFields.Id],
          ),
        true,
      ).then(() => {
        getSolicitation(solicitation[EntityWithIdFields.Id]);
        setOpenUpdate(false);
        snackbarSuccess('Se ha solicitado la actualización correctamente');
      });
  };

  const onDownlaodCompanyFile = () => {
    if (solicitation)
      fetchAndDownloadFile(
        () => HttpExportCompanyFile.exportToExcelByFile(solicitation[SolicitationViewDTOFields.FileId])
      )
        .then(() => snackbarSuccess('El legajo se ha descargado correctamente'));
  };
  
  const subtitleHeader = (solicitation && solicitation[SolicitationViewDTOFields.RequestEditCompanyFile]) ?
    `Actualización solicitada el ${dateFormatter.toShortDate(solicitation[SolicitationViewDTOFields.LastRequestEditCompanyFileDate])}`
    :
    undefined;
  
  const actionsHeader =
    <Stack direction={{ xs: 'column', md: 'row' }} spacing={1}>
      <ButtonExportDropdown onExportExcel={onDownlaodCompanyFile} size='small' />
      {
        solicitation &&
        (!solicitation[SolicitationViewDTOFields.RequestEditCompanyFile]) &&
        (flags && flags[SolicitationFlagsFields.SolicitationRequestEditCompanyFileAllowed]) &&
          <Button variant={"contained"} size={'small'} onClick={requestUpdate}>
            Pedir actualización
          </Button>
      }
    </Stack>;
  
  const titleHeader = fileToDisplay ? 
    `Legajo N° ${fileToDisplay[CompanySolicitationFileHistoryFields.Index]} - ${dateFormatter.toShortDate(fileToDisplay[CompanySolicitationFileHistoryFields.Date])}` 
    : "Legajo actualizado"
  
  return (
    <OffererSolicitationTabCompanyFilesContext.Provider value={{ fileToDisplay, setFileToDisplay }}>
      <Stack direction={'column'} spacing={3}>
        <Card>
          <CardHeader title={titleHeader}
                      subheader={subtitleHeader}
                      action={actionsHeader}
          />
          
          <CardContent>
            <OffererSolicitationCompanyFilesTable />
          </CardContent>
        </Card>

        {
          solicitation &&
            <CompanyFileSectionsContext.Provider value={{
              editing: false,
              setEditing: () => { }
            }}>
              <CompanyFileContextProvider dataId={fileToDisplay ? fileToDisplay[EntityWithIdFields.Id] : solicitation[SolicitationViewDTOFields.FileId]}
                                          dataSource={CompanyFileSourceType.CompanyFile}
                                          companyFileType={solicitation[SolicitationViewDTOFields.FileTypeCode]}
              >
                  <CompanyPersonalInformationDetailSections context={CompanyFileSectionsContext} />
              </CompanyFileContextProvider>
            </CompanyFileSectionsContext.Provider>
        }  
      </Stack>
      
      
      
      <DialogAlert
        onClose={() => setOpenUpdate(false)}
        open={openUpdate}
        textContent={`¿Estás seguro de que querés solicitar a la empresa la actualización del legajo?`}
        onConfirm={onAcceptUpdate}
        hideTitle
      />
    </OffererSolicitationTabCompanyFilesContext.Provider>
  )
}

export default OffererSolicitationTabCompanyFiles;