import 

export class IotaHelper {
    createSeed() {
        let text = '';
        const alphabet = '9ABCDEFGHIJKLMNOPQRSTUVWXYZ';

        for (let i = 0; i < 81; i++) {
            text += alphabet.charAt(Math.floor(Math.random() * alphabet.length));
        }
        return text;
    }
}