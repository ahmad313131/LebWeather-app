-- Create DB manually in phpMyAdmin: weather_app

CREATE TABLE IF NOT EXISTS regions (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(120) NOT NULL,
  `key` VARCHAR(120) NOT NULL,
  lat DECIMAL(10,7) NOT NULL,
  lon DECIMAL(10,7) NOT NULL,
  type VARCHAR(50) NOT NULL,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  UNIQUE KEY uq_regions_key (`key`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS admins (
  id INT AUTO_INCREMENT PRIMARY KEY,
  username VARCHAR(80) NOT NULL UNIQUE,
  password_hash VARCHAR(255) NULL,
  password_plain VARCHAR(255) NULL,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

INSERT INTO admins (username, password_plain)
SELECT 'admin', 'admin123'
WHERE NOT EXISTS (SELECT 1 FROM admins WHERE username='admin');

-- Seed Regions (Lebanon)
INSERT IGNORE INTO regions (name, `key`, lat, lon, type) VALUES
('Tripoli','Tripoli',34.4331000,35.8442000,'North'),
('Zgharta','Zgharta',34.3973000,35.8942000,'North'),
('Bcharre','Bcharre',34.2481000,35.9936000,'North'),
('Batroun','Batroun',34.2553000,35.6581000,'North'),
('Koura','Koura',34.3580000,35.7949000,'North'),
('Akkar','Akkar',34.5911000,36.0770000,'North'),
('Beirut','Beirut',33.8886000,35.4955000,'Center'),
('Jounieh','Jounieh',33.9808000,35.6175000,'Center'),
('Byblos (Jbeil)','Byblos',34.1230000,35.6519000,'Center'),
('Keserwan','Keserwan',34.0058000,35.6484000,'Center'),
('Baabda','Baabda',33.8339000,35.5442000,'Center'),
('Aley','Aley',33.8106000,35.6092000,'Center'),
('Chouf','Chouf',33.6833000,35.5833000,'Center'),
('Metn','Metn',33.9167000,35.6500000,'Center'),
('Saida (Sidon)','Saida',33.5606000,35.3750000,'South'),
('Tyre (Sour)','Tyre',33.2710000,35.2038000,'South'),
('Jezzine','Jezzine',33.5416000,35.5853000,'South'),
('Nabatieh','Nabatieh',33.3789000,35.4839000,'South'),
('Bint Jbeil','BintJbeil',33.1189000,35.4306000,'South'),
('Marjayoun','Marjayoun',33.3617000,35.5928000,'South'),
('Hasbaya','Hasbaya',33.3989000,35.6861000,'South'),
('Zahle','Zahle',33.8467000,35.9020000,'Bekaa'),
('Baalbek','Baalbek',34.0060000,36.2181000,'Bekaa'),
('Hermel','Hermel',34.3933000,36.3822000,'Bekaa'),
('Rashaya','Rashaya',33.5000000,35.8333000,'Bekaa');
