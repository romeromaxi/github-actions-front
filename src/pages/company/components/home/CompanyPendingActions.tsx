import { HttpPendingActions } from '../../../../http/pendingActions/httpPendingActions';
import { useTypedSelector } from '../../../../hooks/useTypedSelector';
import {PendingActionsList} from "../../../../components/misc/PendingActionsList";

const CompanyPendingActions: React.FC = () => {
  const companyId = useTypedSelector(state => state.profile.companyId);

  return (
    <PendingActionsList
      fetchActions={() => HttpPendingActions.getPendingActions(companyId!)}
      title="Acciones pendientes"
      emptyMessage="No tenés acciones pendientes en esta PyME"
      showCompanyInfo={false}
      variant="card"
      actionVariant="box"
      maxVisibleItems={3}
      titleVariant="h5"
    />
  );
};

export default CompanyPendingActions;