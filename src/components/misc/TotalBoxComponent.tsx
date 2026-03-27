import {Box, Stack, Tooltip, Typography} from '@mui/material';
import TotalBoxComponentStyles from './TotalBoxComponent.styles';
import { Skeleton } from '@mui/lab';
import { numberFormatter } from 'util/formatters/numberFormatter';
import {StackProps} from "@mui/material/Stack/Stack";
import {WrapperIcons} from "../icons/Icons";
import {SealCheck} from "@phosphor-icons/react";

interface TotalBoxComponentProps {
  label?: string;
  total?: number | string;
  decimal?: boolean;
  loading?: boolean;
  currency?: string;
  reverse?: boolean;
  setWidth?: string;
  subtotal?: number | string;
  subtotalTooltip?: string;
  size?: 'small' | 'medium' | 'large';
  stackDirection?: 'row' | 'column' | 'row-reverse' | 'column-reverse';
  nulleable?: boolean;
  subtitle?: string;
  StackProps?: StackProps
}

function TotalBoxComponent(props: TotalBoxComponentProps) {
  const classes = TotalBoxComponentStyles();
  const labelFontSize: string = props.size === 'small' ? '1rem' : '1.075rem';
  const titleFontSize: string = props.size === 'small' ? '1.075rem' : '1.25rem';
  const minWidth: string = props.size === 'small' ? '90px' : '125px';
  const direction = props.reverse ? 'column-reverse' : 'column';

  const getTotalFormatter = () => {
    if (typeof props.total === 'string') {
      return props.total;
    }
    
    if (props.currency)
      return numberFormatter.toStringWithAmount(
        props.nulleable ? props.total : props.total || 0,
        props.currency,
        0,
      );

    if (props.decimal)
      return numberFormatter.toStringWithDecimals(props.total || 0);

    if (!props.total) return 0;

    return props.total;
  };

  return (
    <Box
      className={classes.boxContainer}
      component="div"
      minWidth={!props.setWidth ? minWidth : props.setWidth}
    >
      {props.stackDirection ? (
        <Stack
          direction={props.stackDirection}
          justifyContent={'space-between'}
          spacing={1}
          {...props.StackProps}
        >
          {props.label && (
              <Stack>
                <Typography
                  fontWeight={500}
                  fontSize={labelFontSize}
                  color={'grey.400'}
                  textAlign={'center'}
                >
                  {props.label}
                </Typography>
                
                {props.subtitle && (
                  <Typography textAlign={'center'} variant={'subtitle2'} color={'text.lighter'}>
                    {props.subtitle}
                  </Typography>
                )}
              </Stack>
          )}
          {props.loading ? (
            <Skeleton />
          ) : (
              <Stack overflow='hidden' direction='row' alignItems='center'>
                <Typography fontWeight={600} fontSize={titleFontSize}>
                  {getTotalFormatter()}
                </Typography>
                {
                  props.subtotal &&
                  <Tooltip title={props.subtotalTooltip} placement={"top"}>
                    <Typography fontWeight={450} variant='caption' color='green'>
                      {`+${props.subtotal}`}
                    </Typography>
                  </Tooltip>
                }
              </Stack>
          )}
        </Stack>
      ) : (
        <Stack direction={direction} alignItems={'end'}>
          {props.loading ? (
            <Skeleton />
          ) : (
              <Stack overflow='hidden' direction='row' alignItems='center'>
                <Typography fontWeight={600} fontSize={titleFontSize}>
                  {getTotalFormatter()}
                </Typography>
                {
                  props.subtotal &&
                  <Tooltip title={props.subtotalTooltip} placement={"top"}>
                    <Typography fontWeight={450} variant='caption' color='green'>
                      {`+${props.subtotal}`}
                    </Typography>
                  </Tooltip>
                }
              </Stack>
          )}
          <Typography
            fontWeight={500}
            fontSize={labelFontSize}
            color={'grey.400'}
          >
            {props.label}
          </Typography>
        </Stack>
      )}
    </Box>
  );
}

export const TotalBoxComponentNew = (props: TotalBoxComponentProps)=> {
  const classes = TotalBoxComponentStyles();
  const labelFontSize: string = props.size === 'small' ? '0.8rem !important' : '1rem !important';
  const titleFontSize: string = props.size === 'small' ? '0.9rem !important' : '1.125rem !important';
  const minWidth: string = props.size === 'small' ? '70px' : '100px';
  const direction = props.reverse ? 'column-reverse' : 'column';

  const getTotalFormatter = () => {
    if (props.currency)
      return numberFormatter.toStringWithAmount(
          props.nulleable ? props.total : props.total || 0,
          props.currency,
          0,
      );

    if (props.decimal)
      return numberFormatter.toStringWithDecimals(props.total || 0);

    if (!props.total) return 0;

    return props.total;
  };

  return (
      <Box
          className={classes.boxContainer}
          component="div"
          minWidth={!props.setWidth ? minWidth : props.setWidth}
      >
        {props.stackDirection ? (
            <Stack
                direction={props.stackDirection}
                justifyContent={'space-between'}
                spacing={1}
            >
              {props.label && (
                  <Typography
                      fontWeight={500}
                      fontSize={labelFontSize}
                      color={'text.lighter'}
                  >
                    {props.label}
                  </Typography>
              )}
              {props.loading ? (
                  <Skeleton />
              ) : (
                  <Typography fontWeight={600} fontSize={titleFontSize}>
                    {getTotalFormatter()}
                  </Typography>
              )}
            </Stack>
        ) : (
            <Stack direction={direction} alignItems={'end'}>
              {props.loading ? (
                  <Skeleton />
              ) : (
                  <Typography fontWeight={600} fontSize={titleFontSize}>
                    {getTotalFormatter()}
                  </Typography>
              )}
              <Typography
                  fontWeight={500}
                  fontSize={labelFontSize}
                  color={'text.lighter'}
              >
                {props.label}
              </Typography>
            </Stack>
        )}
      </Box>
  );
}

export function TotalBoxComponentLoading() {
  const classes = TotalBoxComponentStyles();

  return (
    <Box
      className={`${classes.boxContainer} ${classes.boxLoading}`}
      component="div"
    >
      <Stack direction="column">
        <Skeleton />
        <Skeleton />
      </Stack>
    </Box>
  );
}


interface TotalBoxComponentInteralNewProps {
  label?: string;
  total?: number | string;
  subtotal?: number | string;
  subtotalTooltip?: string;
  subtotalTwo?: number | string;
  subtotalTwoTooltip?: string;
}

export const TotalBoxComponentInteralNew = (props: TotalBoxComponentInteralNewProps) => {
  
  return (
      <Box sx={{minWidth: '75px', border: '1px solid rgba(129,137,146, 0.4) !important', borderRadius: '8px !important', padding: '0.75rem 1rem !important'}}>
        <Stack>
          <Stack direction={'row'} alignItems={'center'} spacing={1}>
            <Typography variant={'h2'} fontWeight={500}>
              {props.total}
            </Typography>
            <Stack flexDirection={'column-reverse'} height={'-webkit-fill-available'} justifyContent='space-between'>
              {
                  !!props.subtotalTwo &&
                  <Tooltip title={props.subtotalTwoTooltip}>
                    <Stack direction={'row'} alignItems='center' spacing={0.5}>
                      <WrapperIcons Icon={SealCheck} size={'xs'} />
                      <Typography fontWeight={450} variant='caption'>
                        {props.subtotalTwo}
                      </Typography>
                    </Stack>
                  </Tooltip>
              }
              
              {
                  !!props.subtotal &&
                  <Tooltip title={props.subtotalTooltip} placement={"top"}>
                    <Typography fontWeight={450} variant='caption' color='green'>
                      {`+${props.subtotal}`}
                    </Typography>
                  </Tooltip>
              }
            </Stack>
          </Stack>
          <Typography color='text.lighter' variant={'caption'}>
            {props.label}
          </Typography>
        </Stack>
      </Box>
  )
}

export default TotalBoxComponent;
