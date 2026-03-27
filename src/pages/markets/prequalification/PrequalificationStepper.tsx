import React, { useContext, useEffect, useState } from 'react';
import { Box, Grid, Stack, Theme, useMediaQuery } from '@mui/material';
import { marketSolicitationStorage } from 'util/sessionStorage/marketSolicitationStorage';
import { HttpSolicitation } from 'http/index';
import { BaseResponseFields } from 'types/baseEntities';
import { useAction } from 'hooks/useAction';
import AgreeTermsDialog from './AgreeTermsDialog';
import { CompanyForm, CompanyViewDTO } from 'types/company/companyData';
import { SolicitationViewDTO, SolicitationViewDTOFields } from 'types/solicitations/solicitationData';
import { CompanyFileContext } from "../../../hooks/contexts/CompanyFileContext";
import PrequalificationStepperManagerStepsFloating from "./components/PrequalificationStepperManagerStepsFloating";
import {TypographyBase} from "../../../components/misc/TypographyBase";
import PrequalificationSuccessMessage from "./setps/PrequalificationSuccessMessage";

export interface PrequalificationDataSteps {
  label: string;
  title?: string;
  description: string;
  component: React.ReactElement;
  summaryLabel?: string;
  editManager?: React.ComponentType<{ company: CompanyViewDTO | undefined }>;
  checkFileCompletenessBefore?: boolean;
}

export interface PrequalificationStepProps {
  onBack?: () => void;
  onNext?: () => void;
}

export const PrequalificationStepperContext = React.createContext<{
  companyId: number;
  solicitationIdList: number[];
  solicitations: SolicitationViewDTO[] | undefined;
  stepperDone: boolean;
  editing: boolean;
  setEditing: (a: boolean) => void;
  handleBack: (toStep?: number) => void;
  handleNext: () => void;
  disableNext: boolean;
  setDisableNext: (a: boolean) => void;
  setOnBeforeSubmit: (func: () => Promise<any>) => void;
}>({
  companyId: 0,
  solicitationIdList: [],
  solicitations: undefined,
  stepperDone: false,
  editing: false,
  setEditing: () => {},
  handleBack: () => {},
  handleNext: () => {},
  disableNext: false,
  setDisableNext: () => {},
    setOnBeforeSubmit: (func: () => Promise<any>) => {}  
});

interface PrequalificationStepperProps {
  steps: PrequalificationDataSteps[];
  company?: CompanyForm,
  activityId?: number;
}

enum PrequalificationStepperStatus {
    Idle,
    Success,
    Failure
}

function PrequalificationStepper(props: PrequalificationStepperProps) {
  const { changeFileType, isCompletedFile } = useContext(CompanyFileContext);

  const { companyId, solicitationIdList } =
    marketSolicitationStorage.getCurrentSolicitation();
  const [open, setOpen] = useState<boolean>(false);
  const [solicitations, setSolicitations] = useState<SolicitationViewDTO[]>();
  const [editing, setEditing] = useState<boolean>(false);
  const [activeStep, setActiveStep] = useState<number>(0);
  const [completed, setCompleted] = useState<{
    [k: number]: boolean;
  }>({});
  const [stepperDone, setStepperDone] = useState<PrequalificationStepperStatus>(PrequalificationStepperStatus.Idle);
  const [disableNext, setDisableNext] = useState<boolean>(false);
  const [onBeforeSubmit, setOnBeforeSubmit] = useState<() => Promise<any>>();
  const { showLoader, hideLoader, snackbarWarning } = useAction();

  const isMobileScreenSize = useMediaQuery((theme: Theme) => theme.breakpoints.down('sm'));

  const handleBack = (toStep?: number) => {
      let targetStep = toStep;
      if (targetStep === undefined || isNaN(targetStep))
          targetStep = activeStep - 1;
      
      if ((targetStep >= activeStep) || (targetStep < 0)) return;

      setCompleted((prev) => {
          const updated = { ...prev };
          if (targetStep !== undefined && targetStep >= 0)
              for (let i: number = targetStep; i <= activeStep; i++) {
                  updated[i] = false;
              }

          return updated;
      });

      setDisableNext(false);
      setOnBeforeSubmit(undefined);
      setActiveStep(targetStep);
  };

  const handleNext = async () => {
    if (activeStep + 1 > props.steps.length) return;

      const goNext = () => {
          setOnBeforeSubmit(undefined);
          setCompleted({
              ...completed,
              [activeStep]: true,
          });
          setEditing(false);
          setActiveStep(activeStep + 1);
      };

      if (!!onBeforeSubmit) {
          onBeforeSubmit()
              .then(dataResponse => {
                  if (props.steps[activeStep]?.checkFileCompletenessBefore) {
                      if (!!dataResponse && !dataResponse[BaseResponseFields.Data]) {
                          snackbarWarning("Tenés que completar todos los datos del legajo antes de continuar");
                          return;
                      }
                  }
                  
                  goNext();
              });
      } else {
          if (props.steps[activeStep]?.checkFileCompletenessBefore) {
              if (!isCompletedFile()) {
                  snackbarWarning("Tenés que completar todos los datos del legajo antes de continuar");
                  return;
              }
          }

          goNext();
      }
  };

    const handleConfirm = () => {
        const onConfirm = () => {
            setOpen(true);

            setCompleted({
                ...completed,
                [activeStep]: true,
            });
        };

        if (!!onBeforeSubmit) {
            onBeforeSubmit()
                .then(onConfirm);
        } else {
            onConfirm();
        }
    };
    
  const handleSolicitationSend = async () => {
      if (completed[props.steps.length - 2]) {
      showLoader();
      
      try {
          const promiseList = solicitationIdList.map((s) =>
              HttpSolicitation.sendSolicitation(s),
          );
          const response = await Promise.all(promiseList);

          if (response.every((r) => !r[BaseResponseFields.HasError])) {
              setStepperDone(PrequalificationStepperStatus.Success);
          } else {
              setStepperDone(PrequalificationStepperStatus.Failure);
          }
      } catch {
          setStepperDone(PrequalificationStepperStatus.Failure);
      }
      finally {
          hideLoader();
      }
    }
  };

  useEffect(() => {
    const promises = solicitationIdList.map((s) => HttpSolicitation.getById(s));

    if (promises && !!promises.length && !solicitations)
      Promise.all(promises)
        .then(response => {
          setSolicitations(response);

          if (response.length)
            changeFileType(response[0][SolicitationViewDTOFields.FileTypeCode]);
        });
  }, [activeStep]);

  const renderTitleCurrentStep = () => activeStep < props.steps.length ?
    props.steps[activeStep].label : '';

  const renderSubtitleCurrentStep = () => activeStep < props.steps.length ?
    props.steps[activeStep].description : '';

    return (
        <Grid container sx={{ width: '100%', position: 'relative', pb: isMobileScreenSize && editing ? '120px' : 0 }}>
            {
                !stepperDone && 
                <Grid item xs={12}>
                    <Stack spacing={2}>
                        <TypographyBase variant={isMobileScreenSize ? 'h4' : 'h3'}>
                            {renderTitleCurrentStep()}
                        </TypographyBase>
                        <TypographyBase variant={'body2'} color={'text.lighter'}>
                            {renderSubtitleCurrentStep()}
                        </TypographyBase>
                    </Stack>
                </Grid>
            }
            
            <PrequalificationStepperContext.Provider 
                value={{
                    companyId: companyId,
                    solicitationIdList,
                    solicitations,
                    stepperDone: stepperDone !== PrequalificationStepperStatus.Idle,
                    editing,
                    setEditing: setEditing,
                    handleBack: handleBack,
                    handleNext: handleNext,
                    disableNext: disableNext,
                    setDisableNext: setDisableNext,
                    setOnBeforeSubmit
            }}
            >
                {
                    (stepperDone === PrequalificationStepperStatus.Idle) &&
                        <PrequalificationStepperManagerStepsFloating steps={props.steps} 
                                                                     activeStep={activeStep} 
                                                                     onConfirm={handleConfirm}
                        />
                }
        
                <Grid item xs={12} container spacing={1} 
                      sx={{
                          flexDirection: { xs: 'column-reverse', md: 'row !important' }
                      }}
                >
                    <Grid item xs={12} 
                          sx={{ width: '100%', marginTop: '24px', display: 'flex', justifyContent: 'center !important',  
                              marginBottom: editing ? { xs: 8, sm: 24, md: 2 } : { xs: 2, sm: 2, md: 2},
                          }}
                    >                        
                        <Box width={1}>
                            {
                                (stepperDone !== PrequalificationStepperStatus.Idle) &&
                                    <PrequalificationSuccessMessage solicitationLength={solicitationIdList?.length ?? 0}
                                                                    success={stepperDone === PrequalificationStepperStatus.Success}
                                    />
                            }
                            
                            { 
                                (activeStep < props.steps.length) && 
                                (stepperDone === PrequalificationStepperStatus.Idle) && 
                                React.cloneElement(props.steps[activeStep].component, {
                                    onBack: activeStep === 0 ? null : handleBack, 
                                    onNext: handleNext,
                                })
                            }
                        </Box>
                    </Grid>
                </Grid>
                
                <AgreeTermsDialog open={open} 
                                  onClose={() => {
                                      setOpen(false);
                                  }} 
                                  onClick={handleSolicitationSend}
                />
            </PrequalificationStepperContext.Provider>
        </Grid>
    );
}

export default PrequalificationStepper;
