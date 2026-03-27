import React, { useEffect, useState } from 'react';
import {
  ControlledTextFieldFilled,
  ControlledTextFieldProps,
} from './ControlledTextField';
import {
  EntityWithIdAndDescription,
  EntityWithIdAndDescriptionAndDetail,
  EntityWithIdAndDescriptionFields
} from '../../types/baseEntities';

interface AsyncSelectProps extends ControlledTextFieldProps {
  loadOptions: () => Promise<EntityWithIdAndDescription[] | EntityWithIdAndDescriptionAndDetail[]> | undefined;
  autoSelect?: boolean;
  optionsWithTooltip?: boolean;
  disableEmpty?: boolean;
}

export const AsyncSelect = ({
  autoSelect = false, optionsWithTooltip = false, disableEmpty = false, ...props
}: AsyncSelectProps) => {
  const [loading, setLoading] = useState(false);
  const [options, setOptions] = useState<EntityWithIdAndDescription[] | EntityWithIdAndDescriptionAndDetail[]>([]);
  const [autoSelectValue, setAutoSelectValue] = useState<number>();

  const { loadOptions } = props;

  useEffect(() => {
    const request = loadOptions();

    if (request) {
      setLoading(true);
      
      request.then((options) => {
        
        if (autoSelect && options.length === 1) {
          const uniqueValue = options[0][EntityWithIdAndDescriptionFields.Id];

          // @ts-ignore
          props.control._formValues[props.name] = uniqueValue;
          setAutoSelectValue(uniqueValue);
        }
        
        setOptions(options);
        setLoading(false);
      });
    }
  }, [loadOptions, props.control, props.name, autoSelect]);
  
  return (
    <ControlledTextFieldFilled
      {...props}
      select
      optionsWithTooltip={optionsWithTooltip}
      options={loading ? undefined : options}
      key={autoSelectValue}
      disabled={props.disabled || !!autoSelectValue}
      disableEmpty={disableEmpty}
    />
  );
};
