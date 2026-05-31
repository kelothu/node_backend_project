const multer = require('multer');
const path = require('path');
const fs = require('fs');

const uploadDir = path.resolve(__dirname, '../../uploads/csv');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    cb(null, `import-${Date.now()}.csv`);
  }
});

const csvFilter = (req, file, cb) => {
  const allowedMimetypes = [
    'text/csv',
    'application/vnd.ms-excel',
    'application/csv',
    'text/plain',
    'application/octet-stream' // Sometimes CSVs are sent as this if type is unknown
  ];
  const isCsvExt = path.extname(file.originalname).toLowerCase() === '.csv';
  
  if (allowedMimetypes.includes(file.mimetype) || isCsvExt) {
    cb(null, true);
  } else {
    cb(new Error(`Invalid file type: ${file.mimetype}. Only CSV files are allowed!`), false);
  }
};

module.exports = multer({ storage, fileFilter: csvFilter });
