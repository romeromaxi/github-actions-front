import React from 'react';
import { Grid } from '@mui/material';
import { GridProps } from '@mui/material/Grid/Grid';
import useSecurityObject from 'hooks/useSecurityObject';
import {SafetyComponentProps} from './SafetyComponent';

interface SafetyGridComponentProps extends SafetyComponentProps, GridProps {
  children: React.ReactElement;
}

export function SafetyGridComponent(props: SafetyGridComponentProps) {
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
    <Grid {...props}>
      {React.cloneElement(props.children, { disabled: !writePermission })}
    </Grid>
  ) : null;
}
