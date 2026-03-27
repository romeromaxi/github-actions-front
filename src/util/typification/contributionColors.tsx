import {
  ContributionStatus,
  SituationTypeCodes,
} from '../../types/general/generalEnums';
import { situationColor, SituationColorMap } from './situationColor';

export const contributionColors: Record<ContributionStatus, situationColor> = {
  [ContributionStatus.Paid]: SituationColorMap[SituationTypeCodes.Normal],
  [ContributionStatus.Partial]:
    SituationColorMap[SituationTypeCodes.WithIssues],
  [ContributionStatus.Unpaid]:
    SituationColorMap[SituationTypeCodes.Unrecoverable],
};
