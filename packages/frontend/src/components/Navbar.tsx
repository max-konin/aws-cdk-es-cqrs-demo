import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

const Navbar = () => {
  const {isAuth, setIsAuth} = useContext(AuthContext);

  const logout = () => {
    setIsAuth(false);
    localStorage.removeItem('auth');
  }

  if (!isAuth) return <div></div>;

  return (
      <div className='navbar'>
        <div className='navbar__links'>
          <Link to="/">Main</Link>
          <Link to="/shipments">Shipments</Link>
          <button onClick={logout}>Logout</button>
        </div>
      </div>
  );
};

export default Navbar;