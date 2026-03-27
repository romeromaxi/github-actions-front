import { Box, Radio, Stack, Typography } from '@mui/material';
import { grey } from '@mui/material/colors';

interface RadioBoxButtonProps {
  title: string;
  subtitle?: string;
  value: boolean;
  onClick: () => void;
}

const RadioBoxButton = ({
  title,
  subtitle,
  value,
  onClick,
}: RadioBoxButtonProps) => {
  return (
    <Box
      sx={{
        padding: 2,
        border: value ? '1px dashed #007aff' : `1px dashed ${grey[300]}`,
        borderRadius: '8px !important',
        backgroundColor: value ? 'rgba(0, 122, 255, 0.1)' : '',
        '&:hover': {
          border: '1px dashed #007aff',
          backgroundColor: 'rgba(0, 122, 255, 0.1)',
          cursor: 'pointer',
        },
      }}
      onClick={onClick}
    >
      <Stack
        direction="row"
        alignItems={'center'}
        spacing={2}
        textAlign={'center'}
      >
        <Radio checked={value} />
        <Stack>
          <Typography fontSize={16} fontWeight={500}>
            {title}
          </Typography>
          {subtitle && subtitle !== '' && (
            <Typography color={grey[500]} fontWeight={500} fontStyle={'italic'}>
              {subtitle}
            </Typography>
          )}
        </Stack>
      </Stack>
    </Box>
  );
};

export default RadioBoxButton;
