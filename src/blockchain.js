const SHA256 = require ('crypto-js/sha256');
const EC = require('elliptic').ec;
const ec = new EC('secp256k1');

class Transactions{
    constructor(fromAddress, toAddress, amount){
        this.fromAddress = fromAddress;
        this.toAddress = toAddress;
        this.amount = amount;
    }

    calculateHash(){
        return SHA256(this.fromAddress, this.toAddress, this.amount).toString();
    }

    signTransaction(signingKey){

        if(signingKey.getPublic('hex') !== this.fromAddress){
            throw new Error('You cannot sign transactions for other wallets!');
        }


        const hashTx = this.calculateHash();
        const sig = signingKey.sign(hashTx, 'base64');
        this.signature = sig.toDER('hex');
    }

    isValid(){
        if(this.fromAddress === null){
            return true;
        }

        if(!this.signature || this.signature === 0){
            throw new Error("No signature in this transaction");
        }

        const publicKey = ec.keyFromPublic(this.fromAddress, 'hex');
        return publicKey.verify(this.calculateHash(), this.signature);
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
            console.log('Nonce: '+this.nonce+' Hash: '+this.hash);
        }
        console.log('Block minned: '+this.hash);
    }

    hasValidTransactions(){
        for(const tx of this.transactions){
            if(!tx.isValid()){
                return false;
            }
        }
        return true;
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

        // let block = new Block(Date.now(), this.pendingTransactions);
        // block.mineBlock(this.difficulty);

        // console.log('Bloque minado con éxito...');

        // this.chain.push(block);

        // this.pendingTransactions = [
        //     new Transactions(null, miningRewardAddress, this.miningReward)
        // ]

        const rewardTx = new Transactions(null, miningRewardAddress, this.miningReward);
        this.pendingTransactions.push(rewardTx);

        const block = new Block(Date.now(), this.pendingTransactions, this.getLatestBlock().hash);
        block.mineBlock(this.difficulty);

        console.log('Block successfully mined!');
        this.chain.push(block);

        this.pendingTransactions = [];

    }

    addTransaction(transaction){
        if(!transaction.fromAddress || !transaction.toAddress){
            throw new Error('Transaction must include from an to address');
        }

        if(!transaction.isValid()){
            throw new Error('Cannot add invalid transaction to the chain');
        }

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
            //obtiene el block actual
            const currentBlock = this.chain[i];
            //obtiene el block anterior
            const previusBlock = this.chain[i -1]; 
            
            //valida que todas las transacciones dentro del block sean correctas
            //con la function hasValidTransactions() dentro del Block
            if(currentBlock.hasValidTransactions()){
                return false;
            }

            //revisa si el hash del block actual no se modifico llamando nuevamente a calculateHash()
            if(currentBlock.hash !== currentBlock.calculateHash()){
                return false;
            }

            //revisa que el previusHash del block actual es igual al hash del block anterior
            if(currentBlock.previusHash !== previusBlock.hash){
                return false;
            }
        }
        return true;
    }
}

module.exports.Blockchain = Blockchain;
module.exports.Transactions = Transactions;