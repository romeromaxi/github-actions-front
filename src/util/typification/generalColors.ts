import { EnumColors } from 'types/general/generalEnums';

import { getValueInDictionaryIfExists } from '../helpers';

type IEnumColorsTo<R> = { [key in keyof typeof EnumColors]: R };

const dictionaryBaseColor: IEnumColorsTo<string> = {
  BLUE: '#5946C9',
  GREEN: '#2AA2AA',
  LIGHTBLUE: '#0F94BE',
  RED: '#de5449',
  YELLOW: '#FFC400',
  GREY: '#676767',
  WHITE: '#FFFFFF',
  BLACK: '#000000',
  LIGHT_GREY: '#F7F7F7',
  LUC_GRADIENT: 'linear-gradient(90deg, #04D5BB 0%, #4784E1 84.11%)',
  GREY_GRADIENT:
    'linear-gradient(0deg, rgba(253,253,253,1) 0%, rgba(250,250,250,1) 50%, rgba(245,245,245,1) 100%)',
  MARKET_BLUE: '#004DDA',
};

export const getBaseColor = (color: EnumColors) =>
  getValueInDictionaryIfExists(EnumColors[color], dictionaryBaseColor);
