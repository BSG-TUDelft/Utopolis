package nl.tudelft.bsg.utopolis.server.model;

import java.io.Serializable;
import java.util.List;

import javax.persistence.CascadeType;
import javax.persistence.Entity;
import javax.persistence.Enumerated;
import javax.persistence.FetchType;
import javax.persistence.GeneratedValue;
import javax.persistence.Id;
import javax.persistence.ManyToOne;
import javax.persistence.OneToMany;
import javax.persistence.OneToOne;
import javax.xml.bind.annotation.XmlAccessorType;
import javax.xml.bind.annotation.XmlElement;
import javax.xml.bind.annotation.XmlIDREF;
import javax.xml.bind.annotation.XmlRootElement;

import org.eclipse.persistence.oxm.annotations.XmlInverseReference;


@Entity
//@XmlRootElement
public class City implements Serializable {
	private static final long serialVersionUID = -4755608870513621756L;
	
	@Id
	@GeneratedValue
	private int id;
	@OneToOne(cascade={CascadeType.ALL})
	private Player player;
	@OneToMany(cascade={CascadeType.ALL})
	private List<Structure> structures;
	private String name;
	private int numCitizens;
	private String color;
	@Enumerated
	private Race race;
	private int provinceId;
	 
    /*@XmlElement
	@XmlInverseReference(mappedBy="cities")
 	private Province province;*/
	
	// Leaderboard
	@OneToOne(cascade={CascadeType.ALL})
	private KeyPerformanceIndicators kpi;
	@OneToOne(cascade={CascadeType.ALL})
	private Medals medals;
	
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

	public List<Structure> getStructures() {
		return structures;
	}

	public void setStructures(List<Structure> structures) {
		this.structures = structures;
	}

	public String getName() {
		return name;
	}

	public void setName(String name) {
		this.name = name;
	}

	public int getNumCitizens() {
		return numCitizens;
	}

	public void setNumCitizens(int numCitizens) {
		this.numCitizens = numCitizens;
	}

	public String getColor() {
		return color;
	}

	public void setColor(String color) {
		this.color = color;
	}

	public Race getRace() {
		return race;
	}

	public void setRace(Race race) {
		this.race = race;
	}

	public KeyPerformanceIndicators getKpi() {
		return kpi;
	}

	public void setKpi(KeyPerformanceIndicators kpi) {
		this.kpi = kpi;
	}

	public Medals getMedals() {
		return medals;
	}

	public void setMedals(Medals medals) {
		this.medals = medals;
	}

	public int getProvinceId() {
		return provinceId;
	}

	public void setProvinceId(int provinceId) {
		this.provinceId = provinceId;
	}

	/*public Province getProvince() {
		return province;
	}

	public void setProvince(Province province) {
		this.province = province;
	}*/


}
