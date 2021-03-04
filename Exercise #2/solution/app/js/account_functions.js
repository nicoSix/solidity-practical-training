async function displayCurrentAccount() {
  var currentAccount = (await getCurrentAccount())[0];
  if(currentAccount) {
    $('#account-address').text(currentAccount);
        web3.eth.getBalance(currentAccount, (err, balance) => {
        $('#account-balance').text(web3.utils.fromWei(balance, "ether"));
    });
  }
}