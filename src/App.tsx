import { Container } from "react-bootstrap"
import { BrowserRouter } from "react-router-dom"
import { AsideMenu } from "./components/pages/AsideMenu"
import { Home } from "./components/pages/Home"
import { AppRoutes } from "./routes/AppRoutes"

function App() {
  return (
    <BrowserRouter>

      <div className="App">
        <div className="container-fluid">
          <div className="row">
            <div className="col-md-3">
              <AsideMenu ></AsideMenu>
            </div>
            <div className="col-md-9">
              <Container>
                <AppRoutes></AppRoutes>
              </Container>
            </div>
          </div>
        </div>
      </div>
    </BrowserRouter>

  )
}

export default App
