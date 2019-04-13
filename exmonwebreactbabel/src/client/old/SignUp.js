import React from 'react';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import axios from 'axios';
var sha256 = require('js-sha256');

class SignUp extends React.Component {

  constructor() {
    super();
    this.state = {
      field_user: "",
      field_pass: "",
      error: false
    };
    document.title = "Sign Up";
  }
  componentWillMount = () => {
    var userInfoObject = sessionStorage.getItem('userInfo');
    if(userInfoObject != null) {
      var username = JSON.parse(userInfoObject)['username'];
      this.props.history.push('/blog/' + username);
    }
  };
  handleChange = name => event => {
    this.setState({
      [name]: event.target.value,
      error: false
    });
    console.log(this.state.field_user);
    console.log(this.state.field_pass);
  };

  toggleSignUp = e => {
    /*var re = RegExp('^(?=.*[a-zA-Z])(?=.*[0-9])[a-zA-Z0-9]+$');*/
    if(/^[a-zA-Z1-9]+$/.test(this.state.field_user) === false) {
      window.alert('Please re-enter: the nickname needs to be a combination of English words and numbers.');
      this.setState({
        error: true,
        field_user: "",
        field_pass: ""
      });
      return;
    };
    window.alert('axios');
    axios.post('/user/signup', {
      userName: this.state.field_user,
      psw: sha256(this.state.field_pass),
      updateDate: Date()
    })
    .then((res) => {
          window.alert('Signup！');window.alert(res);
      if(res.data._message == null) {
        window.alert('Successful！');
        this.loginPage();
      } else {
        console.log('fail！');
        console.log(res);
        window.alert(res.data._message + ' (already used or invalid)');
        this.setState({
          error: true,
          field_user: "",
          field_pass: ""
        });
      }
    })
    .catch(function (error) {
      console.log(error);
    });
  };

  loginPage = e => {
    this.props.history.push('/login');
  }

  render() {
    return (
      <Dialog
        open
        style={{backgroundImage: 'url("/assets/signup.jpg")', backgroundSize:'cover'}}
        onClose={this.toggleLogin}
        fullScreen={this.props.fullScreen}>
        <DialogTitle>Sign Up</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Join us! Please enter your login and password.
          </DialogContentText>
          <TextField
            autoFocus
            error={this.state.error}
            margin="dense"
            id="username"
            label="Username"
            type="username"
            value={this.state.field_user}
            onChange={this.handleChange('field_user')}
            fullWidth
          />
          <TextField
            autoFocus
            error={this.state.error}
            margin="dense"
            id="password"
            label="Password"
            type="password"
            value={this.state.field_pass}
            onChange={this.handleChange('field_pass')}
            fullWidth
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={this.loginPage} color="secondary">
            Go back
          </Button>
          <Button onClick={this.toggleSignUp} color="primary">
            Sign Up
          </Button>
        </DialogActions>
      </Dialog>
    );
  }
}

export default SignUp;
