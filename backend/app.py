from flask import Flask, request, jsonify
from flask_mysqldb import MySQL
from werkzeug.security import generate_password_hash, check_password_hash
import config

app = Flask(__name__)

# Load MySQL configuration
app.config['MYSQL_HOST'] = config.MYSQL_HOST
app.config['MYSQL_USER'] = config.MYSQL_USER
app.config['MYSQL_PASSWORD'] = config.MYSQL_PASSWORD
app.config['MYSQL_DB'] = config.MYSQL_DB

mysql = MySQL(app)


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
    username = data.get('username')
    password = data.get('pass')

    if not username or not password:
        return jsonify({'message': 'Username and password are required'}), 400

    try:
        cur = mysql.connection.cursor()
        cur.execute("SELECT pass FROM rs_user WHERE username = %s", (username,))
        user = cur.fetchone()
        cur.close()

        if not user or not check_password_hash(user[0], password):
            return jsonify({'message': 'Invalid username or password'}), 401

        return jsonify({'message': 'Login successful'}), 200
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


if __name__ == '__main__':
    app.run(debug=True)
