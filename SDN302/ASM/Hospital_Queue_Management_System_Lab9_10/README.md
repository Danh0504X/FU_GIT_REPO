# Hospital Queue Management System

REST API quản lý hàng đợi khám bệnh cho Da Nang General Hospital.
Công nghệ: Node.js, Express, MongoDB (Mongoose), bcrypt, JWT.

## Cấu trúc thư mục

```
src/
├── config/db.js              # Kết nối MongoDB
├── models/                   # Mongoose schema
│   ├── userModel.js
│   ├── departmentModel.js
│   └── queueTicketModel.js
├── controllers/              # Nhận request, trả response
├── services/                 # Xử lý logic nghiệp vụ
├── routes/                   # Khai báo endpoint
├── middleware/auth.middleware.js   # Xác thực JWT + phân quyền theo role
├── providers/jwt.provider.js # Tạo / verify token
├── utils/httpError.js        # Lỗi kèm HTTP status code
├── seeds/seed.js             # Dữ liệu mẫu (user + department)
└── server.js
```

## Cài đặt

```bash
npm install
```

Tạo file `.env` (xem `.env.example`):

```
PORT=3001
MONGO_URI=mongodb+srv://<user>:<password>@<cluster>/hospital
JWT_SECRET=your_secret_key
JWT_EXPIRES_IN=1d
```

## Chạy project

```bash
npm run seed   # Tạo tài khoản mẫu + các khoa (xoá dữ liệu cũ)
npm run dev    # Chạy với nodemon
npm start      # Chạy bình thường
```

Server chạy tại `http://localhost:3001`.

## Dữ liệu mẫu (`src/seeds/hospital.json`)

`npm run seed` đọc file `hospital.json`, hash password rồi lưu vào MongoDB.

### Tài khoản mẫu

| Role         | Username      | Password | Quyền                                   |
|--------------|---------------|----------|-----------------------------------------|
| Doctor       | doctor1       | 123456   | Xem toàn bộ queue, call / complete      |
| Doctor       | doctor2       | 123456   | Như doctor1                             |
| Receptionist | receptionist1 | 123456   | Đăng ký bệnh nhân, xem ticket của mình  |
| Receptionist | receptionist2 | 123456   | Như receptionist1                       |

### Các khoa mẫu

| deptCode | Status | maxCapacity | Dùng để test                        |
|----------|--------|-------------|-------------------------------------|
| CARD     | open   | 10          | Đăng ký thành công                  |
| ORTH     | open   | 2           | Đăng ký 2 lần là khoa chuyển "full"  |
| PEDI     | open   | 15          | Đăng ký thành công                  |
| GAST     | open   | 8           | Đăng ký thành công                  |
| DERM     | closed | 5           | Lỗi 400 khoa đóng cửa               |
| NEUR     | full   | 2           | Lỗi 409 khoa đã đầy (đang có 2 ticket waiting) |

### Ticket mẫu

8 ticket với đủ trạng thái `waiting`, `called`, `completed`, `cancelled`, chia cho receptionist1 và receptionist2,
để `GET /queue` của doctor và receptionist trả về kết quả khác nhau.

## Postman Collection

File: `postman/Hospital_Queue.postman_collection.json` (31 request, có test tự động).

1. Postman → **Import** → chọn file trên.
2. Chạy `npm run seed` và `npm run dev`.
3. Chạy lần lượt từ trên xuống (hoặc chuột phải collection → **Run collection**).
   - Login tự lưu `doctorToken`, `receptionistToken`.
   - Get departments tự lưu id các khoa.
   - Register tự sinh số điện thoại và `registeredAt` (hiện tại + 2 giây), tự lưu `ticketId`.
4. Muốn chạy lại từ đầu: `npm run seed` để reset dữ liệu (khoa ORTH sẽ về lại `open`).

| Folder                         | Nội dung                                                    |
|--------------------------------|-------------------------------------------------------------|
| 01. Auth                       | Register 201 / 409, Login 401 / doctor / receptionist        |
| 02. Departments                | Lấy id các khoa                                             |
| 03. GET /queue                 | Doctor (tất cả), receptionist (của mình), không token 401    |
| 04. POST /queue/register       | 201, trùng ticket 409, khoa full 409, khoa đóng 400, quá khứ 400, thiếu field 400, doctor 403 |
| 05. Capacity auto-update       | ORTH đăng ký 2 ticket → full → ticket thứ 3 bị 409           |
| 06. PUT /queue/:id/call        | 403, 200, gọi lại 400, id sai 400, không tồn tại 404         |
| 07. PUT /queue/:id/complete    | 200 có waitMinutes, complete lại 400, ticket waiting 400, 403 |
| 08. Capacity reset             | Complete 1 ticket ORTH → khoa về lại `open`                  |

## API

Các route `/queue` và `/departments` cần header: `Authorization: Bearer <token>`

| Method | Endpoint               | Role         | Mô tả                                     |
|--------|------------------------|--------------|-------------------------------------------|
| POST   | /auth/register         | -            | Đăng ký (role mặc định: receptionist)      |
| POST   | /auth/login            | -            | Đăng nhập, trả về JWT                     |
| GET    | /departments           | Đã đăng nhập | Danh sách khoa (lấy `_id` để đăng ký)      |
| GET    | /queue                 | Đã đăng nhập | Doctor: tất cả, receptionist: của mình     |
| POST   | /queue/register        | receptionist | Đăng ký bệnh nhân vào hàng đợi             |
| PUT    | /queue/:id/call        | doctor       | Gọi bệnh nhân (waiting → called)           |
| PUT    | /queue/:id/complete    | doctor       | Hoàn thành khám (called → completed)       |

## Hướng dẫn test bằng Postman

### 1. Register — `POST /auth/register`
```json
{ "username": "receptionist2", "password": "123456", "fullName": "Le Van C" }
```
- Thành công → `201`
- Username đã tồn tại → `409`

### 2. Login — `POST /auth/login`
```json
{ "username": "doctor1", "password": "123456" }
```
- Trả về `data.token` (payload gồm `userId`, `role`, `fullName`).
- Copy token vào tab **Authorization → Bearer Token** cho các request sau.

### 3. Lấy id khoa — `GET /departments`

### 4. Đăng ký bệnh nhân — `POST /queue/register` (token receptionist)
```json
{
  "patientName": "Nguyen Van A",
  "patientPhone": "0901234567",
  "departmentId": "<_id của khoa CARD>",
  "priority": "normal",
  "registeredAt": "2026-12-31T08:00:00.000Z",
  "note": "Dau nguc"
}
```
> `registeredBy` được lấy từ token, không gửi trong body.

| Case                           | Cách test                                   | Kết quả |
|--------------------------------|---------------------------------------------|---------|
| Thành công                     | Gửi body như trên                           | `201`, ticketNumber `CARD-001` |
| registeredAt ở quá khứ         | `"registeredAt": "2020-01-01"`              | `400`   |
| Khoa đóng cửa                  | departmentId của DERM                       | `400`   |
| Khoa đầy                       | departmentId của NEUR                       | `409`   |
| Trùng ticket đang hoạt động    | Gửi lại cùng patientPhone + cùng khoa       | `409`   |

### 5. Xem hàng đợi — `GET /queue`
Chụp kết quả với token doctor (thấy tất cả) và token receptionist (chỉ thấy ticket của mình).

### 6. Gọi bệnh nhân — `PUT /queue/:id/call` (token doctor)
- Ticket đang `waiting` → `200`, status = `called`
- Gọi lại ticket đã `called` → `400` "Only waiting tickets can be called"

### 7. Hoàn thành — `PUT /queue/:id/complete` (token doctor)
- Ticket đang `called` → `200`, kèm `waitMinutes`
- Complete lại ticket đã `completed` → `400`

> `waitMinutes = (calledAt - registeredAt) / 60000`, làm tròn 1 chữ số thập phân.
> Vì `registeredAt` không được ở quá khứ, nếu gọi bệnh nhân trước thời điểm `registeredAt` thì waitMinutes sẽ âm.
> Để có số dương: đặt `registeredAt` khoảng 1 phút sau hiện tại, chờ qua thời điểm đó rồi mới gọi.

## Mã lỗi

| Code | Ý nghĩa                                   |
|------|-------------------------------------------|
| 400  | Dữ liệu không hợp lệ / sai trạng thái     |
| 401  | Chưa đăng nhập hoặc token không hợp lệ     |
| 403  | Không đủ quyền (sai role)                  |
| 404  | Không tìm thấy ticket / khoa               |
| 409  | Trùng username, khoa đầy, trùng ticket     |
