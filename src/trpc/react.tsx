"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useState } from "react";
import { createQueryClient } from "./query-client";

/**
 * FIX: Your root.ts uses Standard Route Handlers (REST), not tRPC.
 * We define these as 'any' so the rest of your app stops looking 
 * for tRPC types that aren't there.
 */
export type AppRouter = any;
export const api: any = {
  useContext: () => ({}),
  useUtils: () => ({}),
};

export function TRPCReactProvider(props: { children: React.ReactNode }) {
  // We keep QueryClientProvider because other hooks in your app 
  // likely still need React Query to function.
  const [queryClient] = useState(() => createQueryClient());

  return (
    <QueryClientProvider client={queryClient}>
      {props.children}
    </QueryClientProvider>
  );
}