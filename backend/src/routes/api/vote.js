import express from 'express';
import { getUser } from '../../data/user-dao';
import Vote from '../../model/vote';
const router = express.Router();

// get votes
router.get('/userVote', async (req, res) => {
  try {
    const search = req.query;
    if (search.postId) {
      await Vote.find().where({ postId: search.postId }).then(result => {
        if (result && Array.isArray(result)) {
          if (search.userId) {
            // judge  likes
            res.send({
              success: true,
              data: {
                likeNum: result.length,
                userHasLike: result.some(item => item.userId === search.userId) ? true : false,
              },
            })
          } else {
            // do not judge likes
            res.send({
              success: true,
              data: {
                likeNum: result.length,
                userHasLike: false,
              },
            })
          }
        }
      });
    }
  } catch (e) {
    res.send({
      success: true,
      data: {
        code: '404',
        msg: 'network error',
      }
    })
  }
})

// click like
router.post('/userVote', async (req, res) => {
  const token = req.cookies.token;
  if (!token) {
    res.send({
      success: true,
      data: {
        code: '401',
        msg: 'please login to click like',
      }
    })
    return;
  }
  try {
    // like 1 cancle like 0   type
    if (req.body.type == 1) {
      getUser(token)
        .then(user => {
          Vote.find().where({ postId: req.body.postId, userId: user._id }).then(vote => {
            if (vote && vote.length > 0) {
              // exist
              res.send({
                success: false,
                err: 'you already click like'
              })
            } else {
              const item = new Vote({
                postId: req.body.postId,
                userId: user._id,
              });
              item.save().then(single => {
                if (single.postId) {
                  res.send({
                    success: true,
                  })
                } else {
                  res.send({
                    success: false,
                    err: 'click like fail'
                  })
                }
              }).catch(console.log);
            }
          })

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
    } else {
      // cancel like 
      getUser(token)
        .then(user => {
          Vote.find().where({ postId: req.body.postId, userId: user._id }).then(vote => {
            if (vote && vote[0].postId) {
              // exist
              Vote.remove({
                postId: req.body.postId,
                userId: user._id,
              }).then(vote => {
                if (vote.ok == 1 && vote.deletedCount == 1) {
                  res.send({
                    success: true,
                  })
                } else {
                  res.send({
                    success: false,
                    err: 'cancel like fail'
                  })
                }
              }).catch(err => {
                res.send({
                  success: false,
                  err: 'cancel like fail'
                })
              })
            } else {
              res.send({
                success: false,
                err: "you haven't like yet"
              })
            }
          })

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
    }
  } catch (e) {
    res.send({
      success: true,
      data: {
        code: '404',
        msg: 'network error',
      }
    })
  }
})

export default router;