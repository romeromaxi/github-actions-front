import React, {useMemo, useState} from "react";
import GuidesHtmlEmbeddedPage from "./GuidesHtmlEmbeddedPage";
import {useNavigate, useParams} from "react-router-dom";
import FailRedirectMarketDialog from "../markets/home/components/FailRedirectMarketDialog";
import {NoCompaniesWithCreateNewDialog} from "../markets/lines/shoppingbag/dialogs/MustHaveRelatedCompanyDialog";
import CompaniesSelectDialog from "../company/components/CompaniesSelectDialog";
import {CompanyViewDTO} from "../../types/company/companyData";
import {HttpCompany} from "../../http";
import {EntityWithIdFields} from "../../types/baseEntities";
import {userStorage} from "../../util/localStorage";

function GuideBetterChoiceSectionPage() {
    const navigate = useNavigate();
    const { slug = 'que-es-luc' } = useParams();
    const isLoggedIn = useMemo(() => userStorage.isLogged(), []);

    const [openErrorDrawer, setOpenErrorDrawer] = useState<boolean>(false)
    const [companies, setCompanies] = useState<CompanyViewDTO[]>()
    const [openNoCompanies, setOpenNoCompanies] = useState<boolean>(false)
    const [companiesDrawer, setCompaniesDrawer] = useState<boolean>(false)

    const loadCompanies = () => {
        HttpCompany.getCompaniesByUser().then((r) => {
            if (r.length === 0) setOpenNoCompanies(true)
            else if (r.length === 1) navigate(`/mis-empresas/${r[0][EntityWithIdFields.Id]}?tab=bureau`)
            else {
                setCompanies(r)
                setCompaniesDrawer(true)
            }
        })
    }
        
    const onNotFoundHtmlPage = (namePage: string) => {
        if (namePage === "ver-como-me-ven.html") {
            if (!isLoggedIn) {
                setOpenErrorDrawer(true)
            } else {
                loadCompanies()
            }
        }
    };
    
    return (
        <React.Fragment>
            <GuidesHtmlEmbeddedPage urlBase={"informacion-para-elegir-mejor"}
                                    actualHtmlPage={slug}
                                    onNotFoundHtmlPage={onNotFoundHtmlPage}
            />

            <FailRedirectMarketDialog open={openErrorDrawer}
                                      onClose={() => setOpenErrorDrawer(false)}
                                      description={'En LUC podés conocer qué saben de vos clientes, proveedores y entidades. Ingresá o da de alta tu usuario para aprovechar esta y otras soluciones de LUC para vos.'}

            />
            
            <NoCompaniesWithCreateNewDialog open={openNoCompanies}
                                            onClose={() => setOpenNoCompanies(false)}
            />
            
            <CompaniesSelectDialog open={companiesDrawer}
                                   onClose={() => setCompaniesDrawer(false)}
                                   title={'Selecciona la empresa que querés ver'}
                                   onSelect={(id: number) => {
                                       setCompaniesDrawer(false)
                                       navigate(`/mis-empresas/${id}?tab=bureau`)
                                   }}
                                   onReloadCompanies={loadCompanies}
                                   companies={companies}
            />
        </React.Fragment>
    )
}

export default GuideBetterChoiceSectionPage;