import { LoaderBlockUI } from 'components/loader';
import { useTypedSelector } from '../../hooks/useTypedSelector';
function LoaderManager() {
  const { isLoading, message } = useTypedSelector((state) => state.loading);

  return <>{isLoading && <LoaderBlockUI message={message} />}</>;
}

export default LoaderManager;
