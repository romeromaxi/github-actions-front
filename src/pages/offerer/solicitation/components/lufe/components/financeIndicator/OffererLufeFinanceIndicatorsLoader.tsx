import {Grid, Stack} from "@mui/material";
import {Skeleton} from "@mui/lab";


const OffererLufeFinanceIndicatorsLoader  = () => {
    
    return (
        <Grid item xs={12}>
            <Stack width={1} spacing={2}>
                {Array.from({length: 4}).map((d,k) => <Skeleton width={1} height={'50px'}/>)}
            </Stack>
        </Grid>
    )
}


export default OffererLufeFinanceIndicatorsLoader