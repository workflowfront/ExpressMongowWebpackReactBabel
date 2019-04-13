import React from 'react';
import ReactDOM from 'react-dom';
import Styles from './app.scss';
import { BrowserRouter, Route, Switch, Redirect } from 'react-router-dom';
import Login from './Login.js';
import SignUp from './SignUp.js';
import Blog from './Blog.js';
import CreatePost from './CreatePost.js';
/*  <Route path="/blog/edit/:id" component={EditPost} />
  <Route path="/blog/show/:id" component={ShowPost} />*/
ReactDOM.render((
  <BrowserRouter>
    <Switch>
      <Route exact path="/" component={Login} />
      <Route path="/signup" component={SignUp} />
      <Redirect from="/login" to="/" />
      <Route path="/blog/*" component={Blog} />
      <Route path="/blog/create" component={CreatePost} />
    </Switch>
  </BrowserRouter>
), document.getElementById('root'));
