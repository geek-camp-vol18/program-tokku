"use client";

import ReactMarkdown from "react-markdown";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { vscDarkPlus } from "react-syntax-highlighter/dist/esm/styles/prism";

export function MarkdownPreview({ content }: { content: string }) {
  return (
    <div className="prose prose-sm max-w-none dark:prose-invert">
      <ReactMarkdown
        components={{
          code({ node, inline, className, children, ...props }: any) {
            const match = /language-(\w+)/.exec(className || "");
            const codeString = String(children).replace(/\n$/, "");

            // インラインコードでない場合はシンタックスハイライトを適用
            // 言語指定がない場合はplaintextとして表示
            if (!inline) {
              return (
                <SyntaxHighlighter
                  style={vscDarkPlus}
                  language={match ? match[1] : "plaintext"}
                  PreTag="div"
                  {...props}
                >
                  {codeString}
                </SyntaxHighlighter>
              );
            }

            // インラインコード
            return (
              <code className="bg-muted px-1.5 py-0.5 rounded text-sm font-mono" {...props}>
                {children}
              </code>
            );
          },
          // リンクのカスタムレンダリング（添付ファイル対応）
          a({ href, children, ...props }: any) {
            return (
              <a
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary hover:underline"
                {...props}
              >
                {children}
              </a>
            );
          },
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
}