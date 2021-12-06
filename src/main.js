const {Blockchain, Transactions} = require('./blockchain.js');
const EC = require('elliptic').ec;
const ec = new EC('secp256k1');

const myKey = ec.keyFromPrivate('0de0ef587a63b0d68e8766bc75b894b1ec7c8a1ee0db282c6ac36a153357ae26');
const myWalletAddress = myKey.getPublic('hex');


let myBlockchain = new Blockchain();

const tx1 = new Transactions(myWalletAddress, 'public key goes here', 10);
tx1.signTransaction(myKey);

myBlockchain.addTransaction(tx1);

console.log('comenzamos a minar...');
myBlockchain.minePendingTransactions(myWalletAddress);

console.log('Balance de '+myWalletAddress, myBlockchain.getBalanceOf(myWalletAddress));

// console.log('Minando bloque 1....');
// myBlockchain.addBlock(new Block(1, '02/01/2022', { value : 3}));

// console.log('Minando bloque 2....');
// myBlockchain.addBlock(new Block(2, '03/01/2022', { value : 5}));

// console.log(JSON.stringify(myBlockchain, null, 4));

// console.log("Is Valid? "+ myBlockchain.isChainValid());

// //tratamos de cambiar la blockchain
// myBlockchain.chain[1].data = {amount : 100};
// myBlockchain.chain[1].hash = myBlockchain.chain[1].calculateHash();

// console.log("Is Valid? "+ myBlockchain.isChainValid());

// console.log(JSON.stringify(myBlockchain, null, 4));