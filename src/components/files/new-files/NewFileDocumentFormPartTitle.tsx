import React from "react";
import {TypographyBase} from "components/misc/TypographyBase";

interface NewFileDocumentFormPartTitleProps {
    step: number,
    label: string
}

function NewFileDocumentFormPartTitle({step, label}: NewFileDocumentFormPartTitleProps) {
    return (
        <TypographyBase fontWeight={500}>
            {`${step}. ${label}`}
        </TypographyBase>
    )
}

export default NewFileDocumentFormPartTitle;