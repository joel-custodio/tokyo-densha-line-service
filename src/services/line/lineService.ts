import { IRouteQuery } from 'src/interface/line.interface';

const pool = require('./../../../db');

export async function queryTrainRoutes(
	startStationId: number,
	endStationId: number,
	sortingOption = 'least_stops'
) {
	try {
		const finalResult: IRouteQuery[] = [];
		const queryCommonLines = await pool.query(
			`
            SELECT station_id, ARRAY_AGG(line_id) AS line_ids
            FROM station_lines
            WHERE station_id IN ($1, $2)
            GROUP BY station_id
        `,
			[startStationId, endStationId]
		);
		const queryCommonLinesResult = queryCommonLines.rows[0].line_ids;

		if (queryCommonLinesResult.length > 0) {
			await Promise.all(
				queryCommonLinesResult.map(async (line: number) => {
					const result = await pool
						.query(
							`
                        SELECT station_order
                        FROM line_stations 
                        WHERE line_id = $1 AND station_id IN ($2, $3)
                    `,
							[line, startStationId, endStationId]
						)
						.then((res: any) => res.rows.map((row: any) => row.station_order));

					const stationsResult = await pool
						.query(
							`
                        SELECT station_id
                        FROM line_stations 
                        WHERE line_id = $1 AND station_order BETWEEN $2 AND $3
                        ORDER BY station_order
                        `,
							[line, startStationId, endStationId]
						)
						.then((res: any) => res.rows.map((row: any) => row.station_id));
					const numStops = Math.abs(result[0] - result[1]);
					finalResult.push({
						lineId: [line],
						numStops,
						stations: stationsResult,
					});
				})
			);
			console.log('final', finalResult);
		}
	} catch (error) {
		console.error('Error fetching train routes:', error);
		throw error;
	}
}

export async function getStations(lineId?: number) {
	const filterByLine = lineId ? `WHERE ls.line_id = ${lineId}` : '';
	const queryValue = lineId ? [lineId] : [];

	try {
		const result = await pool.query(
			`
				SELECT ls.station_id, s.name, COALESCE(ARRAY_AGG(ls.line_id), '{}') AS line_ids 
				FROM line_stations ls  
				JOIN stations s ON ls.station_id = s.id
				GROUP BY ls.station_id, s.name
				ORDER BY station_id
				${filterByLine}`,
			queryValue
		);
		return result.rows;
	} catch (error) {
		console.error(
			lineId
				? `Error retrieving stations for line id ${lineId}`
				: `Error retrieving all stations`
		);
		throw error;
	}
}
