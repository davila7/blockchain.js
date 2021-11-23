const SHA256 = require ('crypto-js/sha256');

class Block{
    constructor(index, timestamp, data, previusHash=''){
        this.index = index;
        this.timestamp = timestamp;
        this.data = data;
        this.previusHash = previusHash
        this.hash = this.calculateHash();
    }

    calculateHash(){
        return SHA256(this.index + this.previusHash + this.timestamp + JSON.stringify(this.data)).toString();
    }
}

class Blockchain{
    constructor(){
        this.chain = [this.createGenesisBlock()];
    }

    createGenesisBlock(){
        return new Block(0, '01/01/2022', 'Genesis Block', '');
    }

    getLatestBlock(){
        return this.chain[this.chain.length -1];
    }

    addBlock(newBlock){
        newBlock.previusHash = this.getLatestBlock().hash;
        newBlock.hash = newBlock.calculateHash();
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
myBlockchain.addBlock(new Block(1, '02/01/2022', { value : 3}));
myBlockchain.addBlock(new Block(2, '03/01/2022', { value : 5}));

console.log(JSON.stringify(myBlockchain, null, 4));

console.log("Is Valid? "+ myBlockchain.isChainValid());

//tratamos de cambiar la blockchain
myBlockchain.chain[1].data = {amount : 100};
myBlockchain.chain[1].hash = myBlockchain.chain[1].calculateHash();

console.log("Is Valid? "+ myBlockchain.isChainValid());

console.log(JSON.stringify(myBlockchain, null, 4));