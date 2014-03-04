package nl.tudelft.bsg.utopolis.server.model;

import java.io.Serializable;

import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.Id;


@Entity
public class QuestStatus implements Serializable {
	private static final long serialVersionUID = -2163415749308785051L;
	
	@Id
	@GeneratedValue
	private int id;
	private int questId;
	private int completed;
}