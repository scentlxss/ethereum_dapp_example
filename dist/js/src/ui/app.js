"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.App = void 0;
/* eslint-disable @typescript-eslint/camelcase */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-use-before-define */
const react_1 = __importStar(require("react"));
const web3_1 = __importDefault(require("web3"));
const react_toastify_1 = require("react-toastify");
require("./app.scss");
require("react-toastify/dist/ReactToastify.css");
const TrustWrapper_1 = require("../lib/contracts/TrustWrapper");
async function createWeb3() {
    // Modern dapp browsers...
    if (window.ethereum) {
        const web3 = new web3_1.default(window.ethereum);
        try {
            // Request account access if needed
            await window.ethereum.enable();
        }
        catch (error) {
            // User denied account access...
        }
        return web3;
    }
    console.log('Non-Ethereum browser detected. You should consider trying MetaMask!');
    return null;
}
function App() {
    const [web3, setWeb3] = react_1.useState(null);
    const [contract, setContract] = react_1.useState();
    const [accounts, setAccounts] = react_1.useState();
    const [balance, setBalance] = react_1.useState();
    const [existingContractIdInputValue, setExistingContractIdInputValue] = react_1.useState();
    const [withdrawTx, setWithdrawTx] = react_1.useState();
    const [addKidTx, setAddKidTx] = react_1.useState();
    const [withdrawnFunds, setWithdrawnFunds] = react_1.useState();
    const [kid, setKid] = react_1.useState();
    const [timeInFuture, setTimeInFuture] = react_1.useState();
    const [donationAmount, setDonationAmount] = react_1.useState();
    const [transactionInProgress, setTransactionInProgress] = react_1.useState(false);
    const toastId = react_1.default.useRef(null);
    react_1.useEffect(() => {
        if (transactionInProgress && !toastId.current) {
            toastId.current = react_toastify_1.toast.info('Transaction in progress. Confirm MetaMask signing dialog and please wait...', {
                position: 'top-right',
                autoClose: false,
                hideProgressBar: false,
                closeOnClick: false,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                closeButton: false
            });
        }
        else if (!transactionInProgress && toastId.current) {
            react_toastify_1.toast.dismiss(toastId.current);
            toastId.current = null;
        }
    }, [transactionInProgress, toastId.current]);
    const account = accounts?.[0];
    async function deployContract() {
        const _contract = new TrustWrapper_1.TrustWrapper(web3);
        console.log(_contract);
        try {
            setTransactionInProgress(true);
            await _contract.deploy(account);
            setExistingContractAddress(_contract.address);
            react_toastify_1.toast('Successfully deployed a smart-contract. You can now proceed to get or set the value in a smart contract.', { type: 'success' });
        }
        catch (error) {
            console.error(error);
            react_toastify_1.toast.error('There was an error sending your transaction. Please check developer console.');
        }
        finally {
            setTransactionInProgress(false);
        }
    }
    async function withdrawFunds() {
        const funds = await contract.withdrawFunds(account);
        setWithdrawnFunds(funds);
        react_toastify_1.toast('Successfully withdrawn funds', { type: 'success' });
    }
    async function setExistingContractAddress(contractAddress) {
        const _contract = new TrustWrapper_1.TrustWrapper(web3);
        _contract.useDeployed(contractAddress.trim());
        setContract(_contract);
    }
    async function addTheKid() {
        try {
            setTransactionInProgress(true);
            const tx = await contract.addTheKid(parseInt(web3_1.default.utils.toWei(donationAmount.toString(), 'ether'), 10), kid, timeInFuture, account);
            setAddKidTx(tx);
            console.log(tx);
            react_toastify_1.toast('Successfully added the kid.', { type: 'success' });
        }
        catch (error) {
            console.error(error);
            react_toastify_1.toast.error('There was an error sending your transaction. Please check developer console.');
        }
        finally {
            setTransactionInProgress(false);
        }
    }
    react_1.useEffect(() => {
        if (web3) {
            return;
        }
        (async () => {
            const _web3 = await createWeb3();
            setWeb3(_web3);
            const _accounts = [window.ethereum.selectedAddress];
            setAccounts(_accounts);
            console.log({ _accounts });
            if (_accounts && _accounts[0]) {
                const _l2balance = BigInt(await _web3.eth.getBalance(_accounts[0]));
                setBalance(_l2balance);
            }
        })();
    });
    const LoadingIndicator = () => react_1.default.createElement("span", { className: "rotating-icon" }, "\u2699\uFE0F");
    return (react_1.default.createElement("div", null,
        "Your ETH address: ",
        react_1.default.createElement("b", null, accounts?.[0]),
        react_1.default.createElement("br", null),
        react_1.default.createElement("br", null),
        "Balance: ",
        react_1.default.createElement("b", null,
            balance ? (balance / 10n ** 8n).toString() : react_1.default.createElement(LoadingIndicator, null),
            " ETH"),
        react_1.default.createElement("br", null),
        react_1.default.createElement("br", null),
        "Deployed contract address: ",
        react_1.default.createElement("b", null, contract?.address || '-'),
        " ",
        react_1.default.createElement("br", null),
        react_1.default.createElement("br", null),
        react_1.default.createElement("hr", null),
        react_1.default.createElement("p", null, "Donate some funds in the future to some address of your choice."),
        react_1.default.createElement("button", { onClick: deployContract, disabled: !balance }, "Deploy contract"),
        "\u00A0or\u00A0",
        react_1.default.createElement("input", { placeholder: "Existing contract id", onChange: e => setExistingContractIdInputValue(e.target.value) }),
        react_1.default.createElement("button", { disabled: !existingContractIdInputValue || !balance, onClick: () => setExistingContractAddress(existingContractIdInputValue) }, "Use existing contract"),
        react_1.default.createElement("br", null),
        react_1.default.createElement("br", null),
        react_1.default.createElement("button", { onClick: withdrawFunds, disabled: !contract }, "withdraw funds"),
        withdrawnFunds ? react_1.default.createElement(react_1.default.Fragment, null,
            "\u00A0\u00A0Success : ",
            withdrawnFunds.toString(),
            " ether") : null,
        react_1.default.createElement("br", null),
        react_1.default.createElement("br", null),
        react_1.default.createElement("input", { type: "number", placeholder: "time in future in seconds", onChange: e => setTimeInFuture(parseInt(e.target.value, 10)) }),
        react_1.default.createElement("input", { type: "string", placeholder: "kid address", onChange: e => setKid(e.target.value) }),
        react_1.default.createElement("input", { type: "number", placeholder: "donation amount", onChange: e => setDonationAmount(parseInt(e.target.value, 10)) }),
        react_1.default.createElement("button", { onClick: addTheKid, disabled: !contract }, "Add the kid."),
        react_1.default.createElement("br", null),
        react_1.default.createElement("br", null),
        react_1.default.createElement("br", null),
        react_1.default.createElement("br", null),
        react_1.default.createElement("hr", null),
        react_1.default.createElement(react_toastify_1.ToastContainer, null)));
}
exports.App = App;
//# sourceMappingURL=app.js.map