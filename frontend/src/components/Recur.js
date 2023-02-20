import { useEffect, useState } from 'react';
import { FaCheckCircle, FaEdit } from 'react-icons/fa';

import { useAuthenticator } from '../utils/Authenticator';

import { updateRecur } from '../api/recur';
import { Button } from './Button';
import { Card } from './Card';
import './Recur.css';

let currencyFormatter;
const formatCurrency = (amount) => {
  if (!currencyFormatter) {
    currencyFormatter = new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 1,
    });
  }

  return currencyFormatter.format(amount);
};

const EditRecurDialog = ({ show, recur, entry, onCancel }) => {
  const [formState, setFormState] = useState({
    quantity: '',
    cost: '',
  });

  const { user } = useAuthenticator();

  useEffect(() => {
    if (entry) {
      setFormState({
        quantity: entry.quantity || recur.quantity,
        cost: entry.cost || recur.cost,
      });
    }
  }, [entry, recur]);

  const setInput = (key, value) => {
    setFormState({ ...formState, [key]: value });
  };

  const onSubmit = async (e) => {
    e.preventDefault();

    if (
      formState.quantity === entry.quantity &&
      formState.cost === entry.cost
    ) {
      onCancel();
      return;
    }

    formState.cost = parseFloat(formState.cost);
    formState.quantity = parseFloat(formState.quantity);

    try {
      await updateRecur(
        recur._id,
        { type: 'entry', date: entry.date, ...formState },
        user.token
      );
    } catch (error) {
      console.log('failed to update recur entry');
    }

    onCancel();
  };

  return (
    <div className={`recur-overlay${show ? ' animated-modal' : ''}`}>
      <Card className='recur-edit-card'>
        <h3 className='recur-title'>Edit Recur Entry</h3>
        <form onSubmit={onSubmit}>
          <div className='form-group'>
            <label htmlFor='quantity'>Quantity</label>
            <input
              type='number'
              name='quantity'
              id='quantity'
              placeholder='Enter updated quantity'
              value={formState.quantity}
              onChange={(e) => setInput('quantity', e.target.value)}
            />
          </div>
          <div className='form-group'>
            <label htmlFor='cost'>Cost</label>
            <input
              type='number'
              name='cost'
              id='cost'
              placeholder='Enter updated cost'
              value={formState.cost}
              onChange={(e) => setInput('cost', e.target.value)}
            />
          </div>
          <div className='form-buttons'>
            <Button
              className='btn btn-block btn-outlined'
              type='button'
              onClick={onCancel}
            >
              Cancel
            </Button>
            <Button className='btn btn-block btn-primary' type='submit'>
              Update
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
};

export const Recur = ({ recur }) => {
  const [totalCost, setTotalCost] = useState(0);
  const [totalQuantity, setTotalQuantity] = useState(0);
  const [calendar, setCalendar] = useState([]);
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [entryInEdit, setEntryInEdit] = useState(null);

  const daysOfWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  useEffect(() => {
    const createCalendar = () => {
      const date = new Date();
      date.setDate(1);
      const startingDayOfWeek = date.getDay();
      let lastDate;
      if (date.getMonth() === 1) {
        lastDate = date.getFullYear() % 4 === 0 ? 29 : 28;
      } else if ([3, 5, 8, 10].includes(date.getMonth())) {
        lastDate = 30;
      } else {
        lastDate = 31;
      }

      const startDate = recur.startDate;
      const recurEntries = recur.currMonth;
      let pickIndex = 0;

      const cal = [];
      let currDate = 1;
      for (let i = 0; i < 6; i++) {
        cal.push([]);
        for (let j = 0; j < 7; j++) {
          if (
            (cal.length === 1 && j >= startingDayOfWeek) ||
            (cal.length > 1 && currDate <= lastDate)
          ) {
            const obj = { date: currDate };
            if (recurEntries) {
              if (currDate >= startDate && pickIndex < recurEntries.length) {
                obj.quantity = recurEntries[pickIndex].quantity;
                obj.cost = recurEntries[pickIndex].cost;
                obj.index = pickIndex;
                if (obj.quantity) {
                  obj.style = {
                    color:
                      obj.quantity === recur.quantity ? 'limegreen' : 'orange',
                  };
                }
                pickIndex++;
              }
            }

            cal[cal.length - 1].push(obj);
            currDate++;
          } else {
            cal[cal.length - 1].push({});
          }
        }

        if (!cal[cal.length - 1][6].date) {
          break;
        }
      }

      setCalendar(cal);
    };

    if (recur) {
      createCalendar();
    }
  }, [recur]);

  useEffect(() => {
    if (recur.currMonth) {
      let cost = 0;
      let quantity = 0;
      for (const item of recur.currMonth) {
        cost += item.cost * item.quantity;
        quantity += item.quantity;
      }

      setTotalCost(cost);
      setTotalQuantity(quantity);
    }
  }, [recur]);

  const editRecurEntry = async (entry) => {
    console.log('editRecurEntry called:', entry);
    document.body.style.overflow = 'hidden';
    setEntryInEdit({ ...entry });
    setShowEditDialog(true);
  };

  const hideDialog = () => {
    document.body.style.overflow = 'auto';
    setShowEditDialog(false);
    setEntryInEdit(null);
  };

  return (
    <>
      <Card>
        <div className='recur-details'>
          <h2 className='recur-title'>{recur.name}</h2>
          <span>
            {recur.quantity}
            {recur.unit} @ {formatCurrency(recur.cost)}/{recur.unit},{' '}
            {recur.frequency}
          </span>
        </div>
        <div className='recur-details'>
          <div className='recur-details-column'>
            <h3 className='recur-subtitle'>This month</h3>
            <p>Cost: {formatCurrency(totalCost)}</p>
            <p>
              Quantity: {totalQuantity}
              {recur.unit}
            </p>
          </div>
          <div className='recur-details-column'>
            <h3 className='recur-subtitle'>Prev month</h3>
            <p>Cost: {recur.prevMonthCost || '--'}</p>
            <p>Quantity: {recur.prevMonthQuantity || '--'}</p>
          </div>
        </div>

        <div>
          <div className='recur-items-row'>
            {daysOfWeek.map((day) => {
              return (
                <div key={`${recur.name}-${day}`} className='recur-item'>
                  {day}
                </div>
              );
            })}
          </div>
          {calendar.map((week, row) => {
            return (
              <div key={`${recur.name}-${row}`} className='recur-items-row'>
                {week.map((entry, col) => {
                  return (
                    <div
                      key={`${recur.name}-${row}${col}`}
                      className='recur-item'
                    >
                      {entry.date && (
                        <>
                          <span className='recur-item-date'>{entry.date}</span>

                          <FaEdit
                            className='recur-item-edit'
                            onClick={() => editRecurEntry(entry)}
                          />

                          {entry.quantity > 0 && (
                            <>
                              <FaCheckCircle style={entry.style} />
                              {entry.quantity !== recur.quantity && (
                                <span
                                  className='recur-item-quantity'
                                  style={entry.style}
                                >
                                  {entry.quantity}
                                </span>
                              )}
                            </>
                          )}
                        </>
                      )}
                    </div>
                  );
                })}
              </div>
            );
          })}
        </div>
      </Card>

      <EditRecurDialog
        show={showEditDialog}
        recur={recur}
        entry={entryInEdit}
        onCancel={hideDialog}
      />
    </>
  );
};
