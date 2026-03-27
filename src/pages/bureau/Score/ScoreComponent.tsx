import {Grid} from "@mui/material";
import ScoreTrafficBar from "./ScoreTrafficBar";
import ColouredBoxWithData from "components/misc/ColouredBoxWithData";
import {getTypeColorByScore} from "util/helpers/bureauHelper";

interface ScoreComponentProps {
    scoring: number,
    loading?: boolean
}

function ScoreComponent({ scoring, loading }: ScoreComponentProps) {
    const color = getTypeColorByScore(scoring);
    
    return (
        <Grid container
              spacing={{ xs: 2, md: 6.125 }}
        >
            <Grid item xs={12} md={2.4} alignContent={'center'}>
                <ColouredBoxWithData value={scoring}
                                     color={color.main}
                                     bgcolor={loading ? '#F6F6F6' : color.light}
                                     loading={loading}
                                     valueProps={{ fontSize: '3.5rem' }}
                                     boxProps={{ 
                                         padding: '16px !important', 
                                         justifyItems: 'center',
                                         alignContent: 'center' 
                                     }}
                />
            </Grid>
            
            <Grid item xs={12} md={9.6}>
                <ScoreTrafficBar scoring={scoring}
                                 loading={loading}
                />
            </Grid>
        </Grid>
    )
}

export default ScoreComponent;