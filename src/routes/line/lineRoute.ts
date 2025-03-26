import { getStations, queryTrainRoutes } from '@services/line/lineService';
import { Request, Response, Router } from 'express';

export const lineRoute = Router();

// Query train route results
lineRoute.post('/query', async (req: Request, res: Response) => {
	const { startStationId, endStationId, sortingOption } = req.body;
	try {
		const result = await queryTrainRoutes(
			startStationId,
			endStationId,
			sortingOption
		);
		return result;
	} catch (err) {
		console.error(err);
	}
});

// Get all station details within the specified train line
lineRoute.post('/all', async (req: Request, res: Response) => {
	const { lineId } = req.body;
	try {
		const result = await getStations(lineId ?? null);
		console.log('##result', result);
		res.json({ data: result });
	} catch (err) {
		console.log(err);
	}
});
