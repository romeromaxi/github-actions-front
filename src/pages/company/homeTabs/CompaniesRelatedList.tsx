import React, {useContext, useMemo} from "react";
import {Grid, Stack} from "@mui/material";
import {TypographyBase} from "components/misc/TypographyBase";
import CompanyCardButton from "../components/CompanyCardButton";
import {HomeCompanyUserContext} from "../HomeCompanyUser";
import CompanyCardButtonLoading from "../components/CompanyCardButtonLoading";
import {EntityWithIdFields} from "../../../types/baseEntities";
import CompanySentInvitesCard from "../components/CompanySentInvitesCard";
import CompanyInvitesBox from "../components/CompanyInvitesBox";
import CompanyInvitesAsResponsibleBox from "../components/CompanyInvitesAsResponsibleBox";
import CompanyNewCardOptions from "../components/CompanyNewCardOptions";
import {useNavigate} from "react-router-dom";


function CompaniesRelatedList() {
  const routerDomNavigate = useNavigate();
  const {
      isLoading, hasAnyCompanyData, companies,
      sentInvites, invitesAsResponsible, invites, loadCompanies
  } = useContext(HomeCompanyUserContext);
  
  const titleSection = useMemo(() => {
    if (!companies || !companies.length) return null;
    
    return `PyMES vinculadas (${companies.length})`
  }, [companies]);

    const handleNewCompany = () => {
        routerDomNavigate({
            pathname: '/nueva-pyme',
            search: '?redirect=mi-cuenta'
        })
    }
  
  return (
    <Stack spacing={2}>
      {
        titleSection &&
          <TypographyBase variant={'h4'}>
            {titleSection}
          </TypographyBase>
      }
      
      <Grid container spacing={2} sx={{ marginLeft: '-16px !important' }}>
          {
              isLoading ?
                  <React.Fragment>
                      {
                          Array.from({ length: 3 }).map((_, idx) => (
                              <Grid item xs={12} sm={6} lg={4}
                                    key={`companyCardButtonLoading_${idx}`}
                              >
                                  <CompanyCardButtonLoading />
                              </Grid>
                          ))
                      }
                  </React.Fragment>
                  :
                  <React.Fragment>
                      {
                          (!!companies) &&
                          companies.map((company, idx) => (
                              <Grid item xs={12} sm={6} md={4} lg={3}
                                    key={`companyCardButton_${company[EntityWithIdFields.Id]}_${idx}`}
                              >
                                  <CompanyCardButton company={company}
                                                     onReload={loadCompanies}
                                  />
                              </Grid>
                          ))
                      }

                      {
                          invitesAsResponsible && invitesAsResponsible.length !== 0 &&
                          invitesAsResponsible.map((invRes, idx) =>
                              <Grid item xs={12} sm={6} md={4} lg={3} key={`responsibleInvitation_${idx}`}>
                                  <CompanyInvitesAsResponsibleBox invite={invRes}
                                                                  onSubmit={loadCompanies}
                                  />
                              </Grid>
                          )
                      }

                      {
                          invites && invites.length !== 0 &&
                          invites.map((inv, idx) =>
                              <Grid item xs={12} sm={6} md={4} lg={3} key={`companiesUserInvitation_${idx}`}>
                                <CompanyInvitesBox invite={inv} onSubmit={loadCompanies} />
                              </Grid>
                          )
                      }

                      {
                          sentInvites && sentInvites.length !== 0 &&
                          sentInvites.map((inv, idx) =>
                              <Grid item xs={12} sm={6} md={4} lg={3} key={`sentInvitation_${idx}`}>
                                  <CompanySentInvitesCard invite={inv} onSubmit={loadCompanies} />
                              </Grid>
                          )
                      }
                      <CompanyNewCardOptions 
                          companies={companies}
                          hasAnyCompanyData={hasAnyCompanyData}
                          onReload={loadCompanies}
                          onClickJoin={handleNewCompany}
                          redirectUrl={'/nueva-pyme?redirect=mi-cuenta'}
                          onValidationRedirectUrl={'/mi-cuenta'}
                      />
                  </React.Fragment>
          }
      </Grid>
    </Stack>
  )
}

export default CompaniesRelatedList;