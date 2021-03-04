function getCurrentAccount() {
  // TODO
}

async function getLenderContractObj() {
  // retrieve the ABI generated from contract's deployment
  let lenderABI = await $.getJSON( '../build/contracts/Lender.json')
  .fail(function() {
    console.error('Cannot retrieve Lender ABI: ' + error);
    $('#content').load('html/no_contract.html');
  })

  // the next two lines help retrieving the contract address
  let networkId = await window.web3.eth.net.getId();
  let contractAddress = lenderABI.networks[networkId].address;
  // a Contract object is generated from the ABI and the address
  // it acts as a contract proxy: you can use it to interact with on-chain contract functions
  // just call the function in every other Web3 functions to use it 
  LenderContract = new window.web3.eth.Contract(lenderABI.abi, contractAddress);
  return LenderContract;
}

async function getUserLoans() {
  // TODO
}

async function getCurrentRate() {
  // TODO
}

async function getContractBalance() {
  // TODO
}

async function requestLoan(amount) {
  // TODO
}

async function repayLoan(amount, idLoan) {
  // TODO
}

async function checkIfCurrentAccountIsOwner() {
  // TODO
}

async function getLoanRequests() {
  // TODO
}

async function acceptLoan(loanId) {
  // TODO
}

async function denyLoan(loanId) {
  // TODO
}

async function fundContract(amount) {
  // TODO
}

async function getContractFunds(amount) {
  // TODO
}