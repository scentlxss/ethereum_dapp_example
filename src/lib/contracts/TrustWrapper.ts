import Web3 from 'web3';
import * as TrustJSON from '../../../build/contracts/Trust.json';
import { Trust } from '../../types/Trust';

const DEFAULT_SEND_OPTIONS = {
    gasPrice: 400000000000,
    gas: 600000
};

export class TrustWrapper {
    web3: Web3;

    contract: Trust;

    address: string;

    constructor(web3: Web3) {
        this.web3 = web3;
        this.contract = new web3.eth.Contract(TrustJSON.abi as any) as any;
    }

    get isDeployed() {
        return Boolean(this.address);
    }

    async withdrawFunds(fromAddress: string) {
        const data = await this.contract.methods.withdraw().send({ from: fromAddress });
	return parseInt(Web3.utils.fromWei(data,'ether'), 10);
    }

    async addTheKid(value: number, kid: string, timeInFuture: number, fromAddress: string) {
        const tx = await this.contract.methods.addKid(kid,timeInFuture).send({
            ...DEFAULT_SEND_OPTIONS,
            from: fromAddress,
            value
        });

        return tx.transactionHash;
    }

    async deploy(fromAddress: string) {
        const contract = await (this.contract
            .deploy({
                data: TrustJSON.bytecode,
                arguments: []
            })
            .send({
                from: fromAddress
            } as any) as any);

        this.useDeployed(contract._address);
    }


    useDeployed(contractAddress: string) {
        this.address = contractAddress;
        this.contract.options.address = contractAddress;
    }
}
