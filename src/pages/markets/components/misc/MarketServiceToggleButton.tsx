import {Stack, ToggleButton, Typography} from '@mui/material';
import {IntermediateDataView,} from '../../../../types/market/marketIntermediateData';
import CloseIcon from '@mui/icons-material/Close';
import {EntityWithIdAndDescriptionFields} from "../../../../types/baseEntities";

interface MarketServiceToggleButtonProps {
  onSelect: (sel: boolean, dest: IntermediateDataView) => void;
  service: IntermediateDataView;
  selected: boolean;
  disabled?: boolean;
}

const MarketServiceToggleButton = ({
  onSelect,
  service,
  selected,
  disabled,
}: MarketServiceToggleButtonProps) => {
  //const [selected, setSelected] = useState<boolean>()

  const handleOnChange = () => {
    //setSelected(!selected)
    onSelect(selected, service);
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
      value={service}
      selected={selected}
      onChange={handleOnChange}
      disabled={disabled}
      sx={renderSx()}
    >
      <Stack direction="row" alignItems={'center'} spacing={1}>
        <Typography fontSize={13} fontWeight={selected ? 600 : 500}>
          {service[EntityWithIdAndDescriptionFields.Description]}
        </Typography>
        {selected && <CloseIcon fontSize="small" color="info" />}
      </Stack>
    </ToggleButton>
  );
};

export default MarketServiceToggleButton;
