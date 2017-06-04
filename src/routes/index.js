import TreemapShowcase from './TreemapShowcase';
// import temp from './Temp';
import Experiments from './Experiments';
import { Experiment1, Experiment2, Experiment3 } from './Experiments';
import Distributions from './Distributions';

const routes = [
  // { name: 'Home', component: Home, path: '' },
  { name: 'Tilings Showcase', component: TreemapShowcase, path: 'tilings' },
  { name: 'Experiment 1', component: Experiment1, path: 'experiment1' },
  { name: 'Experiment 2', component: Experiment2, path: 'experiment2' },
  { name: 'Experiment 3', component: Experiment3, path: 'experiment3' },
  // { name: 'Experiments', component: Experiments, path: 'experiments' },
  // { name: 'Temp', component: temp, path: 'temp' },
  { name: 'Distributions', component: Distributions, path: 'distributions' },
];

export default routes;
