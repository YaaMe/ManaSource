// Copyright Parity Technologies (UK) Ltd., 2017.
// Released under the Apache 2/MIT licenses.

'use strict';

const BigNumber = require('bignumber.js');
const { gasPrice = '10000' } = require('config');
const EventEmitter = require('events');

const { hex2big, hex2date } = require('../utils');
const { CachingTransport } = require('./transport');

class ParityConnector extends EventEmitter {
    /**
     * Abstraction over a connection to the Parity node.
     *
     * @param {RpcTransport} transport to the WebSocket JSON-RPC API
     */
    constructor (transport) {
        super();

        this._transport = transport;
        // Get default Gas Price
        this._gasPrice = new BigNumber(gasPrice);

        this
            .transport
            .subscribe('eth_getBlockByNumber', 'latest', false)
            .forEach(async (block) => {
                block.timestamp = hex2date(block.timestamp);

                this.block = block;
                this.emit('block', block);

                // Update the gas price
                this._gasPrice = await this.getGasPrice();
            });

        if (transport instanceof CachingTransport) {
            this.on('block', () => transport.invalidateCache());
        }
    }

    get gasPrice () {
        return this._gasPrice;
    }

    estimateGas (options) {
        return this
            ._transport
            .request('eth_estimateGas', options);
    }

    getBlock (blockNumber) {
        return this
            ._transport
            .request('eth_getBlockByNumber', blockNumber, false);
    }

    async getGasPrice () {
        const { bucketBounds, counts } = await this
              ._transport
              .request('parity_gasPriceHistogram');

        const total = counts.reduce((t, c) => t + c, 0);

        // Get the higher value of the range where 50% of the
        // last transactions lies
        let sum = 0;
        const index = counts.findIndex((count) => {
            sum += count;
            return sum > total * 0.25;
        });

        // The `bucketBounds` always has one more element than
        // the `counts`
        const gasPrice = new BigNumber(bucketBounds[index + 1]);

        // Round the gasPrice (in Gwei)
        const roundedGasPrice = gasPrice.div(Math.pow(10, 9)).ceil().mul(Math.pow(10, 9));

        return roundedGasPrice;
    }

    getStorageAt (address, location) {
        return this._transport.request('eth_getStorageAt', address, location);
    }

    /**
     * Get the transaction data
     *
     * @param  {String} txHash
     * @return {Promise<Object>}
     */
    getTx (txHash) {
        return this
            ._transport
            .request('eth_getTransactionByHash', txHash);
    }

    /**
     * Get the transaction receipt
     *
     * @param  {String} txHash
     * @return {Promise<Object>}
     */
    getTxReceipt (txHash) {
        return this
            ._transport
            .request('eth_getTransactionReceipt', txHash);
    }

    /**
     * Get next nonce for address
     *
     * @param  {String} address
     *
     * @return {Promise<String>} `0x` prefixed hex nonce
     */
    nextNonce (address) {
        return this
            ._transport
            .request('parity_nextNonce', address);
    }

    /**
     * Get chain id / network version
     *
     * @return {Promise<String>} The chain id
     */
    netVersion () {
        return this
            ._transport
            .request('net_version');
    }

    /**
     * Send a signed TX to the Parity node
     *
     * @param  {String} tx `0x` prefixed hex data
     *
     * @return {Promise<String>} `0x` prefixed tx hash
     */
    sendTx (tx) {
        return this
            ._transport
            .request('eth_sendRawTransaction', tx);
    }

    /**
     * Get a transaction receipt by hash.
     *
     * Note: This will await till the transaction has been mined.
     *
     * @param  {String} hash `0x` prefixed tx hash
     *
     * @return {Promise<Object>} tx receipt: https://github.com/paritytech/parity/wiki/JSONRPC-eth-module#returns-20
     */
    transactionReceipt (hash) {
        return new Promise((resolve, reject) => {
            let attempts = 0;

            const attempt = () => {
                attempts += 1;

                this
                    ._transport
                    .request('eth_getTransactionReceipt', hash)
                    .then((receipt) => {
                        console.log('receipt.blockNumber', receipt.blockNumber);

                        if (receipt.blockNumber) {
                            return resolve(receipt);
                        }

                        if (attempts >= 60) {
                            reject(new Error('Exceeded allowed attempts'));
                        } else {
                            // Try again next block
                            this.once('block', attempt);
                        }
                    })
                    .catch((err) => {
                        if (attempts >= 10) {
                            reject(err);
                        } else {
                            console.error('Error while getting receipt, will retry:', err.message);

                            // Try again next block
                            this.once('block', attempt);
                        }
                    });
            };

            this.once('block', attempt);
        });
    }

    /**
     * Get the balance for address
     *
     * @param  {String} address
     *
     * @return {Promise<Number>} balance in wei.
     */
    balance (address) {
        return this
            ._transport
            .request('eth_getBalance', address)
            .then(hex2big);
    }

    logs (options) {
        return this
            ._transport
            .request('eth_getLogs', options);
    }

    trace (options) {
        return this
            ._transport
            .request('trace_filter', options);
    }

    /**
     * Direct access to the underlying transport.
     * Get next nonce for address
     *
     * @return {RpcTransport}
     */
    get transport () {
        return this._transport;
    }

    /**
     * Get the status of the connection.
     *
     * @return {String} connected|disconnected
     */
    get status () {
        return this._transport.connected ? 'connected' : 'disconnected';
    }
}

module.exports = ParityConnector;
