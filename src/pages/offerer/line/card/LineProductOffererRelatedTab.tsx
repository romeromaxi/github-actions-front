import {Alert, Box, Card, CardContent, CardHeader, Grid, Stack, Typography} from "@mui/material";
import React, {useEffect, useState} from "react";
import {useProductLineDetail} from "pages/lines/ProductLineDetailContext";
import {ControlledMultipleSelect} from "components/forms/ControlledMultipleSelect";
import {EntityWithIdAndDescription} from "types/baseEntities";
import { HttpProductLine } from "http/index";
import {useForm, useFormContext} from "react-hook-form";
import {ControlledRadioYesNo} from "components/forms";
import {ProductLineFields} from "types/lines/productLineData";
import {Skeleton} from "@mui/lab";
enum LineProductOffererRelatedTabFormField {
  AllOfferer = 'amountOfferer'
}

interface LineProductOffererRelatedTabForm { 
  [LineProductOffererRelatedTabFormField.AllOfferer]: boolean
}

function LineProductOffererRelatedTab() {
  const { lineId, allowEdit, loading } = useProductLineDetail();
  const { setValue, watch } = useFormContext();
  const watchOfferers = watch(ProductLineFields.FinancialEntityRelatedIds);
  const [options, setOptions] = useState<EntityWithIdAndDescription[]>();

  const methods = useForm<LineProductOffererRelatedTabForm>({
    defaultValues: { [LineProductOffererRelatedTabFormField.AllOfferer]: undefined }
  });
  const allOfferer = !!methods.watch(LineProductOffererRelatedTabFormField.AllOfferer);

  const setCodesOptions = (value: number[], shouldDirty: boolean = true) => {
    setValue(
        ProductLineFields.FinancialEntityRelatedIds,
        value,
        { shouldDirty: shouldDirty }
    );
  };

  useEffect(() => {
    if (!loading) {
      HttpProductLine.getPotentialRelatedOffererByProductLineId(lineId)
          .then(response => {
            setOptions(response);
            methods.setValue(LineProductOffererRelatedTabFormField.AllOfferer, !watchOfferers || watchOfferers.length == 0, { shouldDirty: true })
          })
    }
  }, [loading]);

  useEffect(() => {
    if (allOfferer && options) setCodesOptions([], !!(watchOfferers?.length));
  }, [allOfferer, watchOfferers]);

  return (
      <Card>
        <CardHeader title="Entidades en convenio con esta línea"/>
        <CardContent>
          <Box>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <Stack direction='row' alignItems='center' justifyContent='space-between'>
                  <Typography variant='body2' color='text.lighter' fontWeight={500}>¿Esta línea tiene convenio con alguna/s entidad/es?</Typography>
                  {
                    (options && methods.getValues(LineProductOffererRelatedTabFormField.AllOfferer) !== undefined) ?
                        <ControlledRadioYesNo direction={'row'}
                                              control={methods.control}
                                              name={LineProductOffererRelatedTabFormField.AllOfferer}
                                              setValue={methods.setValue}
                                              labelOptions={{ trueLabel: "No", falseLabel: "Si" }}
                                              disabled={!allowEdit}
                        />
                        :
                        <Skeleton />
                  }
                </Stack>
              </Grid>
              
              {
                !allOfferer &&
                  <React.Fragment>
                    <Grid item xs={12}>
                      <Alert severity='info' color='info'>Seleccionar las entidades que tienen convenio con esta línea</Alert>
                    </Grid>
      
                    <Grid item xs={12} md={12}>
                      <ControlledMultipleSelect
                          label={''}
                          lstData={options}
                          valuesSelected={watchOfferers || []}
                          variant="outlined"
                          id={`selMulCodLineProductRequisite`}
                          field={'field'}
                          onHandleChange={(field: string, value?: number[]) =>
                              setCodesOptions(value || [])
                          }
                          disabled={!allowEdit}
                          filled
                          fullWidth
                      />
                    </Grid>
                  </React.Fragment>
              }
            </Grid>
          </Box>
        </CardContent>
      </Card>
  );
}

export default LineProductOffererRelatedTab;
