import { lazy, Suspense, type ReactNode } from "react";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Loader from "./components/layout/Loader";
import { ProtectedRoute } from "./components/layout/ProtectedRoute";
import { ErrorBoundary } from "./components/layout/ErrorBoundary";
import AppLayout from "./components/layout/AppLayout";
import Roadmap from "./pages/Roadmap";

// Lazy-loaded Pages
const Home = lazy(() => import("./pages/Home"));
const Login = lazy(() => import("./pages/Login"));
const Notes = lazy(() => import("./pages/Notes"));
const Tasks = lazy(() => import("./pages/Tasks"));
const Settings = lazy(() => import("./pages/Settings"));
const NotFound = lazy(() => import("./pages/NotFound"));

// Type for our route configuration
interface RouteConfig {
  path: string;
  element: ReactNode;
  children?: RouteConfig[];
  protected?: boolean;
  guestOnly?: boolean;
}

// Route configuration
// Update the route configuration in App.tsx
const routeConfig: RouteConfig[] = [
  {
    path: "/",
    element: <AppLayout />,
    children: [
      {
        path: "/",
        element: <Home />,
      },
      {
        path: "/tasks",
        element: <Tasks />,
        protected: true,
      },
      {
        path: "/notes",
        element: <Notes />,
        protected: true,
      },
      {
        path: "/roadmap",
        element: <Roadmap />,
        protected: true,
      },
      {
        path: "/settings",
        element: <Settings />,
        protected: true,
      },
    ],
  },
  {
    path: "/login",
    element: <Login />,
    guestOnly: true,
  },
  {
    path: "*",
    element: <NotFound />,
  },
];

const createRouteElement = (route: RouteConfig) => {
  // Create the element with Suspense and ErrorBoundary
  const element = (
    <Suspense fallback={<Loader />}>
      <ErrorBoundary>
        {route.element}
      </ErrorBoundary>
    </Suspense>
  );

  // If the route is protected, wrap it with ProtectedRoute
  if (route.protected) {
    return <ProtectedRoute>{element}</ProtectedRoute>;
  }

  return element;
};

// Create route elements with proper error boundaries and suspense
// Create routes from config with proper nesting
const routes = routeConfig.map(route => {
  if (route.children) {
    return {
      ...route,
      element: createRouteElement(route),
      children: route.children.map(child => ({
        ...child,
        element: createRouteElement(child)
      }))
    };
  }
  return {
    ...route,
    element: createRouteElement(route)
  };
});

const router = createBrowserRouter(routes);

function App() {
  return (
    <div className="min-h-screen bg-gray-50">
      <RouterProvider router={router} />
    </div>
  );
}

export default App;
