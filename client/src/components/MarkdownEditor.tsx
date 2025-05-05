import React from "react";
import ReactMarkdown from "react-markdown";

interface MarkdownEditorProps {
  value: string;
  onChange: (value: string) => void;
  preview?: boolean;
}

export const MarkdownEditor: React.FC<MarkdownEditorProps> = ({
  value,
  onChange,
  preview = false,
}) => {
  if (preview) {
    return (
      <div className="prose max-w-none">
        <ReactMarkdown>{value}</ReactMarkdown>
      </div>
    );
  }

  return (
    <div className="border rounded-md overflow-hidden">
      <div className="bg-gray-100 px-4 py-2 border-b">
        <span className="text-sm font-medium">Markdown Editor</span>
      </div>
      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full p-4 min-h-[200px]"
        placeholder="Write your recipe using Markdown..."
      />
      <div className="border-t p-4">
        <div className="font-medium text-sm mb-2">Preview:</div>
        <div className="prose max-w-none">
          <ReactMarkdown>{value}</ReactMarkdown>
        </div>
      </div>
    </div>
  );
};
