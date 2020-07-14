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
  async getLastConv(count: number) {
    var isAscending = true;
    var convsRender: any;
    convsRender = await this.getLastConversations(count, isAscending);
    console.log("ms" + convsRender);
    return convsRender;
  }
  getLastConversations(count: number, isAscending: boolean){
    return new Promise((resolve, reject) => {
      this.stringeeChat.getLastConversations(count, isAscending, function (status, code, message, convs) {
        console.log("msgs " + convs);
        resolve(convs);
      });
    })
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
  async getLastMessage(YOUR_CONVERSATION_ID: string, count: number) {
    var convId = YOUR_CONVERSATION_ID;
    var isAscending = true;
    var msgsRender: any;
    msgsRender = await this.getLastMessages(count, isAscending, convId);
    return msgsRender;
  }
  getLastMessages(count: number, isAscending: boolean, convId: string){
    return new Promise((resolve, reject) => {
      this.stringeeChat.getLastMessages(convId, count, isAscending, function (status, code, message, msgs) {
        resolve(msgs);
      });
    })
  }

  // Get user info
  getUserInfo(userId: string){
    var userIds = ['08d826ec-bf3a-4cff-84a5-2142b0eac1d7', '08d826cf-0eaa-4c2e-8f7b-5381cb6c895b'];
    this.stringeeChat.getUsersInfo(userIds, function (status, code, message, users) {
        console.log('status:' + status + ' code:' + code + ' message:' + message + ' users:' + JSON.stringify(users));
    });
  }

}
