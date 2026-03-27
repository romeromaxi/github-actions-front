import React from 'react';
import { Tab } from '@mui/material';
import useSecurityObject from 'hooks/useSecurityObject';
import { SafetyComponentBaseProps } from './SafetyComponent';

interface SafetyTabComponentProps extends SafetyComponentBaseProps {
  value: number;
  children: React.ReactElement;
}

export function SafetyTabComponent(props: SafetyTabComponentProps) {
  const {
    hasReadPermission,
    hasWritePermission,
    hasReadWorkflowPermission,
    hasWriteWorkflowPermission,
  } = useSecurityObject();

  const readPermission: boolean =
    props.permissionWorkflowCode != undefined
      ? hasReadWorkflowPermission(
          props.permissionWorkflowCode,
          props.componentName,
          props.objectName,
        )
      : hasReadPermission(props.componentName, props.objectName);
  const writePermission: boolean =
    props.permissionWorkflowCode != undefined
      ? hasWriteWorkflowPermission(
          props.permissionWorkflowCode,
          props.componentName,
          props.objectName,
        )
      : hasWritePermission(props.componentName, props.objectName);

  return readPermission ? (
    React.cloneElement(props.children, { disabled: !writePermission })
  ) : (
    <Tab
      value={props.value}
      disableTouchRipple
      style={{ display: 'none' }}
      disabled
    />
  );
}
