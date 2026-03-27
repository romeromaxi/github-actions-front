import {Stack} from "@mui/material";
import {useFormContext} from "react-hook-form";
import {
    OffererClientPortfolioFilterFields,
    OffererClientPortfolioFilterForm
} from "../../../types/offerer/clientPortfolioData";
import {ControlledTextFieldFilled} from "../../../components/forms";
import {SearchButton} from "../../../components/buttons/Buttons";

interface OffererClientPortfolioFilterComponentProps {
    onSubmit: (filter: OffererClientPortfolioFilterForm) => void
}
const OffererClientPortfolioFilterComponent = ({onSubmit} : OffererClientPortfolioFilterComponentProps) => {
    const methods = useFormContext<OffererClientPortfolioFilterForm>()
    
    return (
                <Stack direction='row' alignItems='end' spacing={2}>
                    <Stack spacing={3} direction='row' alignItems='center'>
                        <ControlledTextFieldFilled control={methods.control}
                                                   label='Razón social'
                                                   name={OffererClientPortfolioFilterFields.BusinessName}
                        />
                        <ControlledTextFieldFilled control={methods.control}
                                                   label='CUIT'
                                                   name={OffererClientPortfolioFilterFields.CUIT}
                        />
                    </Stack>
                    <SearchButton onClick={methods.handleSubmit(onSubmit)}>
                        Buscar
                    </SearchButton>
                </Stack>
    )
}


export default OffererClientPortfolioFilterComponent