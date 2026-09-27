"use client";

import {
    createContext,
    useCallback,
    useContext,
    useEffect,
    useMemo,
    useState,
    type ReactNode,
} from "react";

interface SidebarContextValue {
    collapsed: boolean;
    mobileOpen: boolean;
    toggleCollapsed: () => void;
    setCollapsed: (value: boolean) => void;
    toggleMobile: () => void;
    closeMobile: () => void;
}

const SidebarContext = createContext<SidebarContextValue | null>(null);

export function SidebarProvider({ children }: { children: ReactNode }) {
    const [collapsed, setCollapsedState] = useState(false);
    const [mobileOpen, setMobileOpen] = useState(false);

    const toggleCollapsed = useCallback(() => {
        setCollapsedState((prev) => !prev);
    }, []);

    const setCollapsed = useCallback((value: boolean) => {
        setCollapsedState(value);
    }, []);

    const toggleMobile = useCallback(() => {
        setMobileOpen((prev) => !prev);
    }, []);

    const closeMobile = useCallback(() => {
        setMobileOpen(false);
    }, []);

    // Lock body scroll while mobile drawer is open
    useEffect(() => {
        if (mobileOpen) {
            const original = document.body.style.overflow;
            document.body.style.overflow = "hidden";
            return () => {
                document.body.style.overflow = original;
            };
        }
    }, [mobileOpen]);

    // Close mobile drawer when resizing up to desktop
    useEffect(() => {
        const handleResize = () => {
            if (window.innerWidth >= 1024 && mobileOpen) {
                setMobileOpen(false);
            }
        };
        window.addEventListener("resize", handleResize);
        return () => window.removeEventListener("resize", handleResize);
    }, [mobileOpen]);

    const value = useMemo(
        () => ({
            collapsed,
            mobileOpen,
            toggleCollapsed,
            setCollapsed,
            toggleMobile,
            closeMobile,
        }),
        [collapsed, mobileOpen, toggleCollapsed, setCollapsed, toggleMobile, closeMobile]
    );

    return <SidebarContext.Provider value={value}>{children}</SidebarContext.Provider>;
}

export function useSidebar() {
    const ctx = useContext(SidebarContext);
    if (!ctx) {
        throw new Error("useSidebar must be used within a SidebarProvider");
    }
    return ctx;
}