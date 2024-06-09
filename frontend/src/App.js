import { Route, RouterProvider, createBrowserRouter, createRoutesFromElements } from "react-router-dom";
import Layout from "./components/Layout";
import Home from './pages/Home';
import Login from './pages/Login';
import { RoleProvider } from "./utils/ThemeRole";


function App() {
  const router = createBrowserRouter(createRoutesFromElements(
    <Route path='/' element={<Layout />}>
      <Route index element={<Home />} />
      <Route path='login' element={<Login />} />
    </Route>
  ))
  return (
    <RoleProvider>
      <RouterProvider router={router} />
    </RoleProvider>

  );
}

export default App;
