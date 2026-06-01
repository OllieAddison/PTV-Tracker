/**
 * GTFS Realtime integration for OpenLayers map
 * Fetches live vehicle positions from the local proxy server
 */

const GTFSRealtime = {
  map: null,
  sources: {},
  layerGroups: {},
  layers: {},
  pollIntervals: {},
  lastUpdateTime: {},
  POLL_INTERVAL: 15000,
  VEHICLE_TIMEOUT: 300000,

  FEED_LABELS: {
    'metro-vehicle-positions': 'Trains',
    'tram-vehicle-positions': 'Trams',
    'vline-vehicle-positions': 'V/Line'
  },

  FEED_COLORS: {
    metro: '26, 115, 232',
    tram: '52, 168, 83',
    vline: '155, 89, 182'
  },
  // Hex colours for the UI colour squares
  FEED_HEX: {
    metro: '#1a73e8',
    tram: '#34a853',
    vline: '#9b59b6'
  },

  /**
   * Initialize GTFS realtime on the map
   */
  init: function(map) {
    this.map = map;

    const feeds = ['metro-vehicle-positions', 'tram-vehicle-positions', 'vline-vehicle-positions'];
    feeds.forEach(feedName => {
      this.createFeedGroup(feedName);
      this.startPolling(feedName);
    });

    this.createToggleControls();
    console.log('GTFS Realtime initialized with feeds:', feeds.join(', '));
  },

  /**
   * Create the realtime toggle controls in the layer panel
   */
  createToggleControls: function() {
    // Wait for the layer panel to be available
    const checkPanel = setInterval(() => {
      const panel = document.querySelector('.layer-switcher .panel');
      if (panel) {
        clearInterval(checkPanel);
        this.injectToggleControls(panel);
      }
    }, 100);

    // Stop checking after 5 seconds
    setTimeout(() => clearInterval(checkPanel), 5000);
  },

  /**
   * Inject toggle controls into the layer panel
   */
  injectToggleControls: function(panel) {
    // Create container for realtime toggles
    const container = document.createElement('div');
    container.className = 'realtime-toggles-container';

    const feeds = ['metro-vehicle-positions', 'tram-vehicle-positions', 'vline-vehicle-positions'];

    feeds.forEach(feedName => {
      const item = document.createElement('div');
      item.className = 'realtime-toggle-item';

      const checkbox = document.createElement('input');
      checkbox.type = 'checkbox';
      // Use a clear, namespaced ID to avoid any collision with layer-switcher inputs
      checkbox.id = `realtime-toggle-${feedName}`;
      // Default checked state reflects the actual arrow/vector layer visibility if present
      const arrow = (this.arrowLayers && this.arrowLayers[feedName]) ? this.arrowLayers[feedName] : null;
      checkbox.checked = arrow ? !!arrow.getVisible() : true;
      // Only toggle the realtime vehicle vector layer (arrow layer) — no shared references
      checkbox.addEventListener('change', () => {
        if (arrow) {
          arrow.setVisible(checkbox.checked);
        }
      });

      // Wrap arrow.setVisible so external code cannot hide the arrow layer
      // while the realtime checkbox is checked. This prevents other filters
      // from hiding vehicle positions when the realtime toggle is active.
      if (arrow) {
        try {
          const originalSetVisible = arrow.setVisible.bind(arrow);
          // store original for potential future use
          arrow.__originalSetVisible = originalSetVisible;
          arrow.setVisible = function(v) {
            const cb = document.getElementById(`realtime-toggle-${feedName}`);
            // If the realtime toggle is checked, ignore attempts to hide
            if (cb && cb.checked && v === false) {
              return;
            }
            return originalSetVisible(v);
          };
        } catch (e) {
          // ignore wrapping errors
        }
      }

      const label = document.createElement('label');
      label.htmlFor = `toggle-${feedName}`;
      label.className = 'realtime-toggle-label';

      const colorSpan = document.createElement('span');
      colorSpan.className = 'realtime-color-indicator';
      // Use hex UI colours defined in FEED_HEX
      const feedType = feedName.split('-')[0];
      colorSpan.style.background = this.FEED_HEX[feedType] || this.getColorRGB(feedName);

      const titleSpan = document.createElement('span');
      titleSpan.textContent = this.FEED_LABELS[feedName];

      const countBadge = document.createElement('span');
      countBadge.className = 'realtime-count-badge';
      // Namespaced ID so updateFeedCount targets only these badges
      countBadge.id = `realtime-count-${feedName}`;
      countBadge.textContent = '0';

      label.appendChild(colorSpan);
      label.appendChild(titleSpan);
      label.appendChild(countBadge);

      item.appendChild(checkbox);
      item.appendChild(label);
      container.appendChild(item);
    });

    // Insert at the beginning of the panel
    if (panel.firstChild) {
      panel.insertBefore(container, panel.firstChild);
    } else {
      panel.appendChild(container);
    }
  },

  /**
   * Get color as RGB string (not in the rgba format)
   */
  getColorRGB: function(feedName) {
    const feedType = feedName.split('-')[0];
    const rgb = this.FEED_COLORS[feedType] || '0, 0, 0';
    return `rgb(${rgb})`;
  },

  createFeedGroup: function(feedName) {
    const arrowLayer = this.createVectorLayer(feedName);
    const feedLabel = this.FEED_LABELS[feedName] || feedName.replace(/-/g, ' ').toUpperCase();

    const group = new ol.layer.Group({
      title: null,
      layers: [arrowLayer]
    });

    group.setVisible(true);
    this.layerGroups[feedName] = group;
    this.layers[feedName] = group;
    this.arrowLayers = this.arrowLayers || {};
    this.arrowLayers[feedName] = arrowLayer;
    this.map.addLayer(group);
  },

  /**
   * Create a vector layer for a feed
   */
  createVectorLayer: function(feedName) {
    const source = new ol.source.Vector();
    this.sources[feedName] = source;

    const layer = new ol.layer.Vector({
      source: source,
      style: (feature) => this.getVehicleStyle(feature, feedName),
      updateWhileAnimating: true,
      updateWhileInteracting: true,
      zIndex: 999
    });

    layer.set('title', null);
    layer.setVisible(true);
    return layer;
  },

  /**
   * Get the base feed color as RGB string
   */
  getFeedColor: function(feedName) {
    const feedType = feedName.split('-')[0];
    return this.FEED_COLORS[feedType] || '0, 0, 0';
  },

  /**
   * Build a data URL for a rotated arrow icon
   */
  getArrowIconSource: function(color) {
    const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M12 2 L22 22 L12 17 L2 22 Z" fill="rgb(${color})" stroke="#ffffff" stroke-width="1.5" stroke-linejoin="round"/></svg>`;
    return `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`;
  },

  /**
   * Style function for vehicle features
   */
  getVehicleStyle: function(feature, feedName) {
    const vehicle = feature.get('vehicle');
    if (!vehicle) return null;

    const color = this.getFeedColor(feedName);
    return new ol.style.Style({
      image: new ol.style.Circle({
        radius: 9,
        fill: new ol.style.Fill({ color: `rgba(${color}, 0.95)` }),
        stroke: new ol.style.Stroke({ color: '#ffffff', width: 2 })
      })
    });
  },

  /**
   * Start polling a feed
   */
  startPolling: function(feedName) {
    this.fetchAndUpdate(feedName);
    this.pollIntervals[feedName] = setInterval(() => {
      this.fetchAndUpdate(feedName);
    }, this.POLL_INTERVAL);
  },

  /**
   * Stop polling a feed
   */
  stopPolling: function(feedName) {
    if (this.pollIntervals[feedName]) {
      clearInterval(this.pollIntervals[feedName]);
      delete this.pollIntervals[feedName];
    }
  },

  /**
   * Fetch vehicle data from proxy and update map
   */
  fetchAndUpdate: function(feedName) {
    const url = `http://localhost:3000/api/gtfsr/${feedName}`;

    fetch(url)
      .then(response => {
        if (!response.ok) {
          console.warn(`Feed ${feedName} error:`, response.status);
          return null;
        }
        return response.json();
      })
      .then(data => {
        if (!data || !data.data) return;

        this.updateVehicles(feedName, data.data);
        this.lastUpdateTime[feedName] = Date.now();
        console.log(`Updated ${feedName}: ${data.data.length} vehicles (cached: ${data.cached})`);
      })
      .catch(err => {
        console.error(`Error fetching ${feedName}:`, err);
      });
  },

  /**
   * Update vehicle features on the map
   */
  updateVehicles: function(feedName, vehicles) {
    const source = this.sources[feedName];
    if (!source) return;

    const now = Date.now();
    const currentVehicleIds = new Set();
    let visibleCount = 0;

    vehicles.forEach(vehicle => {
      if (!vehicle || vehicle.lon == null || vehicle.lat == null || !vehicle.id) return;

      currentVehicleIds.add(vehicle.id);
      visibleCount += 1;
      const featureId = `${feedName}:${vehicle.id}`;
      const coordinate = ol.proj.fromLonLat([vehicle.lon, vehicle.lat]);
      let feature = source.getFeatureById(featureId);

      if (!feature) {
        feature = new ol.Feature({
          geometry: new ol.geom.Point(coordinate),
          vehicle: vehicle
        });
        feature.setId(featureId);
        source.addFeature(feature);
      } else {
        feature.getGeometry().setCoordinates(coordinate);
        feature.set('vehicle', vehicle);
      }

      feature.set('feed', feedName);
      feature.set('lastUpdate', now);
    });

    source.getFeatures().forEach(feature => {
      const idParts = String(feature.getId()).split(':');
      const vehicleId = idParts.length > 1 ? idParts[1] : null;
      if (!vehicleId) return;
      const lastUpdate = feature.get('lastUpdate');
      if (lastUpdate && now - lastUpdate > this.VEHICLE_TIMEOUT) {
        source.removeFeature(feature);
      }
    });

    this.updateFeedCount(feedName, visibleCount);
  },

  updateFeedCount: function(feedName, count) {
    const countBadge = document.getElementById(`realtime-count-${feedName}`);
    if (countBadge) {
      countBadge.textContent = count;
    }
  },

  /**
   * Handle vehicle click for popup
   */
  handleVehicleClick: function(e, feedName) {
    const source = this.sources[feedName];
    if (!source) return;

    const features = source.getFeaturesAtCoordinate(e.coordinate);
    if (features.length === 0) return;

    const feature = features[0];
    const vehicle = feature.get('vehicle');
    if (!vehicle) return;

    const content = this.formatVehiclePopup(vehicle, feedName);
    this.showPopup(e.coordinate, content);
  },

  /**
   * Format vehicle information for popup
   */
  formatVehiclePopup: function(vehicle, feedName) {
    const label = this.FEED_LABELS[feedName] || feedName.toUpperCase();
    const timestamp = vehicle.timestamp ? new Date(vehicle.timestamp.low * 1000).toLocaleTimeString() : 'N/A';
    const bearing = vehicle.bearing ? vehicle.bearing.toFixed(1) : 'N/A';
    const speed = vehicle.speed ? vehicle.speed.toFixed(1) : 'N/A';

    return `
      <div style="font-family: Arial; font-size: 12px; width: 250px;">
        <h4 style="margin: 0 0 8px 0;">${label}</h4>
        <table style="width: 100%; border-collapse: collapse;">
          <tr><td><b>Vehicle ID:</b></td><td>${vehicle.id || 'N/A'}</td></tr>
          <tr><td><b>Trip ID:</b></td><td>${vehicle.trip_id || 'N/A'}</td></tr>
          <tr><td><b>Route ID:</b></td><td>${vehicle.route_id || 'N/A'}</td></tr>
          <tr><td><b>Latitude:</b></td><td>${vehicle.lat?.toFixed(5) || 'N/A'}</td></tr>
          <tr><td><b>Longitude:</b></td><td>${vehicle.lon?.toFixed(5) || 'N/A'}</td></tr>
          <tr><td><b>Bearing:</b></td><td>${bearing}°</td></tr>
          <tr><td><b>Speed:</b></td><td>${speed} m/s</td></tr>
          <tr><td><b>Timestamp:</b></td><td>${timestamp}</td></tr>
          <tr><td><b>Occupancy:</b></td><td>${vehicle.occupancy_status || 'N/A'}</td></tr>
        </table>
      </div>
    `;
  },

  /**
   * Show popup at coordinate
   */
  showPopup: function(coordinate, html) {
    const popupContent = document.getElementById('popup-content');
    const popupElement = document.getElementById('popup');

    if (!popupContent || !popupElement) return;

    popupContent.innerHTML = html;

    const overlay = this.map.getOverlays().getArray().find(o => o.getElement() === popupElement);
    if (overlay) {
      overlay.setPosition(coordinate);
    }
  },

  /**
   * Cleanup and stop all polling
   */
  destroy: function() {
    Object.keys(this.pollIntervals).forEach(feedName => {
      this.stopPolling(feedName);
    });
  }
};

// Auto-init when map is ready
(function waitForMap() {
  if (typeof map !== 'undefined' && map instanceof ol.Map) {
    GTFSRealtime.init(map);
  } else {
    setTimeout(waitForMap, 250);
  }
})();
