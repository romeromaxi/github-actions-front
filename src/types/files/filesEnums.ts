export enum FileTypes {
  Statute = 1,
  Certificate = 2,
  Presentation = 3,
  Other = 4,
  Document = 5,
  Minutes = 6,
  PatrimonialStatement = 7,
  IncomeStatement = 8,
  SwornDeclarationPostClosing = 9,
  DischargeBCRA = 10,
  DischargeChecks = 11,
  DischargeContributions = 12,
  EmployerContributions = 13,
  Certifications = 14,
  Affidavit = 15,
  DeclarationOfAssets = 16,
}

export const googleDriveMimeTypes: string =
  'application/vnd.google-apps.folder,' +
  'application/vnd.google-apps.document,' +
  'application/vnd.google-apps.spreadsheet,' +
  'application/vnd.google-apps.presentation,' +
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document,' +
  'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet,' +
  'application/vnd.openxmlformats-officedocument.presentationml.presentation,' +
  'application/pdf,' +
  'image/jpeg,' +
  'image/png,' +
  'image/gif,' +
  'text/plain,' +
  'text/csv';
