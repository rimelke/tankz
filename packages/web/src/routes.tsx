import { BrowserRouter, Routes as RouterRoutes, Route } from 'react-router-dom'
import Home from './pages/Home'
import Instructions from './pages/Instructions'
import Play from './pages/Play'

const Routes = () => (
  <BrowserRouter>
    <RouterRoutes>
      <Route path="/" element={<Home />} />
      <Route path="/instructions" element={<Instructions />} />
      <Route path="/play" element={<Play />} />
    </RouterRoutes>
  </BrowserRouter>
)

export default Routes
