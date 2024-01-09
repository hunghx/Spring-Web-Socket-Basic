package ra.websocketserver.model;

import lombok.Data;

@Data
public class Chat {
    private MessageType type;
    private String message,sender;
    public enum MessageType{
        JOIN,LEAVE,CHAT
    }
}
