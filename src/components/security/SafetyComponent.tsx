import React from 'react';
import useSecurityObject from 'hooks/useSecurityObject';

export interface SafetyComponentBaseProps {
  componentName: string;
  objectName: string;
  permissionWorkflowCode?: number;
}

export interface SafetyComponentProps extends SafetyComponentBaseProps {
  children: React.ReactElement;
  dict?: any;
  disabled?: boolean;
}

export function SafetyComponent(props: SafetyComponentProps) {
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

  if (props.dict && readPermission) {
    props.dict.push(
      React.cloneElement(props.children, { disabled: props.disabled || !writePermission }),
    );
    return null;
  }

  return readPermission
    ? React.cloneElement(props.children, { disabled: props.disabled || !writePermission })
    : null;
}
