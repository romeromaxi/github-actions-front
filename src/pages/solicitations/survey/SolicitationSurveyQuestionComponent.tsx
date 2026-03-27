import React from "react";
import {SolicitationSurveyQuestion} from "types/solicitations/solicitationSurveyData";
import {EntityWithIdFields} from "types/baseEntities";
import {Grid} from "@mui/material";
import {Skeleton} from "@mui/lab";
import SolicitationSurveyQuestionFormComponent from "./components/SolicitationSurveyQuestionFormComponent";

interface SolicitationSurveyQuestionFormProps {
  nameBase?: string;
  questions?: SolicitationSurveyQuestion[],
  allowEdit?: boolean
}

function SolicitationSurveyQuestionForm({nameBase, questions, allowEdit}: SolicitationSurveyQuestionFormProps) {
  
  return (
    <Grid container spacing={2}>
      {
        questions ?
          questions.map(q => (
            <Grid item xs={12} key={`solicitationSurveyQuestionForm_${q[EntityWithIdFields.Id]}`}>
              <SolicitationSurveyQuestionFormComponent nameBase={nameBase ?? ""} question={q} allowEdit={allowEdit}/>
            </Grid>
          ))
          :
          Array.from({ length: 3 }).map((_, idx) => (
            <Grid item xs={12} key={`solicitationSurveyQuestionFormLoading_${idx}`}>
              <Skeleton />
            </Grid>
          ))
      }
    </Grid>
  )
}

export default SolicitationSurveyQuestionForm;