
import { Route, Routes } from 'react-router-dom';
import { path } from './utilities/path';
import MainPage from './pages/public/MainPage';
import LandingPage from './pages/public/LandingPage';
import { ToastContainer } from 'react-toastify';
import { ProtectedRoute } from './components/index';
import './index.css'

function App() {
  return (
    <>
      <Routes>
        {/* Landing page - redirect authenticated users to home */}
        <Route 
          path={path.LANDING} 
          element={
            <ProtectedRoute isPublic={true}>
              <LandingPage />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/" 
          element={
            <ProtectedRoute isPublic={true}>
              <LandingPage />
            </ProtectedRoute>
          } 
        />
        
        {/* Protected routes - require authentication */}
        <Route 
          path={path.CHAT} 
          element={
            <ProtectedRoute isPublic={false}>
              <MainPage />
            </ProtectedRoute>
          } 
        />
        
        {/* Catch all other routes and redirect to landing */}
        <Route path="*" element={<LandingPage />} />
      </Routes>
      <ToastContainer />
    </>
  );
}

export default App;
