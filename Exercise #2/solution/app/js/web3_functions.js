function getCurrentAccount() {
  return window.web3.eth.getAccounts((error, accounts) => {
    if (error) {
        return false;
    } else {
      return accounts;
    }
  });
}

async function getLenderContractObj() {
  let lenderABI = await $.getJSON( '../build/contracts/Lender.json')
  .fail(function() {
    console.error('Cannot retrieve Lender ABI: ' + error);
    $('#content').load('html/no_contract.html');
  })

  let networkId = await window.web3.eth.net.getId();
  let contractAddress = lenderABI.networks[networkId].address;
  LenderContract = new window.web3.eth.Contract(lenderABI.abi, contractAddress);
  return LenderContract;
}

async function getUserLoans() {
  const LenderContract = await getLenderContractObj();
  const currentAccount = (await getCurrentAccount())[0];

  return await LenderContract.methods.getUserLoans().call({ from: currentAccount });
}

async function getCurrentRate() {
  const LenderContract = await getLenderContractObj();
  return await LenderContract.methods.getCurrentRate().call();
}

async function getContractBalance() {
  const LenderContract = await getLenderContractObj();
  return await LenderContract.methods.getContractBalance().call();
}

async function requestLoan(amount) {
  const LenderContract = await getLenderContractObj();
  const currentAccount = (await getCurrentAccount())[0];

  try {
    const result = await LenderContract.methods.requestLoan(web3.utils.toWei(amount.toString(), "ether")).send({from: currentAccount});
    if(result['transactionHash']) return true;
    else return false;
  }
  catch (e) {
    console.error('Error while processing the transaction: ' + e);
    return false;
  }
}

async function repayLoan(amount, idLoan) {
  const LenderContract = await getLenderContractObj();
  const currentAccount = (await getCurrentAccount())[0];

  try {
    const result = await LenderContract.methods.repayLoan(idLoan).send({from: currentAccount, value: web3.utils.toWei(amount.toString(), "ether")});
    if(result['transactionHash']) return true;
    else return false;
  }
  catch (e) {
    console.error('Error while processing the transaction: ' + e);
    return false;
  }
}

async function checkIfCurrentAccountIsOwner() {
  const LenderContract = await getLenderContractObj();
  const currentAccount = (await getCurrentAccount())[0];
  
  try {
    const manager = await LenderContract.methods.getManager().call();
    return (manager == currentAccount);
  }
  catch (e) {
    console.error('Error while processing the transaction: ' + e);
    return false;
  }
}

async function getLoanRequests() {
  const LenderContract = await getLenderContractObj();
  const loans = [];

  try {
    const requestIds = await LenderContract.methods.getRequestsIds().call();
    if(requestIds) {
      
      for (var i = 0; i < requestIds.length; i++) {
        var loan = await LenderContract.methods.getLoan(requestIds[i]).call();
        if (loan) loans.push(loan);
      }

      return (loans);
    }
  }
  catch (e) {
    console.error('Error while processing the transaction: ' + e);
    return false;
  }
}

async function acceptLoan(loanId) {
  const LenderContract = await getLenderContractObj();
  const currentAccount = (await getCurrentAccount())[0];

  try {
    const result = await LenderContract.methods.acceptLoan(loanId).send({from: currentAccount});
    if(result['transactionHash']) return true;
    else return false;
  }
  catch (e) {
    console.error('Error while processing the transaction: ' + e);
    return false;
  }
}

async function denyLoan(loanId) {
  const LenderContract = await getLenderContractObj();
  const currentAccount = (await getCurrentAccount())[0];

  try {
    const result = await LenderContract.methods.denyLoan(loanId).send({from: currentAccount});
    if(result['transactionHash']) return true;
    else return false;
  }
  catch (e) {
    console.error('Error while processing the transaction: ' + e);
    return false;
  }
}

async function fundContract(amount) {
  const LenderContract = await getLenderContractObj();
  const currentAccount = (await getCurrentAccount())[0];

  try {
    const result = await LenderContract.methods.fundContract().send({from: currentAccount, value: web3.utils.toWei(amount.toString(), "ether")});
    if(result['transactionHash']) return true;
    else {
      return false;
    }
  }
  catch (e) {
    console.error('Error while processing the transaction: ' + JSON.stringify(e));
    return false;
  }
}

async function getContractFunds(amount) {
  const LenderContract = await getLenderContractObj();
  const currentAccount = (await getCurrentAccount())[0];

  try {
    const result = await LenderContract.methods.getContractFunds(web3.utils.toWei(amount.toString(), "ether")).send({from: currentAccount });
    if(result['transactionHash']) return true;
    else {
      return false;
    }
  }
  catch (e) {
    console.error('Error while processing the transaction: ' + JSON.stringify(e));
    return false;
  }
}