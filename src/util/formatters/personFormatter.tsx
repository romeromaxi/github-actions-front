import {NosisMainDataResponse, NosisMainDataResponseFields} from "../../types/person/personData";
import {Role, RoleFields} from "../../types/company/rolesData";
import {LoggerService, LogLevels} from "../../http/logger/httpLogger";

const formatFinalName = (businessName: string, firstName?: string, lastName?: string) => {
  if (!firstName || !lastName) return businessName;

  return `${firstName} ${lastName}`
}

export const personFormatter = {
  getNameFromNosisData: (nosisMainData: NosisMainDataResponse) : string =>
      formatFinalName(
          nosisMainData[NosisMainDataResponseFields.BusinessName], 
          nosisMainData[NosisMainDataResponseFields.FirstName], 
          nosisMainData[NosisMainDataResponseFields.LastName]
      ),
  
  getNameFromRole: (role: Role): string =>
      formatFinalName(
          role[RoleFields.LegalName],
          role[RoleFields.Name],
          role[RoleFields.LastName]
      ),

    getFirstLastAndDisplayNameFromFullName: (fullName?: string) : [string, string, string] => {
        if (!fullName?.trim()) {
            return ['', '', ''];
        }

        let firstName = '';
        let lastName = '';

        if (fullName.includes(',')) {
            const parts = fullName.split(',').map((name) => name.trim());
            if (parts.length === 1) {
                lastName = parts[0] || '';
            } else if (parts.length >= 2) {
                lastName = parts[0] || '';
                firstName = parts[1] || '';
            }
        } else {
            try {
                const parts = fullName.trim().split(/\s+/);
                if (parts.length === 1) {
                    firstName = parts[0];
                } else if (parts.length === 2) {
                    firstName = parts[0];
                    lastName = parts[1];
                } else {
                    lastName = parts[parts.length - 1];
                    firstName = parts.slice(0, -1).join(' ');
                }                
            } catch (e) {
                LoggerService.log({
                    level: LogLevels.Error,
                    // @ts-ignore
                    detail: 'Frontend error: ' + (e.stack || "Stack trace del error no disponible" + (e || "")),
                });
            }
        }

        return [firstName, lastName, formatFinalName(fullName, firstName, lastName)];
    }
      
};
