
import { Route, Routes } from 'react-router-dom';
import { path } from './utilities/path';
import MainPage from './pages/public/MainPage';
import LandingPage from './pages/public/LandingPage';
import { LoginForm, SignUpForm, ForgotPasswordForm } from './components/auth';
import { ToastContainer } from 'react-toastify';
import { ProtectedRoute } from './components/index';
import './index.css'

function App() {
  return (
    <>
      <Routes>
        {/* Landing page with nested routes */}
        <Route 
          path="/" 
          element={
            <ProtectedRoute isPublic={true}>
              <LandingPage />
            </ProtectedRoute>
          } 
        >
          {/* Default route - Login */}
          <Route index element={<LoginForm />} />
          {/* Sign Up route */}
          <Route path={path.SIGNUP} element={<SignUpForm />} />
          {/* Forgot Password route */}
          <Route path={path.FORGOTPASS} element={<ForgotPasswordForm />} />
        </Route>
        
        {/* Protected routes - require authentication */}
        <Route 
          path={path.HOME}
          element={
            <ProtectedRoute isPublic={false}>
              <MainPage />
            </ProtectedRoute>
          }
        >
          <Route index element={<div className="flex-1 flex items-center justify-center"><h1>Welcome to Travel Social Network!</h1></div>} />
        </Route>
        
        {/* Catch all other routes and redirect to landing */}
        <Route path="*" element={
          <ProtectedRoute isPublic={true}>
            <LandingPage />
          </ProtectedRoute>
        } />
      </Routes>
      <ToastContainer />
    </>
  );
}

export default App;
