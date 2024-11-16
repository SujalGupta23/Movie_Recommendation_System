import pandas as pd
from flask import Flask
from flask_mysqldb import MySQL
import config

# Initialize Flask app and MySQL connection
app = Flask(__name__)

# Load MySQL configuration
app.config['MYSQL_HOST'] = config.MYSQL_HOST
# app.config['MYSQL_PORT'] = config.MYSQL_PORT
app.config['MYSQL_USER'] = config.MYSQL_USER
app.config['MYSQL_PASSWORD'] = config.MYSQL_PASSWORD
app.config['MYSQL_DB'] = config.MYSQL_DB

mysql = MySQL(app)

# Function to upload data from CSV to MySQL


def upload_data():
    # Read the CSV file into a DataFrame
    # Replace with the path to your CSV file
    df = pd.read_csv('./preprocessing/movie_names.csv')

    with app.app_context():
        cur = mysql.connection.cursor()

        for index, row in df.iterrows():
            movie_id = row['movie_id']
            title = row['title']
            tags = row['tags']

            # Insert data into the movies table
            cur.execute('''
                INSERT INTO movies (movie_id, title, tags)
                VALUES (%s, %s, %s)
            ''', (movie_id, title, tags))

        mysql.connection.commit()
        cur.close()
        print("Data uploaded successfully.")


if __name__ == '__main__':
    upload_data()
