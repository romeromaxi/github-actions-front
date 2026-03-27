import React from 'react';
import { useFormContext } from 'react-hook-form';

import {
  Box,
  FormControlLabel,
  Grid,
  Radio,
  RadioGroup,
  Stack,
  Tooltip,
} from '@mui/material';
import HelpOutlineIcon from '@mui/icons-material/HelpOutline';
import { ControlledTextFieldFilled } from 'components/forms';

import {
  RequirementView,
  RequirementViewFields,
} from 'types/general/generalRequirementData';
import {
  EntityWithIdAndDescriptionFields,
  EntityWithIdFields,
} from 'types/baseEntities';
import {
  ProductLineFields,
  ProductLineRequirementFields,
  ProductLineRequirementInsert,
} from 'types/lines/productLineData';
import { grey } from '@mui/material/colors';

interface LineProductRequirementSectionFormProps {
  title: string;
  requirements: RequirementView[];
}

function LineProductRequirementSectionForm({
  title,
  requirements,
}: LineProductRequirementSectionFormProps) {
  const key: string = title.replace(/\s+/g, '');

  return (
    <Box>
      <Grid
        container
        spacing={2}
        sx={{
          borderRadius: '0.475rem',
          border: `1px dashed ${grey[300]} !important`,
          mb: 3,
        }}
      >
        {requirements.map((requirement, index) => (
          <Grid
            item
            xs={12}
            container
            key={`requirements${key}_${index}`}
            spacing={1}
          >
            <Grid item xs={5}>
              <Stack
                direction="row"
                justifyContent="flex-start"
                alignItems="center"
              >
                {requirement[EntityWithIdAndDescriptionFields.Description]}

                {requirement[RequirementViewFields.RequirementDetail] && (
                  <Tooltip
                    title={requirement[RequirementViewFields.RequirementDetail]}
                  >
                    <HelpOutlineIcon
                      sx={{ marginLeft: '20px', fontSize: '18px' }}
                    />
                  </Tooltip>
                )}
              </Stack>
            </Grid>
            <Grid item xs={7}>
              <RequirementForm
                requirementId={requirement[EntityWithIdFields.Id]}
              />
            </Grid>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
}

interface RequirementFormProps {
  requirementId: number;
}

function RequirementForm({ requirementId }: RequirementFormProps) {
  const { control, watch, setValue } = useFormContext();
  const watchListRequirementCodes = watch(ProductLineFields.ListRequirements);
  const index: number | null =
    watchListRequirementCodes &&
    watchListRequirementCodes.findIndex(
      (x: ProductLineRequirementInsert) =>
        x[ProductLineRequirementFields.RequirementCode] === requirementId,
    );

  const isSelected: boolean = index != null && index >= 0;

  const yesValue: string = 'true';
  const noValue: string = 'false';

  const onChangeOption = () => {
    if (!watchListRequirementCodes) return;
    let finalList: ProductLineRequirementInsert[];

    if (isSelected)
      finalList = watchListRequirementCodes.filter(
        (x: ProductLineRequirementInsert) =>
          x[ProductLineRequirementFields.RequirementCode] !== requirementId,
      );
    else
      finalList = [
        ...watchListRequirementCodes,
        {
          [ProductLineRequirementFields.RequirementCode]: requirementId,
          [ProductLineRequirementFields.Description]: '',
        },
      ];

    setValue(ProductLineFields.ListRequirements, finalList);
  };

  return (
    <Stack direction="row">
      <RadioGroup
        value={isSelected ? yesValue : noValue}
        onChange={onChangeOption}
        row
      >
        <FormControlLabel control={<Radio />} label="Si" value={yesValue} />
        <FormControlLabel control={<Radio />} label="No" value={noValue} />
      </RadioGroup>

      {isSelected && (
        <Box sx={{ width: '60%' }}>
          <ControlledTextFieldFilled
            label="Descripción"
            control={control}
            name={`${ProductLineFields.ListRequirements}[${index}].${ProductLineRequirementFields.Description}`}
          />
        </Box>
      )}
    </Stack>
  );
}

export default LineProductRequirementSectionForm;
