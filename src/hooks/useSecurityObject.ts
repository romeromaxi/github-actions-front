import { useContext, useMemo } from 'react';
import { SecurityObjectContext } from '../App';
import { PermissionType } from '../types/security';

const useSecurityObject = () => {
  const { dictionarySecurityObject } = useContext(SecurityObjectContext);
  const isLoadingPermissions = useMemo(() => !dictionarySecurityObject, [dictionarySecurityObject]);
  
  const isReadPermissionCode = (permissionCode: number): boolean =>
    permissionCode === PermissionType.Read ||
    permissionCode === PermissionType.Write;

  const isWritePermissionCode = (permissionCode: number): boolean =>
    permissionCode === PermissionType.Write;

  const getPermissionTypeCode = (
    componentName: string,
    objectName: string,
  ): number => {
    if (isLoadingPermissions) return PermissionType.None;
    
    const permissions = dictionarySecurityObject?.[componentName];

    const permissionsForThisSecurityObject = permissions?.find((permission) => permission.descripcion === objectName);

    if (!permissionsForThisSecurityObject) {
      return PermissionType.Write;
    }
    
    return permissionsForThisSecurityObject.codPermisoTipo ?? PermissionType.Write;
  };
      

  const hasReadPermission = (
    componentName: string,
    objectName: string,
  ): boolean => {
    const permissionTypeCode: number = getPermissionTypeCode(
      componentName,
      objectName,
    );
    
    return isReadPermissionCode(permissionTypeCode);
  };

  const hasWritePermission = (
    componentName: string,
    objectName: string,
  ): boolean => {
    const permissionTypeCode: number = getPermissionTypeCode(
      componentName,
      objectName,
    );

    return isWritePermissionCode(permissionTypeCode);
  };

  const hasReadWorkflowPermission = (
    permissionWorkflowCode: number,
    componentName: string,
    objectName: string,
  ): boolean =>
    isReadPermissionCode(permissionWorkflowCode) &&
    hasReadPermission(componentName, objectName);

  const hasWriteWorkflowPermission = (
    permissionWorkflowCode: number,
    componentName: string,
    objectName: string,
  ): boolean =>
    isWritePermissionCode(permissionWorkflowCode) &&
    hasWritePermission(componentName, objectName);

  return {
    hasReadPermission,
    hasWritePermission,
    hasReadWorkflowPermission,
    hasWriteWorkflowPermission,
    isLoadingPermissions,
  };
};

export default useSecurityObject;
