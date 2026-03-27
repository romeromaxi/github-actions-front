import React from "react";

interface TextInnerHtmlProps {
    html?: string
}

function TextInnerHtml({ html }: TextInnerHtmlProps) {
    const completeDescription =
        !!html && html !== '<p></p>' && html !== '<p></p>\n';
    
    return (
        completeDescription ?
            <div className={"content-dangerous-html"} dangerouslySetInnerHTML={{ __html: html }} />
            :
            <div style={{ fontStyle: 'italic' }}>Sin información.</div>
    )
}

export {
    TextInnerHtml
};