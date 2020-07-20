import { Injectable } from '@angular/core';
import { StringeeClient, StringeeChat } from "stringee-chat-js-sdk";
import * as jwt_decode from 'jwt-decode';
import Conversation from 'src/models/conversation';

@Injectable({
  providedIn: 'root'
})
export class StringeeService {


  // Init
  stringeeClient = new StringeeClient();
  stringeeChat = new StringeeChat(this.stringeeClient);
  returnConversations = [];

  constructor() { }
  // Connect stringee
  stringeeConnect(token: string) {
    console.log("Connecting.......")
    this.stringeeClient.connect(token);
    console.log("Success")
  }
  getAndUpdateInfo() {
    let userId = JSON.parse(localStorage.getItem("currentUser")).id;
    let tokenInfo = this.getDecodedAccessToken(JSON.parse(localStorage.getItem("currentUser")).token);
    console.log("name: " + tokenInfo.name)
    // Get user info
    var userIds = [userId];
    this.stringeeChat.getUsersInfo(userIds, (status, code, message, users) => {
      let user = users[0];
      if (user) {
        let username = tokenInfo.name;
        let avatar = tokenInfo.avatar;
        let updateUserData = {
          display_name: username,
          avatar_url: avatar
        }
        this.updateUserInfo(updateUserData)
      }
    });
  }

  // Authen Stringee
  onAuthen() {
    this.stringeeClient.on('authen', (res) => {
      console.log('authen', res);
      this.getAndUpdateInfo()
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
      //  console.log('status:' + status + ' code:' + code + ' message:' + message + ' conv:' + JSON.stringify(conv));
      localStorage.setItem("convId", JSON.stringify(conv))
    });
  }

  // Get last conversation
  getConversation(callback: any) {
    this.stringeeChat.getLastConversations(10, false, callback);
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
  // Send file
  sendFile(message: string, convId: string, fName: string, fPath: string, fLenght: number) {
    var fileMsg = {
      type: 5,
      convId: convId,
      message: {
        content: message,
        file: {
          filePath: fPath,
          filename: name,
          length: fLenght
        },
        metadata: {
          key: 'value'
        }
      }
    };
    this.stringeeChat.sendMessage(fileMsg, function (status, code, message, msg) {
      //console.log(status + code + message + "msg result " + JSON.stringify(msg));
    });
  }

  // Send file
  sendImage(convId: string, fPath: string) {
    var fileMsg = {
      type: 2,
      convId: convId,
      message: {
        content: "",
        photo: {
          filePath: fPath,
          thumbnail: "",
          ratio: ""
        },
        data: {
          key: 'value'
        }
      }
    };
    this.stringeeChat.sendMessage(fileMsg, function (status, code, message, msg) {
      //console.log(status + code + message + "msg result " + JSON.stringify(msg));
    });
  }

  // Get last messages
  getLastMessages(convId: string, callback: any) {
    this.stringeeChat.getLastMessages(convId, 20, true, callback);
  }
  // Get user info
  getUser(userId: string, callback: any) {
    this.stringeeChat.getUsersInfo([userId], callback)
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
