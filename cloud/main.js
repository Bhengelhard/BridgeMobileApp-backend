//
//  main.js
//  Parse Cloud Code
//
//
//  Created by Sagar Sinha on 8/14/16.
//  Copyright © 2016 BHE Ventures. All rights reserved.
//
//  This class stores the server-side functions that can be called from the users device and run over the cloud



//Main App Metrics Script
Parse.Cloud.define('getMainAppMetrics', function(req, res) {
    console.log("getMainAppMetrics");
    //User Content Interests
    //1. % Interested in each category - which categories do users turn on
                   //% Interested in Business = # of users interested_in_business/Total # of users
                   //% Interested in Love = # of users interested in Love/Total # of users
                   //% Interested in Friendship = # of users interested in Friendship/Total # of users
                   var totalNumberOfUsers;
                   var userQuery = new Parse.Query("_User");
                   userQuery.limit(10000);
                   userQuery.find({
                              success: function(results){
                              
                              totalNumberOfUsers = results.length;
                              console.log("totalNumberOfUsers ="+totalNumberOfUsers);
                                  var numInterestedInBusiness = 0.0;
                                  var numInterestedInLove = 0.0;
                                  var numInterestedInFriendship = 0.0;
                                  var numInterestedInNothing = 0.0;
                                  
                                  var numRanOutOfPairs = 0.0;
                              
                              for (var j = 0; j < results.length; ++j) {
                              var result = results[j];
                              var interestedInBusiness = result.get("interested_in_business");
                              var interestedInLove = result.get("interested_in_love");
                              var interestedInFriendship = result.get("interested_in_friendship");
                              if (interestedInBusiness) {
                                numInterestedInBusiness += 1.0;
                              }
                              if (interestedInLove) {
                                numInterestedInLove += 1.0;
                              }
                              if (interestedInFriendship) {
                                numInterestedInFriendship += 1.0;
                              }
                              if (interestedInBusiness != true && interestedInLove != true && interestedInFriendship != true) {
                                numInterestedInFriendship += 1.0;
                              }
                                  var ranOutOfPairs = result.get("ran_out_of_pairs");
                                  if (ranOutOfPairs > 0) {
                                  numRanOutOfPairs += 1;
                                  }
                              }
                              
                              var percentageInterestedInBusiness = ((numInterestedInBusiness/totalNumberOfUsers)*100.0).toFixed(2);
                              var percentageInterestedInLove = ((numInterestedInLove/totalNumberOfUsers)*100.0).toFixed(2);
                              var percentageInterestedInFriendship = ((numInterestedInFriendship/totalNumberOfUsers)*100.0).toFixed(2);
                              var percentageInterestedInNothing = ((numInterestedInNothing/totalNumberOfUsers)*100.0).toFixed(2);
                              console.log("% interested in Business = " + percentageInterestedInBusiness + "%");
                              console.log("% interested in Love = " + percentageInterestedInLove + "%");
                              console.log("% interested in Friendship = " + percentageInterestedInFriendship + "%");
                              console.log("% interested in Nothing = " + percentageInterestedInNothing + "%");
                                  
                                  //% of users that clicked revisit or ran out of potential matches
                                  var percentageRanOutOfPairs = ((numRanOutOfPairs/totalNumberOfUsers)*100.0).toFixed(2);
                                  console.log("% of users that ran out of potential matches = "+percentageRanOutOfPairs+"%");
                                  
                              },
                              error: function() {
                              console.log("Querying _User failed in getMainAppMetrics");
                              res.error("Querying _User failed in getMainAppMetrics");
                              }
                              });
    //2. % Bridged per category (e.g. if shown 10 business connections and bridged 2 then 20% for business)
                   //% Bridged out of Business Pairings = # business pairings bridged / total # business pairings
                   //% Bridged out of Love Pairings = # love pairings bridged / total # love pairings
                   //% Bridged out of Friendship Pairings = # frienship pairings bridged / total # friendship pairings
                   var bridgePairingsQuery = new Parse.Query("BridgePairings");
                   bridgePairingsQuery.limit(10000);
                   bridgePairingsQuery.find({
                              success: function(results){
                              var totalNumberofBridgePairings = results.length;
                              console.log("totalNumberofBridgePairings = "+totalNumberofBridgePairings);
                              
                              var incrementWhenDone = {count : 0};
                            
                            var totalNumSwipes = 0.0;
                                            
                            var totalNumBusinessPairings = 0.0;
                            var totalNumLovePairings = 0.0;
                            var totalNumFriendshipPairings = 0.0;
                                            
                            var numBridgedBusinessPairings = 0.0;
                            var numBridgedLovePairings = 0.0;
                            var numBridgedFriendshipPairings = 0.0;

                                            
                            //% of pairings introduced from pairings with one status = # of pairings with one status introduced / # of pairings with one status
                            //% of pairings introduced from pairings that had two statuses
                            //% of pairings introduced from  introductions with no statuses
                            var TotalNumPairingsWithOneStatus = 0.0;
                            var numPairingsBridgedWithOneStatus = 0.0;
                            var TotalNumPairingsWithTwoStatuses = 0.0;
                            var numPairingsBridgedWithTwoStatuses = 0.0;
                            var TotalNumPairingsWithNoStatuses = 0.0;
                            var numPairingsBridgedWithNoStatuses = 0.0;
                                            
                                            
                              for (var j = 0; j < results.length; ++j) {
                              var result = results[j];
                              
                              var bridgeType = result.get("bridge_type");
                              var bridged = result.get("bridged");
                              
                              if (bridgeType == "Business") {
                              totalNumBusinessPairings += 1.0;
                              if (bridged) {
                              numBridgedBusinessPairings += 1.0;
                              }
                              } else if (bridgeType == "Love") {
                              totalNumLovePairings += 1.0;
                              if (bridged) {
                              numBridgedLovePairings += 1.0;
                              }
                              } else if (bridgeType == "Friendship") {
                              totalNumFriendshipPairings += 1.0;
                              if (bridged) {
                              numBridgedFriendshipPairings += 1.0;
                              }
                              }
                              
                                            
                               // calculating the total number of swipes performed
                                            var shownTo = result.get("shown_to");
                                            totalNumSwipes += shownTo.length;
                                            var checkedOut = result.get("checked_out");
                                            if (checkedOut) {
                                            totalNumSwipes -= 1;
                                            }
                                            
                                            
                                            //calculating percentages of successful introduction from matches with 0, 1, and 2 pairings for statuses that have been shown to at least one person
                                            if (shownTo != null) {
                                                var user1BridgeStatus = result.get("user1_bridge_status");
                                                var user2BridgeStatus = result.get("user2_bridge_status");
                                            
                                                if (user1BridgeStatus == null && user2BridgeStatus == null) {
                                                TotalNumPairingsWithNoStatuses += 1.0;
                                                    if (bridged) {
                                                        numPairingsBridgedWithNoStatuses += 1.0;
                                                    }
                                                } else if (user1BridgeStatus != null && user2BridgeStatus != null) {
                                                    TotalNumPairingsWithTwoStatuses += 1.0;
                                                    if (bridged) {
                                                        numPairingsBridgedWithTwoStatuses += 1.0;
                                                    }
                                                } else {
                                                TotalNumPairingsWithOneStatus += 1.0;
                                                    if (bridged) {
                                                        numPairingsBridgedWithOneStatus += 1.0;
                                                    }
                                                }
                                            }
                                            
                              }
                                            
                                            /*console.log("totalNumBusinessPairings = "+totalNumBusinessPairings);
                                            console.log("numBridgedBusinessPairings = " + numBridgedBusinessPairings);
                                            console.log("totalNumLovePairings = " + totalNumLovePairings);
                                            console.log("numBridgedLovePairings = " + totalNumLovePairings);
                                            console.log("totalNumFriendshipPairings = " + totalNumLovePairings);
                                            console.log("numBridgedFriendshipPairings = " + totalNumLovePairings);*/
                              var percentageBridgedOfBusiness = ((numBridgedBusinessPairings/totalNumBusinessPairings)*100.0).toFixed(2);
                              var percentageBridgedOfLove = ((numBridgedLovePairings/totalNumLovePairings)*100.0).toFixed(2);
                              var percentageBridgedOfFriendship = ((numBridgedFriendshipPairings/totalNumFriendshipPairings)*100.0).toFixed(2);
                              console.log("% Bridged out of Business Pairings = " + percentageBridgedOfBusiness + "%");
                              console.log("% Bridged out of Love Pairings = " + percentageBridgedOfLove + "%");
                              console.log("% Bridged out of Friendship Pairings = " + percentageBridgedOfFriendship + "%");
                            
                            var numSwipesPerUser = (totalNumSwipes/totalNumberOfUsers).toFixed(2);
                            console.log("# swipes per user = "+numSwipesPerUser);
                            //% of swipes leading to introductions = # of users connected / total number of swipes
                            var percentageSwipesLeadingToIntros = (100.0*(numBridgedFriendshipPairings + numBridgedFriendshipPairings + numBridgedLovePairings)/totalNumSwipes).toFixed(2);
                            console.log("% of swipes leading to introductions = " + percentageSwipesLeadingToIntros + "%");
                                            
                            var percentageOneStatusPairingsBridged = ((numPairingsBridgedWithOneStatus/TotalNumPairingsWithOneStatus)*100.0).toFixed(2);
                            console.log("% of pairings introduced from pairings with one status = "+percentageOneStatusPairingsBridged+"%");
                            var percentageTwoStatusPairingsBridged = ((numPairingsBridgedWithTwoStatuses/TotalNumPairingsWithTwoStatuses)*100.0).toFixed(2);
                            console.log("% of pairings introduced from pairings with Two status = "+percentageTwoStatusPairingsBridged+"%");
                            var percentageNoStatusPairingsBridged = ((numPairingsBridgedWithNoStatuses/TotalNumPairingsWithNoStatuses)*100.0).toFixed(2);
                            console.log("% of pairings introduced from pairings with No status = "+percentageNoStatusPairingsBridged+"%");
                                            
                                                                        
                              
                              },
                              error: function() {
                              console.log("Querying BridgePairings failed in getMainAppMetrics");
                              res.error("Querying BridgePairings failed in getMainAppMetrics");
                              }
                              });
                   
    //3. % introductions conversed per category
                   //% Business messages responded to = # messages with message_type Business and last_single_message undefined / total Business messages
                   //% Love messages responded to = # messages with message_type Love and last_single_message undefined / total Love messages
                   //% Friendship messages responded to = # messages with message_type Love and last_single_message undefined / total Friendship messages
                   var messagesQuery = new Parse.Query("Messages");
                   messagesQuery.limit(10000);
                   messagesQuery.find({
                                            success: function(results){
                                            var totalNumberofMessages = results.length;
                                            console.log("totalNumberofMessages = "+totalNumberofMessages);
                                            
                                            var incrementWhenDone = {count : 0};
                                            
                                            var totalNumBusinessMessages = 0.0;
                                            var totalNumLoveMessages = 0.0;
                                            var totalNumFriendshipMessages = 0.0;
                                            
                                            var numRespondedBusinessMessages = 0.0;
                                            var numRespondedLoveMessages = 0.0;
                                            var numRespondedFriendshipMessages = 0.0;
                                      
                                            var numMessagesWithResponse = 0.0
                                      
                                      
                                            
                                            for (var j = 0; j < results.length; ++j) {
                                            var result = results[j];
                                            
                                            var bridgeType = result.get("message_type");
                                            var lastSingleMessage = result.get("last_single_message");
                                            
                                            if (bridgeType == "Business") {
                                            totalNumBusinessMessages += 1.0;
                                            if (lastSingleMessage != null) {
                                            numRespondedBusinessMessages += 1.0;
                                            numMessagesWithResponse += 1.0;
                                            }
                                            } else if (bridgeType == "Love") {
                                            totalNumLoveMessages += 1.0;
                                            if (lastSingleMessage != null) {
                                            numRespondedLoveMessages += 1.0;
                                            numMessagesWithResponse += 1.0;
                                            }
                                            } else if (bridgeType == "Friendship") {
                                            totalNumFriendshipMessages += 1.0;
                                            if (lastSingleMessage != null) {
                                            numRespondedFriendshipMessages += 1.0;
                                            numMessagesWithResponse += 1.0;
                                            }
                                            }
                                            
                                            }
                                            
                                            /*console.log("numRespondedBusinessMessages = "+numRespondedBusinessMessages);
                                            console.log("totalNumBusinessMessages = " + totalNumBusinessMessages);
                                            console.log("numRespondedLoveMessages = " + numRespondedLoveMessages);
                                            console.log("totalNumLoveMessages = " + totalNumLoveMessages);
                                            console.log("numRespondedFriendshipMessages = " + numRespondedFriendshipMessages);
                                            console.log("totalNumFriendshipMessages = " + totalNumFriendshipMessages);*/
                                            var percentageRespondedBusiness = ((numRespondedBusinessMessages/totalNumBusinessMessages)*100.0).toFixed(2);
                                            var percentageRespondedLove = ((numRespondedLoveMessages/totalNumLoveMessages)*100.0).toFixed(2);
                                            var percentageRespondedFriendship = ((numRespondedFriendshipMessages/totalNumFriendshipMessages)*100.0).toFixed(2);
                                            console.log("% of Business messages that had conversations = " + percentageRespondedBusiness + "%");
                                            console.log("% of Love messages that had conversations = " + percentageRespondedLove + "%");
                                            console.log("% of Friendship messages that had conversations = " + percentageRespondedFriendship + "%");
                                      
                                      
                                            //% introductions responded to = # of messages with last_single_message responded to / total # of messages
                                            var percentageIntrosConversed = ((numMessagesWithResponse / totalNumberofMessages)*100.0).toFixed(2);
                                            console.log("% introductions responded to = " + percentageIntrosConversed + "%");
                                      
                                            },
                                            error: function() {
                                            console.log("Querying BridgePairings failed in getMainAppMetrics");
                                            res.error("Querying BridgePairings failed in getMainAppMetrics");
                                            }
                                            });
                   
                   
    //4. % statuses in each category
                   //% statuses with bridge_type of Business
                   //% statuses with bridge_type of Love
                   //% statuses with bridge_type of Friendship
                   var bridgeStatusQuery = new Parse.Query("BridgeStatus");
                   bridgeStatusQuery.limit(10000);
                   bridgeStatusQuery.find({
                                      success: function(results){
                                      var totalNumberofStatuses = results.length;
                                      console.log("totalNumberofStatuses = "+totalNumberofStatuses);
                                      
                                      var incrementWhenDone = {count : 0};
                                      
                                      var numBusinessStatuses = 0.0;
                                      var numLoveStatuses = 0.0;
                                      var numFriendshipStatuses = 0.0;
                                          
                                      var usersThatHavePosted = [];
                                    
                                      for (var j = 0; j < results.length; ++j) {
                                      var result = results[j];
                                          
                                      var userId = result.get("userId");
                                      if (usersThatHavePosted.includes(userId) == false) {
                                          usersThatHavePosted.push(userId);
                                      }
                                          
                                      var bridgeType = result.get("bridge_type");
                                          
                                      if (bridgeType == "Business") {
                                      numBusinessStatuses += 1.0;
                                      } else if (bridgeType == "Love") {
                                      numLoveStatuses += 1.0;
                                      } else if (bridgeType == "Friendship") {
                                      numFriendshipStatuses += 1.0;
                                      }
                                      
                                      }
                                          
                                    //console.log("usersThatHavePosted - " + usersThatHavePosted);
  
                                      var percentageBusinessStatuses = ((numBusinessStatuses/totalNumberofStatuses)*100.0).toFixed(2);
                                      var percentageLoveStatuses = ((numLoveStatuses/totalNumberofStatuses)*100.0).toFixed(2);
                                      var percentageFriendshipStatuses = ((numFriendshipStatuses/totalNumberofStatuses)*100.0).toFixed(2);
                                      console.log("% of statuses with bridge_type of Business = " + percentageBusinessStatuses + "%");
                                      console.log("% of statuses with bridge_type of Love = " + percentageLoveStatuses + "%");
                                      console.log("% of statuses with bridge_type of Friendship = " + percentageFriendshipStatuses + "%");
                                      // % of users that have posted
                                      var numUsersThatHavePosted = usersThatHavePosted.length;
                                      var percentageUsersThatHavePosted = (100.0*(numUsersThatHavePosted/totalNumberOfUsers)).toFixed(2);
                                      console.log("% of users that have posted statuses = " + percentageUsersThatHavePosted + "%");
                                      // # of posts per posting user
                                      var numPostsPerPostingUser = (totalNumberofStatuses/numUsersThatHavePosted).toFixed(2);
                                      console.log("# of posts per posting user = "+ numPostsPerPostingUser);
                                      },
                                      error: function() {
                                      console.log("Querying BridgeStatus failed in getMainAppMetrics");
                                      res.error("Querying BridgeStatus failed in getMainAppMetrics");
                                      }
                                      });
    //User Introduction Interaction
    //5. # swipes per user = total # of swipes / total number of users
                   //This is performed in the userQuery and printed in the bridgePairingQuery -> this DOES NOT consider when users have revisited
                   
                   
    //6. % of swipes leading to introductions = # of users connected / total number of swipes
                   //This is performed and printed in the bridgePairingQuery
                   
    //7. % of users that clicked revisit or ran out of potential matches = # users that have no more bridge pairings to view or clicked revisit / total number of users
                   //users that have no more bridge pairings = users who's friendlist of pairings all have shown to...
                   //The programming for this began in the userQuery
                   
    //User Post Interaction
    //8. % of users that have posted
                   //This is performed in the BridgeStatusQuery
                   
    //9. # of posts per posting user
                   //This is performed in the BridgeStatusQuery
           
                   
                   
    //10. calculating percentages of successful introduction from matches with 0, 1, and 2 pairings for statuses that have been shown to at least one person
                //% of pairings introduced from pairings with one status = # of pairings with one status introduced / # of pairings with one status
                //% of pairings introduced from pairings that had two statuses
                //% of pairings introduced from  introductions with no statuses
                //These functions are performed in the BridgePairingsQuery

                   
    //User Chat Interaction
    //11. % introductions responded to = # of messages with last_single_message responded to
                   //This is performed in the messages Table
    //12. Avg # of messages sent per responded introduction
                   var bridgeStatusQuery = new Parse.Query("SingleMessages");
                   bridgeStatusQuery.limit(10000);
                   bridgeStatusQuery.find({
                    success: function(results){
                                          var totalSingleMessages = results.length;
                                          var arrayOfUniqueMessageIds = [];
                                          
                                          for (var j = 0; j < results.length; ++j) {
                                          var result = results[j];
                                          var messageId = result.get("message_id");
                                          if (arrayOfUniqueMessageIds.includes(messageId) == false) {
                                            arrayOfUniqueMessageIds.push(messageId);
                                          }
                                          }
                                          
                                          //Avg # of messages sent per responded introduction
                                          var numMessagesWithSingleMessages = arrayOfUniqueMessageIds.length;
                                          var numMessagesSentPerRespondedIntro = ((totalSingleMessages / numMessagesWithSingleMessages).toFixed(2));
                                          console.log("Avg # of messages sent per responded introduction = " + numMessagesSentPerRespondedIntro);

                    },
                    error: function() {
                                          console.log("Querying SingleMessages failed in getMainAppMetrics");
                                          res.error("Querying SingleMessages failed in getMainAppMetrics");
                    }
                    });

                   
                    });


Parse.Cloud.define('addIntroducedUsersToEachothersFriendLists', function(req, res) {
    Parse.Cloud.useMasterKey();
    console.log("addIntroducedUsersToEachothersFriendLists");
    //creating a class with the name _User
    //var UserClass = Parse.Object.extend("_User)");
    //query passing the classname -> which is the name of the table being queried
    //var query = new Parse.Query(UserClass);
    var query = new Parse.Query("_User");
    //queries the table for the id's that include the user's introduced
    var introducedUserIds = [req.params.userObjectId1, req.params.userObjectId2];
    query.containedIn("objectId", introducedUserIds);
    console.log("introducedUserId = " + req.params.userObjectId1);
    query.limit(2);
    query.find({
               //if success will call function with parameter of results
               success:function(results) {
               console.log("length of addIntroducedUsersToEachothersFriendLists query : " + results.length);
               var incrementWhenDone = {count : 0};
               //going through each of the results and deciding which one of the users' name should be updated
               for (var i = 0, len = results.length; i < len; i++) {
               var result = results[i];
               var friendList = result.get("friend_list");
               console.log("result = " + result);
               var userObjectId = result.id;
               console.log(i + " userObjectId - " + userObjectId);
               //console.log(i + " friendlist - " + friendlist);
               var userObjectIdToAdd = "";
               if (userObjectId != req.params.userObjectId1) {
               //result.addUnique("friend_list", req.params.userObjectId2);
               //result.set("friend_list", req.params.userObjectId2);
               userObjectIdToAdd = req.params.userObjectId1;
               console.log("adding to friend_list user2 " + userObjectIdToAdd);
               }
               else {
               //result.addUnique("friend_list", req.params.userObjectId1);
               userObjectIdToAdd = req.params.userObjectId2;
               console.log("adding to friend_list user1 " + userObjectIdToAdd);
               }
               result.addUnique("friend_list", userObjectIdToAdd);
               console.log("addIntroducedUsersToEachothersFriendLists");
               //result.set("friend_list", ["test"]);
               
               result.save(null, {
                           success: function(result){
                           console.log("Saved after adding Introduced Users To Eachothers Friend Lists")
                           incrementWhenDone.count += 1;
                           //once incrementWhenDone get to the length of the results, it is clear the job has completed - this is necessary due to asynchronous execution
                           if (incrementWhenDone.count == results.length) {
                           console.log(" Saved "+ results.length +" id's to friend_lists in User Table");
                           //res.success is the return -> no code will be read after this
                           res.success(" Saved all new friends in Messages Table");
                           }
                           
                           },
                           error: function(result, error){
                           console.log(" Not Saved after adding objectId's to friend_list in User Table")
                           incrementWhenDone.count += 1;
                           if (incrementWhenDone.count == results.length) {
                           console.log(" Not all of  "+ results.length +" friend_list fields in User Table were updated and saved");
                           res.error(" Not all the friend_list were saved");
                           }
                           
                           }
                           });
               //}
               }
               },
               //if error will call function with parameter of error
               error: function(error) {
               console.log("Failed!");
               res.error("Not saved");
               }
               });
    });

Parse.Cloud.define('changeMessagesTableOnNameUpdate', function(req, res) {
                   console.log("changeMessagesTableOnNameUpdate was called");
                   //creating a class with the name Messages
                   var MessagesClass = Parse.Object.extend("Messages");
                   //query passing the classname -> which is the name of the table being queried
                   var query = new Parse.Query(MessagesClass);
                   //queries the table for sender that includes req.user.id
                   query.equalTo("ids_in_message", req.user.id);
                   console.log("req.user.id = " + req.user.id);
                   query.limit(10000);
                   //for query.find, everything is in background
                   query.find({
                              //if success will call function with parameter of results
                              success:function(results) {
                              console.log("length : "+results.length);
                              var incrementWhenDone = {count : 0};
                              //going through each of the results and deciding which one of the users' name should be updated
                              for (var i = 0, len = results.length; i < len; i++) {
                              var result = results[i];
                              var namesInMessage = result.get("names_in_message");
                              var idsInMessage = result.get("ids_in_message");
                              console.log("result = " + result );
                              console.log("namesInMessage = " + namesInMessage);
                              console.log("req.user.name = " + req.user.name);
                              //if (sender == req.user.id) {
                              //the sender's name is sent from the user's phone when the cloud function was called so the cloud code does not have to request the name from Parse and save again
                              for (var j = 0, len = idsInMessage.length; j <len; j++) {
                              console.log("when j = " + j + ", idsInMessage[j] = " + idsInMessage[j]);
                              if (idsInMessage[j] == req.user.id) {
                              console.log("got the users name for id: " + req.user.id + " - it was " + namesInMessage[j]);
                              namesInMessage[j] = req.user.get("name");
                              console.log("the user's name is now " + namesInMessage[j]);
                              }
                              
                              
                              }
                              
                              
                              result.set("names_in_message", namesInMessage);
                              console.log("changedMessagesOnNameUpdate");
                              //}
                              //after making updates to the queried data, you need to save
                              result.save(null, {
                                          success: function(){
                                          console.log("Saved after changing name in Messages field: names_in_message")
                                          incrementWhenDone.count += 1;
                                          //once incrementWhenDone get to the length of the results, it is clear the job has completed - this is necessary due to asynchronous execution
                                          if (incrementWhenDone.count == results.length) {
                                          console.log(" Saved "+ results.length +" name to names_in_message in Messages Table");
                                          //res.success is the return -> no code will be read after this
                                          res.success(" Saved all names to Messages Table");
                                          }
                                          
                                          },
                                          error: function(error){
                                          console.log(" Not Saved after changinging name for Messages Table")
                                          incrementWhenDone.count += 1;
                                          if (incrementWhenDone.count == results.length) {
                                          console.log(" Not all of  "+ results.length +" names_in_messages fields in Messages were saved");
                                          res.error(" Not all the messages were saved");
                                          }
                                          
                                          }
                                          });
                              //}
                              }
                              },
                              //if error will call function with parameter of error
                              error: function(error) {
                              console.log("Failed!");
                              res.error("Not saved");
                              }
                              });
                   
                   });

Parse.Cloud.define('changeSingleMessagesTableOnNameUpdate', function(req, res) {
                   console.log("changeSingleMessagesTableOnNameUpdate was called");
                   //creating a class with the name SingleMessages
                   var SingleMessagesClass = Parse.Object.extend("SingleMessages");
                   //query passing the classname -> which is the name of the table being queried
                   var query = new Parse.Query(SingleMessagesClass);
                   //queries the table for sender that includes req.user.id
                   query.equalTo("sender",req.user.id);
                   query.limit(10000);
                   //for query.find, everything is in background
                   query.find({
                              //if success will call function with parameter of results
                              success:function(results) {
                              console.log("length : "+results.length);
                              var incrementWhenDone = {count : 0};
                              //going through each of the results and deciding which one of the users' name should be updated
                              for (var i = 0, len = results.length; i < len; i++) {
                              var result = results[i];
                              var sender = result.get("sender");
                              console.log("result = " + result );
                              //if (sender == req.user.id) {
                              //the sender's name is sent from the user's phone when the cloud function was called so the cloud code does not have to request the name from Parse and save again
                              result.set("sender_name", req.user.get("name"));
                              console.log("changedSingleMessagesOnNameUpdate");
                              //}
                              //after making updates to the queried data, you need to save
                              result.save(null, {
                                          success: function(){
                                          console.log("Saved after changinging name in SingleMessages field: sneder_name")
                                          incrementWhenDone.count += 1;
                                          //once incrementWhenDone get to the length of the results, it is clear the job has completed - this is necessary due to asynchronous execution
                                          if (incrementWhenDone.count == results.length) {
                                          console.log(" Saved "+ results.length +" name to sender_name in SingleMessages Table");
                                          //res.success is the return -> no code will be read after this
                                          res.success(" Saved all names to SingleMessagesTable");
                                          }
                                          
                                          },
                                          error: function(error){
                                          console.log(" Not Saved after changinging name for SingleMessages Table")
                                          incrementWhenDone.count += 1;
                                          if (incrementWhenDone.count == results.length) {
                                          console.log(" Not all of  "+ results.length +" sender_name fields in SingleMessages were saved");
                                          res.error(" Not all the single messages were saved");
                                          }
                                          
                                          }
                                          });
                              //}
                              }
                              },
                              //if error will call function with parameter of error
                              error: function(error) {
                              console.log("Failed!");
                              res.error("Not saved");
                              }
                              });
                   
                   });

Parse.Cloud.define('changeBridgePairingsOnNameUpdate', function(req, res) {
                   console.log("changeBridgePairingsOnNameUpdate was called");
                   //creating a class with the name BridgePairings
                   var BridgePairingsClass = Parse.Object.extend("BridgePairings");
                   //query passing the classname -> which is the name of the table being queried
                   var query = new Parse.Query(BridgePairingsClass);
                   //queries the table for user_objectIds that includes req.user.id
                   query.equalTo("user_objectIds",req.user.id);
                   query.limit(10000);
                   //for query.find, everything is in background
                   query.find({
                              //if success will call function with parameter of results
                              success:function(results) {
                              console.log("length : "+results.length);
                              var incrementWhenDone = {count : 0};
                              //going through each of the results and deciding which one of the users' name should be updated
                              for (var i = 0, len = results.length; i < len; i++) {
                              var result = results[i];
                              var userObjectIds = result.get("user_objectIds");
                              console.log("result = "+ result + "userObjectIds[0]="+userObjectIds[0] + " & userObjectIds[1]= "+userObjectIds[1]);
                              if (userObjectIds[0] == req.user.id) {
                              //the name is sent from the user's phone when the cloud function was called so the cloud code does not have to request the name from Parse and save again
                              result.set("user1_name", req.user.get("name"));
                              console.log("changeBridgePairingsOnNameUpdate1");
                              }
                              else {
                              result.set("user2_name",req.user.get("name"));
                              console.log("changeBridgePairingsOnNameUpdate2");
                              }
                              //after making updates to the queried data, you need to save
                              result.save(null, {
                                          success: function(bridgePairing){
                                          console.log("Saved after changinging name")
                                          incrementWhenDone.count += 1;
                                          //once incrementWhenDone get to the length of the results, it is clear the job has completed - this is necessary due to asynchronous execution
                                          if (incrementWhenDone.count == results.length) {
                                          console.log(" Saved "+ results.length +" pairings");
                                          //res.success is the return -> no code will be read after this
                                          res.success(" Saved all pairings");
                                          }
                                          
                                          },
                                          error: function(bridgePairing, error){
                                          console.log(" Not Saved after changinging status")
                                          incrementWhenDone.count += 1;
                                          if (incrementWhenDone.count == results.length) {
                                          console.log(" Not all of  "+ results.length +" pairings were saved");
                                          res.error(" Not all the pairings were saved");
                                          }
                                          
                                          }
                                          });
                              //}
                              }
                              },
                              //if error will call function with parameter of error
                              error: function(error) {
                              console.log("Failed!");
                              res.error("Not saved");
                              }
                              });
                   
                   });
Parse.Cloud.define('changeBridgePairingsOnProfilePictureUpdate', function(req, res) {
                   console.log("changeBridgePairingsOnProfilePictureUpdate was called");
                   //creating a class with the name BridgePairings
                   var BridgePairingsClass = Parse.Object.extend("BridgePairings");
                   //query passing the classname -> which is the name of the table being queried
                   var query = new Parse.Query(BridgePairingsClass);
                   //queries the table for user_objectIds that includes req.user.id
                   query.equalTo("user_objectIds",req.user.id);
                   query.limit(10000);
                   //for query.find, everything is in background
                   query.find({
                              //if success will call function with parameter of results
                              success:function(results) {
                              console.log("length : "+results.length);
                              var incrementWhenDone = {count : 0};
                              //going through each of the results and deciding which one of the users' profile picture should be updated
                              for (var i = 0, len = results.length; i < len; i++) {
                              var result = results[i];
                              var userObjectIds = result.get("user_objectIds");
                              console.log("result = "+ result + "userObjectIds[0]="+userObjectIds[0] + " & userObjectIds[1]= "+userObjectIds[1]);
                              //if( userObjectIds.length > 0 ){
                              if (userObjectIds[0] == req.user.id) {
                              //the profile picture was sent from the user's phone when the cloud function was called so the cloud code does not have to request the profile picture from Parse and save again
                              result.set("user1_profile_picture", req.user.get("profile_picture"));
                              console.log("changeBridgePairingsOnProfilePictureUpdate1");
                              }
                              else {
                              result.set("user2_profile_picture",req.user.get("profile_picture"));
                              console.log("changeBridgePairingsOnProfilePictureUpdate2");
                              }
                              //after making updates to the queried data, you need to save
                              result.save(null, {
                                          success: function(bridgePairing){
                                          console.log("Saved after changinging profile picture")
                                          incrementWhenDone.count += 1;
                                          //once incrementWhenDone get to the length of the results, it is clear the job has completed - this is necessary due to asynchronous execution
                                          if (incrementWhenDone.count == results.length) {
                                          console.log(" Saved "+ results.length +" pairings");
                                          //res.success is the return -> no code will be read after this
                                          res.success(" Saved all pairings");
                                          }
                                          
                                          },
                                          error: function(bridgePairing, error){
                                          console.log(" Not Saved after changinging status")
                                          incrementWhenDone.count += 1;
                                          if (incrementWhenDone.count == results.length) {
                                          console.log(" Not all of  "+ results.length +" pairings were saved");
                                          res.error(" Not all the pairings were saved");
                                          }
                                          
                                          }
                                          });
                              //}
                              }
                              },
                              //if error will call function with parameter of error
                              error: function(error) {
                              console.log("Failed!");
                              res.error("Not saved");
                              }
                              });
                   
                   });
Parse.Cloud.define('changeBridgePairingsOnStatusUpdate', function(req, res) {
                   console.log("changeBridgePairingsOnStatusUpdate was called");
                   //creating a class with the name BridgePairings
                   var BridgePairingsClass = Parse.Object.extend("BridgePairings");
                   //query passing the classname -> which is the name of the table being queried
                   var query = new Parse.Query(BridgePairingsClass);
                   //queries the table for user_objectIds that includes req.user.id
                   query.equalTo("user_objectIds",req.user.id);
                   query.equalTo("bridge_type",req.params.bridgeType);
                   query.limit(10000);
                   //for query.find, everything is in background
                   query.find({
                              //if success will call function with parameter of results
                             success:function(results) {
                              console.log("length : "+results.length);
                             var incrementWhenDone = {count : 0};
                              //going through each of the results and deciding which one of the users' status should be updated
                             for (var i = 0, len = results.length; i < len; i++) {
                              //Randomly update a few statuses taken out so it updates all of the statuses
                             //if (Math.floor(Math.random()*2) == 1){
                             var result = results[i];
                             var userObjectIds = result.get("user_objectIds");
                             console.log("result = "+ result + "userObjectIds[0]="+userObjectIds[0] + " & userObjectIds[1]= "+userObjectIds[1]);
                             if( userObjectIds.length > 0 ){
                             if (userObjectIds[0] == req.user.id) {
                              //the status was sent from the user's phone when the cloud function was called so the cloud code does not have to request the status from Parse and save again
                              result.set("user1_bridge_status", req.params.status);
                                console.log("1");
                             }
                             else {
                              result.set("user2_bridge_status",req.params.status);
                                console.log("2");
                             }
                              //after making updates to the queried data, you need to save
                             result.save(null, {
                                                success: function(bridgePairing){
                                                console.log("Saved after changinging status")
                                                incrementWhenDone.count += 1;
                                                //once incrementWhenDone get to the length of the results, it is clear the job has completed - this is necessary due to asynchronous execution
                                                if (incrementWhenDone.count == results.length) {
                                                console.log(" Saved "+ results.length +" pairings");
                                                //res.success is the return -> no code will be read after this
                                                res.success(" Saved all pairings");
                                                }

                                                },
                                                error: function(bridgePairing, error){
                                                console.log(" Not Saved after changinging status")
                                                incrementWhenDone.count += 1;
                                                if (incrementWhenDone.count == results.length) {
                                                console.log(" Not all of  "+ results.length +" pairings were saved");
                                                res.error(" Not all the pairings were saved");
                                                }

                                                }
                                         });
                              }
                              else {
                              console.log("Randomly selected not to update this one");
                              incrementWhenDone.count += 1;
                              if (incrementWhenDone.count == results.length) {
                              console.log(" Saved "+ results.length +" pairings after some randomizations");
                              res.success(" Saved all pairings");
                              }
                              }
                             //}
                             }
                             },
                              //if error will call function with parameter of error
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
                   query.limit(10000);
                   query.find({
                              success:function(results) {
                              var usersNotToPairWith = [req.user.id];
                              var shownToForPairsNotCheckedOut = {};
                              console.log(results.length + " entries have the current user as a better half");
                              for (var i = 0, len = results.length; i < len; i++) {
                              var result = results[i];
                              if (result.get("checked_out") == true) {
                              var userObjectIds = result.get("user_objectIds");
                              if (userObjectIds[0] == req.user.id) {
                              usersNotToPairWith.push(userObjectIds[1]);
                              }
                              else {
                              usersNotToPairWith.push(userObjectIds[0]);
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
                              result.destroy({});
                              }
                              }
                              console.log("Done creating usersNotToPairWith, shownToForPairsNotCheckedOut");
                              recreatePairings(req, usersNotToPairWith, shownToForPairsNotCheckedOut, res);
                              },
                              error: function(error) {
                              console.log("Failed!");
                              res.error("Not Saved");
                              }
                              });
                   });
Parse.Cloud.define('revitalizeMyPairs', function(req, res) {
                   //updating and retriving previously viewed bridge pairings
                   var BridgePairingsClass = Parse.Object.extend("BridgePairings");
                   var query = new Parse.Query(BridgePairingsClass);
                   query.equalTo("shown_to",req.user.id);
                   query.equalTo("checked_out",false);
                   query.limit(10000);
                   query.find({
                              success:function(results) {
                              var incrementWhenDone = {count : 0};
                              console.log("revitalizeMyPairs "+ results.length)
                              for (var i = 0, len = results.length; i < len; i++) {
                              var result = results[i];
                              var shownTo = result.get("shown_to");
                              var shownToWithoutCurrentUser = [];
                              var x = "";
                              for (var j = 0, len2 = shownTo.length; j < len2; j++) {
                                x = shownTo[j];
                                if (x != req.user.id) {
                                    shownToWithoutCurrentUser.push(x);
                                }
                              }

                              result.set("shown_to", shownToWithoutCurrentUser);
                              result.save(null, {
                                          success: function(bridgePairing){
                                          console.log("Saved after revitalizing")
                                          incrementWhenDone.count += 1;
                                          if (incrementWhenDone.count == results.length) {
                                          console.log(" Saved "+ results.length +" pairings after revitalizing");
                                          res.success(" Saved all pairings after revitalizing");
                                          }
                                          
                                          },
                                          error: function(bridgePairing, error){
                                          console.log(" Not Saved after revitalizing")
                                          incrementWhenDone.count += 1;
                                          if (incrementWhenDone.count == results.length) {
                                          console.log(" Not all of  "+ results.length +" pairings were saved after revitalizing");
                                          res.error(" Not all the pairings were saved after revitalizing");
                                          }

                                          }
                                          });
                              }
                              if (incrementWhenDone.count == 0 && results.length == 0) {
                              incrementWhenDone.count += 1;
                              res.success("There were no potential matches to revitalize")
                              console.log("There were no potential matches to revitalize")
                              }
                              },
                              error: function(error) {
                              console.log("Failed!");
                              res.error("Failed");
                              }
                              });
                   });
function createNewPairing(req, user, status1, status2, bridgeType, shownToForPairsNotCheckedOut, incrementWhenDone, noOfPairsWithCommonInterests, res){
    console.log("createNewPairing stepped in with "+status1+", "+status2+", "+bridgeType);
    console.log(user);
    var BridgePairingsClass = Parse.Object.extend("BridgePairings");
    var bridgePairing = new BridgePairingsClass();
    console.log("name1: "+user.get("name"));
    console.log("name2: "+req.user.get("name"));
    bridgePairing.set("user1_name",user.get("name"));
    bridgePairing.set("user2_name",req.user.get("name"));
    
    bridgePairing.set("user1_bridge_status",status1);
    bridgePairing.set("user2_bridge_status",status2);
    
    //bridgePairing.set("user1_profile_picture",user.get("profile_picture"));
    //bridgePairing.set("user2_profile_picture",req.user.get("profile_picture"));
    bridgePairing.set("user1_profile_picture_url",user.get("profile_picture_url"));
    bridgePairing.set("user2_profile_picture_url",req.user.get("profile_picture_url"));
    
    bridgePairing.set("bridge_type",bridgeType);
    bridgePairing.set("user1_city",user.get("city"));
    bridgePairing.set("user2_city",req.user.get("city"));
    
    bridgePairing.set("user_locations",[req.user.get("location"), user.get("location")]);
    bridgePairing.set("user_objectIds",[user.id, req.user.id]);
    bridgePairing.set("user_objectId1",user.id);
    bridgePairing.set("user_objectId2",req.user.id);
    console.log("after user_objectIds is set");
    console.log(typeof req.user.get("location"));
    if (req.user.get("location") !== undefined && user.get("location") !== undefined){
        console.log("both users had locations, so the distance score was set");
        bridgePairing.set("score", getDistanceScore(req.user.get("location"), user.get("location") ));
    }
    else {
        console.log("at least one of the two users did not have a location, so the distance score was set to 0");
        bridgePairing.set("score", 0);
    }
    console.log("after score is set");
    bridgePairing.set("checked_out",false);
    if (user.id in shownToForPairsNotCheckedOut) {
        bridgePairing.set("shown_to",shownToForPairsNotCheckedOut[user.id]);
    }
    else {
        bridgePairing.set("shown_to",[]);
    }
    bridgePairing.save(null, {
                       success: function(bridgePairing){
                       console.log(req.user.get("name") +"  "+user.get("name") +" saved a pairing");
                       incrementWhenDone.count += 1;
                       //incrementWhenDone is not a global variable, but instead is passed in as a parameter to stay specific to different users
                       if (incrementWhenDone.count == noOfPairsWithCommonInterests) {
                       console.log("Saved "+ noOfPairsWithCommonInterests +"pairings");
                       res.success("Saved all pairings");
                       }
                       
                       },
                       error: function(bridgePairing, error){
                       console.log("could not save a pairing");
                       incrementWhenDone.count += 1;
                       if (incrementWhenDone.count == noOfPairsWithCommonInterests) {
                       console.log("Not Saved all of "+ noOfPairsWithCommonInterests +" pairings");
                       res.error("Did not save all pairings");
                       }

                       }
                       });

}
function recreatePairings(req, usersNotToPairWith, shownToForPairsNotCheckedOut, res){
    var query = new Parse.Query("_User");
    console.log("recreatePairings was called");
    var skipIds = usersNotToPairWith.concat(req.user.get("friend_list"));
    query.notContainedIn("objectId",skipIds);
    query.limit(10000);
    var count = 0;
    query.find({
               success: function(results){
               count += results.length;
               console.log("query.find "+count);
               
               var incrementWhenDone = {count : 0};
               var noOfPairsWithCommonInterests = 0;
               
               for (var j = 0; j < results.length; ++j) {
               if (haveCommonInterests(req, results[j] ) == true) {
               noOfPairsWithCommonInterests += 1;
               }
               }
               
               for (var i = 0; i < results.length; ++i) {
               if (haveCommonInterests(req, results[i] ) == true) {
               console.log(req.user.id + "  "+ results[i].id +" haveCommonInterests");
               decideBridgeStatusAndTypeAndCreatePairing(req, results[i], shownToForPairsNotCheckedOut, incrementWhenDone, noOfPairsWithCommonInterests, res);
               }
               }
               if (noOfPairsWithCommonInterests == 0) {
               console.log("None of the possible pairs have common interests");
               res.success("None of the possible pairs have common interests");
               
               }
               else {
               console.log("Some of the possible Pairs have common interests");
               res.success("Some of the possible Pairs have common interests")
               }
               },
               error: function() {
               console.log("Querying _User failed in recreatePairings");
               res.error("Querying _User failed in recreatePairings");
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
                                   res.success('Push success');
                                   },
                                   error: function(e) {
                                   console.log("error: Parse.Push.send code: " + e.code + " msg: " + e.message);
                                   res.error("Push failed");
                                   },
                                   useMasterKey: true
                                   });

                   
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

function haveCommonInterests(req, user) {
    var userInterestedInBusiness = user.get("interested_in_business");
    var userInterestedInLove = user.get("interested_in_love");
    var userInterestedInFriendship = user.get("interested_in_friendship");
    var meInterestedInBusiness = req.user.get("interested_in_business");
    var meInterestedInLove = req.user.get("interested_in_love");
    var meInterestedInFriendship = req.user.get("interested_in_friendship");
//    console.log("interestedInBusiness - "+meInterestedInBusiness);
//    console.log("interestedInLove - "+meInterestedInLove);
//    console.log("interestedInFriendship - "+meInterestedInFriendship);
    var commonInterest = false;
    if (userInterestedInBusiness !== 'undefined' && meInterestedInBusiness !== 'undefined' && userInterestedInBusiness == true && meInterestedInBusiness == true) {
//        console.log("userInterestedInBusiness");
        commonInterest = true;
    }
    if (userInterestedInLove !== 'undefined' && meInterestedInLove !== 'undefined' && userInterestedInLove == true && meInterestedInLove == true) {
//        console.log("userinterestedInLove");
        if (areCompatible(req.user, user)) {
        commonInterest = true;
        }
    }
    if (userInterestedInFriendship !== 'undefined' && meInterestedInFriendship !== 'undefined' && userInterestedInFriendship == true && meInterestedInFriendship == true) {
//        console.log("userinterestedInFriendship");
        commonInterest = true;
    }
    //console.log("userinterestedInLove");
    return commonInterest;
}
function callBack(noOfBusinessStatuses1, noOfLoveStatuses1, noOfFriendshipStatuses1,noOfBusinessStatuses2, noOfLoveStatuses2, noOfFriendshipStatuses2, allDone, req, user, shownToForPairsNotCheckedOut, incrementWhenDone, noOfPairsWithCommonInterests, res){
    console.log("callBack stepped in");
    if (allDone == 3) {
        console.log("callBack stepped in and allDone is 3 "+ noOfBusinessStatuses1 +", "+noOfLoveStatuses1+", "+noOfFriendshipStatuses1+ ", "+ noOfBusinessStatuses2 +", "+noOfLoveStatuses2+", "+noOfFriendshipStatuses2);
        var bridgeType = "Business";
        var status1 = "";
        var status2 = "";
        var noOfBusinessStatuses = noOfBusinessStatuses1+noOfBusinessStatuses2
        var noOfLoveStatuses = noOfLoveStatuses1+noOfLoveStatuses2
        var noOfFriendshipStatuses = noOfFriendshipStatuses1+noOfFriendshipStatuses2
        
        var maxStatuses = noOfBusinessStatuses;
        var maxStatuses1 = noOfBusinessStatuses1;
        var maxStatuses2 = noOfBusinessStatuses2;
         if (noOfLoveStatuses > maxStatuses) {
            maxStatuses = noOfLoveStatuses;
            maxStatuses1 = noOfLoveStatuses1;
            maxStatuses2 = noOfLoveStatuses2;
            bridgeType = "Love";
        }
        if (noOfFriendshipStatuses > maxStatuses) {
            maxStatuses = noOfFriendshipStatuses;
            maxStatuses1 = noOfFriendshipStatuses1;
            maxStatuses2 = noOfFriendshipStatuses2;
            bridgeType = "Friendship";
        }
        //this means that both users were interested in something, but that they have 0 statuses
        if (maxStatuses == 2) {
            console.log("maxStatuses is 2");
            createNewPairing(req, user, status1, status2, bridgeType, shownToForPairsNotCheckedOut, incrementWhenDone, noOfPairsWithCommonInterests, res);
        }
        else if (maxStatuses1 == 1) {
            console.log("maxStatuses1 is 1");
            var query = new Parse.Query("BridgeStatus");
            query.descending("createdAt");
            query.limit(1);
            query.equalTo("userId",req.user.id);
            query.equalTo("bridge_type",bridgeType);
            query.first({
                         success: function(result) {
                         status2 = result.get("bridge_status");
                         console.log("call Back success query 0");
                         createNewPairing(req, user, status1, status2, bridgeType, shownToForPairsNotCheckedOut, incrementWhenDone, noOfPairsWithCommonInterests, res);
                         },
                         error: function(error) {
                         console.log("call Back error query 0");
                         createNewPairing(req, user, status1, status2, bridgeType, shownToForPairsNotCheckedOut, incrementWhenDone, noOfPairsWithCommonInterests, res);
                         
                         }
                         });

            
        }
        else if (maxStatuses2 == 1) {
            console.log("maxStatuses2 is 1");
            var query = new Parse.Query("BridgeStatus");
            query.descending("createdAt");
            query.limit(1);
            query.equalTo("userId",user.id);
            query.equalTo("bridge_type",bridgeType);
            query.first({
                        success: function(result) {
                        status1 = result.get("bridge_status");
                        console.log("call Back success query 00");
                        createNewPairing(req, user, status1, status2, bridgeType, shownToForPairsNotCheckedOut, incrementWhenDone, noOfPairsWithCommonInterests, res);
                        },
                        error: function(error) {
                        console.log("call Back error query 00");
                        createNewPairing(req, user, status1, status2, bridgeType, shownToForPairsNotCheckedOut, incrementWhenDone, noOfPairsWithCommonInterests, res);
                        
                        }
                        });

            
        }
        else {
        var query = new Parse.Query("BridgeStatus");
        query.descending("createdAt");
        query.limit(1);
        query.equalTo("userId",user.id);
        query.equalTo("bridge_type",bridgeType);
        query.first({
                    success: function(result1) {
                    status1 = result1.get("bridge_status");
                    var query2 = new Parse.Query("BridgeStatus");
                    query2.descending("createdAt");
                    query2.limit(1);
                    query2.equalTo("userId",req.user.id);
                    query2.equalTo("bridge_type",bridgeType);
                    query2.first({
                                success: function(result2) {
                                status2 = result2.get("bridge_status");
                                console.log("call Back success query 2");
                                createNewPairing(req, user, status1, status2, bridgeType, shownToForPairsNotCheckedOut, incrementWhenDone, noOfPairsWithCommonInterests, res);
                                },
                                error: function(error) {
                                console.log("call Back error query 2");
                                createNewPairing(req, user, status1, status2, bridgeType, shownToForPairsNotCheckedOut, incrementWhenDone, noOfPairsWithCommonInterests, res);
                                
                                }
                                });

                    },
                    error: function(error) {
                    console.log("call Back error query 1");
                    createNewPairing(req, user, status1, status2, bridgeType, shownToForPairsNotCheckedOut, incrementWhenDone, noOfPairsWithCommonInterests, res);
                    
                    }
                    });
    }
        
    }
}
function decideBridgeStatusAndTypeAndCreatePairing(req, user, shownToForPairsNotCheckedOut, incrementWhenDone, noOfPairsWithCommonInterests, res) {
    // future updates includes comparisons on the basis of recent statuses. It's for this specific reason that I'm choosing to query here instead
    // of having a field associated with every user indicating the no. of statuses of each type. I hope this will give future developers immense
    // flexibility to decide the bridge pairings statuses and type. Always remember the cloud code has a timeout and beware of the time your functions take.cIgAr - 08/25
    console.log(" inside getBridgeStatusAndType");
    
    var userInterestedInBusiness = user.get("interested_in_business");
    var userInterestedInLove = user.get("interested_in_love");
    var userInterestedInFriendship = user.get("interested_in_friendship");
    var meInterestedInBusiness = req.user.get("interested_in_business");
    var meInterestedInLove = req.user.get("interested_in_love");
    var meInterestedInFriendship = req.user.get("interested_in_friendship");
    
    var bridgeStatus1 = "No Bridge Status";
    var bridgeStatus2 = "No Bridge Status";
    var bridgeType = "";
    
    var noOfBusinessStatuses1 = 0;
    var noOfLoveStatuses1 = 0;
    var noOfFriendshipStatuses1 = 0;
    var noOfBusinessStatuses2 = 0;
    var noOfLoveStatuses2 = 0;
    var noOfFriendshipStatuses2 = 0;
    //allDone keeps track of when all three interest checks have finished so as to know when the asynchronous execution has completed
    var allDone = 0;
    if (userInterestedInBusiness !== 'undefined' && meInterestedInBusiness !== 'undefined' && userInterestedInBusiness == true && meInterestedInBusiness == true) {
        noOfBusinessStatuses1 = 1;
        noOfBusinessStatuses2 = 1;
        // adding 1 to indicate to callback that they are interested in Business incase of no statuses
        var query = new Parse.Query("BridgeStatus");
        query.descending("createdAt");
        query.equalTo("userId",user.id);
        query.equalTo("bridge_type","Business");
        query.count({
                    success: function(count1) {
                    noOfBusinessStatuses1 += count1;
                    var query2 = new Parse.Query("BridgeStatus");
                    query2.descending("createdAt");
                    query2.equalTo("userId",req.user.id);
                    query2.equalTo("bridge_type","Business");
                    query2.count({
                                success: function(count2) {
                                noOfBusinessStatuses2 += count2;
                                allDone += 1;
                                console.log("1");
                                 //global variables not used so that the callbacks will be different entities for different users
                                callBack(noOfBusinessStatuses1, noOfLoveStatuses1, noOfFriendshipStatuses1,noOfBusinessStatuses2, noOfLoveStatuses2, noOfFriendshipStatuses2, allDone, req, user, shownToForPairsNotCheckedOut, incrementWhenDone, noOfPairsWithCommonInterests, res);
                                },
                                error: function(error) {
                                 allDone += 1;
                                 console.log("2");
                                 callBack(noOfBusinessStatuses1, noOfLoveStatuses1, noOfFriendshipStatuses1,noOfBusinessStatuses2, noOfLoveStatuses2, noOfFriendshipStatuses2, allDone, req, user, shownToForPairsNotCheckedOut, incrementWhenDone, noOfPairsWithCommonInterests, res);
                                }
                                
                                });
                    },
                    error: function(error) {
                    allDone += 1;
                    console.log("3");
                    callBack(noOfBusinessStatuses1, noOfLoveStatuses1, noOfFriendshipStatuses1,noOfBusinessStatuses2, noOfLoveStatuses2, noOfFriendshipStatuses2, allDone, req, user, shownToForPairsNotCheckedOut, incrementWhenDone, noOfPairsWithCommonInterests, res);

                    }

                    });
        }
    else {
        allDone += 1;
        console.log("Both not interested in business");
        callBack(noOfBusinessStatuses1, noOfLoveStatuses1, noOfFriendshipStatuses1,noOfBusinessStatuses2, noOfLoveStatuses2, noOfFriendshipStatuses2, allDone, req, user, shownToForPairsNotCheckedOut, incrementWhenDone, noOfPairsWithCommonInterests, res);
        
    }
    if (userInterestedInLove !== 'undefined' && meInterestedInLove !== 'undefined' && userInterestedInLove == true && meInterestedInLove == true && areCompatible(req.user, user)) {
        noOfLoveStatuses1 = 1;
        noOfLoveStatuses2 = 1;
        // adding 1 to indicate to callback that they are interested in Love incase of no statuses
        var query = new Parse.Query("BridgeStatus");
        query.descending("createdAt");
        query.equalTo("bridge_type","Love");
        query.equalTo("userId",user.id);
        query.count({
                    success: function(count1) {
                    noOfLoveStatuses1 += count1;
                    var query2 = new Parse.Query("BridgeStatus");
                    query2.descending("createdAt");
                    query2.equalTo("userId",req.user.id);
                    query2.equalTo("bridge_type","Love");
                    query2.count({
                                 success: function(count2) {
                                 noOfLoveStatuses2 += count2;
                                 allDone += 1;
                                 console.log("4");
                                 console.log("No. of love statuses =" + noOfLoveStatuses1+noOfLoveStatuses2 );
                                 callBack(noOfBusinessStatuses1, noOfLoveStatuses1, noOfFriendshipStatuses1,noOfBusinessStatuses2, noOfLoveStatuses2, noOfFriendshipStatuses2, allDone, req, user, shownToForPairsNotCheckedOut, incrementWhenDone, noOfPairsWithCommonInterests, res);
                                 },
                                 error: function(error) {
                                    allDone += 1;
                                    console.log("5");
                                    callBack(noOfBusinessStatuses1, noOfLoveStatuses1, noOfFriendshipStatuses1,noOfBusinessStatuses2, noOfLoveStatuses2, noOfFriendshipStatuses2, allDone, req, user, shownToForPairsNotCheckedOut, incrementWhenDone, noOfPairsWithCommonInterests, res);
                                 }
                                 
                                 });
                    },
                    error: function(error) {
                        allDone += 1;
                        console.log("6");
                        callBack(noOfBusinessStatuses1, noOfLoveStatuses1, noOfFriendshipStatuses1,noOfBusinessStatuses2, noOfLoveStatuses2, noOfFriendshipStatuses2, allDone, req, user, shownToForPairsNotCheckedOut, incrementWhenDone, noOfPairsWithCommonInterests, res);
                    }
                    });
    }
    else {
        allDone += 1;
        console.log("Both not interested in Love");
        callBack(noOfBusinessStatuses1, noOfLoveStatuses1, noOfFriendshipStatuses1,noOfBusinessStatuses2, noOfLoveStatuses2, noOfFriendshipStatuses2, allDone, req, user, shownToForPairsNotCheckedOut, incrementWhenDone, noOfPairsWithCommonInterests, res);
        
    }

    if (userInterestedInFriendship !== 'undefined' && meInterestedInFriendship !== 'undefined' && userInterestedInFriendship == true && meInterestedInFriendship == true) {
        noOfFriendshipStatuses1 = 1;
        noOfFriendshipStatuses2 = 1;
        // adding 1 to indicate to callback that they are interested in Friendship incase of no statuses
        var query = new Parse.Query("BridgeStatus");
        query.descending("createdAt");
        query.equalTo("userId",user.id);
        query.equalTo("bridge_type","Friendship");
        query.count({
                    success: function(count1) {
                    noOfFriendshipStatuses1 += count1;
                    var query2 = new Parse.Query("BridgeStatus");
                    query2.descending("createdAt");
                    query2.equalTo("userId",req.user.id);
                    query2.equalTo("bridge_type","Friendship");
                    query2.count({
                                 success: function(count2) {
                                 noOfFriendshipStatuses2 += count2;
                                 allDone += 1;
                                 console.log("7 "+noOfFriendshipStatuses1+ ", "+noOfFriendshipStatuses2);
                                 callBack(noOfBusinessStatuses1, noOfLoveStatuses1, noOfFriendshipStatuses1,noOfBusinessStatuses2, noOfLoveStatuses2, noOfFriendshipStatuses2, allDone, req, user, shownToForPairsNotCheckedOut, incrementWhenDone, noOfPairsWithCommonInterests, res);
                                 },
                                 error: function(error) {
                                    allDone += 1;
                                    console.log("8");
                                    callBack(noOfBusinessStatuses1, noOfLoveStatuses1, noOfFriendshipStatuses1,noOfBusinessStatuses2, noOfLoveStatuses2, noOfFriendshipStatuses2, allDone, req, user, shownToForPairsNotCheckedOut, incrementWhenDone, noOfPairsWithCommonInterests, res);
                                 }
                                 
                                 });
                    },
                    error: function(error) {
                        allDone += 1;
                        console.log("9");
                        callBack(noOfBusinessStatuses1, noOfLoveStatuses1, noOfFriendshipStatuses1,noOfBusinessStatuses2, noOfLoveStatuses2, noOfFriendshipStatuses2, allDone, req, user, shownToForPairsNotCheckedOut, incrementWhenDone, noOfPairsWithCommonInterests, res);
                    }
                    });
    }
    else {
        allDone += 1;
        console.log("Both not interested in Friendship");
        callBack(noOfBusinessStatuses1, noOfLoveStatuses1, noOfFriendshipStatuses1,noOfBusinessStatuses2, noOfLoveStatuses2, noOfFriendshipStatuses2, allDone, req, user, shownToForPairsNotCheckedOut, incrementWhenDone, noOfPairsWithCommonInterests, res);
        
    }

    
//    while (allDone < 1) {
//        //console.log(" stuck at allDone < 1");
//    }
//    console.log(" getting out of getBridgeStatusAndType");
//    if (bridgeType != "" && maxQueriesReturned > 0 ) {
//        var query = new Parse.Query("BridgeStatus");
//        query.descending("createdAt");
//        query.equalTo("userId",user.id);
//        query.equalTo("bridge_type",bridgeType);
//        query.first({
//                    success: function(result) {
//                        bridgeStatus1 = result["bridge_status"]
//                        var query2 = new Parse.Query("BridgeStatus");
//                        query2.descending("createdAt");
//                        query2.equalTo("userId",req.user.id);
//                        query2.equalTo("bridge_type",bridgeType);
//                        query2.first({
//                                success: function(result) {
//                                bridgeStatus2 = result["bridge_status"];
//                                allDone += 1;
//                                console.log("11");
//                                },
//                                error: function(error) {
//                                allDone += 1;
//                                console.log("12");
//                                }
//                                });
//
//                    },
//                    error: function(error) {
//                    allDone += 1;
//                    }
//                    });
//        while (allDone < 2) {
//            
//        }
//        return [bridgeStatus1,bridgeStatus2, bridgeType];
//    }
//    else{
//    return [bridgeStatus1,bridgeStatus2, bridgeType];
 //   }

}
function areCompatible(user1, user2) {
    var lovePreference1 = user1.get("interested_in");
    var lovePreference2 = user2.get("gender");
    var lovePreference3 = user1.get("gender");
    var lovePreference4 = user2.get("interested_in");

    if (lovePreference1 == lovePreference2 && lovePreference3 == lovePreference4) {
        return true;
    }
    else {
        return false;
    }
    
}

//08/24/16 scoring algorithm for which pairs should be presented first
function getDistanceScore(distance1, distance2) {
    console.log("getDistanceScore stepped in - "+ distance1 + " " + distance2);
    if (("latitude" in distance1) && ("latitude" in distance2) && ("longitude" in distance1) && ("longitude" in distance2)) {
        console.log(distance1["latitude"]+","+distance1["longitude"]+","+distance2["latitude"]+","+distance2["longitude"]);
        var x = distance1["latitude"] - distance2["latitude"];
        var y = distance1["longitude"] - distance2["longitude"];
        //pythagorean theorem to find the distance between the two locations
        return (Math.sqrt(x*x + y*y) );
    }
    else {
        console.log("Locations have no latitude and longitude");
        return 0;
    }
}

Parse.Cloud.define('updateBridgePairingsTable', function(req, res) {
                   var query = new Parse.Query("_User");
                   console.log("updateBridgePairingsTable was called");
                   // get only those user who are not friends
                   var friendListAndSelf = req.user.get("friend_list");
                   friendListAndSelf.push(req.user.id);
                   console.log(req.user.id);
                   console.log(friendListAndSelf);
                   query.notContainedIn("objectId",friendListAndSelf);
                   var count = 0;
                   query.find({
                              success: function(results){
                              count += results.length;
                              console.log("query.find "+count);
                              
                              var incrementWhenDone = {count : 0};
                              var noOfPairsWithCommonInterests = 0;
                              
                              for (var j = 0; j < results.length; ++j) {
                              if (haveCommonInterests(req, results[j] ) == true) {
                              noOfPairsWithCommonInterests += 1;
                              }
                              }
                              
                              for (var i = 0; i < results.length; ++i) {
                              if (haveCommonInterests(req, results[i] ) == true) {
                              console.log("haveCommonInterests");
                              decideBridgeStatusAndTypeAndCreatePairing(req, results[i], {}, incrementWhenDone, noOfPairsWithCommonInterests, res);
                              }
                              }
                              if (noOfPairsWithCommonInterests == 0) {
                              console.log("None of the possible pairs have common interests");
                              res.success("None of the possible pairs have common interests");
                              
                              }

                              },
                              error: function() {
                              count -= 1;
                              res.error("error");
                              }
                              });
                   
                   });



/*Parse.Cloud.define("deleteBridgePairings", function(request, status) {
 
 var BridgePairingsClass = Parse.Object.extend("BridgePairings");
 var query = new Parse.Query(BridgePairingsClass);
 query.notEqualTo("user1_name","Blake Takita");
 query.limit(10000)
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
 
 });*/
/*Parse.Cloud.define('changeMessagesTableOnNameUpdate', function(req, res) {
 console.log("changeBridgePairingsOnNameUpdate was called");
 //creating a class with the name BridgePairings
 var MessagesClass = Parse.Object.extend("Messages");
 //query passing the classname -> which is the name of the table being queried
 var query = new Parse.Query(MessagesClass);
 //queries the table for user_objectIds that includes req.user.id
 query.includes("ids_in_message", req.user.id)
 query.limit(10000);
 //for query.find, everything is in background
 query.find({
 //if success will call function with parameter of results
 success:function(results) {
 console.log("length : "+results.length);
 var incrementWhenDone = {count : 0};
 //going through each of the results and deciding which one of the users' name should be updated
 for (var i = 0, len = results.length; i < len; i++) {
 var result = results[i];
 var userObjectIds = result.get("user_objectIds");
 console.log("result = "+ result + "userObjectIds[0]="+userObjectIds[0] + " & userObjectIds[1]= "+userObjectIds[1]);
 if (userObjectIds[0] == req.user.id) {
 //the name is sent from the user's phone when the cloud function was called so the cloud code does not have to request the name from Parse and save again
 var namesInMessage = result.get("names_in_message");
 //checks through namesInMessage to find the user's name and replaces it with the new name
 for (var j = 0, len = namesInMessage.length; j < len; j++) {
 if (namesInMessage[j] == req.user.name) {
 namesInMessage[j] = req.user.user1_name
 break
 }
 }
 
 result.set(namesInMessage, result.get("names_in_message"));
 console.log("changeBridgePairingsOnNameUpdate1");
 }
 else {
 var namesInMessage = result.get("names_in_message");
 for (var j = 0, len = namesInMessage.length; j < len; j++) {
 //var newNamesInMessage = namesInMessage
 if (namesInMessage[j] == req.user.name) {
 namesInMessage[j] = req.user.user2_name
 break
 }
 }
 
 result.set(namesInMessage, result.get("names_in_message"));
 console.log("changeBridgePairingsOnNameUpdate2");
 }
 //after making updates to the queried data, you need to save
 result.save(null, {
 success: function(bridgePairing){
 console.log("Saved after changinging name")
 incrementWhenDone.count += 1;
 //once incrementWhenDone get to the length of the results, it is clear the job has completed - this is necessary due to asynchronous execution
 if (incrementWhenDone.count == results.length) {
 console.log(" Saved "+ results.length +" messages");
 //res.success is the return -> no code will be read after this
 res.success(" Saved all pairings");
 }
 
 },
 error: function(bridgePairing, error){
 console.log(" Not Saved after changinging status")
 incrementWhenDone.count += 1;
 if (incrementWhenDone.count == results.length) {
 console.log(" Not all of  "+ results.length +" messages were saved");
 res.error(" Not all the messages were saved");
 }
 
 }
 });
 //}
 }
 },
 //if error will call function with parameter of error
 error: function(error) {
 console.log("Failed!");
 res.error("Not saved");
 }
 });
 
 });*/

/*//query and update the messages Table
 console.log("changeMessagesTableOnNameUpdate was called");
 //creating a class with the name BridgePairings
 var MessagesClass = Parse.Object.extend("Messages");
 //query passing the classname -> which is the name of the table being queried
 var query2 = new Parse.Query(MessagesClass);
 //queries the table for user_objectIds that includes req.user.id
 query2.equalTo("ids_in_message", req.user.id)
 query2.limit(10000);
 //for query.find, everything is in background
 query2.find({
 //if success will call function with parameter of results
 success:function(results) {
 console.log("messages table query length : "+results.length);
 var incrementWhenDone = {count : 0};
 //going through each of the results and deciding which one of the users' name should be updated
 for (var i = 0, len = results.length; i < len; i++) {
 var result = results[i];
 var userObjectIds = result.get("user_objectIds");
 console.log("result = "+ result + "userObjectIds[0]="+userObjectIds[0] + " & userObjectIds[1]= "+userObjectIds[1]);
 if (userObjectIds[0] == req.user.id) {
 //the name is sent from the user's phone when the cloud function was called so the cloud code does not have to request the name from Parse and save again
 var namesInMessage = result.get("names_in_message");
 //checks through namesInMessage to find the user's name and replaces it with the new name
 for (var j = 0, len = namesInMessage.length; j < len; j++) {
 if (namesInMessage[j] == req.user.name) {
 namesInMessage[j] = req.user.user1_name
 break
 }
 }
 
 result.set(namesInMessage, result.get("names_in_message"));
 console.log("changeBridgePairingsOnNameUpdate1");
 }
 else {
 var namesInMessage = result.get("names_in_message");
 for (var j = 0, len = namesInMessage.length; j < len; j++) {
 //var newNamesInMessage = namesInMessage
 if (namesInMessage[j] == req.user.name) {
 namesInMessage[j] = req.user.user2_name
 break
 }
 }
 
 result.set(namesInMessage, result.get("names_in_message"));
 console.log("changeBridgePairingsOnNameUpdate2");
 }
 //after making updates to the queried data, you need to save
 result.save(null, {
 success: function(bridgePairing){
 console.log("Saved after changinging name")
 incrementWhenDone.count += 1;
 //once incrementWhenDone get to the length of the results, it is clear the job has completed - this is necessary due to asynchronous execution
 if (incrementWhenDone.count == results.length) {
 console.log(" Saved "+ results.length +" messages");
 //res.success is the return -> no code will be read after this
 res.success(" Saved all pairings");
 }
 
 },
 error: function(bridgePairing, error){
 console.log(" Not Saved after changinging status")
 incrementWhenDone.count += 1;
 if (incrementWhenDone.count == results.length) {
 console.log(" Not all of  "+ results.length +" messages were saved");
 res.error(" Not all the messages were saved");
 }
 
 }
 });
 //}
 }
 },
 //if error will call function with parameter of error
 error: function(error) {
 console.log("Failed!");
 res.error("Not saved");
 }
 });*/

//Converting photo's to urls and adding them to the users table
Parse.Cloud.define('updateUserTableToHaveURLS', function(req, res) {
 Parse.Cloud.useMasterKey();
 console.log("updateUserTableToHaveURLS");
 var userQuery = new Parse.Query("_User");
 userQuery.limit(53);
 userQuery.equalTo("profile_picture_url", nil);
 userQuery.exists("profile_picture");
 userQuery.doesNotExist("profile_picture_url");
 userQuery.find({
 success: function(results) {
 console.log("length of updateUserTableToHaveURLS -> " + results.length);
 for (var j = 0; j < results.length; ++j) {
 var result = results[j];
 var photo = result.get("profile_picture");
 var url = photo.url();
 console.log("This is the url ->" + url);
 result.set("profile_picture_url", url);
 result.save();
 
 }
 
 },
 error: function() {
 console.log("Querying _User failed in updateUserTableToHaveURLS");
 res.error("Querying _User failed in updateUserTableToHaveURLS");
 
 
 }
 });
 
 });

//Converting photo's to urls and adding them to the BridgePairings table
 Parse.Cloud.define('updateBridgePairingsTableToHaveURLS', function(req, res) {
 Parse.Cloud.useMasterKey();
 console.log("updateUserTableToHaveURLS");
 var userQuery = new Parse.Query("BridgePairings");
 userQuery.limit(2000);
 userQuery.exists("user2_profile_picture");
 //userQuery.doesNotExist("user1_profile_picture_url");
 userQuery.find({
 success: function(results) {
 console.log("length of updateUserTableToHaveURLS -> " + results.length);
 for (var j = 0; j < results.length; ++j) {
 var result = results[j];
 //var photo1 = result.get("user1_profile_picture");
 //var url1 = photo1.url();
 //console.log("This is the url1 ->" + url1);
 //result.set("user1_profile_picture_url", url1);
 
 var photo2 = result.get("user2_profile_picture");
 var url2 = photo2.url();
 console.log("This is the url1 ->" + url2);
 result.set("user2_profile_picture_url", url2);
 
 result.save();
 
 }
 
 },
 error: function() {
 console.log("Querying _User failed in updateUserTableToHaveURLS");
 res.error("Querying _User failed in updateUserTableToHaveURLS");
 
 
 }
 });
                    
                    
                    Parse.Cloud.define('addProfilePicturesBackForUser1', function(req, res) {
                                       Parse.Cloud.useMasterKey();
                                       var query = new Parse.Query("_User");
                                       query.exists("profile_picture");
                                       query.exists("objectId");
                                       query.limit(2000);
                                       query.find({
                                                  success: function(results) {
                                                  for (var j = 0; j < results.length; ++j) {
                                                  var result = results[j];
                                                  var userId = result.get("objectId");
                                                  var profilePicture = result.get("profile_picture");
                                                  var bpQuery = new Parse.Query("BridgePairings");
                                                  bpQuery.limit = 2000
                                                  bpQuery.equalTo("user_objectId1", userId);
                                                  bpQuery.find({
                                                               success: function(pairings) {
                                                               for (var i = 0; i < results.length; ++i) {
                                                               pair = pairings[i];
                                                               pair.set("user1_profile_picture", profilePicture);
                                                               pair.save();
                                                               }
                                                               },
                                                               error: function() {
                                                               console.log("bpQuery didn't work");
                                                               res.error("bpQuery didn't work");
                                                               }
                                                               });
                                                  }
                                                  },
                                                  error: function() {
                                                  console.log("addProfielPicturesBack didn't work")
                                                  res.error("addProfielPicturesBackdidn't work");
                                                  }
                                                  });
                                       
                                       });
                    Parse.Cloud.define('addProfilePicturesBackForUser2', function(req, res) {
                                       Parse.Cloud.useMasterKey();
                                       var query = new Parse.Query("_User");
                                       query.exists("profile_picture");
                                       query.exists("objectId");
                                       query.limit(2000);
                                       query.find({
                                                  success: function(results) {
                                                  for (var j = 0; j < results.length; ++j) {
                                                  var result = results[j];
                                                  var userId = result.get("objectId");
                                                  var profilePicture = result.get("profile_picture");
                                                  var bpQuery = new Parse.Query("BridgePairings");
                                                  bpQuery.limit = 2000
                                                  bpQuery.equalTo("user_objectId2", userId);
                                                  bpQuery.find({
                                                               success: function(pairings) {
                                                               for (var i = 0; i < results.length; ++i) {
                                                               pair = pairings[i];
                                                               pair.set("user2_profile_picture", profilePicture);
                                                               pair.save();
                                                               }
                                                               },
                                                               error: function() {
                                                               console.log("bpQuery didn't work");
                                                               res.error("bpQuery didn't work");
                                                               }
                                                               });
                                                  }
                                                  },
                                                  error: function() {
                                                  console.log("addProfielPicturesBack didn't work")
                                                  res.error("addProfielPicturesBackdidn't work");
                                                  }
                                                  });
                                       
                                       });
                    
                    
                    
//                    //user1 picture
//                    let query: PFQuery = PFQuery(className: "_User")
//                    query.limit = 2000
//                    query.findObjectsInBackground { (objects: [PFObject]?, error: Error?) in
//                    if error != nil {
//                    print(error)
//                    } else if let objects = objects {
//                    for object in objects {
//                    if let userId = object["objectId"] as? String {
//                    if let profilePicture = object["profile_picture"] as? PFFile {
//                    let bpQuery : PFQuery = PFQuery(className: "BridgePairings")
//                    bpQuery.whereKey("user_objectId1", equalTo: userId)
//                    bpQuery.limit = 2000
//                    bpQuery.findObjectsInBackground(block: { (pairings: [PFObject]?, error2: Error?) in
//                                                    if error2 != nil {
//                                                    
//                                                    } else if let pairings = pairings {
//                                                    for pair in pairings {
//                                                    pair["user1_profile_picture"] = profilePicture
//                                                    pair.saveInBackground()
//                                                    print("user1 picture saved")
//                                                    }
//                                                    }
//                                                    })
//                    }
//                    }
//                    }
//                    }
//                    }
//                    
//                    
//                    //user2 picture
//                    let query2: PFQuery = PFQuery(className: "_User")
//                    query2.limit = 2000
//                    query2.findObjectsInBackground { (objects: [PFObject]?, error: Error?) in
//                    if error != nil {
//                    print(error)
//                    } else if let objects = objects {
//                    for object in objects {
//                    if let userId = object["objectId"] as? String {
//                    if let profilePicture = object["profile_picture"] as? PFFile {
//                    let bpQuery : PFQuery = PFQuery(className: "BridgePairings")
//                    bpQuery.whereKey("user_objectId2", equalTo: userId)
//                    bpQuery.limit = 2000
//                    bpQuery.findObjectsInBackground(block: { (pairings: [PFObject]?, error2: Error?) in
//                                                    if error2 != nil {
//                                                    
//                                                    } else if let pairings = pairings {
//                                                    for pair in pairings {
//                                                    pair["user2_profile_picture"] = profilePicture
//                                                    pair.saveInBackground()
//                                                    print("user2 picture saved")
//                                                    }
//                                                    }
//                                                    })
//                    }
//                    }
//                    }
//                    }
//                    }
 
 });
