import React, {ReactElement} from "react";
import {Route} from "react-router-dom";
import SafetyRouteMiddleware from "components/security/SafetyRouteMiddleware";
import {AppRouteSecObjects, SecurityComponents} from "types/security";
import MarketSolicitationRedirection from "components/routing/MarketSolicitationRedirection";
import MarketHomeCasfog from "pages/markets/home/MarketHomeCasfog";
import MarketHomeNew from "pages/markets/home/MarketHomeNew";
import ProductLineAlterSearch from "pages/markets/lines/components/ProductLineAlterSearch";
import ProductLineDetail from 'pages/markets/lines/detail/ProductLineDetail';
import ProductLinePymeDetail from "pages/markets/lines/detail/ProductLinePymeDetail";
import ProductLineShoppingCart from "pages/markets/lines/shoppingbag/ProductLineShoppingCart";
import PrequalificationPage from "pages/markets/prequalification/PrequalificationPage";
import {ThemedRoute} from "routes/ThemedRoute";
import LayoutUserLogged, {LayoutUserLoggedSections} from "layouts/LayoutUserLogged";
import MarketLangingPage from "pages/markets/home/MarketLangingPage";
import LayoutMarketAdvancedSearch from "../../layouts/home/LayoutMarketAdvancedSearch";

const MarketRoutes = {
	getThemedRoutes: (): ReactElement => {
		return (
			<React.Fragment>
                <Route path={'/market/lines'}
                       element={
                           <ThemedRoute element={
                               <SafetyRouteMiddleware componentName={SecurityComponents.AppRoutes}
                                                      objectName={AppRouteSecObjects.MarketProductLineSearchRoute}
                               >
                                   <LayoutMarketAdvancedSearch />
                               </SafetyRouteMiddleware>
                           } />
                       }
                />
                
                <Route element={
                        <ThemedRoute element={<LayoutUserLogged sectionActive={LayoutUserLoggedSections.Market} />} />
                }>
                    <Route path={'/market/home'} element={<MarketHomeNew />} />
                    <Route path="/market/landing" element={<MarketLangingPage />} />
                    <Route path={'/market/luc'} element={<MarketHomeCasfog srcImage={"/images/market/luc-busqueda-asistida-landing-page.png"} />} />
                    <Route path={'/market/luc-te-orienta'} element={<MarketHomeCasfog srcImage={"/images/market/luc-orientacion-landing-page.png"} />} />
                    <Route path={'/market/casfog'} element={<MarketHomeCasfog srcImage={"/images/market/casfog-landing-page.png"} />} />
                    <Route path={'/market/lines/:uniProductLineId'} element={<ProductLinePymeDetail />} />
                    
                    <Route path="/market/lines/carrito/:companyId" 
                           element={
                            <SafetyRouteMiddleware componentName={SecurityComponents.AppRoutes} 
                                                   objectName={AppRouteSecObjects.MarketCompanyShoppingCartRoute}
                            >
                                <ProductLineShoppingCart />
                            </SafetyRouteMiddleware>
                        }
                    />
                    <Route path="/market/lines/:idOfferer/:idLine" element={<ProductLineDetail />} />
                </Route>
                
                <Route path="/market/lines/alterSearch" element={
                    <ThemedRoute element={<ProductLineAlterSearch />} />}
                />

                <Route path="/market/lines/:companyId/prequalification"
                       element={
                           <ThemedRoute element={
                                           <SafetyRouteMiddleware componentName={SecurityComponents.AppRoutes}
                                                                  objectName={AppRouteSecObjects.MarketPrequalificationRoute}
                                           >
                                               <MarketSolicitationRedirection>
                                                   <PrequalificationPage />
                                               </MarketSolicitationRedirection>
                                           </SafetyRouteMiddleware>
                                       }
                           />
                       }
                />
			</React.Fragment>
		)
	}
}

export default MarketRoutes;