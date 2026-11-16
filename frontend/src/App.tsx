import { createBrowserRouter, RouterProvider, Navigate } from 'react-router-dom';

import ArtistLayout from './components/artist/ArtistLayout';

import ArtistDashboard from './pages/artist/ArtistDashboard';
import Opportunities from './pages/artist/Opportunities';
import OpportunityDetail from './pages/artist/OpportunityDetail';
import Applications from './pages/artist/Applications';
import ArtistProfile from './pages/artist/ArtistProfile';

const router = createBrowserRouter([
  {
    path: '/umjetnik',
    element: <ArtistLayout />,
    children: [
      { path: '', element: <ArtistDashboard /> },             
      { path: 'prilike', element: <Opportunities /> },        
      { path: 'prilike/:id', element: <OpportunityDetail /> },
      { path: 'prijave', element: <Applications /> },         
      { path: 'profil', element: <ArtistProfile /> },         
    ],
  },
  {
    path: '/',
    element: <Navigate to="/umjetnik" replace />,
  },
  {
    path: '*',
    element: <Navigate to="/" replace />,
  }
]);

export default function App() {
  return (
    <RouterProvider router={router} />
  );
}