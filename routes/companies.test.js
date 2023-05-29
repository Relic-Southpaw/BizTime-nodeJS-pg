// Tell Node that we're in test "mode"

// currently can't get server to start to authentication issue


process.env.NODE_ENV = 'test';

const request = require('supertest');
const app = require('../app');
const db = require('../db');
