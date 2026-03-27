import {
  CompanyTotalsShoppingCart,
  CompanyTotalsShoppingCartFields,
} from '../../../../types/market/marketData';
import { Stack, ToggleButton, Typography } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';

interface MarketCompanyToggleButtonProps {
  onSelect: (comp: CompanyTotalsShoppingCart) => void;
  company: CompanyTotalsShoppingCart;
  selected: boolean;
  disabled?: boolean;
}

const MarketCompanyToggleButton = ({
  onSelect,
  company,
  selected,
  disabled,
}: MarketCompanyToggleButtonProps) => {
  //const [selected, setSelected] = useState<boolean>()

  const handleOnChange = () => {
    //setSelected(!selected)
    onSelect(company);
  };

  const renderSx = () => {
    if (selected) {
      return {
        borderColor: '#5d8cd8',
        backgroundColor: '#caddfa !important',
        borderRadius: '100px',
        textTransform: 'none',
      };
    } else if (disabled) {
      return { borderRadius: '100px', textTransform: 'none' };
    }
    return {
      borderRadius: '100px',
      textTransform: 'none',
      color: 'black !important',
      backgroundColor: '#ededed',
    };
  };

  return (
    <ToggleButton
      value={company}
      selected={selected}
      disabled={disabled}
      onChange={handleOnChange}
      sx={renderSx()}
    >
      <Stack direction={'row'} alignItems={'center'} spacing={1}>
        <Typography fontSize={13} fontWeight={selected ? 600 : 500}>
          {company[CompanyTotalsShoppingCartFields.BusinessName]}
        </Typography>
        {selected && <CloseIcon fontSize="small" color="info" />}
      </Stack>
    </ToggleButton>
  );
};

export default MarketCompanyToggleButton;
