import { lazy, Suspense, type ReactNode } from 'react';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import Loader from './components/layout/Loader';
import { ProtectedRoute } from './components/layout/ProtectedRoute';
import { ErrorBoundary } from './components/layout/ErrorBoundary';

// Lazy-loaded Pages
const Home = lazy(() => import('./pages/Home'));
const Login = lazy(() => import('./pages/Login'));
const Signup = lazy(() => import('./pages/Signup'));
const Settings = lazy(() => import('./pages/Settings'));
const NotFound = lazy(() => import('./pages/NotFound'));

// Type for our route configuration
interface RouteConfig {
  path: string;
  element: ReactNode;
  protected?: boolean;
  guestOnly?: boolean;
}

// Route configuration
const routeConfig: RouteConfig[] = [
  {
    path: '/',
    element: <Home />,
  },
  {
    path: '/login',
    element: <Login />,
    guestOnly: true,
  },
  {
    path: '/signup',
    element: <Signup />,
    guestOnly: true,
  },
  {
    path: '/settings',
    element: <Settings />,
    protected: true,
  },
  {
    path: '*',
    element: <NotFound />,
  },
];

// Create route elements with proper error boundaries and suspense
const createRouteElement = (route: RouteConfig) => {
  const element = (
    <Suspense fallback={<Loader />}>
      <ErrorBoundary>
        {route.element}
      </ErrorBoundary>
    </Suspense>
  );

  if (route.protected) {
    return <ProtectedRoute>{element}</ProtectedRoute>;
  }

  return element;
};

// Create routes from config
const routes = routeConfig.map((route) => ({
  path: route.path,
  element: createRouteElement(route),
}));

const router = createBrowserRouter(routes);

function App() {
  return (
    <div className="min-h-screen bg-gray-50">
      <RouterProvider router={router} />
    </div>
  );
}

export default App;