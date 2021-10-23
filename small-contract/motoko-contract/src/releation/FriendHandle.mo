import Principal "mo:base/Principal";
import FriendTypes "./backend/friendTypes";
import Buffer "mo:base/Buffer";
import Time "mo:base/Time";

shared (msg) actor class FriendHandle (){
    type UserName = FriendTypes.UserName;

    public type FriendId = FriendTypes.FriendId;
    public type FriendInfo = FriendTypes.FriendInfo;
    public type FriendInit = FriendTypes.FriendInit;

    stable var owner:Principal = msg.caller;

    var state = FriendTypes.empty();

    public query(msg) func getCanisterID() : async Principal{
        msg.caller;
    };

    public shared(msg) func createOwner(newOwner: Principal) : async Principal {
        assert(msg.caller==owner);
        owner := newOwner;
        await getCanisterID();
    };

    func createFriend_(fileData : FriendInit) : async ?FriendId {
        let now = Time.now();
        let friendId = fileData.addr;

        switch (state.friends.get(friendId)) {
        case (?_) { null };
        case null {
                state.friends.put(friendId, {
                friendId = friendId;
                userName = fileData.userName;
                createdAt = now;
                addr = fileData.addr;
                });
            ?friendId
            };
        };
    };

    public shared(msg) func createFriend(friend : FriendInit) : async ?FriendId {
        do?{
        assert(msg.caller==owner);
        let friendId = await createFriend_(friend);
        friendId!
        }
    };

    public query(msg) func getFriends() : async ?[FriendInfo] {
        do?{
        assert(msg.caller==owner);
        let b = Buffer.Buffer<FriendInfo>(0);
        for ((k,v) in state.friends.entries()) {
            b.add(v);
        };
        b.toArray()
        }
    };
}