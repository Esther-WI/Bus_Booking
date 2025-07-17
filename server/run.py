from flask import Flask
from flask_migrate import Migrate
from flask_sqlalchemy import SQLAlchemy

app = Flask(__name__)
db = SQLAlchemy(app)
migrate= Migrate(app, db)

app.config['SQLALCHEMY_DATABASE_URI'] =

if __name__ == '__main__':
    app.run(debug=True)