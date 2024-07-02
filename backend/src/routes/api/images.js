import express from 'express';
import fs from 'fs';
import multer from 'multer';
import { v4 as uuid } from 'uuid';

const router = express.Router();

const upload = multer({
  dest: './temp'
});

/**
 * When we receive a POST to this handler, use Multer to handle the uploaded file.
 * Then, move the uploaded file into the correct place and return a 201 pointing to
 * the newly added image.
 */
router.post('/upload', upload.single("image"), (req, res) => {
  const oldPath = req.file.path;
  const ext = req.file.originalname.substring(req.file.originalname.lastIndexOf('.'));
  const newFileName = `${uuid()}${ext}`;
  const newPath = `./public/images/${newFileName}`;

  fs.renameSync(oldPath, newPath);

  res.status(201).send(`/images/${newFileName}`).end();

});

export default router;