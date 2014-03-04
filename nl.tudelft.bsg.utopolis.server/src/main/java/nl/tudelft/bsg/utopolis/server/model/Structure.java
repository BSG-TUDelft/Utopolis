package nl.tudelft.bsg.utopolis.server.model;

import java.io.Serializable;

import javax.persistence.Entity;
import javax.persistence.Enumerated;
import javax.persistence.GeneratedValue;
import javax.persistence.Id;
import javax.persistence.Transient;

@Entity
public class Structure implements Serializable {
	private static final long serialVersionUID = -1982308513163668151L;
	
	@Id
	@GeneratedValue
	private int id;

//	@Enumerated
//	private Race race;
	private String structureId;
	@Transient
	private StructureType structType;	
	private double x;
	private double y;
	private double z;
	private double rotation;
	private int numCitizens;
	private int maxCitizens;

	public int getId() {
		return id;
	}

	public void setId(int id) {
		this.id = id;
	}
	
	public String getStructureId() {
		return structureId;
	}

	public void setStructureId(String structureId) {
		this.structureId = structureId;
	}

	public StructureType getStructType() {
		if(structureId.endsWith("house"))
			return StructureType.house;
		if(structureId.endsWith("farm"))
			return StructureType.farm;
		if(structureId.endsWith("corral"))
			return StructureType.corral;
		if(structureId.endsWith("storehouse"))
			return StructureType.storehouse;
		if(structureId.endsWith("market"))
			return StructureType.market;
		if(structureId.endsWith("blacksmith"))
			return StructureType.blacksmith;
		if(structureId.endsWith("barracks"))
			return StructureType.barracks;
		if(structureId.endsWith("civic"))
			return StructureType.civic_center;
		if(structureId.endsWith("fortress"))
			return StructureType.fortress;
		if(structureId.endsWith("tower"))
			return StructureType.tower;
		if(structureId.endsWith("temple"))
			return StructureType.temple;

		return structType;
	}

	
	public double getX() {
		return x;
	}

	public void setX(double x) {
		this.x = x;
	}

	public double getY() {
		return y;
	}

	public void setY(double y) {
		this.y = y;
	}

	public double getZ() {
		return z;
	}

	public void setZ(double z) {
		this.z = z;
	}

	public double getRotation() {
		return rotation;
	}

	public void setRotation(double rotation) {
		this.rotation = rotation;
	}

	public int getNumCitizens() {
		return numCitizens;
	}

	public void setNumCitizens(int numCitizens) {
		this.numCitizens = numCitizens;
	}

	public int getMaxCitizens() {
		return maxCitizens;
	}

	public void setMaxCitizens(int maxCitizens) {
		this.maxCitizens = maxCitizens;
	}

}
