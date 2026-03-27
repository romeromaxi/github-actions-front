export enum AppConfigFields {
  Title = 'title',
  Description = 'description',
  FontFamily = 'fontFamily',
  Logos = 'logos',
  AppBar = 'appbar',
  Footer = 'footer',
  AlliedOfferers = 'allies',
  Palette = "palette",
  TermsAndConditionsURL = "termsAndConditionsUrl",
  PrivacyPoliciesUserURL = "privacyPoliciesUserUrl",
  BannerDelay = "bannerDelay",
  ResourcesHome = "resourcesHome",
}

export enum AppConfigResourcesHomeFields {
  Video = "video",
  Banner = "banner",
  Images = "images"
}

export enum AppConfigResourcesHomeVideoFields {
  DescriptionUrl = "descriptionUrl",
  PresentationUrl = "presentationUrl",
  PosterUrl = "posterUrl"
}

export interface AppConfigResourcesHomeVideo {
  [AppConfigResourcesHomeVideoFields.DescriptionUrl]: string,
  [AppConfigResourcesHomeVideoFields.PresentationUrl]: string,
  [AppConfigResourcesHomeVideoFields.PosterUrl]: string
}

export enum AppConfigImageFields {
  Title = "title",
  Description = "description",
  URL = "url",
  Position = "position",
  Navigate = "navigate"
}

export interface AppConfigImage {
  [AppConfigImageFields.Title]: string,
  [AppConfigImageFields.Description]: string,
  [AppConfigImageFields.URL]: string,
  [AppConfigImageFields.Position]?: string,
  [AppConfigImageFields.Navigate]: string,
}

export interface AppConfigResourcesHome {
  [AppConfigResourcesHomeFields.Video]: AppConfigResourcesHomeVideo,
  [AppConfigResourcesHomeFields.Banner]: AppConfigImage[],
  [AppConfigResourcesHomeFields.Images]: AppConfigImage[],
}

export enum AppConfigLogosFields {
  Ico = 'ico',
  Full = 'full',
  FullNegative = 'fullNegative',
  Icon = 'icon',
  IconNegative = 'iconNegative',
  Icon192 = 'icon192',
  icon300 = 'icon300'
}

interface AppConfigLogos {
  [AppConfigLogosFields.Ico]: string
  [AppConfigLogosFields.Full]: string
  [AppConfigLogosFields.FullNegative]: string
  [AppConfigLogosFields.Icon]: string
  [AppConfigLogosFields.IconNegative]: string
  [AppConfigLogosFields.Icon192]: string
  [AppConfigLogosFields.icon300]: string
}

export enum AppConfigPaletteFields {
  Primary = 'primary',
  Secondary = 'secondary',
}

export enum AppConfigPaletteColorFields {
  Light = 'light',
  Main = 'main',
  Dark = 'dark',
  ContrastText = 'contrastText',
}

export interface AppConfigPaletteColor {
  [AppConfigPaletteColorFields.Light]: string,
  [AppConfigPaletteColorFields.Main]: string,
  [AppConfigPaletteColorFields.Dark]: string,
  [AppConfigPaletteColorFields.ContrastText]: string,
}

interface AppConfigPalette {
  [AppConfigPaletteFields.Primary]: AppConfigPaletteColor;
  [AppConfigPaletteFields.Secondary]: AppConfigPaletteColor;
}

export enum AppConfigSizeFields {
  Height = 'height',
  Width = 'width'
}

interface AppConfigSize {
  [AppConfigSizeFields.Height]: number | string,
  [AppConfigSizeFields.Width]: number | string,
}

export enum AppConfigAppBarFields {
  Height = 'height',
  Logo = 'logo'
}

export interface AppConfigAppBar {
  [AppConfigAppBarFields.Height]: number | string,
  [AppConfigAppBarFields.Logo]: AppConfigSize,
}

export enum AppConfigFooterFields {
  Logo = 'logo',
  SocialMedia = 'socialMedia',
  RightReservedText = 'rightReservedText'
}

export enum AppConfigFooterSocialMediaFields {
  YouTube = 'youtube',
  Facebook = 'facebook',
  X = 'x',
  Instagram = 'instagram',
  LinkedIn = 'linkedin'
}

export interface AppConfigFooterSocialMedia {
  [AppConfigFooterSocialMediaFields.YouTube]?: string,
  [AppConfigFooterSocialMediaFields.Facebook]?: string,
  [AppConfigFooterSocialMediaFields.X]?: string,
  [AppConfigFooterSocialMediaFields.Instagram]?: string,
  [AppConfigFooterSocialMediaFields.LinkedIn]?: string,
}

export interface AppConfigFooter {
  [AppConfigFooterFields.Logo]: AppConfigSize,
  [AppConfigFooterFields.SocialMedia]: AppConfigFooterSocialMedia,
  [AppConfigFooterFields.RightReservedText]: string | undefined,
}

export enum AppConfigAlliedOffererFields {
  Name = 'name',
  UrlImage = 'urlImage'
}

export interface AppConfigAlliedOfferer {
  [AppConfigAlliedOffererFields.Name]: string,
  [AppConfigAlliedOffererFields.UrlImage]: string
}


export enum AppConfigAlliedOfferersFields {
  Show = 'show',
  List = 'list'
}

export interface AppConfigAlliedOfferers {
  [AppConfigAlliedOfferersFields.Show]: boolean,
  [AppConfigAlliedOfferersFields.List]: AppConfigAlliedOfferer[]
}

export interface AppConfig {
  [AppConfigFields.Title]: string,
  [AppConfigFields.Description]: string,
  [AppConfigFields.FontFamily]: string,
  [AppConfigFields.Logos]: AppConfigLogos,
  [AppConfigFields.AppBar]: AppConfigAppBar,
  [AppConfigFields.TermsAndConditionsURL]: string,
  [AppConfigFields.PrivacyPoliciesUserURL]: string,
  [AppConfigFields.BannerDelay]: number,
  [AppConfigFields.ResourcesHome]: AppConfigResourcesHome,
  [AppConfigFields.Palette]: AppConfigPalette,
  [AppConfigFields.AlliedOfferers]: AppConfigAlliedOfferers
}