package nl.tudelft.bsg.utopolis.server.model;

import java.io.Serializable;
import java.util.List;

import javax.persistence.CascadeType;
import javax.persistence.Entity;
import javax.persistence.FetchType;
import javax.persistence.GeneratedValue;
import javax.persistence.Id;
import javax.persistence.OneToMany;
import javax.xml.bind.annotation.XmlElement;
import javax.xml.bind.annotation.XmlID;

import org.eclipse.persistence.oxm.annotations.XmlInverseReference;

@Entity
public class Province implements Serializable {
	private static final long serialVersionUID = 3634843961492433604L;
	
	@Id
	@GeneratedValue
	private int id;
	@OneToMany(cascade={CascadeType.ALL})
	@XmlElement
    @XmlInverseReference(mappedBy="province")
	private List<City> cities;
	private String name;

	public int getId() {
		return id;
	}

	public void setId(int id) {
		this.id = id;
	}

	public List<City> getCities() {
		return cities;
	}

	public void setCities(List<City> cities) {
		this.cities = cities;
	}

	public String getName() {
		return name;
	}

	public void setName(String name) {
		this.name = name;
	}
}
