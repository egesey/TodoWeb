
CREATE DATABASE TodoWeb;
USE TodoWeb;

CREATE TABLE Worker (
id INT auto_increment PRIMARY KEY NOT NULL,
name VARCHAR(20) NOT NULL,
lastName VARCHAR(20) NOT NULL,
age INT NOT NULL,
nationality VARCHAR(50),
department VARCHAR(50) NOT NULL,
schoolGraduated VARCHAR(50),
projectsShortDescription text,
gender varchar(20),
beforeJobs VARCHAR(100)
);

INSERT INTO Worker (name, lastName, age, nationality, department, schoolGraduated, projectsShortDescription, gender, beforeJobs) VALUES 
('Mehmet', 'Yılmaz', 28, 'Turkey', 'Software Developer', 'ODTU', 'Developed TodoWeb project using React and C#, implemented CRUD operations successfully.', 'Male', 'TechnoSoft-(4 Years)'),

('Ayşe', 'Demir', 26, 'Turkey', 'Frontend Developer', 'ITU', 'Designed e-commerce website using HTML, CSS, and JavaScript with responsive layout.', 'Female', 'WebStudio-(2 Years)'),

('Can', 'Özkan', 30, 'Turkey', 'Backend Developer', 'Boğaziçi University', 'Built RESTful API using ASP.NET Core and SQL Server with microservices architecture.', 'Male', 'DataCorp-(5 Years)'),

('Zeynep', 'Kaya', 24, 'Turkey', 'UI/UX Designer', 'Bilkent University', 'Created mobile app interface design using Figma and Adobe XD with user-centered approach.', 'Female', 'DesignHub-(1 Year)'),

('Emre', 'Şahin', 32, 'Turkey', 'DevOps Engineer', 'ODTU', 'Implemented CI/CD pipeline using Docker, Kubernetes and Azure cloud services.', 'Male', 'CloudTech-(6 Years)'),

('Selin', 'Arslan', 27, 'Turkey', 'Database Administrator', 'Hacettepe University', 'Optimized database performance with PostgreSQL and MongoDB, reduced query time by 40%.', 'Female', 'DataSys-(3 Years)'),

('Burak', 'Çelik', 29, 'Turkey', 'Mobile Developer', 'YTU', 'Developed cross-platform app using React Native for iOS and Android platforms.', 'Male', 'MobileFirst-(4 Years)'),

('Merve', 'Yıldız', 25, 'Turkey', 'QA Engineer', 'ITU', 'Implemented test automation framework using Selenium and Jest, improved test coverage.', 'Female', 'TestLab-(2 Years)'),

('Oğuz', 'Polat', 31, 'Turkey', 'Data Scientist', 'Boğaziçi University', 'Built machine learning model using Python and TensorFlow for predictive analytics.', 'Male', 'AI Solutions-(5 Years)'),

('Elif', 'Güneş', 26, 'Turkey', 'Product Manager', 'ODTU', 'Created product roadmap and implemented Agile methodologies for team coordination.', 'Female', 'ProductCo-(3 Years)'),

('Tolga', 'Aktaş', 33, 'Turkey', 'System Administrator', 'Gazi University', 'Managed server infrastructure with Linux and Windows Server, ensured 99.9% uptime.', 'Male', 'SysOps-(7 Years)'),

('Deniz', 'Kılıç', 24, 'Turkey', 'Cybersecurity Specialist', 'Bilkent University', 'Conducted security analysis with penetration testing and firewall configuration.', 'Non-binary', 'SecureNet-(1 Year)'),

('Arda', 'Yaman', 28, 'Turkey', 'Software Architect', 'ITU', 'Designed microservices architecture using .NET Core and Redis for scalable applications.', 'Male', 'ArchTech-(4 Years)'),

('Gamze', 'Öztürk', 27, 'Turkey', 'Business Analyst', 'Hacettepe University', 'Analyzed business processes and created BPMN and UML diagrams for workflow optimization.', 'Female', 'BizAnalytics-(3 Years)'),

('Kaan', 'Doğan', 30, 'Turkey', 'Machine Learning Engineer', 'ODTU', 'Developed NLP model using Python, scikit-learn and NLTK for text processing.', 'Male', 'AI Labs-(5 Years)'),

('Pınar', 'Çakır', 25, 'Turkey', 'Frontend Developer', 'YTU', 'Built single-page application using Vue.js with TypeScript and Vuex state management.', 'Female', 'WebDev Plus-(2 Years)'),

('Serkan', 'Beyaz', 34, 'Turkey', 'Technical Lead', 'Boğaziçi University', 'Led development team, managed code reviews and mentoring processes for junior developers.', 'Male', 'LeadTech-(8 Years)'),

('Cansu', 'Mor', 26, 'Turkey', 'Data Engineer', 'ITU', 'Built ETL pipeline using Apache Spark and Kafka for real-time data processing.', 'Female', 'DataFlow-(3 Years)'),

('Murat', 'Kaplan', 29, 'Turkey', 'Game Developer', 'Bilkent University', 'Created 3D game using Unity engine with C# programming and Blender for 3D modeling.', 'Male', 'GameStudio-(4 Years)'),

('Burcu', 'Altın', 27, 'Turkey', 'Cloud Engineer', 'ODTU', 'Managed AWS infrastructure using Lambda, S3 and EC2 services for scalable solutions.', 'Female', 'CloudOps-(3 Years)');


CREATE TABLE Projects(
pid INT auto_increment PRIMARY KEY NOT NULL,
pName VARCHAR(50),
pGivenDate DATE,
pFinishDate DATE,
nameOfWorkerForProject1 VARCHAR(50),
nameOfWorkerForProject2 VARCHAR(50),
nameOfWorkerForProject3 VARCHAR(50),
nameOfWorkerForProject4 VARCHAR(50)
);

INSERT INTO Projects (pName, pGivenDate, pFinishDate, nameOfWorkerForProject1, nameOfWorkerForProject2, nameOfWorkerForProject3, nameOfWorkerForProject4) VALUES 
('TodoWeb Application', '2024-01-15', '2024-03-30', 'Mehmet Yılmaz', 'Ayşe Demir', 'Can Özkan', 'Zeynep Kaya'),

('E-Commerce Platform', '2024-02-01', '2024-05-15', 'Emre Şahin', 'Selin Arslan', 'Burak Çelik', 'Merve Yıldız'),

('RESTful API Development', '2024-01-20', '2024-04-10', 'Oğuz Polat', 'Elif Güneş', 'Tolga Aktaş', 'Deniz Kılıç'),

('Mobile App UI Design', '2024-03-01', '2024-04-30', 'Arda Yaman', 'Gamze Öztürk', 'Kaan Doğan', 'Pınar Çakır'),

('CI/CD Pipeline Implementation', '2024-02-15', '2024-06-01', 'Serkan Beyaz', 'Cansu Mor', 'Murat Kaplan', 'Burcu Altın');



