import { useMemo } from "react"
import DOMPurify from "dompurify"
import { TEXT_COLORS } from "../utils/richText"

const ALLOWED_COLORS = new Set(TEXT_COLORS.map((c) => `color: ${c.value}`))

DOMPurify.addHook("uponSanitizeAttribute", (_node, data) => {
  if (data.attrName === "style" && !ALLOWED_COLORS.has(data.attrValue.trim().replace(/;$/, ""))) {
    data.keepAttr = false
  }
})

const ALLOWED_TAGS = ["p", "br", "strong", "em", "u", "ul", "ol", "li", "span"]

export function RichText({ html, className = "" }: { html: string; className?: string }) {
  const clean = useMemo(
    () => DOMPurify.sanitize(html, { ALLOWED_TAGS, ALLOWED_ATTR: ["style"] }),
    [html]
  )

  return (
    <div
      className={`rich whitespace-pre-wrap ${className}`}
      dangerouslySetInnerHTML={{ __html: clean }}
    />
  )
}