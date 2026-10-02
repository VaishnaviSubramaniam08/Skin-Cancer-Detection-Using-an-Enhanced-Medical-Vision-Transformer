from motor.motor_asyncio import AsyncIOMotorClient
from pymongo import MongoClient
import os
from dotenv import load_dotenv

load_dotenv()

# MongoDB connection
MONGODB_URL = os.getenv("MONGODB_URL", "mongodb://localhost:27017")
DATABASE_NAME = os.getenv("DATABASE_NAME", "skin_cancer_db")

# Async client for FastAPI
async_client = AsyncIOMotorClient(MONGODB_URL)
async_database = async_client[DATABASE_NAME]

# Sync client for operations that need it
sync_client = MongoClient(MONGODB_URL)
sync_database = sync_client[DATABASE_NAME]


async def get_database():
    return async_database


def get_sync_database():
    return sync_database
