const pool = require('./../../db');

// Sample data to seed
const stations = [
	{ id: 1, name: 'Tokyo' },
	{ id: 2, name: 'Kanda' },
	{ id: 3, name: 'Akihabara' },
	{ id: 4, name: 'Okachimachi' },
	{ id: 5, name: 'Ueno' },
	{ id: 6, name: 'Uguisudani' },
	{ id: 7, name: 'Nippori' },
	{ id: 8, name: 'Nishi-Nippori' },
	{ id: 9, name: 'Tabata' },
	{ id: 10, name: 'Komagome' },
	{ id: 11, name: 'Sugamo' },
	{ id: 12, name: 'Ōtsuka' },
	{ id: 13, name: 'Ikebukuro' },
	{ id: 14, name: 'Mejiro' },
	{ id: 15, name: 'Takadanobaba' },
	{ id: 16, name: 'Shin-Ōkubo' },
	{ id: 17, name: 'Shinjuku' },
	{ id: 18, name: 'Yoyogi' },
	{ id: 19, name: 'Harajuku' },
	{ id: 20, name: 'Shibuya' },
	{ id: 21, name: 'Ebisu' },
	{ id: 22, name: 'Meguro' },
	{ id: 23, name: 'Gotanda' },
	{ id: 24, name: 'Osaki' },
	{ id: 25, name: 'Shinagawa' },
	{ id: 26, name: 'Takanawa Gateway' },
	{ id: 27, name: 'Tamachi' },
	{ id: 28, name: 'Hamamatsuchō' },
	{ id: 29, name: 'Shimbashi' },
	{ id: 30, name: 'Yūrakuchō' },
	{ id: 31, name: 'Ochanomizu' },
	{ id: 32, name: 'Yotsuya' },
	{ id: 33, name: 'Nakano' },
	{ id: 34, name: 'Koenji' },
	{ id: 35, name: 'Asagaya' },
	{ id: 36, name: 'Ogikubo' },
	{ id: 37, name: 'Nishi-Ogikubo' },
	{ id: 38, name: 'Mitaka' },
	{ id: 39, name: 'Kichijoji' },
	{ id: 40, name: 'Musashisakai' },
	{ id: 41, name: 'Higashi-Koganei' },
	{ id: 42, name: 'Musashi-Koganei' },
	{ id: 43, name: 'Kunitachi' },
	{ id: 44, name: 'Tachikawa' },
	{ id: 45, name: 'Hino' },
	{ id: 46, name: 'Toyoda' },
	{ id: 47, name: 'Hachioji' },
	{ id: 48, name: 'Nishi-Hachioji' },
	{ id: 49, name: 'Takao' },
	{ id: 50, name: 'Higashi-Nakano' },
	{ id: 51, name: 'Okubo' },
	{ id: 52, name: 'Sendagaya' },
	{ id: 53, name: 'Shinanomachi' },
	{ id: 54, name: 'Ichigaya' },
	{ id: 55, name: 'Iidabashi' },
	{ id: 56, name: 'Suidobashi' },
	{ id: 57, name: 'Asakusabashi' },
	{ id: 58, name: 'Ryogoku' },
	{ id: 59, name: 'Kameido' },
	{ id: 60, name: 'Hirai' },
	{ id: 61, name: 'Shinkoiwa' },
	{ id: 62, name: 'Koiwa' },
	{ id: 63, name: 'Ichikawa' },
	{ id: 64, name: 'Motoyawata' },
	{ id: 65, name: 'Shimousa-Nakayama' },
	{ id: 66, name: 'Funabashi' },
	{ id: 67, name: 'Higashi-Funabashi' },
	{ id: 68, name: 'Tsudanuma' },
	{ id: 69, name: 'Makuharihongō' },
	{ id: 70, name: 'Makuhari' },
	{ id: 71, name: 'Inage' },
	{ id: 72, name: 'Nishi-Chiba' },
	{ id: 73, name: 'Chiba' },
];

const lines = [
	{ line_id: 1, name: 'Yamanote Line' },
	{ line_id: 2, name: 'Chūō Line' },
	{ line_id: 3, name: 'Chūō-Sōbu Line' },
];

async function seedDatabase() {
	const client = await pool.connect();
	try {
		console.log('Seeding database - START');

		for (const station of stations) {
			const query = `
        INSERT INTO stations (id, name)
        VALUES ($1, $2)
        ON CONFLICT (id) 
        DO UPDATE SET name = EXCLUDED.name;
      `;

			await client.query(query, [station.id, station.name]);
		}
		for (const line of lines) {
			const query = `
        INSERT INTO train_lines (line_id, name)
        VALUES ($1, $2)
        ON CONFLICT (line_id) 
        DO UPDATE SET name = EXCLUDED.name;
      `;

			await client.query(query, [line.line_id, line.name]);
		}

		const stationLineQuery = `
		INSERT INTO station_lines (station_id, line_id)
		SELECT s.id, tl.line_id
		FROM stations s
		JOIN train_lines tl ON (
    	(tl.name = 'Yamanote Line' AND s.name IN ('Tokyo', 'Kanda', 'Akihabara', 'Okachimachi', 'Ueno', 'Uguisudani', 'Nippori', 'Nishi-Nippori', 'Tabata', 'Komagome', 'Sugamo', 'Ōtsuka', 'Ikebukuro', 'Mejiro', 'Takadanobaba', 'Shin-Ōkubo', 'Shinjuku', 'Yoyogi', 'Harajuku', 'Shibuya', 'Ebisu', 'Meguro', 'Gotanda', 'Osaki', 'Shinagawa', 'Tamachi', 'Hamamatsuchō', 'Shimbashi'))
    	OR (tl.name = 'Chūō Line' AND s.name IN ('Tokyo', 'Kanda', 'Ochanomizu', 'Yotsuya', 'Shinjuku', 'Nakano', 'Ogikubo', 'Kichijōji', 'Mitaka', 'Tachikawa', 'Hachiōji'))
    	OR (tl.name = 'Chūō-Sōbu Line' AND s.name IN ('Mitaka', 'Kichijōji', 'Nishi-Ogikubo', 'Ogikubo', 'Asagaya', 'Koenji', 'Nakano', 'Higashi-Nakano', 'Ōkubo', 'Shinjuku', 'Yoyogi', 'Sendagaya', 'Shinanomachi', 'Yotsuya', 'Ichigaya', 'Iidabashi', 'Suidōbashi', 'Ochanomizu', 'Akihabara', 'Asakusabashi', 'Ryōgoku', 'Kinshichō', 'Kameido', 'Nishi-Funabashi'))
		)
		ON CONFLICT DO NOTHING;
		`;
		await client.query(stationLineQuery);

		const lineStationQuery = `
		INSERT INTO line_stations (line_id, station_id, station_order)
		SELECT 
				sl.line_id, 
				sl.station_id, 
				ROW_NUMBER() OVER (PARTITION BY sl.line_id ORDER BY s.id) AS station_order
		FROM station_lines sl
		JOIN stations s ON sl.station_id = s.id
		ON CONFLICT DO NOTHING;
		`;
		await client.query(lineStationQuery);

		console.log('Seeding database - END');
	} catch (error) {
		console.error('Error seeding database:', error);
	} finally {
		client.release();
		pool.end(); // Close the pool
	}
}

// Run the script
seedDatabase();
