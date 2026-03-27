import { Grid } from '@mui/material';
import CompanyCertificationEditTable from './CompanyCertificationEditTable';

interface CompanyCertificationEditDetailProps {
  nameBase: string;
}

const CompanyCertificationEditDetail = ({
  nameBase,
}: CompanyCertificationEditDetailProps) => {
  return (
    <Grid container spacing={3} mt={1}>
      <Grid item xs={12}>
        <CompanyCertificationEditTable nameBase={nameBase} />
      </Grid>
    </Grid>
  );
};

export default CompanyCertificationEditDetail;
