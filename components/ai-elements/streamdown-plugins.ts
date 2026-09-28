"use client";
import { useEffect, useMemo, useState } from "react";
import type { ComponentProps } from "react";
import { cjk } from "@streamdown/cjk";
import { Streamdown } from "streamdown";

type StreamdownPlugins = ComponentProps<typeof Streamdown>["plugins"];

/**
 * Loads heavy Streamdown plugins on demand. Plain-text messages only ever pay
 * for the tiny CJK plugin; code/math/mermaid engines split into separate
 * chunks that load when the content actually contains those markers.
 */
export function useGatedStreamdownPlugins(content: unknown): StreamdownPlugins {
  const text = typeof content === "string" ? content : "";
  const [extras, setExtras] = useState<Record<string, unknown>>({});

  useEffect(() => {
    let cancelled = false;
    const loaders: Promise<Record<string, unknown>>[] = [];
    if (text.includes("```")) loaders.push(import("@streamdown/code").then((module) => ({ code: module.code })));
    if (text.includes("$$") || text.includes("\\(") || text.includes("\\[")) loaders.push(import("@streamdown/math").then((module) => ({ math: module.math })));
    if (text.includes("```mermaid")) loaders.push(import("@streamdown/mermaid").then((module) => ({ mermaid: module.mermaid })));
    if (loaders.length === 0) return;
    void Promise.all(loaders).then((parts) => {
      if (!cancelled) setExtras(Object.assign({}, ...parts));
    });
    return () => {
      cancelled = true;
    };
  }, [text]);

  return useMemo(() => ({ cjk, ...extras }) as StreamdownPlugins, [extras]);
}
