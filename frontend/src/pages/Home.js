import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaPlusCircle } from 'react-icons/fa';

import { getRecurs } from '../api/recur';
import { Button } from '../components/Button';
import AddImage from '../assets/images/add-notes.svg';
import './Home.css';
import { useAuthenticator } from '../utils/Authenticator';
import { Recur } from '../components/Recur';

export const Home = () => {
  const [recurs, setRecurs] = useState([]);
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();
  const { user } = useAuthenticator();

  useEffect(() => {
    const fetchRecurs = async () => {
      setLoading(true);
      const res = await getRecurs(user.token);
      if (res) {
        setRecurs(res);
      }

      setLoading(false);
    };

    if (user) {
      fetchRecurs();
    } else {
      setRecurs([]);
    }
  }, [user]);

  const createRecur = () => {
    if (user) {
      navigate('/new');
    } else {
      navigate('/sign-in', { state: { next: '/new' } });
    }
  };

  if (loading) {
    return <div className='home align-y-center'>Loading...</div>;
  }

  if (!recurs.length) {
    return (
      <div className='home align-y-center'>
        <img src={AddImage} alt='No recurs found, add recur' />
        <div className='no-data'>No recurs created</div>
        <Button type='button' className='btn btn-primary' onClick={createRecur}>
          <FaPlusCircle /> Create recur
        </Button>
      </div>
    );
  }

  return (
    <div className='home'>
      {recurs.map((recur) => {
        return <Recur key={recur._id} recur={recur} />;
      })}
    </div>
  );
};
