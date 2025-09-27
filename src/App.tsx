
import { Route, Routes, Navigate } from 'react-router-dom';
import { path } from './utilities/path';
import { 
  MainPage, 
  HomePage, 
  LandingPage, 
  FeaturesPage, 
  PrivacyPage, 
  DesktopAppPage, 
  FAQPage 
} from './pages';
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
          <Route path={path.FEATURES} element={<FeaturesPage />} />
          <Route path={path.PRIVACY} element={<PrivacyPage />} />
          <Route path={path.DESKTOP_APP} element={<DesktopAppPage />} />
          <Route path={path.HELP} element={<FAQPage />} />
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
            <ProtectedRoute isPublic={true}>
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
