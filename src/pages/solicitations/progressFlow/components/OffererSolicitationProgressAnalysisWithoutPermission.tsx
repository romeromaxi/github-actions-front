import {Card, Stack} from "@mui/material";
import {TypographyBase} from "components/misc/TypographyBase";

function OffererSolicitationProgressAnalysisWithoutPermission() {
    return (
        <Card sx={{ padding: '16px' }}>
            <Stack direction={'row'}
                   spacing={1.25}
                   alignItems={'center'}
            >
                <TypographyBase variant={'button2'}>
                    El caso está siendo revisado por un analista
                </TypographyBase>
            </Stack>
        </Card>
    )
}

export default OffererSolicitationProgressAnalysisWithoutPermission;