import {BrowserRouter as Router} from "react-router-dom"
import Header from "./components/Header/Header"
import AppRoutes from "./routes/AppRoutes"
import { Container } from "react-bootstrap"

import { ToastContainer } from "react-toastify"
import "react-toastify/dist/ReactToastify.css";
import SidebarComponent from "./components/Sidebar/Sidebar";

export default function App() {

  return (
    <>
      <ToastContainer/>
      <Router>
        <Header />
        <Container style={{ minHeight: "100vh", minWidth: "100%", padding: "0" }}>
          <AppRoutes />
                 <SidebarComponent />
        </Container>
      </Router>
    </>
  )
}
