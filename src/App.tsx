import { QueryClientProvider } from "@tanstack/react-query";
import { RouterProvider } from "react-router-dom";
import { router } from "@/routes";
import { queryClient } from "@/lib/queryClient";
import { ErrorBoundary } from "@/components/common";

import { Toaster } from '@/components/ui/sonner';

function App() {
  return (
    <ErrorBoundary>
      <QueryClientProvider client={queryClient}>
        <RouterProvider router={router} />
        
        <Toaster />
      </QueryClientProvider>
    </ErrorBoundary>
  );
}

export default App;
