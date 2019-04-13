import PostSchema from '../models/post.js';
import mongoose from 'mongoose';
 mongoose.set('useFindAndModify', false);
 //mongoose.set('useCreateIndex', false);
var Post = null;
class PostCon {

  constructor(con) {
      Post= con.model('Post', PostSchema);
  }
  addPosts(data, res) {
      const newPost= new Post({
            title: data.title,
            date: data.date,
            content: data.content,
            timestamp: data.timestamp,
            author: data.author,
            hash: data.hash
        });

                newPost.save( (err, data)=>{
                    console.log('dataPost!!'+data);
                    if(err){
                        console.log(err);
                        res.send(err);
                    }
                    else{
                        console.log(data);
                        res.send(data);
                    }
                  });

  };
  editPosts(data, res) {

      const query = {hash :data.hash};
      const updateData = {
            title: data.title,
            date: data.date,
            content: data.content,
            timestamp: data.timestamp,
            author: data.author,
            hash: data.hash
        };
      const params = { upsert: true, new: true, setDefaultsOnInsert: true };

        Post.findOneAndUpdate(query, updateData, params, (error, result) => {
            if (error) {
              console.log(err);
                  res.send(error);
                  return;
            } else {
                res.send(result);
            }
        }).exec();
  };
  findPostsList(host, res) {

    Post.find({author: host}, (error, posts) => {
  console.log('posts');
    console.log(posts);
        if (error) {
            console.log(error);
            res.send(error);
            return;
        } else {
            res.send(posts);
        }
    });
    }

    deletePost(hash, res) {
        const query = {hash: hash};
        Post.findOneAndRemove(query, (error, result) => {
            if (error) {
                console.log(error);
                res.send(error);
                return;
            } else {
                res.send(result);
            }
        });
    }
}
module.exports = PostCon;
