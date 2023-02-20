const cronJob = require('node-cron');
const ObjectId = require('mongodb').ObjectId;

const { appDb } = require('../db/conn');

const RECUR_INTERVAL_IN_MIN = 30;

exports.initRecurJobs = () => {
  const scheduledRecurs = cronJob.schedule(
    `*/${RECUR_INTERVAL_IN_MIN} * * * *`,
    async () => {
      console.log("I'm executed on a schedule!");
      const currTime = Date.now() / 1000;
      const cursor = appDb()
        .collection('recurs')
        .find({
          nextRecurAt: {
            $gte: currTime - 60,
            $lte: currTime + 60,
          },
        });

      const recurs = await cursor.toArray();
      console.log(`currTime: ${currTime}, recurs: ${JSON.stringify(recurs)}`);
      const bulkOps = [];
      recurs.forEach((recur) => {
        const updatedRecur = {
          $set: {},
          $push: {},
        };

        updatedRecur.$set.nextRecurAt = recur.nextRecurAt + 86400; // 1 day
        updatedRecur.$push.currMonth = {
          quantity: recur.quantity,
          cost: recur.cost,
        };

        bulkOps.push({
          updateOne: {
            filter: { _id: new ObjectId(recur._id) },
            update: updatedRecur,
          },
        });
      });

      console.log('bulkOps.length', bulkOps.length);

      if (bulkOps.length) {
        const bulkOpsRes = await appDb()
          .collection('recurs')
          .bulkWrite(bulkOps);
        console.log(`bulkOpsRes: ${JSON.stringify(bulkOpsRes)}`);
      }
    }
  );

  scheduledRecurs.start();
};
