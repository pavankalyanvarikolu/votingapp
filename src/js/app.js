App = {
  web3Provider: null,
  contracts: {},
  account: '0x0',

  init: function() {
    return App.initWeb3();
  },

  // Initialize Web3 and connect to the blockchain
  initWeb3: function() {
    if (typeof web3 !== 'undefined') {
      App.web3Provider = web3.currentProvider;
      web3 = new Web3(web3.currentProvider);
    } else {
      App.web3Provider = new Web3.providers.HttpProvider('http://localhost:7545');
      web3 = new Web3(App.web3Provider);
    }
    return App.initContract();
  },

  // Initialize the contract by loading the Election artifact
  initContract: function() {
    $.getJSON("Election.json", function(election) {
      App.contracts.Election = TruffleContract(election);
      App.contracts.Election.setProvider(App.web3Provider);
      App.listenForEvents();
      return App.render();
    }).fail(function(jqxhr, textStatus, error) {
      console.error("Failed to load contract JSON: ", error);
      alert("Failed to load contract. Please try again.");
    });
  },

  // Listen for contract events
  listenForEvents: function() {
    App.contracts.Election.deployed().then(function(instance) {
      instance.votedEvent({}, { fromBlock: 0, toBlock: 'latest' }).watch(function(error, event) {
        if (!error) {
          console.log("Event triggered: ", event);
          App.render();
        } else {
          console.error("Error watching event: ", error);
        }
      });
    });
  },

  // Render the page with the latest blockchain data
  render: function() {
    let electionInstance;
    const loader = $("#loader");
    const content = $("#content");

    loader.show();
    content.hide();

    // Load account data
    web3.eth.getCoinbase(function(err, account) {
      if (err === null) {
        App.account = account;
        $("#accountAddress").html("Your Account: " + account);
      } else {
        console.error("Error retrieving account: ", err);
      }
    });

    // Load contract data
    App.contracts.Election.deployed().then(function(instance) {
      electionInstance = instance;
      console.log("Election contract deployed successfully.");
      return electionInstance.candidateCount();
    }).then(function(candidatesCount) {
      console.log("Number of candidates fetched:", candidatesCount.toNumber());
      const candidatesResults = $("#candidatesResults");
      const candidatesSelect = $('#candidatesSelect');

      candidatesResults.empty();
      candidatesSelect.empty();

      for (let i = 1; i <= candidatesCount; i++) {
        electionInstance.candidates(i).then(function(candidate) {
          const id = candidate[0].toNumber();
          const name = candidate[1];
          const voteCount = candidate[2].toNumber();

          console.log("Candidate Data:", id, name, voteCount);  // Log candidate data

          // Render candidate result in table
          const candidateTemplate = `<tr><th>${id}</th><td>${name}</td><td>${voteCount}</td></tr>`;
          candidatesResults.append(candidateTemplate);

          // Render candidate ballot option
          const candidateOption = `<option value='${id}'>${name}</option>`;
          candidatesSelect.append(candidateOption);
        }).catch(function(err) {
          console.error("Error fetching candidate:", err);  // Log candidate fetch error
        });
      }
      return electionInstance.voters(App.account);
    }).then(function(hasVoted) {
      if (hasVoted) {
        $('form').hide();
        $("#voteNotification").text("You have already voted.").show();
      } else {
        $('form').show();
      }
      loader.hide();
      content.show();
    }).catch(function(error) {
      console.error("Error in rendering:", error);  // Log rendering error
      alert("An error occurred while loading the data. Please try again.");
    });
  },

  // Cast a vote for a selected candidate
  castVote: function() {
    const candidateId = $('#candidatesSelect').val();
    if (!candidateId) {
      alert("Please select a candidate before voting.");
      return;
    }

    App.contracts.Election.deployed().then(function(instance) {
      return instance.vote(candidateId, { from: App.account });
    }).then(function(result) {
      $("#content").hide();
      $("#loader").show();
    }).catch(function(err) {
      console.error("Error casting vote: ", err);
      alert("Failed to cast vote. Please try again.");
    });
  }
};

// jQuery document ready function
$(function() {
  $(window).on('load', function() {
    App.init();
  });
});
