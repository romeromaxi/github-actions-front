import {forwardRef, useEffect, useImperativeHandle, useRef, useState} from 'react'; //add
import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css';

import { Editor } from 'react-draft-wysiwyg';
import { editorHtmlFormatter } from 'util/formatters/editorHtmlFormatter';
import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css';
import { convertToRaw } from 'draft-js';
import draftToHtml from 'draftjs-to-html';
import {UseFormSetValue} from 'react-hook-form';

interface EditorHtmlProps {
  name: string;
  textHtml: string;
  setValue: UseFormSetValue<any>;
  disabled?: boolean;
}

export const EditorHtml = forwardRef((props: EditorHtmlProps, ref) => {
  const isFirstUpdate = useRef(true);
  const [editorState, setEditorState] = useState(
    editorHtmlFormatter.getInitialStateWithText(props.textHtml),
  );

  useImperativeHandle(ref, () => ({
    getHtmlText: () =>
      draftToHtml(convertToRaw(editorState.getCurrentContent())),
  }));

  useEffect(() => {
    if (editorState) {
      let shouldDirty = true;  
      if (isFirstUpdate.current) {
        isFirstUpdate.current = false;
        shouldDirty = false;
      }
        
      props.setValue(
        props.name,
        draftToHtml(convertToRaw(editorState.getCurrentContent())),
          { shouldDirty: shouldDirty }
      );
    }
  }, [editorState]);

  return (
    <Editor
      editorState={editorState}
      editorClassName="editor-html-input editor-html-height"
      toolbarClassName="editor-html-toolbar"
      editorStyle={{
        backgroundColor: 'white',
        lineHeight: '150%',
        paddingLeft: '30px',
        minHeight: '150px',
        border: '1px solid #F1F1F1',
      }}
      onEditorStateChange={setEditorState}
      stripPastedStyles={true}
      toolbar={{
        inline: {
          options: ['bold', 'italic', 'underline', 'strikethrough'],
        },
        options: [
          'inline',
          'blockType',
          'fontSize',
          'list',
          'textAlign',
          'history',
        ],
      }}
      readOnly={props.disabled}
    />
  );
});
