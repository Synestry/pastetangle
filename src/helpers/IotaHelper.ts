import IOTA = require('iota.lib.js');
import curl = require('curl.lib.js');
import localAttachToTangle = require('./localAttatchToTangle');
import { encrypt, decrypt } from './crypt';

const MAX_TRYTES = 2187;

export class IotaHelper {
    private iota: IotaClass;
    private seed: string;

    constructor() {
        this.iota = new IOTA({
            provider: process.env.IOTA_NODE || 'https://node.tangle.works:443'
        });

        this.iota.api.attachToTangle = localAttachToTangle.default(this.iota, curl);

        this.seed = this.createSeed();

        curl.init();
    }

    public createSeed(): string {
        let text = '';
        const alphabet = '9ABCDEFGHIJKLMNOPQRSTUVWXYZ';

        for (let i = 0; i < 81; i++) {
            text += alphabet.charAt(Math.floor(Math.random() * alphabet.length));
        }
        return text;
    }

    public async uploadToTangle(data: {} | string, metaData: {} | string): Promise<{ bundle: number, seed: string }> {
        let address = await this.generateAddress();
        let tx = this.createTransactions(data, metaData, address);
        let to = await this.sendTransactions(tx);

        return {
            bundle: to.bundle,
            seed: this.seed,
        };
    }

    public async fetchFromTangle<D, M>(bundle: string, seed: string): Promise<{ data: D, metaData: M }> {
        let transactions = await this.getTransactions(bundle);
        transactions = transactions.sort((a, b) => a.currentIndex - b.currentIndex);
        let trytes = transactions.map(tx => tx.signatureMessageFragment);

        let data = this.trytesToBase64(trytes);
        return decrypt(data, seed) as { data: D, metaData: M };
    }

    private generateAddress(): Promise<string> {
        return new Promise((resolve, reject) => {
            this.iota.api.getNewAddress(this.seed, {}, (error, address) => {
                if (error) {
                    reject(error);
                } else {
                    resolve(address as string);
                }
            });
        });
    }

    private sendTransactions(txs: TransferObject[]): Promise<TransactionObject> {
        return new Promise((resolve, reject) => {
            this.iota.api.sendTransfer(
                this.seed, 4, 14, txs, {}, (error: Error, transactions: TransactionObject[]) => {
                    if (error) {
                        reject(error);
                    } else {
                        resolve(transactions[0]);
                    }
                });
        });
    }

    private toTrytes(data: string) {
        return this.iota.utils.toTrytes(data);
    }

    private trytesToBase64(tryteChunks: string[]) {
        const regExp = new RegExp('9+$');
        tryteChunks[tryteChunks.length - 1] = tryteChunks[tryteChunks.length - 1].replace(regExp, '');
        return this.iota.utils.fromTrytes(tryteChunks.join(''));
    }

    private makeChunks(trytes: string) {
        return trytes.match(new RegExp(`.{1,${MAX_TRYTES}}`, 'g'));
    }

    private createTransactions(data: {} | string, metaData: {} | string, address: string): TransferObject[] {
        let encrypedData = encrypt({ data, metaData }, this.seed);

        let trytes = this.toTrytes(encrypedData);
        if (!trytes) {
            throw new Error('Could not make trytes :S');
        }

        let chunks = this.makeChunks(trytes);
        if (!chunks) {
            throw new Error('Could not make chunks :S');
        }

        return chunks.map((chunk) => {
            return {
                'address': address,
                'value': 0,
                'message': chunk,
                'tag': 'PASTETANGLE',
            } as TransferObject;
        });
    }

    private getTransactions(bundle: string): Promise<TransactionObject[]> {
        return new Promise((resolve, reject) => {
            this.iota.api.findTransactionObjects({ bundles: [bundle] }, (error, transactions) => {
                if (error) {
                    reject(error);
                }
                resolve(transactions);
            });
        });
    }
}

export default new IotaHelper();