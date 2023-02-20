import { useRef, useState, useEffect } from 'react';
import { NavLink } from 'react-router-dom';
import { TiArrowRepeatOutline } from 'react-icons/ti';
import {
  FaBars,
  FaPlusCircle,
  FaSignInAlt,
  FaSignOutAlt,
} from 'react-icons/fa';

import { useAuthenticator } from '../utils/Authenticator';
import './Navbar.css';

export const Navbar = () => {
  const menuListRef = useRef();
  const menuBtnRef = useRef();
  const [showMenu, setShowMenu] = useState(false);

  const { user, signOut } = useAuthenticator();

  const handleClickOutside = (e) => {
    if (!menuListRef.current.contains(e.target)) {
      if (menuBtnRef.current.contains(e.target)) {
        setShowMenu(!showMenu);
      } else if (showMenu) {
        setShowMenu(false);
      }
    }
  };

  useEffect(() => {
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  });

  return (
    <nav className='navbar '>
      <NavLink className='logo nav-link' to='/'>
        <TiArrowRepeatOutline /> Recurrer
      </NavLink>

      <div ref={menuBtnRef} className={`menu${showMenu ? ' menu-active' : ''}`}>
        <FaBars className='menu-btn' />
        <ul ref={menuListRef}>
          {user ? (
            <>
              <li>
                <NavLink
                  className='nav-btn'
                  to='/new'
                  onClick={() => setShowMenu(false)}
                >
                  <FaPlusCircle /> Recur
                </NavLink>
              </li>
              <li>
                <NavLink
                  type='button'
                  className='nav-btn'
                  onClick={() => {
                    signOut();
                    setShowMenu(false);
                  }}
                >
                  <FaSignOutAlt /> Sign out
                </NavLink>
              </li>
            </>
          ) : (
            <>
              <li>
                <NavLink
                  className='nav-btn'
                  to='/sign-up'
                  onClick={() => setShowMenu(false)}
                >
                  <FaSignInAlt /> Sign up
                </NavLink>
              </li>
              <li>
                <NavLink
                  className='nav-btn'
                  to='/sign-in'
                  onClick={() => setShowMenu(false)}
                >
                  <FaSignInAlt /> Sign in
                </NavLink>
              </li>
            </>
          )}
        </ul>
      </div>
    </nav>
  );
};
