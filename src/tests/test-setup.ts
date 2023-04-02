import { use } from 'chai';
import { main } from '../server';
import chaiExclude from 'chai-exclude';

use(chaiExclude);

void main('test.env').then(() => {
  console.log('Starting test switch');
  run();
});
