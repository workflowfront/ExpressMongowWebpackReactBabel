import React from 'react';
import ReactDOM from 'react-dom';
import Main from "./app.js";
import { routesNestedUpdate, routesNestedReset } from 'action'
/*  <Route path="/blog/edit/:id" component={EditPost} />
  <Route path="/blog/show/:id" component={ShowPost} />*/
ReactDOM.render(
  <Main/>,
  document.getElementById("root")
);
