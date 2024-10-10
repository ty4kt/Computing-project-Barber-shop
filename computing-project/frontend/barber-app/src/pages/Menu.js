import Layout from "../components/Layout";
import { useLocation, useNavigate } from "react-router-dom";
import BottomBar from "../components/BottomBar";
import Logout from "./Logout";
import { useUser } from "../contexts/UserContext";

const Menu = () => {
  const navigate = useNavigate();
  const { user } = useUser();

  return (
    <>
      <Layout backgroundColor={`bg-[#020202]`} centerContent={true}>
        <div className="text-left text-white p-5">
          <h1 className="text-4xl font-bold mt-4">MENU</h1>
          <h1 className="text-2xl font-bold mt-4">Hello, {user.full_name}!</h1>

            
          <div className="">
            <h1 className="text-2xl font-medium mt-8">Account</h1>
            <div
              className="flex items-center space-x-4 p-5 bg-[#121212]"
              onClick={() => navigate("/account-setup")}
            >
              <i class="fa-solid fa-person"></i>
              <h1>Setup Personal Account</h1>
            </div>
            <div
              className="flex items-center space-x-4 p-5 bg-[#121212] mt-2"
              onClick={() => navigate("/barber-setup")}
            >
              <i class="fa-solid fa-shuffle"></i>
              <h1>Setup Barber Account</h1>
            </div>
            <div
              className="flex items-center space-x-4 p-5 bg-[#121212] mt-2"
              onClick={() => navigate("/logout")}
            >
              <i class="fa-solid fa-right-from-bracket"></i>
              <h1>Logout</h1>
            </div>
          </div>
        </div>
        <BottomBar />
      </Layout>
      ;
    </>
  );
};

export default Menu;
