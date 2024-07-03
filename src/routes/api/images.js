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

// router.get('/images/:filename', (req, res) => {
//   gfs.files.findOne({ filename: req.params.filename }, (err, file) => {
//     if (!file || file.length === 0) {
//       return res.status(404).json({ message: 'File not found' });
//     }

//     // Set the appropriate Content-Type and send the file
//     res.set('Content-Type', file.contentType);
//     const readstream = gfs.createReadStream(file.filename);
//     readstream.pipe(res);
//   });
// });

export default router;