import React, { ReactElement } from 'react';
import { Box, Stack } from '@mui/material';
import { NavsTabHorizontal } from 'components/navs/NavsTab';

import { Sections } from 'types/general/generalEnums';
import { Document, FileBase, FileBaseFields } from 'types/files/filesData';

import FileDocumentList from './FileDocumentList';
import FileNewButton from './FileNewButton';
import {PublicEntityEnums} from "../../util/typification/publicEntityEnums";

interface FileDocumentListSectionProps {
  title?: string;
  filesDocument?: Document[];
  delete?: boolean;
  share?: boolean;
  download?: boolean;
  onReload?: () => void;
  preview?: boolean;
  onSaveFile?: (fileBase: FileBase, file: File) => Promise<any>;
  action?: (document: Document) => ReactElement;
}

interface FileDocumentListSectionBaseProps
  extends FileDocumentListSectionProps {
  section: Sections;
}

function FileDocumentListSection(props: FileDocumentListSectionBaseProps) {
  return (
    <Stack gap={2}>
      <FileDocumentList
        {...props}
        filesDocument={props.filesDocument?.filter(
          (x) => x[FileBaseFields.FileSectionCode] === props.section,
        )}
        title={props.title}
      />

      {props.onSaveFile && (
        <Stack alignItems={'flex-end'} mb={1}>
          <FileNewButton
            section={props.section}
            onSaveFile={props.onSaveFile}
            onReload={props.onReload}
          />
        </Stack>
      )}
    </Stack>
  );
}

function FileDocumentListSectionCompanyLegal(
  props: FileDocumentListSectionProps,
) {
  return (
    <FileDocumentListSection
      {...props}
      section={Sections.CompanyLegal}
      filesDocument={props.filesDocument}
    />
  );
}

function FileDocumentListSectionCompanyPhysical(
  props: FileDocumentListSectionProps,
) {
  return (
    <FileDocumentListSection
      {...props}
      section={Sections.CompanyPhysical}
      filesDocument={props.filesDocument}
    />
  );
}

function FileDocumentListSectionActivity(props: FileDocumentListSectionProps) {
  return (
    <FileDocumentListSection
      {...props}
      section={Sections.Activity}
      filesDocument={props.filesDocument}
    />
  );
}

function FileDocumentListSectionRelatedPerson(
  props: FileDocumentListSectionProps,
) {
  return (
    <FileDocumentListSection
      {...props}
      section={Sections.RelatedPerson}
      filesDocument={props.filesDocument}
    />
  );
}

function FileDocumentListSectionFlowCompanyLegal(
  props: FileDocumentListSectionProps,
) {
  return (
    <FileDocumentListSection
      {...props}
      section={Sections.PostClosingMovementsCompanyLegal}
      filesDocument={props.filesDocument}
    />
  );
}

function FileDocumentListSectionFlowCompanyPhysical(
  props: FileDocumentListSectionProps,
) {
  return (
    <FileDocumentListSection
      {...props}
      section={Sections.PostClosingMovementsCompanyPhysical}
      filesDocument={props.filesDocument}
    />
  );
}

function FileDocumentListSectionFinancialYear(
  props: FileDocumentListSectionProps,
) {
  return (
    <FileDocumentListSection
      {...props}
      section={Sections.FinancialYear}
      filesDocument={props.filesDocument}
    />
  );
}

function FileDocumentListSectionCertifications(
  props: FileDocumentListSectionProps,
) {
  return (
    <FileDocumentListSection
      {...props}
      section={Sections.Certifications}
      filesDocument={props.filesDocument}
      preview
    />
  );
}

function FileDocumentListSectionBureau(props: FileDocumentListSectionProps) {
  return (
    <FileDocumentListSection
      {...props}
      section={Sections.PublicBases}
      filesDocument={props.filesDocument}
    />
  );
}

function FileDocumentListSectionAffidavit(props: FileDocumentListSectionProps) {
  return (
    <FileDocumentListSection
      {...props}
      section={Sections.Affidavit}
      filesDocument={props.filesDocument}
    />
  );
}

function FileDocumentListSectionDeclarationOfAssets(
  props: FileDocumentListSectionProps,
) {
  return (
    <FileDocumentListSection
      {...props}
      section={Sections.DeclarationOfAssets}
      filesDocument={props.filesDocument}
    />
  );
}

function FileDocumentListSectionSolicitations(
  props: FileDocumentListSectionProps,
) {
  return (
    <FileDocumentListSection
      {...props}
      section={Sections.Solicitations}
      filesDocument={props.filesDocument}
    />
  );
}

function FileDocumentListSectionDischarge(props: FileDocumentListSectionProps) {
  return (
    <Stack gap={1}>
      <Box mt={2}>
        <NavsTabHorizontal
          alignLeft
          lstTabs={[
            {
              tabList: [
                {
                  label: PublicEntityEnums.BCRA,
                  content: (
                    <FileDocumentListSection
                      {...props}
                      section={Sections.DischargeBCRA}
                      filesDocument={props.filesDocument}
                      onSaveFile={props.onSaveFile}
                    />
                  ),
                  default: true,
                },
                {
                  label: 'Aportes',
                  content: (
                    <FileDocumentListSection
                      {...props}
                      section={Sections.DischargeContributions}
                      filesDocument={props.filesDocument}
                    />
                  ),
                },
                {
                  label: 'Cheques',
                  content: (
                    <FileDocumentListSection
                      {...props}
                      section={Sections.DischargeChecks}
                      filesDocument={props.filesDocument}
                    />
                  ),
                },
                {
                  label: 'Score',
                  content: (
                    <FileDocumentListSection
                      {...props}
                      section={Sections.DischargeScore}
                      filesDocument={props.filesDocument}
                    />
                  ),
                },
              ],
            },
          ]}
        />
      </Box>
    </Stack>
  );
}

export {
  FileDocumentListSection,
  FileDocumentListSectionCompanyLegal,
  FileDocumentListSectionCompanyPhysical,
  FileDocumentListSectionActivity,
  FileDocumentListSectionDischarge,
  FileDocumentListSectionRelatedPerson,
  FileDocumentListSectionFlowCompanyLegal,
  FileDocumentListSectionFlowCompanyPhysical,
  FileDocumentListSectionBureau,
  FileDocumentListSectionFinancialYear,
  FileDocumentListSectionCertifications,
  FileDocumentListSectionAffidavit,
  FileDocumentListSectionDeclarationOfAssets,
  FileDocumentListSectionSolicitations,
};
