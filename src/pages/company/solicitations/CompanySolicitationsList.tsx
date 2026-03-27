import React, { useEffect, useState } from 'react';
import { ITableColumn, TableList } from 'components/table';

import { Box, Chip, Stack, Typography } from '@mui/material';
import { dateFormatter } from 'util/formatters/dateFormatter';
import {
  SolicitationViewDTO,
  SolicitationViewDTOFields,
} from 'types/solicitations/solicitationData';
import { HttpSolicitation } from 'http/index';
import { SolicitationStatesColorMap } from 'util/typification/solicitationStatesColor';
import { HttpOffererLogo } from 'http/offerer/httpOffererLogo';
import {
  FileBlobResponse,
  FileBlobResponseFields,
} from 'types/files/filesData';

interface CompanySolicitationsListProps {
  companyId: number;
}

function CompanySolicitationsList(props: CompanySolicitationsListProps) {
  const [solicitations, setSolicitations] = useState<SolicitationViewDTO[]>();
  const [logo, setLogo] = useState<any>();
  const [error, setError] = useState<boolean>(false);

  const drawChip = () => {
    return (
      <Chip
        label={'Activas'}
        sx={{
          color: SolicitationStatesColorMap[2].dark,
          backgroundColor: SolicitationStatesColorMap[2].light,
          marginTop: 2,
          marginBottom: 2,
        }}
      />
    );
  };

  const getLogo = (solicit: SolicitationViewDTO) => {
    !logo &&
      HttpOffererLogo.getByOffererId(
        solicit[SolicitationViewDTOFields.OffererId],
      ).then((blobResponse: FileBlobResponse) => {
        var image = blobResponse[FileBlobResponseFields.File];
        image.size && setLogo(URL.createObjectURL(image));
      });
  };

  const columns: ITableColumn[] = [
    {
      label: 'Oferente',
      onRenderCell: (solicitation: SolicitationViewDTO) => {
        getLogo(solicitation);
        return (
          <Stack direction={'row'} alignItems={'center'} spacing={2}>
            <Box
              sx={{
                borderRadius: '10px',
                objectFit: 'contain',
                width: 80,
                height: 30,
              }}
              component="img"
              alt="Logo Banco"
              src={logo}
            />
            <Typography>
              {solicitation[SolicitationViewDTOFields.OffererBusinessName]}
            </Typography>
          </Stack>
        );
      },
    },
    { label: 'ID', value: SolicitationViewDTOFields.ProductLineId },
    { label: 'Linea', value: SolicitationViewDTOFields.LineDesc },
    {
      label: 'Últ. actualización',
      onRenderCell: (solicitation: SolicitationViewDTO) => {
        return (
          <Typography>
            {dateFormatter.toShortDate(
              solicitation[SolicitationViewDTOFields.CompanyLastModified],
            )}
          </Typography>
        );
      },
    },
    {
      label: 'Estado',
      value: SolicitationViewDTOFields.CompanySolicitationStatusTypeDesc,
    },
    {
      label: 'Clasificación',
      onRenderCell: () => {
        return drawChip();
      },
    },
  ];

  useEffect(() => {
    setError(false);
    HttpSolicitation.getSolicitationsByCompany(props.companyId)
      .then((response) => setSolicitations(response))
      .catch(() => setError(true));
  }, []);

  return (
    <TableList
      entityList={solicitations}
      columns={columns}
      isLoading={!solicitations && !error}
      error={error}
    />
  );
}

export default CompanySolicitationsList;
