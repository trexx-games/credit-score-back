// SPDX-License-Identifier: UNLICENSED 
pragma solidity ^0.8.27;

contract CreditScore {
    event ScoreUpdated(string indexed userSlug, address[] walletAddresses, uint256 score, uint256 timestamp);

    struct ScoreRecord {
        address[] walletAddresses;
        uint256 score;
        uint256 timestamp;
    }

    mapping(string => ScoreRecord[]) public scoreHistory; 
    mapping(string => ScoreRecord) public activeScore; 

    function registerScore(string memory _userSlug, address[] memory _walletAddresses, uint256 _score, uint256 _timestamp) public {
        require(_walletAddresses.length > 0, "No wallets provided");
        scoreHistory[_userSlug].push(ScoreRecord(_walletAddresses, _score, _timestamp));
        activeScore[_userSlug] = ScoreRecord(_walletAddresses, _score, _timestamp);
        emit ScoreUpdated(_userSlug, _walletAddresses, _score, _timestamp);
    }

    function getScoreHistory(string memory _userSlug) public view returns (ScoreRecord[] memory) {
        return scoreHistory[_userSlug];
    }

    function getActiveScore(string memory _userSlug) public view returns (ScoreRecord memory) {
        return activeScore[_userSlug];
    }
}