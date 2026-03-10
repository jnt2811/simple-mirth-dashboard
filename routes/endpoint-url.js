const express = require('express');
const router = express.Router();
const db = require('../db');
const { getLabel } = require('../utils/colLabels');

const TABLE_1 = 'ISN_BENH_NHAN';
const TABLE_2 = 'ISN_LICH_KHAM';

async function getColumns(table) {
  const [rows] = await db.query(
    `SELECT COLUMN_NAME, IS_NULLABLE, DATA_TYPE, COLUMN_KEY, EXTRA
     FROM INFORMATION_SCHEMA.COLUMNS
     WHERE TABLE_SCHEMA = 'mirth_meta_data' AND TABLE_NAME = ?
     ORDER BY ORDINAL_POSITION`,
    [table]
  );
  return rows;
}

// GET /endpoint-url
router.get('/', async (req, res) => {
  try {
    const [columns1, columns2, [trustedServices]] = await Promise.all([
      getColumns(TABLE_1),
      getColumns(TABLE_2),
      db.query('SELECT ID, SERVICE_NAME FROM `TRUSTED_SERVICE` ORDER BY SERVICE_NAME'),
    ]);
    const [[rows1], [rows2]] = await Promise.all([
      db.query(`SELECT t.*, ts.SERVICE_NAME AS _SERVICE_NAME FROM \`${TABLE_1}\` t LEFT JOIN \`TRUSTED_SERVICE\` ts ON t.SERVICE_ID = ts.ID`),
      db.query(`SELECT t.*, ts.SERVICE_NAME AS _SERVICE_NAME FROM \`${TABLE_2}\` t LEFT JOIN \`TRUSTED_SERVICE\` ts ON t.SERVICE_ID = ts.ID`),
    ]);
    res.render('endpoint-url', {
      title: 'Endpoint URL',
      currentPath: '/endpoint-url',
      columns1,
      rows1,
      columns2,
      rows2,
      trustedServices,
      getLabel,
      error: req.query.error || null,
    });
  } catch (err) {
    console.error(err);
    res.render('endpoint-url', {
      title: 'Endpoint URL',
      currentPath: '/endpoint-url',
      columns1: [],
      rows1: [],
      columns2: [],
      rows2: [],
      trustedServices: [],
      getLabel,
      error: err.message,
    });
  }
});

// POST /endpoint-url/add/:table
router.post('/add/:table', async (req, res) => {
  const tableName = req.params.table;
  if (![TABLE_1, TABLE_2].includes(tableName)) {
    return res.redirect('/endpoint-url?error=Invalid+table');
  }
  try {
    const columns = await getColumns(tableName);
    const insertCols = columns.filter((c) => c.EXTRA !== 'auto_increment');
    const fields = insertCols.map((c) => c.COLUMN_NAME);
    const values = fields.map((f) => {
      if (f === 'STATUS') return req.body[f] !== undefined ? 1 : 0;
      return req.body[f] !== undefined ? req.body[f] : null;
    });
    const placeholders = fields.map(() => '?').join(', ');
    const colList = fields.map((f) => `\`${f}\``).join(', ');
    await db.query(
      `INSERT INTO \`${tableName}\` (${colList}) VALUES (${placeholders})`,
      values
    );
    res.redirect('/endpoint-url');
  } catch (err) {
    console.error(err);
    res.redirect('/endpoint-url?error=' + encodeURIComponent(err.message));
  }
});

// POST /endpoint-url/edit/:table
router.post('/edit/:table', async (req, res) => {
  const tableName = req.params.table;
  if (![TABLE_1, TABLE_2].includes(tableName)) {
    return res.redirect('/endpoint-url?error=Invalid+table');
  }
  try {
    const columns = await getColumns(tableName);
    const pkCol = columns.find((c) => c.COLUMN_KEY === 'PRI');
    if (!pkCol) throw new Error('No primary key found');
    const pkName = pkCol.COLUMN_NAME;
    const pkValue = req.body[pkName];

    const updateCols = columns.filter(
      (c) => c.COLUMN_KEY !== 'PRI' && c.EXTRA !== 'auto_increment'
    );
    const setClauses = updateCols.map((c) => `\`${c.COLUMN_NAME}\` = ?`).join(', ');
    const values = updateCols.map((c) => {
      if (c.COLUMN_NAME === 'STATUS') return req.body[c.COLUMN_NAME] !== undefined ? 1 : 0;
      return req.body[c.COLUMN_NAME] !== undefined ? req.body[c.COLUMN_NAME] : null;
    });
    values.push(pkValue);

    await db.query(
      `UPDATE \`${tableName}\` SET ${setClauses} WHERE \`${pkName}\` = ?`,
      values
    );
    res.redirect('/endpoint-url');
  } catch (err) {
    console.error(err);
    res.redirect('/endpoint-url?error=' + encodeURIComponent(err.message));
  }
});

module.exports = router;
