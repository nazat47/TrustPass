// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract TrainTicketMarketplace {
    enum TicketStatus { available, sold, refunded }
   
    
    struct Ticket {
        address issuer;
        address buyer;
        uint256 price;
        TicketStatus status;
        bytes Encrypted_Details;
        string Departure_Time;
        string Arrival_Time;
        string Source;
        string Destination;
        bytes32 key;
        uint256 ExpTime;
    }
    
    Ticket[] public tickets;
    mapping(uint256 => bytes) private TicketDetails;
    
    event TicketCreated(uint256 TicketID, address issuer, uint256 price);
     event TicketSold(uint256 TicketID, address buyer, bytes32 DecryptionKey);
    event TicketRefunded(uint256 TicketID, address RefundReceiver);
    
    function CreateTicket(uint256 _price,string memory _DepartureTime, string memory _ArrivalTime,string memory _Source,string memory _Destination) public {
        uint256 TicketID = tickets.length;
        bytes memory Encrypted_Details = EncryptTicketDetails(_DepartureTime, _ArrivalTime,_Source,_Destination);
        tickets.push(Ticket(msg.sender, address(0),_price,TicketStatus.available, Encrypted_Details,_DepartureTime,_ArrivalTime, _Source,_Destination,bytes32(0),0));
        emit TicketCreated(TicketID, msg.sender, _price);
        TicketDetails[TicketID] = Encrypted_Details;
    }
        function Buy_Ticket(uint256 TicketID) public payable {
        require(TicketID < tickets.length, "Your ticketID is not valid");
        require(tickets[TicketID].status == TicketStatus.available, "Ticket is not available");
        require(msg.value >= tickets[TicketID].price, "Payment is insufficient");
        tickets[TicketID].buyer = msg.sender;
        tickets[TicketID].status = TicketStatus.sold;
        (tickets[TicketID].key,tickets[TicketID].ExpTime) = GenerateDecryptKey();
        emit TicketSold(TicketID, msg.sender,tickets[TicketID].key);
    }
    
    function GetTicketDetails(uint256 TicketID,bytes32 DecryptionKey) public view returns (string memory departer, string memory arrival, string memory source, string memory destination) {
        require(TicketID < tickets.length, "Your ticketID is not valid");
        require(tickets[TicketID].status == TicketStatus.sold, "Ticket is not sold yet");
        require(block.timestamp<tickets[TicketID].ExpTime,"key expired");
        require(DecryptionKey == tickets[TicketID].key, "Please provide correct description key");
        bytes memory Encrypted_Details = TicketDetails[TicketID];
      //  Ticket memory ticket = tickets[TicketID];       
        (string memory Departure_Time, string memory Arrival_Time, string memory Source, string memory Destination) = abi.decode(Encrypted_Details, (string, string, string, string));
       
       return (Departure_Time, Arrival_Time, Source, Destination);
    }
    

    
    function RefundTicket(uint256 TicketID) public {
        require(TicketID < tickets.length, "Your ticketID is not valid");
        require(tickets[TicketID].status == TicketStatus.sold, "Ticket is not sold yet");
        require(msg.sender == tickets[TicketID].buyer, "Only buyer can be refunded");
        
        payable(msg.sender).transfer(tickets[TicketID].price);
        
        tickets[TicketID].buyer = address(0);
        tickets[TicketID].status = TicketStatus.refunded;
        
        emit TicketRefunded(TicketID, msg.sender);
    }
    
    function EncryptTicketDetails(string memory _DepartureTime,string memory _ArrivalTime,string memory _Source,string memory _Destination) private pure returns (bytes memory) {
        bytes memory details = abi.encode(_DepartureTime, _ArrivalTime, _Source, _Destination);
        return details;
    }
function GenerateDecryptKey() private view returns (bytes32,uint256) {
        bytes32 DKey=bytes32(keccak256(abi.encodePacked(block.timestamp, msg.sender)));
        uint256 ET=block.timestamp+1 minutes;
        return (DKey,ET);
    }
    
}
