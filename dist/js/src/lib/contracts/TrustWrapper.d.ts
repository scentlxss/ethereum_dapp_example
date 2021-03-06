import Web3 from 'web3';
import { Trust } from '../../types/Trust';
export declare class TrustWrapper {
    web3: Web3;
    contract: Trust;
    address: string;
    constructor(web3: Web3);
    get isDeployed(): boolean;
    withdrawFunds(fromAddress: string): Promise<number>;
    addTheKid(value: number, kid: string, timeInFuture: number, fromAddress: string): Promise<string>;
    deploy(fromAddress: string): Promise<void>;
    useDeployed(contractAddress: string): void;
}
