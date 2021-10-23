import ProfileTypes "profileTypes";
import HashMap "mo:base/HashMap";
import Principal "mo:base/Principal";
import Time "mo:base/Time";

module {
    
    type Profile = ProfileTypes.Profile;
    type UserId = ProfileTypes.UserId;
    type FriendCanister = ProfileTypes.FriendCanister;
    type UserName = ProfileTypes.UserName;

    func isEq(x: UserId, y: UserId): Bool { x == y };

    func makeProfile(userId: UserId, userName: UserName, friendCanister: FriendCanister): Profile {
        {
        id = userId;
        friendCanister = friendCanister;
        userName = userName;
        createdAt = Time.now();
        updateCanister = false;
        }
    };

    public class User(){
        let hashMap = HashMap.HashMap<UserId, Profile>(1, isEq, Principal.hash);
        
        public func createOne(userId: UserId, userName: UserName, friendCanister: FriendCanister) {
            hashMap.put(userId, makeProfile(userId, userName, friendCanister));
        };

        public func findOne(userId: UserId): ?Profile {
            hashMap.get(userId);
        };
    }
}