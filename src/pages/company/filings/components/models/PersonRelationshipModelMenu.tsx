import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, Stack, Typography } from '@mui/material';
import { BackButton, EditButton } from 'components/buttons/Buttons';
import {
  CompanyPersonRelationship,
  CompanyPersonRelationshipFields,
  RelatedPersonType,
} from 'types/company/companySocietyData';
import { ITableColumn, TableList } from 'components/table';
import { HttpCompanyRelationship } from 'http/index';
import { numberFormatter } from 'util/formatters/numberFormatter';
import { ButtonExportDropdown } from '../../../../../components/buttons/ButtonExportDropdown';
import useAxios from '../../../../../hooks/useAxios';
import { HttpCompanyRelationshipExport } from '../../../../../http/company/HttpCompanyRelationshipExport';
import { DialogAlert } from '../../../../../components/dialog';
import {PersonRelationshipFilter, PersonRelationshipFilterFields} from "../../../../../types/person/personData";

interface PersonRelationshipModelMenuProps {
  title: string;
  companyId: number;
  relationshipType: RelatedPersonType;
  onBack: () => void;
}

const PersonRelationshipModelMenu = ({
  title,
  companyId,
  relationshipType,
  onBack,
}: PersonRelationshipModelMenuProps) => {
  const { fetchAndDownloadFile } = useAxios();
  const navigate = useNavigate();
  const relationshipAssociate =
    relationshipType === RelatedPersonType.Associate;
  const [openConfirm, setOpenConfirm] = useState<boolean>(false);
  const [listRelationships, setListRelationships] =
    useState<CompanyPersonRelationship[]>();

  const filter: PersonRelationshipFilter = {
    [PersonRelationshipFilterFields.ListRelationshipTypes]: [
      relationshipType,
    ],
  };

  const getRelationshipPosition = () => {
    switch (relationshipType) {
      case RelatedPersonType.Associate:
        return CompanyPersonRelationshipFields.ParticipationPercent;
      case RelatedPersonType.Authorities:
        return CompanyPersonRelationshipFields.PositionAuthorityDesc;
      case RelatedPersonType.Employees:
        return CompanyPersonRelationshipFields.PositionEmployeeDesc;
      case RelatedPersonType.Others:
      default:
        return CompanyPersonRelationshipFields.PositionOthersDesc;
    }
  };

  const columns: ITableColumn[] = [
    { label: 'Nombre', value: CompanyPersonRelationshipFields.LegalName },
    { label: 'CUIT', value: CompanyPersonRelationshipFields.CUIT },
    { label: 'DNI', value: CompanyPersonRelationshipFields.DNI },
  ]
    .concat(
      relationshipAssociate
        ? [
            {
              label: '% Participación',
              value: CompanyPersonRelationshipFields.ParticipationPercent,
              // @ts-ignore
              onRenderCell: (relationship: CompanyPersonRelationship) =>
                numberFormatter.toStringWithPercentage(
                  relationship[
                    CompanyPersonRelationshipFields.ParticipationPercent
                  ] || 0,
                ),
            },
          ]
        : [{ label: 'Posición', value: getRelationshipPosition() }],
    )
    .concat([
      {
        label: 'Domicilio Fiscal',
        value: CompanyPersonRelationshipFields.CompleteFiscalAddress,
      },
    ]);

  const onEditRelatedPeople = () => setOpenConfirm(true);

  const onConfirmEdit = () =>
    navigate(`/mis-empresas/${companyId}?tab=relatedPeople`);
  const onExportExcel = () =>
    fetchAndDownloadFile(() =>
      HttpCompanyRelationshipExport.exportPayrollToExcel(
        companyId,
        relationshipType,
      ),
    );

  useEffect(() => {
    setListRelationships(undefined);

    HttpCompanyRelationship.getRelationships(companyId, filter).then(
      (response) => {
        setListRelationships(response);
      },
    );
  }, []);

  return (
    <Stack spacing={1}>
      <Stack
        direction={'row'}
        justifyContent={'space-between'}
        alignItems={'center'}
      >
        <Typography variant="h3" fontWeight={600}>
          {title}
        </Typography>

        <Stack direction={'row'} spacing={1}>
          <ButtonExportDropdown size={'small'} onExportExcel={onExportExcel} />

          <EditButton onClick={onEditRelatedPeople} size={'small'}>
            Editar
          </EditButton>

          <BackButton onClick={onBack} size={'small'}>
            Mis Presentaciones
          </BackButton>
        </Stack>
      </Stack>
      <Card>
        <CardContent>
          <TableList
            entityList={listRelationships}
            columns={columns}
            isLoading={!listRelationships}
            error={false}
          />
        </CardContent>
      </Card>
      <DialogAlert
        onClose={() => setOpenConfirm(false)}
        open={openConfirm}
        onConfirm={onConfirmEdit}
        title={`Redirección a página de ${title}`}
        textContent={`¿Estás seguro que deseás continuar? Serás redireccionado a la página de ${title} de la empresa para poder editar los datos`}
      />
    </Stack>
  );
};

export default PersonRelationshipModelMenu;
