import React, { useState } from 'react';
import { BrowserRouter, Routes, Route, Link, useLocation, Navigate } from 'react-router-dom';
import { Building2 } from 'lucide-react';
import TicketGeneration from './screens/TicketGeneration';
import ModuleView from './screens/ModuleView';
import ModuleLogin from './screens/ModuleLogin';
import AdminDashboard from './screens/AdminDashboard';
import UserManagement from './screens/UserManagement';
import NetworkInfo from './components/NetworkInfo';
import { AppProvider, useApp } from './context/AppContext';

function RequireAuth({ children, requireAdmin = false }: { children: JSX.Element, requireAdmin?: boolean }) {
  const { currentUser } = useApp();
  const location = useLocation();

  if (!currentUser) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (requireAdmin && currentUser.role !== 'admin') {
    return <Navigate to="/" replace />;
  }

  return children;
}

function Navigation() {
  const location = useLocation();
  const { currentUser } = useApp();
  const [isHovered, setIsHovered] = useState(false);
  
  if (location.pathname === '/login') return null;

  return (
    <nav className="bg-white shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="flex items-center">
              <Building2 className="h-8 w-8 text-blue-600 mr-2" />
              <span className="font-semibold text-gray-900">CESFAM Dr. Aníbal Ariztía</span>
            </Link>
          </div>
          <div 
            className="flex space-x-4 relative"
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
          >
            <div className={`flex space-x-4 transition-opacity duration-300 ${isHovered ? 'opacity-100' : 'opacity-0'}`}>
              <Link
                to="/"
                className={`px-3 py-2 rounded-md text-sm font-medium ${
                  location.pathname === '/'
                    ? 'bg-blue-100 text-blue-700'
                    : 'text-gray-700 hover:bg-gray-100'
                }`}
              >
                Generar Número
              </Link>
              {currentUser?.role === 'module' && (
                <Link
                  to={`/modulo/${currentUser.moduleId + 1}`}
                  className={`px-3 py-2 rounded-md text-sm font-medium ${
                    location.pathname.startsWith('/modulo')
                      ? 'bg-blue-100 text-blue-700'
                      : 'text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  Mi Módulo
                </Link>
              )}
              {!currentUser && (
                <Link
                  to="/login"
                  className={`px-3 py-2 rounded-md text-sm font-medium ${
                    location.pathname === '/login'
                      ? 'bg-blue-100 text-blue-700'
                      : 'text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  Usuario
                </Link>
              )}
              {currentUser?.role === 'admin' && (
                <>
                  <Link
                    to="/admin"
                    className={`px-3 py-2 rounded-md text-sm font-medium ${
                      location.pathname === '/admin'
                        ? 'bg-blue-100 text-blue-700'
                        : 'text-gray-700 hover:bg-gray-100'
                    }`}
                  >
                    Administración
                  </Link>
                  <Link
                    to="/usuarios"
                    className={`px-3 py-2 rounded-md text-sm font-medium ${
                      location.pathname === '/usuarios'
                        ? 'bg-blue-100 text-blue-700'
                        : 'text-gray-700 hover:bg-gray-100'
                    }`}
                  >
                    Usuarios
                  </Link>
                </>
              )}
            </div>
            <div 
              className={`absolute inset-0 ${isHovered ? 'pointer-events-none' : ''}`}
              style={{ minWidth: '200px', minHeight: '40px' }}
            />
          </div>
        </div>
      </div>
    </nav>
  );
}

function App() {
  return (
    <AppProvider>
      <BrowserRouter>
        <div className="min-h-screen bg-gray-100">
          <Navigation />
          <main className="container mx-auto px-4 py-8">
            <Routes>
              <Route path="/" element={<TicketGeneration />} />
              <Route path="/login" element={<ModuleLogin />} />
              <Route
                path="/modulo/:id"
                element={
                  <RequireAuth>
                    <ModuleView />
                  </RequireAuth>
                }
              />
              <Route
                path="/admin"
                element={
                  <RequireAuth requireAdmin>
                    <AdminDashboard />
                  </RequireAuth>
                }
              />
              <Route
                path="/usuarios"
                element={
                  <RequireAuth requireAdmin>
                    <UserManagement />
                  </RequireAuth>
                }
              />
            </Routes>
          </main>
          <NetworkInfo />
          <footer className="bg-white shadow-md mt-auto">
            <div className="max-w-7xl mx-auto py-4 px-4 sm:px-6 lg:px-8">
              <p className="text-center text-sm text-gray-500">
                © {new Date().getFullYear()} CESFAM Dr. Aníbal Ariztía. Todos los derechos reservados.
              </p>
            </div>
          </footer>
        </div>
      </BrowserRouter>
    </AppProvider>
  );
}

export default App;