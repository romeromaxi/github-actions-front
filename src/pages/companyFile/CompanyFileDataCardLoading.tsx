import {Skeleton} from "@mui/lab";
import {Card, CardContent, Stack} from "@mui/material";


const CompanyFileDataCardLoading = () => {
    return (
        <Card sx={{width: '100%', height: '160px'}}>
            <CardContent>
                <Stack direction='row' justifyContent={'space-between'} mt={1} paddingX={1}>
                    <Stack direction='row' spacing={2}>
                        <Skeleton variant={'circular'} width={40} height={40} />
                        <Stack>
                            <Skeleton width={290} height={30}/>
                            <Skeleton width={170}/>
                            <Skeleton width={150}/>
                        </Stack>
                    </Stack>
                </Stack>
            </CardContent>
        </Card>
    )
}


export default CompanyFileDataCardLoading