import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

interface AgentMarkdownProps {
  content: string;
  isUser?: boolean;
}

export function AgentMarkdown({ content, isUser = false }: AgentMarkdownProps) {
  const linkClassName = isUser
    ? "text-white underline underline-offset-2"
    : "text-gray-900 underline underline-offset-2";

  return (
    <ReactMarkdown
      remarkPlugins={[remarkGfm]}
      components={{
        a: ({ children, ...props }) => (
          <a
            {...props}
            className={linkClassName}
            target="_blank"
            rel="noreferrer"
          >
            {children}
          </a>
        ),
        p: ({ children }) => (
          <p className="mb-2 last:mb-0 text-sm leading-relaxed">{children}</p>
        ),
        ul: ({ children }) => (
          <ul className="mb-2 ml-4 list-disc space-y-1 last:mb-0">
            {children}
          </ul>
        ),
        ol: ({ children }) => (
          <ol className="mb-2 ml-4 list-decimal space-y-1 last:mb-0">
            {children}
          </ol>
        ),
        li: ({ children }) => (
          <li className="text-sm leading-relaxed">{children}</li>
        ),
        code: ({ children, className }) => {
          const isBlock = className?.includes("language-");

          if (isBlock) {
            return (
              <code className={`block overflow-x-auto rounded-lg p-3 ${className}`}>
                {children}
              </code>
            );
          }

          return (
            <code
              className={`rounded px-1 py-0.5 text-xs ${
                isUser ? "bg-white/15 text-white" : "bg-gray-100 text-gray-900"
              }`}
            >
              {children}
            </code>
          );
        },
        pre: ({ children }) => (
          <pre
            className={`mb-2 overflow-x-auto rounded-lg p-3 text-xs last:mb-0 ${
              isUser ? "bg-white/15 text-white" : "bg-gray-100 text-gray-900"
            }`}
          >
            {children}
          </pre>
        ),
        blockquote: ({ children }) => (
          <blockquote
            className={`mb-2 border-l-2 pl-3 last:mb-0 ${
              isUser ? "border-white/40" : "border-gray-300"
            }`}
          >
            {children}
          </blockquote>
        ),
        table: ({ children }) => (
          <div className="mb-2 overflow-x-auto last:mb-0">
            <table className="min-w-full border-collapse text-xs">
              {children}
            </table>
          </div>
        ),
        th: ({ children }) => (
          <th className="border border-gray-200 px-2 py-1 text-left font-semibold">
            {children}
          </th>
        ),
        td: ({ children }) => (
          <td className="border border-gray-200 px-2 py-1">{children}</td>
        ),
      }}
    >
      {content}
    </ReactMarkdown>
  );
}
