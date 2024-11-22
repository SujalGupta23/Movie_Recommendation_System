from flask import Flask, request, jsonify
from flask_mysqldb import MySQL
from werkzeug.security import generate_password_hash, check_password_hash
from flask_cors import CORS
import pandas as pd
from sklearn.feature_extraction.text import CountVectorizer
from sklearn.metrics.pairwise import cosine_similarity
from nltk.stem.porter import PorterStemmer
import requests

import config

app = Flask(__name__)
CORS(app)  # Enable CORS for all routes

# Load MySQL configuration
app.config['MYSQL_HOST'] = config.MYSQL_HOST
app.config['MYSQL_USER'] = config.MYSQL_USER
app.config['MYSQL_PASSWORD'] = config.MYSQL_PASSWORD
app.config['MYSQL_DB'] = config.MYSQL_DB

mysql = MySQL(app)

movies = pd.read_csv("./preprocessing/movie_names.csv")
ps = PorterStemmer()

TMDB_API_KEY = config.TMDB_API_KEY
TMDB_IMAGE_BASE_URL = "https://image.tmdb.org/t/p/original"


def stem(text):
    return " ".join([ps.stem(word) for word in text.split()])


movies['tags'] = movies['tags'].apply(stem)

cv = CountVectorizer(max_features=5000, stop_words="english")
vector = cv.fit_transform(movies['tags']).toarray()
similarity = cosine_similarity(vector)


def fetch_poster_path(movie_id):
    try:
        url = f"https://api.themoviedb.org/3/movie/{
            movie_id}/images?api_key={TMDB_API_KEY}"
        response = requests.get(url)
        response.raise_for_status()  # Raise an exception for HTTP errors

        data = response.json()
        # Check if 'backdrops' exists and is non-empty
        if "backdrops" in data and len(data["backdrops"]) > 0:
            # Get the first file path
            file_path = data["backdrops"][0]["file_path"]
            return f"{TMDB_IMAGE_BASE_URL}{file_path}"
        else:
            return None  # Return None if no backdrops are found
    except Exception as e:
        print(f"Error fetching poster path: {e}")
        return None


@app.route('/')
def index():
    cur = mysql.connection.cursor()
    cur.execute('SELECT DATABASE();')
    data = cur.fetchone()
    cur.close()
    return f"Connected to database: {data[0]}"


@app.route('/register', methods=['POST'])
def register_user():
    data = request.get_json()
    username = data.get('username')
    email = data.get('email')
    password = data.get('pass')

    if not username or not email or not password:
        return jsonify({'message': 'Username, email, and password are required'}), 400

    # Hash the password for security
    hashed_password = generate_password_hash(password)

    try:
        cur = mysql.connection.cursor()
        cur.execute("INSERT INTO rs_user (username, email, pass) VALUES (%s, %s, %s)",
                    (username, email, hashed_password))
        mysql.connection.commit()
        cur.close()
        return jsonify({'message': 'User registered successfully'}), 201
    except Exception as e:
        return jsonify({'message': f'Database error: {e}'}), 500


@app.route('/login', methods=['POST'])
def login_user():
    data = request.get_json()
    email = data.get('email')
    password = data.get('pass')

    if not email or not password:
        return jsonify({'message': 'Email and password are required'}), 400

    try:
        cur = mysql.connection.cursor()

        # Fetch the user details along with hashed password
        cur.execute(
            "SELECT id, username, pass FROM rs_user WHERE email = %s", (email,))
        user = cur.fetchone()

        if not user or not check_password_hash(user[2], password):
            return jsonify({'message': 'Invalid email or password'}), 401

        user_id = user[0]
        username = user[1]

        # Fetch user's genre preferences
        cur.execute(
            "SELECT genre FROM preferences WHERE user_id = %s", (user_id,))
        preferences = [row[0] for row in cur.fetchall()]
        cur.close()

        # Respond with user details and preferences
        return jsonify({
            'message': 'Login successful',
            'user': {
                'id': user_id,
                'username': username,
                'email': email,
                'genres': preferences
            }
        }), 200
    except Exception as e:
        return jsonify({'message': f'Database error: {e}'}), 500


@app.route('/preferences', methods=['POST'])
def save_preferences():
    data = request.get_json()
    username = data.get('username')
    genres = data.get('genres', [])

    if not username or not genres:
        return jsonify({'message': 'Username and genres are required'}), 400

    try:
        cur = mysql.connection.cursor()

        # Get the user ID
        cur.execute("SELECT id FROM rs_user WHERE username = %s", (username,))
        user = cur.fetchone()

        if not user:
            return jsonify({'message': f'User {username} not found'}), 404

        user_id = user[0]

        # Clear existing preferences for the user
        cur.execute("DELETE FROM preferences WHERE user_id = %s", (user_id,))

        # Insert new preferences
        for genre in genres:
            cur.execute(
                "INSERT INTO preferences (user_id, genre) VALUES (%s, %s)", (user_id, genre))

        mysql.connection.commit()
        cur.close()

        return jsonify({'message': 'Preferences saved successfully'}), 200
    except Exception as e:
        return jsonify({'message': f'Database error: {e}'}), 500


@app.route('/movies', methods=['GET'])
def get_movies_by_preferences():
    # Extract the username or user_id from the request (adjust as needed)
    username = request.args.get('username')

    if not username:
        return jsonify({'message': 'Username is required'}), 400

    try:
        cur = mysql.connection.cursor()

        # Fetch user_id based on username
        cur.execute("SELECT id FROM rs_user WHERE username = %s", (username,))
        user = cur.fetchone()

        if not user:
            return jsonify({'message': f'User {username} not found'}), 404

        user_id = user[0]

        # Fetch preferred genres for the user
        cur.execute(
            "SELECT genre FROM preferences WHERE user_id = %s", (user_id,))
        genres = cur.fetchall()

        if not genres:
            return jsonify({'message': 'No preferred genres found for the user'}), 404

        # Flatten the list of genres
        genre_list = [genre[0] for genre in genres]

        # Fetch top 20 movies that match the preferred genres in the tags column
        query = """
        SELECT * FROM movies
        WHERE tags REGEXP %s
        LIMIT 20
        """
        genre_regex = '|'.join(
            genre_list)  # Create a regex pattern like "Rock|Jazz|Pop"
        cur.execute(query, (genre_regex,))
        movies = cur.fetchall()

        # Column names for movies table
        column_names = [desc[0] for desc in cur.description]

        # Convert fetched movies into a list of dictionaries
        movies_list = [dict(zip(column_names, movie)) for movie in movies]

        # Convert fetched movies into a list of dictionaries
        movies_list = []
        for movie in movies:
            movie_dict = dict(zip(column_names, movie))
            # Replace 'id' with the actual column for TMDB ID
            movie_id = movie_dict.get('movie_id')
            poster_path = fetch_poster_path(movie_id)
            movie_dict['poster_path'] = poster_path
            movies_list.append(movie_dict)

        cur.close()

        return jsonify({'movies': movies_list}), 200

    except Exception as e:
        return jsonify({'message': f'Database error: {e}'}), 500


@app.route('/recommend', methods=['POST'])
def recommend():
    data = request.json
    movie_title = data.get('title')
    if not movie_title:
        return jsonify({"error": "No title provided"}), 400

    try:
        index = movies[movies['title'].str.lower() ==
                       movie_title.lower()].index[0]
        distances = sorted(
            list(enumerate(similarity[index])), reverse=True, key=lambda x: x[1]
        )
        # Top 5 recommendations
        recommendations = []
        for i in distances[1:11]:
            movie_title = movies.iloc[i[0]].title
            # Replace with your TMDB ID column
            movie_id = movies.iloc[i[0]].movie_id
            poster_path = fetch_poster_path(movie_id)
            recommendations.append({
                "title": movie_title,
                "poster_path": poster_path
            })
        return jsonify({"recommendations": recommendations})
    except IndexError:
        return jsonify({"error": "Movie not found"}), 404


@app.route('/search-movies', methods=['GET'])
def search_movies():
    search_query = request.args.get('query', '')
    if not search_query:
        return jsonify({"message": "Query parameter is required"}), 400

    try:
        cur = mysql.connection.cursor()
        sql_query = "SELECT title FROM movies WHERE title LIKE %s"
        search_expression = f"%{search_query}%"
        cur.execute(sql_query, (search_expression,))
        results = cur.fetchall()

        titles = [row[0] for row in results]

        if titles:
            return jsonify({"titles": titles}), 200
        else:
            return jsonify({"titles": [], "message": "No movies match your search."}), 404
    except Exception as e:
        return jsonify({'message': f'Database error: {e}'}), 500


if __name__ == '__main__':
    app.run(debug=True)
