import { useEffect, useState } from "react";
import { CompanyFileCompletenessFields, CompanyFileCompletenessView } from "../../../types/company/companyData";
import { Stack } from "@mui/material";
import { HttpCompany } from "../../../http";
import CompanyFileSummaryComponent from "../../companyFile/components/CompanyFileSummaryComponent";
import { CompanyFileType } from "../../../types/company/companyEnums";
import React from "react";

interface CompanyFileGeneralInfoProps {
    companyId: number;
}

const CompanyFileGeneralInfo = ({ companyId }: CompanyFileGeneralInfoProps) => {
    const [percentage, setPercentage] = useState<CompanyFileCompletenessView>();
    const [highlighted, setHighlighted] = useState<Record<string, boolean>>({});

    useEffect(() => {
        HttpCompany.getCompletenessPercentage(companyId).then(setPercentage);
    }, [companyId]);

    useEffect(() => {
        if (percentage) {
            const newHighlights: Record<string, boolean> = {};
            Object.entries(percentage).forEach(([key, value]) => {
                if (value < 100) {
                    newHighlights[key] = true;
                    setTimeout(() => {
                        setHighlighted((prev) => ({ ...prev, [key]: false }));
                    }, 3000);
                }
            });
            setHighlighted(newHighlights);
        }
    }, [percentage]);

    return (
        <Stack spacing={2}>
            {percentage && (
                <CompanyFileSummaryComponent
                    companyId={companyId}
                    percentage={percentage[CompanyFileCompletenessFields.FileTypeShortCompletenessPercentage]}
                    title={"Legajo de contacto"}
                    description={
                        "Información básica que se envía con cada solicitud. Asegurate de tenerla actualizada para estar siempre listo."
                    }
                    fileType={CompanyFileType.Short}
                    lastModifiedDate={percentage[CompanyFileCompletenessFields.FileTypeShortLastModifiedDate]}
                />
            )}
            {/*{percentage && (
                <CompanyFileSummaryComponent
                    companyId={companyId}
                    percentage={percentage[CompanyFileCompletenessFields.FinancialInformationCompletenessPercentage]}
                    title={"Información económica financiera"}
                    description={
                        "Esta es información complementaria que permite visualizar todos los indicadores de la empresa en Ver cómo te ven y puede ser requerida por las entidades para solicitar algunas líneas."
                    }
                    fileType={CompanyFileType.Long}
                    highlighted={highlighted[CompanyFileCompletenessFields.FinancialInformationCompletenessPercentage]}
                />
            )}*/}
        </Stack>
    );
};

export default CompanyFileGeneralInfo;