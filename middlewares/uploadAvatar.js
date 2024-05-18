import multer from "multer";
import crypto from "crypto";
import path from "node:path";

const storage = multer.diskStorage({
  destination(req, file, cb) {
    cb(null, path.resolve("tmp"));
  },
  filename(req, file, cb) {
    const extname = path.extname(file.originalname);
    const basename = path.basename(file.originalname, extname);
    const uniqueSuffix = crypto.randomUUID();
    cb(null, `${basename}-${uniqueSuffix}${extname}`);
  },
});

export default multer({ storage });
