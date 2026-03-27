import {UseFormSetValue} from "react-hook-form";
import {forwardRef, useRef} from "react";
import { Editor } from '@tinymce/tinymce-react';

interface EditorHtmlNewProps {
    name: string,
    setValue: UseFormSetValue<any>,
    initialValue?: string,
    height?: number,
    readOnly?: boolean,
    hideToolbar?: boolean,
    contentStyles?: string
}


const EditorHtmlNew = forwardRef((props: EditorHtmlNewProps, ref) => {
    const editorRef = useRef(null);
    
    return (
        <Editor
            apiKey={window.EDITORHTML_TINY_KEY}
            // @ts-ignore
            onInit={(evt, editor) => editorRef.current = editor}
            initialValue={props.initialValue ?? ""}
            onEditorChange={(a) => props.setValue(props.name, a)}
            disabled={props.readOnly ?? false}
            init={{
                height: props.height ?? 500,
                menubar: false,
                images_upload_handler: (blobInfo) => {
                  const base64str =
                    "data:" +
                    blobInfo.blob().type +
                    ";base64," +
                    blobInfo.base64();
                  return Promise.resolve(base64str);
                },
                plugins: [
                    'advlist', 'autolink', 'lists', 'link', 'image', 'charmap', 'preview',
                    'anchor', 'searchreplace', 'visualblocks', 'code', 'fullscreen',
                    'insertdatetime', 'media', 'table', 'code', 'help', 'wordcount'
                ],
                toolbar: !props.hideToolbar && 'undo redo | blocks | ' +
                    'bold italic underline forecolor | alignleft aligncenter ' +
                    'alignright alignjustify | bullist numlist outdent indent | ' +
                    'removeformat | image',
                content_css: 'https://fonts.googleapis.com/css2?family=Montserrat:wght@400;700&display=swap',
                font_formats: 'Montserrat=Montserrat, sans-serif; Arial=Arial, sans-serif; Courier New=Courier New, Courier, monospace;',
                content_style: props.contentStyles ?? ''
            }}
        />
    );
});


export default EditorHtmlNew