import clsx from 'clsx';
import { Box } from '@mui/material';
import { StepIconProps } from '@mui/material/StepIcon';
import StepIconCustomStyles from "./StepIconCustom.styles";

function StepIconCustom(props: StepIconProps) {
    const classes = StepIconCustomStyles();
    const { active, completed, icon } = props;
    
    return (
        <Box className={clsx(classes.root, {
            [classes.active]: active && !completed,
            [classes.completed]: completed && !active,
        })}>
            {icon}
        </Box>
    );
}

export {
  StepIconCustom
};