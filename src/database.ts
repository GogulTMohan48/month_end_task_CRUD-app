

import SQLite from 'react-native-sqlite-storage';

const db = SQLite.openDatabase(
  {
    name: 'taskDB',
    location: 'default',
  },
  () => {},
  error => {
    console.log(error);
  }
);

export const createTable = () => {
  db.transaction(txn => {
    txn.executeSql(
      `CREATE TABLE IF NOT EXISTS tasks (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        taskName TEXT,
        subject TEXT,
        date TEXT,
        beginningTime TEXT,
        finishedTime TEXT
      );`,
      [],
      () => {
        console.log('Table created successfully');
      },
      error => {
        console.log('Error creating table: ', error);
      }
    );
  });
};

export const addTaskToDB = (task) => {
  db.transaction(txn => {
    txn.executeSql(
      `INSERT INTO tasks (taskName, subject, date, beginningTime, finishedTime) VALUES (?, ?, ?, ?, ?)`,
      [task.taskName, task.subject, task.date, task.beginningTime, task.finishedTime],
      () => {
        console.log('Task added successfully');
      },
      error => {
        console.log('Error adding task: ', error);
      }
    );
  });
};

export const fetchTasksFromDB = (callback) => {
  db.transaction(txn => {
    txn.executeSql(
      `SELECT * FROM tasks`,
      [],
      (tx, results) => {
        let tasks = [];
        for (let i = 0; i < results.rows.length; i++) {
          tasks.push(results.rows.item(i));
        }
        callback(tasks);
      },
      error => {
        console.log('Error fetching tasks: ', error);
      }
    );
  });
};

export const deleteTaskFromDB = (id) => {
  db.transaction(txn => {
    txn.executeSql(
      `DELETE FROM tasks WHERE id = ?`,
      [id],
      () => {
        console.log('Task deleted successfully');
      },
      error => {
        console.log('Error deleting task: ', error);
      }
    );
  });
};

export const updateTaskInDB = (task) => {
  db.transaction(txn => {
    txn.executeSql(
      `UPDATE tasks SET taskName = ?, subject = ?, date = ?, beginningTime = ?, finishedTime = ? WHERE id = ?`,
      [task.taskName, task.subject, task.date, task.beginningTime, task.finishedTime, task.id],
      () => {
        console.log('Task updated successfully');
      },
      error => {
        console.log('Error updating task: ', error);
      }
    );
  });
};
