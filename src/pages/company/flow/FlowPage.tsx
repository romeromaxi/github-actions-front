import React, { useContext, useEffect, useState, useRef } from 'react';
import { HttpFilesCompany } from 'http/index';
import {Card, CardContent, CardHeader, Grid, Stack, Typography, Button} from '@mui/material';
import { Document, FileBase, DocumentFields } from 'types/files/filesData';
import CompanyFlowYearlyTotals from './CompanyFlowYearlyTotals';
import { Sections } from 'types/general/generalEnums';
import { LoaderBlockUI } from 'components/loader';
import { ButtonExportDropdown } from 'components/buttons/ButtonExportDropdown';
import { Skeleton } from '@mui/lab';
import {BaseIconWrapper} from "../../../components/icons/Icons";
import {ChartLineUp} from "phosphor-react";
import {AddButton} from "../../../components/buttons/Buttons";
import FlowSemesterAccordion from "./FlowSemesterAccordion";
import CompanyFlowChart from "./CompanyFlowChart";
import {FlowUseContext, FlowUseSourceType} from "../../../hooks/contexts/FlowUseContext";
import {FlowInsertRequest, FlowSemesterView} from "../../../types/general/generalFinanceData";
import FileDocumentDetail from 'components/files/FileDocumentDetail';
import { TypographyBase } from 'components/misc/TypographyBase';
import { EntityWithIdFields } from 'types/baseEntities';
import FileNewDialog from 'components/files/NewFileDialog';
import { PlusIcon, PaperclipIcon } from 'lucide-react';

interface FlowPageProps {
  isLegalPerson: boolean;
  dataId?: number;
  dataSource?: FlowUseSourceType;
}

function FlowPage({isLegalPerson, dataId, dataSource = FlowUseSourceType.Company} : FlowPageProps) {
  const { 
    semesterLst,
    flowLst,
    loading,
    handleExport,
    handleInsertFlows,
    handleInsertSemester
  } = useContext(FlowUseContext)
  const flowSections =
      isLegalPerson ? Sections.PostClosingMovementsCompanyLegal
      : Sections.PostClosingMovementsCompanyPhysical;
  const [editingSemester, setEditingSemester] = useState<FlowSemesterView>();
  const [filesDocument, setFilesDocument] = useState<Document[]>();
  const [openNewFileDialog, setOpenNewFileDialog] = useState<boolean>(false);
  const docsRef = useRef<HTMLDivElement>(null);

  const buildExportButton = () => {
    return <ButtonExportDropdown onExportExcel={handleExport} size={'small'} id={'company-flow-export-btn'}/>;
  };

  const onSubmit = (data: FlowInsertRequest) => handleInsertFlows(data)

  const loadFiles = () => {
    setFilesDocument(undefined);
      dataSource === FlowUseSourceType.Company && dataId &&
      HttpFilesCompany.getFilesByIdCompany(dataId).then(
        setFilesDocument,
      );
  };

  useEffect(() => {
    loadFiles();
  }, [dataId]);

  const onSaveFile = (fileCompany: FileBase, file: File): Promise<any> => {
    return HttpFilesCompany.insert(
      dataId || 0,
      fileCompany,
      file,
    );
  };

  const onHandleEdit = (semester?: FlowSemesterView) => {
    setEditingSemester(semester);
  };

  const handleScrollToDocs = () => {
    docsRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleOpenNewFileDialog = () => {
    setOpenNewFileDialog(true);
  };

  const handleCloseNewFileDialog = () => {
    setOpenNewFileDialog(false);
  };

  const flowFiles = filesDocument?.filter(
    (file) => file[DocumentFields.FileSectionCode] === flowSections,
  );

  return (
    <React.Fragment>
      {
        dataSource !== FlowUseSourceType.Company ?
            <Stack spacing={1.5}>
              <Card>
                <CardContent>
                  <Stack direction={'row'} alignItems={'center'} justifyContent={'space-between'}>
                    <Stack direction={'row'} alignItems={'center'} spacing={2}>
                      <BaseIconWrapper Icon={ChartLineUp} size={'md'} bg={'#F7FAFC'}/>
                      <Typography variant={'h4'} fontWeight={500}>Compras/Ventas post balance</Typography>
                    </Stack>
                    <Stack direction={'row'} alignItems={'center'} spacing={2}>
                      {/*buildExportButton()*/}
                      <AddButton onClick={handleInsertSemester} size={'small'}>
                        Agregar semestre
                      </AddButton>
                    </Stack>
                  </Stack>
                </CardContent>
              </Card>

              <Stack spacing={2}>
                {semesterLst ?
                    Object.entries(semesterLst)
                        .sort(([yearA], [yearB]) => Number(yearB) - Number(yearA))
                        .map(([year, semesters]) => (
                            <FlowSemesterAccordion key={`company_Flow_Accordion_${year}`}
                                                   editingSemester={editingSemester}
                                                   semesters={semesters}
                                                   onSubmit={onSubmit}
                                                   triggerEditing={onHandleEdit}
                                                   year={year}
                            />
                        ))
                    : Array.from(Array(4).keys()).map((item) => (
                        <Grid
                            item
                            xs={12}
                            key={`keyCompanySemesterFlowCardSkeleton_${item}`}
                        >
                          <Skeleton />
                        </Grid>
                    ))}

                {flowLst && flowLst.length !== 0 && (
                    <CompanyFlowYearlyTotals flowList={flowLst}
                                             includeTitle
                    />
                )}

                {flowLst && flowLst.length !== 0 && (
                    <Card>
                      <CardHeader title="Relación entre compras y ventas" />
                      <CardContent>
                        <CompanyFlowChart flowList={flowLst} />
                      </CardContent>
                    </Card>
                )}
              </Stack>
            </Stack>
            :
            <Stack spacing={1.5}>
              <Card>
                <CardContent>
                  <Stack direction={'row'} alignItems={'center'} justifyContent={'space-between'}>
                    <Stack direction={'row'} alignItems={'center'} spacing={2}>
                      <BaseIconWrapper Icon={ChartLineUp} size={'md'} bg={'#F7FAFC'}/>
                      <Typography variant={'h4'} fontWeight={500}>Compras/Ventas post balance</Typography>
                    </Stack>
                    <Stack direction={'row'} alignItems={'center'} spacing={2}>
                      {/*buildExportButton()*/}
                      <Button
                        variant={'outlined'}
                        color={'secondary'}
                        size={'small'}
                        onClick={handleScrollToDocs}
                        startIcon={<PaperclipIcon size={18} />}
                      >
                        Documentos relacionados
                      </Button>
                      <AddButton onClick={handleInsertSemester} size={'small'} id={'company-flow-add-semester-btn'}>Agregar semestre</AddButton>
                    </Stack>
                  </Stack>
                </CardContent>
              </Card>

              <Stack spacing={2}>
                {semesterLst ?
                    Object.entries(semesterLst)
                        .sort(([yearA], [yearB]) => Number(yearB) - Number(yearA))
                        .map(([year, semesters]) => (
                            <FlowSemesterAccordion key={`company_Flow_Accordion_${year}`}
                                                   editingSemester={editingSemester}
                                                   semesters={semesters}
                                                   onSubmit={onSubmit}
                                                   triggerEditing={onHandleEdit}
                                                   year={year}
                            />
                        ))
                    : Array.from(Array(4).keys()).map((item) => (
                        <Grid
                            item
                            xs={12}
                            key={`keyCompanySemesterFlowCardSkeleton_${item}`}
                        >
                          <Skeleton />
                        </Grid>
                    ))}

                {flowLst && flowLst.length !== 0 && (
                    <CompanyFlowYearlyTotals flowList={flowLst}
                                             includeTitle
                    />
                )}

                {flowLst && flowLst.length !== 0 && (
                    <Card>
                      <CardHeader title="Relación entre compras y ventas" />
                      <CardContent>
                        <CompanyFlowChart flowList={flowLst} />
                      </CardContent>
                    </Card>
                )}
              </Stack>

              <div ref={docsRef}>
                <Card sx={{ borderRadius: 3 }}>
                  <CardContent>
                    <Stack spacing={3}>
                      <Stack direction="row" justifyContent="space-between" alignItems="center">
                        <TypographyBase variant="h6" fontWeight={600} mb={2}>
                          Documentos relacionados
                        </TypographyBase>
                        <Stack direction="row" spacing={1.5} alignItems="center">
                          <Button
                            size="small"
                            variant="contained"
                            color="primary"
                            startIcon={<PlusIcon size={18} />}
                            onClick={handleOpenNewFileDialog}
                          >
                            Agregar documento
                          </Button>
                        </Stack>
                      </Stack>
                      <Stack spacing={1}>
                        {flowFiles && flowFiles.length > 0 ? (
                          flowFiles.map((file) => (
                            <FileDocumentDetail
                              key={file[EntityWithIdFields.Id]}
                              document={file}
                              onReload={loadFiles}
                              fileIconSize={'medium'}
                              download
                              delete
                              share
                              relateToFolder
                              preview
                              edit
                              dropdown
                            />
                          ))
                        ) : (
                          <Typography variant="body2" color="textSecondary">
                            No hay documentos asociados
                          </Typography>
                        )}
                      </Stack>
                    </Stack>
                  </CardContent>
                </Card>
              </div>

              {openNewFileDialog && (
                <FileNewDialog
                  section={flowSections}
                  companyId={dataId}
                  onCloseDialog={handleCloseNewFileDialog}
                  onSubmitDialog={onSaveFile}
                  onReload={loadFiles}
                  blockSection={true}
                />
              )}
            </Stack>
      }
      {loading && <LoaderBlockUI />}
    </React.Fragment>
  );
}

export default FlowPage;
