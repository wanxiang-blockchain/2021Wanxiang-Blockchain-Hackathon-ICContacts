import Principal "mo:base/Principal";
import Map "mo:base/HashMap";
import Text "mo:base/Text";
import Int "mo:base/Int";

module {

    public type UserName = Text;
    public type Addr = Text;
    public type FriendId = Text;

    public type FriendInit = {
        userName: UserName;
        addr: Addr;
    };

    public type FriendInfo = {
        friendId : FriendId;
        userName: UserName;
        createdAt : Int;
        addr: Addr;
    };

    public type State = {
        // all friend.
        friends : Map.HashMap<FriendId, FriendInfo>;
    };

    public func empty () : State {
        let st : State = {
        friends = Map.HashMap<FriendId, FriendInfo>(0, Text.equal, Text.hash);
        };
        st
    };

}