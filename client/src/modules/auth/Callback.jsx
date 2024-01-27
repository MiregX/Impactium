import { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useUser } from '../../class/User';
import { useLanguage } from '../language/Lang';

const Callback = ({ previousPage }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { setToken, setIsUserLoaded, referal } = useUser();
  const { setLanguage } = useLanguage();

  useEffect(() => {
    setIsUserLoaded(false);
    const queryParams = new URLSearchParams(location.search);
    const code = queryParams.get('code');
    const token = queryParams.get('token');

    if (token) {
      setIsUserLoaded(true);
      setToken(token)
      return navigate(previousPage || '/');
    }

    if (!code) return navigate(previousPage || '/');

    fetch(`https://impactium.fun/oauth2/callback/discord?code=${code}${referal ? '&ref=' + referal : ''}`, {
      method: 'GET'
    })
      .then(response => response.json())
      .then(result => {
        setToken(result.token);
        setLanguage(result.locale);
        navigate(previousPage || '/');
        setIsUserLoaded(true);
      })
      .catch(error => {
        navigate(previousPage || '/');
      });
  }, [setIsUserLoaded]);

  return null;
};

export default Callback;