import React from 'react';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import axios from 'axios';
import sha256 from 'js-sha256';


class Login extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      field_user: "",
      field_pass: "",
      error: false,
    };
    document.title = "Login";
  }
  componentWillMount = () => {
    var userInfoObject = sessionStorage.getItem('userInfo');
    if(userInfoObject != null) {
      var username = JSON.parse(userInfoObject)['userName'];
      window.alert('storage');
      this.props.history.push('/blog/' + username);
    }
  };
  handleChange = name => event => {
    this.setState({
      [name]: event.target.value,
      error: false,
    });
    console.log('handleChange');
  };

  toggleVisit = e => {
      console.log('toggleVisit');
    this.props.history.push('/blog');
  }
  toggleLogin = e => {  console.log('toggleLogin');
    /*var re = RegExp('^(?=.*[a-zA-Z])(?=.*[0-9])[a-zA-Z0-9]+$');
    if(this.state.field_user.match(re) === null)*/
    if(/^[a-zA-Z1-9]+$/.test(this.state.field_user) === false) {

      window.alert('error：invalid login');
      this.setState({
        error: true,
        field_user: "",
        field_pass: ""
      });
      return;
    }
    axios.post('/user/login', {
      userName: this.state.field_user,
      psw: sha256(this.state.field_pass),
      updateDate: Date()
    })
    .then((res) => {
      if(res.data != 'not found') {
        window.alert('Successful！');
        sessionStorage.clear();
        var userInfo = { 'userName': this.state.field_user,
          'psw': sha256(this.state.field_pass)};
        sessionStorage.setItem('userInfo', JSON.stringify( userInfo ));
        this.props.history.push('/blog/' + this.state.field_user);
      } else {
        console.log(res.data);
        window.alert(res.data);
        this.setState({
          error: true,
          field_user: "",
          field_pass: ""
        });
      }
    })
    .catch(function (error) {
      console.log('error!!!');
      console.log(error);
    })
  };

  signUpPage = e => {
    this.props.history.push('/signup')
  }

  render() {
    return (
      <div>
      <Dialog
        open
        onClose={this.toggleLogin}
        style={{backgroundImage: 'url("/assets/login.jpg")', backgroundSize:'cover'}}
        fullScreen={this.props.fullScreen}>
        <DialogTitle>Login</DialogTitle>
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
          <Button onClick={this.toggleVisit} variant="contained" color="secondary">
            Guest mode
          </Button>
          <Button onClick={this.signUpPage} variant="contained" color="secondary">
            Sign Up
          </Button>
          <Button onClick={this.toggleLogin} variant="contained" color="primary">
            Sign in
          </Button>
        </DialogActions>
      </Dialog>
      </div>
    );
  }
}

export default Login;
