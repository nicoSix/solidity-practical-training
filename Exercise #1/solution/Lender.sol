// SPDX-License-Identifier: GPL-3.0

pragma solidity >=0.7.0 <0.8.0;
pragma experimental ABIEncoderV2;

/**
 * @title Lender
 * @dev Allows people to borrow money from a lender.
 */

contract Lender {
    enum LoanStates {
        Requested,
        Granted,
        Denied,
        PaidBack
    }
    
    struct Loan {
        uint id;
        address payable borrower;
        uint amount;
        uint leftToBePaid;
        uint rate;
        bool exists;
        LoanStates status;
    }
    
    mapping (uint => Loan) idToLoan;
    mapping (address => uint[]) clientToLoansId;
    uint[] requestIds;
    uint currentRate;
    uint uniqueIdCounter = 0;
    address manager;

    constructor(uint _currentRate) payable {
        manager = msg.sender;
        currentRate = _currentRate;
    }
    
    /**
     * @dev Solidity does not supports natively the removal of a specific index. This methods safely do that in only two instructions.
    */
    function safeDeleteRequestIds(uint idIndex) private {
        requestIds[idIndex] = requestIds[requestIds.length - 1];
        requestIds.pop();
    }
    
    /**
     * @dev Can be called to fund the contract by providing value in the transaction
    */
    function fundContract() public payable isOwner {}
    
    /**
     * @dev Can be called to retrieve funds from the contract to the owner
    */
    function getContractFunds(uint amount) public payable isOwner {
        if(amount > address(this).balance) amount = address(this).balance;
        address payable owner = msg.sender;
        owner.transfer(amount);
    }
    
    /**
     * @dev Used to generate a unique id for each new Lend
    */
    function generateUniqueId() private returns(uint) {
        uniqueIdCounter++;
        return uniqueIdCounter;
    }
    
    /**
     * @dev Allow someone to request a loan
    */
    function requestLoan(uint _amount) public {
        uint newId = generateUniqueId();
        uint leftToBePaid = (_amount*(100+currentRate))/100;
        
        Loan memory newLoanRequest = Loan(
            newId,
            msg.sender,
            _amount,
            leftToBePaid,
            currentRate,
            true,
            LoanStates.Requested
        );
        
        requestIds.push(newId);
        clientToLoansId[msg.sender].push(newId);
        idToLoan[newId] = newLoanRequest;
    }
    
    /**
     * @dev Allow the contract owner to accept a loan, transfers funds to the borrower if so
    */
    function acceptLoan(uint _loanId) public isOwner {
        uint index = findRequestIdOrRevert(_loanId);
        require(address(this).balance > idToLoan[_loanId].amount, "Not enough funds in contract.");
        idToLoan[_loanId].status = LoanStates.Granted;
        idToLoan[_loanId].borrower.transfer(idToLoan[_loanId].amount);
        safeDeleteRequestIds(index);
    }
    
    /**
     * @dev Allow the contract owner to deny a loan
    */
    function denyLoan(uint _loanId) public isOwner {
        uint index = findRequestIdOrRevert(_loanId);
        idToLoan[_loanId].status = LoanStates.Denied;
        safeDeleteRequestIds(index);
        return;
    }
    
    /**
     * @dev This function can find a specific request id in the requestIds array. Used to find if a request exists and if so, its position.
    */
    function findRequestIdOrRevert(uint _loanId) private view returns(uint) {
        for (uint i=0; i<requestIds.length; i++) {
            if(requestIds[i] == _loanId) {
                return i;
            }
        }
        revert("loanId not found.");
    }
    
    /**
     * @dev Can be called by a borrower to repay its lend. Borrower must provide funds when calling this function.
    */
    function repayLoan(uint _loanId) public payable isActiveLoan(_loanId) {
        if(idToLoan[_loanId].leftToBePaid < msg.value) {
            uint toRefund = msg.value - idToLoan[_loanId].leftToBePaid;
            idToLoan[_loanId].leftToBePaid = 0;
            idToLoan[_loanId].status = LoanStates.PaidBack;
            msg.sender.transfer(toRefund);
        }
        else {
            idToLoan[_loanId].leftToBePaid = idToLoan[_loanId].leftToBePaid - msg.value;
            if(idToLoan[_loanId].leftToBePaid == 0) {
                idToLoan[_loanId].status = LoanStates.PaidBack;
            }
        }
        return;
    }
        
    // MODIFIERS
    modifier isOwner() {
        require(msg.sender == manager, "msg.sender is not the owner.");
        _;
    }
    
    modifier isActiveLoan(uint _loanId) {
        require(idToLoan[_loanId].exists, "Loan does not exists.");
        require(idToLoan[_loanId].leftToBePaid > 0, "Loan has already been repaid.");
        _;
    }
    
    // GETTERS
    function getContractBalance() public view returns(uint) {
        return address(this).balance;
    }
    
    function getManager() public view returns(address) {
        return manager;
    }
    
    function getCurrentRate() public view returns(uint) {
        return currentRate;
    }
    
    function getRequestsIds() public view returns(uint[] memory) {
        return requestIds;
    }
    
    function getLoan(uint _loanId) public view returns(Loan memory) {
        require(idToLoan[_loanId].exists, "Loan does not exists.");
        return idToLoan[_loanId];
    }

    function getUserLoans() public view returns(Loan[] memory) {
        uint[] memory userLoanIds = clientToLoansId[msg.sender];
        Loan[] memory userLoans = new Loan[](userLoanIds.length);
        
        for(uint i = 0; i < userLoanIds.length; i++) {
            userLoans[i] = idToLoan[userLoanIds[i]];
        }
        return userLoans;
    }
    
    // SETTERS
    function setCurrentRate(uint _newRate) public isOwner {
        currentRate = _newRate;
    }
}