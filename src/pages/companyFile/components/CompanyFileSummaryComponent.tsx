import React from "react";
import { Button, Card, CardContent, Stack, Typography } from "@mui/material";
import useAxios from "hooks/useAxios";
import { useAction } from "hooks/useAction";
import { HttpExportCompanyFile } from "http/index";
import { LinearProgressNew } from "../../../components/misc/LinearProgressWithLabel";
import { CompanyFileType } from "../../../types/company/companyEnums";
import {TypographyBase} from "../../../components/misc/TypographyBase";
import {CheckIcon} from "lucide-react";
import {dateFormatter} from "../../../util/formatters/dateFormatter";
import {useAppNavigation} from "../../../hooks/navigation";
import {PymeRoute} from "../../../routes/pyme/routeAppPymeData";

interface CompanyFileSummaryComponentProps {
    companyId: number;
    percentage: number;
    title: string;
    description: string;
    fileType: CompanyFileType;
    lastModifiedDate?: Date;
}

function CompanyFileSummaryComponent({
    companyId,
    percentage,
    title,
    description,
    fileType, 
    lastModifiedDate,
}: CompanyFileSummaryComponentProps) {
    const { navigate } = useAppNavigation();
    const { snackbarSuccess } = useAction();
    const { fetchAndDownloadFile } = useAxios();
    
    const onHandleCompanyFileView = () => {
        navigate(PymeRoute.PymeCompanyFileDetail, 
            { companyId: companyId },
            undefined, 
            { replace: true }
        )
    }

    const exportCompanyFile = () => {
        fileType === CompanyFileType.Long
            ? fetchAndDownloadFile(() => HttpExportCompanyFile.exportLongFileToExcelByCompany(companyId)).then(() =>
                  snackbarSuccess("El legajo se guardó correctamente")
              )
            : fetchAndDownloadFile(() => HttpExportCompanyFile.exportShortFileToExcelByCompany(companyId)).then(() =>
                  snackbarSuccess("El legajo se guardó correctamente")
              );
    };

    return (
        <Card
            sx={{
                position: "relative",
                overflow: "hidden",
                "&::before": {
                    content: '""',
                    position: "absolute",
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    borderRadius: "inherit",
                    transition: "box-shadow 0.5s ease-in-out, border 0.5s ease-in-out",
                    pointerEvents: "none",
                },
            }}
        >
            <CardContent>
                <Stack spacing={2}>
                    <Stack direction="row" justifyContent="space-between" alignItems="center">
                        <Typography fontWeight={600} variant="h5">{title}</Typography>
                        {
                            /*
                                <ButtonExportDropdown size={"small"} onExportExcel={exportCompanyFile} />
                             */
                        }
                        <Button variant="text" size="medium" onClick={onHandleCompanyFileView}>Ver Legajo</Button>
                    </Stack>
                    <TypographyBase variant={"body2"} color={"text.lighter"}>
                        {description}
                    </TypographyBase>
                    {
                        percentage === 100 ?
                            <Stack direction="row" justifyContent="space-between" alignItems="center">
                                <Stack direction="row" spacing={1} alignItems="center">
                                    <CheckIcon color="#008547"/>
                                    <TypographyBase color="primary" variant="body2" fontWeight={500}>
                                        100% completado
                                    </TypographyBase>
                                </Stack>

                                {
                                    lastModifiedDate &&
                                        <TypographyBase variant="body2" fontWeight={500} color={"text.secondary"}>
                                            {`Última actualización el ${dateFormatter.toShortDate(lastModifiedDate)}`}
                                        </TypographyBase>
                                }
                            </Stack>
                            :
                            <LinearProgressNew value={percentage} sx={{ padding: 0.5 }} />
                    }
                    <Button variant={"contained"} fullWidth onClick={onHandleCompanyFileView} id={'company-file-view-btn'}>
                        {percentage === 100 ? 'Ver Legajo' : 'Completar Datos Requeridos'}
                    </Button>
                </Stack>
            </CardContent>
        </Card>
    );
}

export default CompanyFileSummaryComponent;