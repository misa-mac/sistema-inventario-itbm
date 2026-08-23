import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import DashboardLayout from './layouts/DashboardLayout';
import InventoryPage from './pages/InventoryPage';
import ScannerPage from './pages/ScannerPage';

function App() {
  return (
    <Router>
      <DashboardLayout>
        <Routes>
          <Route path="/" element={<div>Dashboard (Próximamente)</div>} />
          <Route path="/inventory" element={<InventoryPage />} />
          <Route path="/scanner" element={<ScannerPage />} />
          <Route path="/audits" element={<div>Auditorías (Próximamente)</div>} />
          <Route path="/settings" element={<div>Configuración (Próximamente)</div>} />
        </Routes>
      </DashboardLayout>
    </Router>
  );
}

export default App;
