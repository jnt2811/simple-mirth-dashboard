const express = require('express');
const router = express.Router();
const db = require('../db');

router.get('/', async (req, res) => {
  try {
    const [[{ totalPatients }]] = await db.query(
      `SELECT COUNT(*) AS totalPatients FROM patient_sync_adt`
    );
    const [[{ totalAppointments }]] = await db.query(
      `SELECT COUNT(*) AS totalAppointments FROM appointment_sync_siu`
    );

    // Patients today (by CREATED_AT)
    const [[{ todayPatients }]] = await db.query(
      `SELECT COUNT(*) AS todayPatients FROM patient_sync_adt WHERE DATE(CREATED_AT) = CURDATE()`
    );

    // Appointments today (by APPT_START)
    const [[{ todayAppointments }]] = await db.query(
      `SELECT COUNT(*) AS todayAppointments FROM appointment_sync_siu WHERE DATE(APPT_START) = CURDATE()`
    );

    // Gender breakdown
    const [genderRows] = await db.query(
      `SELECT GENDER, COUNT(*) AS cnt FROM patient_sync_adt GROUP BY GENDER ORDER BY cnt DESC LIMIT 10`
    );

    // Appointment type breakdown
    const [apptTypeRows] = await db.query(
      `SELECT APPT_TYPE, COUNT(*) AS cnt FROM appointment_sync_siu GROUP BY APPT_TYPE ORDER BY cnt DESC LIMIT 10`
    );

    // Recent 5 patients
    const [recentPatients] = await db.query(
      `SELECT PATIENT_ID, LAST_NAME, FIRST_NAME, GENDER, DATE_OF_BIRTH, CREATED_AT
       FROM patient_sync_adt ORDER BY CREATED_AT DESC LIMIT 5`
    );

    // Upcoming appointments (next 5 from now)
    const [upcomingAppointments] = await db.query(
      `SELECT APPT_ID, APPT_TYPE, APPT_START, APPT_END, DOCTOR_ID
       FROM appointment_sync_siu WHERE APPT_START >= NOW() ORDER BY APPT_START ASC LIMIT 5`
    );

    res.render('dashboard', {
      title: 'Bảng điều khiển',
      currentPath: '/dashboard',
      totalPatients,
      totalAppointments,
      todayPatients,
      todayAppointments,
      genderRows,
      apptTypeRows,
      recentPatients,
      upcomingAppointments,
      error: null,
    });
  } catch (err) {
    console.error(err);
    res.render('dashboard', {
      title: 'Bảng điều khiển',
      currentPath: '/dashboard',
      totalPatients: 0,
      totalAppointments: 0,
      todayPatients: 0,
      todayAppointments: 0,
      genderRows: [],
      apptTypeRows: [],
      recentPatients: [],
      upcomingAppointments: [],
      error: err.message,
    });
  }
});

module.exports = router;
