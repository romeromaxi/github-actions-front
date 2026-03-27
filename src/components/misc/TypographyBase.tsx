import {Tooltip, TooltipProps, Typography, TypographyProps, TypographyVariant} from "@mui/material";
import {useEffect, useRef, useState} from "react";
import {useTheme} from "@mui/material/styles";

type Variant = TypographyProps['variant'] 
    | 'body3' | 'body4'
    | 'eyebrow1' | 'eyebrow2' | 'eyebrow3' 
    | 'button1' | 'button2' | 'button3'
    | 'cardHeader'
    | 'label' | 'labelForms'
    | 'textForms';

export interface TypographyBaseProps extends Omit<TypographyProps, 'variant'> {
  variant?: Variant,
  tooltip?: boolean,
  minLines?: number,
  maxLines?: number,
  TooltipProps?: TooltipProps,
  labelTooltip?: string, // Usar solamente si se quiere un Tooltip siempre y distinto al children del Typography
  overflowWrap?: 'normal' | 'break-word' | 'anywhere' | 'initial' | 'inherit' | 'unset'
}

function parseFontSize(fontSize: string): { value: number; unit: string } {
  const regex = /^(\d+(\.\d+)?)([a-zA-Z%]+)$/;
  const match = fontSize.match(regex);

  if (!match) return { value: 1, unit: 'rem' };

  const value = parseFloat(match[1]);
  const unit = match[3];

  return { value, unit };
}

export function TypographyBase({
  variant = 'body1', tooltip, minLines, maxLines, labelTooltip, children, style, sx, TooltipProps, overflowWrap,
  ...props
}: TypographyBaseProps) {
  const theme = useTheme();
  const typographyVariant = theme.typography[variant as TypographyVariant];
  const isClickable = !!props.onClick;
  
  const textRef = useRef<HTMLDivElement>(null);
  const [isTruncated, setIsTruncated] = useState<boolean>(false);


  useEffect(() => {
    const checkOverflow = () => {
      if (!textRef.current) return;
      const { scrollHeight, clientHeight } = textRef.current;
      setIsTruncated(scrollHeight > clientHeight);
    };

    if (tooltip && minLines && minLines >= 2) {
      checkOverflow();
      const observer = new ResizeObserver(checkOverflow);
      observer.observe(textRef.current!);

      return () => observer.disconnect();
    }
  }, [children, tooltip, minLines]);

  useEffect(() => {
    if (tooltip && textRef.current && (!minLines || minLines <= 1)) {
      const { scrollHeight, clientHeight, scrollWidth, clientWidth } = textRef.current;
      const isOverflowing = scrollHeight > clientHeight || scrollWidth > clientWidth;
      setIsTruncated(isOverflowing);
    }
  }, [children, tooltip, minLines]);

  const ellipsisStyles = tooltip
    ? (!!maxLines) ?
      { 
        textOverflow: 'ellipsis', overflow: 'hidden', display: '-webkit-box', WebkitLineClamp: maxLines, 
        WebkitBoxOrient: 'vertical', overflowWrap: overflowWrap ?? 'break-word', 
        wordBreak: (maxLines === 1) ? 'break-all' : '' 
      }
      :
      { textOverflow: 'ellipsis', overflow: 'hidden', whiteSpace: 'nowrap', display: 'flow'}
    : {};
  
  let minHeightStyles = {};
  
  if (typographyVariant && minLines && minLines > 1) {
    const { value, unit } = parseFontSize(`${typographyVariant?.fontSize ?? '1rem'}`);
    let scaleFactor = typographyVariant.lineHeight ?? 1;
    if (typeof typographyVariant.lineHeight === 'string' && typographyVariant.lineHeight.includes('%')) {
      scaleFactor = parseFloat(typographyVariant.lineHeight.replace('%', '')) / 100;
    } 

    minHeightStyles = {
      // @ts-ignore
      minHeight: `${minLines * scaleFactor * value}${unit}`
    }
  }

  const typographyStyles = { 
    ...sx, 
    ...style, 
    ...ellipsisStyles, 
    ...minHeightStyles,
    '&:hover': {
      cursor: isClickable ? 'pointer' : 'default',
      color: isClickable ? 'primary.main' : 'auto'
    }
  };
  
  return (
    <Tooltip title={
                labelTooltip ? 
                    labelTooltip : 
                    isTruncated ? 
                        <div style={{ whiteSpace: 'pre-line' }}>{children as string}</div>
                        : 
                        ""
              } 
             {...TooltipProps}
    >
      {/* @ts-ignore */}
      <Typography ref={textRef} 
                  variant={variant}
                  children={children}
                  sx={typographyStyles}
                  {...props}
      />
    </Tooltip>
  )
}