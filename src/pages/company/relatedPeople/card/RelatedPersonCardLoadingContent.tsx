import { Grid, Skeleton } from '@mui/material';

import SectionCardContent from 'components/cards/SectionCardContent';

interface RelatedPersonCardLoadingContentProps {
  showPersonalInformation?: boolean;
}

function RelatedPersonCardLoadingContent(
  props: RelatedPersonCardLoadingContentProps,
) {
  const widthSkeleton: string = '100%';

  return (
    <>
      {props.showPersonalInformation && (
        <Grid item xs={12}>
          <SectionCardContent text="Información Personal">
            <Grid container item xs={12}>
              <Skeleton variant="text" width={widthSkeleton} />
              <Skeleton variant="text" width={widthSkeleton} />
            </Grid>
          </SectionCardContent>
        </Grid>
      )}
      <Grid item xs={12}>
        <SectionCardContent text="Información Societaria">
          <Grid container item xs={12}>
            <Skeleton variant="text" width={widthSkeleton} />
          </Grid>
        </SectionCardContent>
      </Grid>
      <Grid item xs={12}>
        <SectionCardContent text="Contacto">
          <Grid container item xs={12}>
            <Skeleton variant="text" width={widthSkeleton} />
          </Grid>
        </SectionCardContent>
      </Grid>
      <Grid item xs={12}>
        <SectionCardContent text="Domicilios">
          <Grid container item xs={12}>
            <Skeleton variant="text" width={widthSkeleton} />
          </Grid>
        </SectionCardContent>
      </Grid>
      <Grid item xs={12}>
        <SectionCardContent text="Documentación Respaldatoria">
          <Grid container item xs={12}>
            <Skeleton variant="text" width={widthSkeleton} />
          </Grid>
        </SectionCardContent>
      </Grid>
    </>
  );
}

export default RelatedPersonCardLoadingContent;
