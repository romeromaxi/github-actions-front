import { ConfigurationEconde } from '../configurations/configurationEncode';
import CryptoJS from 'crypto-js';

const routeEncoder: ConfigurationEconde = {
  key: 'KEYencodeLUCRouteABCDEFGHSAGIJKL',
  keyLength: 32,
  iv: 'IVencodeLUCRouteA',
  ivLength: 16,
};

export const CryptoJSHelper = {
  encrypt: (encoder: ConfigurationEconde, userString: string): string =>
    CryptoJS.AES.encrypt(
      userString,
      CryptoJS.enc.Utf8.parse(encoder.key.substring(0, encoder.keyLength)),
      {
        iv: CryptoJS.enc.Utf8.parse(encoder.iv.substring(0, encoder.ivLength)),
        mode: CryptoJS.mode.CBC,
        padding: CryptoJS.pad.Pkcs7,
      },
    ).toString(),

  decrypt: (encoder: ConfigurationEconde, userEncrypt: string): string =>
    CryptoJS.AES.decrypt(
      userEncrypt,
      CryptoJS.enc.Utf8.parse(encoder.key.substring(0, encoder.keyLength)),
      {
        iv: CryptoJS.enc.Utf8.parse(encoder.iv.substring(0, encoder.ivLength)),
        mode: CryptoJS.mode.CBC,
        padding: CryptoJS.pad.Pkcs7,
      },
    ).toString(CryptoJS.enc.Utf8),

  encryptRoute: (route: string): string => {
    const routeEncrypted = CryptoJSHelper.encrypt(routeEncoder, route);
    const base64 = CryptoJS.enc.Base64.parse(routeEncrypted);
    const base64Url = base64.toString(CryptoJS.enc.Hex);
    return base64Url.replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
  },

  decryptRoute: (routeEncrypt: string): string => {
    const base64 = routeEncrypt.replace(/-/g, '+').replace(/_/g, '/');
    const hex = CryptoJS.enc.Hex.parse(base64);
    const base64String = hex.toString(CryptoJS.enc.Base64);
    return CryptoJSHelper.decrypt(routeEncoder, base64String);
  },
};
