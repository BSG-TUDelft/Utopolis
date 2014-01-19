package nl.tudelft.bsg.utopolis.server.model;

import java.io.Serializable;

import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.Id;

@Entity
public class Resources implements Serializable {
	private static final long serialVersionUID = 3141736239170151879L;

	@Id
	@GeneratedValue
	private int id;
	
	private float food;
	private float metal;
	private float stone;
	private float wood;

	private float knowledge;
	private float culture;
	private float citizens;
	private float societal;

	public Resources() {
		this.food = 0.0f;
		this.metal = 0.0f;
		this.stone = 0.0f;
		this.wood = 0.0f;

		this.knowledge = 0.0f;
		this.culture = 0.0f;
		this.citizens = 0.0f;
		this.societal = 0.0f;
	}

	public Resources(float food, float metal, float stone, float wood,
			float knowledge, float culture, float citizens, float societal) {
		this.food = food;
		this.metal = metal;
		this.stone = stone;
		this.wood = wood;

		this.knowledge = knowledge;
		this.culture = culture;
		this.citizens = citizens;
		this.societal = societal;
	}
	
	public void add(Resources that) {
		this.food += that.food;
		this.metal += that.metal;
		this.stone += that.stone;
		this.wood += that.wood;
		
		this.knowledge += that.knowledge;
		this.culture += that.culture;
		this.citizens += that.citizens;
		this.societal += that.societal;
	}

	public float getFood() {
		return food;
	}

	public void setFood(float food) {
		this.food = food;
	}

	public float getMetal() {
		return metal;
	}

	public void setMetal(float metal) {
		this.metal = metal;
	}

	public float getStone() {
		return stone;
	}

	public void setStone(float stone) {
		this.stone = stone;
	}

	public float getWood() {
		return wood;
	}

	public void setWood(float wood) {
		this.wood = wood;
	}

	public float getKnowledge() {
		return knowledge;
	}

	public void setKnowledge(float knowledge) {
		this.knowledge = knowledge;
	}

	public float getCulture() {
		return culture;
	}

	public void setCulture(float culture) {
		this.culture = culture;
	}

	public float getCitizens() {
		return citizens;
	}

	public void setCitizens(float citizens) {
		this.citizens = citizens;
	}

	public float getSocietal() {
		return societal;
	}

	public void setSocietal(float societal) {
		this.societal = societal;
	}

}
