const express = require('express');
const router = express.Router();
const db = require('../db');
const { getLabel } = require('../utils/colLabels');

const TABLE = 'appointment_sync_siu';

const PAGE_SIZE = 20;

// GET /appointment-sync
router.get('/', async (req, res) => {
  try {
    const page = Math.max(1, parseInt(req.query.page) || 1);
    const offset = (page - 1) * PAGE_SIZE;

    const [columns] = await db.query(
      `SELECT COLUMN_NAME, IS_NULLABLE, DATA_TYPE, COLUMN_KEY, EXTRA
       FROM INFORMATION_SCHEMA.COLUMNS
       WHERE TABLE_SCHEMA = 'mirth_meta_data' AND TABLE_NAME = ?
       ORDER BY ORDINAL_POSITION`,
      [TABLE]
    );
    const [[{ total }]] = await db.query(`SELECT COUNT(*) AS total FROM \`${TABLE}\``);
    const [rows] = await db.query(`SELECT * FROM \`${TABLE}\` LIMIT ? OFFSET ?`, [PAGE_SIZE, offset]);
    const totalPages = Math.ceil(total / PAGE_SIZE);

    res.render('appointment-sync', {
      title: 'Lịch Khám',
      currentPath: '/appointment-sync',
      columns,
      rows,
      page,
      totalPages,
      total,
      getLabel,
      error: null,
    });
  } catch (err) {
    console.error(err);
    res.render('appointment-sync', {
      title: 'Lịch Khám',
      currentPath: '/appointment-sync',
      columns: [],
      rows: [],
      page: 1,
      totalPages: 1,
      total: 0,
      getLabel,
      error: err.message,
    });
  }
});

module.exports = router;
