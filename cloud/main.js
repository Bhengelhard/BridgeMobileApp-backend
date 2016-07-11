
Parse.Cloud.define('hello', function(req, res) {
  res.success('helrlo');
});
Parse.Cloud.define('addBridgePairing', function(req, res) {
var BridgePairingsClass = Parse.Object.extend("BridgePairings");
var bridgePairing = new BridgePairingsClass();
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
Parse.Cloud.define('updateBridgePairingsTable', function(req, res) {
                   var query = new Parse.Query("_User");
                   query.containedIn("friend_list",req.params.friendList);
                   var count = 0;
                   query.find({
                              success: function(results){
                              count += results.length;
                              res.success(count)
                              for (var i = 0; i < results.length; ++i) {
                              
                                var BridgePairingsClass = Parse.Object.extend("BridgePairings");
                                var bridgePairing = new BridgePairingsClass();
                                bridgePairing.set("user1_name",results[i].get("name"))
                                bridgePairing.set("user2_name",results[i].get("name"))
                                bridgePairing.set("bridge_type","Business")
                                bridgePairing.save(null, {
                                                   success: function(bridgePairing){
                                                 
                                                   },
                                                   error: function(bridgePairing, error){
                                                
                                                   }
                                                   });
                                }
                              },
                              error: function() {
                              count -= 1;
                              res.success(count)
                              }
                              });
                   
});