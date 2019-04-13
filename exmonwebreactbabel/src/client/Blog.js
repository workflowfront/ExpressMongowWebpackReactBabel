import React from 'react';
import {render} from 'react-dom';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import ButtonBar from './ButtonBar';
import PreviewPost from './PreviewPost';
import { Grid } from '@material-ui/core';
import FinishList from './FinishList';
import EditIcon from '@material-ui/icons/Create';
import AddIcon from '@material-ui/icons/Add';
import Button from '@material-ui/core/Button';
import EditPost from './EditPost';
import AddPost from './AddPost';
import axios from 'axios';
import CustomDialog from './CustomDialog';
import classNames from 'classnames';


const styles = {
  bg: {
    height:  '90vh',
    backgroundSize: 'cover',
    backgroundImage: 'url("/assets/blog.jpg")'
  }
};

class Blog extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      userName: "",
      hostname: "",
      title: "",
      time: "",
      content: "",
      hash: "",
      postList: [],
      userList: [],
      mode: "preview",
      open: false,
    };
  }
/*  onBackButtonEvent:(e) => {
  e.preventDefault();
 this.goBack();
}*/
  componentDidMount(){
    //window.onpopstate = this.onBackButtonEvent;
    var userInfoObject = sessionStorage.getItem('userInfo');
    if(userInfoObject == null) {
      window.alert('You are not logged in! Enter guest browsing mode...');
      var userName = "guest";
    } else {
      var userName = JSON.parse(userInfoObject)['userName'];
    }
    var host = this.props.location.pathname.split('/')[2];
    if(host === undefined) {
      host = "";
    }
    axios.get('/user/listUsers', {
      params: {
        userName: userName
      }
    })
    .then( (res) => {
      for(var i = 0; i < res['data'].length; i++) {
        var user = JSON.parse(res['data'][i]);
        this.setState({
          userList: this.state.userList.concat(user),
        });
      }
    })
    .catch(function (error) {
      console.log(error);
    });

    axios.get('/blog', {
      params: {
        hostname: host
      }
    })
    .then( (res) => {
      res.data.sort((a, b) => a.timestamp - b.timestamp);
      for(var i = 0; i < res['data'].length; i++) {
        var post = res['data'][i];

        post['pressed'] = false;
        this.setState({
          postList: this.state.postList.concat(post),
        });
      }
    })
    .catch(function (error) {
      console.log(error);
    });

    this.setState({
      userName: userName,
      hostname: host
    }, () => {
      document.title = this.state.userName;
    });

  }
  deletePost = () => {
    axios.delete('/blog/'+this.state.hash, {
      params: {
        hash: this.state.hash
      }
    })
    .then( (res) => {
      var tmpList = [];
      var original_title = [];
      for(var i = 0; i < this.state.postList.length; i++) {
        var post = this.state.postList[i];
        if(post['hash'] === this.state.hash) {
          original_title = post['title'];
          continue; // i.e. remove this post
        } else {
          post['pressed'] = false;
        }
        tmpList.push(post);
      }
      this.setState({
        postList: tmpList,
        mode: "preview",
        title: "",
        time: "",
        content: "",
        hash: ""
      }, () => {
        window.alert('deleted: ' + original_title);
      });
      this.props.history.push("/");
    })
    .catch((error) => {
      console.log(error);
    })
  }
  funcPost(){
    if(this.state.mode === "none"){
      return null;
    } else if(this.state.mode === "preview"){
      return <PreviewPost title={this.state.title} time={this.state.time} content={this.state.content}
              handleEdit={this.handleEdit} isSelf={this.state.userName === this.state.hostname}
              deletePost={this.deletePost}/>;
    } else if(this.state.mode === "edit"){
      return <EditPost
        title={this.state.title} time={this.state.time} content={this.state.content}
        handleTitle={this.handleTitle} handleContent={this.handleContent}
        savePost={this.savePost} cancelPost={this.cancelPost}/>;
    }else if(this.state.mode === "add"){
      return <AddPost
        title={this.state.title} time={this.state.time} content={this.state.content}
        handleTitle={this.handleTitle} handleContent={this.handleContent}
        createPost={this.createPost} cancelPost={this.cancelPost}/>;
    }
  }
  funcFabAdd() {
    if(this.state.hostname !== this.state.userName) return null;
    return(
      <Button variant="fab" color="default" onClick={e => this.handleFabAdd(e)}
      style={{position: 'absolute',
        bottom: 100,
        right: 30}}>
      <AddIcon/>
    </Button>);
  }
    funcFab() {
      if(this.state.hostname !== this.state.userName) return null;
      return(
        <Button variant="fab" color="secondary" onClick={e => this.handleFab(e)}
      style={{position: 'absolute',
        bottom: 30,
        right: 30}}>
      <EditIcon/>
    </Button>
  );
  }
  handleEdit = (e) => {
    e.preventDefault();
    this.setState({
      mode: "edit",
    });
  }
  handleFabAdd = (e) => {
    e.preventDefault();
    this.setState({
      mode: "add",
      hash: "",
      title: "",
      time: "",
      content: "",

    });
  }
  handleFab = (e) => {
    e.preventDefault();
    this.setState({
      mode: "edit",
      hash: "",
      title: "",
      time: "",
      content: "",

    });
  }
  handlePreview = (hash) => {

    var tmpList = [];
    for(var i = 0; i < this.state.postList.length; i++) {
      var post = this.state.postList[i];
      if(post['hash'] === hash) {
        post['pressed'] = true;
        this.setState({
          title: post['title'],
          time: post['time'],
          content: post['content'],
          hash: post['hash']
        });
      } else {
        post['pressed'] = false;
      }
      tmpList.push(post);
    }
    this.setState({
      postList: tmpList,
      mode: "preview",
    });
  }
  handleTitle = (val) => {
    this.setState({
      title: val
    })
  }
  handleContent= (val) => {
    this.setState({
      content: val
    })
  }
  cancelPost= () => {
    if(this.state.hash === "") {
      this.setState({
        title: "",
        time: "",
        content: "",
        hash: "",
        mode: "preview",
      });
    } else {
      for(var i = 0; i < this.state.postList.length; i++) {
        var post = this.state.postList[i];
        if(post['hash'] === this.state.hash) {
          this.setState({
            title: post['title'],
            time: post['time'],
            content: post['content'],
            hash: post['hash'],
            mode: "preview",
          }, () => {
            return;
          });
        }
      }
    }

  }
  createPost= () => {
      var hash = Math.random().toString(36).substr(2, 5),
      newPost = true,
      mainres = null;
    this.setState({
      hash: hash
    }, () => {
      axios.post('/blog', {
        title: this.state.title,
        content: this.state.content,
        hash: this.state.hash,
        author: this.state.userName
      })
      .then((res) => {
        console.log(res);
        mainres = res.data;
        mainres['pressed'] = false;

        if(newPost === true){
          this.setState({
            postList: this.state.postList.concat(mainres),
            title: "",
            time: "",
            content: "",
            hash: "",
            mode: "preview"
          });
        } else {
          var tmpList = [];
          for(var i = 0; i < this.state.postList.length; i++) {
            var post = this.state.postList[i];
            if(post['hash'] === hash) {

              post = mainres;
            } else {
              // do nothing
            }
            tmpList.push(post);
          }
          tmpList.sort((a, b) => a.timestamp - b.timestamp);

          this.setState({
            postList: tmpList,
            title: "",
            time: "",
            content: "",
            hash: "",
            mode: "preview"
          });
        };
        this.props.history.push("/blog");
      })
      .catch(function (error) {
        console.log(error);
      })
    })
  }
  savePost= () => {
    var newPost = false;
    if(this.state.hash === ""){
      var hash = Math.random().toString(36).substr(2, 5);
      newPost = true;
    } else {
      var hash = this.state.hash;
    }
    var mainres = null;
    this.setState({
      hash: hash
    }, () => {
      axios.put('/blog/'+this.state.hash, {
        title: this.state.title,
        content: this.state.content,
        hash: this.state.hash,
        author: this.state.userName
      })
      .then((res) => {
        console.log(res);
        mainres = res.data;
        mainres['pressed'] = false;

        if(newPost === true){
          this.setState({
            postList: this.state.postList.concat(mainres),
            title: "",
            time: "",
            content: "",
            hash: "",
            mode: "preview"
          });
        } else {
          var tmpList = [];
          for(var i = 0; i < this.state.postList.length; i++) {
            var post = this.state.postList[i];
            if(post['hash'] === hash) {

              post = mainres;
            } else {
              // do nothing
            }
            tmpList.push(post);
          }
          tmpList.sort((a, b) => a.timestamp - b.timestamp);

          this.setState({
            postList: tmpList,
            title: "",
            time: "",
            content: "",
            hash: "",
            mode: "preview"
          });
        };
          this.props.history.push("/blog");
      })
      .catch(function (error) {
        console.log(error);
      })
    })
  }

  handleClickOpen = (e) => {
    this.setState({
      open: true,
    });
  };

  handleClose = value => {
    this.setState({
      hostname: value,
      open: false }, () => {
        this.props.history.push('/blog/' + this.state.hostname);
        location.reload();
      });
  };


  render() {
const { classes } = this.props;
    return (
    <div className={classes.bg}>
    <ButtonBar history={this.props.history}
      userName={this.state.userName}
      hostname={this.state.hostname}
      handleClickOpen={e => this.handleClickOpen(e)}>
    </ButtonBar>
    <CustomDialog
          users={this.state.userList}
          open={this.state.open}
          onClose={this.handleClose}
        />
    <Grid container spacing={24}>
      <Grid item xs={12} sm={9}>
      {this.funcPost()}
      </Grid>
      <Grid item xs={8} sm={2}>
      <FinishList mode={this.state.mode} handlePreview={this.handlePreview}
      postList={this.state.postList}/>
      </Grid>
    </Grid>
    {this.funcFab()}
  {this.funcFabAdd()}

    </div>);
  }
}


Blog.propTypes = {
  classes: PropTypes.object.isRequired,
};
export default withStyles(styles)(Blog);
