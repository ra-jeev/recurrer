import { useEffect, useState } from 'react';
import { useNavigate, NavLink, useLocation } from 'react-router-dom';

import { useAuthenticator } from '../utils/Authenticator';
import { Card } from '../components/Card';
import './Auth.css';

export const Auth = ({ type }) => {
  const INITIAL_STATE = { email: '', password: '', name: '' };
  const [formState, setFormState] = useState(INITIAL_STATE);

  const { signIn, signUp, user } = useAuthenticator();

  const navigate = useNavigate();
  const location = useLocation();
  const isCreate = type === 'sign-up';

  console.log('location.state', location.state);

  const setInput = (key, value) => {
    setFormState({ ...formState, [key]: value });
  };

  useEffect(() => {
    if (user) {
      if (location.state?.next) {
        navigate(location.state?.next, { replace: true });
      } else {
        navigate('/', { replace: true });
      }
    }
  }, [user]);

  const onSubmit = async (e) => {
    e.preventDefault();

    const name = formState.name.trim();
    const email = formState.email.trim();
    const password = formState.password.trim();
    if (!email || !password || (isCreate && !name)) {
      return;
    }

    if (isCreate) {
      await signUp(email, password, name);
    } else {
      await signIn(email, password);
    }
  };

  return (
    <div className='auth-container'>
      <Card title={type === 'sign-up' ? 'Create account' : 'Sign in'}>
        <form onSubmit={onSubmit}>
          <div className='form-group'>
            <label htmlFor='email'>Email</label>
            <input
              type='email'
              name='email'
              id='email'
              placeholder='Enter your email address'
              value={formState.email}
              onChange={(e) => setInput('email', e.target.value)}
            />
          </div>
          <div className='form-group'>
            <label htmlFor='password'>Password</label>
            <input
              type='password'
              name='password'
              id='password'
              placeholder={
                type === 'sign-up'
                  ? 'Create your password'
                  : 'Enter your password'
              }
              value={formState.password}
              onChange={(e) => setInput('password', e.target.value)}
            />
          </div>
          {type === 'sign-up' && (
            <div className='form-group'>
              <label htmlFor='name'>Name</label>
              <input
                type='text'
                name='text'
                id='name'
                placeholder='Enter your name'
                value={formState.name}
                onChange={(e) => setInput('name', e.target.value)}
              />
            </div>
          )}
          <div className='form-buttons'>
            <button className='btn btn-block btn-primary' type='submit'>
              {type === 'sign-up' ? 'Create account' : 'Sign in'}
            </button>
          </div>
        </form>
      </Card>
      <div className='auth-footer'>
        {isCreate ? (
          <>
            Already have an account?{' '}
            <NavLink to='/sign-in' state={location.state}>
              Sign in now
            </NavLink>
          </>
        ) : (
          <>
            Don't have an account?{' '}
            <NavLink to='/sign-up' state={location.state}>
              Create one now
            </NavLink>
          </>
        )}
      </div>
    </div>
  );
};
