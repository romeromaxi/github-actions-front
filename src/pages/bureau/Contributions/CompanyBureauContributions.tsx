
import {Card, CardContent, CardHeader, Stack, Typography} from "@mui/material";
import {DataWithLabel} from "../../../components/misc/DataWithLabel";
import {NosisDetailQueryFields, NosisTabSection, PublicDataProvidersFields} from "../../../types/nosis/nosisData";
import React, {useContext} from "react";
import {BureauInformationContext} from "hooks/contexts/BureauInformationContext";
import ContributionsQuantityTable from "./ContributionsQuantityTable";
import EmployerContributionsTable from "./EmployerContributionsTable";
import {dateFormatter} from "../../../util/formatters/dateFormatter";
import {ButtonExportDropdown} from "../../../components/buttons/ButtonExportDropdown";
import {HttpPublicBasesExport} from "../../../http";
import {downloadFileBlobHelper} from "../../../util/helpers";




const CompanyBureauContributions = () => {
    const {nosisQuery, selectedQueryId, loading, error} = useContext(BureauInformationContext);
    
    const handleExportExcel = () => {
        if (selectedQueryId) HttpPublicBasesExport.exportContributionsToExcel(selectedQueryId).then(
            downloadFileBlobHelper
        )
    }

    const subheaderComponent = (
        <Stack direction={{ xs: 'column', md: 'row'}} justifyContent={'space-between'} width={0.9}
               sx={{ flexFlow: 'wrap' }}
        >
            <DataWithLabel
                rowDirection
                label={'Fuente'}
                data={<Typography variant={'caption'} fontWeight={500}>
                    {nosisQuery?.[NosisDetailQueryFields.ProvidersByCategory][NosisTabSection.EmployerContributions][PublicDataProvidersFields.ProviderName]}
                </Typography>}
            />
            <DataWithLabel
                rowDirection
                label={'Fecha de Actualización'}
                data={<Typography variant={'caption'} fontWeight={500}>
                    {dateFormatter.toShortDate(
                        nosisQuery?.[NosisDetailQueryFields.ProvidersByCategory][NosisTabSection.EmployerContributions][PublicDataProvidersFields.RequestDate]
                    )}
                </Typography>}
            />
        </Stack>
    )
    
    return (
            <Card>
                <CardHeader title={'Aportes previsionales'}
                            action={<ButtonExportDropdown onExportExcel={handleExportExcel} size='small' />}
                            subheader={subheaderComponent}
                />
                <CardContent>
                  <Stack spacing={3}>
                    <ContributionsQuantityTable
                        contributions={
                            nosisQuery?.[NosisDetailQueryFields.SocialSecurityContributions]
                        }
                        loading={loading}
                        error={error}
                    />
                    <EmployerContributionsTable
                        contributionList={
                            nosisQuery?.[
                                NosisDetailQueryFields.SocialSecurityContributionsDetailList
                                ]
                        }
                        loading={loading}
                        error={error}
                    />
                  </Stack>
                </CardContent>
            </Card>
    )
}


export default CompanyBureauContributions