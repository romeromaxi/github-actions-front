import React from 'react';
import { Tooltip, Typography } from '@mui/material';

interface ChipWithTooltipProps {
  key: string;
  title: string;
  tooltip?: string;
}

function ChipWithTooltip(props: ChipWithTooltipProps) {
  return (
    <Tooltip
      title={props.tooltip || 'Sin datos'}
      placement="left"
      key={props.key}
    >
      <div>
        <Typography
          sx={{
            borderRadius: 10,
            padding: '.2rem 1rem',
            color: 'background.paper',
            backgroundColor: '#A798FF',
            maxWidth: 'fit-content',
          }}
        >
          {props.title}
        </Typography>
      </div>
    </Tooltip>
  );
}

export default ChipWithTooltip;
