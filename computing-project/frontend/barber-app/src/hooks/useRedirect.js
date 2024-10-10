// src/hooks/useRedirect.js
import { useNavigate } from 'react-router-dom';

const useRedirect = () => {
  let navigate = useNavigate();

  const redirectTo = (path) => {
    navigate(path, { replace: true });
  };

  return redirectTo;
};

export default useRedirect;
