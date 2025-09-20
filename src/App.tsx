
import { Route, Routes, Navigate } from 'react-router-dom';
import { path } from './utilities/path';
import MainPage from './pages/public/MainPage';
import HomePage from './pages/public/HomePage';
import LandingPage from './pages/public/LandingPage';
import AboutPage from './pages/public/AboutPage';
import FeaturesPage from './pages/public/FeaturesPage';
import PrivacyPage from './pages/public/PrivacyPage';
// import DesktopAppPage from './pages/public/DesktopAppPage';
import { LoginForm, SignUpForm, ForgotPasswordForm, ResetPasswordForm } from './components/auth';
import { ToastContainer } from 'react-toastify';
import { ProtectedRoute, ProtectedResetRoute } from './components/index';
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
          <Route index element={<LoginForm />} />
          <Route path={path.SIGNUP} element={<SignUpForm />} />
          <Route path={path.FORGOTPASS} element={<ForgotPasswordForm />} />
          <Route path={path.ABOUT} element={<AboutPage />} />
          <Route path={path.FEATURES} element={<FeaturesPage />} />
          <Route path={path.PRIVACY} element={<PrivacyPage />} />
          {/* <Route path={path.DESKTOP_APP} element={<DesktopAppPage />} /> */}
          <Route
            path={path.RESETPASS}
            element={
              <ProtectedResetRoute>
                <ResetPasswordForm />
              </ProtectedResetRoute>
            }
          />
        </Route>
        <Route
          path={path.HOME}
          element={
            <ProtectedRoute isPublic={false}>
              <MainPage />
            </ProtectedRoute>
          }
        >
          <Route index element={<HomePage />} />
        </Route>
        <Route path={path.STAR} element={<Navigate to="/" replace />} />
      </Routes>
      <ToastContainer />
    </>
  );
}

export default App;
