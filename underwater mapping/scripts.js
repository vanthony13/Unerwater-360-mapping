document.addEventListener("DOMContentLoaded", function() {
    // Initialize the map and set the view to Cape Verde
    const map = L.map("map").setView([16.5388, -23.0418], 9);

    // Set up map tiles
    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
        maxZoom: 18,
    }).addTo(map);

    // Add your location markers with 360 video links here
    // Add your location markers with 360 video links here
const locations = [
    {
        lat: 14.9199,
        lon: -23.5087,
        title: "Location 1",
        videoPath: "./360.mp4",
    },
    {
        lat: 16.7370,
        lon: -22.9466,
        title: "Location 2",
        videoPath: "./360.mp4",
    },
];


    locations.forEach(function(location) {
        const marker = L.marker([location.lat, location.lon]).addTo(map);
        marker.on("click", function() {
            // Load and play the 360 video when the marker is clicked
            open360Video(location.videoPath);
        });
    });

    const videoModal = document.getElementById("videoModal");
    const closeModal = document.getElementById("closeModal");
    const video360 = document.getElementById("video360");

    let player;

    function open360Video(videoPath) {
        if (!player) {
            player = videojs("video360", {
                plugins: {
                    panorama: {
                        clickAndDrag: true,
                        autoMobileOrientation: true,
                    },
                },
            });
            player.on("error", function() {
                console.error("Video.js error:", player.error());
            });
        }
        player.src({
            src: videoPath,
            type: "video/mp4",
        });
        videoModal.style.display = "block";
        player.play();
    }
    closeModal.onclick = function() {
        videoModal.style.display = "none";
        player.pause();
    }

    videoModal.onclick = function(event) {
        if (event.target === videoModal || event.target === closeModal) {
            videoModal.style.display = "none";
            player.pause();
        }
    };

    // Search functionality
    const searchButton = document.getElementById("searchButton");
    const searchInput = document.getElementById("searchInput");

    searchButton.onclick = function() {
        const searchText = searchInput.value;
        if (searchText) {
            const geocoder = L.Control.Geocoder.nominatim();
            geocoder.geocode(searchText, function(results) {
                if (results && results.length > 0) {
                    const result = results[0];
                    const latlng = L.latLng(result.center.lat, result.center.lng);
                    map.setView(latlng, 13);
                    const location = locations.find(
                        loc => loc.title.toLowerCase() === searchText.toLowerCase()
                    );
                    if (location) {
                        open360Video(location.videoPath);
                    }
                }
            });
        }
    }
});
