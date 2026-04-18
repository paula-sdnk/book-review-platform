import { t } from "./trpc";

export const loggerMiddleware = t.middleware(async ({ path, type, next }) => {
  const start = Date.now();
  const result = await next();
  const duration = Date.now() - start;

  console.log(`[${type}] ${path} - ${duration}ms`);

  return result;
});

export const loggedProcedure = t.procedure.use(loggerMiddleware);
