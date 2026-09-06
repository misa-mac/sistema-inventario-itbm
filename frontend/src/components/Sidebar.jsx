import { Link } from 'react-router-dom';
import { LayoutDashboard, Package, ClipboardList, Settings, QrCode } from 'lucide-react';

const Sidebar = () => {
  const menuItems = [
    { path: '/', name: 'Dashboard', icon: <LayoutDashboard size={20} /> },
    { path: '/inventory', name: 'Inventario', icon: <Package size={20} /> },
    { path: '/scanner', name: 'Escanear QR', icon: <QrCode size={20} /> },
    { path: '/audits', name: 'Auditorías', icon: <ClipboardList size={20} /> },
    { path: '/settings', name: 'Configuración', icon: <Settings size={20} /> },
  ];

  return (
    <aside className="sidebar-container">
      <div className="logo-placeholder">
        <img src="/logo-itbm.jpg" alt="ITBM Logo" />
      </div>
      <nav className="sidebar-nav">
        {menuItems.map((item) => (
          <Link
            key={item.path}
            to={item.path}
            className="sidebar-link"
          >
            {item.icon}
            {item.name}
          </Link>
        ))}
      </nav>
    </aside>
  );
};

export default Sidebar;
