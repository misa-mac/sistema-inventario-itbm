import { BrowserRouter as Router, Routes, Route, Navigate, Link, useLocation } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import LoginPage from './pages/LoginPage';
import InventoryPage from './pages/InventoryPage';
import ReportsPage from './pages/ReportsPage';
import AmbientesPage from './pages/AmbientesPage';
import { LayoutDashboard, Monitor, LogOut, Settings, Bell, Search, Menu, FileText, Building, Shield, Users } from 'lucide-react';

const ProtectedRoute = ({ children }) => {
  const { isAuthenticated } = useAuth();
  return isAuthenticated ? children : <Navigate to="/login" />;
};

const Sidebar = () => {
  const location = useLocation();
  const { logout } = useAuth();

  const menuItems = [
    { path: '/', icon: <LayoutDashboard size={20} />, label: 'Panel de Control' },
    { path: '/inventario', icon: <Monitor size={20} />, label: 'Activos Fijos' },
    { path: '/ambientes', icon: <Building size={20} />, label: 'Ambientes' },
    { path: '/reportes', icon: <FileText size={20} />, label: 'Reportes' },
    { path: '/usuarios', icon: <Users size={20} />, label: 'Roles y Permisos' },
    { path: '/configuracion', icon: <Settings size={20} />, label: 'Configuración' },
  ];

  return (
    <aside className="w-64 bg-surface-container-lowest border-r border-surface-container-highest flex flex-col h-screen sticky top-0 hidden md:flex">
      
      {/* Brand */}
      <div className="h-16 px-6 flex items-center border-b border-surface-container-highest">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded bg-primary-container text-on-primary-container flex items-center justify-center font-bold text-sm">
            IT
          </div>
          <span className="font-semibold text-on-surface tracking-tight">Inventario ITBM</span>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 overflow-y-auto p-4 space-y-1">
        <div className="px-3 pb-2 text-label-caps text-on-surface-variant uppercase tracking-wider mb-2 mt-2">
          Administración
        </div>
        
        {menuItems.map((item) => {
          const isActive = location.pathname === item.path;
          return (
            <Link
              key={item.label}
              to={item.path}
              className={`flex items-center gap-3 px-3 py-2 rounded-md transition-colors text-sm font-medium ${
                isActive 
                  ? 'bg-secondary-container/10 text-secondary' 
                  : 'text-on-surface-variant hover:bg-surface-container-low hover:text-on-surface'
              }`}
            >
              <span className={`${isActive ? 'text-secondary' : 'text-outline'}`}>
                {item.icon}
              </span>
              {item.label}
            </Link>
          );
        })}
      </nav>

      {/* Footer */}
      <div className="p-4 border-t border-surface-container-highest">
        <button 
          onClick={logout} 
          className="flex items-center gap-3 px-3 py-2 rounded-md w-full text-on-surface-variant hover:bg-error-container hover:text-on-error-container transition-colors text-sm font-medium"
        >
          <LogOut size={20} className="text-outline" />
          Cerrar Sesión
        </button>
      </div>
    </aside>
  );
};

const Header = () => {
  const { user } = useAuth();
  
  return (
    <header className="h-16 bg-surface-container-lowest border-b border-surface-container-highest flex items-center justify-between px-4 sm:px-6 sticky top-0 z-40">
      <div className="flex items-center gap-4">
        <button className="md:hidden text-on-surface-variant p-2 -ml-2 rounded hover:bg-surface-container-low">
          <Menu size={20} />
        </button>
      </div>
      
      <div className="flex items-center gap-4">
        <button className="text-on-surface-variant relative p-2 rounded-full hover:bg-surface-container-low">
          <Bell size={20} />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-error rounded-full"></span>
        </button>
        <div className="h-6 w-px bg-surface-container-highest"></div>
        <div className="flex items-center gap-3">
          <div className="text-right hidden sm:block">
            <div className="text-sm font-medium text-on-surface">{user?.nombre || 'Usuario'}</div>
            <div className="text-xs text-on-surface-variant capitalize">{user?.rol || 'Administrador'}</div>
          </div>
          <div className="w-8 h-8 rounded-full bg-primary-fixed text-on-primary-fixed flex items-center justify-center font-bold text-sm">
            {(user?.nombre || 'A').charAt(0).toUpperCase()}
          </div>
        </div>
      </div>
    </header>
  );
};

const DashboardLayout = ({ children }) => {
  return (
    <div className="flex h-screen bg-surface overflow-hidden">
      <Sidebar />
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <Header />
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8">
          <div className="max-w-5xl mx-auto">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
};

function AppContent() {
  const { isAuthenticated } = useAuth();

  return (
    <Router>
      <Routes>
        <Route path="/login" element={isAuthenticated ? <Navigate to="/" /> : <LoginPage />} />
        <Route 
          path="/inventario" 
          element={
            <ProtectedRoute>
              <DashboardLayout>
                <InventoryPage />
              </DashboardLayout>
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/ambientes" 
          element={
            <ProtectedRoute>
              <DashboardLayout>
                <AmbientesPage />
              </DashboardLayout>
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/reportes" 
          element={
            <ProtectedRoute>
              <DashboardLayout>
                <ReportsPage />
              </DashboardLayout>
            </ProtectedRoute>
          } 
        />
        <Route path="/" element={<Navigate to={isAuthenticated ? "/inventario" : "/login"} />} />
      </Routes>
    </Router>
  );
}

function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}

export default App;
