import React, { useState } from 'react';
import { Stack } from '@mui/material';
import {
  GeneralFilesCompanyFilter,
  GeneralFilesCompanyFilterFields,
  SectionFilesCompanyFilter,
  SectionFilesCompanyFilterFields,
} from 'types/files/filesData';
import RelateSectionDetail from './RelateSectionDetail';
import RelateFileTypeDetail from './RelateFileTypeDetail';
import {
  EntityWithIdAndDescription,
  EntityWithIdFields,
} from 'types/baseEntities';
import {
  CompanySectionsWithFileType,
  CompanySectionsWithFileTypeFields,
} from 'types/company/companyData';

interface RelatedSectionTreeViewNodeProps {
  section: CompanySectionsWithFileType;
  onSelect: (
    event: React.ChangeEvent<HTMLInputElement>,
    ids: GeneralFilesCompanyFilter,
  ) => void;
  selectedItems: SectionFilesCompanyFilter[];
  fatherId?: number;
}

const RelatedSectionTreeViewNode = ({
  section,
  onSelect,
  selectedItems,
  fatherId,
}: RelatedSectionTreeViewNodeProps) => {
  const [showDaughters, setShowDaughters] = useState<boolean>(false);

  const triggerShowDaughters = () => setShowDaughters(!showDaughters);

  const handleSelect = (
    event: React.ChangeEvent<HTMLInputElement>,
    fileTypeCod?: number,
  ) => {
    let selectedIds: SectionFilesCompanyFilter = {
      [GeneralFilesCompanyFilterFields.FileTypeCode]: fileTypeCod,
      [GeneralFilesCompanyFilterFields.SectionCode]: fatherId
        ? fatherId
        : section[CompanySectionsWithFileTypeFields.Id],
      [SectionFilesCompanyFilterFields.RelatedId]: fatherId
        ? section[CompanySectionsWithFileTypeFields.Id]
        : undefined,
    };

    onSelect(event, selectedIds);
  };

  const getIfSelected = (c: EntityWithIdAndDescription) => {
    if (fatherId) {
      return selectedItems.some(
        (i) =>
          i[GeneralFilesCompanyFilterFields.FileTypeCode] ===
            c[EntityWithIdFields.Id] &&
          i[GeneralFilesCompanyFilterFields.SectionCode] === fatherId &&
          i[SectionFilesCompanyFilterFields.RelatedId] ===
            section[CompanySectionsWithFileTypeFields.Id],
      );
    }

    return selectedItems.some(
      (i) =>
        i[GeneralFilesCompanyFilterFields.FileTypeCode] ===
          c[EntityWithIdFields.Id] &&
        i[GeneralFilesCompanyFilterFields.SectionCode] ===
          section[CompanySectionsWithFileTypeFields.Id] &&
        !i[SectionFilesCompanyFilterFields.RelatedId],
    );
  };

  return (
    <Stack sx={{ ml: '20px', mb: '5px' }}>
      <RelateSectionDetail
        section={section}
        onClickCollapse={triggerShowDaughters}
        collapsed={!showDaughters}
      />
      {section[CompanySectionsWithFileTypeFields.FileTypes].length !== 0 &&
        showDaughters &&
        section[CompanySectionsWithFileTypeFields.FileTypes].map((daughter) => (
          <div style={{ marginLeft: 25 }}>
            <RelateFileTypeDetail
              entity={daughter}
              onSelect={handleSelect}
              selected={getIfSelected(daughter)}
            />
          </div>
        ))}
      {section[CompanySectionsWithFileTypeFields.RelatedData].length !== 0 &&
        showDaughters &&
        section[CompanySectionsWithFileTypeFields.RelatedData].map(
          (daughter) => (
            <div style={{ marginLeft: 25 }}>
              <RelatedSectionTreeViewNode
                section={daughter}
                onSelect={onSelect}
                selectedItems={selectedItems}
                fatherId={section[CompanySectionsWithFileTypeFields.Id]}
              />
            </div>
          ),
        )}
    </Stack>
  );
};

export default RelatedSectionTreeViewNode;
