import Sidebar from '../components/Sidebar';

const DashboardLayout = ({ children }) => {
  return (
    <div className="flex">
      <Sidebar />
      <main className="flex-1 bg-gray-100 p-8 min-h-screen">
        {children}
      </main>
    </div>
  );
};

export default DashboardLayout;
