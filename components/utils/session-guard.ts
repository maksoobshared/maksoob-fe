"use client";

import {
  createElement,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";
import { useRouter } from "next/router";
import type { NextPage } from "next";
import { useAtomValue } from "jotai";
import { sessionAtom, type Session } from "@/lib/atoms";

export type SessionGuardOptions = {
  redirectTo?: string;
  requireToken?: boolean;
  enabled?: boolean;
  fallback?: ReactNode;
};

export type RedirectIfAuthenticatedOptions = {
  redirectTo?: string;
  requireToken?: boolean;
  enabled?: boolean;
  suppressRedirect?: boolean;
  fallback?: ReactNode;
};

export type UseRequireSessionResult = {
  session: Session;
  isAuthenticated: boolean;
  isChecking: boolean;
  isRedirecting: boolean;
};

export type UseRedirectIfAuthenticatedResult = {
  session: Session;
  isAuthenticated: boolean;
  isRedirecting: boolean;
};

export function useRequireSession(
  options: SessionGuardOptions = {}
): UseRequireSessionResult {
  const {
    redirectTo = "/login",
    requireToken = true,
    enabled = true,
  } = options;

  const router = useRouter();
  const session = useAtomValue(sessionAtom);

  const isAuthenticated = useMemo(() => {
    if (!session) return false;
    if (requireToken) return Boolean(session.token);
    return true;
  }, [session, requireToken]);

  const [isChecking, setIsChecking] = useState(true);
  const [isRedirecting, setIsRedirecting] = useState(false);
  const hasTriggeredRedirect = useRef(false);

  useEffect(() => {
    if (!enabled) {
      setIsChecking(false);
      setIsRedirecting(false);
      hasTriggeredRedirect.current = false;
      return;
    }

    if (isAuthenticated) {
      setIsChecking(false);
      setIsRedirecting(false);
      hasTriggeredRedirect.current = false;
      return;
    }

    setIsChecking(false);

    if (hasTriggeredRedirect.current) {
      setIsRedirecting(true);
      return;
    }

    hasTriggeredRedirect.current = true;
    setIsRedirecting(true);

    let cancelled = false;
    router.replace(redirectTo).finally(() => {
      if (!cancelled) {
        setIsRedirecting(false);
      }
    });

    return () => {
      cancelled = true;
    };
  }, [enabled, isAuthenticated, redirectTo, router]);

  return {
    session,
    isAuthenticated,
    isChecking,
    isRedirecting,
  };
}

export function withSessionGuard<P extends Record<string, unknown>>(
  Page: NextPage<P>,
  options: SessionGuardOptions = {}
): NextPage<P> {
  const GuardedPage: NextPage<P> = (props) => {
    const { isAuthenticated, isChecking } = useRequireSession(options);

    if (options.enabled === false) {
      return createElement(Page, props);
    }

    if (isChecking) {
      return options.fallback ?? null;
    }

    if (!isAuthenticated) {
      return options.fallback ?? null;
    }

    return createElement(Page, props);
  };

  GuardedPage.displayName = `WithSessionGuard(${
    Page.displayName || Page.name || "Component"
  })`;

  return GuardedPage;
}

export function useRedirectIfAuthenticated(
  options: RedirectIfAuthenticatedOptions = {}
): UseRedirectIfAuthenticatedResult {
  const {
    redirectTo = "/",
    requireToken = true,
    enabled = true,
    suppressRedirect = false,
  } = options;

  const router = useRouter();
  const session = useAtomValue(sessionAtom);

  const isAuthenticated = useMemo(() => {
    if (!session) return false;
    if (requireToken) return Boolean(session.token);
    return true;
  }, [session, requireToken]);

  const [isRedirecting, setIsRedirecting] = useState(false);
  const hasRedirected = useRef(false);

  useEffect(() => {
    if (!enabled) {
      setIsRedirecting(false);
      hasRedirected.current = false;
      return;
    }

    if (!isAuthenticated) {
      setIsRedirecting(false);
      hasRedirected.current = false;
      return;
    }

    if (suppressRedirect) {
      setIsRedirecting(false);
      hasRedirected.current = false;
      return;
    }

    if (hasRedirected.current) {
      setIsRedirecting(true);
      return;
    }

    hasRedirected.current = true;
    setIsRedirecting(true);

    let cancelled = false;
    router.replace(redirectTo).finally(() => {
      if (!cancelled) {
        setIsRedirecting(false);
      }
    });

    return () => {
      cancelled = true;
    };
  }, [enabled, isAuthenticated, redirectTo, router, suppressRedirect]);

  return {
    session,
    isAuthenticated,
    isRedirecting,
  };
}

export function withRedirectIfAuthenticated<P extends Record<string, unknown>>(
  Page: NextPage<P>,
  options: RedirectIfAuthenticatedOptions = {}
): NextPage<P> {
  const GuardedPage: NextPage<P> = (props) => {
    const { isAuthenticated, isRedirecting } =
      useRedirectIfAuthenticated(options);

    if (options.enabled === false) {
      return createElement(Page, props);
    }

    if (isRedirecting || isAuthenticated) {
      return options.fallback ?? null;
    }

    return createElement(Page, props);
  };

  GuardedPage.displayName = `WithRedirectIfAuthenticated(${
    Page.displayName || Page.name || "Component"
  })`;

  return GuardedPage;
}
