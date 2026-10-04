/*
 * App
 * -------------------------------------------------------
 * Root application component.
 *
 * The App component is intentionally kept small.
 * Application-level routing is handled by AppRoutes.
 *
 * Keeping routing outside this file makes the application
 * easier to scale as more pages are added.
 */

import { BrowserRouter } from "react-router-dom";

import AppRoutes from "./routes/AppRoutes";


function App() {
  return (
    /*
     * BrowserRouter enables client-side routing using the
     * browser URL without performing a full page reload.
     *
     * It should wrap the complete route tree so every page
     * and navigation component can access React Router.
     */
    <BrowserRouter>

      <AppRoutes />

    </BrowserRouter>
  );
}

export default App;