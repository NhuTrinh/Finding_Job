import os
from pymongo import MongoClient
from dotenv import load_dotenv

load_dotenv()

MONGO_URI = os.getenv("MONGODB_URI")
APP_PORT= os.getenv("APP_PORT")
ENV = os.getenv("ENV")

client = MongoClient(MONGO_URI)
db = client.get_default_database()

