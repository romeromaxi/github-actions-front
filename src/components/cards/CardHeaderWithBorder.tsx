import { CardHeader, CardHeaderProps } from '@mui/material';
import CardHeaderWithBorderStyles from './CardHeaderWithBorder.styles';
import { EnumColors } from 'types/general/generalEnums';

interface CardHeaderWithBorderProps extends CardHeaderProps {
  baseColor: EnumColors;
}

function CardHeaderWithBorder(props: CardHeaderWithBorderProps) {
  const classes = CardHeaderWithBorderStyles();

  const getClassesByColor = () => {
    switch (props.baseColor) {
      case EnumColors.BLUE:
        return classes.cardHeaderBlue;
      case EnumColors.GREEN:
        return classes.cardHeaderGreen;
      case EnumColors.LIGHTBLUE:
        return classes.cardHeaderLightBlue;
      case EnumColors.RED:
        return classes.cardHeaderRed;
      case EnumColors.GREY:
        return classes.cardHeaderGrey;
      case EnumColors.LUC_GRADIENT:
        return classes.cardHeaderLucGradient;
      case EnumColors.GREY_GRADIENT:
        return classes.cardHeaderGreyGradient;
      case EnumColors.MARKET_BLUE:
        return classes.cardHeaderMarketBlue;
      case EnumColors.WHITE:
        return classes.cardHeaderWhite;
      default:
        return classes.cardHeaderBlue;
    }
  };

  const finalClasses = getClassesByColor();

  return <CardHeader {...props} className={finalClasses} />;
}

export default CardHeaderWithBorder;
