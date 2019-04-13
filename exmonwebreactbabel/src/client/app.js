import React from 'react';
import ReactDOM from 'react-dom';
import Styles from './app.scss';
import { BrowserRouter, Route, Switch, Redirect } from 'react-router-dom';
import Login from './Login.js';
import SignUp from './SignUp.js';
import Blog from './Blog.js';
import { routesNestedUpdate, routesNestedReset } from 'action'
/*  <Route path="/blog/edit/:id" component={EditPost} />
  <Route path="/blog/show/:id" component={ShowPost} />*/
  class Main extends React.Component{
    componentDidMount() {
    window.onpopstate = this.handlePopState;
    this.applyParams();
  }

  componentWillUnmount() {
    window.onpopstate = null;
  }

  shouldComponentUpdate(nextProps) {
    return _.isEqual(this.props.location, nextProps.location);
  }

  handlePopState = (event) => {
    event.preventDefault();
    this.applyParams();
  }
  applyParams() {
    //this.params = this.props.location.state || {};
    window.alert('appl');
    //this.fetchBooks();
  }
  render() {
      return (
  <BrowserRouter>
    <Switch>
      <Route exact path="/" component={Login} />
      <Route path="/signup" component={SignUp} />
      <Redirect from="/login" to="/" />
      <Route path="/blog" component={Blog} />
  <Route path="/blog/:id" component={Blog} />
    </Switch>
  </BrowserRouter>
);
}
}

export default Main;
