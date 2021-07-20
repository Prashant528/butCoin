const SHA256 = require('crypto-js/sha256');

class Transaction{
    constructor(fromAddress, toAddress, amount){
        this.fromAddress = fromAddress;
        this.toAddress = toAddress;
        this.amount = amount;
    }
}

class Block {
    constructor(timestamp, transactions, previousHash = '') {
        this.timestamp = timestamp;
        this.transactions = transactions;
        this.previousHash = previousHash;
        this.nonce = 0;
        this.hash = this.calculateHash();
    }

    calculateHash() {
        return SHA256(this.previousHash + this.timestamp + JSON.stringify(this.data) + this.nonce).toString();
    }

    //method for implementing proof-of-work
    mineBlock(difficulty) {
        while (this.hash.substring(0, difficulty) != Array(difficulty + 1).join("0")) {
            this.nonce++;
            this.hash = this.calculateHash();
        }
        console.log("Block mined with hash: " + this.hash);
    }

}


class BlockChain {
    constructor() {
        this.chain = [this.createGenesisBlock()];
        this.difficulty = 2;
        this.pendingTransactions = [];
        this.miningReward = 100;
    }

    createGenesisBlock() {
        return new Block('06/03/2021', "Genesis Block", "0");
    }

    getLatestBlock() {
        return this.chain[this.chain.length - 1];
    }

    minePendingTransactions(miningRewardAddress){
        //Here, pending transactions will contain all the transactions that are on the array.
        //In real bitCoin , the miner gets to choose which transactions he wants to include in the block.
        let block = new Block(Date.now(), this.pendingTransactions);
        block.mineBlock(this.difficulty);

        console.log("Block successfully mined!");
        this.chain.push(block);

        //add the transaction for rewarding to the pending transactions list.
        //From :system(so null), To:miner's address
        this.pendingTransactions=[new Transaction(null, miningRewardAddress, this.miningReward)];

    }

    createTransaction(transaction){
        this.pendingTransactions.push(transaction);
    }

    getBalanceOfAddress(address){
        let balance= 0;

        for(const block of this.chain){
            for(const trans of block.transactions){

                if(trans.fromAddress === address){
                    balance -= trans.amount;
                }

                if(trans.toAddress === address){
                    balance += trans.amount;
                }
            }
        }
        return balance;
    }

    isChainValid() {
        for (let i = 1; i < this.chain.length; i++) {
            const currentBlock = this.chain[i];
            const prevBlock = this.chain[i - 1];
            //check if the current block's hash is as it should be.
            if (currentBlock.hash != currentBlock.calculateHash()) {
                return false;
            }
            //check if the current block has the correct hash of the previous block.
            if (currentBlock.previousHash != prevBlock.hash) {
                return false;
            }
        }
        return true;
    }

}

//creating a new blockchain.
let buttCoin = new BlockChain();

buttCoin.createTransaction(new Transaction('address1', 'address2', 300));
buttCoin.createTransaction(new Transaction('address2', 'address1', 200));

console.log('\n Starting the miner ...');
buttCoin.minePendingTransactions('minerAdd');

console.log("Miner's balance = ", buttCoin.getBalanceOfAddress('minerAdd'));
console.log("Add1's balance = ", buttCoin.getBalanceOfAddress('address1'));
console.log("Add2's balance = ", buttCoin.getBalanceOfAddress('address2'));



console.log('\n Starting the miner again ...');
buttCoin.minePendingTransactions('minerAdd');

console.log("Miner's balance = ", buttCoin.getBalanceOfAddress('minerAdd'));