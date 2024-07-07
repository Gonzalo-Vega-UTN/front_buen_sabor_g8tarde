
import Sidebar from "./components/Sidebar/Sidebar";
import Footer from "./components/Footer/Footer";
import AppRoutes from "./routes/AppRoutes";

const AppContent = () => (
  <div className="container-fluid p-0 layout">
    <div className="row g-0">
      <div className="col-md-2">
        <Sidebar />
      </div>
      <div className="col-md-10 d-flex flex-column min-vh-100">
        <main className="flex-grow-1">
          <AppRoutes />
        </main>
        <Footer />
      </div>
    </div>
  </div>
);

const App = () => <AppContent />;

export default App;
