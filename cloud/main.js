
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
function haveCommonInterests(userInterestedInBusiness,userInterestedInLove,userInterestedInFriendship,req, user) {
    var interestedInBusiness = req.user.get("interested_in_business");
    var interestedInLove = req.user.get("interested_in_love");
    var interestedInFriendship = req.user.get("interested_in_friendship");
    var commonInterest = false;
    if (userInterestedInBusiness !== 'undefined' && interestedInBusiness !== 'undefined' && userInterestedInBusiness == true && interestedInBusiness == true) {
        console.log("userInterestedInBusiness");
        commonInterest = true;
    }
    if (userInterestedInLove !== 'undefined' && interestedInLove !== 'undefined' && userInterestedInLove == true && interestedInLove == true) {
        console.log("userinterestedInLove");
        if (areCompatible(req.user, user)) {
        commonInterest = true;
        }
    }
    if (userInterestedInFriendship !== 'undefined' && interestedInFriendship !== 'undefined' && userInterestedInFriendship == true && interestedInFriendship == true) {
        console.log("userinterestedInFriendship");
        commonInterest = true;
    }
    console.log("userinterestedInLove");
    return commonInterest;
}
function getBridgeStatusAndType(userInterestedInBusiness,userInterestedInLove,userInterestedInFriendship, req, user) {
    var interestedInBusiness = req.user.get("interested_in_business");
    var interestedInLove = req.user.get("interested_in_love");
    var interestedInFriendship = req.user.get("interested_in_friendship");
    var noOfQueries = 0;
    var bridgeStatus = "No Bridge Status";
    var bridgeType = "";
    if (userInterestedInBusiness !== 'undefined' && interestedInBusiness !== 'undefined' && userInterestedInBusiness == true && interestedInBusiness == true) {
        var query = new Parse.Query("BridgeStatus");
        query.descending("createdAt");
        query.equalTo("bridge_type","Business");
        query.count({
                    success: function(count) {
                    if (count > noOfQueries) {
                        bridgeType = "Business"
                    }
                    },
                    error: function(error) {

                    }

                    });
        }
    if (userInterestedInLove !== 'undefined' && interestedInLove !== 'undefined' && userInterestedInLove == true && interestedInLove == true) {
        var query = new Parse.Query("BridgeStatus");
        query.descending("createdAt");
        query.equalTo("bridge_type","Love");
        query.count({
                    success: function(count) {
                    if ( (count > noOfQueries) && areCompatible(req.user, user)) {
                    bridgeType = "Love"
                    }
                    },
                    error: function(error) {

                    }
                    });
    }
    if (userInterestedInFriendship !== 'undefined' && interestedInFriendship !== 'undefined' && userInterestedInFriendship == true && interestedInFriendship == true) {
        var query = new Parse.Query("BridgeStatus");
        query.descending("createdAt");
        query.equalTo("bridge_type","Friendship");
        query.count({
                    success: function(count) {
                    if (count > noOfQueries) {
                    bridgeType = "Friendship"
                    }
                    },
                    error: function(error) {

                    }
                    });
    }
    if (bridgeType != "") {
        var query = new Parse.Query("BridgeStatus");
        query.descending("createdAt");
        query.equalTo("bridge_type",bridgeType)
        query.first({
                    success: function(result) {
                        bridgeStatus = result["bridge_status"]
                    },
                    error: function(error) {

                    }
                    });

    }
    return [bridgeStatus, bridgeType];

}
function areCompatible(user1, user2) {
    var lovePreference1 = user1.get("interested_in")
    var lovePreference2 = user2.get("gender")
    if (lovePreference1 == lovePreference2) {
        return true
    }
    else {
        return false
    }
    
}
function getDsitanceScore(distance1, distance2) {
      return (distance1["latitude"] - distance2["latitude"] )
//    var geoPoint1 = new GeoPoint(distance1["latitude"], distance1["longitude"]);
//    var geoPoint2 = new GeoPoint(distance2["latitude"], distance2["longitude"]);
//    return 1.0/(geoPoint1.milesTo(geoPoint2));
    
}

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
                              if (haveCommonInterests(interestedInBusiness, interestedInLove, interestedInFriendship,req, results[i] ) == true) {
                              var BridgePairingsClass = Parse.Object.extend("BridgePairings");
                              var bridgeStatusAndType = getBridgeStatusAndType(interestedInBusiness, interestedInLove, interestedInFriendship,req, results[i]);
                              
                              var bridgePairing = new BridgePairingsClass();
                              bridgePairing.set("user1_name",req.user.get("name"));
                              bridgePairing.set("user2_name",results[i].get("name"));
                              
                              
                              bridgePairing.set("user2_bridge_status",bridgeStatusAndType[0]);
                              bridgePairing.set("user1_bridge_status","");
                              
                              bridgePairing.set("user1_profile_picture",req.user.get("fb_profile_picture"));
                              bridgePairing.set("user2_profile_picture",results[i].get("fb_profile_picture"));
                              
                              bridgePairing.set("bridge_type",bridgeStatusAndType[1]);
                              bridgePairing.set("user_locations",[req.user.get("location"),results[i].get("location")]);
                              bridgePairing.set("user_objectIds",[req.user.id,results[i].id]);
                              bridgePairing.set("score", getDsitanceScore(req.user.get("location"), results[i].get("location") ));
                              bridgePairing.set("checked_out",false);
                              

                              
                              bridgePairing.save(null, {
                                                 success: function(bridgePairing){
                                                 
                                                 },
                                                 error: function(bridgePairing, error){
                                                 
                                                 }
                                                 });
                              }
                              }
                              },
                              error: function() {
                              count -= 1;
                              res.success("error");
                              }
                              });
                   
                   });