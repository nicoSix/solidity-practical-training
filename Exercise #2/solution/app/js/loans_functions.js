function getLoanStatus(status) {
  switch(parseInt(status, 10)) {
    case 0:
      return '<span style="color: white;" class="badge bg-info rounded-pill">Requested</span>';

    case 1:
      return '<span style="color: white;" class="badge bg-primary rounded-pill">Granted</span>';

    case 2:
      return '<span style="color: white;" class="badge bg-danger rounded-pill">Denied</span>';

    case 3:
      return '<span style="color: white;" class="badge bg-success rounded-pill">Paid back</span>';

    default:
      return '<span style="color: white;" class="badge bg-dark rounded-pill">Unknown</span>';
  }
}

async function displayUserLoans() {
  const loans = await getUserLoans();
  var loansContent = '';

  if(loans.length > 0) {
    loans.forEach(loan => {
      loansContent += '<div class="col-md-6">' + 
        '<div class="card load-item">' + 
          '<div class="card-body">' + 
            '<h5 class="card-title">Loan #' + loan.id + '</h5>' + 
            '<h6>Status: ' + getLoanStatus(loan.status) + '</h6>' + 
            '<p>Informations:</p>' + 
            '<ul>' + 
              '<li>Loan rate: ' + loan.rate + '%</li>' + 
              '<li>Loan amount: ' + web3.utils.fromWei(loan.amount, "ether") + ' ETH</li>' + 
              '<li>Left to be paid: ' + web3.utils.fromWei(loan.leftToBePaid, "ether")+ ' ETH</li>' + 
            '</ul>';
  
      if(parseInt(loan.status, 10) == 1) {
        loansContent += '<p>Repay loan:</p>' + 
          '<div class="input-group mb-3">' +
            '<input type="text" id="repay-loan-input-' + loan.id + '" class="form-control" placeholder="Type an amount in ETH ..." aria-label="Amount in ETH">' +
            '<button class="btn btn-outline-primary" type="button" onClick="handleRepayLoan(' + loan.id + ')">Repay</button>' +
          '</div>';
      }
  
      loansContent += '</div>' + 
          '</div>' + 
        '</div>';
    });
  }
  else {
    loansContent = '<div class="col-md-6"><h3>No loan yet.</h3></div>';
  }

  $('#loans').html(loansContent);
}

async function handleRequestLoan(amount) {
  if (isNaN(amount) || amount <= 0) {
    alert('Cannot request a negative or null amount.');
  }
  else {
    var success = await requestLoan(amount);
    if(success) {
      alert('Success!');
      displayUserLoans();
    }
    else {
      alert('Error: loan request failed.')
    }
  }
}

async function handleRepayLoan(idLoan) {
  var amount = $('#repay-loan-input-' + idLoan).val();

  if (isNaN(amount) || amount <= 0) {
    alert('Cannot request a negative or null amount.');
  }
  else {
    var success = await repayLoan(amount, idLoan);
    if(success) {
      alert('Success!');
      displayUserLoans();
    }
    else {
      alert('Error: loan request failed.')
    }
  }
}