import { test, expect, afterEach } from "vitest";
import { render, screen, cleanup } from "@testing-library/react";
import { ToolCallBadge, getToolCallLabel } from "../ToolCallBadge";

afterEach(() => {
  cleanup();
});

// --- getToolCallLabel unit tests ---

test("str_replace_editor create", () => {
  expect(getToolCallLabel("str_replace_editor", { command: "create", path: "/App.jsx" })).toBe("Creating /App.jsx");
});

test("str_replace_editor str_replace", () => {
  expect(getToolCallLabel("str_replace_editor", { command: "str_replace", path: "/App.jsx" })).toBe("Editing /App.jsx");
});

test("str_replace_editor insert", () => {
  expect(getToolCallLabel("str_replace_editor", { command: "insert", path: "/components/Button.jsx" })).toBe("Editing /components/Button.jsx");
});

test("str_replace_editor view", () => {
  expect(getToolCallLabel("str_replace_editor", { command: "view", path: "/App.jsx" })).toBe("Viewing /App.jsx");
});

test("str_replace_editor undo_edit", () => {
  expect(getToolCallLabel("str_replace_editor", { command: "undo_edit", path: "/App.jsx" })).toBe("Undoing edit in /App.jsx");
});

test("file_manager rename", () => {
  expect(getToolCallLabel("file_manager", { command: "rename", path: "/old.jsx", new_path: "/new.jsx" })).toBe("Renaming /old.jsx → /new.jsx");
});

test("file_manager delete", () => {
  expect(getToolCallLabel("file_manager", { command: "delete", path: "/App.jsx" })).toBe("Deleting /App.jsx");
});

test("unknown tool returns toolName", () => {
  expect(getToolCallLabel("some_unknown_tool", {})).toBe("some_unknown_tool");
});

// --- ToolCallBadge rendering tests ---

test("shows spinner when state is call", () => {
  render(
    <ToolCallBadge
      toolInvocation={{ state: "call", toolCallId: "1", toolName: "str_replace_editor", args: { command: "create", path: "/App.jsx" } }}
    />
  );
  expect(screen.getByTestId("spinner")).toBeDefined();
  expect(screen.queryByTestId("done-indicator")).toBeNull();
  expect(screen.getByText("Creating /App.jsx")).toBeDefined();
});

test("shows spinner when state is partial-call", () => {
  render(
    <ToolCallBadge
      toolInvocation={{ state: "partial-call", toolCallId: "1", toolName: "str_replace_editor", args: { command: "str_replace", path: "/App.jsx" } }}
    />
  );
  expect(screen.getByTestId("spinner")).toBeDefined();
  expect(screen.queryByTestId("done-indicator")).toBeNull();
});

test("shows green dot when state is result", () => {
  render(
    <ToolCallBadge
      toolInvocation={{ state: "result", toolCallId: "1", toolName: "str_replace_editor", args: { command: "create", path: "/App.jsx" }, result: "File created" }}
    />
  );
  expect(screen.getByTestId("done-indicator")).toBeDefined();
  expect(screen.queryByTestId("spinner")).toBeNull();
  expect(screen.getByText("Creating /App.jsx")).toBeDefined();
});

test("shows label for file_manager delete", () => {
  render(
    <ToolCallBadge
      toolInvocation={{ state: "result", toolCallId: "2", toolName: "file_manager", args: { command: "delete", path: "/old.jsx" }, result: { success: true, message: "Deleted" } }}
    />
  );
  expect(screen.getByText("Deleting /old.jsx")).toBeDefined();
});

test("shows raw toolName for unknown tool", () => {
  render(
    <ToolCallBadge
      toolInvocation={{ state: "call", toolCallId: "3", toolName: "mystery_tool", args: {} }}
    />
  );
  expect(screen.getByText("mystery_tool")).toBeDefined();
});
