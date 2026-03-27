import React from 'react';
import {
  ProductLineFields,
  ProductLineView,
} from 'types/lines/productLineData';
import {
  Box,
  Button,
  Checkbox,
  Stack,
  Tooltip,
  Typography,
} from '@mui/material';
import DoneIcon from '@mui/icons-material/Done';
import { BaseRequestFields, EntityWithIdFields } from 'types/baseEntities';
import { TextFieldFilled } from 'components/forms/StyledTextField';
import {
  SolicitationInitialMessageDTO,
  SolicitationInitialMessageDTOFields,
} from 'types/solicitations/solicitationData';
import { HttpSolicitation } from 'http/index';
import {WrapperIcons} from "../../../../../components/icons/Icons";
import {X} from "@phosphor-icons/react";
import {OffererLogoWithName} from "../../../../offerer/components/OffererLogo";

interface ShoppingBagLineDetailProps {
  line: ProductLineView;
  handleCheckboxClick?: (line: ProductLineView) => void;
  handleDetailClick?: (line: ProductLineView) => void;
  handleDeleteClick?: (line: ProductLineView) => void;
  hideMsg?: boolean
}

function ShoppingBagLineDetail({
  line,
  handleCheckboxClick,
  handleDeleteClick, hideMsg
}: ShoppingBagLineDetailProps) {
  const [isEditingMessage, setIsEditingMessage] = React.useState(false);
  const [initialMessage, setInitialMessage] = React.useState(
    line[ProductLineFields.InitialMessage],
  );

  const onConfirmInitialMessage = () => {
    const messageDTO: SolicitationInitialMessageDTO = {
      [BaseRequestFields.OriginCode]: 1,
      [BaseRequestFields.ModuleCode]: 1,
      [SolicitationInitialMessageDTOFields.Message]: initialMessage,
    };
    HttpSolicitation.setInitialMessage(
      line[ProductLineFields.SolicitationId],
      messageDTO,
    ).then(() => {
      console.log('exitos');
    });
  };
  
  return (
    <Box key={`lineList_${line[EntityWithIdFields.Id]}`}
         sx={{
           padding: '16px', borderRadius: '24px',
           border: '1px solid #EDF2F7', backgroundColor: 'white',
         }}
    >
      <Stack spacing={1}>
        <Stack direction={{ xs: 'column', sm: 'row' }} alignItems={{ xs: '', sm: 'center' }} justifyContent={'space-between'}>
          <OffererLogoWithName offererId={line[ProductLineFields.OffererId]}
                               offererBusinessName={line[ProductLineFields.OffererBusinessName]}
                               size={'md'}
          />  
            
          <Stack direction='row' alignItems='center' spacing={2}>
            <Typography color="text.lighter" fontSize={12} fontWeight={500} sx={{width: "fit-content"}}>
              {line[ProductLineFields.ProductServiceDesc]}
            </Typography>
            
              {
                /*
                  <SearchIconButton
                    onClick={() => {
                      handleDetailClick(line);
                    }}
                    tooltipTitle={'Ver detalle'}
                  />
                 */
              }
            {
              handleDeleteClick &&
                <Box onClick={() => handleDeleteClick(line)} sx={{cursor: 'pointer'}}>
                  <WrapperIcons Icon={X} size={'sm'}/>
                </Box>
            }
          </Stack>
        </Stack>
        <Stack direction={'row'} alignItems={'center'} justifyContent={'space-between'}>
          <Stack width={'85%'}>
            <Typography fontWeight={500}>
              {line[ProductLineFields.Line]}
            </Typography>
            <Typography className={"text-ellipsis"} fontWeight={400} fontSize={14} color={'#818992'}>
              {line[ProductLineFields.LineLarge]}
            </Typography>
          </Stack>
          <Stack direction={'row'} spacing={2} alignItems={'center'}>
            {line[ProductLineFields.RequestDetailRequired] &&
                line[ProductLineFields.CompletedDetailRequired] && (
                    <Tooltip title={'En condiciones de solicitar'}>
                      <Button
                          size={'small'}
                          variant="outlined"
                          color="success"
                          onClick={() => {
                            // handleAptitudeOpen(line)
                            // setDisableField(false)
                          }}
                          startIcon={
                            <DoneIcon fontSize={'small'} color={'success'} />
                          }
                      >
                        <Typography sx={{ color: '#04C8C8' }}>
                          Completado
                        </Typography>
                      </Button>
                    </Tooltip>
                )}
            {
              handleCheckboxClick &&
              <Box mr={{ xs: '1rem !important', sm: '2rem !important' }}>
                <Checkbox
                    disabled={false}
                    onClick={() => {
                      // !incompleteRequirements &&
                      handleCheckboxClick(line);
                    }}
                />
              </Box>
            }
          </Stack>
        </Stack>
        {
          !hideMsg &&
            <>
              <Stack direction={'row-reverse'}>
                {
                  !isEditingMessage ?
                  <Button variant='text' size='small' color={'primary'} onClick={() => setIsEditingMessage(true)}>
                    Agregar mensaje
                  </Button>
                      :
                  <Stack direction='row' alignItems='center' spacing={2}>
                    <Button variant='text' size='small' color={'error'} onClick={() => {
                      setIsEditingMessage(false)
                      setInitialMessage('')
                    }}>
                      Cancelar
                    </Button>
                    <Button variant='text' size='small' color={'primary'} onClick={() => {
                      onConfirmInitialMessage()
                      setIsEditingMessage(false)
                    }}>
                      Guardar
                    </Button>
                  </Stack>
                }
              </Stack>
              
              {
                  isEditingMessage &&
                  <Stack sx={{width: '100%'}}>
                    <TextFieldFilled
                        multiline
                        rows={2}
                        disabled={!isEditingMessage}
                        value={initialMessage || ''}
                        onChange={(event) => {
                          isEditingMessage && setInitialMessage(event.target.value);
                        }}
                        helperText={
                          isEditingMessage ? 'Recuerde guardar para confirmar cambios' : ''
                        }
                    />
                  </Stack>
              }
            </>
        }
      </Stack>
    </Box>
  );
}

export default ShoppingBagLineDetail;
