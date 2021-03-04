async function handleAcceptLoan(loanId) {
  var success = await acceptLoan(loanId);
    if(success) {
      alert('Success!');
      displayLoanRequests();
      displayContractBalance();
    }
    else {
      alert('Error: loan request failed.')
    }
}

async function handleDenyLoan(loanId) {
  var success = await denyLoan(loanId);
    if(success) {
      alert('Success!');
      displayLoanRequests();
      displayContractBalance();
    }
    else {
      alert('Error: loan request failed.')
    }
}

async function displayLoanRequests() {
  const requests = await getLoanRequests();
  var requestContent = '';

  if(requests.length > 0) {
    requests.forEach(request => {
      requestContent += '<div class="col-md-6">' + 
        '<div class="card load-item">' + 
          '<div class="card-body">' + 
            '<h5 class="card-title">Loan #' + request.id + '</h5>' + 
            '<h6>Status: ' + getLoanStatus(request.status) + '</h6>' + 
            '<p>Informations:</p>' + 
            '<ul>' + 
              '<li>Loan rate: ' + request.rate + '%</li>' + 
              '<li>Loan amount: ' + web3.utils.fromWei(request.amount, "ether") + ' ETH</li>' + 
              '<li>Left to be paid: ' + web3.utils.fromWei(request.leftToBePaid, "ether")+ ' ETH</li>' + 
            '</ul>' +
            '<button class="btn btn-success" onClick="handleAcceptLoan(' + request.id + ')" >Grant loan</button>&nbsp;' +
            '<button class="btn btn-danger" onClick="handleDenyLoan(' + request.id + ')">Deny loan</button>' +
          '</div>' + 
        '</div>' + 
      '</div>';
    });
  }
  else {
    requestContent = '<div class="col-md-6"><h3>No request yet.</h3></div>';
  }

  $('#requests').html(requestContent);
}

async function displayContractBalance() {
  const balance = await getContractBalance();
  if(balance) $('#contract-balance').text(web3.utils.fromWei(balance, "ether"));
  else $('#contract-balance').text('Unknown');
}

async function handleFundLoan(amount) {
  if (isNaN(amount) || amount <= 0) {
    alert('Cannot fund a negative or null amount.');
  }
  else {
    var success = await fundContract(amount);
    if(success) {
      alert('Success!');
      displayContractBalance();
    }
    else {
      alert('Error: loan request failed.')
    }
  }
}


async function handleRetrieveLoan(amount) {
  if (isNaN(amount) || amount <= 0) {
    alert('Cannot request a negative or null amount.');
  }
  else {
    var success = await getContractFunds(amount);
    if(success) {
      alert('Success!');
      displayContractBalance();
    }
    else {
      alert('Error: loan request failed.')
    }
  }
}