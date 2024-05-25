import '@wangeditor/editor/dist/css/style.css'; // 引入 css

import React, { useState, useEffect } from 'react';
import { Editor, Toolbar } from '@wangeditor/editor-for-react';
import { DomEditor, IDomEditor, IEditorConfig, IToolbarConfig } from '@wangeditor/editor';
type RichEditorProps = {
  // 工具栏配置
  toolbarConfig?: Partial<IToolbarConfig>;
  // 编辑器配置
  editorConfig?: Partial<IEditorConfig>;
  defaultHtml?: string;
  onChange?: (newHtml: string) => void;
  disabled?: boolean;
  style?: React.CSSProperties;
  placeholder?: string;
  width?: string | number;
};

function RichEditor({
  placeholder = '请输入内容',
  defaultHtml = '',
  editorConfig,
  toolbarConfig,
  disabled,
  onChange,
  width,
  style,
}: RichEditorProps) {
  // editor 实例
  const [editor, setEditor] = useState<IDomEditor | null>(null); // TS 语法

  // 编辑器内容
  const [html, setHtml] = useState<string>('');

  // 及时销毁 editor ，重要！
  useEffect(() => {
    return () => {
      if (editor === null) return;
      editor.destroy();
      setEditor(null);
    };
  }, [editor]);

  /*useEffect(() => {
    if (!!editor) {
      const toolbar = DomEditor.getToolbar(editor);
      const curConfig = toolbar?.getConfig();
      console.log(curConfig?.toolbarKeys, '====');
    }
  }, [editor, DomEditor]);*/

  return (
    <>
      <div style={{ border: '1px solid #ccc', zIndex: 100, width: width || '100%' }}>
        <Toolbar
          editor={editor}
          defaultConfig={{
            excludeKeys: ['group-video', 'group-image', 'todo', 'fullScreen'],
            ...toolbarConfig,
          }}
          mode="default"
          style={{ borderBottom: '1px solid #ccc' }}
        />
        <Editor
          defaultConfig={{ ...editorConfig, placeholder }}
          defaultHtml={defaultHtml}
          value={html}
          onCreated={(editor) => {
            setEditor(editor);
            disabled ? editor?.disable() : editor?.enable();
          }}
          onChange={(editor) => {
            setHtml(editor.getHtml());
            onChange?.(editor.getHtml());
          }}
          mode="default"
          style={{ minHeight: '500px', height: 'auto', overflowY: 'hidden', ...style }}
        />
      </div>
    </>
  );
}

export default RichEditor;
