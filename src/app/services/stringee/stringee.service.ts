import { Injectable } from '@angular/core';
import { StringeeClient, StringeeChat } from "stringee-chat-js-sdk";
import { IUser } from 'src/models/user';

@Injectable({
  providedIn: 'root'
})
export class StringeeService  {


  // Init
  stringeeClient = new StringeeClient();
  stringeeChat = new StringeeChat(this.stringeeClient);

  constructor() { }
  // Connect stringee
  stringeeConnect(token: string){
    this.stringeeClient.connect(token);
  }
  onConnect(){
    this.stringeeClient.on('connect', function () {
      console.log('++++++++++++++ connected to StringeeServer');
    });
  }
  
  // Authen Stringee
  onAuthen(){
    this.stringeeClient.on('authen', function (res) {
      console.log('authen', res);
    });
  }
  // Disconnect stringee
  stringeeDisconnect(){
    this.stringeeClient.disconnect();
  }
  onDisconnect() {
    this.stringeeClient.on('disconnect', function () {
      console.log('++++++++++++++ disconnected');
    });
  }

  // Create Conversation 1-1
  createConversation(user: IUser){
    var userIds = [user.id];
    var options = {
      isDistinct: true,
      isGroup: false
    };
    this.stringeeChat.createConversation(userIds, options, (status, code, message, conv) => {
      //console.log('status:' + status + ' code:' + code + ' message:' + message + ' conv:' + JSON.stringify(conv));
      localStorage.setItem("convId", conv.id)
    });
  }

  // Get last conversation
  getLastConversation(numberMessages: number, Ascending: boolean){
    var count = numberMessages;
    var isAscending = Ascending;

    this.stringeeChat.getLastConversations(count, isAscending, function (status, code, message, convs) {
      //console.log('status: ' + status + '  ' + code + message + ' convs:' + JSON.stringify(convs));
    });
  }

  // Send message
  sendMessage(message: string, conversationId: string){
    var txtMsg = {
      type: 1,
      convId: conversationId,
      message: {
        content: message
      }
    };

    this.stringeeChat.sendMessage(txtMsg, function (status, code, message, msg) {
      //console.log(status + code + message + "msg result " + JSON.stringify(msg));
    });
  }
  // Get last messages
  getLastMessages(getMessages: any[],numberMessages: number, Ascending: boolean, conversationId: string){
    var convId = conversationId;
    var count = numberMessages;
    var isAscending = Ascending;
    this.stringeeChat.getLastMessages(convId, count, isAscending, function (status, code, message, msgs) {
      // console.log("LAST MESSAGES: " + 'status:' + status + ' code:' + code + ' message:' + message + ' conv:' + JSON.stringify(msgs));
      console.log(JSON.parse(JSON.stringify(msgs)))
    });
  }

}
