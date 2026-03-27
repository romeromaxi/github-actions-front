export enum GeneralConfigurationSecObjects {
  SolicitationFavoriteButton = 'BotonSolicitudFavorito',
  SolicitationShoppingBagButton = 'BotonSolicitudCarrito',
  MyCompaniesButton = 'BotonMisEmpresas',
}

export enum SideBarMenuItemsSecObjects {
  LinkOffererLines = 'LinkOferenteLineas',
  LinkOffererRoles = 'LinkOferenteRoles',
  LinkOffererSolicitations = 'LinkOferenteSolicitudes',
  LinkOffererProspects = 'LinkOferenteProspectosCarpetas',
  LinkOffererUserMnagement = 'LinkOferenteGestionUsuarios',
  LinkOffererReports = 'LinkOferenteReportes',
  LinkOffererLibrary = 'LinkOferenteBiblioteca',
  LinkOffererDocumentTemplates = 'LinkOferenteListadoDocumentos',
  LinkOffererIntegration = 'LinkOferenteIntegraciones',
  
  LinkCompanyRepository = 'LinkEmpresaRepositorio',
  LinkCompanySolicitations = 'LinkEmpresaSolicitudes',
  LinkCompanyFile = 'LinkEmpresaPresentaciones',
  LinkCompanyBureau = 'LinkEmpresaBasesPublicas',
  LinkCompanyLibrary = 'LinkEmpresaBiblioteca',
  LinkCompanyMyCompanies = 'LinkMisEmpresas',
}

export enum AppRouteSecObjects {
  MarketProductLineSearchRoute = 'RutaMarketBusquedaLinea',
  MarketCompanyShoppingCartRoute = 'RutaMarketCarritoPyme',
  MarketCompanySolicitationListRoute = 'RutaPymeSolicitudesListado',
  MarketWishlistRoute = 'RutaMarketFavoritos',
  MarketPrequalificationRoute = 'RutaMarketPrecalificacion',

  CompanyNotificationsRoute = 'RutaPymeNotificaciones',
  CompanyNotificationsDetailRoute = 'RutaPymeNotificacionesDetalle',
  CompanyFileDetailRoute = 'RutaLegajoEmpresaDetalle',
  CompanySolicitationsRoute = 'RutaPymeSolicitud',
  CompanyHomeRoute = 'RutaPymeHome',
  CompanyHomeDetailRoute = 'RutaPymeHomeEmpresa',

  OffererSolicitationsRoute = 'RutaOferenteSolicitudes',
  OffererSolicitationsDetailRoute = 'RutaOferenteSolicitudesDetalle',
  OffererLinesRoute = 'RutaOferenteLineas',
  OffererLinesDetailRoute = 'RutaOferenteLineasDetalle',
  OffererNotificationsRoute = 'RutaOferenteNotificaciones',
  OffererNotificationsDetailRoute = 'RutaOferenteNotificacionesDetalle',
  OffererUserProfileRoute = 'RutaOferentePerfilUsuario',
  OffererHomeRoute = 'RutaOferenteHome',
  OffererDocumentTemplatesRoute = 'RutaOferentePlantillasDocumentos',
  OffererUserManagementRoute = 'RutaOferenteABMUsuarios',
  OffererReportsRoute = 'RutaOferenteReportes',
  OffererControlPanelReportsRoute = 'RutaOferenteReportesPanelControl',
  OffererSolicitationsReportsRoute = 'RutaOferenteReportesSolicitudes',
  OffererDelaySolicitationsReportsRoute = 'RutaOferenteReportesSolicitudesDemora',
  OffererTeamSolicitationsReportsRoute = 'RutaOferenteReportesSolicitudesPorEquipo',
  OffererReportDetailRoute = 'RutaOferenteReportesDetalle',
  OffererLibraryRoute = 'RutaOferenteBiblioteca',
  OffererIntegrationRoute = 'RutaOferenteIntegraciones',
  OffererProspectsRoute = 'RutaOferenteProspectos',
  OffererProspectsDetailRoute = 'RutaOferenteProspectosDetalle',
  OffererConfigurationRoute = 'RutaOferenteConfiguracion',

  InternalUserProfileRoute = 'RutaInternoPerfil',
  InternalHomeRoute = 'RutaInternoHome',
  InternalOffererConfigurationRoute = 'RutaInternoAdministradorOferentes',
  InternalPeopleValidationRoute = 'RutaInternoValidacionPersonas',
  InternalLinesRoute = 'RutaInternoLineas',
  InternalSolicitationsRoute = 'RutaInternoSolicitations',
  InternalLinesDetailRoute = 'RutaInternoLineasDetalle',
  InternalNotificationsRoute = 'RutaInternoNotificaciones',
  InternalNotificationsDetailRoute = 'RutaInternoNotificacionesDetalle',
  InternalProductParameterizationRoute = 'RutaInternoParametrizacionProductos',
  InternalPymeUserListRoute = 'RutaInternoListadoUsuariosPymes',
  InternalCRUDEmailTemplatesRoute = 'RutaInternoABMMailsPlantilas',
  InternalProfileManagerRoute = 'RutaInternoPerfilesConfiguracion',
  InternalReportsListRoute = 'RutaInternoListaReportes',
  InternalAdsRoute = 'RutaInternoPublicidades',
  InternalSelectedLinesRoute = 'RutaInternoLineasDestacadas',
  InternalAllUsersRoute = 'RutaInternoTodosLosUsuarios'
}

export enum OffererSolicitationNavHeaderSecObjects {
  SolicitationOffererChatLink = 'LinkSolicitudOferenteChatPyme',
  SolicitationOffererRequestedFilesLink = 'LinkSolicitudOferentePresentacionDocumentacion',
  AssignmentSolicitationButton = 'BotonAsignacionSolicitud',
  AssignmentResponsibleCommercialSolicitationButton = 'BotonAsignacionComercialSolicitud',
  SolicitationOffererBureauLink = 'LinkSolicitudOferenteBasesPublicas',
  SolicitationOffererExternalAccessLink = 'LinkSolicitudOferenteAccesoExterno'
}

export enum OffererSolicitationRequestedFilesSecObjects {
  SolicitationOffererRequestFileButton = 'BotonSolicitudOferenteSolicitarArchivo',
}

export enum OffererRolesListSecObjects {
  NewRoleButton = 'BotonOferenteNuevoRol',
}

export enum OffererSolicitationActivitySecObjects {
  SendChatOffererButton = 'BotonOferenteEnviarChat',
}

export enum CompanyHeaderSecObjects {
  ViewRolesButton = 'BotonEmpresaVerRoles',
  DeletePymeButton = 'BotonEmpresaEliminar',
  QuitPymeButton = 'BotonEmpresaSalir',
}

export enum CompanySolicitationPageSecObjects {
  SolicitationCompanyChatLink = 'LinkSolicitudEmpresaChatOferente',
  SolicitationCompanyRequestedFilesLink = 'LinkSolicitudEmpresaPresentacionDocumentacion',
  SolicitationCompanyDocumentationReceivedLink = 'LinkSolicitudEmpresaDocumentacionRecibida',
}

export enum CompanySolicitationActivitySecObjects {
  SendChatCompanyButton = 'BotonSolicitudEmpresaEnviarChat',
}

export enum CompanySolicitationRequestedFilesSecObjects {
  SolicitationCompanySendRequestedFileButton = 'BotonSolicitudEmpresaEnviarArchivoSolicitado',
}

export enum OffererSolicitationDataAnalysisDetailSecObjects {
  ProposalDataAnalysisSolicitationButton = 'BotonElaborarPropuestaRecepcionSolicitud',
}

export enum OffererSolicitationApprovalSecObjects {
  ApproveDataAnalysisSolicitationButton = 'BotonAprobarRecepcionSolicitud',
}

export enum OffererSolicitationDocumentationAnalysisSecObjects {
  ProposalDocumentationAnalysisSolicitationButton = 'BotonElaborarPropuestaPrecalificacionSolicitud',
}

export enum OffererSolicitationDocumentationValidationSecObjects {
  ApproveDocumentationAnalysisSolicitationButton = 'BotonAprobarPrecalificacionSolicitud',
}

export enum HomeOffererLineSecObjects {
  LineOffererNewButton = 'BotonOferenteLineaNueva',
}

export enum OffererProductLineDetailPageSecObjects {
  ProductLineOffererRequestPublicationButton = 'BotonOferenteLineaSolicitarPublicacion',
  ProductLineOffererCancelPublicationButton = 'BotonOferenteLineaDarBaja',
  ProductLineOffererRequestModificationButton = 'BotonOferenteLineaSolicitarModificacion',
  
  ProductLineInternalButtonPreviewLine = 'BotonInternoLineaPrevisualizar',
}

export enum OffererButtonSecObjects {
  OffererButtonNewWorkTeam = 'BotonOferenteNuevoEquipoTrabajo',
  OffererButtonDetailLine = 'BotonOferenteLineaDetalle',
  OffererButtonPreviewLine = 'BotonOferenteLineaPrevisualizar',
  OffererButtonIntegrationAdd = 'BotonOferenteIntegracionAgregar',
  OffererButtonIntegrationEdit = 'BotonOferenteIntegracionEditar',
  OffererButtonIntegrationDelete = 'BotonOferenteIntegracionEliminar',
  OffererButtonClientPortfolioBatchSearch = 'BotonBusquedaCuitEnBatch',
  OffererButtonClientPortfolioIndividualSearch = 'BotonOferenteBusquedaCuitIndividual',
  OffererButtonClientPortfolioDetail = 'BotonOferenteBusquedaCuitDetalle',
  OffererButtonTemplatesNewDocuments = 'BotonOferentePlantillasDocumentosNuevo',
  OffererButtonLibraryNewDocument = 'BotonOferenteBibliotecaNuevoDocumento',
  OffererButtonLibraryNewFolder = 'BotonOferenteBibliotecaNuevaCarpeta',
  OffererButtonLibraryShare = 'BotonOferenteBibliotecaCompartir',
  OffererButtonLibraryFolderEdit = 'BotonOferenteBibliotecaEditarCarpeta',
  OffererButtonLibraryFolderDelete = 'BotonOferenteBibliotecaEliminarCarpeta',
  OffererButtonLibraryDocumentEdit = 'BotonOferenteBibliotecaEditarDocumento',
  OffererButtonLibraryDocumentDownload = 'BotonOferenteBibliotecaDescargarDocumento',
  OffererButtonLibraryDocumentView = 'BotonOferenteBibliotecaVerDocumento',
  OffererButtonLibraryDocumentDelete = 'BotonOferenteBibliotecaEliminarDocumento'
}
export enum FilingsPageSecObjects {
  PresentationToolsSection = 'SeccionHerramientasDePresentacion',
  PresentationFilesSection = 'SeccionArchivosPresentaciones',
}

export enum HomeCompanyPageSecObjects {
  CompanyAuthorizationsForThirdPartiesLink = 'LinkEmpresaAutorizacionesParaTerceros',
}
