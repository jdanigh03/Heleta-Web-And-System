import os


class Config:
    SECRET_KEY = os.environ.get('SECRET_KEY') or 'heleta-secret-key-dev'
    DEBUG = os.environ.get('FLASK_DEBUG') or True
