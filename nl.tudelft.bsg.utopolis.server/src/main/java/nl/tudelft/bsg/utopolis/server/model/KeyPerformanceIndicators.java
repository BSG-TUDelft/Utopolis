package nl.tudelft.bsg.utopolis.server.model;

import java.io.Serializable;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.Id;

@Entity
public class KeyPerformanceIndicators implements Serializable {
	private static final long serialVersionUID = -4278843915595538628L;
	
	@Id
	@GeneratedValue
	private int id;
	
	private float happiness,
		population,
		technology,
		wealth,
		foreignRelations;

	
	
	public KeyPerformanceIndicators() {
		super();
	}

	public KeyPerformanceIndicators(float happiness, float population, float technology, float wealth, float foreignRelations) {
		super();

		this.happiness = happiness;
		this.population = population;
		this.technology = technology;
		this.wealth = wealth;
		this.foreignRelations = foreignRelations;
	}

	public float getHappiness() {
		return happiness;
	}
	public void setHappiness(float happiness) {
		this.happiness = happiness;
	}
	public float getPopulation() {
		return population;
	}
	public void setPopulation(float population) {
		this.population = population;
	}
	public float getTechnology() {
		return technology;
	}
	public void setTechnology(float technology) {
		this.technology = technology;
	}
	public float getWealth() {
		return wealth;
	}
	public void setWealth(float wealth) {
		this.wealth = wealth;
	}
	public float getForeignRelations() {
		return foreignRelations;
	}
	public void setForeignRelations(float foreignRelations) {
		this.foreignRelations = foreignRelations;
	}
		
	
}
