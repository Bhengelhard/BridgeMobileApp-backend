
Parse.Cloud.define('hello', function(req, res) {
  res.success('helrlo');
});
Parse.Cloud.define('addBridgePairing', function(req, res) {
var bridgePairing = new BridgePairings();
bridgePairing.set("user1","001")
bridgePairing.set("user2","002")
bridgePairing.set("bridge_type","Business")
bridgePairing.save(null, {
                    success: function(bridgePairing){
                        res.success("Saved")
                    },
                    error: function(bridgePairing, error){
                        res.error("Not saved")
                    }
                   });
});