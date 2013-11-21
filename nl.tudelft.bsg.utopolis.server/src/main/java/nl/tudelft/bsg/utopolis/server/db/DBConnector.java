package nl.tudelft.bsg.utopolis.server.db;

import java.io.Serializable;
import java.util.List;

import org.hibernate.HibernateException;
import org.hibernate.Session;
import org.hibernate.SessionFactory;
import org.hibernate.Transaction;
import org.hibernate.cfg.Configuration;
import org.hibernate.service.ServiceRegistry;
import org.hibernate.service.ServiceRegistryBuilder;

public class DBConnector {
	private static DBConnector instance = null;

	private SessionFactory sessionFactory;
	private ServiceRegistry serviceRegistry;

	private Session session;

	private DBConnector() {
		sessionFactory = configureSessionFactory();
	}

	public static DBConnector get() {
		if (instance == null) {
			instance = new DBConnector();
		}
		return instance;
	}

	private SessionFactory configureSessionFactory() throws HibernateException {
		Configuration configuration = new Configuration();
		configuration.configure();
		serviceRegistry = new ServiceRegistryBuilder().applySettings(
				configuration.getProperties()).buildServiceRegistry();
		sessionFactory = configuration.buildSessionFactory(serviceRegistry);
		return sessionFactory;
	}

	private Session getSession() {
		if (session == null || !session.isOpen())
			session = openSession();
		return session;
	}

	private Session openSession() {
		return sessionFactory.openSession();
	}

	private void closeSession() {
		if (session != null && session.isOpen())
			session.close();
	}

	public void close() {
		session.close();
		sessionFactory.close();
	}

	public void save(Serializable object) {
		closeSession();
		Session session = openSession();
		Transaction transaction = null;
		try {
			transaction = session.beginTransaction();
			session.saveOrUpdate(object);
			transaction.commit();
		} catch (RuntimeException e) {
			System.err.println(e.getMessage());
			if (transaction != null)
				transaction.rollback();
		} finally {
			session.close();
		}
	}

	public void saveAll(List<? extends Serializable> objects) {
		closeSession();
		Session session = openSession();
		Transaction transaction = null;
		try {
			transaction = session.beginTransaction();
			for (Serializable object : objects)
				session.saveOrUpdate(object);
			transaction.commit();
		} catch (RuntimeException e) {
			System.err.println(e.getMessage());
			if (transaction != null)
				transaction.rollback();
		} finally {
			session.close();
		}
	}

	/*public Person getPerson(String email, String password) {
		Query query = getSession().createQuery(
				"from Person where email = :email ");
		query.setParameter("email", email);
		Person person = (Person) query.uniqueResult();
		String hash = Password.hash(password, person.getSalt());
		return hash.equals(person.getHashedPassword()) ? person : null;
	}*/

	/*public Submission getSubmission(int id) {
		Query query = getSession()
				.createQuery("from Submission where id = :id");
		query.setParameter("id", id);
		return (Submission) query.uniqueResult();
	}*/

	/*@SuppressWarnings("unchecked")
	public List<Journal> getJournals() {
		return getSession().createQuery("from Journal").list();
	}*/

	/*public long count(String table) {
		Criteria criteria = getSession().createCriteria(Submission.class);
		criteria.setProjection(Projections.rowCount());
		return (Long) criteria.uniqueResult();
	}*/

}
