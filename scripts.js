// Mock data for balloons - expanded with global locations and country information
const balloons = [
    // North America
    { id: "B-1001", lat: 40.7128, lng: -74.0060, altitude: 1250, aqi: 42, country: "USA" },
    { id: "B-1002", lat: 34.0522, lng: -118.2437, altitude: 980, aqi: 87, country: "USA" },
    { id: "B-1003", lat: 41.8781, lng: -87.6298, altitude: 1100, aqi: 35, country: "USA" },
    { id: "B-1004", lat: 29.7604, lng: -95.3698, altitude: 1320, aqi: 110, country: "USA" },
    { id: "B-1005", lat: 39.9526, lng: -75.1652, altitude: 890, aqi: 65, country: "USA" },
    { id: "B-1006", lat: 33.4484, lng: -112.0740, altitude: 1450, aqi: 95, country: "USA" },
    { id: "B-1007", lat: 32.7157, lng: -117.1611, altitude: 1050, aqi: 48, country: "USA" },
    { id: "B-1008", lat: 37.7749, lng: -122.4194, altitude: 1200, aqi: 72, country: "USA" },
    { id: "B-1009", lat: 47.6062, lng: -122.3321, altitude: 980, aqi: 38, country: "USA" },
    { id: "B-1010", lat: 39.7392, lng: -104.9903, altitude: 1600, aqi: 55, country: "USA" },
    
    // Europe
    { id: "B-2001", lat: 51.5074, lng: -0.1278, altitude: 1100, aqi: 45, country: "UK" },
    { id: "B-2002", lat: 48.8566, lng: 2.3522, altitude: 950, aqi: 68, country: "France" },
    { id: "B-2003", lat: 52.5200, lng: 13.4050, altitude: 1050, aqi: 52, country: "Germany" },
    { id: "B-2004", lat: 41.9028, lng: 12.4964, altitude: 1200, aqi: 78, country: "Italy" },
    { id: "B-2005", lat: 40.4168, lng: -3.7038, altitude: 1350, aqi: 92, country: "Spain" },
    { id: "B-2006", lat: 55.7558, lng: 37.6173, altitude: 980, aqi: 115, country: "Russia" },
    
    // Asia
    { id: "B-3001", lat: 35.6762, lng: 139.6503, altitude: 1150, aqi: 88, country: "Japan" },
    { id: "B-3002", lat: 22.3193, lng: 114.1694, altitude: 850, aqi: 125, country: "Hong Kong" },
    { id: "B-3003", lat: 31.2304, lng: 121.4737, altitude: 920, aqi: 132, country: "China" },
    { id: "B-3004", lat: 39.9042, lng: 116.4074, altitude: 1050, aqi: 145, country: "China" },
    { id: "B-3005", lat: 28.6139, lng: 77.2090, altitude: 1200, aqi: 165, country: "India" },
    { id: "B-3006", lat: 13.7563, lng: 100.5018, altitude: 980, aqi: 75, country: "Thailand" },
    
    // Australia & Oceania
    { id: "B-4001", lat: -33.8688, lng: 151.2093, altitude: 1100, aqi: 32, country: "Australia" },
    { id: "B-4002", lat: -37.8136, lng: 144.9631, altitude: 1050, aqi: 28, country: "Australia" },
    { id: "B-4003", lat: -41.2865, lng: 174.7762, altitude: 1200, aqi: 18, country: "New Zealand" },
    
    // South America
    { id: "B-5001", lat: -22.9068, lng: -43.1729, altitude: 1150, aqi: 62, country: "Brazil" },
    { id: "B-5002", lat: -34.6037, lng: -58.3816, altitude: 980, aqi: 58, country: "Argentina" },
    { id: "B-5003", lat: -33.4489, lng: -70.6693, altitude: 1250, aqi: 85, country: "Chile" },
    
    // Africa
    { id: "B-6001", lat: 30.0444, lng: 31.2357, altitude: 1050, aqi: 105, country: "Egypt" },
    { id: "B-6002", lat: -33.9249, lng: 18.4241, altitude: 1200, aqi: 42, country: "South Africa" },
    { id: "B-6003", lat: -1.2921, lng: 36.8219, altitude: 1350, aqi: 68, country: "Kenya" },
    
    // Arctic & Antarctic
    { id: "B-7001", lat: 78.2232, lng: 15.6267, altitude: 1500, aqi: 12, country: "Norway" }, // Svalbard
    { id: "B-7002", lat: -77.8500, lng: 166.6667, altitude: 1800, aqi: 8, country: "Antarctica" }  // McMurdo Station
];

// Global variables
let activeBalloon = null;
let map = null;
let markers = {};

// Helper function to get AQI category and color
function getAqiInfo(aqi) {
    if (aqi <= 50) {
      return { category: "Good", className: "aqi-good", color: "#2ecc71" };
    } else if (aqi <= 100) {
      return { category: "Moderate", className: "aqi-moderate", color: "#f39c12" };
    } else {
      return { category: "Unhealthy", className: "aqi-unhealthy", color: "#e74c3c" };
    }
}

// Create balloon list item
function createBalloonItem(balloon) {
    const aqiInfo = getAqiInfo(balloon.aqi);
    
    const balloonItem = document.createElement('div');
    balloonItem.className = `balloon-item ${activeBalloon && activeBalloon.id === balloon.id ? 'active' : ''}`;
    balloonItem.dataset.id = balloon.id;
    
    const balloonId = document.createElement('div');
    balloonId.className = 'balloon-id';
    
    const idSpan = document.createElement('span');
    idSpan.textContent = `ID: ${balloon.id}`;
    
    const aqiSpan = document.createElement('span');
    aqiSpan.innerHTML = `AQI: ${balloon.aqi} <span class="aqi-indicator ${aqiInfo.className}"></span>`;
    
    balloonId.appendChild(idSpan);
    balloonId.appendChild(aqiSpan);
    
    const balloonDetails = document.createElement('div');
    balloonDetails.className = 'balloon-details';
    
    balloonDetails.innerHTML = `
      <div class="detail-item">
        <span class="detail-label">Lat:</span>
        <span>${balloon.lat.toFixed(4)}</span>
      </div>
      <div class="detail-item">
        <span class="detail-label">Lng:</span>
        <span>${balloon.lng.toFixed(4)}</span>
      </div>
      <div class="detail-item">
        <span class="detail-label">Alt:</span>
        <span>${balloon.altitude}m</span>
      </div>
      <div class="detail-item">
        <span class="detail-label">Country:</span>
        <span>${balloon.country}</span>
      </div>
    `;
    
    balloonItem.appendChild(balloonId);
    balloonItem.appendChild(balloonDetails);
    
    balloonItem.addEventListener('click', () => {
        handleBalloonClick(balloon);
    });
    
    return balloonItem;
}

// Render balloon list
function renderBalloonList(searchTerm = '') {
    const balloonListElement = document.getElementById('balloon-list');
    balloonListElement.innerHTML = '';
    
    const filteredBalloons = balloons.filter(balloon => 
        balloon.id.toLowerCase().includes(searchTerm.toLowerCase()) || 
        balloon.country.toLowerCase().includes(searchTerm.toLowerCase())
    );
    
    if (filteredBalloons.length > 0) {
        filteredBalloons.forEach(balloon => {
            const balloonItem = createBalloonItem(balloon);
            balloonListElement.appendChild(balloonItem);
        });
    } else {
        const noResults = document.createElement('div');
        noResults.className = 'no-results';
        noResults.textContent = 'No balloons found';
        balloonListElement.appendChild(noResults);
    }
}

// Initialize map
function initMap() {
    map = L.map('map', {
        worldCopyJump: false,
        maxBounds: [[-90, -180], [90, 180]], // Restrict panning to one world copy
        minZoom: 1
    }).setView([20, 0], 2); // Centered on the world
    
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
        noWrap: true // Prevent the world from repeating horizontally
    }).addTo(map);
    
    // Add markers for all balloons
    balloons.forEach(balloon => {
        addBalloonMarker(balloon);
    });
}

// Add balloon marker to map
function addBalloonMarker(balloon) {
    const aqiInfo = getAqiInfo(balloon.aqi);
    
    // Create custom marker
    const markerIcon = L.divIcon({
        className: 'balloon-marker',
        html: `<div style="background-color: ${aqiInfo.color}; width: 100%; height: 100%; display: flex; align-items: center; justify-content: center; border-radius: 50%;">🎈</div>`,
        iconSize: [30, 30]
    });
    
    const marker = L.marker([balloon.lat, balloon.lng], { icon: markerIcon }).addTo(map);
    
    // Create tooltip content
    const tooltipContent = document.createElement('div');
    tooltipContent.className = 'tooltip-content';
    tooltipContent.innerHTML = `
      <div class="tooltip-title">${balloon.id} - ${balloon.country}</div>
      <div class="tooltip-details">
        <div class="tooltip-label">AQI:</div>
        <div class="tooltip-value">${balloon.aqi} <span class="aqi-indicator ${aqiInfo.className}"></span></div>
      </div>
    `;
    
    // Create tooltip and bind to marker
    const tooltip = L.tooltip({
        direction: 'top',
        permanent: false,
        opacity: 1,
        interactive: false,
        className: 'balloon-tooltip'
    });
    
    tooltip.setContent(tooltipContent);
    
    // Show tooltip on hover
    marker.on('mouseover', function() {
        marker.bindTooltip(tooltip).openTooltip();
    });
    
    // Close tooltip when mouse leaves
    marker.on('mouseout', function() {
        marker.closeTooltip();
    });
    
    // Click handler
    marker.on('click', function() {
        handleBalloonClick(balloon);
    });
    
    markers[balloon.id] = marker;
  }

  // Update marker styles based on active balloon
  function updateMarkers() {
    balloons.forEach(balloon => {
        const marker = markers[balloon.id];
        const aqiInfo = getAqiInfo(balloon.aqi);
      
        if (activeBalloon && activeBalloon.id === balloon.id) {
            // Update active marker
            const activeIcon = L.divIcon({
                className: 'balloon-marker',
                html: `<div style="background-color: ${aqiInfo.color}; width: 100%; height: 100%; display: flex; align-items: center; justify-content: center; border: 3px solid #3498db; border-radius: 50%;">🎈</div>`,
                iconSize: [36, 36]
            });
            marker.setIcon(activeIcon);
        } else {
            // Reset other markers
            const defaultIcon = L.divIcon({
                className: 'balloon-marker',
                html: `<div style="background-color: ${aqiInfo.color}; width: 100%; height: 100%; display: flex; align-items: center; justify-content: center; border-radius: 50%;">🎈</div>`,
                iconSize: [30, 30]
            });
            marker.setIcon(defaultIcon);
        }
    });
}

// Scroll to active balloon in list
function scrollToActiveBalloon() {
    if (activeBalloon) {
        const balloonItem = document.querySelector(`.balloon-item[data-id="${activeBalloon.id}"]`);
        if (balloonItem) {
            balloonItem.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
    }
}

// Handle balloon click
function handleBalloonClick(balloon) {
    // If clicking the same balloon, unselect it
    if (activeBalloon && balloon && activeBalloon.id === balloon.id) {
        // Close tooltip if open
        if (markers[activeBalloon.id]) {
            markers[activeBalloon.id].closeTooltip();
        }
      
        activeBalloon = null;
        map.setView([0, 0], 1); // Zoom out to world view
    } else {
        // Close tooltip on previously active balloon if exists
        if (activeBalloon && markers[activeBalloon.id]) {
            markers[activeBalloon.id].closeTooltip();
        }
      
        activeBalloon = balloon;
        if (balloon) {
            map.setView([balloon.lat, balloon.lng], 5);
        }
    }
    
    // Update UI
    updateMarkers();
    renderBalloonList(document.getElementById('search-input').value);
    
    // Scroll to active balloon in list
    if (activeBalloon) {
        setTimeout(scrollToActiveBalloon, 100);
    }
}

// Initialize the application
function init() {
    // Initialize map
    initMap();
    
    // Render initial balloon list
    renderBalloonList();
    
    // Set up search functionality
    const searchInput = document.getElementById('search-input');
    searchInput.addEventListener('input', (e) => {
        renderBalloonList(e.target.value);
    });
    
    // In a real app, you would fetch data from an API
    // function fetchBalloons() {
    //   fetch('https://api.example.com/balloons')
    //     .then(response => response.json())
    //     .then(data => {
    //       balloons = data;
    //       renderBalloonList(searchInput.value);
    //       updateMarkers();
    //     })
    //     .catch(error => {
    //       console.error('Error fetching balloon data:', error);
    //     });
    // }
    // 
    // fetchBalloons();
    // 
    // // Set up polling for real-time updates
    // setInterval(fetchBalloons, 30000);
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', init);