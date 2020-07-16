import { Timestamp } from 'rxjs/internal/operators/timestamp';

class Message {
    localId: string;
    id: string
    conversationId: string;
    sender: string;
    createdAt: any;
    state: any;
    sequence: any
    type: any;
    content: any;   
    constructor(props) {
        this.localId = props.localId;
        this.id = props.id;
        this.conversationId = props.conversationId;
        this.sender = props.sender;
        this.createdAt = props.createdAt;
        this.state = props.state;
        this.sequence = props.sequence;
        this.type = props.type;
        this.content = props.content;
    }
}

export default Message;