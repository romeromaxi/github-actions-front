/// <reference types="react-scripts" />

import {AppConfig} from "./types/appConfigEntities";

export declare global {
  interface Window {
    API_DOMAIN: string;
    API_VERSION: string;
    API_PROTOCOL: string;
    API_PUBLIC_BASES_DOMAIN: string;
    API_TIMEOUT: number;
    reCAPTCHA_SITE_KEY: string;
    URL_ABOUT_LUC: string;
    URL_SOLUTIONS_FOR_PYMES_LUC: string;
    URL_FAQ_LUC: string;
    URL_CONTACT_LUC: string;
    URL_GLOSSARY_LUC: string;
    URL_INSTRUCTIVE_LUC: string;
    URL_X_LUC: string;
    URL_INSTAGRAM_LUC: string;
    URL_FACEBOOK_LUC: string;
    URL_LINKEDIN_LUC: string;
    ID_GOOGLE_ANALYTICS: string;
    GOOGLE_DRIVE_API: string;
    GOOGLE_DRIVE_API_CLIENT_ID: string;
    GOOGLE_DRIVE_API_KEY: string;
    DROPBOX_APP_KEY: string;
    IS_PRODUCTION_ENV: string;
    EDITORHTML_TINY_KEY: string;
    APP_CONFIG: AppConfig;
  }
}

declare module '*.png';
declare module '*.svg';
declare module '*.jpeg';
declare module '*.jpg';
