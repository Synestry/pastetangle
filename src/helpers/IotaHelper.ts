const IOTA = require('iota.lib.js');
const curl = require('curl.lib.js');
const localAttachToTangle = require('./localAttatchToTangle');

const MAX_TRYTES = 2187;

export class IotaHelper {
    private iota: IotaClass;
    private seed: string;

    constructor() {
        this.iota = new IOTA({
            provider: process.env.IOTA_NODE
        });

        this.iota.api.attachToTangle = localAttachToTangle;

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

    public async uploadToTangle(data: {} | string, metaData: {} | string): Promise<TransactionObject[]> {
        let address = await this.generateAddress();
        let tx = this.createTransactions(JSON.stringify(data.toString()), JSON.stringify(metaData.toString()), address);
        return await this.sendTransactions(tx);
    }

    public async fetchFromTangle(bundle: string): Promise<{ data: {}, metaData: {} }> {
        let transactions = await this.getTransactions(bundle);
        transactions = transactions.sort((a, b) => a.currentIndex - b.currentIndex);
        let trytes = transactions.map(tx => tx.signatureMessageFragment);

        let chunks = this.trytesToBase64(trytes).split(',');
        let metaData = JSON.parse(chunks.shift() as string);
        let data = JSON.parse(chunks.join());

        return {
            data,
            metaData
        };
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

    private sendTransactions(txs: TransferObject[]): Promise<TransactionObject[]> {
        return new Promise((resolve, reject) => {
            this.iota.api.sendTransfer(
                this.seed, 4, 14, txs, undefined, (error: Error, response: { inputs: TransactionObject[] }
                ) => {
                    if (error) {
                        reject(error);
                    } else {
                        resolve(response.inputs);
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

    private createTransactions(data: string, metaData: string, address: string): TransferObject[] {
        let trytes = this.toTrytes(`${metaData},'${data}`);
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