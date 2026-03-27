import React, { useEffect, useState } from 'react';

import { Skeleton } from '@mui/lab';
import ChipWithTooltip from 'components/misc/ChipWithTooltip';

import {
  ProductLineRequisiteDetailFields,
  ProductLineRequisiteDetailView,
} from 'types/lines/productLineData';

import { HttpAddressData } from 'http/general';
import { HttpCacheGeneral, HttpCachePerson } from 'http/index';

import { ProductLineRequisiteType } from 'types/lines/productLineEnums';
import {
  EntityWithIdAndDescriptionFields,
  EntityWithIdFields,
} from 'types/baseEntities';
import { numberFormatter } from 'util/formatters/numberFormatter';

interface ProductLineRequisiteChipProps {
  requisiteType: ProductLineRequisiteType;
  requisites: ProductLineRequisiteDetailView[];
}

function ProductLineRequisiteChip(props: ProductLineRequisiteChipProps) {
  const mapRequisiteByType = () => {
    switch (props.requisiteType) {
      case ProductLineRequisiteType.Province:
        return <ProductLineRequisiteChipProvinces {...props} />;
      case ProductLineRequisiteType.ClassificationSepyme:
        return <ProductLineRequisiteChipClassificationSepyme {...props} />;
      case ProductLineRequisiteType.ActivitySector:
        return <ProductLineRequisiteChipActivitySector {...props} />;
      case ProductLineRequisiteType.Gender:
        return <ProductLineRequisiteChipGender {...props} />;
      case ProductLineRequisiteType.Amount:
        return <ProductLineRequisiteChipAmount {...props} />;
      case ProductLineRequisiteType.Seniority:
        return <ProductLineRequisiteChipSeniority {...props} />;

      default:
        return (
          <ChipWithTooltip
            title={
              props.requisites[0][
                ProductLineRequisiteDetailFields.RequisiteTitle
              ]
            }
            tooltip={''}
            key={`tooltipRequisite`}
          />
        );
    }
  };

  return mapRequisiteByType();
}

function ProductLineRequisiteChipProvinces({
  requisites,
}: ProductLineRequisiteChipProps) {
  const [provincesNames, setProvincesNames] = useState<string>();

  useEffect(() => {
    HttpAddressData.getProvinces(1).then((provinces) => {
      let accumProvincesNames: string = '';

      requisites.forEach((requisite) => {
        let province: string = provinces.filter(
          (x) =>
            x[EntityWithIdFields.Id] ===
            requisite[ProductLineRequisiteDetailFields.ProvinceCode],
        )[0][EntityWithIdAndDescriptionFields.Description];

        if (accumProvincesNames) accumProvincesNames += `, ${province}`;
        else accumProvincesNames = province;
      });

      setProvincesNames(`${accumProvincesNames || 'sin restricciones'}`);
    });
  }, []);

  return provincesNames ? (
    <ChipWithTooltip
      title={`Radicación Pyme: ${provincesNames}`}
      tooltip={`La Pyme debe estar radicada en alguna de las siguientes provincias: ${provincesNames}`}
      key={`tooltipRequisiteChipProvinces`}
    />
  ) : (
    <Skeleton />
  );
}

function ProductLineRequisiteChipClassificationSepyme({
  requisites,
}: ProductLineRequisiteChipProps) {
  const [classificationNames, setClassificationNames] = useState<string>();

  useEffect(() => {
    HttpCacheGeneral.getAfipSection().then((afipSections) => {
      let accumClassificationNames: string = '';

      requisites.forEach((requisite) => {
        let section: string = afipSections.filter(
          (x) =>
            x[EntityWithIdFields.Id] ===
            requisite[ProductLineRequisiteDetailFields.AfipSepymeCode],
        )[0][EntityWithIdAndDescriptionFields.Description];

        if (accumClassificationNames)
          accumClassificationNames += `, ${section}`;
        else accumClassificationNames = section;
      });

      setClassificationNames(
        `${accumClassificationNames || 'sin restricciones'}`,
      );
    });
  }, []);

  return classificationNames ? (
    <ChipWithTooltip
      title={`Clasificación Sepyme: ${classificationNames}`}
      tooltip={`La Pyme debe estar clasificada como alguna de las siguientes categorías: ${classificationNames}`}
      key={`tooltipRequisiteChipClassificationSepyme`}
    />
  ) : (
    <Skeleton />
  );
}

function ProductLineRequisiteChipActivitySector({
  requisites,
}: ProductLineRequisiteChipProps) {
  const [sectorNames, setSectorNames] = useState<string>();

  useEffect(() => {
    HttpCacheGeneral.getAfipSectors().then((afipSectors) => {
      let accumSectorNames: string = '';

      requisites.forEach((requisite) => {
        let section: string = afipSectors.filter(
          (x) =>
            x[EntityWithIdFields.Id] ===
            requisite[ProductLineRequisiteDetailFields.AfipSectorCode],
        )[0][EntityWithIdAndDescriptionFields.Description];

        if (accumSectorNames) accumSectorNames += `, ${section}`;
        else accumSectorNames = section;
      });

      setSectorNames(`${accumSectorNames || 'sin restricciones'}`);
    });
  }, []);

  return sectorNames ? (
    <ChipWithTooltip
      title={`Actividad Sector: ${sectorNames}`}
      tooltip={`La Actividad de la Pyme debe estar dedicada a alguna de los siguientes sectores: ${sectorNames}`}
      key={`tooltipRequisiteChipActivitySector`}
    />
  ) : (
    <Skeleton />
  );
}

function ProductLineRequisiteChipGender({
  requisites,
}: ProductLineRequisiteChipProps) {
  const [genresNames, setGenresNames] = useState<string>();

  useEffect(() => {
    HttpCachePerson.getGenderTypes().then((genres) => {
      let accumGenresNames: string = '';

      requisites.forEach((requisite) => {
        let section: string = genres.filter(
          (x) =>
            x[EntityWithIdFields.Id] ===
            requisite[ProductLineRequisiteDetailFields.GenderCode],
        )[0][EntityWithIdAndDescriptionFields.Description];

        if (accumGenresNames) accumGenresNames += `, ${section}`;
        else accumGenresNames = section;
      });

      setGenresNames(`${accumGenresNames || 'sin restricciones'}`);
    });
  }, []);

  return genresNames ? (
    <ChipWithTooltip
      title={`Género: ${genresNames}`}
      tooltip={`El género deber ser: ${genresNames}`}
      key={`tooltipRequisiteChipGender`}
    />
  ) : (
    <Skeleton />
  );
}

function ProductLineRequisiteChipAmount({
  requisites,
}: ProductLineRequisiteChipProps) {
  const minValue: string = requisites[0][
    ProductLineRequisiteDetailFields.BillingAmountMinimum
  ]
    ? numberFormatter.toStringWithAmount(
        requisites[0][ProductLineRequisiteDetailFields.BillingAmountMinimum] ||
          0,
        '$',
      )
    : 'sin restricción';
  const maxValue: string = requisites[0][
    ProductLineRequisiteDetailFields.BillingAmountMaximum
  ]
    ? numberFormatter.toStringWithAmount(
        requisites[0][ProductLineRequisiteDetailFields.BillingAmountMaximum] ||
          0,
        '$',
      )
    : 'sin restricción';

  const range: string = `Mín: ${minValue}. Máx: ${maxValue}.`;

  return (
    <ChipWithTooltip
      title={`Monto de Facturación: ${range}`}
      tooltip={`El monto de facturación debe estar comprendido en el siguiente rango: ${range}`}
      key={`tooltipRequisiteChipAmount`}
    />
  );
}

function ProductLineRequisiteChipSeniority({
  requisites,
}: ProductLineRequisiteChipProps) {
  const minValue: string =
    requisites[0][
      ProductLineRequisiteDetailFields.SeniorityCompanyMinimum
    ]?.toString() || 'sin restricción';
  const maxValue: string =
    requisites[0][
      ProductLineRequisiteDetailFields.SeniorityCompanyMaximum
    ]?.toString() || 'sin restricción';

  const range: string = `Mín: ${minValue}. Máx: ${maxValue}.`;

  return (
    <ChipWithTooltip
      title={`Antigüedad Pyme: ${range}`}
      tooltip={`La antigüedad de la pyme debe estar comprendida en el siguiente rango: ${range}`}
      key={`tooltipRequisiteChipAmount`}
    />
  );
}

export default ProductLineRequisiteChip;
