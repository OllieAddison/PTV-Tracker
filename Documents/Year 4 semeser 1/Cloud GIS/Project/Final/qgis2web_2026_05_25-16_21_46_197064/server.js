const express = require('express');
const path = require('path');
const fetch = require('node-fetch');
const gtfsRealtimeBindings = require('gtfs-realtime-bindings');

const app = express();
const PORT = process.env.PORT || 3000;
const CACHE_TTL_MS = 30 * 1000; // 30 seconds

const API_KEYS = {
  KEYID_METRO: '65983c46-42f5-4fb6-a79f-77d3541c800f',
  KEYID_TRAM: '65983c46-42f5-4fb6-a79f-77d3541c800f',
  KEYID_VLINE: '65983c46-42f5-4fb6-a79f-77d3541c800f'
};

const FEEDS = {
  'metro-trip-updates': {
    url: 'https://api.opendata.transport.vic.gov.au/opendata/public-transport/gtfs/realtime/v1/metro/trip-updates',
    headerName: 'KeyId',
    keyEnv: 'KEYID_METRO',
    type: 'trip_updates'
  },
  'metro-vehicle-positions': {
    url: 'https://api.opendata.transport.vic.gov.au/opendata/public-transport/gtfs/realtime/v1/metro/vehicle-positions',
    headerName: 'KeyId',
    keyEnv: 'KEYID_METRO',
    type: 'vehicle_positions'
  },
  'tram-trip-updates': {
    url: 'https://api.opendata.transport.vic.gov.au/opendata/public-transport/gtfs/realtime/v1/tram/trip-updates',
    headerName: 'KeyId',
    keyEnv: 'KEYID_TRAM',
    type: 'trip_updates'
  },
  'tram-vehicle-positions': {
    url: 'https://api.opendata.transport.vic.gov.au/opendata/public-transport/gtfs/realtime/v1/tram/vehicle-positions',
    headerName: 'KeyId',
    keyEnv: 'KEYID_TRAM',
    type: 'vehicle_positions'
  },
  'vline-trip-updates': {
    url: 'https://api.opendata.transport.vic.gov.au/opendata/public-transport/gtfs/realtime/v1/vline/trip-updates',
    headerName: 'KeyId',
    keyEnv: 'KEYID_VLINE',
    type: 'trip_updates'
  },
  'vline-vehicle-positions': {
    url: 'https://api.opendata.transport.vic.gov.au/opendata/public-transport/gtfs/realtime/v1/vline/vehicle-positions',
    headerName: 'KeyId',
    keyEnv: 'KEYID_VLINE',
    type: 'vehicle_positions'
  }
};

const cache = {};

app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
  next();
});

app.use(express.static(path.join(__dirname)));

app.get('/api/gtfsr/:feed?', async (req, res) => {
  try {
    const feedName = req.params.feed || req.query.feed;
    if (!feedName) {
      return res.status(400).json({ error: 'Missing feed name. Use ?feed=metro-vehicle-positions or /api/gtfsr/metro-vehicle-positions' });
    }

    const feedConfig = FEEDS[feedName];
    if (!feedConfig) {
      return res.status(400).json({ error: `Unknown feed '${feedName}'. Valid values: ${Object.keys(FEEDS).join(', ')}` });
    }

    const now = Date.now();
    const feedCache = cache[feedName] || { ts: 0, data: null };
    if (feedCache.data && now - feedCache.ts < CACHE_TTL_MS) {
      return res.json({ feed: feedName, cached: true, data: feedCache.data });
    }

    const key = API_KEYS[feedConfig.keyEnv];
    if (!key) {
      return res.status(400).json({ error: `Missing API key for feed ${feedName}.` });
    }

    const response = await fetch(feedConfig.url, {
      headers: {
        [feedConfig.headerName]: key
      }
    });

    if (response.status === 429) {
      cache[feedName] = { ts: Date.now(), data: [] };
      return res.status(429).json({ error: 'Rate limited by upstream provider' });
    }

    if (!response.ok) {
      return res.status(response.status).json({ error: 'Upstream error fetching feed' });
    }

    const arrayBuffer = await response.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    const feed = gtfsRealtimeBindings.transit_realtime.FeedMessage.decode(buffer);

    const data = [];
    for (const entity of feed.entity || []) {
      if (!entity) continue;

      if (feedConfig.type === 'vehicle_positions' && entity.vehicle) {
        data.push(mapEntityToVehicle(entity));
      } else if (feedConfig.type === 'trip_updates' && entity.trip_update) {
        data.push(mapTripUpdate(entity));
      }
    }

    cache[feedName] = { ts: Date.now(), data };
    res.json({ feed: feedName, cached: false, data });
  } catch (err) {
    console.error('Error fetching/parsing feed', err);
    res.status(500).json({ error: 'Server error decoding GTFS Realtime feed' });
  }
});

function mapEntityToVehicle(entity) {
  const v = entity.vehicle || {};
  const vehicle = v.vehicle || {};
  const trip = v.trip || {};
  const position = v.position || {};

  return {
    entity_id: entity.id || null,
    id: vehicle.id || null,
    trip_id: trip.trip_id || null,
    route_id: trip.route_id || null,
    lat: position.latitude || null,
    lon: position.longitude || null,
    bearing: position.bearing || null,
    speed: position.speed || null,
    timestamp: v.timestamp || null,
    current_status: v.current_status || null,
    occupancy_status: v.occupancy_status || null
  };
}

function mapTripUpdate(entity) {
  const update = entity.trip_update || {};
  const trip = update.trip || {};
  const vehicle = update.vehicle || {};

  return {
    entity_id: entity.id || null,
    trip_id: trip.trip_id || null,
    route_id: trip.route_id || null,
    start_date: trip.start_date || null,
    schedule_relationship: trip.schedule_relationship || null,
    timestamp: update.timestamp || null,
    delay: update.delay || null,
    vehicle_id: vehicle.id || null,
    stop_time_updates: (update.stop_time_update || []).map(stu => ({
      stop_sequence: stu.stop_sequence || null,
      stop_id: stu.stop_id || null,
      schedule_relationship: stu.schedule_relationship || null,
      arrival: stu.arrival ? {
        delay: stu.arrival.delay || null,
        time: stu.arrival.time || null,
        uncertainty: stu.arrival.uncertainty || null
      } : null,
      departure: stu.departure ? {
        delay: stu.departure.delay || null,
        time: stu.departure.time || null,
        uncertainty: stu.departure.uncertainty || null
      } : null
    }))
  };
}

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

app.listen(PORT, () => {
  console.log(`qgis2web static server with GTFS proxy listening on http://localhost:${PORT}`);
  console.log('Available feeds:', Object.keys(FEEDS).join(', '));
});
