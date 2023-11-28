import { main as server } from './server';
let x = 0;

async function main() {
  console.log('heloooooo', x);
  await server();
  x += 1;
  setTimeout(() => {
    console.log('ele espera POG', x);
    x += 1;
  });
}

void main();
