import React, {useContext, useEffect, useState} from "react";
import {useSolicitation} from "hooks/contexts/SolicitationsContext";
import {CompanySolicitationFileHistory, CompanySolicitationFileHistoryFields} from "types/company/companyData";
import {HttpExportCompanyFile, HttpSolicitation} from "http/index";
import {EntityWithIdFields} from "types/baseEntities";
import {ITableColumn, TableColumnType, TableList} from "components/table";
import {TypographyBase} from "components/misc/TypographyBase";
import {Button, Collapse, IconButton, Stack} from "@mui/material";
import {WrapperIcons} from "components/icons/Icons";
import {DownloadSimple, MagnifyingGlass} from "@phosphor-icons/react";
import {OffererSolicitationTabCompanyFilesContext} from "../tabs/OffererSolicitationTabCompanyFiles";
import {SolicitationViewDTOFields} from "types/solicitations/solicitationData";
import useAxios from "hooks/useAxios";
import {useAction} from "../../../../hooks/useAction";

function OffererSolicitationCompanyFilesTable() {
  const { solicitation } = useSolicitation();
  const { fetchAndDownloadFile } = useAxios();
  const { snackbarSuccess } = useAction();
  const {fileToDisplay, setFileToDisplay} = useContext(OffererSolicitationTabCompanyFilesContext);
   
  const [showTable, setShowTable] = useState(false);
  const [companyFileList, setCompanyFileList] =
    useState<CompanySolicitationFileHistory[]>();

  const onToggleTable = () => setShowTable(!showTable);
  
  const onHandleClick = (file: CompanySolicitationFileHistory | undefined) => {
    let fileToSet: CompanySolicitationFileHistory | undefined = file;
    
    if (file && solicitation && solicitation[SolicitationViewDTOFields.FileId] === file[EntityWithIdFields.Id])
      fileToSet = undefined;
    
    setShowTable(false);
    setFileToDisplay(fileToSet);
  }
  
  const onShowLastCompanyFile = () => onHandleClick(undefined);
  
  const exportFile = (file: CompanySolicitationFileHistory) => 
    fetchAndDownloadFile(
        () => HttpExportCompanyFile.exportToExcelByFile(file[EntityWithIdFields.Id])
    ).then(() => snackbarSuccess('El legajo se ha descargado correctamente'))
  
  const columns : ITableColumn[] = [
    {
      label: "Número",
      textAlign: "left",
      onRenderCell: (entity: CompanySolicitationFileHistory) => 
        <Stack>
          <TypographyBase>{`Legajo N° ${entity[CompanySolicitationFileHistoryFields.Index]}`}</TypographyBase>

          { 
            entity[EntityWithIdFields.Id] === solicitation?.[SolicitationViewDTOFields.FileId] &&
              <TypographyBase variant={'caption'}
                              color={'text.lighter'}
              >
                Legajo actualizado
              </TypographyBase>
          }
        </Stack>
    },
    {
      label: "Fecha",
      value: CompanySolicitationFileHistoryFields.Date,
      type: TableColumnType.Date
    },
    {
      label: "",
      onRenderCell: (entity: CompanySolicitationFileHistory) => (
        <Stack direction={'row'} spacing={2}>
          <IconButton size={'small'} onClick={() => exportFile(entity)}>
            <WrapperIcons Icon={DownloadSimple} />
          </IconButton>
          
          <IconButton size={'small'} onClick={() => onHandleClick(entity)}>
            <WrapperIcons Icon={MagnifyingGlass} />
          </IconButton>
        </Stack>
      )
    }
  ]
  
  useEffect(() => {
    if (solicitation) {
      HttpSolicitation.getCompanyFileSolicitations(
        solicitation[EntityWithIdFields.Id],
      ).then(history => {
        let historyWithIdx: CompanySolicitationFileHistory[] = []
        if (history && history.length) {
          const length = history.length;
          historyWithIdx = history
            .map((x, idx) => { return { ...x, [CompanySolicitationFileHistoryFields.Index]: length - idx } })
        }
        
        setCompanyFileList(historyWithIdx);
      });
    }
  }, [solicitation]);
  
  return (
    <React.Fragment>
      <Stack direction={'row'} justifyContent={'space-between'} mb={1}>
        <Button variant={'text'}
                size={'small'}
                color={'inherit'}
                sx={{ color: 'grey.700' }}
                onClick={onToggleTable}
        >
          {showTable ? "Ocultar historial" : "Ver historial"}
        </Button>

        {
          fileToDisplay &&
            <Button variant={'text'} size={'small'} onClick={onShowLastCompanyFile}>
                Ver legajo actualizado
            </Button>
        }
      </Stack>
      
      <Collapse in={showTable}>
        <TableList entityList={companyFileList}
                   columns={columns}
                   isLoading={!solicitation && !companyFileList}
                   error={false}
        />
      </Collapse>
    </React.Fragment>
  )
}

export default OffererSolicitationCompanyFilesTable;