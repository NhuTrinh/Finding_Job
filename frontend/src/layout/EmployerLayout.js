import { Outlet } from "react-router-dom";
import Header from '../components/Header.js'

const EmployerLayout = () => (
    <>
    <Header />
    <main>
      <Outlet />
    </main>
  </>
);

export default EmployerLayout;
