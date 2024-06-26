import { useState, useEffect } from 'react';
import { useCookies } from 'react-cookie';
import { jwtDecode } from 'jwt-decode';

const useAuthToken = (cookieName) => {
  const [cookies] = useCookies([cookieName]);
  const [localToken, setToken] = useState(null);
  const [isTokenValid, setIsTokenValid] = useState(true);

  useEffect(() => {
    const currentToken = cookies[cookieName];

    if (currentToken) {
      try {
        jwtDecode(currentToken);

        setToken(currentToken);
      } catch (error) {
        console.error('Token invalide', error);
        setIsTokenValid(false);
      }
    } else {
      setIsTokenValid(false);
    }
  }, [cookies, cookieName]);

  return { token: localToken, isTokenValid };
};

export default useAuthToken;
