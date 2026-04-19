import { useCallback, useEffect, useRef, useState } from "react";
import { useAppRouter } from "@/app/AppRouter";
import { siteContent } from "@/content/siteContent";
import type { ContactCommand, ContactCommandAction } from "@/types/content";

type TerminalLineTone = "default" | "input" | "feedback" | "error";

type TerminalHistoryItem =
  | {
      id: string;
      type: "line";
      tone: TerminalLineTone;
      content: string;
    }
  | {
      id: string;
      type: "actions";
      actions: ContactCommandAction[];
    };

function resolveCommand(input: string) {
  const normalizedInput = input.trim().toLowerCase();
  const aliasMap: Record<string, string> = {
    help: "帮助",
    contact: "联系",
    mail: "联系",
    email: "联系",
    repo: "仓库",
    gitee: "仓库",
    github: "仓库",
    project: "项目",
    projects: "项目",
  };
  const command = aliasMap[normalizedInput] ?? input.trim();
  return siteContent.contact.commands.find((entry) => entry.command === command);
}

function useHistoryFactory() {
  const idRef = useRef(0);

  const createLine = useCallback(
    (content: string, tone: TerminalLineTone = "default"): TerminalHistoryItem => {
      idRef.current += 1;
      return {
        id: `line-${idRef.current}`,
        type: "line",
        tone,
        content,
      };
    },
    [],
  );

  const createActionGroup = useCallback(
    (actions: ContactCommandAction[]): TerminalHistoryItem => {
      idRef.current += 1;
      return {
        id: `actions-${idRef.current}`,
        type: "actions",
        actions,
      };
    },
    [],
  );

  return { createLine, createActionGroup };
}

async function copyToClipboard(value: string) {
  if (navigator.clipboard?.writeText) {
    await navigator.clipboard.writeText(value);
    return;
  }

  const input = document.createElement("textarea");
  input.value = value;
  input.setAttribute("readonly", "true");
  input.style.position = "absolute";
  input.style.left = "-9999px";
  document.body.appendChild(input);
  input.select();

  const copied = document.execCommand("copy");
  document.body.removeChild(input);

  if (!copied) {
    throw new Error("copy failed");
  }
}

export function CommandTerminal() {
  const { navigate } = useAppRouter();
  const { createLine, createActionGroup } = useHistoryFactory();
  const historyContainerRef = useRef<HTMLDivElement | null>(null);
  const [input, setInput] = useState("");
  const [history, setHistory] = useState<TerminalHistoryItem[]>(() => [
    createLine("> 启动完成", "feedback"),
    createLine("> 输入“帮助”查看可用命令", "default"),
  ]);

  const appendCommandOutput = useCallback(
    (command: ContactCommand | undefined, rawInput: string) => {
      const trimmedInput = rawInput.trim();

      if (!trimmedInput) {
        return;
      }

      setHistory((current) => {
        const nextHistory: TerminalHistoryItem[] = [
          ...current,
          createLine(`> ${trimmedInput}`, "input"),
        ];

        if (!command) {
          nextHistory.push(
            createLine("未识别的命令。请输入“帮助”查看可用命令。", "error"),
          );
          return nextHistory;
        }

        command.response.forEach((line) => {
          nextHistory.push(createLine(line, "default"));
        });

        if (command.actions?.length) {
          nextHistory.push(createActionGroup(command.actions));
        }

        return nextHistory;
      });
    },
    [createActionGroup, createLine],
  );

  const runCommand = useCallback(
    (rawInput: string) => {
      const trimmedInput = rawInput.trim();

      if (!trimmedInput) {
        return;
      }

      appendCommandOutput(resolveCommand(trimmedInput), trimmedInput);
    },
    [appendCommandOutput],
  );

  const appendFeedback = useCallback(
    (content: string, tone: TerminalLineTone) => {
      setHistory((current) => [...current, createLine(content, tone)]);
    },
    [createLine],
  );

  const handleAction = useCallback(
    async (action: ContactCommandAction) => {
      if (action.copyValue) {
        try {
          await copyToClipboard(action.copyValue);
          appendFeedback(`已复制：${action.copyValue}`, "feedback");
        } catch {
          appendFeedback("复制失败，请手动复制当前内容。", "error");
        }
      }

      if (action.to) {
        navigate(action.to);
        appendFeedback(`正在跳转：${action.value}`, "feedback");
        return;
      }

      if (action.href) {
        window.open(action.href, "_blank", "noopener,noreferrer");
        appendFeedback(`已打开：${action.value}`, "feedback");
      }
    },
    [appendFeedback, navigate],
  );

  useEffect(() => {
    const sequence = "帮助";
    let index = 0;
    const interval = window.setInterval(() => {
      setInput(sequence.slice(0, index + 1));
      index += 1;

      if (index === sequence.length) {
        window.clearInterval(interval);
        runCommand(sequence);
        setInput("");
      }
    }, 130);

    return () => {
      window.clearInterval(interval);
    };
  }, [runCommand]);

  useEffect(() => {
    const container = historyContainerRef.current;

    if (!container) {
      return;
    }

    container.scrollTo({
      top: container.scrollHeight,
      behavior: "smooth",
    });
  }, [history]);

  return (
    <div className="terminal-shell">
      <div className="terminal-header">
        <span className="terminal-dot" />
        <span className="terminal-dot" />
        <span className="terminal-dot" />
        <p>连接节点 / 交互终端</p>
        <span className="terminal-status">在线</span>
      </div>
      <div
        ref={historyContainerRef}
        className="terminal-history"
        aria-live="polite"
        aria-atomic="false"
      >
        {history.map((item) =>
          item.type === "line" ? (
            <p
              key={item.id}
              className={`terminal-line terminal-line-${item.tone}`}
            >
              {item.content}
            </p>
          ) : (
            <div key={item.id} className="terminal-action-group">
              {item.actions.map((action) => (
                <button
                  key={action.id}
                  type="button"
                  className="terminal-action-button"
                  onClick={() => {
                    void handleAction(action);
                  }}
                >
                  <span className="terminal-action-label">{action.label}</span>
                  <strong className="terminal-action-value">{action.value}</strong>
                </button>
              ))}
            </div>
          ),
        )}
      </div>
      <div className="terminal-footnote">
        支持命令：帮助 / 联系 / 仓库 / 项目
      </div>
      <div className="terminal-shortcuts" aria-label="快捷命令">
        {siteContent.contact.commands.map((entry) => (
          <button
            key={entry.command}
            type="button"
            onClick={() => runCommand(entry.command)}
          >
            {entry.command}
          </button>
        ))}
      </div>
      <form
        className="terminal-input-row"
        onSubmit={(event) => {
          event.preventDefault();
          runCommand(input);
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
