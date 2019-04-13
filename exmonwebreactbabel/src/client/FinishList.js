import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import List from '@material-ui/core/List';
import ListSubheader from '@material-ui/core/ListSubheader';
import FinishListItem from './FinishListItem.js';

const styles = theme => ({
  root: {
    width: '100%',
    maxWidth: 360,
    backgroundColor: theme.palette.background.paper,
    padding: 12,
    margin: theme.spacing.unit * 6,
  },
});

class FinishList extends React.Component {

  constructor(props) {
    super(props);
  }
  handlePreview = (key) => {

   this.props.handlePreview(key);
  }

  render(){
    const { classes } = this.props;
    var listItems = this.props.postList.map(item => (
      <FinishListItem
        hashNum={item.hash}
        key={item.hash}
        title={item.title}
        time={item.time}
        pressed={item.pressed}
        handlePreview={this.handlePreview}
        />
    ));

    return (
      <div className={classes.root}>
        <List component="nav"
          subheader={<ListSubheader component="div">Posts list</ListSubheader>}
                  >
          {listItems}
        </List>
      </div>
    );
  }
}

FinishList.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(FinishList);
