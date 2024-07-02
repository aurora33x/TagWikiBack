import express from "express";
import { getUser } from "../../data/user-dao";
import Comment from "../../model/comment";

const router = express.Router();


// Get all posts
router.get('/comments', async (req, res) => {
  const search = req.query.search;
  const filters = search
    ? { body: { $regex: '.*' + search + '.*' } }
    : { rootId: null };
  await Comment.find(filters).sort({ postedAt: -1 }).then(comments => {
    res.json(comments);
  });
});


// get post
router.get('/commentMsg', async (req, res) => {

  const search = req.query;
  if (search.id) {
    await Comment.findById(search.id).sort({ postedAt: -1 }).then(result => {
      res.send({
        success: true,
        data: result,
      })
    });
  } else {
    await Comment.find().sort({ _id: -1 }).then(result => {
      let newResult = result.filter(item => (!item.rootID || item.rootID === 'null'))
      res.send({
        success: true,
        data: newResult,
      })
    });
  }

});

/**
 * comment thread
 * @param {*} data 
 * @param {*} allId if the id match first comment
 */
function initTree(data, allId) {
  const child = data.filter(item => {
    return (item.parentID === allId || item._doc.parentID == allId);
  });
  return child.map(item => ({
    ...item,
    key: item._id,
    label: `${item.author}  : ${item.body}`,
    children: initTree(data, item._id || item._doc.id),
  }));
}

// get comment
router.get('/userComment', async (req, res) => {

  const search = req.query;

  const { allId } = search;

  let allCom = await Comment.find();
  allCom = allCom.filter(item => item.rootID && item.rootID !== null);
  let result = initTree(allCom, allId);

  res.send({
    success: true,
    data: result,
  })

});

// delete post
router.post('/commentMsg/delete', async (req, res) => {

  const token = req.cookies.token;
  if (!token) {
    res.send({
      success: true,
      data: {
        code: '401',
        msg: 'please login to comment',
      }
    })
    return;
  }

  if (req.body.id) {
    await Comment.remove({ _id: req.body.id }).then(result => {
      if (result.ok === 1 && result.deletedCount === 1) {
        res.send({
          success: true,
        })
      } else {
        res.send({
          success: false,
          data: {
            msg: 'delete fail'
          }
        })
      }
    });
  }

})

// edit post
router.post('/commentMsg/edit', async (req, res) => {

  const token = req.cookies.token;
  if (!token) {
    res.send({
      success: true,
      data: {
        code: '401',
        msg: 'please login to comment',
      }
    })
    return;
  }

  if (req.body.id) {

    const item = await Comment.findById(req.body.id);
    if (item) {
      item.title = req.body.title,
        item.body = req.body.body,
        item.postedAt = req.body.postedAt,
        item.keywords = req.body.keywords,
        item.reference = req.body.reference,
        item.community = req.body.community,
        await item.save().then(result => {
          if (result) {
            res.send({
              success: true,
              data: {
                code: '200',
                msg: 'edit success',
              }
            });
          } else {
            res.send({
              success: true,
              data: {
                code: '400',
                msg: 'edit fail',
              }
            });
          }
        });

    }
  }

})


router.get('/comments/root/:rootId', (req, res) => {
  Comment.find({ rootId: req.params.rootId }).sort({ postedAt: -1 }).then(comments => {
    res.json(comments);
  });
});

router.get('/comments/:id', async (req, res) => {
  await Comment.findById(req.params.id).then(comment => {
    if (comment) {
      res.json(comment);
      res.status(200).end();
    }
    else {
      res.status(204).json({ message: "comment not found" });
    }
  }).catch(err => {
    res.status(500).json({ message: 'internal error' })
  });
});

// add post comment
router.post('/comments', (req, res) => {
  const token = req.cookies.token;
  if (!token) {
    res.send({
      success: true,
      data: {
        code: '401',
        msg: 'please login to comment',
      }
    })
    return;
  }
  getUser(token)
    .then(user => {
      const comment = new Comment({
        title: req.body.title || '',
        body: req.body.body || '',
        author: user.username || '',
        postedAt: new Date(),
        parentID: req.body.parentId || '',
        rootID: req.body.rootId || '',
        keywords: req.body.keywords || '',
        reference: req.body.reference || '',
        community: req.body.community || ''
      });
      comment.save().then(savedComment => {

        res.send({
          success: true,
          data: {
            code: '200',
            msg: savedComment,
          }
        })
      }).catch(console.log);
    })
    .catch(() => {
      res.send({
        success: true,
        data: {
          code: '401',
          msg: 'cannot access user info',
        }
      })
    });
});
export default router;
