import {Collapse, Grid, Stack, Typography} from '@mui/material';
import { ReactNode, useState } from 'react';
import { HideFilterIconButton, ShowFilterIconButton } from '../buttons/Buttons';

interface CollapseContentProps {
  children: ReactNode;
  title?:string;
  tooltip?: string;
}

const CollapseContent = ({ children, title, tooltip = '' }: CollapseContentProps) => {
  const [expand, setExpand] = useState<boolean>(false);

  return (
    <Grid container spacing={1}>
      <Stack
        spacing={1}
        direction={'row-reverse'}
        sx={{ width: '100% !important' }}
        alignItems='center'
      >
        <Grid item xs={0.5} pt={1} pl={3.2}>
          {expand ? (
            <HideFilterIconButton
              tooltipTitle={`Contraer ${tooltip}`}
              onClick={() => {
                setExpand(false);
              }}
            />
          ) : (
            <ShowFilterIconButton
              tooltipTitle={`Expandir ${tooltip}`}
              onClick={() => {
                setExpand(true);
              }}
            />
          )}
        </Grid>
        <Grid item xs={11.5}>
           {title && <Typography variant='h5' fontWeight={500}>{title}</Typography>}
          <Collapse in={expand}>{children}</Collapse>
        </Grid>
      </Stack>
    </Grid>
  );
};

export default CollapseContent;
