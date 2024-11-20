import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "@/styles/global.css";
import App from "@/App";
import { Provider } from "react-redux";
import store from "@/redux/store";
import { QueryClient, QueryClientProvider } from "react-query";

const queryClient = new QueryClient();

createRoot(document.getElementById("root")).render(
    <StrictMode>
        <QueryClientProvider client={queryClient}>
            <Provider store={store}>
                <App />
            </Provider>
        </QueryClientProvider>
    </StrictMode>
);
