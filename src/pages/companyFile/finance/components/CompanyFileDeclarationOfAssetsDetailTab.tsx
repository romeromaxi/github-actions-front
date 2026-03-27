import React, { useEffect, useState } from 'react';
import {
  CompanyDeclarationOfAssets,
  CompanyDeclarationOfAssetsFields,
  CompanyLastYearDeclarationOfAssets,
  CompanyLastYearDeclarationOfAssetsFields,
} from '../../../../types/company/companyFinanceInformationData';
import {
  HttpCompanyDeclarationOfAssets,
  HttpCompanyFile,
} from '../../../../http';
import { Button, Card, CardContent, CardHeader, Grid } from '@mui/material';
import EditOutlinedIcon from '@mui/icons-material/EditOutlined';
import { PersonTypes } from '../../../../types/person/personEnums';
import { EntityWithIdFields } from '../../../../types/baseEntities';
import { useNavigate } from 'react-router-dom';
import CompanyDeclarationOfAssetsPatrimonialTableDetail from './CompanyDeclarationOfAssetsPatrimonialTableDetail';
import CompanyDeclarationOfAssetsIncomeTableDetail from './CompanyDeclarationOfAssetsIncomeTableDetail';
import { dateFormatter } from '../../../../util/formatters/dateFormatter';
import { CompanyFileSourceType } from '../../../../types/company/companyEnums';

interface CompanyFileDeclarationOfAssetsDetailTabProps {
  dataId: number;
  dataSource: CompanyFileSourceType;
  ids: number[];
}

const CompanyFileDeclarationOfAssetsDetailTab = ({
  dataId,
  dataSource,
  ids,
}: CompanyFileDeclarationOfAssetsDetailTabProps) => {
  const [firstDeclarationOfAssets, setFirstDeclarationOfAssets] =
    useState<CompanyLastYearDeclarationOfAssets>();
  const [secondDeclarationOfAssets, setSecondDeclarationOfAssets] =
    useState<CompanyDeclarationOfAssets>();
  const navigate = useNavigate();

  useEffect(() => {
    if (dataSource === CompanyFileSourceType.Company) {
      let promises: Promise<CompanyLastYearDeclarationOfAssets>[] = ids.map(
        (x) => HttpCompanyDeclarationOfAssets.getById(dataId, x),
      );

      Promise.all(promises).then((results) => {
        setFirstDeclarationOfAssets(results[0]);
        setSecondDeclarationOfAssets(results[1]);
      });
    } else {
      HttpCompanyFile.getCompanyDeclarationOfAssetsByFileId(dataId).then(
        (res) => {
          setFirstDeclarationOfAssets(res);
          setSecondDeclarationOfAssets(
            res[
              CompanyLastYearDeclarationOfAssetsFields.LastDeclarationOfAssets
            ],
          );
        },
      );
    }
  }, [ids]);

  return (
    <>
      {firstDeclarationOfAssets && secondDeclarationOfAssets && (
        <Grid container spacing={2}>
          <Grid item xs={6}>
            <Card>
              <CardHeader
                title={'Estado de Situación Patrimonial'}
                subheader={`Fecha: ${dateFormatter.toShortDate(firstDeclarationOfAssets[CompanyDeclarationOfAssetsFields.Date])}`}
                action={
                  <Button
                    variant={'contained'}
                    startIcon={<EditOutlinedIcon />}
                    onClick={() => {
                      navigate(
                        `?edit=${firstDeclarationOfAssets[EntityWithIdFields.Id]}&type=${PersonTypes.Legal}&patrimonial`,
                      );
                    }}
                  >
                    Editar
                  </Button>
                }
              />
              <CardContent>
                <CompanyDeclarationOfAssetsPatrimonialTableDetail
                  firstYear={firstDeclarationOfAssets}
                  secondYear={secondDeclarationOfAssets}
                />
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={6}>
            <Card>
              <CardHeader
                title={'Estado de Resultado'}
                subheader={`Fecha: ${dateFormatter.toShortDate(firstDeclarationOfAssets[CompanyDeclarationOfAssetsFields.Date])}`}
                action={
                  <Button
                    variant={'contained'}
                    startIcon={<EditOutlinedIcon />}
                    onClick={() => {
                      navigate(
                        `?edit=${firstDeclarationOfAssets[EntityWithIdFields.Id]}&type=${PersonTypes.Legal}&income`,
                      );
                    }}
                  >
                    Editar
                  </Button>
                }
              />
              <CardContent>
                <CompanyDeclarationOfAssetsIncomeTableDetail
                  firstYear={firstDeclarationOfAssets}
                  secondYear={secondDeclarationOfAssets}
                />
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      )}
    </>
  );
};

export default CompanyFileDeclarationOfAssetsDetailTab;
