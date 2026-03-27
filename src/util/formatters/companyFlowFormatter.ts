import {
    CompanyFlowSemesterData,
    CompanySemesterFlowView
} from "types/company/companyFlowData";
import {FlowSemesterDataFields, FlowSemesterViewFields} from "../../types/general/generalFinanceData";

export const CompanyFlowFormatter = {
    
    parseSemestersToFlow: (
        semesters: CompanySemesterFlowView[],
        addIndexEdit: boolean = false
    ) : CompanyFlowSemesterData[] => {
        let tempFlows: CompanyFlowSemesterData[] = [];
        if (semesters.length !== 0) {
            let editableFlows: CompanyFlowSemesterData[] = [];
            semesters.map((sem, idx) => {
                if (idx < 3) {
                    if (idx === 0) {
                        const auxFlows = [...sem[FlowSemesterViewFields.Flows]];
                        auxFlows.reverse().map((flow) => {
                            if (flow[FlowSemesterDataFields.AllowEdit]) {
                                editableFlows = [flow, ...editableFlows];
                            }
                        });
                        tempFlows = [...editableFlows, ...tempFlows];
                    } else if (idx === 2 && editableFlows.length !== 6) {
                        let lastFlows: CompanyFlowSemesterData[] = [];
                        const auxFlows = [...sem[FlowSemesterViewFields.Flows]];
                        auxFlows.reverse().map((flow, idx2) => {
                            if (
                                flow[FlowSemesterDataFields.AllowEdit] &&
                                idx2 < 6 - editableFlows.length
                            ) {
                                lastFlows = [flow, ...lastFlows];
                            }
                        });
                        tempFlows = [...lastFlows, ...tempFlows];
                    } else {
                        tempFlows = [
                            ...sem[FlowSemesterViewFields.Flows],
                            ...tempFlows,
                        ];
                    }
                } else {
                    return;
                }
            });
        }

        if (addIndexEdit)
            tempFlows = tempFlows.reverse().map((flow, index) => ({
                ...flow
            }));

        return [...tempFlows];
    }
}