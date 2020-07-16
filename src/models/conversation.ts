import User from '../models/userStringee';
import Message from '../models/messagesStringee';
import { MessagesService } from 'src/app/services/messages/messages.service';

class Conversation {
    id: any;;
    name: any;
    isGroup : any;
    updatedAt: any;
    creator: any;
    created: any;
    unreadCount: any;
    participants: any[];
    lastMessage: any;

    constructor(props) {
        this.id = props.id;
        this.name = props.name;
        this.isGroup = props.isGroup;
        this.updatedAt = props.updatedAt;
        this.creator = props.creator;
        this.created = props.created;
        this.unreadCount = props.unreadCount;

        var parts = [];
        var tempParts = props.participants;
        tempParts.map((part) => {
            var user = new User(part);
            parts.push(user);
        });
        this.participants = parts;

        this.lastMessage = new Message(props);
        this.lastMessage.localId = null;
        this.lastMessage.id = props.lastMsgId;
        this.lastMessage.conversationId = props.id;
        this.lastMessage.sender = props.lastMsgSender;
        this.lastMessage.createdAt = props.lastMsgCreatedAt;
        this.lastMessage.state = props.lastMsgState;
        this.lastMessage.sequence = props.lastMsgSeq;
        this.lastMessage.type = props.lastMsgType;
        this.lastMessage.content = props.text;
    }
}

export default Conversation;