import Chip from "@mui/material/Chip/Chip";
import { stringFormatter } from "../../util/formatters/stringFormatter";
import { themeColorDefinition } from "../../util/themes/definitions/ThemeColorDefinition";
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';

const commonSelectProps = {
  MenuProps: {
    anchorOrigin: {
      vertical: 'bottom',
      horizontal: 'left',
    },
    transformOrigin: {
      vertical: 'bottom',
      horizontal: 'left',
    },
    PaperProps: {
      sx: {
        borderRadius: '1rem',
        boxShadow: '0px 3px 7px rgba(153, 153, 153, 0.1)',
        marginTop: '0.5rem',
      },
    },
  },
  IconComponent: KeyboardArrowDownIcon,
};

export const singleSelectProps = {
  ...commonSelectProps,
};

export const multiSelectProps = {
  ...commonSelectProps,
  renderValue: (selected, options, maxChipSize = 20) => (
    <div className="chips-container">
      {selected.map((selectedId) => {
        const option = options.find((x) => x.id === selectedId);
        if (!option) return null;
        
        return (
          <Chip
            key={`chip_${selectedId}`}
            label={stringFormatter.cutIfHaveMoreThan(
              option.descripcion || option.description,
              maxChipSize
            )}
            onDelete={(event) => {
              event.stopPropagation();
            }}
            size="small"
            color="primary"
            variant="outlined"
            onMouseDown={(event) => event.stopPropagation()}
            sx={{
              marginRight: '0.5rem',
              marginBottom: '0.5rem',
              backgroundColor: themeColorDefinition.UIElements.backgrounds.secondary,
              borderColor: themeColorDefinition.UIElements.borders.primary,
              '& .MuiChip-deleteIcon': {
                color: themeColorDefinition.UIElements.texts.default,
              },
            }}
          />
        );
      })}
    </div>
  ),
};