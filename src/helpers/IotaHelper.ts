import * as Mam from '@iota/mam';
import { asciiToTrytes, trytesToAscii } from '@iota/converter';

const debug = false;
const provider = debug ? 'https://nodes.devnet.iota.org:443' : 'https://nodes.thetangle.org:443';
const depth = 3;
const minimumWeightMagnitude = debug ? 9 : 14;
let state = Mam.init(provider);

export const publish = async (data: {}, secret: string = null) => {
	if (secret) {
		state = Mam.changeMode(state, 'restricted', secret);
	}

	const trytes = asciiToTrytes(JSON.stringify(data));
	const message = Mam.create(state, trytes);

	state = message.state;

	const tx = await Mam.attach(message.payload, message.address, depth, minimumWeightMagnitude);
	console.log(tx);
	return { root: message.root, address: message.address };
};

export const fetch = async (root: string, secret: string = null) => {
	const data = secret ? await Mam.fetch(root, 'restricted', secret) : await Mam.fetch(root, 'public');
	if (data instanceof Error) {
		console.error(data);
		return;
	}

	if (!data.messages || data.messages.length == 0) {
		console.error('messages empty', data);
		return;
	}

	console.log(data);

	return data.messages.map(message => JSON.parse(trytesToAscii(message)));
};

export const generateSecret = (length = 20) => {
	let text = '';
	const alphabet = '9ABCDEFGHIJKLMNOPQRSTUVWXYZ';

	for (let i = 0; i < length; i++) {
		text += alphabet.charAt(Math.floor(Math.random() * alphabet.length));
	}
	return text;
};
