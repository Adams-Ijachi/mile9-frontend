import { createRef, lazy, Suspense } from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import { TransitionGroup, CSSTransition } from 'react-transition-group';
import { useRecoilValue } from 'recoil';
import { GuardProvider, GuardedRoute } from 'react-router-guards';
import _ from 'lodash';
import { withEmailAuth, withParkSlug } from '../recoil/parkAdmin';
import localForage from '../services/localforage';
import './App.css';
import 'animate.css';
import { getToken } from '../utils';

const AppLayout = lazy(() => import(/* webpackChunkName: "Layout" */ '../Layouts/AppLayout'));
const AuthLayout = lazy(() => import(/* webpackChunkName: "Layout" */ '../Layouts/AuthLayout'));
const AgentLayout = lazy(() => import(/* webpackChunkName: "Layout" */ '../Layouts/AgentLayout'));

// Components
const ErrorPage = lazy(() => import(/* webpackChunkName: "Error.404" */ '../ErrorPage'));
const Home = lazy(() => import(/* webpackChunkName: "Home" */ '../Home'));

const SignUp = lazy(() => import(/* webpackChunkName: "Auth.User" */ '../SignUp'));
const SignIn = lazy(() => import(/* webpackChunkName: "Auth.User" */ '../SignIn'));

const AdminSignin  = lazy(() => import(/* webpackChuckName: "Super.Admin" */ '../Admin/AdminSignIn'));

const CreatePark = lazy(() => import(/* webpackChunkName: "Park.Admin.Auth" */ '../Park/CreatePark'));
const ParkAdminOTP  = lazy(() => import(/* webpackChunkName: "Park.Admin.Auth" */ '../Park/ParkAdminOTP'));
const parkAdminSignIn = lazy(() => import(/* webpackChunkName: "Park.Admin.Auth" */ '../Park/ParkAdminSignIn'));
const ParkAdminVerify = lazy(() => import(/* webpackChunkName: "Park.Admin.Auth" */ '../VerifyEmail'));
const ParkAdminEmailVerified = lazy(() => import(/* webpackChunkName: "Park.Admin.Auth" */ '../EmailVerified'));

const ParkAdminDashboard  = lazy(() => import(/* webpackChunkName: "Park.Admin.Pages" */ '../Park/ParkAdminDashboard'));
const ParkBuses = lazy(() => import(/* webpackChunkName: "Park.Admin.Pages" */ '../Park/ParkBuses'));
const ParkBusesList = lazy(() => import(/* webpackChunkName: "Park.Admin.Pages" */ '../Park/ParkBusesList'));
const ParkDrivers  = lazy(() => import(/* webpackChunkName: "Park.Admin.Pages" */ '../Park/ParkDrivers'));
const ParkDriversList = lazy(() => import(/* webpackChunkName: "Park.Admin.Pages" */ '../Park/ParkDriversList'));
const ParkRides = lazy(() => import(/* webpackChunkName: "Park.Admin.Pages" */ '../Park/ParkRides'));
const ParkRidesList = lazy(() => import(/* webpackChunkName: "Park.Admin.Pages" */ '../Park/ParkRidesList'));
const AssignRideBuses = lazy(() => import(/* webpackChunkName: "Park.Admin.Pages" */ '../Park/AssignRideBuses'));
const ParkStaff = lazy(() => import(/* webpackChunkName: "Park.Admin.Staff" */ '../Park/ParkStaff'));
const ParkStaffList  = lazy(() => import(/* webpackChunkName: "Park.Admin.Staff" */ '../Park/ParkStaffList'));
const ParkManifest = lazy(() => import(/* webpackChunkName: "Park.Admin.Pages" */ '../Park/ParkManifest'));
const ParkInbox = lazy(() => import(/* webpackChunkName: "Park.Admin.Pages" */ '../Park/ParkInbox'))

// Park Agent
const AgentSignIn = lazy(() => import(/* webpackChunkName: "Park.Agent" */ '../Agent/AgentSignIn'));
const AgentDashboard = lazy(() => import(/* webpackChunkName: "Park.Agent" */ '../Agent/AgentDashboard'));
const AgentProfile = lazy(() => import(/* webpackChunkName: "Park.Agent" */ '../Agent/AgentProfile'));
const AgentBooking = lazy(() => import(/* webpackChunkName: "Park.Agent" */ '../Agent/AgentBooking'));

const appRef = createRef();
const authRef = createRef();

const AppRoute = ({component:Component, layout:Layout, ...properties}) => (
  <GuardedRoute {...properties} render={props => (
    <Layout ref={appRef}>
      <Component {...props}></Component>
    </Layout>
  )}></GuardedRoute>
);

const AuthRoute = ({component:Component, layout:Layout, ...properties}) => (
  <Route {...properties} render={props => (
    <Layout ref={authRef}>
      <Component {...props}></Component>
    </Layout>
  )}>
  </Route>
);

const App = () => {
  // Email Verification
  const emailVerification = useRecoilValue(withEmailAuth);
  const parkName = useRecoilValue(withParkSlug);
  console.log(`API TOKEN: `, getToken());
  console.log(`SLUG: `, parkName);
  console.log('Test form state:', emailVerification?.email_verified_at);


  const isEmailVerified = () => (emailVerification?.email_verified_at === null) ? false : true;

  const requireParkLogin = async (to, from, next) => {
    try {
      const useCredentials = await localForage.getItem('credentials');
      if (to.meta.parkAuth) {
        if (
          !_.isEmpty(useCredentials) 
          && (useCredentials?.token !== (undefined || null)) 
          && (useCredentials?.isLoggedIn !== (undefined || null))
          && (useCredentials?.type === "park_admin")
          && (useCredentials.isLoggedIn === true)
        ) {
          next();
        } else {
          next.redirect('/park/admin/signin');
        }
      } else {
        next();
      }
    } catch (err) {
      console.debug(err);
    }
  }

  const requireAgentLogin = async (to, from, next) => {
    try {
      const useCredentials = await localForage.getItem('credentials');
      if (to.meta.agentAuth) {
        if (
          !_.isEmpty(useCredentials) 
          && (useCredentials?.token !== (undefined || null)) 
          && (useCredentials?.isLoggedIn !== (undefined || null))
          && (useCredentials?.type === "agent")
          && (useCredentials.isLoggedIn === true)
        ) {
          next();
        } else {
          next.redirect('/park/staff/signin');
        }
      } else {
        next();
      }
    } catch (err) {
      console.debug(err);
    }
  }

  const requireEmailVerification = (to, from, next) => {
    if (to.meta.isEmailAuth) {
      if (isEmailVerified()) {
        next();
      } else {
        next.redirect('/park/admin/verify-email');
      }
    } else {
      next();
    }
  }

  return (
    <Router>
      <GuardProvider guards={[requireParkLogin, requireEmailVerification, requireAgentLogin]} loading={`Guard loading`} error={ErrorPage}>
        <TransitionGroup>
          <CSSTransition classNames="animate__animated animate__fadeInLeft" timeout={100}>
            <Suspense fallback={<div>Loading</div>}>
              <Switch>
                <GuardedRoute path="/" exact component={Home}></GuardedRoute>
                <AppRoute path="/park/admin/dashboard" exact layout={AppLayout} component={ParkAdminDashboard} meta={{ parkAuth: true, isEmailAuth: true }}></AppRoute>
                <AppRoute path="/park/:parkNameSlug/buses" exact layout={AppLayout} component={ParkBuses} meta={{ parkAuth: true, isEmailAuth: true }}></AppRoute>
                <AppRoute path="/park/:parkNameSlug/manage/buses" exact layout={AppLayout} component={ParkBusesList} meta={{ parkAuth: true, isEmailAuth: true }}></AppRoute>
                <AppRoute path="/park/:parkNameSlug/drivers" exact layout={AppLayout} component={ParkDrivers} meta={{ parkAuth: true, isEmailAuth: true }}></AppRoute>
                <AppRoute path="/park/:parkNameSlug/manage/drivers" exact layout={AppLayout} component={ParkDriversList} meta={{ parkAuth: true, isEmailAuth: true }}></AppRoute>
                <AppRoute path="/park/:parkNameSlug/schedules" exact layout={AppLayout} component={ParkRides} meta={{ parkAuth: true, isEmailAuth: true }}></AppRoute>
                <AppRoute path="/park/:parkNameSlug/manage/schedules" exact layout={AppLayout} component={ParkRidesList} meta={{ parkAuth: true, isEmailAuth: true }}></AppRoute>
                <AppRoute path="/park/:parkNameSlug/assign-schedules" exact layout={AppLayout} component={AssignRideBuses} meta={{ parkAuth: true, isEmailAuth: true }}></AppRoute>
                <AppRoute path="/park/:parknameSlug/staff" exact layout={AppLayout} component={ParkStaff} meta={{ parkAuth: true, isEmailAuth: true }}></AppRoute>
                <AppRoute path="/park/:parknameSlug/manage/staff" exact layout={AppLayout} component={ParkStaffList} meta={{ parkAuth: true, isEmailAuth: true }}></AppRoute>
                <AppRoute path="/park/:parknameSlug/manifest" exact layout={AppLayout} component={ParkManifest} meta={{ parkAuth: true, isEmailAuth: true }}></AppRoute>
                <AppRoute path="/park/:parknameSlug/inbox" exact layout={AppLayout} component={ParkInbox} meta={{ parkAuth: true, isEmailAuth: true }}></AppRoute>

                {/* Park Staff */}
                <AppRoute path="/park/staff/dashboard" exact layout={AgentLayout} component={AgentDashboard} meta={{ agentAuth: true }}></AppRoute>
                <AppRoute path="/park/staff/profile-:agentSlug" exact layout={AgentLayout} component={AgentProfile} meta={{ agentAuth: true }}></AppRoute>
                <AppRoute path="/park/staff/verify/booking-code" exact layout={AgentLayout} component={AgentBooking} meta={{ agentAuth: true }}></AppRoute>

                {/* Park Admin Auth */}
                <AuthRoute path="/signin" exact layout={AuthLayout} component={SignIn}></AuthRoute>
                <AuthRoute path="/signup" exact layout={AuthLayout} component={SignUp}></AuthRoute>
                <AuthRoute path="/park/admin/signin" exact layout={AuthLayout} component={parkAdminSignIn}></AuthRoute>
                <AuthRoute path="/park/admin/signin-otp" exact layout={AuthLayout} component={ParkAdminOTP} meta={{ parkAuth: true }}></AuthRoute>
                <AuthRoute path="/mile9ine/admin/signin" exact layout={AuthLayout} component={AdminSignin}></AuthRoute>

                 {/* Park Staff Auth */}
                 <AuthRoute path="/park/staff/signin" layout={AuthLayout} component={AgentSignIn}></AuthRoute>

                <GuardedRoute path="/register/park" exact component={CreatePark}></GuardedRoute>
                <GuardedRoute path="/park/admin/verify-email" exact component={ParkAdminVerify} meta={{ parkAuth: true }}></GuardedRoute>
                <GuardedRoute path="/park/admin/email-verified" exact component={ParkAdminEmailVerified} meta={{ parkAuth: true }}></GuardedRoute>
                <GuardedRoute path="*" exact component={ErrorPage}></GuardedRoute>
              </Switch>
            </Suspense>
          </CSSTransition>
        </TransitionGroup>
      </GuardProvider>
    </Router>
  );
}

export default App;
