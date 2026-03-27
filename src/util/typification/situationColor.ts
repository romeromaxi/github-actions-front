import { SituationTypeCodes } from '../../types/general/generalEnums';

export interface situationColor {
  light: string;
  dark: string;
}

export const SituationColorMap: Record<SituationTypeCodes, situationColor> = {
  [SituationTypeCodes.Normal]: {
    light: `rgba(39, 206, 136, 0.2)`,
    dark: `#27B877`,
  },
  [SituationTypeCodes.Following]: {
    light: `rgba(48, 176, 122, 0.2)`,
    dark: `#36A194`,
  },
  [SituationTypeCodes.WithIssues]: {
    light: `rgba(158, 157, 36, 0.2)`,
    dark: `#B29123`,
  },
  [SituationTypeCodes.WithRisk]: {
    light: `rgba(239, 108, 0, 0.2)`,
    dark: `#C77421`,
  },
  [SituationTypeCodes.Unrecoverable]: {
    light: `rgba(198, 40, 40, 0.2)`,
    dark: `#CD4D2D`,
  },
  [SituationTypeCodes.TechnicallyUnrecoverable]: {
    light: `rgba(198, 40, 40, 0.2)`,
    dark: `#A3170D`,
  },
  [SituationTypeCodes.Unknown]: {
    light: `rgba(0, 0, 0, 0.1)`,
    dark: `#5B6560`,
  },
};
