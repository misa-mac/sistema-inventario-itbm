import { Link } from 'react-router-dom';
import { LayoutDashboard, Package, ClipboardList, Settings, QrCode } from 'lucide-react';

const Sidebar = () => {
  const menuItems = [
    { path: '/', name: 'Dashboard', icon: <LayoutDashboard size={20} /> },
    { path: '/inventory', name: 'Inventario', icon: <Package size={20} /> },
    { path: '/scanner', name: 'Escáner QR', icon: <QrCode size={20} /> },
    { path: '/audits', name: 'Auditorías', icon: <ClipboardList size={20} /> },
    { path: '/settings', name: 'Configuración', icon: <Settings size={20} /> },
  ];

  return (
    <aside className="w-64 bg-gray-800 text-white min-h-screen p-4">
      <h2 className="text-xl font-bold mb-6 text-center">ITBM System</h2>
      <nav className="flex flex-col gap-2">
        {menuItems.map((item) => (
          <Link
            key={item.path}
            to={item.path}
            className="flex items-center gap-3 p-3 rounded hover:bg-gray-700 transition"
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
