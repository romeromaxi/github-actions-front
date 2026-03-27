import React, {useEffect, useState} from "react";
import {Stack} from "@mui/material";
import {HttpSolicitation} from "http/index";
import {SolicitationStep} from "types/solicitations/solicitationData";
import SolicitationFollowUpStepsComponent from "../followUp/SolicitationFollowUpStepsComponent";
import {TypographyBase} from "components/misc/TypographyBase";

interface SolicitationFollowUpStepsCardsProps {
  solicitationId?: number,
}

function SolicitationFollowUpStepsCards({solicitationId}: SolicitationFollowUpStepsCardsProps) {
  const [steps, setSteps] = useState<SolicitationStep[]>();
    
  const loadSteps = (id: number) => {
    const fnGetSteps = HttpSolicitation.getSolicitationCompanySteps;
    
    fnGetSteps(id).then(setSteps);
  }
  
  useEffect(() => {
    setSteps(undefined);
    
    if (solicitationId)
      loadSteps(solicitationId)
  }, [solicitationId]);
  
  return (
    <Stack spacing={4}>
        <TypographyBase variant={'h3'}>
            Progreso de tu solicitud
        </TypographyBase>
        
        <Stack spacing={1.3} direction={{ xs: 'column', md: 'row' }}>
            {
                steps && steps.map((oneStep, index) => (
                    <Stack flex={1} direction={{ xs: 'column', md: 'row' }}
                           width={1}
                           alignItems={'center !important'}
                           spacing={1.3}
                    >
                        <SolicitationFollowUpStepsComponent step={oneStep}
                                                            isFirstStep={!index}
                        />
                    </Stack>
                ))
            }
        </Stack>
    </Stack>
  )
}

export default SolicitationFollowUpStepsCards;