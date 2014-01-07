package nl.tudelft.bsg.utopolis.server.model;

import java.io.Serializable;
import java.util.List;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.Id;
import javax.persistence.OneToMany;

@Entity
public class Quest implements Serializable {
	private static final long serialVersionUID = -2506365812717003157L;

	@Id
	@GeneratedValue
	private int id;
	private String name;
	@OneToMany
	private List<QuestReq> requirements;

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

	public List<QuestReq> getRequirements() {
		return requirements;
	}

	public void setRequirements(List<QuestReq> requirements) {
		this.requirements = requirements;
	}
}
