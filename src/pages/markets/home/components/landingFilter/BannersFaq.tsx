import {Grid} from "@mui/material"
import {useEffect, useState} from "react";
import {HttpAds} from "http/ad/httpAds";
import {AdView} from "types/ad/adData";
import MarketAdBannerSwiper from "../../../components/misc/MarketAdBannerSwiper";


const BannersFaq = () => {
    const [ads, setAds] = useState<AdView[]>()
    
    useEffect(() => {
        HttpAds.getMarketAd().then(setAds)
    }, []);
    
    return (
        <Grid item xs={12} mb={3}>
            <MarketAdBannerSwiper ads={ads} />
        </Grid>
    )

}


export default BannersFaq