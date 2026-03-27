import { useSearchParams } from 'react-router-dom';
import { CryptoJSHelper } from 'util/helpers';

const useSearchParamsEncrypted = () => {
  const [searchParams] = useSearchParams();

  const get = (name: string): string | null => {
    const encryptedParam = searchParams.get(name);

    return encryptedParam
      ? CryptoJSHelper.decryptRoute(encryptedParam)
      : encryptedParam;
  };

  return [{ get }];
};

export default useSearchParamsEncrypted;
