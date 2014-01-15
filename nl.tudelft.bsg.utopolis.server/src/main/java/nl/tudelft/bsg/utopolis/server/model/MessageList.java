package nl.tudelft.bsg.utopolis.server.model;

import java.io.Serializable;
import java.util.List;

public class MessageList implements Serializable{
	private static final long serialVersionUID = 2563515326416092472L;
	
	private List<Message> messages;
	
	public MessageList(){
		
	}
	public MessageList(List<Message> messages){
		this.messages = messages;
	}
	
	public List<Message> getMessages() {
		return messages;
	}
	
	public void setMessages(List<Message> messages){
		this.messages = messages;
	}
}
