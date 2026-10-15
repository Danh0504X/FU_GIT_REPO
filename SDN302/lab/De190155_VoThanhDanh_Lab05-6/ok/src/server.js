import express from "express"
import students from "./students.json" with { type: "json"};
const app = express();

app.use(express.json());

const router = express.Router();

app.use("/", router)

// Health check / API root
router.get('/', (req, res) => {
  res.json({ message: 'Welcome to the API!' })
})

router.get("/students",(req, res) => {
    res.json(students)
})

router.get("/students/:id",(req, res) => {
    res.json(students.find(students.id === req.params.id))
})

router.post("/students", (req, res) => {

    const newStudent = {
        id: students.length + 1,
        name: req.body.name,
        age: req.body.age,
        email: req.body.email,
        major: req.body.major
    };

    students.push(newStudent);

    res.status(201).json({
        message: "Create student successfully",
        data: newStudent
    });

});

router.put("/students/:id", (req, res) => {

    // lấy id từ URL
    const id = Number(req.params.id);


    // tìm student cần sửa
    const student = students.find(
        student => student.id === id
    );


    // nếu không tìm thấy
    if (!student) {
        return res.status(404).json({
            message: "Student not found"
        });
    }


    // cập nhật toàn bộ dữ liệu
    student.name = req.body.name;
    student.age = req.body.age;
    student.email = req.body.email;
    student.major = req.body.major;


    res.json({
        message: "Update successfully",
        data: student
    });

});

router.patch("/students/:id", (req, res) => {


    const id = Number(req.params.id);


    const student = students.find(
        student => student.id === id
    );


    if (!student) {
        return res.status(404).json({
            message:"Student not found"
        });
    }


    // chỉ sửa field được gửi lên

    if (req.body.name) {
        student.name = req.body.name;
    }


    if (req.body.age) {
        student.age = req.body.age;
    }


    if (req.body.email) {
        student.email = req.body.email;
    }


    if (req.body.major) {
        student.major = req.body.major;
    }


    res.json({
        message:"Patch successfully",
        data:student
    });


});

router.delete("/students/:id", (req, res) => {


    const id = Number(req.params.id);


    const studentIndex = students.findIndex(
        student => student.id === id
    );


    if (studentIndex === -1) {
        return res.status(404).json({
            message:"Student not found"
        });
    }


    students.splice(studentIndex, 1);


    res.json({
        message:"Delete successfully"
    });


});




app.listen(3000,() => {
    console.log("đang chạy nè bà http:localhost:3000 ")
})
