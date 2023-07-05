import { authRouter } from "./router/auth";
import { tidesRouter } from "./router/tides";
import { createTRPCRouter } from "./trpc";

export const appRouter = createTRPCRouter({
  data: tidesRouter,
  auth: authRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
