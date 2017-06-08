import TreemapShowcase from './TreemapShowcase';
// import temp from './Temp';
import Experiments from './Experiments';
import { Experiment1, Experiment2, Experiment3A, Experiment3B, Experiment3C } from './Experiments';
import Distributions from './Distributions';

const routes = [
  // { name: 'Home', component: Home, path: '' },
  { name: 'Tilings Showcase', component: TreemapShowcase, path: 'tilings' },
  { name: 'Experiment 1', component: Experiment1, path: 'experiment1' },
  { name: 'Experiment 2', component: Experiment2, path: 'experiment2' },
  { name: 'Experiment 3A', component: Experiment3A, path: 'experiment3A' },
  { name: 'Experiment 3B', component: Experiment3B, path: 'experiment3B' },
  { name: 'Experiment 3C', component: Experiment3C, path: 'experiment3C' },
  // { name: 'Experiments', component: Experiments, path: 'experiments' },
  // { name: 'Temp', component: temp, path: 'temp' },
  { name: 'Distributions', component: Distributions, path: 'distributions' },
];

export default routes;
