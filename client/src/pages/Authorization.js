import React, { useEffect } from 'react';
import { useContext } from 'react';
import { UserContext } from '../functionality/UserContext';
import AuthCard from '../components/Authorization/AuthCard';

const Authorization = () => {
  const { login } = useContext(UserContext);
  
  useEffect(() => {
   login()
  }, [login]);

  return (
    <div className="">
        <AuthCard />
    </div>
  );
};

export default Authorization;