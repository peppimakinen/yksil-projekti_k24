CREATE USER 'kissa'@'localhost' IDENTIFIED BY 'kuoli';
GRANT ALL PRIVILEGES ON `HealthDiary`.* TO 'kissa'@'localhost';
FLUSH PRIVILEGES;
