import { NetworkName } from "@aptos-labs/wallet-adapter-react";
import { AptosClient, HexString, MaybeHexString } from "aptos"
import { MoveResource } from "aptos/src/generated";

export function getNetworkName(): NetworkName {
	if (!process.env.NEXT_PUBLIC_NODE_URL!.includes(process.env.NEXT_PUBLIC_NETWORK_NAME!)) {
		throw "NODE_URL does not match NETWORK_NAME";
	}
	switch(process.env.NEXT_PUBLIC_NETWORK_NAME!) {
		case 'mainnet':
			return NetworkName.Mainnet;
		case 'testnet':
			return NetworkName.Testnet;
		case 'devnet':
			return NetworkName.Devnet;
		default:
			return NetworkName.Testnet;
	}
}

export function intersection<T>(a: Array<T>, b: Array<T>): Array<T> {
	const B = new Set(b);
	return [...new Set(a)].filter(x => B.has(x));
}

export function difference<T>(a: Array<T>, b: Array<T>): Array<T> {
	const B = new Set(b);
	return [...new Set(a)].filter(x => !B.has(x));
}

export async function getEventStream(
	address: string,
	eventHandleStruct: string,
	fieldName: string,
	aptosClient: AptosClient,
	limit?: number,
	start?: number,
) {
	let endpointUrl = `${aptosClient.nodeUrl}/accounts/${address}/events/${eventHandleStruct}/${fieldName}`;
	if (start) {
		endpointUrl += limit ? `&start=${start}` : `?start=${start}`;
	}
	if (limit) {
		endpointUrl += `?limit=${limit}`;
	}

	const response = await fetch(endpointUrl, {
		method: "GET",
	});

	if (response.status === 404) {
		return [];
	}

	return Promise.resolve(await response.json());
}

export type TokenDataRestAPI = {
	data: {
		amount: string,
		id: {
			property_version: string,
			token_data_id: {
				collection: string,
				creator: string,
				name: string,
			}
		}
	},
	guid: {
		creation_number: string,
		account_address: string,
	},
	sequence_number: string,
	type: string,
	version: string,
}

export type MartianEventTokenData = {
	data: {
		property_version: string,
		token_data_id: {
			collection: string,
			creator: string,
			name: string,
		}
	},
	deposit_sequence_number: string,
	withdraw_sequence_number: string,
	difference: number,
}

export function defined(...args: any[]): boolean {
	return args.reduce((prev, curr) => prev && typeof curr !== 'undefined', true)
}

export const truncateAddress = (address: HexString) => {
	var s;
	try {
		s = address.toString();
	} catch (e) {
		console.debug('error at line 8 in utils.ts');
	}
	return `${s!.substring(0, 6) + ' ... ' + s!.substring(s!.length - 4, s!.length)}`;
}

export async function getTxByHash(txHash: string, customNodeUrl?: string) {
	const response = await fetch(`${customNodeUrl ?? process.env.NEXT_PUBLIC_NODE_URL}/transactions/by_hash/${txHash}`, {
		method: 'GET',
		headers: {
			'Content-Type': 'application/json',
		}
	});

	return (await response.json());
}

export async function sleep(ms: number): Promise<null> {
	return new Promise((resolve) => {
		setTimeout(resolve, ms);
	});
}

export async function getBalance(address: string | HexString, aptosClient: AptosClient): Promise<number> {
	const addressString = typeof address === 'string' ? address : address.toString();
	const len = addressString.length;
	if (len > 60) {
		try {
			const resource: any = await aptosClient.getAccountResource(address,
				"0x1::coin::CoinStore<0x1::aptos_coin::AptosCoin>");
			return Promise.resolve(Number(resource.data['coin']['value']) / (process.env.NEXT_PUBLIC_APTOS_COIN_FACTOR ? parseInt(process.env.NEXT_PUBLIC_APTOS_COIN_FACTOR) : 100000000));
		} catch (e) {
			console.error(e);
			console.debug('Most likely you haven\'t initialized a CoinStore struct in your account. Airdrop coins or receive some from someone.');
			return -1;
		}
	}
	else {
		return -2;
	}
}

const MS_IN_AN_HOUR = 60 * 60 * 1000;

export type Countdown = {
	hours: number,
	minutes: number,
	seconds: number,
}

export function getCountdown(ms: number, countup?: boolean): Countdown {
	const timeDifference = countup ? Date.now() - ms : ms - Date.now();
	if (timeDifference < 1) return ({ hours: 0, minutes: 0, seconds: 0 });

	const hours = Math.floor((timeDifference) / MS_IN_AN_HOUR);
	const totalSecondsLeft = (timeDifference % MS_IN_AN_HOUR) / 1000;
	const minutes = Math.floor(totalSecondsLeft / 60);
	const seconds = Math.floor((timeDifference - (hours * MS_IN_AN_HOUR + minutes * 60 * 1000)) / 1000);

	return ({ hours, minutes, seconds });

	//return (hoursLeft + minutesLeft + secondsLeft) > 0 ? `${String(hoursLeft).padStart(2, '0')}:${String(minutesLeft).padStart(2, '0')}:${String(secondsLeft).padStart(2, '0')}` : '00:00:00';
}

export async function awaitTransaction(txHash: MaybeHexString, tries?: number, customNodeUrl?: string): Promise<any> {
	let count = 0;
	while (true) {
		const response = await getTxByHash(txHash.toString(), customNodeUrl);
		if (response.type === "pending_transaction" || response.error_code === 'transaction_not_found') {
			count += 1;
			if (count >= (tries ?? 10)) {
				console.debug('unable to confirm tx');
				return response;
			}
			await sleep(1000);
			continue;
		} else {
			console.debug(txHash.toString());
			//console.debug(response);
			//console.debug(response.type);
			return response;
		}
	}
}