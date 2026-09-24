import { createElement, type ComponentType } from "react";
import type { QChatHostView } from "../interfaces/react.interfaces";

/** Bind a host component to host-validated data; no model output is involved. */
export function createQChatHostView<T>(
  component: ComponentType<{ readonly data: T }>,
  data: unknown,
  validator: { parse(value: unknown): T },
): QChatHostView {
  const validated = validator.parse(data);
  return { render: () => createElement(component, { data: validated }) };
}
