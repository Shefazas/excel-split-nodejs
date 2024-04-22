// // if(process.env.NODE_ENV !== 'production'){
// //     require('dotenv').config()
// // }
// console.log("hello world")
// const express = require('express')
// const app = express()
// const morgan = require('morgan')
// const mongoose = require('mongoose')
// const fs = require('fs');

// require('dotenv/config')

// const api = process.env.API_URL

// //Middleware
// app.use(express.json())
// app.use(morgan('tiny'))


// const multer = require('multer');
// const cors = require('cors');
// const path = require('path');



// app.use(cors());

// // Multer configuration
// const UPLOADS_DIR = path.join(__dirname, 'uploads');
// if (!fs.existsSync(UPLOADS_DIR)) {
//   fs.mkdirSync(UPLOADS_DIR);
// }

// // Multer configuration
// const storage = multer.diskStorage({
//   destination: function (req, file, cb) {
//     cb(null, 'uploads/');
//   },
//   filename: function (req, file, cb) {
//     cb(null, Date.now() + '-' + file.originalname); // Append timestamp to avoid filename conflicts
//   }
// });

// const upload = multer({
//   storage: storage,
//   fileFilter: function (req, file, cb) {
//     if (
//       file.mimetype === 'application/vnd.ms-excel' ||
//       file.mimetype ===
//         'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
//     ) {
//       cb(null, true);
//     } else {
//       cb('Error: Only Excel files are allowed.');
//     }
//   },
// }).single('file');

// // POST endpoint for file upload
// app.post(`${api}/upload`, (req, res) => {
//   upload(req, res, (err) => {
//     if (err) {
//       return res.status(400).json({ message: err });
//     } else if (!req.file) {
//       return res.status(400).json({ message: 'No file uploaded.' });
//     }
//     res.json({ message: 'File uploaded successfully.' });
//   });
// });

// // Serve uploaded files
// app.use(`${api}/uploads`, express.static(path.join(__dirname, 'uploads')));


// const employeeSchema = mongoose.Schema({
//     filename:{
//         type: String,
//         required: true
//     },
//     file:String
// })

// //const File = mongoose.model('File',employeeSchema)

// const Billing = mongoose.model('employee-billings', employeeSchema)

// // const expressLayouts = require('express-ejs-layouts')

// // const indexRouter = require('./routes/index')

// // app.set('view engine', 'ejs')
// // app.set('views', __dirname + '/views')
// // app.set('layout', 'layouts/layout')
// // app.use(expressLayouts)
// // app.use(express.static('public'))

// // const mongoose = require('mongoose')
// // mongoose.connect(process.env.DATABASE_URL, {
// //     useNewUrlParser: true
// // })

// // const db = mongoose.connection
// // db.on('error', error => console.error(error))
// // db.once('open', () => console.log('Connected to Mongoose'))

// // app.use('/', indexRouter)

// app.get(`${api}/files`, async (req, res) =>{
//     const employeeList = await Billing.find()
//     if(!employeeList){
//         res.status(500).json({success: false})
//     }
//     res.send(employeeList)
// })

// app.post(`${api}/files`,(req, res) =>{
//     const file = new Billing({
//         filename: req.body.filename,
//         file: req.body.file,
//     })
//     file.save().then((createdFile=>{
//         res.status(201).json(createdFile)
//     })).catch((err)=>{
//         res.status(500).json({
//             error: err,
//             success: false
//         })
//     })

// })

// mongoose.connect(process.env.CONNECTION_STRING,{
//     dbName: 'BillingApp'
// })
// .then(()=>{
//     console.log('Database Connection is ready ...');
// })
// .catch((err)=> {
//     console.log(err)
// })
// app.listen(3000, ()=>{
//     console.log(api);
//     console.log('server is running http://localhost:3000');
// })


