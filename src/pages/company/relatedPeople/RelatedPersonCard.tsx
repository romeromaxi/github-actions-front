import React, { useContext, useState } from 'react';

import { DialogAlert } from 'components/dialog';
import { LoaderBlockUI } from 'components/loader';

import { HttpCompanyRelationship } from 'http/index';
import { EntityWithIdFields } from 'types/baseEntities';
import {
  CompanyPersonRelationship,
  CompanyPersonRelationshipFields,
} from 'types/company/companySocietyData';
import { Card, CardContent, Chip, Stack, Tooltip } from '@mui/material';
import { stringFormatter } from 'util/formatters/stringFormatter';
import { CompanyViewDTOFields } from 'types/company/companyData';
import { SearchRounded } from '@mui/icons-material';
import { CompanyRelatedPersonBaseListContext } from './CompanyRelatedPersonBaseList';
import { DeleteTwoTone } from '@mui/icons-material';
import TitleWithSubtitleCard from 'components/text/TitleWithSubtitleCard';
import {
  DeleteButton,
  DeleteIconButton,
  SearchButton,
  SearchIconButton,
} from '../../../components/buttons/Buttons';

interface RelatedPersonCardProps {
  relationship: CompanyPersonRelationship;
  onReload: () => void;
  onEdit: (relationship: CompanyPersonRelationship) => void;
}

function RelatedPersonCard({
  relationship,
  onReload,
  onEdit,
}: RelatedPersonCardProps) {
  const { hasParticipation } = useContext(CompanyRelatedPersonBaseListContext);

  const [isLoading, setLoading] = useState<boolean>(false);
  const [showConfirmDelete, setShowConfirmDelete] = useState<boolean>(false);

  //const onHandleDetail = () => onDetail(relationship);

  const onHandleEdit = () => onEdit(relationship);

  const onShowConfirmDelete = () => setShowConfirmDelete(true);

  const onCancelDelete = () => setShowConfirmDelete(false);

  const onConfirmDelete = () => {
    setLoading(true);
    HttpCompanyRelationship.delete(
      relationship[CompanyPersonRelationshipFields.CompanyId],
      relationship[EntityWithIdFields.Id],
    ).then(() => {
      setShowConfirmDelete(false);
      setLoading(false);
      onReload();
    });
  };

  const getParticipation = () =>
    `(${relationship[CompanyPersonRelationshipFields.ParticipationPercent]} %)`;

  return (
    <>
      <Card sx={{ height: '100%' }}>
        <CardContent sx={{ height: '100%' }}>
          <Stack
            justifyContent={'space-between'}
            sx={{ height: '100%' }}
            spacing={3}
          >
            <Stack
              direction={'row'}
              alignItems={'center'}
              justifyContent={'space-between'}
            >
              <TitleWithSubtitleCard
                title={relationship[CompanyPersonRelationshipFields.LegalName]}
                subtitle={`${relationship[CompanyPersonRelationshipFields.PersonRelationshipTypeDesc]} ${hasParticipation ? getParticipation() : ''}`}
              />

              <Tooltip arrow title="CUIT" placement="top">
                <Chip
                  color="info"
                  size="small"
                  label={stringFormatter.formatCuit(
                    relationship[CompanyViewDTOFields.CUIT],
                  )}
                />
              </Tooltip>
            </Stack>

            <Stack
              direction={'row'}
              alignItems={'center'}
              justifyContent={'space-between'}
              mt={1}
              className={'hideButtonsInPdf'}
            >
              <SearchIconButton onClick={onHandleEdit} tooltipTitle={'Ver'} />
              <DeleteIconButton
                onClick={onShowConfirmDelete}
                tooltipTitle={'Eliminar'}
              />
            </Stack>
          </Stack>
        </CardContent>
      </Card>

      <DialogAlert
        open={showConfirmDelete}
        onClose={onCancelDelete}
        onConfirm={onConfirmDelete}
        textContent={`¿Estás seguro que deseás eliminar al integrante ${relationship[CompanyPersonRelationshipFields.LegalName]}?`}
      />

      {isLoading && <LoaderBlockUI />}
    </>
  );
}

export default RelatedPersonCard;
