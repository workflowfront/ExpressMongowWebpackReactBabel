const UserSchema = require('../models/user.js');
const mongoose = require('mongoose');
 mongoose.set('useFindAndModify', false);
 //mongoose.set('useCreateIndex', false);
var User = null;
class UserCon {

    constructor(con) {
        User = con.model('User', UserSchema);
    }

    saveUsers(data, res) {

        var newUser = new User({
            userName: data.userName,
            psw: data.psw,
            updateDate: data.updateDate
        });
        newUser.save((err, data)=>{
            console.log('data!!'+data);
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

    findUser(data, res) {
        var checkUser = new User({
            userName: data.userName,
            psw: data.psw,
            updateDate: data.updateDate
        });
        User.findOne({
            'userName': checkUser.userName,
            'psw': checkUser.psw }, (err, user) => {
console.log('user0');console.log(typeof user);
            if(err){
                console.log(err);
                res.send(err);
            } else if (user.length >0) {
                    console.log('user');
                console.log(user);
                res.redirect('/blog' + checkUser.userName);
            } else {
                console.log('not found1111');
                res.send('not found'+user.length);
            }
        });
    };

    findUsersList(main, res) {
        User.find({}, (err, users) => {
            var arr = [];
            for(var i = 0; i < users.length; i++) {
                if(users[i]['userName'] != main) {
                    var obj = JSON.stringify({name: users[i]['userName']});
                    arr.push(obj);
                }
            }
            if(arr.length === 0) {
                console.log('only one user...');
            }
            res.send(arr);
        });
    }

}

module.exports = UserCon;
