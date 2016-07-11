
Parse.Cloud.define('hello', function(req, res) {
  res.success('helrlo');
});

Parse.Cloud.job(“updateTable”, function(request, status) {
                var bridgePairing = new BridgePairings();
                bridgePairing.set("user1","001")
                bridgePairing.set("user2","002")
                bridgePairing.set("bridge_type","Business")
                bridgePairing.save(null, {
                                   success: function(bridgePairing){
                                    status.success("Saved")
                                   },
                                   error: function(bridgePairing, error){
                                    status.error("Not saved")
                                   }
                                   });
});