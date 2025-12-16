// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.30;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";

contract Dappcord is ERC721 {
    uint256 public totalSupply = 0; // total number of NFTs minted, one for each user/channel joined
    uint256 public totalChannels = 0;
    address public owner;

    struct Channel {
        uint256 id;
        string name;
        uint256 cost;
    }

    mapping(uint256 => Channel) public channels; // mapping of channel id to channel details
    mapping(uint256 => mapping(address => bool)) public hasJoined; // who has joined each channel

    modifier onlyOwner() {
        require(msg.sender == owner, "Only owner can call this function");
        _;
    }

    constructor(string memory _name, string memory _symbol) ERC721(_name, _symbol) {
        owner = msg.sender;
    }

    function createChannel(string memory _name, uint256 _cost) public onlyOwner {
        // _cost is the cost of joining a channel
        totalChannels++;
        channels[totalChannels] = Channel(totalChannels, _name, _cost);
    }

    function mint(uint256 _channelId) public payable {
        require(_channelId != 0, "Channel ID cannot be zero");
        require(_channelId <= totalChannels, "Channel does not exist");
        require(hasJoined[_channelId][msg.sender] == false, "User has already joined this channel");
        require(msg.value >= channels[_channelId].cost, "Insufficient funds to join channel");
        // user is joining channel _channelId
        hasJoined[_channelId][msg.sender] = true;

        // mint NFT
        totalSupply++;
        _safeMint(msg.sender, totalSupply);
    }

    function getChannel(uint256 _id) public view returns (Channel memory) {
        return channels[_id];
    }

    function withdraw() public onlyOwner {
        (bool success,) = owner.call{value: address(this).balance}("");
        require(success, "Withdrawal failed");
    }
}
