import express from 'express';
import path from 'path';
import bodyParser from 'body-parser';
import mongoose from 'mongoose';

import UserCon from './src/server/controllers/user.js';
import PostCon from './src/server/controllers/post.js';
import {serverPort} from './src/server/options/config.json';

mongoose.Promise = global.Promise;
mongoose.set('useFindAndModify', false);
/*   const con = mongoose.connect('mongodb+srv://gisa:'+'!U65195051asiG'+'@cluster0-9qmxy.mongodb.net/test?retryWrites=true', { useNewUrlParser: true }).then(
     () => {console.log('Database is connected') },
     err => { console.log('Can not connect to the database'+ err)}
   );*/
const con = mongoose.createConnection('mongodb+srv://gisa:'+'!U65195051asiG'+'@cluster0-9qmxy.mongodb.net/test?retryWrites=true', { useNewUrlParser: true });
const userCon = new UserCon(con);
const postCon = new PostCon (con);

const app = express();

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

//const publicPath = path.resolve(__dirname, '..', '..', 'public');
const publicPath = path.resolve(__dirname, 'public');
app.use(express.static(publicPath));

/**
   * User section
   */

app.post('/user/signup', (req, res) => {
    var newUser = {
        userName: req.body.userName,
        psw: req.body.psw,
        updateDate: req.body.updateDate};
    userCon.saveUsers(newUser, res);
});

app.post('/user/login', (req, res) => {
    var checkUser = {
        userName: req.body.userName,
        psw: req.body.psw,
        updateDate: req.body.updateDate
    };

    userCon.findUser(checkUser, res);
});

app.get('/user/listUsers', (req, res) => {
    const main = req.query.userName;

    userCon.findUsersList(main, res);
});

/**
   * Post section
   */

   app.put('/blog/:id', (req, res) => {
       const date = new Date();
       const localeSpecificTime = date.toLocaleTimeString();
       const localeSpecificDate = date.toLocaleDateString();

       const newPost = {
           title: req.body.title,
           content: req.body.content,
           timestamp: new Date().getTime().toString(),
           time: localeSpecificTime + ", " + localeSpecificDate,
           hash: req.body.hash,
           author: req.body.author};

       postCon.editPosts(newPost, res);
   });
   app.post('/blog', (req, res) => {
       const date = new Date();
       const localeSpecificTime = date.toLocaleTimeString();
       const localeSpecificDate = date.toLocaleDateString();

       const newPost = {
           title: req.body.title,
           content: req.body.content,
           timestamp: new Date().getTime().toString(),
           time: localeSpecificTime + ", " + localeSpecificDate,
           hash: req.body.hash,
           author: req.body.author};

       postCon.addPosts(newPost, res);
   });

   app.delete('/blog/:id', (req, res) => {
       const hash = req.query.hash;
       postCon.deletePost(hash, res);
   });

   app.get('/blog', (req, res) => {
    const host = req.query.hostname;
    console.log('host');
    console.log(host);
    postCon.findPostsList(host, res);
});

app.get('/*', function(req, res) {
    res.sendFile(path.join(__dirname, 'public','index.html'), function(err) {
      if (err) {
        res.status(500).send(err)
      }
    });
});

app.listen(serverPort, () => {
    console.log(`Server listening on port ${serverPort} and looking in folder ${publicPath}`);
});
