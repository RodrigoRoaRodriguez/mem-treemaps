import TreemapShowcase from './TreemapShowcase';
import temp from './Temp';
import Experiments from './Experiments';
import Distributions from './Distributions';

const routes = [
  // { name: 'Home', component: Home, path: '' },
  { name: 'Tilings Showcase', component: TreemapShowcase, path: 'tilings' },
  { name: 'Experiments', component: Experiments, path: 'experiments' },
  { name: 'Temp', component: temp, path: 'temp' },
  { name: 'Distributions', component: Distributions, path: 'distributions'},
];

export default routes;
