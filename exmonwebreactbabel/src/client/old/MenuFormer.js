import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Drawer from '@material-ui/core/Drawer';
import Button from '@material-ui/core/Button';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import MenuIcon from '@material-ui/icons/Menu';
import IconButton from '@material-ui/core/IconButton';
import Avatar from '@material-ui/core/Avatar';

const styles = {
  list: {
    width: 250,
  },
  menuButton: {
    marginLeft: -12,
    marginRight: 20,
  }
};

class MenuFormer extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      left: false,

    };
  }
  toggleFormer= (side, open) => () => {
    this.setState({
      [side]: open,
    });
  };
  redirectAuth = (e) => {
    e.preventDefault();
    sessionStorage.clear();
    this.props.history.push('/login');
  };
  returnUser = (e) => {
    e.preventDefault();
    this.props.history.push('/blog/' + this.props.userName);
    location.reload();

  }
  handleClickOpen = (e) => {
    e.preventDefault();
    this.props.handleClick(e);
  }

  loginButton = () => {
    if(this.props.userName === 'guest') {
      return(<List>
        <ListItem button
          onClick={e => this.handleClickOpen(e)}>
            Users list
        </ListItem>
        <ListItem button onClick={e => this.redirectAuth(e)}>
        Sign in
      </ListItem></List>);
    } else {
      return(<List>
                <ListItem dense button
          onClick={e => this.returnUser(e)}>
              <Avatar alt="user" src="/assets/robot.jpg" />
              <ListItemText primary={this.props.userName + "，Welcome！"} />
        </ListItem>
        <ListItem button onClick={e => this.returnUser(e)}>
          My blog
        </ListItem>
        <ListItem button
          onClick={e => this.handleClickOpen(e)}>
          Users list
        </ListItem>
        <ListItem button onClick={e => this.redirectAuth(e)}>
        Sign out
      </ListItem></List>);
    }
  }

  render() {
    const { classes } = this.props;

    const sideList = (
      <div className={classes.list}>
        {this.loginButton()}
      </div>
    );

    return (
      <div>
        <IconButton className={classes.menuButton} onClick={this.toggleFormer('left', true)}
            color="inherit" aria-label="Menu">
          <MenuIcon/>
        </IconButton>
        <Drawer open={this.state.left} onClose={this.toggleFormer('left', false)}>
          <div
            tabIndex={0}
            role="button"
            onClick={this.toggleFormer('left', false)}
            onKeyDown={this.toggleFormer('left', false)}
          >
            {sideList}
          </div>
        </Drawer>
      </div>
    );
  }
}

MenuFormer.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(MenuFormer);
