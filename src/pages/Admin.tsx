
import Header from '@/components/Header';
import AdminPanel from '@/components/AdminPanel';

const Admin = () => {
  return (
    <div className="min-h-screen pb-20">
      <Header />
      
      <main className="pt-24 px-4 sm:px-6">
        <div className="max-w-screen-xl mx-auto">
          <h1 className="text-2xl font-bold mb-2">Admin Dashboard</h1>
          <p className="text-muted-foreground mb-8">
            Customize your store appearance and manage your products.
          </p>
          
          <AdminPanel />
        </div>
      </main>
    </div>
  );
};

export default Admin;
