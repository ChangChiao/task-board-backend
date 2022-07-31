const multer = require("multer");
const path = require("path");
const acceptFileType = [".jpg", ".png", ".jpeg"];
const checkFile = multer({
  limits: {
    fileSize: 1 * 1024 * 1024,
  },
  fileFilter(req, file, cb) {
    const ext = path.extname(file.originalname).toLocaleLowerCase();
    if (!acceptFileType.includes(ext)) {
      cb(new Error("檔案格式錯誤，僅限上傳 jpg、jpeg 與 png 格式。"));
    }
    cb(null, true);
  },
}).any();

module.exports = checkFile;
