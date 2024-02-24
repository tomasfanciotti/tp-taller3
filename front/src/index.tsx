import React, { StrictMode } from 'react';
import { HashRouter } from 'react-router-dom';
import './index.css';
import { QueryClient, QueryClientProvider } from 'react-query';
import { App } from "./App";
import { createRoot } from "react-dom/client";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: Infinity,
    },
  },
});
const domNode = document.getElementById('root')
const root = createRoot(domNode!);

root.render(<StrictMode>
  <HashRouter>
    <QueryClientProvider client={queryClient}>
      <App/>
    </QueryClientProvider>
  </HashRouter>
</StrictMode>)
