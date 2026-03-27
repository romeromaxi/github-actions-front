export interface ConfigurationEconde {
  key: string;
  keyLength: number;
  iv: string;
  ivLength: number;
}

class ConfigurationEncoder {
  public async getConfiguration() {
    let response = await fetch(process.env.PUBLIC_URL + '/manifest.json');
    let dataJson = await response.json();

    return dataJson.configurationEncode;
  }
}

export const configurationEncoder = new ConfigurationEncoder();
