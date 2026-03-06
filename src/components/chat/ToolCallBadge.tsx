import { Loader2 } from "lucide-react";
import type { ToolInvocation } from "ai";

export function getToolCallLabel(toolName: string, args: Record<string, any>): string {
  if (toolName === "str_replace_editor") {
    const { command, path } = args;
    switch (command) {
      case "create":     return `Creating ${path}`;
      case "str_replace": return `Editing ${path}`;
      case "insert":     return `Editing ${path}`;
      case "view":       return `Viewing ${path}`;
      case "undo_edit":  return `Undoing edit in ${path}`;
    }
  }

  if (toolName === "file_manager") {
    const { command, path, new_path } = args;
    switch (command) {
      case "rename": return `Renaming ${path} → ${new_path}`;
      case "delete": return `Deleting ${path}`;
    }
  }

  return toolName;
}

interface ToolCallBadgeProps {
  toolInvocation: ToolInvocation;
}

export function ToolCallBadge({ toolInvocation }: ToolCallBadgeProps) {
  const { toolName, args, state } = toolInvocation;
  const label = getToolCallLabel(toolName, args);
  const isDone = state === "result";

  return (
    <div className="inline-flex items-center gap-2 mt-2 px-3 py-1.5 bg-neutral-50 rounded-lg text-xs font-mono border border-neutral-200">
      {isDone ? (
        <div className="w-2 h-2 rounded-full bg-emerald-500" data-testid="done-indicator" />
      ) : (
        <Loader2 className="w-3 h-3 animate-spin text-blue-600" data-testid="spinner" />
      )}
      <span className="text-neutral-700">{label}</span>
    </div>
  );
}
