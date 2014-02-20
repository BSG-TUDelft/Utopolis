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
	private float spirituality;
	private float safety;
	private float peace;
	private float diplomacy;
	private float economy;
	private float trade;

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
	
	public void add(Resources that, int citizens) {
		this.food += that.food * citizens;
		this.metal += that.metal * citizens;
		this.stone += that.stone * citizens;
		this.wood += that.wood * citizens;
		
		this.knowledge += that.knowledge * citizens;
		this.culture += that.culture * citizens;
		this.citizens += that.citizens * citizens;
		this.societal += that.societal * citizens;
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

	public int getId() {
		return id;
	}

	public void setId(int id) {
		this.id = id;
	}

	public float getSpirituality() {
		return spirituality;
	}

	public void setSpirituality(float spirituality) {
		this.spirituality = spirituality;
	}

	public float getSafety() {
		return safety;
	}

	public void setSafety(float safety) {
		this.safety = safety;
	}

	public float getPeace() {
		return peace;
	}

	public void setPeace(float peace) {
		this.peace = peace;
	}

	public float getDiplomacy() {
		return diplomacy;
	}

	public void setDiplomacy(float diplomacy) {
		this.diplomacy = diplomacy;
	}

	public float getEconomy() {
		return economy;
	}

	public void setEconomy(float economy) {
		this.economy = economy;
	}

	public float getTrade() {
		return trade;
	}

	public void setTrade(float trade) {
		this.trade = trade;
	}

}
