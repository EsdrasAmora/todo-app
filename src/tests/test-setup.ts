import { use } from 'chai';
import { main } from '../server';
import chaiExclude from 'chai-exclude';

use(chaiExclude);

void main('test.env').then(async () => {
  const { clearDatabase } = await import('../tests/clear-db');
  console.log('aqqasdasdasd');
  await clearDatabase();
  console.log('Starting test switch');
  run();
});
