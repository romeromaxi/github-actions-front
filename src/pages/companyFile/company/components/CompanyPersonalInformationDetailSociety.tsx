import React, { useEffect, useState } from 'react';

import {
  Alert,
  Button,
  Skeleton,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
} from '@mui/material';

import { HttpCompanyRelationship } from 'http/index';
import {
  SocietyPerson,
  SocietyPersonFields,
} from 'types/company/companySocietyData';
import AddRoundedIcon from '@mui/icons-material/AddRounded';
import RemoveRoundedIcon from '@mui/icons-material/RemoveRounded';

interface CompanyPersonalInformationDetailSocietyProps {
  companyId: number;
}

const orderByParticipation = (a: SocietyPerson, b: SocietyPerson): number => {
  return (
    b[SocietyPersonFields.ParticipationPercent] -
    a[SocietyPersonFields.ParticipationPercent]
  );
};

function CompanyPersonalInformationDetailSociety({
  companyId,
}: CompanyPersonalInformationDetailSocietyProps) {
  const numberPartnersShow: number = 2;

  const [isLoading, setLoading] = useState<boolean>(true);
  const [showAll, setShowAll] = useState<boolean>(false);
  const [societyPerson, setSocietyPerson] = useState<SocietyPerson[]>();

  useEffect(() => {
    setLoading(true);
    HttpCompanyRelationship.getRelationshipSocieties(companyId).then(
      (societies) => {
        //setSocietyPerson(societies.sort(orderByParticipation).slice(0, numberPartnersShow));
        setSocietyPerson(societies.sort(orderByParticipation));
        setLoading(false);
      },
    );
  }, []);

  const mapLoading = () => (
    <>
      <TableRow>
        <TableCell colSpan={2}>
          <Skeleton />
        </TableCell>
      </TableRow>
      <TableRow>
        <TableCell colSpan={2}>
          <Skeleton />
        </TableCell>
      </TableRow>
    </>
  );

  const changeVisualization = () => setShowAll(!showAll);

  return (
    <Stack direction="column" spacing={1}>
      {societyPerson?.length || isLoading ? (
        <Table sx={{ boxShadow: 1 }}>
          <TableHead>
            <TableRow>
              <TableCell>
                Nombre {`(# ${societyPerson?.length || 0})`}
              </TableCell>
              <TableCell>
                Participación{' '}
                {`(% ${societyPerson ? societyPerson.reduce((prev, curr) => prev + parseFloat(curr[SocietyPersonFields.ParticipationPercent].toString()), 0) : 0})`}
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {isLoading ? (
              mapLoading()
            ) : (
              <>
                {societyPerson?.map((society, idx) => {
                  return showAll || idx < numberPartnersShow ? (
                    <TableRow>
                      <TableCell>
                        {society[SocietyPersonFields.LegalName]}
                      </TableCell>
                      <TableCell>
                        {society[SocietyPersonFields.ParticipationPercent]} %
                      </TableCell>
                    </TableRow>
                  ) : null;
                })}

                {(societyPerson?.length || 0) > numberPartnersShow && (
                  <TableRow>
                    <TableCell colSpan={2} align="center">
                      <Button
                        variant="text"
                        startIcon={
                          showAll ? <RemoveRoundedIcon /> : <AddRoundedIcon />
                        }
                        onClick={changeVisualization}
                        sx={{ padding: 0 }}
                        fullWidth
                      >
                        Mostrar {showAll ? 'menos' : 'todo'}
                      </Button>
                    </TableCell>
                  </TableRow>
                )}
              </>
            )}
          </TableBody>
        </Table>
      ) : (
        <Alert severity={'info'}>No se han encontrado socios</Alert>
      )}
    </Stack>
  );
}
/*
            {
                isLoading ?
                    <>
                        <Skeleton />
                        <Skeleton />
                    </>
                    :
                    (societyPerson && societyPerson.length) ?
                        <Table>
                            <TableHead>
                                <TableRow>
                                    <TableCell>Nombre</TableCell>
                                    <TableCell>Participación</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {
                                    societyPerson.map((society, idx) => (
                                        <TableRow>
                                            <TableCell>{society[SocietyPersonFields.LegalName]}</TableCell>
                                            <TableCell>{society[SocietyPersonFields.ParticipationPercent]} %</TableCell>
                                        </TableRow>
                                    ))
                                }
                            </TableBody>
                        </Table>
                        :
                        <Alert severity={'info'}>No se han encontrado socios</Alert>
            }*/
export default CompanyPersonalInformationDetailSociety;
