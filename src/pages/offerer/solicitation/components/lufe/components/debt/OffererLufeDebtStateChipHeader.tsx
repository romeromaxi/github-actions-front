import {Chip, Stack, Typography} from "@mui/material";
import {Skeleton} from "@mui/lab";


interface OffererLufeDebtStateChipHeaderProps {
    hasDebt?: boolean,
    title: string,
    loading: boolean
}


const OffererLufeDebtStateChipHeader = ({hasDebt, title, loading} : OffererLufeDebtStateChipHeaderProps) => {
    
    return (
        <Stack direction='row' alignItems='center' justifyContent='space-between'>
            <Typography variant='h5'>{title}</Typography>
            {
                loading ?
                    <Skeleton />
                    :
                        hasDebt ?
                        <Chip label='Si' color='error'/>
                        :
                        <Chip label='No' color='success'/>
            }
        </Stack>
    )
}


export default OffererLufeDebtStateChipHeader