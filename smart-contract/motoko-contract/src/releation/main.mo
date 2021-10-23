
import ProfileTypes "./backend/profileTypes";
import Database "./backend/database";
import FriendHandle "FriendHandle";
import Cycles "mo:base/ExperimentalCycles";


shared (msg) actor class test (){
  let admin = msg.caller;

  type UserId = ProfileTypes.UserId;
  type UserName = ProfileTypes.UserName;
  type FriendCanister = ProfileTypes.FriendCanister;

  
  type CanisterSettings = ProfileTypes.CanisterSettings;
  type UpdateSettingsParams = ProfileTypes.UpdateSettingsParams;
  type ICActor = ProfileTypes.ICActor;

  let IC: ICActor = actor("aaaaa-aa");
  var user: Database.User = Database.User();

    public shared(msg) func createProfile(userName: UserName) : async ?FriendCanister {
    switch(user.findOne(msg.caller)){
      case null{
        Cycles.add(100_000_000_000);
        let friendHandleObj = await FriendHandle.FriendHandle();
        
        let canId = await friendHandleObj.createOwner(msg.caller);
        user.createOne(msg.caller, userName, canId);
        
        let settings: CanisterSettings = {
          controllers = [admin, msg.caller];
        };
        let params: UpdateSettingsParams = {
            canister_id = canId;
            settings = settings;
        };
        await IC.update_settings(params);
        
        return(?canId);
      };
      case (?_){
        return(null);
      };
    }
  };

  public query(msg) func getUserName(userId: UserId) : async ?UserName {
    do?{
      let profile = user.findOne(userId)!;
      profile.userName
    }
  };

};
