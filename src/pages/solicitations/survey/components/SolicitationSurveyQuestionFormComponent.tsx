import React from "react";
import {SolicitationSurveyQuestion, SolicitationSurveyQuestionFields} from "types/solicitations/solicitationSurveyData";
import {useForm, useFormContext} from "react-hook-form";
import {AsyncSelect, ControlledRadioYesNo, ControlledTextFieldFilled} from "components/forms";
import {EntityWithIdAndDescriptionFields, EntityWithIdFields} from "types/baseEntities";
import {HttpCacheSolicitation} from "http/index";
import {SolicitationSurveyQuestionFormats} from "types/solicitations/solicitationSurveyEnums";
import {ControlledMultipleSelectAsync} from "components/forms/ControlledMultipleSelectAsync";
import {Stack} from "@mui/material";
import { TypographyBase } from "components/misc/TypographyBase";

interface SolicitationSurveyQuestionFormComponentProps {
  nameBase: string,
  question: SolicitationSurveyQuestion,
  allowEdit?: boolean
}

function SolicitationSurveyQuestionFormComponent(props: SolicitationSurveyQuestionFormComponentProps) {
  let component = <div></div>;

  switch (props.question[SolicitationSurveyQuestionFields.SolicitationSurveyQuestionFormatCode]) {
    case SolicitationSurveyQuestionFormats.Select:
      component = <SolicitationSurveyQuestionFormComponentSelect {...props} />;
      break;

    case SolicitationSurveyQuestionFormats.MultiSelect:
      component = <SolicitationSurveyQuestionFormComponentMultiSelect {...props} />;
      break;

    case SolicitationSurveyQuestionFormats.InputCurrency:
      component = <SolicitationSurveyQuestionFormComponentInput {...props} currency />;
      break;
      
    case SolicitationSurveyQuestionFormats.InputText:
    case SolicitationSurveyQuestionFormats.InputNumber:
    case SolicitationSurveyQuestionFormats.InputPercentage:
      component = <SolicitationSurveyQuestionFormComponentInput {...props} />;
      break;

    case SolicitationSurveyQuestionFormats.Boolean:
      component = <SolicitationSurveyQuestionFormComponentBoolean {...props} />;
      break;
  }

  return (
    <Stack>
      <TypographyBase variant={'label'} fontWeight={500}>
        {props.question[EntityWithIdAndDescriptionFields.Description]}
      </TypographyBase>

      {component}
    </Stack>
  )
}

function SolicitationSurveyQuestionFormComponentSelect({nameBase, question, allowEdit}: SolicitationSurveyQuestionFormComponentProps) {
  const { control } = useFormContext();
  const name = nameBase ? `${nameBase}.${question[EntityWithIdFields.Id]}` : `${question[EntityWithIdFields.Id]}`;

  const loadOptions = () => HttpCacheSolicitation.getSolicitationSurveyOptionsByQuestion(question[EntityWithIdFields.Id]);

  return (
    <AsyncSelect
      control={control}
      name={name}
      loadOptions={loadOptions}
      disabled={!allowEdit}
    />
  )
}

function SolicitationSurveyQuestionFormComponentMultiSelect({nameBase, question, allowEdit}: SolicitationSurveyQuestionFormComponentProps) {
  const { control } = useFormContext();
  const name = nameBase ? `${nameBase}.${question[EntityWithIdFields.Id]}` : `${question[EntityWithIdFields.Id]}`;

  const loadOptions = () => HttpCacheSolicitation.getSolicitationSurveyOptionsByQuestion(question[EntityWithIdFields.Id]);

  return (
    <ControlledMultipleSelectAsync
      id={name}
      loadOptions={loadOptions}
      control={control}
      name={name}
      sx={{ width: '100%', backgroundColor: 'white' }}
      disabled={!allowEdit}
      fullWidth
    />
  )
}

interface SolicitationSurveyQuestionFormComponentInputProps extends SolicitationSurveyQuestionFormComponentProps {
  currency?: boolean
}

function SolicitationSurveyQuestionFormComponentInput({nameBase, question, allowEdit, currency}: SolicitationSurveyQuestionFormComponentInputProps) {
  const { control } = useFormContext();
  const name = nameBase ? `${nameBase}.${question[EntityWithIdFields.Id]}` : `${question[EntityWithIdFields.Id]}`;

  return (
    <ControlledTextFieldFilled
      name={name}
      control={control}
      disabled={!allowEdit}
      currency={currency}
    />
  )
}

function SolicitationSurveyQuestionFormComponentBoolean({nameBase, question, allowEdit}: SolicitationSurveyQuestionFormComponentProps) {
  const name = nameBase ? `${nameBase}.${question[EntityWithIdFields.Id]}` : `${question[EntityWithIdFields.Id]}`;
  const nameAttribute = `hasAttribute_${question[EntityWithIdFields.Id]}`;
  const { control, setValue, getValues } = useFormContext();
  const methods = useForm<{ [nameAttribute]: boolean }>({
    defaultValues: {
      [nameAttribute]: !!getValues(name) ? (getValues(name) !== 'No') : undefined
    }
  });
  const watchHasAttribute = methods.watch(nameAttribute);

  return (
    <Stack direction={'row'} minHeight={'40px'} pl={1} spacing={4} alignItems={'center'}>
      <ControlledRadioYesNo
        name={nameAttribute}
        control={methods.control}
        setValue={methods.setValue}
        disabled={!allowEdit}
        onChange={(_, value) => setValue(name, value === "true" ? '' : 'No')}
        row
      />

      <ControlledTextFieldFilled
        name={name}
        control={control}
        disabled={!allowEdit || !watchHasAttribute}
        sx={{ display: watchHasAttribute ? '' : 'none' }}
      />
    </Stack>
  )
}

export default SolicitationSurveyQuestionFormComponent;