// Cloud code
Parse.Cloud.define("deleteBridgePairings", function(request, status) {
                
                var BridgePairingsClass = Parse.Object.extend("BridgePairings");
                var query = new Parse.Query(BridgePairingsClass);
                query.notEqualTo("user1_name","Blake Takita");
                query.limit = 10000
                query.find({
                           success:function(results) {
                           for (var i = 0, len = results.length; i < len; i++) {
                           var result = results[i];
                           result.destroy({});
                           console.log("Destroy: "+result);
                           
                           }
                           },
                           error: function(error) {
                           console.log("Failed!");         
                           }
                           });
                
                });
Parse.Cloud.define('changeBridgePairingsOnStatusUpdate', function(req, res) {
                   console.log("changeBridgePairingsOnStatusUpdate was called");
                   var BridgePairingsClass = Parse.Object.extend("BridgePairings");
                   var query = new Parse.Query(BridgePairingsClass);
                   query.equalTo("user_objectIds",req.user.id);
                   query.equalTo("bridge_type",req.params.bridgeType);
                   query.limit = 10000;
                   query.find({
                             success:function(results) {
                             for (var i = 0, len = results.length; i < len; i++) {
                             var result = results[i];
                             var userObjectIds = result.get("user_objectIds");
                             console.log("result = "+ result + "userObjectIds[0]="+userObjectIds[0] + " & userObjectIds[1]= "+userObjectIds[1]);
                             if( userObjectIds.length > 0 ){
                             if (userObjectIds[0] == req.user.id) {
                              result.set("user1_bridge_status", req.params.status);
                                console.log("1");
                             }
                             else {
                              result.set("user2_bridge_status",req.params.status);
                                console.log("2");
                             }
                             result.save(null, {
                                                success: function(bridgePairing){
                                                console.log("Saved after changinging status")
                                                },
                                                error: function(bridgePairing, error){
                                                console.log(" Not Saved after changinging status")
                                                }
                                         });
                             }
                             }
                             res.success("Saved");
                             },
                             error: function(error) {
                             console.log("Failed!");
                             res.error("Not saved");
                             }
                             });
                   
                   });
Parse.Cloud.define('changeBridgePairingsOnInterestedInUpdate', function(req, res) {
                   
                   var BridgePairingsClass = Parse.Object.extend("BridgePairings");
                   var query = new Parse.Query(BridgePairingsClass);
                   query.equalTo("user_objectIds",req.user.id);
                   query.limit = 10000;
                   query.find({
                              success:function(results) {
                              var usersNotToPairWith = [];
                              var shownToForPairsNotCheckedOut = {};
                              console.log(results.length + " entries have the current user as a better half");
                              for (var i = 0, len = results.length; i < len; i++) {
                              var result = results[i];
                              if (result.get("checked_out") == true) {
                              var userObjectIds = result.get("user_objectIds");
                              if (userObjectIds[0] == req.user.id) {
                              usersNotToPairWith.push(userObjectIds[1])
                              }
                              else {
                              usersNotToPairWith.push(userObjectIds[0])
                              }
                              }
                              else {
                              var userObjectIds = result.get("user_objectIds");
                              if (userObjectIds[0] == req.user.id) {
                              shownToForPairsNotCheckedOut[userObjectIds[1]] = result.get("shown_to");
                              }
                              else {
                              shownToForPairsNotCheckedOut[userObjectIds[0]] = result.get("shown_to");
                              }
                              //result.destroy({});
                              }
                              }
                              console.log("Done creating usersNotToPairWith, shownToForPairsNotCheckedOut");
                              recreatePairings(req, usersNotToPairWith, shownToForPairsNotCheckedOut);
                              res.success("Saved");
                              },
                              error: function(error) {
                              console.log("Failed!");
                              res.error("Not Saved");
                              }
                              });
                   });
Parse.Cloud.define('revitalizeMyPairs', function(req, res) {
                   var BridgePairingsClass = Parse.Object.extend("BridgePairings");
                   var query = new Parse.Query(BridgePairingsClass);
                   query.equalTo("shown_to",req.user.id);
                   query.notEqualTo("checked_out",false);
                   query.limit = 10000;
                   query.find({
                              success:function(results) {
                              for (var i = 0, len = results.length; i < len; i++) {
                              var result = results[i];
                              var shownTo = result.get("shown_to");
                              var i = shownTo.indexOf(req.user.id);
                              if (i > -1) {
                                shownTo.splice(i,1);
                              }
                              result.set("shown_to", shownTo);
                              result.save(null, {
                                          success: function(bridgePairing){
                                          console.log("Saved after revitalizing")
                                          },
                                          error: function(bridgePairing, error){
                                          console.log(" Not Saved after revitalizing")
                                          }
                                          });
                              }

                              },
                              error: function(error) {
                              console.log("Failed!");
                              }
                              });


                   
                   });

function recreatePairings(req, usersNotToPairWith, shownToForPairsNotCheckedOut){
    var query = new Parse.Query("_User");
    console.log("recreatePairings was called");
    var skipIds = usersNotToPairWith.concat(req.params.friendList);
    query.notContainedIn("objectId",skipIds);
    query.limit = 10000;
    var count = 0;
    query.find({
               success: function(results){
               count += results.length;
               console.log("query.find "+count);
               for (var i = 0; i < results.length; ++i) {
               
               var interestedInBusiness = results[i].get("interested_in_business");
               var interestedInLove = results[i].get("interested_in_love");
               var interestedInFriendship = results[i].get("interested_in_friendship");
               if (haveCommonInterests(interestedInBusiness, interestedInLove, interestedInFriendship,req, results[i] ) == true) {
               console.log("haveCommonInterests");
               var BridgePairingsClass = Parse.Object.extend("BridgePairings");
               var bridgeStatusAndType = getBridgeStatusAndType(interestedInBusiness, interestedInLove, interestedInFriendship,req, results[i]);
               
               var bridgePairing = new BridgePairingsClass();
               bridgePairing.set("user1_name",req.user.get("name"));
               bridgePairing.set("user2_name",results[i].get("name"));
               
               
               bridgePairing.set("user2_bridge_status",bridgeStatusAndType[0]);
               bridgePairing.set("user1_bridge_status",bridgeStatusAndType[1]);
               
               bridgePairing.set("user1_profile_picture",req.user.get("profile_picture"));
               bridgePairing.set("user2_profile_picture",results[i].get("profile_picture"));
               
               console.log("after profile picture is set");
               
               bridgePairing.set("bridge_type",bridgeStatusAndType[2]);
               bridgePairing.set("user_locations",[req.user.get("location"),results[i].get("location")]);
               bridgePairing.set("user_objectIds",[req.user.id,results[i].id]);
               console.log("after user_objectIds is set");
               bridgePairing.set("score", getDistanceScore(req.user.get("location"), results[i].get("location") ));
               console.log("after score is set");
               bridgePairing.set("checked_out",false);
               if (results[i].id in shownToForPairsNotCheckedOut) {
               bridgePairing.set("shown_to",shownToForPairsNotCheckedOut.results[i].id);
               }
               else {
               bridgePairing.set("shown_to",[]);
               }
               bridgePairing.save(null, {
                                  success: function(bridgePairing){
                                  console.log("saved a pairing");
                                  
                                  },
                                  error: function(bridgePairing, error){
                                  console.log("could not save a pairing");
                                  }
                                  });
               }
               }
               },
               error: function() {
               console.log("Querying _User failed in recreatePairings");
               }
               });

    
}

Parse.Cloud.define('hello', function(req, res) {
                   res.success('helrlo');
                   });
Parse.Cloud.define('pushNotification', function(req, res) {
                   var query = new Parse.Query(Parse.Installation);
                   query.equalTo('userObjectId', req.params.userObjectId);
                   Parse.Push.send({
                                   where: query,
                                   data: {
                                   alert: req.params.alert,
                                   badge: req.params.badge,
                                   messageType: req.params.messageType,
                                   messageId: req.params.messageId
                                   }
                                   }, {
                                   success: function() {
                                   console.log("success: Parse.Push.send did send push "+ req.params.messageId + "  " + req.params.messageType );
                                   },
                                   error: function(e) {
                                   console.log("error: Parse.Push.send code: " + e.code + " msg: " + e.message);
                                   },
                                   useMasterKey: true
                                   });

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
function getType(obj){
    if(obj===null)return "[object Null]"; // special case
    return Object.prototype.toString.call(obj);
}

function haveCommonInterests(userInterestedInBusiness,userInterestedInLove,userInterestedInFriendship,req, user) {
    var interestedInBusiness = req.user.get("interested_in_business");
    var interestedInLove = req.user.get("interested_in_love");
    var interestedInFriendship = req.user.get("interested_in_friendship");
    console.log("interestedInBusiness - "+interestedInBusiness);
    console.log("interestedInLove - "+interestedInLove);
    console.log("interestedInFriendship - "+interestedInFriendship);
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
    //console.log("userinterestedInLove");
    return commonInterest;
}
function getBridgeStatusAndType(userInterestedInBusiness,userInterestedInLove,userInterestedInFriendship, req, user) {
    console.log(" inside getBridgeStatusAndType");
    var interestedInBusiness = req.user.get("interested_in_business");
    var interestedInLove = req.user.get("interested_in_love");
    var interestedInFriendship = req.user.get("interested_in_friendship");
    var maxQueriesReturned = -1;
    var bridgeStatus1 = "No Bridge Status";
    var bridgeStatus2 = "No Bridge Status";
    var bridgeType = "";
    var allDone = 0;
    //if (userInterestedInBusiness !== 'undefined' && interestedInBusiness !== 'undefined' && userInterestedInBusiness == true && interestedInBusiness == true) {
        var query = new Parse.Query("BridgeStatus");
        query.descending("createdAt");
        query.equalTo("userId",user.id);
        query.equalTo("bridge_type","Business");
        query.count({
                    success: function(count1) {
                    console.log("count1 success");
                    var query2 = new Parse.Query("BridgeStatus");
                    query2.descending("createdAt");
                    query2.equalTo("userId",req.user.id);
                    query2.equalTo("bridge_type","Business");
                    query2.count({
                                success: function(count2) {
                                console.log("count2 success");
                                if (count1 + count2 > maxQueriesReturned) {
                                bridgeType = "Business";
                                maxQueriesReturned = count1 + count2;
                                }
                                allDone += 1;
                                console.log("1");
                                },
                                error: function(error) {
                                 allDone += 1;
                                 console.log("2");
                                }
                                
                                });
                    },
                    error: function(error) {
                    console.log("3");
                        allDone += 1;

                    }

                    });
       // }
//    if (userInterestedInLove !== 'undefined' && interestedInLove !== 'undefined' && userInterestedInLove == true && interestedInLove == true) {
//        if (areCompatible(req.user, user)) {
//        var query = new Parse.Query("BridgeStatus");
//        query.descending("createdAt");
//        query.equalTo("bridge_type","Love");
//        query.equalTo("userId",user.id);
//        query.count({
//                    success: function(count1) {
//                    var query2 = new Parse.Query("BridgeStatus");
//                    query2.descending("createdAt");
//                    query2.equalTo("userId",req.user.id);
//                    query2.equalTo("bridge_type","Love");
//                    query2.count({
//                                 success: function(count2) {
//                                 if (count1 + count2 > maxQueriesReturned) {
//                                 bridgeType = "Love";
//                                 maxQueriesReturned = count1 + count2;
//                                 }
//                                 allDone += 1;
//                                 console.log("4");
//                                 },
//                                 error: function(error) {
//                                    allDone += 1;
//                                    console.log("5");
//                                 }
//                                 
//                                 });
//                    },
//                    error: function(error) {
//                        allDone += 1;
//                    console.log("6");
//                    }
//                    });
//        }
//        else {
//            allDone += 1;
//            console.log("7");
//        }
//    }
//    if (userInterestedInFriendship !== 'undefined' && interestedInFriendship !== 'undefined' && userInterestedInFriendship == true && interestedInFriendship == true) {
//        var query = new Parse.Query("BridgeStatus");
//        query.descending("createdAt");
//        query.equalTo("userId",user.id);
//        query.equalTo("bridge_type","Friendship");
//        query.count({
//                    success: function(count1) {
//                    var query2 = new Parse.Query("BridgeStatus");
//                    query2.descending("createdAt");
//                    query2.equalTo("userId",req.user.id);
//                    query2.equalTo("bridge_type","Friendship");
//                    query2.count({
//                                 success: function(count2) {
//                                 if (count1 + count2 > maxQueriesReturned) {
//                                 bridgeType = "Friendship";
//                                 maxQueriesReturned = count1 + count2;
//                                 }
//                                 allDone += 1;
//                                 console.log("8");
//                                 },
//                                 error: function(error) {
//                                    allDone += 1;
//                                    console.log("9");
//                                 }
//                                 
//                                 });
//                    },
//                    error: function(error) {
//                        allDone += 1;
//                        console.log("10");
//                    }
//                    });
//    }
    
    while (allDone < 1) {
        //console.log(" stuck at allDone < 1");
    }
    console.log(" getting out of getBridgeStatusAndType");
    if (bridgeType != "" && maxQueriesReturned > 0 ) {
        var query = new Parse.Query("BridgeStatus");
        query.descending("createdAt");
        query.equalTo("userId",user.id);
        query.equalTo("bridge_type",bridgeType);
        query.first({
                    success: function(result) {
                        bridgeStatus1 = result["bridge_status"]
                        var query2 = new Parse.Query("BridgeStatus");
                        query2.descending("createdAt");
                        query2.equalTo("userId",req.user.id);
                        query2.equalTo("bridge_type",bridgeType);
                        query2.first({
                                success: function(result) {
                                bridgeStatus2 = result["bridge_status"];
                                allDone += 1;
                                console.log("11");
                                },
                                error: function(error) {
                                allDone += 1;
                                console.log("12");
                                }
                                });

                    },
                    error: function(error) {
                    allDone += 1;
                    }
                    });
        while (allDone < 2) {
            
        }
        return [bridgeStatus1,bridgeStatus2, bridgeType];
    }
    else{
    return [bridgeStatus1,bridgeStatus2, bridgeType];
    }

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
function getDistanceScore(distance1, distance2) {
    if (("latitude" in distance1) && ("latitude" in distance2) && ("longitude" in distance1) && ("longitude" in distance1)) {
        var x = distance1["latitude"] - distance2["latitude"];
        var y = distance1["longitude"] - distance2["longitude"];
        return (Math.sqrt(x*x + y*y) );
    }
    else {
        return 0;
    }
//    var geoPoint1 = new GeoPoint({latitude: distance1["latitude"], longitude: distance1["longitude"]});
//    var geoPoint2 = new GeoPoint({latitude: distance2["latitude"], longitude: distance2["longitude"]});
//    var geoPoint1 = new GeoPoint({latitude: 30, longitude: 30});
//    var geoPoint2 = new GeoPoint({latitude: 30, longitude: 30});
//    return (geoPoint1.milesTo(geoPoint2));
    
}

Parse.Cloud.define('updateBridgePairingsTable', function(req, res) {
                   var query = new Parse.Query("_User");
                   console.log("updateBridgePairingsTable was called");
                   // get only those user who are not friends
                   query.notContainedIn("objectId",req.params.friendList);
                   var count = 0;
                   query.find({
                              success: function(results){
                              count += results.length;
                              console.log("query.find "+count);
                              res.success(req.user.get("name"));
                              for (var i = 0; i < results.length; ++i) {
                              
                              var interestedInBusiness = results[i].get("interested_in_business");
                              var interestedInLove = results[i].get("interested_in_love");
                              var interestedInFriendship = results[i].get("interested_in_friendship");
                              if (haveCommonInterests(interestedInBusiness, interestedInLove, interestedInFriendship,req, results[i] ) == true) {
                              console.log("haveCommonInterests");
                              var BridgePairingsClass = Parse.Object.extend("BridgePairings");
                              var bridgeStatusAndType = getBridgeStatusAndType(interestedInBusiness, interestedInLove, interestedInFriendship,req, results[i]);
                              
                              var bridgePairing = new BridgePairingsClass();
                              bridgePairing.set("user1_name",req.user.get("name"));
                              bridgePairing.set("user2_name",results[i].get("name"));
                              
                              
                              bridgePairing.set("user2_bridge_status",bridgeStatusAndType[0]);
                              bridgePairing.set("user1_bridge_status","");
                              
                              bridgePairing.set("user1_profile_picture",req.user.get("fb_profile_picture"));
                              bridgePairing.set("user2_profile_picture",results[i].get("fb_profile_picture"));
                              console.log("after profile picture is set");
                              bridgePairing.set("bridge_type",bridgeStatusAndType[2]);
                              bridgePairing.set("user_locations",[req.user.get("location"),results[i].get("location")]);
                              bridgePairing.set("user_objectIds",[req.user.id,results[i].id]);
                              console.log("after user_objectIds is set");
                              bridgePairing.set("score", getDistanceScore(req.user.get("location"), results[i].get("location") ));
                              console.log("after score is set");
                              bridgePairing.set("checked_out",false);
                              bridgePairing.set("shown_to",[]);
                              

                              
                              bridgePairing.save(null, {
                                                 success: function(bridgePairing){
                                                 console.log("saved a pairing");
                                                 
                                                 },
                                                 error: function(bridgePairing, error){
                                                 console.log("could not save a pairing");
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