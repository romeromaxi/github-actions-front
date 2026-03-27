import {Box, Grid, Stack} from "@mui/material";
import {useNavigate} from "react-router-dom";
import {ChevronRight, FileSpreadsheetIcon} from "lucide-react";
import {EntityWithIdFields} from "types/baseEntities";
import {TypographyBase} from "components/misc/TypographyBase";
import {DataWithLabel} from "components/misc/DataWithLabel";
import {dateFormatter} from "util/formatters/dateFormatter";
import {stringFormatter} from "util/formatters/stringFormatter";
import {
    OffererClientPortfolioTypes,
    OffererClientPortfolioView,
    OffererClientPortfolioViewFields
} from "types/offerer/clientPortfolioData";
import { CopyClipboardTypography} from "components/clipboards/CopyClipboardComponents";
import {CopyIcon} from "lucide-react";
import { CompanyLogo } from "pages/company/components/CompanyLogo";
import { PersonTypes } from "types/person/personEnums";
import {AppConfigFields, AppConfigLogosFields} from "../../../../types/appConfigEntities";
import {WrapperIcons} from "../../../../components/icons/Icons";

interface OffererClientPortfolioCardProps {
    portfolio: OffererClientPortfolioView;
}

const paddingXInternal = { xs: '12px', md: '16px !important' };
const paddingYInternal = { xs: 'auto', md: '16px !important' };

function OffererClientPortfolioCard({portfolio}: OffererClientPortfolioCardProps) {
    const navigate = useNavigate();
    const lucLogo = window.APP_CONFIG[AppConfigFields.Logos][AppConfigLogosFields.Icon192]
    const portfolioId = portfolio[EntityWithIdFields.Id];

    const handleClick = () => {
        navigate(`/offerer/clientPortfolio/${portfolioId}`);
    };

    return (
        <Box
            sx={{
                position: 'relative',
                width: {xs: '100vw', sm: '100%'},
                ml: {xs: 'calc(50% - 50vw)', sm: 0},
                mr: {xs: 'calc(50% - 50vw)', sm: 0},
            }}
        >
            <Box
                onClick={handleClick}
                sx={{
                    padding: '0px !important',
                    width: '100%',
                    background: '#FFFFFF',
                    border: '1px solid #ECECEC',
                    borderRadius: {xs: 0, sm: '16px'},
                    cursor: 'pointer',
                    transition: 'all 0.2s',
                    overflow: 'hidden',
                    '&:hover': {
                        boxShadow: '0px 2px 8px rgba(0,0,0,0.1)',
                        borderColor: '#DADADA',
                    },
                }}
            >
                <Grid
                    container
                    alignItems="center"
                    spacing={{xs: 1.5, md: 0.8}}
                    padding={{xs: '12px !important', md: '6.5px 0px 0px 14px !important'}}
                >
                    <Grid
                        item
                        xs={12}
                        md={0.6}
                        sx={{
                            display: 'flex',
                            alignItems: 'center',
                            paddingY: paddingYInternal
                        }}
                    >
                        <CompanyLogo size={'lg'}
                                     loading={false}
                                     isPhysicalPerson={portfolio[OffererClientPortfolioViewFields.PersonTypeCode] === PersonTypes.Physical}
                        />
                    </Grid>

                    <Grid
                        item
                        xs={12}
                        md={3}
                        sx={{
                            display: 'flex',
                            alignItems: 'center',
                            borderRight: {xs: 'none', md: '1px solid #ECECEC'},
                            pr: {md: 2},
                            mr: {md: 1},
                            paddingY: paddingYInternal
                        }}
                    >
                        <Stack sx={{ width: '100%', overflow: 'hidden' }}>
                            <TypographyBase variant={'button2'} fontFamily={'Poppins !important'} fontWeight={600} fontSize={16} tooltip maxLines={1}>
                                {portfolio[OffererClientPortfolioViewFields.BusinessName]}
                            </TypographyBase>
                            <Stack direction="row" alignItems="center" spacing={0.75}>
                                <CopyClipboardTypography textToCopy={portfolio[OffererClientPortfolioViewFields.CUIT]}
                                                         variant={'body3'}
                                                         color="text.lighter"
                                                         maxLines={1}
                                                         tooltip
                                                         addIcon
                                                         icon={<CopyIcon size={14} />}
                                >
                                    {stringFormatter.formatCuit(portfolio[OffererClientPortfolioViewFields.CUIT])}
                                </CopyClipboardTypography>
                            </Stack>
                        </Stack>
                    </Grid>

                    <Grid
                        item
                        xs={6}
                        md={1.5}
                        sx={{
                            textAlign: {xs: 'center', md: 'left'},
                            paddingY: paddingYInternal
                        }}
                    >
                        <DataWithLabel
                            label={
                                <TypographyBase variant="body4" fontWeight={400} color="text.lighter">
                                    Origen
                                </TypographyBase>
                            }
                            data={
                                <Stack spacing={0.5} direction="row" alignItems={"center"}>
                                    {
                                        portfolio[OffererClientPortfolioViewFields.FolderTypeCode] === OffererClientPortfolioTypes.LUC ?
                                            <CompanyLogo loading={false} companyLogo={lucLogo} size='xs' />
                                            :
                                            <WrapperIcons Icon={FileSpreadsheetIcon} size={14} />
                                    }
                                    <TypographyBase variant="body3" fontWeight={600} maxLines={1} tooltip>
                                        {portfolio[OffererClientPortfolioViewFields.FolderTypeDesc]}
                                    </TypographyBase>
                                </Stack>
                            }
                        />
                    </Grid>

                    <Grid
                        item
                        xs={6}
                        md={1.5}
                        sx={{
                            textAlign: {xs: 'center', md: 'left'},
                            paddingY: paddingYInternal
                        }}
                    >
                        <DataWithLabel
                            label={
                                <TypographyBase variant="body4" fontWeight={400} color="text.lighter">
                                    Añadido
                                </TypographyBase>
                            }
                            data={
                                <TypographyBase variant="body3" fontWeight={600} maxLines={1}>
                                    {dateFormatter.toShortDate(portfolio[OffererClientPortfolioViewFields.CreationDate])}
                                </TypographyBase>
                            }
                        />
                    </Grid>

                    <Grid
                        item
                        xs={6}
                        md={1.5}
                        sx={{
                            textAlign: {xs: 'center', md: 'left'},
                            paddingY: paddingYInternal
                        }}
                    >
                        <DataWithLabel
                            label={
                                <TypographyBase variant="body4" fontWeight={400} color="text.lighter">
                                    Última actualización
                                </TypographyBase>
                            }
                            data={
                                <TypographyBase variant="body3" fontWeight={600} maxLines={1}>
                                    {dateFormatter.toShortDate(portfolio[OffererClientPortfolioViewFields.LastModifiedDate])}
                                </TypographyBase>
                            }
                        />
                    </Grid>
                    
                    <Grid
                        item
                        xs={12}
                        md={2}
                        sx={{
                            display: 'flex',
                            justifyContent: {xs: 'center', md: 'flex-start'},
                            paddingY: paddingYInternal
                        }}
                    >
                        <DataWithLabel
                            label={
                                <TypographyBase variant="body4" fontWeight={400} color="text.lighter">
                                    Usuario de actualización
                                </TypographyBase>
                            }
                            data={
                                <TypographyBase variant="body3" fontWeight={600} maxLines={1} tooltip>
                                    {portfolio[OffererClientPortfolioViewFields.UserLastModify] || '-'}
                                </TypographyBase>
                            }
                        />
                    </Grid>

                    <Grid
                        item
                        xs={12}
                        md={1.4}
                        sx={{
                            display: 'flex',
                            justifyContent: {xs: 'center', md: 'flex-start'},
                            paddingY: paddingYInternal
                        }}
                    >
                        <DataWithLabel
                            label={
                                <TypographyBase variant="body4" fontWeight={400} color="text.lighter">
                                    Tipo de persona
                                </TypographyBase>
                            }
                            data={
                                <TypographyBase variant="body3" fontWeight={600} maxLines={1}>
                                    {portfolio[OffererClientPortfolioViewFields.PersonTypeDesc]}
                                </TypographyBase>
                            }
                        />
                    </Grid>

                    <Grid
                        item
                        xs={12}
                        sm={6}
                        md="auto"
                        sx={{
                            display: 'flex',
                            justifyContent: {xs: 'center', md: 'flex-end'},
                            alignItems: 'center',
                            pr: paddingXInternal,
                            height: '-webkit-fill-available',
                            paddingY: paddingYInternal
                        }}
                    >
                        <ChevronRight size={24} color="#5B6560" />
                    </Grid>
                </Grid>
            </Box>
        </Box>
    );
}

export default OffererClientPortfolioCard;
