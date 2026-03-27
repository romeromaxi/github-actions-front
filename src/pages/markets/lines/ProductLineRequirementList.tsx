import React, { useEffect, useState } from 'react';
import { Divider, Stack, Typography } from '@mui/material';

import Section from 'components/cards/Section';
import ChipWithTooltip from 'components/misc/ChipWithTooltip';

import {
  EntityWithIdAndDescription,
  EntityWithIdAndDescriptionFields,
  EntityWithIdFields,
} from 'types/baseEntities';

import { HttpProductLineRequirement } from 'http/line/httpProductLineRequirement';
import {
  ProductLineRequirementFields,
  ProductLineRequirementView,
} from 'types/lines/productLineData';

import { HttpCacheRequirement } from 'http/cache/httpCacheRequirement';

interface ProductLineRequirementListProps {
  productLineId: number;
}

interface RequirementByClassification {
  [key: string]: ProductLineRequirementView[];
}

function ProductLineRequirementList(props: ProductLineRequirementListProps) {
  const [requirementsByClassification, setRequirementsByClassification] =
    useState<RequirementByClassification>();

  useEffect(() => {
    Promise.all([
      HttpCacheRequirement.getRequirementsClassifications(),
      HttpProductLineRequirement.getByProductLine(props.productLineId),
    ]).then(
      ([classifications, productLines]: [
        EntityWithIdAndDescription[],
        ProductLineRequirementView[],
      ]) => {
        let dictionary: RequirementByClassification = {};

        classifications.forEach((classification) => {
          dictionary[
            classification[EntityWithIdAndDescriptionFields.Description]
          ] = productLines.filter(
            (x) =>
              x[ProductLineRequirementFields.RequirementClassificationCode] ===
              classification[EntityWithIdFields.Id],
          );
        });

        setRequirementsByClassification(dictionary);
      },
    );
  }, []);

  const mapRequirements = () => {
    let components: React.ReactElement[] = [];
    requirementsByClassification &&
      Object.entries(requirementsByClassification).forEach(([key, value]) => {
        components.push(<Typography fontWeight={600}>{key}</Typography>);
        components.push(<Divider />);

        if (value.length)
          components.push(
            <Stack spacing={1} mt={1}>
              {value.map((requirement, index) => {
                let requirementDescription: string =
                  requirement[ProductLineRequirementFields.Description];
                return (
                  <ChipWithTooltip
                    title={`${requirement[ProductLineRequirementFields.RequirementDescription]}: ${requirementDescription}`}
                    tooltip={requirementDescription}
                    key={`tooltipProductLineRequirementList_${requirementDescription}_${index}`}
                  />
                );
              })}
            </Stack>,
          );
        else
          components.push(
            <Typography
              fontWeight={500}
              fontStyle="italic"
              color="text.disabled"
            >
              Sin requerimientos
            </Typography>,
          );
      });

    return components;
  };

  return (
    <Section title="Requerimientos">
      <Stack>{mapRequirements()}</Stack>
    </Section>
  );
}

export default ProductLineRequirementList;
