package ra.websocketserver.controller;

import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.messaging.simp.SimpMessageHeaderAccessor;
import org.springframework.stereotype.Controller;
import ra.websocketserver.model.Chat;

@Controller
public class WebSocketController {
    // nhận tin nhắn gửi lên từ stomp
    @MessageMapping("/chat/send-message")
    @SendTo("/topic/public-chat-room")
    public Chat sendChatMessage(@Payload Chat chat){
        return chat;
    }

    @MessageMapping("/chat/add-user")
    @SendTo("/topic/public-chat-room")
    public Chat addUser(@Payload Chat chat , SimpMessageHeaderAccessor headerAccessor){
        // thêm người dùng vào session của websoket
        headerAccessor.getSessionAttributes().put("username",chat.getSender());
        return  chat;
    }
}
