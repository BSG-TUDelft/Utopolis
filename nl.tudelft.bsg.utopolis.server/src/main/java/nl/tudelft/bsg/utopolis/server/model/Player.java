package nl.tudelft.bsg.utopolis.server.model;

import java.io.Serializable;
import java.util.List;

import javax.persistence.CascadeType;
import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.FetchType;
import javax.persistence.GeneratedValue;
import javax.persistence.Id;
import javax.persistence.OneToMany;

@Entity
public class Player implements Serializable {
	private static final long serialVersionUID = -2163415749308785051L;
	
	@Id
	@GeneratedValue
	private int id;
	private String name;
	private String nick;
	private String password;
	@OneToMany(cascade={CascadeType.ALL}, fetch = FetchType.EAGER)
	private List<Message> messages;

	public int getId() {
		return id;
	}

	public void setId(int id) {
		this.id = id;
	}

	public String getName() {
		return name;
	}

	public void setName(String name) {
		this.name = name;
	}

	public String getNick() {
		return nick;
	}

	public void setNick(String nick) {
		this.nick = nick;
	}
	
	public String getPassword() {
		return password;
	}

	public void setPassword(String password) {
		this.password = password;
	}

	public void setMessages(List<Message> messages) {
		this.messages = messages;
	}

	public void addMessage(Message message) {
		this.messages.add(message);
	}

	public void addMessages(List<Message> messages) {
		this.messages.addAll(messages);
	}
	
	public List<Message> getMessages() {
		return messages;
	}
	
}
