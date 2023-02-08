import { useContext } from 'react';
import { Link } from 'react-router-dom';
import { Auth } from 'aws-amplify';
import cls from './Navbar.module.css';
import { useUserStore } from '../../store/user';

const Navbar = () => {
  const isAuth = useUserStore((state) => state.isAuth);
  const setIsAuth = useUserStore((state) => state.setIsAuth);

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
  };

  if (!isAuth) return <div></div>;

  return (
    <div className={cls.Navbar}>
      TRADELANES
      <div className={cls.links}>
        <Link to="/">Main</Link>
        <Link to="/shipments">Shipments</Link>
      </div>
      <button onClick={logout}>Logout</button>
      <button onClick={deleteUser}>Delete User</button>
    </div>
  );
};

export default Navbar;
