"use client";

import {
  createContext,
  type ReactNode,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";

export type EditorSurface = {
  id: string;
  title: string;
  group?: string;
  renderPanel: () => ReactNode;
};

type EditorContextValue = {
  isOpen: boolean;
  setIsOpen: (value: boolean) => void;
  surfaces: EditorSurface[];
  selectedSurfaceId: string | null;
  setSelectedSurfaceId: (id: string) => void;
  registerSurface: (surface: EditorSurface) => () => void;
};

const EDITOR_OPEN_STORAGE_KEY = "portfolio-editor:v1:open";
const EDITOR_SELECTED_STORAGE_KEY = "portfolio-editor:v1:selected-surface";

const EditorContext = createContext<EditorContextValue | null>(null);

function readStoredBoolean(key: string, fallback: boolean): boolean {
  if (typeof window === "undefined") return fallback;
  return window.localStorage.getItem(key) === "true";
}

function readStoredString(key: string): string | null {
  if (typeof window === "undefined") return null;
  return window.localStorage.getItem(key);
}

export function EditorProvider({ children }: { children: ReactNode }) {
  const [isOpen, setIsOpenState] = useState(() =>
    readStoredBoolean(EDITOR_OPEN_STORAGE_KEY, false),
  );
  const [selectedSurfaceId, setSelectedSurfaceIdState] = useState<string | null>(
    () => readStoredString(EDITOR_SELECTED_STORAGE_KEY),
  );
  const [surfaces, setSurfaces] = useState<EditorSurface[]>([]);

  const setIsOpen = useCallback((value: boolean) => {
    setIsOpenState(value);
  }, []);

  const setSelectedSurfaceId = useCallback((id: string) => {
    setSelectedSurfaceIdState(id);
  }, []);

  const registerSurface = useCallback((surface: EditorSurface) => {
    setSurfaces((current) => {
      const next = current.filter((item) => item.id !== surface.id);
      next.push(surface);
      return next.sort((left, right) => left.title.localeCompare(right.title));
    });

    return () => {
      setSurfaces((current) => current.filter((item) => item.id !== surface.id));
    };
  }, []);

  useEffect(() => {
    window.localStorage.setItem(EDITOR_OPEN_STORAGE_KEY, String(isOpen));
  }, [isOpen]);

  useEffect(() => {
    if (selectedSurfaceId) {
      window.localStorage.setItem(EDITOR_SELECTED_STORAGE_KEY, selectedSurfaceId);
    }
  }, [selectedSurfaceId]);

  const value = useMemo<EditorContextValue>(
    () => ({
      isOpen,
      setIsOpen,
      surfaces,
      selectedSurfaceId,
      setSelectedSurfaceId,
      registerSurface,
    }),
    [
      isOpen,
      registerSurface,
      selectedSurfaceId,
      setIsOpen,
      setSelectedSurfaceId,
      surfaces,
    ],
  );

  return <EditorContext.Provider value={value}>{children}</EditorContext.Provider>;
}

export function useEditor() {
  const context = useContext(EditorContext);
  if (!context) {
    throw new Error("useEditor must be used within EditorProvider");
  }
  return context;
}

export function useEditorSurface(surface: EditorSurface) {
  const { registerSurface } = useEditor();

  useEffect(() => registerSurface(surface), [registerSurface, surface]);
}
