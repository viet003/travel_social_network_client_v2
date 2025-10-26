
import { Route, Routes, Navigate } from 'react-router-dom';
import { path } from './utilities/path';
import { 
  HomePage, 
  FeaturesPage, 
  PrivacyPage, 
  DesktopAppPage, 
  FAQPage,
  WatchPage,
  ExplorePage
} from './pages';
import { MainLayout, LandingLayout, FriendsLayout, GroupLayout } from './layout';
import {
  FriendsHomePage,
  FriendRequestsPage,
  FriendSuggestionsPage,
  AllFriendsPage,
  BirthdaysPage,
  CustomListsPage
} from './pages/public/friends';
import {
  GroupFeedsPage,
  YourGroupsPage,
  GroupSuggestionsPage
} from './pages/public/groups';
import { LoginForm, SignUpForm, ForgotPasswordForm, ResetPasswordForm } from './components/auth';
import { ToastContainer } from 'react-toastify';
import { ProtectedRoute, ProtectedResetRoute } from './components/index';
import './index.css'

function App() {
  return (
    <>
      <Routes>
        {/* Landing layout with nested routes */}
        <Route
          path="/"
          element={
            <ProtectedRoute isPublic={true}>
              <LandingLayout />
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
            <ProtectedRoute isPublic={false}>
              <MainLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<HomePage />} />
          <Route path={path.FRIENDS} element={<FriendsLayout />}>
            <Route index element={<FriendsHomePage />} />
            <Route path={path.FRIENDS_REQUESTS} element={<FriendRequestsPage />} />
            <Route path={path.FRIENDS_SUGGESTIONS} element={<FriendSuggestionsPage />} />
            <Route path={path.FRIENDS_ALL} element={<AllFriendsPage />} />
            <Route path={path.FRIENDS_BIRTHDAYS} element={<BirthdaysPage />} />
            <Route path={path.FRIENDS_CUSTOM_LISTS} element={<CustomListsPage />} />
          </Route>
          <Route path={path.GROUPS} element={<GroupLayout />}>
            <Route index element={<Navigate to={path.GROUPS_FEEDS} />} />
            <Route path={path.GROUPS_FEEDS} element={<GroupFeedsPage />} />
            <Route path={path.YOUR_GROUPS} element={<YourGroupsPage />} />
            <Route path={path.GROUPS_DISCOVER} element={<GroupSuggestionsPage />} />
          </Route>
          <Route path={path.WATCH} element={<WatchPage />} />
          <Route path={path.EXPLORE} element={<ExplorePage />} />
        </Route>
        <Route path={path.STAR} element={<Navigate to="/" replace />} />
      </Routes>
      <ToastContainer />
    </>
  );
}

export default App;
