const { appDb } = require('../db/conn');

// This help convert the id from string to ObjectId for the _id.
const ObjectId = require('mongodb').ObjectId;

const getRecurs = async (req, res) => {
  console.log(`get recurs called: owner_id: ${req.user.id}`);
  const recurCursor = appDb()
    .collection('recurs')
    .find({ owner_id: req.user.id });

  const recurs = await recurCursor.toArray();

  // console.log(`findRes: ${JSON.stringify(recurs, null, 2)}`);

  res.status(200).json(recurs);
};

const createRecur = async (req, res) => {
  const data = req.body;
  console.log(`create recur called: ${JSON.stringify(data, null, 2)}`);
  console.log(`also user is: ${JSON.stringify(req.user, null, 2)}`);
  if (!data.name || !data.frequency) {
    res.status(400);
    throw new Error(`Recur ${!data.name ? 'name' : 'frequency'} missing`);
  }

  const timeZone = req.body.timeZone;

  const options = {
    timeZone,
    year: 'numeric',
    month: 'numeric',
    day: 'numeric',
    hour: 'numeric',
    minute: 'numeric',
    second: 'numeric',
  };

  const date = new Date();

  const formatter = new Intl.DateTimeFormat('en', options);
  const userTime = new Date(formatter.format(date));
  console.log('utcTime is', testTime.getTime());
  console.log('formattedTime is', formatter.format(date));
  console.log('userTime is', userTime.getTime());

  userTime.setDate(userTime.getDate() + 1);
  userTime.setHours(0, 0, 0, 0);

  console.log('nextRecurPerLocal', userTime.getTime());

  const nextRecurAt = userTime.getTime() / 1000;

  const insertRes = await appDb()
    .collection('recurs')
    .insertOne({
      owner_id: req.user.id,
      ...req.body,
      createdAt: date,
      updatedAt: date,
      startDate: date.getDate(),
      nextRecurAt,
    });

  console.log(`insertRes: ${insertRes}`);

  res.status(200).json(insertRes);
};

const updateRecur = async (req, res) => {
  const data = req.body;
  const recurId = req.params.id;
  console.log(
    `updateRecur called for ${recurId}: ${JSON.stringify(data, null, 2)}`
  );

  if (!['recur', 'entry'].includes(data.type)) {
    res.status(400);
    throw new Error('Missing update type');
  }

  const recur = await appDb()
    .collection('recurs')
    .findOne({ _id: new ObjectId(recurId) });
  if (!recur) {
    res.status(400);
    throw new Error('Recur not found');
  } else if (recur.owner_id !== req.user.id) {
    res.status(401);
    throw new Error('User not authorized');
  }

  const update = { $set: {} };
  if (data.type === 'entry') {
    if (data.date >= recur.startDate) {
      update.$set[`currMonth.${data.date - recur.startDate}`] = {
        quantity: data.quantity,
        cost: data.cost,
      };
    } else {
      update.$set['startDate'] = data.date;
      update.$push = {
        currMonth: {
          $position: 0,
          $each: [
            {
              quantity: data.quantity,
              cost: data.cost,
            },
          ],
        },
      };

      for (let i = 1; i < recur.startDate - data.date; i++) {
        update.$push[`currMonth`].$each.push({ quantity: 0, cost: data.cost });
      }
    }
  } else if (data.type === 'recur') {
    update.$set = {};
    if (data.name) {
      update.$set.name = data.name;
    }

    if (data.cost) {
      update.$set.cost = data.cost;
    }

    if (data.quantity) {
      update.$set.quantity = data.quantity;
    }
  }

  const updateRes = await appDb()
    .collection('recurs')
    .updateOne(
      {
        _id: new ObjectId(recurId),
      },
      update
    );

  console.log(`result of update op: ${JSON.stringify(updateRes, null, 2)}`);

  res.status(200).json(updateRes);
};

const deleteRecur = async (req, res) => {
  console.log('delete recur called');
  res.status(200);
};

module.exports = {
  getRecurs,
  createRecur,
  updateRecur,
  deleteRecur,
};
