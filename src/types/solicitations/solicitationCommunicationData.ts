
export enum SolicitationCommunicationFields {
    Title = 'titulo',
    CssIcon = 'iconoCss',
    IsSuitable = 'estaApto',
    CommunicationDate = 'fechaComunicacion',
    AptitudeMessage = 'mensajeAptitud',
    ShowAptitudeStatus = 'mostrarEstadoAptitud',
    ShowTrackingTable = 'mostrarTablaSeguimiento'
}

export interface SolicitationCommunicationView {
    [SolicitationCommunicationFields.Title]: string,
    [SolicitationCommunicationFields.CssIcon]: string,
    [SolicitationCommunicationFields.IsSuitable]: boolean,
    [SolicitationCommunicationFields.CommunicationDate]?: Date,
    [SolicitationCommunicationFields.AptitudeMessage]?: string,
    [SolicitationCommunicationFields.ShowAptitudeStatus]?: boolean,
    [SolicitationCommunicationFields.ShowTrackingTable]?: boolean,
}
