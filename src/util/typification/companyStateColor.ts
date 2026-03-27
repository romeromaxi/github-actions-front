import { ValidationStatesType } from '../../types/person/personEnums';

export interface companyStateColor {
  light: string;
  dark: string;
}

export const CompanyStateColorMap: Record<
  ValidationStatesType,
  companyStateColor
> = {
  [ValidationStatesType.LoadProcess]: {
    light: `rgba(39, 105, 186, 0.2)`,
    dark: 'rgb(39, 105, 186)',
  },
  [ValidationStatesType.PendingValidation]: {
    light: `rgba(227, 155, 48, 0.2)`,
    dark: `rgb(227, 155, 48)`,
  },
  [ValidationStatesType.Returned]: {
    light: `rgba(227, 25, 25, 0.2)`,
    dark: `rgb(227, 25, 25)`,
  },
  [ValidationStatesType.Validated]: {
    light: `rgba(37, 156, 87, 0.2)`,
    dark: `rgb(37, 156, 87)`,
  },
  [ValidationStatesType.CreatedWithoutConfirmation]: {
    light: `rgba(39, 105, 186, 0.2)`,
    dark: 'rgb(39, 105, 186)',
  },
};
