"use client";
import { createContext } from "react";
import type { StoreApi } from "zustand/vanilla";
import type { QChatConfig, QChatStoreState } from "../interfaces/react.interfaces";

// Keep context identity separate from provider and hook implementation during dev reloads.
export const QChatStoreContext = createContext<StoreApi<QChatStoreState> | null>(null);
export const QChatConfigContext = createContext<QChatConfig>({});
