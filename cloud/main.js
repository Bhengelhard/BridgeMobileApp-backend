// Cloud co!

/*Parse.Cloud.define("deleteBridgePairings", function(request, status) {
                
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
                
                });*/
/*Parse.Cloud.define('changeMessagesTableOnNameUpdate', function(req, res) {
                   console.log("changeBridgePairingsOnNameUpdate was called");
                   //creating a class with the name BridgePairings
                   var MessagesClass = Parse.Object.extend("Messages");
                   //query passing the classname -> which is the name of the table being queried
                   var query = new Parse.Query(MessagesClass);
                   //queries the table for user_objectIds that includes req.user.id
                   query.includes("ids_in_message", req.user.id)
                   query.limit = 10000;
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
 query2.limit = 10000;
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

Parse.Cloud.define('addIntroducedUsersToEachothersFriendLists', function(req, res) {
    Parse.Cloud.useMasterKey();
    console.log("addIntroducedUsersToEachothersFriendLists");
    //creating a class with the name _User
    //var UserClass = Parse.Object.extend("_User)");
    //query passing the classname -> which is the name of the table being queried
    //var query = new Parse.Query(UserClass);
    var query = new Parse.Query("_User");
    //queries the table for the id's that include the user's introduced
    var introducedUserIds = [req.params.userObjectId1, req.params.userObjectId2]
    query.containedIn("objectId", introducedUserIds);
    console.log("introducedUserId = " + req.params.userObjectId1)
    query.limit = 2
    query.find({
               //if success will call function with parameter of results
               success:function(results) {
               console.log("length of addIntroducedUsersToEachothersFriendLists query : " + results.length)
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
                   console.log("req.user.id = " + req.user.id)
                   query.limit = 10000;
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
                   query.limit = 10000;
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
                   query.limit = 10000;
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
                   query.limit = 10000;
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
                   query.limit = 10000;
                   //for query.find, everything is in background
                   query.find({
                              //if success will call function with parameter of results
                             success:function(results) {
                              console.log("length : "+results.length);
                             var incrementWhenDone = {count : 0};
                              //going through each of the results and deciding which one of the users' status should be updated
                             for (var i = 0, len = results.length; i < len; i++) {
                              // Randomly update a few statuses
                             if (Math.floor(Math.random()*2) == 1){
                             var result = results[i];
                             var userObjectIds = result.get("user_objectIds");
                             console.log("result = "+ result + "userObjectIds[0]="+userObjectIds[0] + " & userObjectIds[1]= "+userObjectIds[1]);
                             //if( userObjectIds.length > 0 ){
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
                   query.limit = 10000;
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
                   var BridgePairingsClass = Parse.Object.extend("BridgePairings");
                   var query = new Parse.Query(BridgePairingsClass);
                   query.equalTo("shown_to",req.user.id);
                   query.equalTo("checked_out",false);
                   query.limit = 10000;
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
//                              var i = shownTo.indexOf(req.user.id);
//                              if (i > -1) {
//                                console.log("before splice");
//                                shownTo.splice(i,1);
//                                console.log("after splice");
//                              }
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
    
    bridgePairing.set("user1_profile_picture",user.get("profile_picture"));
    bridgePairing.set("user2_profile_picture",req.user.get("profile_picture"));
    
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
    query.limit = 10000;
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
            query.limit = 1;
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
            query.limit = 1;
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
        query.limit = 1;
        query.equalTo("userId",user.id);
        query.equalTo("bridge_type",bridgeType);
        query.first({
                    success: function(result1) {
                    status1 = result1.get("bridge_status");
                    var query2 = new Parse.Query("BridgeStatus");
                    query2.descending("createdAt");
                    query2.limit = 1;
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