import { useContext } from "react";
import { Skeleton } from "@mui/material";
import {HomeCompanyPageContext} from "pages/company//HomeCompanyPage";
import MyCompanySummaryTab from "../tabs/MyCompanySummaryTab";

function HomeCompanyPageSummaryTab() {
    const { company } = useContext(HomeCompanyPageContext);
    
    return (
        company ?
            <MyCompanySummaryTab company={company} />
            :
            <Skeleton />
    )
}

export default HomeCompanyPageSummaryTab;