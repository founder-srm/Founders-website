import { NodeViewContent, NodeViewWrapper } from '@tiptap/react'
import type { NodeViewProps } from '@tiptap/core'
import React from 'react'

export default function CodeBlockComponent(props: NodeViewProps) {
  const { node, updateAttributes, extension } = props;
  const language = node.attrs.language || 'auto';

  return (
    <NodeViewWrapper className="code-block">
      <select
        contentEditable={false}
        defaultValue={language}
        onChange={event => updateAttributes({ language: event.target.value })}
        className="absolute top-2 right-2 bg-white border border-gray-300 rounded px-2 py-1 text-sm"
      >
        <option value="null">auto</option>
        <option disabled>—</option>
        {extension.options.lowlight.listLanguages().map((lang: string, index: number) => (
          <option key={index} value={lang}>
            {lang}
          </option>
        ))}
      </select>
      <pre className="bg-gray-100 p-4 rounded-md overflow-x-auto">
        <NodeViewContent as="div" />
      </pre>
    </NodeViewWrapper>
  )
}
