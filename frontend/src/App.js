import { Route, RouterProvider, createBrowserRouter, createRoutesFromElements } from "react-router-dom";
import Layout from "./components/Layout";
import Home from './pages/Home';
import Login, {loginAction} from './pages/Login';
import Signup, { signupAction } from './pages/Signup'
import PatientDash, {loader as dashLoader} from './pages/Patient/PatientDash'
import Error from "./pages/Error";
import { RoleProvider } from "./utils/ThemeRole";
import HcpDash, {loader as hcpLoader} from "./pages/HealthCareProvider/HcpDash";
import ProtectedRoutes from "./utils/ProtectedRoutes";
import './index.css';


function App() {
  const router = createBrowserRouter(createRoutesFromElements(
    <Route path='/' element={<Layout />}>
      <Route index element={<Home />} />
      <Route path='login' element={<Login />} action={loginAction} errorElement={<Error />}/>
      <Route path='patientDash' loader={dashLoader} errorElement={<Error />} element={<ProtectedRoutes requiredRole={'patient'} ><PatientDash /></ProtectedRoutes>}/>
      <Route path='hcpDash' loader={hcpLoader} errorElement={<Error />} element={<ProtectedRoutes requiredRole={'healthcare_provider'}><HcpDash /></ProtectedRoutes>}/>
      <Route path='signup' element={<Signup />} action={signupAction} errorElement={<Error />}/>
    </Route>
  ))
  return (
    <RoleProvider>
      <RouterProvider router={router} />
    </RoleProvider>

  );
}

export default App;
