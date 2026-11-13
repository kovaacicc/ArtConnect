import { createBrowserRouter, RouterProvider, Navigate } from 'react-router-dom';

// Uvozimo tvoj Layout (koji sadrži sidebar i <Outlet />)
import ArtistLayout from './components/artist/ArtistLayout';

// Uvozimo sve tvoje stranice
import ArtistDashboard from './pages/artist/ArtistDashboard';
import Opportunities from './pages/artist/Opportunities';
import OpportunityDetail from './pages/artist/OpportunityDetail';
import Applications from './pages/artist/Applications';
import ArtistProfile from './pages/artist/ArtistProfile';

// Definiramo rute (Router)
const router = createBrowserRouter([
  {
    // Kada netko ode na /umjetnik, učitava se ArtistLayout
    path: '/umjetnik',
    element: <ArtistLayout />,
    children: [
      // Ove stranice se učitavaju UNUTAR layouta (tamo gdje je <Outlet />)
      { path: '', element: <ArtistDashboard /> },             // /umjetnik
      { path: 'prilike', element: <Opportunities /> },        // /umjetnik/prilike
      { path: 'prilike/:id', element: <OpportunityDetail /> },// /umjetnik/prilike/o1 (npr.)
      { path: 'prijave', element: <Applications /> },         // /umjetnik/prijave
      { path: 'profil', element: <ArtistProfile /> },         // /umjetnik/profil
    ],
  },
  {
    // Ako netko otvori samo localhost:5173/ (bez /umjetnik), preusmjeri ga na dashboard
    path: '/',
    element: <Navigate to="/umjetnik" replace />,
  },
  {
    // Ako netko upiše krivi URL, preusmjeri ga na početnu
    path: '*',
    element: <Navigate to="/" replace />,
  }
]);

export default function App() {
  return (
    <RouterProvider router={router} />
  );
}