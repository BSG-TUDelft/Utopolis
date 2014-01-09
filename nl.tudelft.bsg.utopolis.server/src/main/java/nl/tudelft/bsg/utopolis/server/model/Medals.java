package nl.tudelft.bsg.utopolis.server.model;

import java.io.Serializable;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.Id;

@Entity
public class Medals implements Serializable {

	private static final long serialVersionUID = -1620678937713469720L;

	@Id
	@GeneratedValue
	private int id;
	
	private boolean quest0Completed,
		quest1Completed,
		quest2Completed,
		quest3Completed,
		quest4Completed,
		quest5Completed;

	
	
	public Medals() {
		super();
	}



	public boolean isQuest0Completed() {
		return quest0Completed;
	}



	public void setQuest0Completed(boolean quest0Completed) {
		this.quest0Completed = quest0Completed;
	}



	public boolean isQuest1Completed() {
		return quest1Completed;
	}



	public void setQuest1Completed(boolean quest1Completed) {
		this.quest1Completed = quest1Completed;
	}



	public boolean isQuest2Completed() {
		return quest2Completed;
	}



	public void setQuest2Completed(boolean quest2Completed) {
		this.quest2Completed = quest2Completed;
	}



	public boolean isQuest3Completed() {
		return quest3Completed;
	}



	public void setQuest3Completed(boolean quest3Completed) {
		this.quest3Completed = quest3Completed;
	}



	public boolean isQuest4Completed() {
		return quest4Completed;
	}



	public void setQuest4Completed(boolean quest4Completed) {
		this.quest4Completed = quest4Completed;
	}



	public boolean isQuest5Completed() {
		return quest5Completed;
	}



	public void setQuest5Completed(boolean quest5Completed) {
		this.quest5Completed = quest5Completed;
	}

}
