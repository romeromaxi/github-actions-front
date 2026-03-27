import React, {useMemo} from "react";
import {Table, TableCell, TableRow, Tooltip, Typography, useMediaQuery, useTheme} from "@mui/material";
import {
    SolicitationSurveyQuestionAnswer,
    SolicitationSurveyQuestionAnswerFields,
    SolicitationSurveyQuestionAnswerResponseFields,
    SolicitationSurveyQuestionFields
} from "types/solicitations/solicitationSurveyData";
import {EntityWithIdAndDescriptionFields, EntityWithIdFields} from "types/baseEntities";
import {TypographyBase} from "components/misc/TypographyBase";
import {Skeleton} from "@mui/lab";
import {typographyStyles} from '../../markets/lines/detail/components/TypographyStyles';
import {SolicitationSurveyQuestionFormats} from "../../../types/solicitations/solicitationSurveyEnums";
import {stringFormatter} from "../../../util/formatters/stringFormatter";
import {numberFormatter} from "../../../util/formatters/numberFormatter";

interface SolicitationSurveyDetailViewProps {
  answers?: SolicitationSurveyQuestionAnswer[],
  message?: string,
  showRowMessage?: boolean,
}

function SolicitationSurveyDetailView({ answers, message, showRowMessage }: SolicitationSurveyDetailViewProps) {
  const theme = useTheme();
  const isMobileScreenSize = useMediaQuery(theme.breakpoints.down("sm"));

  return (
    <Table variant={'interleaving-style'} sx={{ tableLayout: 'fixed' }}>
      {
        answers ?
          answers.map(a => (
            <SolicitationSurveyDetailViewRow key={`solicitationSurveyDetailView_${a[EntityWithIdFields.Id]}`}
                                              answer={a}
                                              isMobileScreenSize={isMobileScreenSize}
            />
          ))
          :
          <React.Fragment>
            {
              Array.from({ length: 3 }).map((_, idx) => (
                <TableRow key={`solicitationSurveyDetailViewLoading_${idx}`}>
                  <TableCell colSpan={2}>
                    <Skeleton />
                  </TableCell>
                </TableRow>
              ))
            }
          </React.Fragment>
      }
      {isMobileScreenSize ? 
        (
          answers && (message || showRowMessage) &&
          <TableRow sx={{
            position: 'relative',
            display: 'flex',
            flexDirection: { xs: 'column', sm: 'row' },
            alignItems: 'center',
            padding: { xs: '16px 16px', sm: '0' },
          }}>
            <TableCell
              sx={{
                width: { xs: '100%', sm: '50%', lg: '50%' },
                padding: { xs: '8px 0', sm: '8px 16px' },
                border: 'none',
                display: 'flex',
                alignItems: 'center',
              }}
            >
              <Tooltip title="Mensaje" arrow>
                <Typography
                  variant={typographyStyles.variants.tableLabel(isMobileScreenSize)}
                  sx={{
                    ...typographyStyles.tableLabel,
                    whiteSpace: 'nowrap',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    maxWidth: '100%',
                  }}
                >
                  Mensaje
                </Typography>
              </Tooltip>
            </TableCell>
  
            <TableCell
              sx={{
                width: { xs: '100%', sm: '50%' },
                padding: { xs: '8px 0', sm: '8px 16px' },
                border: 'none',
              }}
            >
              <Typography
                variant={typographyStyles.variants.tableValue(isMobileScreenSize)}
                sx={{
                  ...(typographyStyles.tableValue),
                  fontStyle: message ? 'normal' : 'italic',
                  fontWeight: message ? 'inherit' : '300 !important',
                }}
              >
                {message || 'Sin mensaje adicional'}
              </Typography>
            </TableCell>
          </TableRow>
        )
      :
        (
          answers && (message || showRowMessage) &&
          <TableRow>
              <TableCell align={'left'} sx={{ width: 1 / 2 }}>
                Mensaje
              </TableCell>
              <TableCell>
                {
                  message ?
                    message
                    :
                    <TypographyBase variant={'body2'} fontStyle={'italic'}
                                    tooltip maxLines={1}
                                    sx={{ fontWeight: '300 !important' }}
                    >
                        Sin mensaje adicional
                    </TypographyBase>
                }
              </TableCell>
          </TableRow>
        )
      }
    </Table>
  )
}

interface SolicitationSurveyDetailViewRowProps {
  answer: SolicitationSurveyQuestionAnswer;
  isMobileScreenSize: boolean;
}

function SolicitationSurveyDetailViewRow({ answer, isMobileScreenSize }: SolicitationSurveyDetailViewRowProps) {
  const responses = answer[SolicitationSurveyQuestionAnswerFields.Answers];
  const hasResponse = !!responses.length && !!responses[0][SolicitationSurveyQuestionAnswerResponseFields.Answer];
  const labelText = answer[EntityWithIdAndDescriptionFields.Description];
  const textResponse = useMemo(() => {
      if (!hasResponse) return 'Sin responder';

      switch (answer[SolicitationSurveyQuestionFields.SolicitationSurveyQuestionFormatCode]) {
          case SolicitationSurveyQuestionFormats.InputCurrency:
              return responses.map(response => (
                  isNaN(response[SolicitationSurveyQuestionAnswerResponseFields.Answer]) ? '' :
                      numberFormatter.toStringWithAmount(
                          parseFloat(response[SolicitationSurveyQuestionAnswerResponseFields.Answer]), "$"
                      )
              )).join(', ')
              
          default:
              return responses.map(response => response[SolicitationSurveyQuestionAnswerResponseFields.Answer]).join(', ')
      }
  }, [answer, hasResponse, responses])

  return (
    isMobileScreenSize ? (
      <TableRow
        sx={{
          position: 'relative',
          display: 'flex',
          flexDirection: { xs: 'column', sm: 'row' },
          alignItems: 'center',
          padding: { xs: '16px 16px', sm: '0' },
        }}
      >
        <Tooltip title={labelText} arrow>
          <Typography
            variant={typographyStyles.variants.tableLabel(isMobileScreenSize)}
            sx={{
              ...typographyStyles.tableLabel,
              whiteSpace: 'nowrap',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              maxWidth: '90%',
            }}
          >
            {labelText}
          </Typography>
        </Tooltip>
  
        <TableCell
          sx={{
            width: { xs: '100%', sm: '50%' },
            padding: { xs: '8px 0', sm: '8px 16px' },
            border: 'none',
          }}
        >
          {hasResponse ? (
            <Typography
              variant={typographyStyles.variants.tableValue(isMobileScreenSize)}
              sx={{ ...typographyStyles.tableValue }}
            >
              {textResponse}
            </Typography>
          ) : (
            <Typography
              variant={typographyStyles.variants.tableValue(isMobileScreenSize)}
              sx={{
                ...typographyStyles.tableValue,
                fontStyle: 'italic',
                fontWeight: '300 !important',
              }}
            >
              Sin responder
            </Typography>
          )}
        </TableCell>
      </TableRow>
    ) : (
      <TableRow>
        <TableCell align="left" sx={{ width: '50%' }}>
          {answer[EntityWithIdAndDescriptionFields.Description]}
        </TableCell>
        <TableCell>
          {hasResponse ? (
            <TypographyBase variant="body2" tooltip maxLines={2}>
                {textResponse}
            </TypographyBase>
          ) : (
            <TypographyBase
              variant="body2"
              fontStyle="italic"
              tooltip
              maxLines={1}
              sx={{ fontWeight: '300 !important' }}
            >
              Sin responder
            </TypographyBase>
          )}
        </TableCell>
      </TableRow>
    )
  );  
}

export default SolicitationSurveyDetailView;