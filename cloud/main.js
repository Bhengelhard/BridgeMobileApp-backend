
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
function haveCommonInterests(userInterestedInBusiness,userInterestedInLove,userInterestedInFriendship,req) {
    var currentUser = req.user;
    var interestedInBusiness = currentUser.get("interested_in_business");
    var interestedInLove = currentUser.get("interested_in_love");
    var interestedInFriendship = currentUser.get("interested_in_friendship");
    var commonInterest = false;
    if (userInterestedInBusiness !== 'undefined' && interestedInBusiness !== 'undefined' && userInterestedInBusiness == true && interestedInBusiness == true) {
        console.log("userInterestedInBusiness");
        commonInterest = true;
    }
    if (userInterestedInLove !== 'undefined' && interestedInLove !== 'undefined' && userInterestedInLove == true && interestedInLove == true) {
        console.log("userinterestedInLove");
        commonInterest = true;
    }
    if (userInterestedInFriendship !== 'undefined' && interestedInFriendship !== 'undefined' && userInterestedInFriendship == true && interestedInFriendship == true) {
        console.log("userinterestedInFriendship");
        commonInterest = true;
    }
    console.log("userinterestedInLove");
    return commonInterest;
}
//function getStatus(userInterestedInBusiness,userInterestedInLove,userInterestedInFriendship, objectId) {
//    var currentUser = Parse.User.current();
//    var interestedInBusiness = currentUser.get("interested_in_business");
//    var interestedInLove = currentUser.get("interested_in_love");
//    var interestedInFriendship = currentUser.get("interested_in_friendship");
//    var noOfQueries = 0;
//    var bridgeStatus = "";
//    var bridgeType = "";
//    if userInterestedInBusiness !== 'undefined' && interestedInBusiness !== 'undefined' && userInterestedInBusiness == true && interestedInBusiness == true {
//        var query = new Parse.Query("BridgeStatus");
//        query.descending("createdAt");
//        query.equalTo("bridge_type","Business");
//        query.count({
//                    success: function(count) {
//                    if (count > noOfQueries) {
//                        bridgeType = "Business"
//                    }
//                    },
//                    error: function(error) {
//                    
//                    }
//
//                    });
//        }
//    if userinterestedInLove !== 'undefined' && interestedInLove !== 'undefined' && userinterestedInLove == true && interestedInLove == true {
//        var query = new Parse.Query("BridgeStatus");
//        query.descending("createdAt");
//        query.equalTo("bridge_type","Love");
//        query.count({
//                    success: function(count) {
//                    if (count > noOfQueries) {
//                    bridgeType = "Love"
//                    }
//                    },
//                    error: function(error) {
//                    
//                    }
//                    });
//    }
//    if userinterestedInFriendship !== 'undefined' && interestedInFriendship !== 'undefined' && userinterestedInFriendship == true && interestedInFriendship == true {
//        var query = new Parse.Query("BridgeStatus");
//        query.descending("createdAt");
//        query.equalTo("bridge_type","Friendship");
//        query.count({
//                    success: function(count) {
//                    if (count > noOfQueries) {
//                    bridgeType = "Friendship"
//                    }
//                    },
//                    error: function(error) {
//                    
//                    }
//                    });
//    }
//    if bridgeType != "" {
//        var query = new Parse.Query("BridgeStatus");
//        query.descending("createdAt");
//        query.equalTo("bridge_type",bridgeType)
//        query.first({
//                    success: function(result) {
//                        bridgeStatus = result["bridge_status"]
//                    },
//                    error: function(error) {
//                    
//                    }
//                    });
//        
//    }
//    return bridgeStatus;
//
//}

Parse.Cloud.define('updateBridgePairingsTable', function(req, res) {
                   var query = new Parse.Query("_User");
                   // get only those user who are not friends
                   query.notContainedIn("objectId",req.params.friendList);
                   var count = 0;
                   query.find({
                              success: function(results){
                              count += results.length;
                              res.success(req.user.get("name"));
                              for (var i = 0; i < results.length; ++i) {
                              var interestedInBusiness = results[i].get("interested_in_business");
                              var interestedInLove = results[i].get("interested_in_love");
                              var interestedInFriendship = results[i].get("interested_in_friendship");
                              if (haveCommonInterests(interestedInBusiness, interestedInLove, interestedInFriendship,req) == true) {
                                var BridgePairingsClass = Parse.Object.extend("BridgePairings");
                                var bridgePairing = new BridgePairingsClass();
                                bridgePairing.set("user1_name",req.user.get("name"))
                                bridgePairing.set("user2_name",results[i].get("name"))
                                bridgePairing.set("bridge_type","Business")
                                bridgePairing.save(null, {
                                                   success: function(bridgePairing){
                                                 
                                                   },
                                                   error: function(bridgePairing, error){
                                                
                                                   }
                                                   });
                                //}
                              }
                              },
                              error: function() {
                              count -= 1;
                              res.success("error");
                              }
                              });
                   
});