import "server-only";

import { createHydrationHelpers } from "@trpc/react-query/rsc";
import { headers } from "next/headers";
import { cache } from "react";

// Correct imports
import { type AppRouter, createCaller } from "../app/api/root";
import { createTRPCContext } from "../app/api/trpc";
import { createQueryClient } from "./query-client";

const createContext = cache(async () => {
    const heads = new Headers(await headers());
    heads.set("x-trpc-source", "rsc");
    return createTRPCContext({ headers: heads });
});

const getQueryClient = cache(createQueryClient);

// Ensure this matches the AppRouter type perfectly
const caller = createCaller(createContext);

export const { trpc: api, HydrateClient } = createHydrationHelpers<AppRouter>(
    caller,
    getQueryClient,
);