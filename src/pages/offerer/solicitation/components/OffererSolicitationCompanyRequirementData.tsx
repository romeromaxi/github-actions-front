import {
  SolicitationCompanyRequirementDataView,
  SolicitationCompanyRequirementDataViewFields
} from "types/solicitations/solicitationData";
import {TypographyBase} from "components/misc/TypographyBase";
import {WrapperIcons} from "components/icons/Icons";
import {CheckCircle, Warning} from "@phosphor-icons/react";
import {Box, Stack} from "@mui/material";

interface OffererSolicitationCompanyRequirementDataProps {
  requirementData: SolicitationCompanyRequirementDataView
}

function OffererSolicitationCompanyRequirementData({requirementData}: OffererSolicitationCompanyRequirementDataProps) {
  const approveRequirement = requirementData[SolicitationCompanyRequirementDataViewFields.ApprovesRequirement];
  const valueRequirement = requirementData[SolicitationCompanyRequirementDataViewFields.Value] ?? '-';
  
  if (!requirementData[SolicitationCompanyRequirementDataViewFields.ShowDataValue]) 
    return (
      <Stack direction={'row'} spacing={1} alignItems={'center'}>
        <TypographyBase variant="caption" color={'text.lighter'} tooltip maxLines={1}>
          {`${requirementData[SolicitationCompanyRequirementDataViewFields.Description]}:`}
        </TypographyBase>
        
        <WrapperIcons Icon={approveRequirement ? CheckCircle : Warning}
                      color={approveRequirement ? 'success' : 'warning'}
                      size={'sm'}
        />
      </Stack>
    )
  
  return (
    <Box>
      <TypographyBase variant="caption" color={'text.lighter'} tooltip maxLines={1}>
        {
          requirementData[SolicitationCompanyRequirementDataViewFields.ShowDataDescription] ?
            `${requirementData[SolicitationCompanyRequirementDataViewFields.Description]}: ${valueRequirement}`
            :
            valueRequirement
        }
      </TypographyBase>
    </Box>
  )
}

export default OffererSolicitationCompanyRequirementData;