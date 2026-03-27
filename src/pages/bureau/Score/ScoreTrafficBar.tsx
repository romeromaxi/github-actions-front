import TrafficBar, {TrafficBarRange} from "components/trafficBar/TrafficBar";
import {BureauScoreRange} from "util/helpers/bureauHelper";

interface ScoreTrafficBarProps {
    scoring: number,
    loading?: boolean
}

function ScoreTrafficBar({ scoring, loading }: ScoreTrafficBarProps) {
       
    const ranges: TrafficBarRange[] =
        BureauScoreRange.map((s) => ({
            min: s.min,
            max: s.max, 
            color: s.color.main
        } as TrafficBarRange));

    return (
        <TrafficBar ranges={ranges}
                    value={scoring}
                    loading={loading}
        />
    )
}


export default ScoreTrafficBar;