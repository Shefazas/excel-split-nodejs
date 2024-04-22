console.log("hello world")
const express = require('express')
const app = express()
const morgan = require('morgan')
const mongoose = require('mongoose')
const fs = require('fs');

require('dotenv/config')

const api = process.env.API_URL

//Middleware
app.use(express.json())
app.use(morgan('tiny'))


const multer = require('multer');
const cors = require('cors');
const path = require('path');
const excelService = require('./services/excel.service');



app.use(cors());

// Multer configuration
const UPLOADS_DIR = path.join(__dirname, 'uploads');
if (!fs.existsSync(UPLOADS_DIR)) {
  fs.mkdirSync(UPLOADS_DIR);
}

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/');
  },
  filename: function (req, file, cb) {
    const timestamp = Date.now();
    const originalFileName = file.originalname;
    const formattedFileName = `${timestamp}-${originalFileName}`;
    cb(null, formattedFileName); // Append timestamp to avoid filename conflicts
  }
});

const upload = multer({
  storage: storage,
  fileFilter: function (req, file, cb) {
    if (
      file.mimetype === 'application/vnd.ms-excel' ||
      file.mimetype === 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
    ) {
      cb(null, true);
    } else {
      cb('Error: Only Excel files are allowed.');
    }
  },
}).single('file');

// POST endpoint for file upload
app.post(`${api}/upload`, (req, res) => {
  upload(req, res, (err) => {
    if (err) {
      return res.status(400).json({ message: err });
    } else if (!req.file) {
      return res.status(400).json({ message: 'No file uploaded.' });
    }
    res.json({ message: 'File uploaded successfully.' });
    const smartShip = [
      {"EmpId": "ITP 1028"},
      {"EmpId": "ITP 1030"},
      {"EmpId": "ITP 1038"},
      {"EmpId": "ITP 1248"},
      {"EmpId": "ITP 1283"},
      {"EmpId": "ITP 1332"},
      {"EmpId": "ITP 1463"},
      {"EmpId": "ITP 1471"},
      {"EmpId": "ITP 1482"},
      {"EmpId": "ITP 1514"},
      {"EmpId": "ITP 1519"},
      {"EmpId": "TATP 1196"},
      {"EmpId": "IBTP 1539"},
      {"EmpId": "IBTP 1207"},
      {"EmpId": "IBTP 1215"}
    ]
   const smartVoyager= [
      {"EmpId": "IATP 1534"},
      {"EmpId": "IATP 1706"},
      {"EmpId": "CATP 1330"},
      {"EmpId": "IATP 1527"},
      {"EmpId": "IATP 1557"},
      {"EmpId": "IATP 1564"},
      {"EmpId": "IATP 1569"},
      {"EmpId": "IATP 1574"},
      {"EmpId": "CATP 1152"},
      {"EmpId": "IATP 1578"},
      {"EmpId": "IATP 1526"},
      {"EmpId": "IATP 1582"},
      {"EmpId": "CATP 1201"},
      {"EmpId": "CATP 1215"}
    ]
  
  excelService.splitExcelFile(req.file.path, smartShip, smartVoyager); 

  });
});

// GET endpoint for downloading the uploaded file
app.get(`${api}/download/:fileName`, (req, res) => {
  const fileName = req.params.fileName;
  const filePath = path.join(UPLOADS_DIR, fileName);

  // Check if the file exists
  if (fs.existsSync(filePath)) {
    // Set the appropriate headers
    res.setHeader('Content-Disposition', `attachment; filename=${fileName}`);
    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');

    // Create a read stream from the file and pipe it to the response
    const fileStream = fs.createReadStream(filePath);
    fileStream.pipe(res);
  } else {
    res.status(404).json({ message: 'File not found.' });
  }
});

// Serve uploaded files
app.use(`${api}/uploads`, express.static(path.join(__dirname, 'uploads')));


const employeeSchema = mongoose.Schema({
    filename:{
        type: String,
        required: true
    },
    file:String
})

//const File = mongoose.model('File',employeeSchema)

const Billing = mongoose.model('employee-billings', employeeSchema)

// const expressLayouts = require('express-ejs-layouts')

// const indexRouter = require('./routes/index')

// app.set('view engine', 'ejs')
// app.set('views', __dirname + '/views')
// app.set('layout', 'layouts/layout')
// app.use(expressLayouts)
// app.use(express.static('public'))

// const mongoose = require('mongoose')
// mongoose.connect(process.env.DATABASE_URL, {
//     useNewUrlParser: true
// })

// const db = mongoose.connection
// db.on('error', error => console.error(error))
// db.once('open', () => console.log('Connected to Mongoose'))

// app.use('/', indexRouter)

app.get(`${api}/files`, async (req, res) =>{
    const employeeList = await Billing.find()
    if(!employeeList){
        res.status(500).json({success: false})
    }
    res.send(employeeList)
})

app.post(`${api}/files`,(req, res) =>{
    const file = new Billing({
        filename: req.body.filename,
        file: req.body.file,
    })
    file.save().then((createdFile=>{
        res.status(201).json(createdFile)
    })).catch((err)=>{
        res.status(500).json({
            error: err,
            success: false
        })
    })

})

mongoose.connect(process.env.CONNECTION_STRING,{
    dbName: 'BillingApp'
})
.then(()=>{
    console.log('Database Connection is ready ...');
})
.catch((err)=> {
    console.log(err)
})
app.listen(3000, ()=>{
    console.log(api);
    console.log('server is running http://localhost:3000');
})


