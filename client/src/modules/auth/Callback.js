import { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useUser } from '../../class/User';
import { useLanguage } from '../Lang';

const Callback = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { setToken, setIsUserLoaded, isUserLoaded } = useUser();
  const { setLanguage } = useLanguage();

  useEffect(() => {
    setIsUserLoaded(false); // тут устанавливаю что юзер не готов
    const queryParams = new URLSearchParams(location.search);
    const code = queryParams.get('code');

    if (!code)
      return navigate('/');

    fetch(`https://impactium.fun/oauth2/callback/discord?code=${code}&api=${true}`, {
      method: 'GET'
    })
      .then(response => response.json())
      .then(result => {
        setToken(result.token);
        setLanguage(result.locale);
      })
      .catch(error => {
        console.error('Error fetching user data:', error);
      });
  }, [setIsUserLoaded]);

  return null;
};

export default Callback;