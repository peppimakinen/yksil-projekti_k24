DROP DATABASE IF EXISTS HealthDiary;
CREATE DATABASE HealthDiary;
USE HealthDiary;

-- Create a table for users
CREATE TABLE Users (
    user_id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(50) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    email VARCHAR(100) NOT NULL UNIQUE,
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    user_level VARCHAR(10) NOT NULL DEFAULT 'regular'
);

-- Create a table for nausea entries
CREATE TABLE NauseaEntries (
    entry_id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    entry_date DATE NOT NULL,
    severity ENUM('Mild', 'Moderate', 'Severe'),
    triggers VARCHAR(500),
    duration_hours INT,
    other_symptoms TEXT,
    FOREIGN KEY (user_id) REFERENCES Users(user_id)
);

-- Create a table for foor and drink intake
CREATE TABLE NutritionIntake (
    nutrition_id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    nutrition_date DATE NOT NULL,
    food_eaten VARCHAR(500),
    drinks VARCHAR(500),
    water_liters DECIMAL(10, 2),
    notes TEXT,
    FOREIGN KEY (user_id) REFERENCES Users(user_id)
);

-- INSERT User sample data
-- Iserting multiple user rows at once
INSERT INTO Users (username, password, email, user_level) VALUES
  ('johndoe', 'temp-pw-1', 'johndoe@example.com', 'regular'),
  ('janedoe', 'temp-pw-2', 'janedoe@example.com', 'admin'),
  ('mike_smith', 'temp-pw-3', 'mike@example.com', 'moderator');


-- Inserting multiple nausea entries
INSERT INTO NauseaEntries (user_id, entry_date, severity, triggers, duration_hours, other_symptoms) VALUES
  (1, '2024-01-10', 'Mild', 'Did not sleep well', 2, 'Dizziness'),
  (1, '2024-01-11', 'Severe', 'Forgot to eat and did not sleep well', 6, 'Stomachache and dizziness'),
  (2, '2024-01-10', 'Moderate', 'Forgot to drink water', 4, 'Headache');

-- Inserting sample nutrition data
INSERT INTO NutritionIntake (user_id, nutrition_date, food_eaten, drinks, water_liters, notes) VALUES
  (1, '2024-01-10', 'Lunch and dinner', 'Battery and Vichy', 1.5, 'No other notes'),
  (1, '2024-01-11', 'Lunch and snacking throughout the day', 'Small sprite', 2, 'Was too tired to make dinner'),
  (2, '2024-01-10', 'Breakfast, lunch and a snack', 'An iced latte', 1.8, 'Was not hungry at dinner time');


-- Example queries
SELECT Users.username, NauseaEntries.entry_date, NauseaEntries.severity, NauseaEntries.triggers
  FROM Users, NauseaEntries
  WHERE NauseaEntries.user_id = Users.user_id;

-- Same with JOIN
SELECT Users.username, NauseaEntries.entry_date, NauseaEntries.severity, NauseaEntries.triggers
  FROM Users JOIN NauseaEntries ON NauseaEntries.user_id = Users.user_id;

-- Entries for specific username
SELECT entry_date, severity, other_symptoms FROM NauseaEntries
  JOIN Users ON NauseaEntries.user_id = Users.user_id
  WHERE username = 'johndoe';

-- Example query to retrieve exercise data along with user information
SELECT Users.username, NutritionIntake.nutrition_date, NutritionIntake.food_eaten, NutritionIntake.water_liters
  FROM Users JOIN NutritionIntake ON NutritionIntake.user_id = Users.user_id;
