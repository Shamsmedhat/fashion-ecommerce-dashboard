import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { RouterProvider } from "@tanstack/react-router";
import { ThemeProvider } from "next-themes";

import { Toaster } from "@/components/ui/sonner";
import { router } from "@/config/router";
import { STALE_TIMES } from "@/config/query.config";
import "@/i18n";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: STALE_TIMES.STANDARD,
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

export function AppProviders() {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider attribute="class" defaultTheme="dark" enableSystem={false}>
        <RouterProvider router={router} />
        <Toaster richColors position="top-center" />
      </ThemeProvider>
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  );
}
