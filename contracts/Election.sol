// SPDX-License-Identifier: UNLICENSED
pragma solidity 0.8.0;

contract Election {
    // Modelling a candidate
    struct Candidate {
        uint id;
        string name;
        uint voteCount;
    }

    // Mapping for accounts that have voted (using address instead of uint)
    mapping (address => bool) public voters;

    // Mapping for candidates
    mapping(uint => Candidate) public candidates;

    // Store count of candidates
    uint public candidateCount;

    // Constructor (no need for visibility modifier)
    constructor() {
        addCandidate("Candidate 1");
        addCandidate("Candidate 2");
    }

    // Add new candidate (private function)
    function addCandidate(string memory _name) private {
        candidateCount++;
        candidates[candidateCount] = Candidate(candidateCount, _name, 0);
    }

    // Event triggered when a vote is cast
    event votedEvent (
        uint indexed _candidateId
    );

    // Vote casting function
    function vote(uint _candidateId) public {
        // Check if the voter hasn't already voted
        require(!voters[msg.sender], "You have already voted.");

        // Check whether the candidateId is valid
        require(_candidateId > 0 && _candidateId <= candidateCount, "Invalid candidate ID.");

        // Mark the voter as having voted
        voters[msg.sender] = true;

        // Update the candidate's vote count
        candidates[_candidateId].voteCount++;

        // Trigger the voted event
        emit votedEvent(_candidateId);
    }
}
