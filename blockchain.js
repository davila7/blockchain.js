const SHA256 = require ('crypto-js/sha256');

class Transactions{
    constructor(fromAddress, toAddress, amount){
        this.fromAddress = fromAddress;
        this.toAddress = toAddress;
        this.amount = amount;
    }
}

class Block{
    constructor(timestamp, transactions, previusHash=''){
        this.timestamp = timestamp;
        this.transactions = transactions;
        this.previusHash = previusHash
        this.hash = this.calculateHash();
        this.nonce = 0;
    }

    calculateHash(){
        return SHA256(
            this.index + 
            this.previusHash + 
            this.timestamp + 
            JSON.stringify(this.data) + 
            this.nonce).toString();
    }

    mineBlock(difficulty){
        while(this.hash.substring(0, difficulty) 
                    !== Array(difficulty +1).join("0")){
            this.nonce++;
            this.hash = this.calculateHash();
            console.log(this.hash);
        }
        console.log('Block minned: '+this.hash);
    }
}

class Blockchain{
    constructor(){
        this.chain = [this.createGenesisBlock()];
        this.difficulty = 5;
        this.pendingTransactions = [];
        this.miningReward = 100;
    }

    createGenesisBlock(){
        return new Block('01/01/2022', 'Genesis Block', '');
    }

    getLatestBlock(){
        return this.chain[this.chain.length -1];
    }

    minePendingTransactions(miningRewardAddress){

        let block = new Block(Date.now(), this.pendingTransactions);
        block.mineBlock(this.difficulty);

        console.log('Bloque minado con éxito...');

        this.chain.push(block);

        this.pendingTransactions = [
            new Transactions(null, miningRewardAddress, this.miningReward)
        ]

    }

    createTransactionc(transaction){
        this.pendingTransactions.push(transaction);
    }

    getBalanceOf(address){
        let balance = 0;
        for(const block of this.chain){
            for(const trans of block.transactions){
                if(trans.fromAddress  === address){
                    balance -= trans.amount;
                }
                if(trans.toAddress  === address){
                    balance += trans.amount;
                }
            }
        }
        return balance;
    }

    addBlock(newBlock){
        newBlock.previusHash = this.getLatestBlock().hash;
        newBlock.mineBlock(this.difficulty);
        this.chain.push(newBlock);
    }

    isChainValid(){
        for(let i = 1; i < this.chain.length; i++)
        {
            const currentBlock = this.chain[i];
            const previusBlock = this.chain[i -1]; 

            if(currentBlock.hash !== currentBlock.calculateHash()){
                return false;
            }

            if(currentBlock.previusHash !== previusBlock.hash){
                return false;
            }
        }
        return true;
    }
}

let myBlockchain = new Blockchain();

myBlockchain.createTransactionc(new Transactions('0x0001', '0x0002', 100));
myBlockchain.createTransactionc(new Transactions('0x0001', '0x0003', 400));
console.log('comenzamos a minar...');
myBlockchain.minePendingTransactions('0x0009');

console.log('Balance de 0x0009', myBlockchain.getBalanceOf('0x0009'));

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