// Strip MDX/JSX/code so lesson text is readable prose (for RAG chunks + tutor context)
export function toPlain(md: string) {
  return md
    .replace(/```[\s\S]*?```/g, " ")
    .replace(/<[^>]+>/g, " ")
    .replace(/\{`[\s\S]*?`\}/g, " ")
    .replace(/[*_`>#|]/g, " ")
    .replace(/\[([^\]]+)\]\([^)]+\)/g, "$1")
    .replace(/\s+/g, " ")
    .trim();
}
