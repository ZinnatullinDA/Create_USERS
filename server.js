const express = require('express');
const bodyParser = require('body-parser');
const cors = require("cors")
const { Pool } = require('pg');
const app = express();
app.use(bodyParser.json());
app.use(cors())
const port = 3007;
// Создаем пулл соединений к базе данных
const pool = new Pool({
    user: "your_name",
    host: "your_host",
    database: "your_database",
    password: "your_password", 
    port: 6432,
    ssl: {
        rejectUnauthorized: false
    },
});
pool.connect();

// добавление пользователей в бд
app.post('/users',  (req, res) => {
  const { name, surname, age} = req.body;

  
  if (!name || !surname || !age) {
    res.status(400).send('Bad Request');
    return;
  }

  try {
    const result =  pool.query(
      'INSERT INTO users (name, surname, age) VALUES ($1, $2, $3)',
      [name, surname, age] 
    );
    res.status(200).send('Ok');
  } catch (error) {
    console.error(error);
    res.status(500).send('Internal Server Error');
  }
});


// получение данных по пользователям с заданным параметром
app.get('/users', async (req, res) => {
    // Проверяем наличие параметров запроса
    if (Object.keys(req.query).length === 0) {
      try {
        // Передаем запрос в базу данных
        const { rows } = await pool.query('SELECT * FROM users');
        // Если из базы вернулись данные
        if (rows.length > 0) {
          // Возвращаем массив юзеров и код 200
          res.status(200).json(rows);
        } else {
          // Возвращаем ошибку 404
          res.status(404).send('Not found');
        }
      } catch (error) {
        console.error(error);
        res.status(500).send('Server Error');
      }
    } else {
      // Подготавливаем фильтр из параметров запроса
      let filter = '';
      let values = [];
      Object.keys(req.query).forEach((key, index) => {
        if (index === 0) {
          filter += ` WHERE ${key}=$${index + 1}`;
        } else {
          filter += ` AND ${key}=$${index + 1}`;
        }
        values.push(req.query[key]);
      });
  
      try {
        // Передаем запрос в базу данных
        const { rows } = await pool.query(`SELECT * FROM users${filter}`, values);
        // Если из базы вернулись данные
        if (rows.length > 0) {
          // Возвращаем массив юзеров и код 200
          res.status(200).json(rows);
        } else {
          // Возвращаем ошибку 404
          res.status(404).send('Not found');
        }
      } catch (error) {
        console.error(error);
        res.status(500).send('Server Error');
      }
    }   
}); 



// Удаление пользователя по id
app.delete('/users/:id', async (req, res) => {
  const id = parseInt(req.params.id);
  if (!Number.isInteger(id) || id < 1) {
    return res.status(400).send('id must be integer');
  }


  const deleteUser = 'DELETE FROM users WHERE id=$1';

  try {
    const { rowCount } = await pool.query(deleteUser, [id]);
    if (rowCount === 0) {
      return res.status(404).send('Not found.');
    }
    return res.send('Ok');
  } catch (error) {
    return res.status(500).send(error.message);
  }

}); 

// Обновление данных пользователей в БД
app.patch('/users/:id', (req, res) => {
  // проверяем, что id является натуральным числом
  const id = parseInt(req.params.id);
  if (!Number.isInteger(id) || id < 1) {
    return res.status(400).send('id must be integer');
  }

  // получаем значения, которые нужно изменить
  const { name, surname, age } = req.body;

  
  const columns = [];
  if (name !== undefined) columns.push(`name='${name}'`);
  if (surname !== undefined) columns.push(`surname='${surname}'`);
  if (age !== undefined) columns.push(`age=${age}`);
  if (columns.length === 0) {
    //return res.status(400).json({ error: 'no columns specified' });
    return res.status(400).send('no columns specified');
  }

  const query = `UPDATE users SET ${columns.join(', ')} WHERE id=${id}`;

  // отправляем запрос в БД и возвращаем ответ клиенту
  pool.query(query, (error, results) => {
    if (error) {
      console.error(error);
      //return res.status(500).json({ error: 'internal server error' });
      return res.status(500).send('internal server error');
    }

    if (results.rowCount === 0) {
      //return res.status(404).json({ error: 'user not found' });
      return res.status(404).send('user not found');
    }

    //return res.json({ success: true });
    return res.status(200).send('Ok');
  });
});

  



app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});

