import { lazy, Suspense, type ReactNode } from "react";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { ProtectedRoute } from "../shared/components/layout/ProtectedRoute";
import { ErrorBoundary } from "./ErrorBoundary";
import AppLayout from "./Layout";
import PageLoader from "../shared/components/loaders/PageLoader";

// Lazy-loaded Pages
const Home = lazy(() => import("../features/home/pages/Home"));
const Login = lazy(() => import("../features/auth/pages/Login"));
const Notes = lazy(() => import("../features/notes/pages/Notes"));
const Tasks = lazy(() => import("../features/tasks/pages/Tasks"));
const Agent = lazy(() => import("../features/agent/pages/Agent"));
const Labels = lazy(() => import("../features/labels/pages/Labels"));
const Board = lazy(() => import("../features/board/pages/Board"));
const Support = lazy(() => import("../features/support/pages/Support"));
const NotFound = lazy(() => import("./NotFound"));

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
        protected: true,
      },
      {
        path: "/board",
        element: <Board />,
        protected: true,
      },
      {
        path: "/tasks",
        element: <Tasks />,
        protected: true,
      },
      {
        path: "/labels",
        element: <Labels />,
        protected: true,
      },
      {
        path: "/notes",
        element: <Notes />,
        protected: true,
      },
      {
        path: "/ask-tia",
        element: <Agent />,
        protected: true,
      },
      {
        path: "/support",
        element: <Support />,
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
    <Suspense fallback={<PageLoader />}>
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
