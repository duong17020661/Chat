import { Injectable } from '@angular/core';
import { StringeeClient, StringeeChat } from "stringee-chat-js-sdk";
import * as jwt_decode from 'jwt-decode';

@Injectable({
  providedIn: 'root'
})
export class StringeeService {


  // Init
  stringeeClient = new StringeeClient();
  stringeeChat = new StringeeChat(this.stringeeClient);

  constructor() { }

  // Connect stringee
  stringeeConnect(token: string) {
    this.stringeeClient.connect(token);
  }
  onConnect() {
    this.stringeeClient.on('connect', function () {
    });
  }

  // Authen Stringee
  onAuthen() {
    this.stringeeClient.on('authen', function (res) {
      console.log('authen', res);
    });
  }

  // Disconnect stringee
  stringeeDisconnect() {
    this.stringeeClient.disconnect();
  }
  onDisconnect() {
    this.stringeeClient.on('disconnect', function () {
      console.log('++++++++++++++ disconnected');
    });
  }

  // Create Conversation 1-1
  createConversation(userId) {
    var userIds = userId;
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
  getLastConversations(count: number, isAscending: boolean) {
    return new Promise((resolve, reject) => {
      this.stringeeChat.getLastConversations(count, isAscending, function (status, code, message, convs) {
        console.log("msgs " + convs);
        resolve(convs);
      });
    })
  }

  // Send message
  sendMessage(message: string, conversationId: string) {
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
  getLastMessages(count: number, isAscending: boolean, convId: string) {
    return new Promise((resolve, reject) => {
      this.stringeeChat.getLastMessages(convId, count, isAscending, function (status, code, message, msgs) {
        resolve(msgs);
      });
    })
  }

  // Get user info
  getUserInfo(userId: string) {
    var userIds = [userId];
    this.stringeeChat.getUsersInfo(userIds, (status, code, message, users) => {
      let user = users[0];
      if (!user) {
        let tokenInfo = this.getDecodedAccessToken(JSON.parse(localStorage.getItem("currentUser")).token);
        let username = tokenInfo.name;
        let avatar = tokenInfo.avatar;
        console.log(tokenInfo.name)
        let updateUserData = {
          display_name: username,
          avatar_url: avatar
        }
        this.updateUserInfo(updateUserData)
      }
    });
  }

  // Update user info
  updateUserInfo(data) {
    this.stringeeChat.updateUserInfo(data, function (res) {
      console.log(res)
    });
  }

  // Decode token
  getDecodedAccessToken(token: string): any {
    try {
      return jwt_decode(token);
    }
    catch (Error) {
      return null;
    }
  }
}
