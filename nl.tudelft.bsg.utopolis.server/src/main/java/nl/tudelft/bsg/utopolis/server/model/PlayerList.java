package nl.tudelft.bsg.utopolis.server.model;

import java.io.Serializable;
import java.util.List;

public class PlayerList implements Serializable {

	private static final long serialVersionUID = -2498852110972889364L;
	private List<Player> players;
	
	public PlayerList(){
		
	}
	
	public PlayerList(List<Player> players){
		this.players = players;
	}
	
	public List<Player> getPlayers() {
		return players;
	}
	public void setPlayers(List<Player> players) {
		this.players = players;
	}
	
	
}