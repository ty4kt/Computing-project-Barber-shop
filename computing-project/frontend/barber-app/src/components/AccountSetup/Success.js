import { useUser } from "../../contexts/UserContext";
import useRedirect from "../../hooks/useRedirect";

import Button from "../Button";
import Logo from "../Logo";

const Success = () => {
  const { refreshUserData } = useUser();
  const redirectTo = useRedirect();

  const handleContinue = async () => {
    await refreshUserData();
    redirectTo("/dashboard");
  };

  return (
    <div className="bg-black p-5 text-white">
      <Logo />
      <h1 className="text-xl font-bold mb-3">Success</h1>
      <p>Your account has been successfully set up!</p>
      <p>Feel free to explore the app and try it out.</p>

      <Button
        bg="bg-barber-blue hover:bg-blue-700"
        modifyClass={`w-full py-3 mt-5 rounded-lg font-bold transition`}
        text={`Continue`}
        onClick={handleContinue}
      />
    </div>
  );
};

export default Success;
