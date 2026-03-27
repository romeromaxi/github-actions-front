import {Stack, ToggleButton, Typography} from '@mui/material';
import {IntermediateDataView,} from '../../../../types/market/marketIntermediateData';
import CloseIcon from '@mui/icons-material/Close';
import {EntityWithIdAndDescriptionFields} from "../../../../types/baseEntities";

interface MarketInstrumentTypeToggleButtonProps {
  onSelect: (sel: boolean, insT: IntermediateDataView) => void;
  instrumentT: IntermediateDataView;
  selected: boolean;
  disabled?: boolean;
}

const MarketInstrumentTypeToggleButton = ({
  onSelect,
  instrumentT,
  selected,
  disabled,
}: MarketInstrumentTypeToggleButtonProps) => {
  //const [selected, setSelected] = useState<boolean>()

  const handleOnChange = () => {
    //setSelected(!selected)
    onSelect(selected, instrumentT);
  };

  const renderSx = selected
    ? {
        borderColor: '#5d8cd8',
        backgroundColor: '#caddfa !important',
        borderRadius: '100px',
        textTransform: 'none',
      }
    : disabled
      ? { borderRadius: '100px', textTransform: 'none' }
      : {
          borderRadius: '100px',
          textTransform: 'none',
          color: 'black !important',
          backgroundColor: '#ededed',
        };

  return (
    <ToggleButton
      value={instrumentT}
      selected={selected}
      onChange={handleOnChange}
      disabled={disabled}
      sx={renderSx}
    >
      <Stack direction="row" alignItems={'center'} spacing={1}>
        <Typography fontSize={13} fontWeight={selected ? 600 : 500}>
          {
            instrumentT[EntityWithIdAndDescriptionFields.Description]
          }
        </Typography>
        {selected && <CloseIcon fontSize="small" color="info" />}
      </Stack>
    </ToggleButton>
  );
};

export default MarketInstrumentTypeToggleButton;
