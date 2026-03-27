import {Stack, ToggleButton, Typography} from '@mui/material';
import {IntermediateDataView,} from '../../../../types/market/marketIntermediateData';
import CloseIcon from '@mui/icons-material/Close';
import {EntityWithIdAndDescriptionFields} from "../../../../types/baseEntities";

interface MarketDestinyToggleButtonProps {
  onSelect: (dest: IntermediateDataView, sel: boolean) => void;
  destiny: IntermediateDataView;
  selected: boolean;
  disabled?: boolean;
}

const MarketDestinyToggleButton = ({
  onSelect,
  destiny,
  selected,
  disabled,
}: MarketDestinyToggleButtonProps) => {
  //const [selected, setSelected] = useState<boolean>()

  const handleOnChange = () => {
    //setSelected(!selected)
    onSelect(destiny, selected);
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
      value={destiny}
      selected={selected}
      onChange={handleOnChange}
      sx={renderSx()}
      disabled={disabled}
    >
      <Stack direction="row" alignItems="center" spacing={1}>
        <Typography fontSize={13} fontWeight={selected ? 600 : 500}>
          {destiny[EntityWithIdAndDescriptionFields.Description]}
        </Typography>
        {selected && <CloseIcon fontSize="small" color="info" />}
      </Stack>
    </ToggleButton>
  );
};

export default MarketDestinyToggleButton;
