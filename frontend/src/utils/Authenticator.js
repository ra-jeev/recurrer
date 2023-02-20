import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from 'react';

const DataContext = createContext(null);

const API_URL = process.env.REACT_APP_API_BASE_URL + '/users';

const handleAuth = async (endpoint, data) => {
  const res = await fetch(`${API_URL}${endpoint}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });

  console.log(`For ${endpoint}, server returned:`, res);

  if (res.ok) {
    const user = await res.json();

    localStorage.setItem('user', JSON.stringify(user));

    return user;
  }
};

export function AuthenticationProvider({ children }) {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  const signIn = useCallback(async (email, password) => {
    const userData = await handleAuth('/login', { email, password });
    if (userData) {
      setUser(userData);
    }
  }, []);

  const signUp = useCallback(async (email, password, name) => {
    const userData = await handleAuth('/', { email, password, name });
    if (userData) {
      setUser(userData);
    }
  }, []);

  const signOut = useCallback(() => {
    localStorage.removeItem('user');
    setUser(null);
  }, []);

  return (
    <DataContext.Provider
      value={{
        user,
        signIn,
        signUp,
        signOut,
      }}
    >
      {children}
    </DataContext.Provider>
  );
}

export function useAuthenticator() {
  const authenticator = useContext(DataContext);
  if (!authenticator) {
    throw new Error(
      `No authenticator context found. Did you call useAuthenticator() inside of a <AuthenticatorProvider />?`
    );
  }

  return authenticator;
}
