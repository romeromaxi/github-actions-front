import {userStorage} from "../../../util/localStorage";
import {OffererProfileType} from "../../../types/offerer/offererData";
import HomeOffererSummary from "../summary/HomeOffererSummary";
import OffererWorkTeams from "../workTeams/OffererWorkTeams";
import React from "react";


const MyLucOfferer = () => {
    const profileIds: number[] | undefined = userStorage.getProfileIds();
    const isAdmin = !!profileIds && profileIds.includes(OffererProfileType.Administrator);

    return (
        isAdmin ?
            <HomeOffererSummary/>
            :
            <OffererWorkTeams />
    )
}


export default MyLucOfferer