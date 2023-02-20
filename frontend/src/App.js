import { BrowserRouter, Routes, Route, Outlet } from 'react-router-dom';

import { AuthenticationProvider } from './utils/Authenticator';
import { Home } from './pages/Home';
import { Auth } from './pages/Auth';
import { AddRecur } from './pages/AddRecur';
import { Navbar } from './components/Navbar';
import './App.css';

const Layout = () => {
  return (
    <div className='app'>
      <Navbar />
      <Outlet />
    </div>
  );
};

function App() {
  return (
    <AuthenticationProvider>
      <BrowserRouter>
        <Routes>
          <Route path='/' element={<Layout />}>
            <Route index element={<Home />} />
            <Route path='/new' element={<AddRecur />} />
            <Route path='/sign-in' element={<Auth type='sign-in' />} />
            <Route path='/sign-up' element={<Auth type='sign-up' />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </AuthenticationProvider>
  );
}

export default App;
