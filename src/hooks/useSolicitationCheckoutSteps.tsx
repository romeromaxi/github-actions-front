import React, {useEffect, useMemo, useState} from 'react';
import {MarketSolicitationFields, marketSolicitationStorage} from "util/sessionStorage/marketSolicitationStorage";
import {PrequalificationDataSteps} from "pages/markets/prequalification/PrequalificationStepper";
import PrequalificationStepCompanyFile from "pages/markets/prequalification/setps/PrequalificationStepCompanyFile";
import {PrequalificiationStepLineDetail} from "pages/markets/prequalification/setps/PrequalificiationStepLineDetail";
import {SolicitationTypes} from 'types/solicitations/solicitationEnums';
import PrequalificiationStepSurveyQuestion
    from "../pages/markets/prequalification/setps/PrequalificiationStepSurveyQuestion";
import PrequalificationStepMatcherFinal from "../pages/markets/prequalification/setps/PrequalificationStepMatcherFinal";
import PrequalificationStepperManagerEdit
    from "../pages/markets/prequalification/components/PrequalificationStepperManagerEdit";
import PrequalificationStepperManagerEditSurvey
    from "../pages/markets/prequalification/components/PrequalificationStepperManagerEditSurvey";
import {useAction} from './useAction';
import {SolicitationMessageCheckout, SolicitationMessageCheckoutFields} from "../types/solicitations/solicitationData";
import {HttpCacheSolicitation} from "../http";
import {EntityWithIdAndDescriptionFields} from "../types/baseEntities";

const generalSteps: PrequalificationDataSteps[] = [
  {
    label: 'Revisá los datos requeridos',
    description: 'Esta es la información que le vamos a enviar a las entidades seleccionadas. Asegurate de que sea precisa y esté actualizada para agilizar el procesamiento de las solicitudes.',
    component: <PrequalificationStepCompanyFile />,
    editManager: PrequalificationStepperManagerEdit,
    checkFileCompletenessBefore: true
  },
  {
    label: 'Confirmá las solicitudes a enviar',
    description: 'Estas solicitudes se enviarán a las entidades seleccionadas. Analizarán tu legajo y se pondrán en contacto con vos a la brevedad.',
    component: <PrequalificiationStepLineDetail allowModifyMessage startDisplayMessage />
  },
];

const matcherSteps: PrequalificationDataSteps[] = [
  {
    label: 'Revisá y confirmá los datos del legajo',
    description: 'Esta es la información que va a recibir CASFOG para la búsqueda de los avales que mejor se ajusten a tu necesidad. Asegurate de que sea precisa y esté actualizada para agilizar el proceso.',
    component: <PrequalificationStepCompanyFile />,
    editManager: PrequalificationStepperManagerEdit,
    checkFileCompletenessBefore: true
  },
  {
    label: 'Confirmá el envío',
    description: 'Estas respuestas orientarán la búsqueda que CASFOG haga para tu empresa, asegurate de que sean correctas. Podés sumar un mensaje.',
    component: <PrequalificiationStepSurveyQuestion />,
    editManager: PrequalificationStepperManagerEditSurvey
  }
];

const orienteerSteps: PrequalificationDataSteps[] = [
  {
    label: 'Revisá y confirmá los datos del legajo',
    description: 'Esta es la información que va a recibir CASFOG para la búsqueda de los avales que mejor se ajusten a tu necesidad. Asegurate de que sea precisa y esté actualizada para agilizar el proceso.',
    component: <PrequalificationStepCompanyFile />,
    editManager: PrequalificationStepperManagerEdit,
    checkFileCompletenessBefore: true
  },
  {
    label: 'Revisá y confirmá tus respuestas',
    description: 'Estas respuestas orientarán la búsqueda que CASFOG haga para tu empresa, asegurate de que sean correctas. Podés sumar un mensaje.',
    component: <PrequalificiationStepSurveyQuestion />,
    editManager: PrequalificationStepperManagerEditSurvey
  }
];

export function useSolicitationCheckoutSteps() {
  const { showLoader, hideLoader } = useAction();
  
  const [lastSolicitationType, setLastSolicitationType] = useState<SolicitationTypes>();
  const [messageCheckout, setMessageCheckout] = useState<SolicitationMessageCheckout[]>();
  
  const steps = useMemo(() => {
    if (!messageCheckout) return [];
    
    let stepsByType: PrequalificationDataSteps[] = []
    
    switch (lastSolicitationType) {
      case SolicitationTypes.General:
        stepsByType = generalSteps;
        break;

      case SolicitationTypes.Matcher:
        stepsByType = matcherSteps;
        break;

      case SolicitationTypes.Orienteer:
        stepsByType = orienteerSteps;
        break;
      
      case SolicitationTypes.BetweenOfferers:
        stepsByType = generalSteps;
        break;
        
      case SolicitationTypes.None:
      default:
        stepsByType = [];
    }
    
    return stepsByType.map((step, idx) => ({
      ...step,
      title: messageCheckout[idx][SolicitationMessageCheckoutFields.TitleStep] ?? step.label,
      description: messageCheckout[idx][EntityWithIdAndDescriptionFields.Description] ?? step.description,
    }))
  }, [lastSolicitationType, messageCheckout]);

  const agreeTerms = useMemo(() => {
    if (!messageCheckout) return "";
    
    const solicitations = marketSolicitationStorage.getCurrentSolicitation();
    const isOnlyOneSolicitation = solicitations[MarketSolicitationFields.SolicitationIdList].length === 1;
    const messageConfirmation = messageCheckout.find(x => x[SolicitationMessageCheckoutFields.IsConfirmationMessage])

    let finalMessage = "";
        
    if (messageConfirmation) {
      finalMessage = (isOnlyOneSolicitation && !!messageConfirmation[SolicitationMessageCheckoutFields.SingularMessage]) ? 
          messageConfirmation[SolicitationMessageCheckoutFields.SingularMessage] ?? "" :
          messageConfirmation[EntityWithIdAndDescriptionFields.Description];
    } else {
      finalMessage = isOnlyOneSolicitation ?
          '¿Querés compartir esta solicitud y la información del legajo con las entidades seleccionadas?' :
          '¿Querés compartir estas solicitudes y la información del legajo con las entidades seleccionadas?';
    }
    
    return finalMessage;
  }, [messageCheckout, lastSolicitationType, marketSolicitationStorage.getCurrentSolicitation, marketSolicitationStorage.setCurrentSolicitation]);

  useEffect(() => {
    const solicitations = marketSolicitationStorage.getCurrentSolicitation();
    const solicitationType = solicitations[MarketSolicitationFields.SolicitationType];
    const idsSolicitations = solicitations[MarketSolicitationFields.SolicitationIdList];
    
    if (!!solicitationType && (solicitationType !== lastSolicitationType || !messageCheckout)) {
      showLoader();
      
      HttpCacheSolicitation.getSolicitationMessageCheckoutBySolicitationType(solicitationType, idsSolicitations)
          .then(response => {
            setMessageCheckout(response);
            setLastSolicitationType(solicitationType);
          })
          .finally(hideLoader)
      
    }
  }, [marketSolicitationStorage.getCurrentSolicitation]);
  
  return { 
    steps,
    agreeTerms
  };
}