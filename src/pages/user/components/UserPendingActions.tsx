import { HttpPendingActions } from "../../../http/pendingActions/httpPendingActions";
import {PendingActionsList} from "../../../components/misc/PendingActionsList";

const UserPendingActions = () => {
    return (
        <PendingActionsList
            fetchActions={() => HttpPendingActions.getPendingActions()}
            title="Acciones pendientes"
            showCompanyInfo={true}
            variant="standalone"
            actionVariant="card"
            maxVisibleItems={5}
            titleVariant="h4"
        />
    );
};

export default UserPendingActions;
