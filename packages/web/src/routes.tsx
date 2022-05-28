import { BrowserRouter, Routes as RouterRoutes, Route } from 'react-router-dom'
import Home from './pages/Home'
import Instructions from './pages/Instructions'

const Routes = () => (
  <BrowserRouter>
    <RouterRoutes>
      <Route path="/" element={<Home />} />
      <Route path="/instructions" element={<Instructions />} />
    </RouterRoutes>
  </BrowserRouter>
)

export default Routes
