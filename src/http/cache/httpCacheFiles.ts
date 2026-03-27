import { HttpAxiosRequest } from '../httpAxiosBase';
import {
  FileSolicitationTemplate,
  FileSubtype,
  FileType,
} from 'types/files/filesDataCache';
import { Sections } from 'types/general/generalEnums';

export const HttpCacheFiles = {
  getEndpoint: (url: string): string => `cache/archivos${url}`,

  getTypes: (): Promise<FileType[]> => {
    return HttpAxiosRequest.get(HttpCacheFiles.getEndpoint('/tipos'));
  },

  getTypesBySection: (section: Sections): Promise<FileType[]> => {
    let route: string = '';

    switch (section) {
      case Sections.CompanyLegal:
        route = 'juridicas';
        break;
      case Sections.Activity:
        route = 'actividades';
        break;
      case Sections.DischargeBCRA:
        route = 'descargos-bcra';
        break;
      case Sections.DischargeContributions:
        route = 'descargos-aportes';
        break;
      case Sections.DischargeChecks:
        route = 'descargos-cheques';
        break;
      case Sections.DischargeScore:
        route = 'descargos-scores';
        break;
      case Sections.FinancialYear:
        route = 'ejercicios';
        break;
      case Sections.PostClosingMovementsCompanyLegal:
        route = 'juridicas/movimientos-post-cierrre';
        break;
      case Sections.RelatedPerson:
        route = 'personas-relacionadas';
        break;
      case Sections.CompanyPhysical:
        route = 'fisicas';
        break;
      case Sections.Certifications:
        route = 'certificaciones';
        break;
      case Sections.Affidavit:
        route = 'declaraciones-juradas';
        break;
      case Sections.DeclarationOfAssets:
        route = 'manifestaciones-bienes';
        break;
      case Sections.Solicitations:
        route = 'solicitudes';
        break;
      case Sections.PostClosingMovementsCompanyPhysical:
        route = 'fisicas/movimientos-post-cierrre';
        break;
      case Sections.PublicBases:
        route = 'bases-publicas';
        break;
      case Sections.Presentations:
        route = 'presentaciones';
        break;
      case Sections.PresentationsTemplates:
        route = 'plantillas-presentaciones';
        break;
    }

    return HttpAxiosRequest.get(HttpCacheFiles.getEndpoint(`/tipos/${route}`));
  },

  getSubtypes: (): Promise<FileSubtype[]> => {
    return HttpAxiosRequest.get(HttpCacheFiles.getEndpoint(`/subtipos`));
  },

  getCompanySolicitationTemplates: (): Promise<FileSolicitationTemplate[]> => {
    return HttpAxiosRequest.get(
      HttpCacheFiles.getEndpoint(`/solicitudes/plantillas/juridicas`),
    );
  },

  getPersonSolicitationTemplates: (): Promise<FileSolicitationTemplate[]> => {
    return HttpAxiosRequest.get(
      HttpCacheFiles.getEndpoint(`/solicitudes/plantillas/humanas`),
    );
  },
};
