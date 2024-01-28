import { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useUser } from '../../class/User';
import { useLanguage } from '../language/Lang';

const Callback = ({ previousPage }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { setToken, referal } = useUser();
  const { setLanguage } = useLanguage();

  useEffect(() => {
    const queryParams = new URLSearchParams(location.search);
    const code = queryParams.get('code');
    const token = queryParams.get('token') || false;
    const lang = queryParams.get('token') || false;

    if (!code) {
      if (token)
        setToken(token);
      if (lang)
        setLanguage(lang);
      
      return navigate('/');
    }
  
    fetch(`https://impactium.fun/oauth2/callback/discord?code=${code}${referal ? '&ref=' + referal : ''}`, {
      method: 'GET'
    })
      .then(response => response.json())
      .then(result => {
        setToken(result.token);
        setLanguage(result.locale);
        navigate('/');
      })
      .catch(error => {
        setToken(false);
        navigate('/');
      });
  }, []);
  

  return null;
};

export default Callback;