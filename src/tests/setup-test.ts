export default async function setup() {
  const { main } = await import('../server');
  console.log('before main');
  await main('test.env');
  console.log('after main');
}
