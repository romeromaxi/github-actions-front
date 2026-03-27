import {ReactNode} from "react";
import {Stack} from "@mui/material";
import CompanyBureauTabHeaders from "./CompanyBureauTabHeaders";


interface CompanyBureauTabWrapperProps {
    children?: ReactNode,
    isPhysicalPerson?: boolean
}


const CompanyBureauTabWrapper = ({children, isPhysicalPerson} : CompanyBureauTabWrapperProps) => {
    
    return (
        <Stack spacing={2}>
            <CompanyBureauTabHeaders isPhysicalPerson={isPhysicalPerson}/>
            {children}
        </Stack>
    )
}


export default CompanyBureauTabWrapper