import { ContentState, EditorState } from 'draft-js';
import htmlToDraft from 'html-to-draftjs';

const regexInvalidFormat: RegExp = /\{\<.+\>[^\<][\w\u0590-\u05ff]+\<\/.+\>\}/g;
const regexHref: RegExp = /<a(.*?)>/g;

export const editorHtmlFormatter = {
  getInitialStateWithText: (text: string): EditorState => {
    if (!text) return EditorState.createEmpty();

    let blocksFromHTML = htmlToDraft(text);

    return EditorState.createWithContent(
      ContentState.createFromBlockArray(blocksFromHTML.contentBlocks),
    );
  },
  
  getTitleAndStylesHtmlDoc: (docTypeHtml: string | undefined) => {
    const parser = new DOMParser();
    const doc = parser.parseFromString(docTypeHtml ?? '', "text/html");

    const title = (doc.querySelector("title")?.textContent || "").trim();
    const styles = Array.from(doc.querySelectorAll("style"))
        .map(style => style.outerHTML)
        .join("\n");
    
    return { title, styles };
  },

  getFullDocTypeHtmlMail: (title: string, styles: string, body: string) => {
    const finalStyles = styles.replace('<style>', '').replace('</style>', '');
    
    return (
      `<!DOCTYPE html>
        <html lang="en" xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:v="urn:schemas-microsoft-com:vml">
        <head>
            <meta charset="utf-8"/>
            <meta name="x-apple-disable-message-reformatting"/>
            <meta content="ie=edge" http-equiv="x-ua-compatible"/>
            <meta content="width=device-width, initial-scale=1" name="viewport"/>
            <meta content="telephone=no, date=no, address=no, email=no" name="format-detection"/>
            <link href="https://fonts.googleapis.com/css?family=Montserrat:ital,wght@0,200;0,300;0,400;0,500;0,600;0,700;0,800;0,900;1,200;1,300;1,400;1,500;1,600;1,700" media="screen" rel="stylesheet"/>
            <title>
                ${title}
            </title>
            <style>
                ${finalStyles}
            </style>
        </head>
        <body>
            ${body}
        </body>
        </html>`
    );
  },

  getWithValidStyles: (text: string): string => {
    let textFinal: string = text;
    let matchArr: RegExpExecArray | null, start: number;

    while ((matchArr = regexInvalidFormat.exec(textFinal)) !== null) {
      start = matchArr.index;
      let auxText: string = matchArr[0].replace('{', '');
      auxText = auxText.replaceAll('><', 'REEEMPLAZAR');
      auxText = auxText.replace('>', '>{');
      auxText = auxText.replace('>}', '>');
      auxText = auxText.replace('</', '}</');
      auxText = auxText.replaceAll('REEEMPLAZAR', '><');

      let htmlLength = textFinal.length;
      textFinal =
        textFinal.substring(0, start) +
        auxText +
        textFinal.substring(start + matchArr[0].length, htmlLength);
    }

    while ((matchArr = regexHref.exec(textFinal)) !== null) {
      start = matchArr.index;

      let htmlLength = textFinal.length;
      textFinal =
        textFinal.substring(0, start) +
        textFinal.substring(start + matchArr[0].length, htmlLength);
    }

    textFinal = textFinal.replaceAll('</a>', '');

    return textFinal;
  },
};
