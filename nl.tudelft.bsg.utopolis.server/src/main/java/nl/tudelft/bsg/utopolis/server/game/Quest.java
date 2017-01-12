package nl.tudelft.bsg.utopolis.server.game;

import java.util.HashMap;

import nl.tudelft.bsg.utopolis.server.model.StructureType;

public class Quest {
	private String id;
	private HashMap<StructureType, Integer> requirements;
	
	public String getId() {
		return id;
	}
	
	public void setId(String id) {
		this.id = id;
	}
	
	public HashMap<StructureType, Integer> getRequirements() {
		return requirements;
	}
	
	public void setRequirements(HashMap<StructureType, Integer> requirements) {
		this.requirements = requirements;
	}

	public void addRequirement(StructureType type, int value){
		if(requirements == null)
			requirements = new HashMap<StructureType, Integer>();
		
		requirements.put(type, value);
	}
}


