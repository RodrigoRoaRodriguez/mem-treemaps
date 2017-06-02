import React from 'react';
import { NavLink, withRouter } from 'react-router-dom';
import styled from 'styled-components';
import logo from '../images/logo.svg';

const HEIGHT = 5;

const Navigation = styled.nav`
  display: flex;
  background: #eee;
  height: ${HEIGHT}em;
  `;

const NavItem = styled(NavLink) `
  font-family: ${props => props.theme.font.heading}
  display: block;
  padding: 1.2em;
  justify-content: flex-end;
  text-align: center;
  height: ${HEIGHT}em;
  flex: 0 1 6em;
  color: #555;
  weight: bold;
  text-decoration: none;
  transition: color 1s, background .2s; 
  background: #eee;
  border-bottom: solid .3em ${({ color }) => color};


  &:hover, &.active {
    color: #000;
  }
  &:active {
    background: #fff;
  }
  &.active {
    color: #000;
    background: #fefefe;
    border-bottom: none;
    text-align: center;
    border-top: solid .3em ${({ color }) => color};
  }
  &.name {
    flex: 1;
    text-align:left;
    padding: 0 0 0 1.2em;
    height: ${HEIGHT}em;
  }

  `;

const Brand = styled.div` 
  display: flex;
  background: #eee;
  flex: 1 0 24em;
  align-items: center;
  & > img {
    height: 3em;
    margin: 0 1em;
  }
`;
const Name = styled.div` 
  & > h1 {
    margin: 0;
    font-weight: 300;
  }
  & > h2 {
    margin: 0;
    font-size: 1.4em;
    color: #888;
    font-weight: 300;
  }
`;

const Space = styled.div`flex:8;`;

const COLORS = ['#e91e63', '#ffc107', '#4caf50', '#2196f3'];

const Header = ({ routes }) => (
  <Navigation>
    <Brand>
      <a href="https://github.com/RodrigoRoaRodriguez">
        <img src={logo} className="App-logo" alt="logo" />
      </a>
      <NavItem to={'/'} className="name" color="#000">
        <Name>
          <h1> Rodrigo Roa Rodríguez </h1>
          <h2> Macro-Economic Metaphor Treemaps </h2>
        </Name>
      </NavItem>
    </Brand>
    <Space />
    {routes.map((route, i) => <NavItem key={route.path} to={`/${route.path}`} color={COLORS[i]}>{route.name}</NavItem>)}
  </Navigation>
);

export default Header;
