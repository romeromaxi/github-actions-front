import React, { useContext, useState } from 'react';
import SwipeableViews from 'react-swipeable-views';
import { FormProvider, useForm } from 'react-hook-form';

import { Box, Button, Grid, MobileStepper, Skeleton } from '@mui/material';
import { KeyboardArrowLeft, KeyboardArrowRight } from '@mui/icons-material';

import {
  ProductLineFields,
  ProductLineRequirementFields,
  ProductLineViewWithRequirement,
} from 'types/lines/productLineData';

import { arrayChunks } from 'util/helpers';
import PrequalificationCardLineForm from './PrequalificationCardLineForm';
import PrequalificationStepperButtonActions from '../PrequalificationStepperButtonActions';
import {
  PrequalificationStepperContext,
  PrequalificationStepProps,
} from '../PrequalificationStepper';
import { LoaderBlockUI } from 'components/loader';
import {
  SolicitationProductLineFields,
  SolicitationProductLineInsert,
  SolicitationRequirementFields,
  SolicitationRequirementInsert,
} from 'types/solicitations/solicitationData';
import { EntityWithIdFields } from 'types/baseEntities';
import { HttpProductLine } from 'http/index';

enum LineDataFields {
  Lines = 'lines',
}

export interface SolicitationProductLineInsertForm
  extends SolicitationProductLineInsert {
  [ProductLineFields.Line]: string;
  [ProductLineFields.ProductTemplateCode]?: number;
  [SolicitationProductLineFields.ListRequirements]: SolicitationRequirementInsertForm[];
}

export interface SolicitationRequirementInsertForm
  extends SolicitationRequirementInsert {
  [ProductLineRequirementFields.Description]: string;
  [ProductLineRequirementFields.RequirementDescription]: string;
}

interface LineDataForm {
  [LineDataFields.Lines]: SolicitationProductLineInsert[];
}

interface PrequalificationStepCompleteLinesDataFormProps
  extends PrequalificationStepProps {
  productLineWithRequirement: ProductLineViewWithRequirement[];
}

function PrequalificationStepCompleteLinesDataForm(
  props: PrequalificationStepCompleteLinesDataFormProps,
) {
  const chunkSize: number = 2;
  const { companyId } = useContext(PrequalificationStepperContext);

  const [isLoading, setLoading] = useState<boolean>(false);
  const [activeStep, setActiveStep] = useState<number>(0);

  const [linesByGroup] = useState<SolicitationProductLineInsertForm[][]>(
    arrayChunks(props.productLineWithRequirement, chunkSize),
  );

  const methods = useForm<LineDataForm>({
    defaultValues: {
      [LineDataFields.Lines]: props.productLineWithRequirement.map((x) => {
        return {
          [SolicitationProductLineFields.ProductLineId]:
            x[EntityWithIdFields.Id],
          [SolicitationProductLineFields.OffererId]:
            x[ProductLineFields.OffererId],
          [SolicitationProductLineFields.ExpirationDate]: undefined,
          [SolicitationProductLineFields.ListRequirements]: x[
            ProductLineFields.ListRequirements
          ].map((r) => {
            return {
              [SolicitationRequirementFields.RequirementCode]:
                r[ProductLineRequirementFields.RequirementCode],
              [SolicitationRequirementFields.ProductLineRequirementCode]:
                r[EntityWithIdFields.Id],
              [ProductLineRequirementFields.Description]:
                r[ProductLineRequirementFields.Description],
              [ProductLineRequirementFields.RequirementDescription]:
                r[ProductLineRequirementFields.RequirementDescription],
            };
          }),
          [ProductLineFields.Line]: x[ProductLineFields.Line],
          [ProductLineFields.ProductTemplateCode]:
            x[ProductLineFields.ProductTemplateCode],
        } as unknown as SolicitationProductLineInsertForm;
      }),
    },
  });

  const handleNext = () => {
    setActiveStep((prevActiveStep) => prevActiveStep + 1);
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  const handleStepChange = (step: number) => {
    setActiveStep(step);
  };

  const onHandleSubmit = (data: LineDataForm) => {
    if (companyId) {
      setLoading(true);

      HttpProductLine.prequalify(companyId, data[LineDataFields.Lines]).then(
        () => {
          setLoading(false);
          props.onNext && props.onNext();
        },
      );
    }
  };

  return (
    <Box mt={1}>
      <SwipeableViews
        axis={'x'}
        index={activeStep}
        onChangeIndex={handleStepChange}
      >
        {linesByGroup?.map((groupStep, index) => (
          <FormProvider {...methods}>
            <Box height="100%" key={`gridContainerCarouselLine_${index}`}>
              {Math.abs(activeStep - index) <= 2 ? (
                <Grid container spacing={2} p={1} height="100%">
                  {groupStep.map((lines, indexLine) => (
                    <Grid
                      item
                      xs={6}
                      key={`gridContainerCarouselLine_${index}_item_${indexLine}`}
                    >
                      <PrequalificationCardLineForm
                        nameBase={`${LineDataFields.Lines}.${index * chunkSize + indexLine}`}
                      />
                    </Grid>
                  ))}
                </Grid>
              ) : null}
            </Box>
          </FormProvider>
        ))}
      </SwipeableViews>

      {linesByGroup?.length ? (
        <MobileStepper
          position="static"
          activeStep={activeStep}
          sx={{ width: '100%', background: 'none' }}
          backButton={
            <Button
              size="small"
              onClick={handleBack}
              disabled={activeStep === 0}
            >
              <KeyboardArrowLeft />
            </Button>
          }
          nextButton={
            <Button
              size="small"
              onClick={handleNext}
              disabled={activeStep === linesByGroup.length - 1}
            >
              <KeyboardArrowRight />
            </Button>
          }
          steps={linesByGroup.length}
        />
      ) : (
        <Skeleton />
      )}

      <PrequalificationStepperButtonActions
        onNext={methods.handleSubmit(onHandleSubmit)}
        onBack={props.onBack}
      />

      {isLoading && <LoaderBlockUI />}
    </Box>
  );
}

export default PrequalificationStepCompleteLinesDataForm;
