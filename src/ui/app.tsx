/* eslint-disable @typescript-eslint/camelcase */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-use-before-define */
import React, { useEffect, useState } from 'react';
import Web3 from 'web3';
import { ToastContainer, toast } from 'react-toastify';
import './app.scss';
import 'react-toastify/dist/ReactToastify.css';


import { TrustWrapper } from '../lib/contracts/TrustWrapper';

async function createWeb3() {
    // Modern dapp browsers...
    if ((window as any).ethereum) {
        const web3 = new Web3((window as any).ethereum);

	try {
            // Request account access if needed
            await (window as any).ethereum.enable();
        } catch (error) {
            // User denied account access...
        }

        return web3;
    }

    console.log('Non-Ethereum browser detected. You should consider trying MetaMask!');
    return null;
}

export function App() {
    const [web3, setWeb3] = useState<Web3>(null);
    const [contract, setContract] = useState<TrustWrapper>();
    const [accounts, setAccounts] = useState<string[]>();
    const [balance, setBalance] = useState<bigint>();
    const [existingContractIdInputValue, setExistingContractIdInputValue] = useState<string>();
    const [withdrawTx, setWithdrawTx] = useState<string | undefined>();
    const [addKidTx, setAddKidTx] = useState<string | undefined>();
    const [withdrawnFunds, setWithdrawnFunds] = useState<number | undefined>();
    const [kid, setKid] = useState<string | undefined>();
    const [timeInFuture, setTimeInFuture] = useState<number | undefined>();
    const [donationAmount, setDonationAmount] = useState<number | undefined>();
    const [transactionInProgress, setTransactionInProgress] = useState(false);
    const toastId = React.useRef(null);



    useEffect(() => {
        if (transactionInProgress && !toastId.current) {
            toastId.current = toast.info(
                'Transaction in progress. Confirm MetaMask signing dialog and please wait...',
                {
                    position: 'top-right',
                    autoClose: false,
                    hideProgressBar: false,
                    closeOnClick: false,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                    closeButton: false
                }
            );
        } else if (!transactionInProgress && toastId.current) {
            toast.dismiss(toastId.current);
            toastId.current = null;
        }
    }, [transactionInProgress, toastId.current]);

    const account = accounts?.[0];

    async function deployContract() {
        const _contract = new TrustWrapper(web3);
	console.log(_contract);
        try {
            setTransactionInProgress(true);

            await _contract.deploy(account);

            setExistingContractAddress(_contract.address);
            toast(
                'Successfully deployed a smart-contract. You can now proceed to get or set the value in a smart contract.',
                { type: 'success' }
            );
        } catch (error) {
            console.error(error);
            toast.error(
                'There was an error sending your transaction. Please check developer console.'
            );
        } finally {
            setTransactionInProgress(false);
        }
    }

    async function withdrawFunds() {
        const funds= await contract.withdrawFunds(account);
	setWithdrawnFunds(funds);
        toast('Successfully withdrawn funds', { type: 'success' });
    }

    async function setExistingContractAddress(contractAddress: string) {
        const _contract = new TrustWrapper(web3);
        _contract.useDeployed(contractAddress.trim());

        setContract(_contract);
    }

    async function addTheKid() {
        try {
            setTransactionInProgress(true);
            const tx = await contract.addTheKid(parseInt(Web3.utils.toWei(donationAmount.toString(),'ether'),10) , kid, timeInFuture, account);
	    setAddKidTx(tx);
	    console.log(tx);
            toast(
                'Successfully added the kid.',
                { type: 'success' }
            );
        } catch (error) {
            console.error(error);
            toast.error(
                'There was an error sending your transaction. Please check developer console.'
            );
        } finally {
            setTransactionInProgress(false);
        }
    }

    useEffect(() => {
        if (web3) {
            return;
        }

        (async () => {
            const _web3 = await createWeb3();
            setWeb3(_web3);

            const _accounts = [(window as any).ethereum.selectedAddress];
            setAccounts(_accounts);
            console.log({ _accounts });

            if (_accounts && _accounts[0]) {
                const _l2balance = BigInt(await _web3.eth.getBalance(_accounts[0]));
                setBalance(_l2balance);
            }
        })();
    });

    const LoadingIndicator = () => <span className="rotating-icon">⚙️</span>;

    return (
        <div>
            Your ETH address: <b>{accounts?.[0]}</b>
            <br />
            <br />
            Balance: <b>{balance ? (balance / 10n ** 8n).toString() : <LoadingIndicator />} ETH</b>
            <br />
            <br />
            Deployed contract address: <b>{contract?.address || '-'}</b> <br />
            <br />
            <hr />
            <p>
               	Donate some funds in the future to some address of your choice.
            </p>
            <button onClick={deployContract} disabled={!balance}>
                Deploy contract
            </button>
            &nbsp;or&nbsp;
            <input
                placeholder="Existing contract id"
                onChange={e => setExistingContractIdInputValue(e.target.value)}
            />
            <button
                disabled={!existingContractIdInputValue || !balance}
                onClick={() => setExistingContractAddress(existingContractIdInputValue)}
            >
                Use existing contract
            </button>
            <br />
            <br />
            <button onClick={withdrawFunds} disabled={!contract}>
                withdraw funds
            </button>
            {withdrawnFunds ? <>&nbsp;&nbsp;Success : {withdrawnFunds.toString()} ether</> : null}
            <br />
            <br />
            <input
                type="number"
                placeholder="time in future in seconds"
                onChange={e => setTimeInFuture(parseInt(e.target.value,10))}
            />
            <input
                type="string"
                placeholder="kid address"
                onChange={e => setKid(e.target.value)}
            />
            <input
                type="number"
                placeholder="donation amount"
                onChange={e => setDonationAmount(parseInt(e.target.value,10))}
            />
            <button onClick={addTheKid} disabled={!contract}>
                Add the kid.
            </button>
            <br />
            <br />
            <br />
            <br />
            <hr />
            <ToastContainer />
        </div>
    );
}
