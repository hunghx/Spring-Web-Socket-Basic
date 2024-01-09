package ra.websocketserver.listener;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.context.event.EventListener;
import org.springframework.messaging.simp.SimpMessageSendingOperations;
import org.springframework.messaging.simp.stomp.StompHeaderAccessor;
import org.springframework.stereotype.Component;
import org.springframework.web.socket.messaging.SessionConnectedEvent;
import org.springframework.web.socket.messaging.SessionDisconnectEvent;
import ra.websocketserver.model.Chat;

@Component
@Slf4j
@RequiredArgsConstructor
public class WebSocketListener {
    private  final SimpMessageSendingOperations simpMessage;

    @EventListener
    public void handleOpenedConnectionWebSocket(SessionConnectedEvent session){
        log.info("new connection to socket server");
    }

    @EventListener
    public void handleClosedConnectionWebSocket(SessionDisconnectEvent session){


        StompHeaderAccessor headerAccessor = StompHeaderAccessor.wrap(session.getMessage());

        // lấy ra username
        String username = (String) headerAccessor.getSessionAttributes().get("username");
        if(username!=null){
            log.info("Username : " + username +" is disconnected");
            Chat chat = new Chat();
            chat.setType(Chat.MessageType.LEAVE);
            chat.setSender(username);
            simpMessage.convertAndSend("/topic/public-chat-room",chat);
        }
    }

}
