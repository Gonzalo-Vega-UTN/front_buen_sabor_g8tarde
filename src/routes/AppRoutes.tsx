import { Routes, Route } from "react-router-dom"
import { Home } from "../components/pages/Home"
import { Grilla } from "../components/ui/Grilla"
import { FormCliente } from "../components/pages/FormCliente"

export const AppRoutes: React.FC = () => {
    return (
      <Routes>
          <Route path='/' element={<Home/>}></Route>
          <Route path='/grilla' element={<Grilla/>}></Route>
          <Route path='/form-cliente'>
            <Route path=":id" element={<FormCliente/>}></Route>
          </Route>
      </Routes>
    )
  }