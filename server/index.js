import express from 'express'
import cors from 'cors'
import { parseCsvToJson } from './services/csv.parser';

const app = express();

app.use(cors())

// We use multer to handle upload files in multipart/form-data request
const multer = require('multer')
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, './uploads')
    },
    filename: function (req, file, cb) {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
        cb(null, file.fieldname + '-' + uniqueSuffix)
    }
});
const upload = multer({ storage: storage });

app.get('/', (req, res) => {
   res.send('This is from express.js');
})

app.post('/upload', upload.single('file'), async (req, res) => {
    const products = await parseCsvToJson(req.file);

    res.status('200').send(products);
})

const port = process.env.PORT || 5000
app.listen(port, () => {
  console.log(`server started on port ${port}: http://localhost:${port}`)
})
