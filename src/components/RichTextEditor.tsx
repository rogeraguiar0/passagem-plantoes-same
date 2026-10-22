import { useEffect } from "react"
import { EditorContent, useEditor, useEditorState } from "@tiptap/react"
import StarterKit from "@tiptap/starter-kit"
import { Placeholder } from "@tiptap/extensions"
import { Color, TextStyle } from "@tiptap/extension-text-style"
import { Bold, Italic, List, ListOrdered, Underline } from "lucide-react"
import { TEXT_COLORS } from "../utils/richText"
import type { RichTextEditorProps } from "../types"

const toolbarButton = (pressed: boolean) =>
  `cursor-pointer rounded p-1 ${pressed ? "bg-brand text-white" : "hover:bg-gray-100"}`

export function RichTextEditor({
  label, placeholder, value, onChange, className = "min-h-24 max-h-48",
}: RichTextEditorProps) {
  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: false, blockquote: false, codeBlock: false, code: false,
        horizontalRule: false, strike: false, link: false,
      }),
      TextStyle,
      Color,
      Placeholder.configure({ placeholder }),
    ],
    editorProps: {
      attributes: {
        role: "textbox",
        "aria-multiline": "true",
        "aria-label": label,
        class: `${className} overflow-y-auto px-2 py-1 outline-none caption-1 text-black`,
      },
      transformPastedHTML: (html) => html.replace(/\sstyle=(["']).*?\1/gi, ""),
    },
    onUpdate: ({ editor }) =>
      onChange(editor.getText().trim() === "" ? "" : editor.getHTML()),
  })

  useEffect(() => {
    if (editor && value === "" && !editor.isEmpty) editor.commands.clearContent()
  }, [editor, value])

  const active = useEditorState({
    editor,
    selector: ({ editor }) => ({
      bold: editor?.isActive("bold") ?? false,
      italic: editor?.isActive("italic") ?? false,
      underline: editor?.isActive("underline") ?? false,
      bulletList: editor?.isActive("bulletList") ?? false,
      orderedList: editor?.isActive("orderedList") ?? false,
      color: editor?.getAttributes("textStyle").color as string | undefined,
    }),
  })

  if (!editor) return null

  return (
    <div className="rich rounded-lg border bg-white">
      <div role="toolbar" aria-label="Formatação" className="flex items-center gap-1 border-b p-1">
        <button type="button" aria-label="Negrito" aria-pressed={active.bold}
          onClick={() => editor.chain().focus().toggleBold().run()} className={toolbarButton(active.bold)}>
          <Bold className="h-4 w-4" />
        </button>
        <button type="button" aria-label="Itálico" aria-pressed={active.italic}
          onClick={() => editor.chain().focus().toggleItalic().run()} className={toolbarButton(active.italic)}>
          <Italic className="h-4 w-4" />
        </button>
        <button type="button" aria-label="Sublinhado" aria-pressed={active.underline}
          onClick={() => editor.chain().focus().toggleUnderline().run()} className={toolbarButton(active.underline)}>
          <Underline className="h-4 w-4" />
        </button>
        <button type="button" aria-label="Lista com marcadores" aria-pressed={active.bulletList}
          onClick={() => editor.chain().focus().toggleBulletList().run()} className={toolbarButton(active.bulletList)}>
          <List className="h-4 w-4" />
        </button>
        <button type="button" aria-label="Lista numerada" aria-pressed={active.orderedList}
          onClick={() => editor.chain().focus().toggleOrderedList().run()} className={toolbarButton(active.orderedList)}>
          <ListOrdered className="h-4 w-4" />
        </button>

        <span aria-hidden="true" className="mx-1 h-4 w-px bg-gray-300" />

        {TEXT_COLORS.map((c) => {
          const selected = active.color === c.value
          return (
            <button key={c.value} type="button" aria-label={`Texto ${c.label}`} aria-pressed={selected}
              onClick={() =>
                selected
                  ? editor.chain().focus().unsetColor().run()
                  : editor.chain().focus().setColor(c.value).run()
              }
              className={toolbarButton(selected)}>
              <span className="block h-4 w-4 rounded-full border border-white" style={{ background: c.value }} />
            </button>
          )
        })}
      </div>

      <EditorContent editor={editor} />
    </div>
  )
}