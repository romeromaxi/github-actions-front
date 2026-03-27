import { userStorage } from '../../util/localStorage/userStorage';
import { Box, Card, CardContent, Stack, Typography } from '@mui/material';

interface OffererDetailHeaderProps {
  icon: React.ReactNode;
  role: string;
}

function OffererDetailHeader({ icon, role }: OffererDetailHeaderProps) {
  const fullName: string | undefined = userStorage.getFullName();

  const commonStyles = {
    bgColor: '#0288D1',
    m: 1,
    border: '2px solid #0288D1',
    width: '4rem',
    height: '4rem',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  };

  return (
    <Card>
      <CardContent>
        <Stack direction={'row'} alignItems={'center'} spacing={2}>
          <Box sx={{ ...commonStyles, borderRadius: '50%' }}>{icon}</Box>
          <Typography fontSize={16} fontWeight={700}>
            {role}
          </Typography>
        </Stack>
        <Typography fontSize={14} fontWeight={600} color={'grey.600'} ml={10.5}>
          Nombre: {fullName}
        </Typography>
      </CardContent>
    </Card>
  );
}

export default OffererDetailHeader;
