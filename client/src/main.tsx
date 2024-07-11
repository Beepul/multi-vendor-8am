import React from 'react'
import ReactDOM from 'react-dom/client'
import './index.css'
import RouterConfig from './config/router.config'
import { BrowserRouter } from 'react-router-dom'
import { QueryClient, QueryClientProvider } from 'react-query'
import 'react-toastify/dist/ReactToastify.css';
import { ToastContainer } from "react-toastify"
import CombinedProviders from './context'

const twentyFourHoursInMs = 1000 * 60 * 60 * 24;

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      refetchOnMount: false,
      refetchOnReconnect: false,
      retry: false,
      staleTime: twentyFourHoursInMs,
    },
  },
})

ReactDOM.createRoot(document.getElementById('root')!).render(
  // <React.StrictMode>
    <BrowserRouter>
      <QueryClientProvider client={queryClient}>
        <CombinedProviders>
          <RouterConfig />
        </CombinedProviders>
      </QueryClientProvider>
      <ToastContainer />
    </BrowserRouter>
  // </React.StrictMode>,
)
