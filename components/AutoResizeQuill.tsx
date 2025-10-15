import { useEffect, useRef } from "react";
import ReactQuill from "react-quill-new";
import "react-quill-new/dist/quill.snow.css";

export default function AutoResizeQuill({
  value,
  onChange,
}: {
  value: string;
  onChange: (val: string) => void;
}) {
  const quillRef = useRef<any>(null);

  useEffect(() => {
    const editor = quillRef.current?.getEditor?.();
    if (!editor) return;

    const container = editor.root;

    const resize = () => {
      container.style.height = "auto";
      container.style.height = container.scrollHeight + "px";
    };

    // Adjust when text changes
    editor.on("text-change", resize);

    // Initial resize
    resize();

    return () => {
      editor.off("text-change", resize);
    };
  }, []);

  return (
    <ReactQuill
      ref={quillRef}
      theme="snow"
      value={value}
      onChange={onChange}
      className="custom-quill ql-editor border rounded-sm"
    />
  );
}
