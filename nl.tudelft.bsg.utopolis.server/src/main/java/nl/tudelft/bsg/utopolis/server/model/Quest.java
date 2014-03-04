package nl.tudelft.bsg.utopolis.server.model;

import java.io.Serializable;

import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.Id;

@Entity
public class Quest implements Serializable {
	private static final long serialVersionUID = 3634843961492433604L;
	
	@Id
	@GeneratedValue
	private int id;
	private int questId;
	private String name;
	private String banner;
	private String text;
	
	public int getId() {
		return id;
	}
	public void setId(int id) {
		this.id = id;
	}
	public int getQuestId() {
		return questId;
	}
	public void setQuestId(int questId) {
		this.questId = questId;
	}
	public String getName() {
		return name;
	}
	public void setName(String name) {
		this.name = name;
	}
	public String getBanner() {
		return banner;
	}
	public void setBanner(String banner) {
		this.banner = banner;
	}
	public String getText() {
		return text;
	}
	public void setText(String text) {
		this.text = text;
	}

}
