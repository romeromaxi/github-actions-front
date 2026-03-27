import {ProductLineFields, ProductLineView} from "types/lines/productLineData";
import React, {useEffect, useState} from "react";
import {Button, Card, CardActions, CardContent, CardHeader, Grid} from "@mui/material";
import ProductLineAddCompany from "./ProductLineAddCompany";
import {EntityWithIdFields} from "types/baseEntities";
import {useAction} from "hooks/useAction";
import {HttpMarketShoppingCart} from "http/market/httpMarketShoppingCart";
import {
    MarketSolicitationFields,
    marketSolicitationStorage,
    MarketSurveyAnswers
} from "util/sessionStorage/marketSolicitationStorage";
import {useNavigate} from "react-router-dom";
import {FormProvider, useForm} from "react-hook-form";
import {SolicitationSurveyAnswerInsert} from "types/solicitations/solicitationSurveyData";
import {HttpSolicitationSurvey} from "http/solicitations/httpSolicitationSurvey";
import useAxios from "hooks/useAxios";
import SolicitationSurveyWithDetection from "./SolicitationSurveyWithDetection";

interface ProductLineUniquePageProps {
    line?: ProductLineView,
    title: string,
    subheader: string,
    requiresQuestions?: boolean
}

const ProductLineUniquePage = ({line, title, subheader, requiresQuestions = true} : ProductLineUniquePageProps) => {
  const navigate = useNavigate();
  const { showLoader, hideLoader } = useAction();
  const { fetchData } = useAxios();
  const [completeQuestions, setCompleteQuestions] = useState<boolean>(false);
  const [hasQuestions, setHasQuestions] = useState<boolean | undefined>(undefined);
  
  const methods = useForm<MarketSurveyAnswers>();
  

  useEffect(() => {
    if (hasQuestions === false) {
      setCompleteQuestions(true);
    }
  }, [hasQuestions]);
  
  const onSubmitAnswers = (data: MarketSurveyAnswers) => {
    marketSolicitationStorage.setSurveyAnswers(data);
    setCompleteQuestions(true);
  }
  
  const updateAnswerAndNavigateCheckout = (companyId: number, line: ProductLineView) => {
    const navigateToCheckout = () => {
      marketSolicitationStorage.setCurrentSolicitation({
        [MarketSolicitationFields.CompanyId]: companyId,
        [MarketSolicitationFields.SolicitationIdList]: [line[ProductLineFields.SolicitationId]],
        [MarketSolicitationFields.SolicitationType]: line[ProductLineFields.SolicitationTypeCode],
        [MarketSolicitationFields.FileType]: line[ProductLineFields.FileTypeCode],
      })
      navigate(`/market/lines/${companyId}/prequalification`, { replace: true });
    }
    
    if (hasQuestions) {
      const data : SolicitationSurveyAnswerInsert[] = marketSolicitationStorage.getSurveyAnswersAsInsertList();
      fetchData(
        () => HttpSolicitationSurvey.updateSurveyAnswer(line[ProductLineFields.SolicitationId], data),
        true
      ).then(navigateToCheckout)
    } else {
      navigateToCheckout();
    }
  }
  
  const onAddCompany = (id: number) => {
      showLoader()

      HttpMarketShoppingCart.getByCompanyId(id)
        .then(response => {
            const lineInShoppingCart = response.find(x => x[EntityWithIdFields.Id] === line?.[EntityWithIdFields.Id])
            
            if (lineInShoppingCart)
              updateAnswerAndNavigateCheckout(id, lineInShoppingCart);
            else 
              hideLoader();
        })
        .catch(() => hideLoader());
  }

  useEffect(() => {
    marketSolicitationStorage.clearSolicitation();
  }, []);
    
    return (
        <Grid container spacing={1}>
            {
                !completeQuestions &&
                    <Grid item xs={12}>
                        <Card>
                            <CardHeader title={title}
                                        subheader={subheader}
                            />
        
                            <CardContent>
                                {
                                    line && 
                                        <FormProvider {...methods} >
                                            <SolicitationSurveyWithDetection solicitationTypeCode={line[ProductLineFields.SolicitationTypeCode]}
                                                                      productLineId={line[EntityWithIdFields.Id]}
                                                                      allowEdit
                                                                      onQuestionsDetected={setHasQuestions}
                                            />
                                        </FormProvider>
                                }
                            </CardContent>
                            
                            <CardActions>
                                <Button variant={"contained"}
                                        onClick={methods.handleSubmit(onSubmitAnswers)}
                                >
                                    Continuar
                                </Button>
                            </CardActions>
                        </Card>
                    </Grid>
            }

            {
                completeQuestions &&
                    <Grid item xs={12} container>
                        <Grid item xs={12}>
                            <ProductLineAddCompany onAddCompany={onAddCompany} lineId={line?.[EntityWithIdFields.Id]} />
                        </Grid>
                    </Grid>
            }
        </Grid>
    );
}


export default ProductLineUniquePage