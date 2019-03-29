// import  n from './n';
// require.context('./imports', true, /.\/[^a]/);
// require.context('./imports', true, /.js$/);
importAll(require.context('./imports', true));
console.log('index');