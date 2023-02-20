import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { useAuthenticator } from '../utils/Authenticator';
import { createRecur } from '../api/recur';
import { Button } from '../components/Button';
import { Card } from '../components/Card';
import './AddRecur.css';

export const AddRecur = () => {
  const FREQUENCY = {
    SELECT: 'Select frequency',
    DAILY: 'DAILY',
    WEEKLY: 'WEEKLY',
    MONTHLY: 'MONTHLY',
  };

  // For now frequency is DAILy only
  const INITIAL_STATE = {
    name: '',
    quantity: '',
    frequency: FREQUENCY.DAILY,
    cost: '',
    unit: '',
  };

  const [formState, setFormState] = useState(INITIAL_STATE);

  const navigate = useNavigate();
  const { user } = useAuthenticator();

  const setInput = (key, value) => {
    setFormState({ ...formState, [key]: value });
  };

  const onSubmit = async (e) => {
    e.preventDefault();

    const formData = {
      name: formState.name.trim(),
      frequency: formState.frequency,
    };

    if (
      !formData.name ||
      formData.frequency === FREQUENCY.SELECT ||
      (formState.quantity && (!formState.cost || !formState.unit))
    ) {
      alert('Please fill all fields');
      return;
    }

    if (formState.cost) {
      formData.cost = parseFloat(formState.cost);
    }

    if (formState.quantity) {
      formData.quantity = parseFloat(formState.quantity);
    }

    formData.timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;

    try {
      await createRecur(formData, user.token);
      setFormState(INITIAL_STATE);

      navigate('/', { replace: true });
    } catch (error) {
      console.log('failed to create recur');
    }
  };

  return (
    <div className='add-container'>
      <Card title='Add Recur'>
        <form onSubmit={onSubmit}>
          <div className='form-group'>
            <label htmlFor='name'>Name</label>
            <input
              type='text'
              name='text'
              id='name'
              placeholder='Recur name, e.g. Milk / Helper'
              value={formState.name}
              onChange={(e) => setInput('name', e.target.value)}
            />
          </div>
          {/* <div className='form-group'>
            <label htmlFor='frequency'>Frequency</label>
            <select
              name='frequency'
              id='frequency'
              value={formState.frequency}
              onChange={(e) => setInput('frequency', e.target.value)}
            >
              {Object.keys(FREQUENCY).map((f) => {
                return <option key={`freq-${f}`}>{FREQUENCY[f]}</option>;
              })}
            </select>
          </div> */}
          <div className='form-group'>
            <label htmlFor='quantity'>Quantity / Number of units</label>
            <input
              type='number'
              name='quantity'
              id='quantity'
              placeholder='e.g. 2.5'
              value={formState.quantity}
              onChange={(e) => setInput('quantity', e.target.value)}
            />
          </div>
          <div className='form-group'>
            <label htmlFor='unit'>Unit abbreviation / name</label>
            <input
              type='text'
              name='unit'
              id='unit'
              placeholder='e.g. kg / l / oz'
              value={formState.unit}
              onChange={(e) => setInput('unit', e.target.value)}
            />
          </div>
          <div className='form-group'>
            <label htmlFor='cost'>Cost per unit</label>
            <input
              type='number'
              name='cost'
              id='cost'
              placeholder='Cost'
              value={formState.cost}
              onChange={(e) => setInput('cost', e.target.value)}
            />
          </div>
          <div className='form-buttons'>
            <Button
              className='btn btn-block btn-outlined'
              type='button'
              onClick={() => setFormState(INITIAL_STATE)}
            >
              Reset
            </Button>
            <Button className='btn btn-block btn-primary' type='submit'>
              Create recur
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
};
