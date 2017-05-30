import React from 'react';
import { BrowserRouter as Router, Route } from 'react-router-dom';
import routes from './routes/index';
import Header from './components/Header';

const App = () => (
  <Router>
    <div>
      <Header routes={routes} />
      <div className="content">
        {routes.map(route => <Route exact path={`/${route.path}`} key={route.path} component={route.component} />)}
      </div>
    </div>
  </Router>
);
export default App;