import { useEffect, useState } from "react";
import { siteContent } from "@/content/siteContent";

function resolveCommand(input: string) {
  const normalizedInput = input.trim().toLowerCase();
  const aliasMap: Record<string, string> = {
    help: "帮助",
    contact: "联系",
    repo: "仓库",
    gitee: "仓库",
    github: "仓库",
    project: "项目",
    projects: "项目",
  };
  const command = aliasMap[normalizedInput] ?? input.trim();
  return siteContent.contact.commands.find((entry) => entry.command === command);
}

export function CommandTerminal() {
  const [input, setInput] = useState("");
  const [history, setHistory] = useState<string[]>(["> 启动完成", "> 输入“帮助”查看可用命令"]);

  useEffect(() => {
    const sequence = "帮助";
    let index = 0;
    const interval = window.setInterval(() => {
      setInput(sequence.slice(0, index + 1));
      index += 1;

      if (index === sequence.length) {
        window.clearInterval(interval);
        const command = resolveCommand(sequence);
        setHistory((current) => [
          ...current,
          `> ${sequence}`,
          ...(command?.response ?? ["未识别的命令。请输入“帮助”查看可用命令。"]),
        ]);
        setInput("");
      }
    }, 130);

    return () => {
      window.clearInterval(interval);
    };
  }, []);

  return (
    <div className="terminal-shell">
      <div className="terminal-header">
        <span className="terminal-dot" />
        <span className="terminal-dot" />
        <span className="terminal-dot" />
        <p>连接节点 / 交互终端</p>
        <span className="terminal-status">在线</span>
      </div>
      <div className="terminal-history" aria-live="polite" aria-atomic="false">
        {history.map((line, index) => (
          <p key={`${line}-${index}`}>{line}</p>
        ))}
      </div>
      <div className="terminal-footnote">支持命令：帮助 / 联系 / 仓库 / 项目</div>
      <form
        className="terminal-input-row"
        onSubmit={(event) => {
          event.preventDefault();
          if (!input.trim()) {
            return;
          }

          const command = resolveCommand(input);
          setHistory((current) => [
            ...current,
            `> ${input}`,
            ...(command?.response ?? ["未识别的命令。请输入“帮助”查看可用命令。"]),
          ]);
          setInput("");
        }}
      >
        <span>&gt;</span>
        <input
          value={input}
          onChange={(event) => setInput(event.target.value)}
          spellCheck={false}
          autoComplete="off"
          aria-label="命令行输入框"
          placeholder="输入：帮助"
        />
      </form>
    </div>
  );
}
