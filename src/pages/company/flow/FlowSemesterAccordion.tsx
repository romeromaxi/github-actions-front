import React from "react";
import {Accordion, AccordionDetails, AccordionSummary, Card, Stack, Typography} from "@mui/material";
import SemesterFlowCard from "./SemesterFlowCard";
import {FlowInsertRequest, FlowSemesterView, FlowSemesterViewFields} from "../../../types/general/generalFinanceData";
import {ChevronDownIcon} from "lucide-react";


interface FlowSemesterAccordionProps {
    semesters: FlowSemesterView[],
    triggerEditing: (semester?: FlowSemesterView) => void,
    editingSemester?: FlowSemesterView,
    onSubmit: (data: FlowInsertRequest) => void,
    year: string
}


const FlowSemesterAccordion = ({semesters, triggerEditing, editingSemester, onSubmit, year}: FlowSemesterAccordionProps) => {

    return (
        <Card variant={'accordionCompanyData'}>
            <Accordion variant={'companyData'}
                       defaultExpanded={semesters.some(x => !x[FlowSemesterViewFields.AllowDelete])}
            >
                <AccordionSummary expandIcon={<ChevronDownIcon size={26} strokeWidth={'2px'} color={'black'} />}>
                    <Typography variant={'h5'} fontWeight={500}>{`Año ${year}`}</Typography>
                </AccordionSummary>
                <AccordionDetails>
                    <Stack spacing={2}>
                        <Stack spacing={3}>
                            {semesters.map((sem, idx) => (
                                <SemesterFlowCard
                                    semester={sem}
                                    triggerEditing={triggerEditing}
                                    editing={editingSemester === sem}
                                    onSubmitEdit={onSubmit}
                                    key={`semesterFlow${idx}`}
                                />
                            ))}
                        </Stack>
                    </Stack>
                </AccordionDetails>
            </Accordion>
        </Card>
    )
}


export default FlowSemesterAccordion