const SHA256 = require('crypto-js/sha256');


class Block {
    constructor(index, timestamp, data, previousHash = '') {
        this.index = index;
        this.timestamp = timestamp;
        this.data = data;
        this.previousHash = previousHash;
        this.nonce = 0;
        this.hash = this.calculateHash();
    }

    calculateHash() {
        return SHA256(this.index + this.previousHash + this.timestamp + JSON.stringify(this.data) + this.nonce).toString();
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
        this.difficulty = 4;
    }

    createGenesisBlock() {
        return new Block(0, '06/03/2021', "Genesis Block", "0");
    }

    getLatestBlock() {
        return this.chain[this.chain.length - 1];
    }

    addBlock(newBlock) {
        newBlock.previousHash = this.getLatestBlock().hash;
        newBlock.mineBlock(this.difficulty);
        this.chain.push(newBlock);
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

buttCoin.addBlock(new Block(1, "06/03/2021", { amount: 4 }));
buttCoin.addBlock(new Block(2, "06/03/2021", { amount: 6 }));
console.log(JSON.stringify(buttCoin, null, 4));
console.log("Is buttCoin valid? : " + buttCoin.isChainValid());
console.log('----------------------------------------------------------')
//tampering with the blockchain data (hash won't match).
buttCoin.chain[1].data = { amount: 50 }
console.log(JSON.stringify(buttCoin, null, 4));
console.log("Is buttCoin valid? : " + buttCoin.isChainValid());
console.log('----------------------------------------------------------')
