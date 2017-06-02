import React from 'react';
import { BrowserRouter as Router, Route } from 'react-router-dom';
import routes from './routes/index';
import Header from './components/Header';
import styled from 'styled-components';

const RoutesContainer = styled.div`
  display: flex;
  & > * { flex: 1 };
`;

const Gutter = styled.aside`
  background: #eee;
  flex: 0 0 80px;
`;

const Footer = styled.div`
  background: #eee;
  height: 80px;
`;

const App = () => (
  <Router>
    <div>
      <Header routes={routes} />
      <RoutesContainer>
        {/*<Gutter/>*/}
        {routes.map(route => <Route 
          exact 
          path={`/${route.path}`}
          key={route.path} 
          component={route.component}
          />)}
        {/*<Gutter />*/}
      </RoutesContainer>
      <Footer />
    </div>
  </Router>
);
export default App;