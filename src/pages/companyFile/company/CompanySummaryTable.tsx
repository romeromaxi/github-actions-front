import { useEffect, useState } from 'react';
import {
  NosisQuery,
  NosisSummaryQueryFields,
} from '../../../types/nosis/nosisData';
import { HttpPublicBases } from '../../../http/publicBases/httpPublicBases';
import { Box, Button, Grid, Typography } from '@mui/material';
import * as React from 'react';
import {
  TableLoading
} from '../../../components/table';
import { Link, useNavigate } from 'react-router-dom';
import CompanySummaryTableStyles from './CompanySummaryTable.styles';
import { EntityWithIdFields } from '../../../types/baseEntities';
import {PublicEntityEnums} from "../../../util/typification/publicEntityEnums";

interface CompanySummaryTableProps {
  companyId?: number;
}

const CompanySummaryTable = ({ companyId }: CompanySummaryTableProps) => {
  const classes = CompanySummaryTableStyles();
  const [nosisQueryList, setNosisQueryList] = useState<NosisQuery[]>();
  const [nosisLength, setNosisLength] = useState<number>(0);
  const navigate = useNavigate();

  const onViewNosis = (queryId: number, tabTo: string) => {
    navigate(`/bureau/${companyId}/detalle?tab=${tabTo}&id=${queryId}`);
  };

  useEffect(() => {
    setNosisQueryList(undefined);

    companyId &&
      HttpPublicBases.getListByCompanyId(companyId).then((queryList) => {
        setNosisQueryList(queryList);
        setNosisLength(queryList.length);
      });
  }, [companyId]);

  return (
    <>
      {nosisQueryList ? (
        <Box sx={{ display: 'flex', flexGrow: 1, alignItems: 'center' }}>
          <Grid container spacing={2}>
            <Grid item xs={12} container className={classes.headerRow}>
              <Grid item xs={3} alignItems={'center'}>
                <Typography
                  fontSize={16}
                  fontWeight={700}
                  color={'#7e8299'}
                  textAlign={'center'}
                >
                  Informe
                </Typography>
              </Grid>
              <Grid item xs={2} alignItems={'center'}>
                <Typography
                  fontSize={14}
                  fontWeight={600}
                  color={'#7e8299'}
                  textAlign={'center'}
                >
                  {PublicEntityEnums.BCRA}
                </Typography>
              </Grid>
              <Grid item xs={2} alignItems={'center'}>
                <Typography
                  fontSize={14}
                  fontWeight={600}
                  color={'#7e8299'}
                  textAlign={'center'}
                >
                  Cheques
                </Typography>
              </Grid>
              <Grid item xs={2} alignItems={'center'}>
                <Typography
                  fontSize={14}
                  fontWeight={600}
                  color={'#7e8299'}
                  textAlign={'center'}
                >
                  Aportes
                </Typography>
              </Grid>
              <Grid item xs={3} alignItems={'center'}>
                <Typography
                  fontSize={14}
                  fontWeight={600}
                  color={'#7e8299'}
                  textAlign={'center'}
                >
                  Score
                </Typography>
              </Grid>
            </Grid>
            <Grid item xs={12} container spacing={3}>
              {nosisQueryList?.map((query, idx) => (
                <Grid
                  className={classes.itemsRow}
                  key={`nosisSummaryRow_${idx}`}
                  item
                  xs={12}
                  container
                  pb={2.5}
                >
                  <Grid item xs={3}>
                    <Typography
                      fontSize={13}
                      fontWeight={500}
                      color={'#7e8299'}
                      textAlign={'center'}
                    >
                      {query[NosisSummaryQueryFields.BusinessName]}
                    </Typography>
                  </Grid>
                  <Grid item xs={2} textAlign={'center'}>
                    <Button
                      variant={'outlined'}
                      color={'info'}
                      size={'small'}
                      onClick={() =>
                        onViewNosis(query[EntityWithIdFields.Id], PublicEntityEnums.BCRA)
                      }
                    >
                      Ver
                    </Button>
                  </Grid>
                  <Grid item xs={2} textAlign={'center'}>
                    <Button
                      variant={'outlined'}
                      color={'info'}
                      size={'small'}
                      onClick={() =>
                        onViewNosis(query[EntityWithIdFields.Id], 'cheques')
                      }
                    >
                      Ver
                    </Button>
                  </Grid>
                  <Grid item xs={2} textAlign={'center'}>
                    <Button
                      variant={'outlined'}
                      color={'info'}
                      size={'small'}
                      onClick={() =>
                        onViewNosis(query[EntityWithIdFields.Id], 'aportes')
                      }
                    >
                      Ver
                    </Button>
                  </Grid>
                  <Grid item xs={3} pr={2}>
                    <Link
                      className={classes.scores}
                      to={`/bureau/${companyId}/detalle?tab=score&id=${query[EntityWithIdFields.Id]}`}
                    >
                      <Typography
                        fontSize={13}
                        fontWeight={500}
                        color={'#009EF7'}
                        textAlign={'center'}
                      >
                        {query[NosisSummaryQueryFields.Scoring]}
                      </Typography>
                    </Link>
                  </Grid>
                </Grid>
              ))}
            </Grid>
          </Grid>
        </Box>
      ) : (
        <Grid xs={12} alignItems={'center'} textAlign={'center'}>
          <TableLoading colSpan={5} />
        </Grid>
      )}
    </>
  );
};

export default CompanySummaryTable;
