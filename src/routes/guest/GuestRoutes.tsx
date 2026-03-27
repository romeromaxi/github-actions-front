import React, {Fragment, lazy, ReactElement} from "react";
import {Route} from "react-router-dom";
import {ThemedRoute} from "routes/ThemedRoute";
import {LoaderBlockUI} from "components/loader/LoaderBlockUI";
import SharedDocumentationGuidPage from "pages/sharedDocumentation/SharedDocumentationGuidPage";
import LayoutLoggedUserCompanyFileMarket from "../../layouts/LayoutLoggedUserCompanyFileMarket";
import GuideLucInformationPage from "pages/guides/GuideLucInformationPage";
import GuideBetterChoiceSectionPage from "pages/guides/GuideBetterChoiceSectionPage";
import BlogPage from "pages/general/blog/BlogPage";
import ContactPage from "pages/general/contact/ContactPage";
import AboutLucPage from "pages/home/AboutLucPage";
import SignupPinPage from "../../pages/user/Signup/SignupPinPage";
import InternalLogin from "../../pages/internal/InternalLogin";
import {LayoutUserNotLoggedSections} from "../../layouts/LayoutUserNotLogged";
import {LayoutUserLoggedSections} from "../../layouts/LayoutUserLogged";
import BlogHeader from "../../pages/general/blog/components/BlogHeader";
import {ApplicationCommonTopContentType} from "../../hooks/contexts/ApplicationCommonContext";
import BlogNewsDetail from "../../pages/general/blog/components/BlogNewsDetail";

const LayoutContainerNotLogged = lazy(() => import("../../layouts/LayoutContainerNotLogged"));
const LayoutUserLogged = lazy(() => import("../../layouts/LayoutUserLogged"));
const LayoutUserNotLogged = lazy(() => import("../../layouts/LayoutUserNotLogged"));
const LayoutMinimal = lazy(() => import("../../layouts/LayoutMinimal"));
const SharedSolicitationGuidPage = lazy(() => import("pages/sharedSolicitation/SharedSolicitationGuidPage"));
const HomeOfferers = lazy(() => import("pages/home/HomeOfferers"));
const UserResetPassword = lazy(() => import("pages/user/changePassword/UserResetPassword"));
const SignupInvitationPage = lazy(() => import("pages/user/Signup/SignupInvitationPage"));
const SignupResponsibleInvitationPage = lazy(() => import("pages/user/Signup/SignupResponsibleInvitationPage"));

const GuestRoutes = {
  getThemedRoutes: (): ReactElement => {
		return (
			<>
        <Route element={<ThemedRoute element={<React.Suspense fallback={<LoaderBlockUI/>}> <LayoutContainerNotLogged /> </React.Suspense>}/>} >
          <Route
            path="/sharedSolicitation/:guid"
            element={<SharedSolicitationGuidPage />}
          />
        </Route>
        <Route element={<ThemedRoute element={<React.Suspense fallback={<LoaderBlockUI/>}> <LayoutContainerNotLogged /> </React.Suspense>}/>} >
            <Route
                path="/sharedDocumentation/:guid"
                element={<SharedDocumentationGuidPage />}
            />
        </Route>

        <Route element={<ThemedRoute element={<React.Suspense fallback={<LoaderBlockUI/>}><LayoutMinimal gridBackground /></React.Suspense>}/>} >
          <Route path="/reset-password" element={<UserResetPassword />} />
        </Route>
        
        <Route element={<ThemedRoute element={<React.Suspense fallback={<LoaderBlockUI/>}> <LayoutLoggedUserCompanyFileMarket /> </React.Suspense>}/>} >
          <Route path="/signup/confirmation" element={<SignupPinPage />} />
          <Route path="/signup-invitation" element={<SignupInvitationPage />} />
          <Route path="/signup-responsible-invitation" element={<React.Suspense fallback={<LoaderBlockUI/>}> <SignupResponsibleInvitationPage /></React.Suspense>} />
        </Route>
        
        <Route element={<ThemedRoute element={<React.Suspense fallback={<LoaderBlockUI/>}><LayoutMinimal gridBackground /></React.Suspense>}/>} >
          <Route path="/offerer/login/:offererSlug" element={<HomeOfferers />} />
          <Route path="/internal/login" element={<InternalLogin />} />
        </Route>
                
                <Route element={
                        <ThemedRoute element={
                            <LayoutUserNotLogged sectionActive={LayoutUserNotLoggedSections.AboutLuc} 
                                                 gridBackground
                            />}
                        />} >
                    <Route path="/sobre-luc" element={<AboutLucPage />} />
                </Route>

                <Route element={
                        <ThemedRoute element={
                            <LayoutUserLogged
                                sectionActive={LayoutUserLoggedSections.ContactLuc}
                                notLoggedProps={{
                                    sectionActive: LayoutUserNotLoggedSections.ContactLuc,
                                    gridBackground: true
                                }}
                            />}
                        />} >
                    <Route path="/contacto" element={<ContactPage />} />
                </Route>

                <Route element={
                    <ThemedRoute element={
                        <LayoutUserLogged
                            fullBanner={<BlogHeader />}
                            topContent={ApplicationCommonTopContentType.AboveAppBar}
                            sectionActive={LayoutUserLoggedSections.BlogLuc}
                            notLoggedProps={{
                                sectionActive: LayoutUserNotLoggedSections.BlogLuc,
                            }}
                        />}
                    />} >
                    <Route path="/blog" element={<BlogPage />} />
                </Route>
                <Route element={
                    <ThemedRoute element={
                        <LayoutUserLogged
                            topContent={ApplicationCommonTopContentType.AboveAppBar}
                            sectionActive={LayoutUserLoggedSections.BlogLuc}
                            notLoggedProps={{
                                sectionActive: LayoutUserNotLoggedSections.BlogLuc,
                            }}
                        />}
                    />} >
                    <Route path="/blog/:blogGuid" element={<BlogNewsDetail />} />
                </Route>
                <Route element={
                        <ThemedRoute element={
                            <LayoutUserLogged
                                sectionActive={LayoutUserLoggedSections.FAQLuc}
                                notLoggedProps={{
                                    sectionActive: LayoutUserNotLoggedSections.FAQLuc,
                                    gridBackground: true
                                }}
                            />}
                        />} >
                    <Route path="/ayuda/:slug" element={<GuideLucInformationPage />} />

                    <Route path="/ayuda" element={<GuideLucInformationPage />} />
                </Route>

                <Route element={<ThemedRoute element={<LayoutLoggedUserCompanyFileMarket bottomToolbar flushWithAppBar />}/>} >
                    <Route path="/informacion-para-elegir-mejor/:slug" element={<GuideBetterChoiceSectionPage />} />
                </Route>
                <Route element={<ThemedRoute element={<LayoutLoggedUserCompanyFileMarket bottomToolbar flushWithAppBar />}/>} >
                    <Route path="/informacion-para-elegir-mejor" element={<GuideBetterChoiceSectionPage />} />
                </Route>
			</>
		)
	}
}

export default GuestRoutes;