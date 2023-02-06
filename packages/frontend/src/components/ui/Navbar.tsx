import { useContext } from 'react';
import { Link } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';
import { Auth } from 'aws-amplify';

const Navbar = () => {
  const { isAuth, setIsAuth } = useContext(AuthContext);

  const logout = async () => {
    try {
      await Auth.signOut();
      setIsAuth(false);
    } catch (error) {
      console.log('error signing out: ', error);
    }
  };

  const deleteUser = async () => {
    try {
      const result = await Auth.deleteUser();
      console.log(result);
    } catch (error) {
      console.log('Error deleting user', error);
    }
  }

  if (!isAuth) return <div></div>;

  return (
    <div className="navbar">
      <div className="navbar__links">
        <Link to="/">Main</Link>
        <Link to="/shipments">Shipments</Link>
        <button onClick={logout}>Logout</button>
        <button onClick={deleteUser}>Delete User</button>
      </div>
    </div>
  );
};

export default Navbar;