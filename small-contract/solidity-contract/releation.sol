pragma solidity >=0.6.0 <0.9.0;

//定义一个entry
struct IndexValue { uint keyIndex; address value; }
struct KeyFlag { uint key; bool deleted; }

//定义一个结构体，记录key与entry的关系、key的集合、mapping的大小
struct itmap {
    mapping(uint => IndexValue) data;
    KeyFlag[] keys;
    uint size;
}

contract ReleationFactory {
    
    address public openInfoAddress;
    
    mapping(address => address) public getAddressListContract;
    address[] public addressListContracts;

    /**当前好友合约总数 */
    uint256 public contractNums;
    /**好友合约 所属者 */
    mapping(uint256 => address) public ownerOf;

    event CreateAddressListContract(
        address indexed creator,
        address indexed addressListContract
    );

    constructor(address _openInfoAddress) public{
        openInfoAddress = _openInfoAddress;
    }

    function createAddressListContract(address creator)
        public
        returns (address addressListContract)
    {
        require(
            getAddressListContract[creator] == address(0),
            "has already created address list"
        );
        bytes memory bytecode = type(AddressList).creationCode;
        bytes32 salt = keccak256(abi.encodePacked(creator));
        assembly {
            addressListContract := create2(
                0,
                add(bytecode, 32),
                mload(bytecode),
                salt
            )
        }
        AddressList(addressListContract).initialize(creator,openInfoAddress);
        getAddressListContract[creator] = addressListContract;
        addressListContracts.push(addressListContract);
        ownerOf[contractNums] = creator;
        contractNums++;
        emit CreateAddressListContract(creator, addressListContract);
    }
}

contract AddressList {
    address public factory;
    address public openInfoAddress;

    string public name;
    address public owner;
    string public ownerNickName;
    string public ownerAvatar = "https://avatars.githubusercontent.com/u/91399393?v=4";
    
    struct Friend {
        string name;
        address identity;
        address source;
    }
    mapping(address => Friend) public friendMap;
    uint256 public friendSize;
    mapping(uint256 => address) public indexAddressMap;
    
   
    itmap friendAddressMap;
    // Apply library functions to the data type.
    using IterableMapping for itmap;

    mapping(address => uint256) friendWithIndex;
    
    event AddFriend(
        address indexed onwerAddress,
        address indexed friendAddress,
        address indexed source
    );
    event DeleteFriend(
        address indexed onwerAddress,
        address indexed friendAddress,
        address indexed source
    );

    event SendMessage(
        address indexed sender,
        address indexed receiver,
        string  message
    );

    event GetMessage(
        address indexed sender,
        string  message
    );

    constructor() public {
        factory = msg.sender;
    }

    // called once by the factory at time of deployment
    function initialize(address _owner,address _openInfoAddress) external {
        require(msg.sender == factory, "FORBIDDEN"); // sufficient check
        owner = _owner;
        openInfoAddress = _openInfoAddress;
        OpenInfo(openInfoAddress).addOpenInfo(_owner,"rookie",ownerAvatar);
    }

    modifier checkOwner() {
        require(msg.sender == owner, "NOT OWNER");
        _;
    }
    
    function changeOwnerInfo(
        string memory _ownerNickName,
        string memory _ownerAvatar) public checkOwner{
            if(bytes(_ownerNickName).length == 0){
                _ownerNickName = ownerNickName;
            }
            
            if(bytes(_ownerAvatar).length == 0){
                _ownerAvatar = ownerAvatar;
            }
            ownerNickName = _ownerNickName;
            ownerAvatar = _ownerAvatar;

        OpenInfo(openInfoAddress).changeOpenInfo(msg.sender,_ownerNickName,_ownerAvatar);
    }

    function addFriend(
        address friendAddress,
        string memory friendname,
        address _source
    ) public checkOwner {
        require(
            friendMap[friendAddress].identity == address(0),
            "HAS ALREADY ADDED"
        );
        friendMap[friendAddress] = Friend(friendname, friendAddress, _source);

        friendAddressMap.insert(friendSize,friendAddress);
        friendWithIndex[friendAddress] = friendSize;
        friendSize++;
        indexAddressMap[friendSize] = friendAddress;

        emit AddFriend(msg.sender, friendAddress, _source);
    }

    function deleteFriend(address friendAddress, address _source)
        public
        checkOwner
    {
        require(
            friendMap[friendAddress].identity != address(0),
            "NOT YET ADDED"
        );
        delete friendMap[friendAddress];
        friendAddressMap.remove(friendWithIndex[friendAddress]);
        emit DeleteFriend(msg.sender, friendAddress, _source);
    }

    function sendMessage(address friendAddress, string memory _message)
        public
        checkOwner
    {
        require(
            friendMap[friendAddress].identity != address(0),
            "NOT YET ADDED"
        );
        AddressList(ReleationFactory(factory).getAddressListContract(friendAddress)).getMessage(msg.sender,_message);
        emit SendMessage(msg.sender,friendAddress, _message);

    }
    
    function getMessage(address friendAddress, string memory _message) public{
        emit GetMessage(friendAddress, _message);

    }
}

library IterableMapping {


    //map存值
    function insert(
        itmap storage self,
        uint256 key,
        address value
    ) internal returns (bool replaced) {
        //获取entry的下标
        uint256 keyIndex = self.data[key].keyIndex;
        //将value存到entry中
        self.data[key].value = value;
        //如果entry已经存在，则直接返回
        if (keyIndex > 0) return true;
        else {
            //获取当前mapping大小
            keyIndex = self.keys.length;
            //keys新增一个元素
            self.keys.push();
            //给新的entry  keyIndex递增
            self.data[key].keyIndex = keyIndex + 1;
            //keys最新的元素属性修改
            self.keys[keyIndex].key = key;
            //长度增加
            self.size++;
            return false;
        }
    }

    function remove(itmap storage self, uint256 key)
        internal
        returns (bool success)
    {
        uint256 keyIndex = self.data[key].keyIndex;
        if (keyIndex == 0) return false;
        delete self.data[key];
        self.keys[keyIndex - 1].deleted = true;
        self.size--;
    }

    function contains(itmap storage self, uint256 key)
        internal
        view
        returns (bool)
    {
        return self.data[key].keyIndex > 0;
    }

    function iterate_start(itmap storage self)
        internal
        view
        returns (uint256 keyIndex)
    {
        return iterate_next(self, type(uint256).max);
    }

    function iterate_valid(itmap storage self, uint256 keyIndex)
        internal
        view
        returns (bool)
    {
        return keyIndex < self.keys.length;
    }

    function iterate_next(itmap storage self, uint256 keyIndex)
        internal
        view
        returns (uint256 r_keyIndex)
    {
        keyIndex++;
        while (keyIndex < self.keys.length && self.keys[keyIndex].deleted)
            keyIndex++;
        return keyIndex;
    }

    function iterate_get(itmap storage self, uint256 keyIndex)
        internal
        view
        returns (uint256 key, address value)
    {
        key = self.keys[keyIndex].key;
        value = self.data[key].value;
    }
}

contract OpenInfo {
    struct UserInfo {
        string ownerNickName;
        string ownerAvatar;
    }
    mapping(address => UserInfo) public UserInfoMap;
    address[] public userList;
    uint256 public userSize;


    function addOpenInfo(        address owner,
        string memory _ownerNickName,
        string memory _ownerAvatar)public{
                UserInfoMap[owner] = UserInfo(_ownerNickName, _ownerAvatar);
                userList.push(owner);
                userSize++;

    }

    function changeOpenInfo(
        address owner,
        string memory _ownerNickName,
        string memory _ownerAvatar
    ) public {
        UserInfoMap[owner] = UserInfo(_ownerNickName, _ownerAvatar);
    }
}
