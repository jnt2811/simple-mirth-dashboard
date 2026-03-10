/**
 * Vietnamese label mapping for database column names.
 * Keys are UPPERCASE — lookup is case-insensitive.
 */
const LABELS = {
  // ── TRUSTED_SERVICE ──────────────────────────────────────────
  ID:               'ID',
  SERVICE_NAME:     'Tên dịch vụ',
  SERVICE_HOST:     'Host',
  SERVICE_SECRET:   'Secret',
  STATUS:           'Trạng thái',
  HL7_SERVICE_NAME: 'Tên dịch vụ HL7',

  // ── ISN_BENH_NHAN / ISN_LICH_KHAM ───────────────────────────
  SERVICE_ID: 'ID dịch vụ',
  ENDPOINT:   'Endpoint',

  // ── patient_sync_adt ─────────────────────────────────────────
  MESSAGE_ID:           'ID tin nhắn',
  MESSAGE_TIMESTAMP:    'Thời điểm tin nhắn',
  SENDING_APP:          'Ứng dụng gửi',
  SENDING_FACILITY:     'Cơ sở gửi',
  MESSAGE_TYPE:         'Loại tin nhắn',
  EVENT_TYPE:           'Loại sự kiện',
  PATIENT_ID:           'ID bệnh nhân',
  PATIENT_ID_TYPE:      'Loại ID bệnh nhân',
  LAST_NAME:            'Họ',
  FIRST_NAME:           'Tên',
  MIDDLE_NAME:          'Tên đệm',
  DATE_OF_BIRTH:        'Ngày sinh',
  GENDER:               'Giới tính',
  ADDRESS:              'Địa chỉ',
  PHONE:                'Số điện thoại',
  PATIENT_CLASS:        'Loại bệnh nhân',
  WARD:                 'Khoa/Phòng',
  ROOM:                 'Phòng',
  BED:                  'Giường',
  ATTENDING_DOCTOR_ID:   'ID bác sĩ phụ trách',
  ATTENDING_DOCTOR_NAME: 'Bác sĩ phụ trách',
  ADMIT_DATETIME:       'Thời điểm nhập viện',
  RAW_MESSAGE:          'Nội dung gốc',
  CREATED_AT:           'Ngày tạo',

  // ── appointment_sync_siu ─────────────────────────────────────
  APPT_ID:    'ID lịch hẹn',
  APPT_TYPE:  'Loại lịch hẹn',
  DURATION:   'Thời lượng (phút)',
  DOCTOR_ID:  'ID bác sĩ',
  APPT_START: 'Lịch khám bắt đầu',
  APPT_END:   'Lịch khám kết thúc',
  UPDATED_AT: 'Ngày cập nhật',
};

/**
 * Returns Vietnamese label for a column name (case-insensitive lookup).
 * Falls back to the original column name if no mapping found.
 */
function getLabel(colName) {
  return LABELS[colName.toUpperCase()] || colName;
}

module.exports = { getLabel, LABELS };
