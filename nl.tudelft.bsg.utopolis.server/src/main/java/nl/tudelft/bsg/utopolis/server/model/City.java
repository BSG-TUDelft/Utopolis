package nl.tudelft.bsg.utopolis.server.model;

import java.io.Serializable;
import java.util.List;

import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.Id;
import javax.persistence.OneToMany;
import javax.persistence.OneToOne;

@Entity
public class City implements Serializable {
	private static final long serialVersionUID = -4755608870513621756L;
	
	@Id
	@GeneratedValue
	private int id;
	@OneToOne
	private Player player;
	@OneToMany
	private List<Structure> buildings;
	private String name;

	public City() {
	}
	
	public int getId() {
		return id;
	}

	public void setId(int id) {
		this.id = id;
	}

	public Player getPlayer() {
		return player;
	}

	public void setPlayer(Player player) {
		this.player = player;
	}

	public List<Structure> getBuildings() {
		return buildings;
	}

	public void setBuildings(List<Structure> buildings) {
		this.buildings = buildings;
	}

	public String getName() {
		return name;
	}

	public void setName(String name) {
		this.name = name;
	}
	
}
