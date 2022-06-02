import { BrowserRouter, Routes as RouterRoutes, Route } from 'react-router-dom'

import Home from './pages/Home'
import Instructions from './pages/Instructions'
import Play from './pages/Play'
import PlayCreate from './pages/Play/Create'
import PlayFind from './pages/Play/Find'
import PlayGame from './pages/Play/Game'
import PlayJoin from './pages/Play/Join'

const Routes = () => (
  <BrowserRouter>
    <RouterRoutes>
      <Route path="/" element={<Home />} />
      <Route path="/instructions" element={<Instructions />} />
      <Route path="/play" element={<Play />} />
      <Route path="/play/create" element={<PlayCreate />} />
      <Route path="/play/join" element={<PlayJoin />} />
      <Route path="/play/find" element={<PlayFind />} />

      <Route path="/play/:id" element={<PlayGame />} />
    </RouterRoutes>
  </BrowserRouter>
)

export default Routes
