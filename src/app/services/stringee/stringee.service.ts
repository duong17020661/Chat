import { Injectable } from '@angular/core';
import { StringeeClient, StringeeChat } from "stringee-chat-js-sdk";
import * as jwt_decode from 'jwt-decode';

@Injectable({
  providedIn: 'root'
})
export class StringeeService {
  // Khời tạo các đối tượng Stringee
  stringeeClient = new StringeeClient();
  stringeeChat = new StringeeChat(this.stringeeClient);
  returnConversations = [];

  constructor() { }
  /**
   * Kết nối tới Stringee
   * @param token Token để xác thực người dùng
   */
  stringeeConnect(token: string) {
    console.log("Connecting.......")
    this.stringeeClient.connect(token);
    console.log("Success")
  }
  /**
   * Hàm lấy thông tin người dùng từ storage và cập nhật thông tin lên Stringee
   */
  getAndUpdateInfo() {
    // Lấy thông tin người dùng từ Token
    let token = JSON.parse(localStorage.getItem('currentUser')).token;
    let tokenInfo = this.getDecodedAccessToken(token);
    let userId = tokenInfo.userId
    // Lấy thông tin người dùng
    this.stringeeChat.getUsersInfo([userId], (_status: any, _code: any, _msg: any, users: any[]) => {
      if (1) {
        let username = tokenInfo.name;
        let avatar = tokenInfo.avatar;
        let updateUserData = {
          display_name: username,
          avatar_url: avatar
        }
        // Cập nhật thông tin người dùng
        this.updateUserInfo(updateUserData)
      }
    });
  }
  /**
   *   Hàm lắng nghe và xác thực tài khoản Stringee
   */
  onAuthen() {
    this.stringeeClient.on('authen', (res) => {
      console.log('authen', res);
      // Cập nhật thông tin sau khi xác thực
      this.getAndUpdateInfo()
    });
  }
  /**
   * Hàm ngắt kết nối tới Stringee
   */
  stringeeDisconnect() {
    this.stringeeClient.disconnect();
  }
  /**
   * Hàm lắng nghe kết nối và chạy khi người dùng ngắt kết nối với Stringee
   */
  onDisconnect() {
    this.stringeeClient.on('disconnect', function () {
      console.log('++++++++++++++ disconnected');
    });
  }
  /**
   * Tạo một cuộc trò chuyện
   * @param userId Danh sách những người dùng trong cuộc trò chuyện
   */
  createConversation(userId) {
    var userIds = userId;
    var options = {
      isDistinct: true,
      isGroup: false
    };
    this.stringeeChat.createConversation(userIds, options, (status, code, message, conv) => {
      localStorage.setItem("convId", JSON.stringify(conv))
    });
  }
  /**
   * Hàm lấy 20 cuộc trò chuyện gần nhất
   */
  getConversation(callback: any) {
    this.stringeeChat.getLastConversations(20, false, callback);
  }
  /**
   * Hàm gửi tin nhắn dạng text
   * @param message Nội dung tin nhắn
   * @param conversationId Mã cuộc trò chuyện
   */
  sendMessage(message: string, conversationId: string) {
    var txtMsg = {
      type: 1,
      convId: conversationId,
      message: {
        content: message
      }
    };
    this.stringeeChat.sendMessage(txtMsg, function (status, code, message, msg) {

    });
  }
  /**
   * Hàm gửi tin nhắn dạng file
   * @param message Nội dung tin nhắn
   * @param convId Mã cuộc trò chuyện
   * @param fName Tên file
   * @param fPath Đường dẫn file
   * @param fLenght Kích thước file
   */
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

    });
  }
  /**
   * Hàm gửi tin nhắn dạng ảnh
   * @param convId Mã cuộc trò chuyện
   * @param fPath Đường dẫn ảnh
   */
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

    });
  }

  /**
   * Hàm lấy 15 tin nhắn gần nhất từ 1 cuộc trò chuyện
   * @param convId Mã cuộc trò chuyện
   * @param callback Hàm callback lưu thông tin các tin nhắn
   */
  getLastMessages(convId: string, callback: any) {
    this.stringeeChat.getLastMessages(convId, 15, true, callback);
  }
  /**
   * Hàm cập nhật thông tin người dùng
   * @param data Dữ liệu của người dùng gồm ảnh, tên và email
   */
  updateUserInfo(data) {
    this.stringeeChat.updateUserInfo(data, function (res) {
      console.log("Ssssssss")
      console.log(res)
    });
  }

  /**
   * Hàm decode để lấy dữ liệu của người dùng từ token
   * @param token Token người dùng
   */
  getDecodedAccessToken(token: string): any {
    try {
      return jwt_decode(token);
    }
    catch (Error) {
      return null;
    }
  }
}
