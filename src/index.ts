import express, { Express, Request, Response } from 'express';
import dotenv from 'dotenv';
import { routes } from './routes';

const pool = require('./../db');
const cors = require('cors');

dotenv.config();

const app: Express = express();
const port = process.env.PORT || 3000;

// Test the database connection
const connectToDB = async () => {
	try {
		const client = await pool.connect();
		console.log('✅ Connected to PostgreSQL');
		client.release(); // Release the client back to the pool
	} catch (error: any) {
		console.error('❌ Database connection error:', error.message);
	}
};

connectToDB();

// routes
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/', routes);

app.get('/', (req: Request, res: Response) => {
	res.send('Express + TypeScript Server');
});

app.listen(port, () => {
	console.log(`[server]: Server is running at http://localhost:${port}`);
	// const startStationId = 1; // Replace with actual station ID
	// const endStationId = 5; // Replace with actual station ID
	// queryTrainRoutes(startStationId, endStationId, 'least_stops')
	// 	.then((routes) => console.log('🚆 Available Routes:', routes))
	// 	.catch((err) => console.error('❌ Failed to fetch routes:', err));
	// getStationsByLine();
});
