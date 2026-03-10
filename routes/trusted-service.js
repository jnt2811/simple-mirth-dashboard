const express = require('express');
const router = express.Router();
const db = require('../db');
const { getLabel } = require('../utils/colLabels');

const TABLE = 'TRUSTED_SERVICE';
const HIDDEN_COLS = ['SERVICE_SECRET'];

async function getColumns() {
  const [rows] = await db.query(
    `SELECT COLUMN_NAME, IS_NULLABLE, DATA_TYPE, COLUMN_KEY, EXTRA
     FROM INFORMATION_SCHEMA.COLUMNS
     WHERE TABLE_SCHEMA = 'mirth_meta_data' AND TABLE_NAME = ?
     ORDER BY ORDINAL_POSITION`,
    [TABLE]
  );
  return rows;
}

// GET /trusted-service
router.get('/', async (req, res) => {
  try {
    const allColumns = await getColumns();
    const columns = allColumns.filter((c) => !HIDDEN_COLS.includes(c.COLUMN_NAME));
    const [rows] = await db.query(`SELECT * FROM \`${TABLE}\``);
    res.render('trusted-service', {
      title: 'Trusted Service',
      currentPath: '/trusted-service',
      columns,
      rows,
      getLabel,
      error: req.query.error || null,
    });
  } catch (err) {
    console.error(err);
    res.render('trusted-service', {
      title: 'Trusted Service',
      currentPath: '/trusted-service',
      columns: [],
      rows: [],
      getLabel,
      error: err.message,
    });
  }
});

// POST /trusted-service/add
router.post('/add', async (req, res) => {
  try {
    const allColumns = await getColumns();
    const insertCols = allColumns.filter((c) => c.EXTRA !== 'auto_increment');
    const fields = insertCols.map((c) => c.COLUMN_NAME);
    const values = fields.map((f) => {
      if (f === 'STATUS') return req.body[f] !== undefined ? 1 : 0;
      if (HIDDEN_COLS.includes(f)) return '1'; // default for hidden cols
      return req.body[f] !== undefined ? req.body[f] : null;
    });
    const placeholders = fields.map(() => '?').join(', ');
    const colList = fields.map((f) => `\`${f}\``).join(', ');
    await db.query(
      `INSERT INTO \`${TABLE}\` (${colList}) VALUES (${placeholders})`,
      values
    );
    res.redirect('/trusted-service');
  } catch (err) {
    console.error(err);
    res.redirect('/trusted-service?error=' + encodeURIComponent(err.message));
  }
});

// POST /trusted-service/edit
router.post('/edit', async (req, res) => {
  try {
    const allColumns = await getColumns();
    const pkCol = allColumns.find((c) => c.COLUMN_KEY === 'PRI');
    if (!pkCol) throw new Error('No primary key found');
    const pkName = pkCol.COLUMN_NAME;
    const pkValue = req.body[pkName];

    // Exclude PK, auto_increment, and hidden cols from update
    const updateCols = allColumns.filter(
      (c) => c.COLUMN_KEY !== 'PRI' && c.EXTRA !== 'auto_increment' && !HIDDEN_COLS.includes(c.COLUMN_NAME)
    );
    const setClauses = updateCols.map((c) => `\`${c.COLUMN_NAME}\` = ?`).join(', ');
    const values = updateCols.map((c) => {
      if (c.COLUMN_NAME === 'STATUS') return req.body[c.COLUMN_NAME] !== undefined ? 1 : 0;
      return req.body[c.COLUMN_NAME] !== undefined ? req.body[c.COLUMN_NAME] : null;
    });
    values.push(pkValue);

    await db.query(
      `UPDATE \`${TABLE}\` SET ${setClauses} WHERE \`${pkName}\` = ?`,
      values
    );
    res.redirect('/trusted-service');
  } catch (err) {
    console.error(err);
    res.redirect('/trusted-service?error=' + encodeURIComponent(err.message));
  }
});

module.exports = router;
