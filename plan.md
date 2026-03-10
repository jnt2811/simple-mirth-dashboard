Tao cần tạo 1 expressjs web, xài ejs và bootstrap xử lý vụ giao diện, thì web này mục đích là 1 cái dashboard có header và content, trên header có 1 cái menu bên trái, và 1 nút logout bên phải, justify between nhá, còn trong menu có 4 menu item là "Trusted Service", "Endpoint URL", "Patient Sync", "Appointment Sync", thì bản chất web này để tao đi pitch dự án với khách, mục đích cho khách thấy được mình xử lý vụ config cái gateway đồng bộ dữ liệu như thế nào thôi.

Credential db sẽ là 10.8.0.184 port 3306, db mysql, bảng mirth_meta_data, mật khẩu là 12345

À web này cần xử lý login/logout nha, làm cho tao cái màn login, hardcode con mẹ nó credential luôn, tài khoản admin, mật khẩu admin, vào được thì quăng cho cái cookies hiểu chứ, logout thì xóa cookie đi redirect ra lại màn login

Cái màn "Trusted Service" sẽ trọc vào bảng TRUSTED_SERVICE bốc hết dữ liệu ra rồi hiển thị lên giao diện dạng bảng, yên tâm là danh sách không dài đâu nên không cần phân trang, phệt hết ra. Sẽ có 1 cái topbar ở trên cái bảng, bên trái là title, bên phải là nút thêm mới, tự kiểm tra bảng để biết cột nào require, trên mỗi hàng sẽ có 1 cái nút ở cuối cùng là nút edit, bấm vào nó sẽ bật popup ra sửa bản ghi (bấm thêm cũng bật popup ra thêm bản ghi).

Cái màn "Endpoint URL" cũng tương tự như màn trên, nhưng lần này là hiển thị dữ liệu 2 bảng (không gộp, tách ra làm 2 section, mỗi section cũng sẽ có topbar và table, cho config như màn trước), lần này mày trọc vào 2 bảng là ISN_BENH_NHAN (Bệnh nhân) và ISN_LICH_KHAM (Lịch khám)

Còn 2 cái màn cuối là "Patient Sync" và "Appointment Sync" thì lần lượt trọc vào 2 bảng "patient_sync_adt" và "appointment_sync_siu", riêng 2 màn này chỉ phệt dữ liệu ra bảng thôi, không cho thêm/sửa gì hết.

à lưu ý ở 2 màn đầu tiên (Trusted Service và Endpoint URL) thì tụi nó đều có cái cột STATUS ấy, xài công tắc đi cho ngon, mặc định là bật nhé (giá trị là true, hoặc 1)