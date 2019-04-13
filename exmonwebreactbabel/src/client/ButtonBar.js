import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import MenuFormer from './MenuFormer.js';

const styles = {
  root: {
    flexGrow: 1,
  },
  flex: {
    flex: 1,
  },
  appbar: {
    boxShadow: '0px 0px 1px 1px rgba(0, 0, 0, .30)',
  }
};

class ButtonBar extends React.Component {

  constructor(props) {
    super(props);
  }
  redirectAuth(e) {
    e.preventDefault();

    sessionStorage.clear();
    this.props.history.push('/login');
  }
  handleClickOpen = (e) => {
    this.props.handleClickOpen(e);
  }
  loginButton = (e) => {
    if(this.props.userName === 'guest') {
      return(
        <Button onClick={e => this.redirectAuth(e)}>
        Sign in
      </Button>);
    } else {
      return(
        <Button onClick={e => this.redirectAuth(e)}>
        Sign out
      </Button>);
    }
  }
  titleBar = (classes) => {
    if(this.props.hostname === ""){
      return (<Typography variant="title" color="inherit" className={classes.flex}>
      Нажмите левую верхнюю левую кнопку, чтобы выбрать пользователя для посещения.
      </Typography>);
    }
    return (<Typography variant="title" color="inherit" className={classes.flex}>
    {this.props.hostname}Блог
    </Typography>);
  }
  render() {
    const { classes } = this.props;

    return (
      <div className={classes.root}>
        <AppBar position="static" color="default" className={classes.appbar}>
          <Toolbar>
            <MenuFormer  userName={this.props.userName} history={this.props.history}
              handleClick={e => this.handleClickOpen(e)}/>
            {this.titleBar(classes)}

            {this.loginButton()}
          </Toolbar>
        </AppBar>
      </div>
    );
  }
}

ButtonBar.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(ButtonBar);
