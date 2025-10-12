/* Image preloader utility */
document.addEventListener('DOMContentLoaded', function() {
    // Display a message if images are missing
    function checkMissingImages() {
        // Check map images
        const mapImages = document.querySelectorAll('.map-image[data-map]');
        let missingMaps = 0;
        
        mapImages.forEach(mapImage => {
            // Get computed background image
            const bgImg = window.getComputedStyle(mapImage).backgroundImage;
            if (bgImg === 'none') {
                // If no background is loaded, show text label
                const mapId = mapImage.getAttribute('data-map');
                console.log(`Missing map image: ${mapId}`);
                missingMaps++;
                
                // Make sure label is visible
                const label = mapImage.querySelector('.image-label');
                if (label) {
                    label.style.opacity = '1';
                    label.style.backgroundColor = 'rgba(0,0,0,0.7)';
                }
            }
        });
        
        // Check hero images
        const heroImages = document.querySelectorAll('.hero-image[data-hero]');
        let missingHeroes = 0;
        
        heroImages.forEach(heroImage => {
            // Get computed background image
            const bgImg = window.getComputedStyle(heroImage).backgroundImage;
            if (bgImg === 'none') {
                // If no background is loaded, show text label
                const heroId = heroImage.getAttribute('data-hero');
                console.log(`Missing hero image: ${heroId}`);
                missingHeroes++;
                
                // Make sure label is visible
                const label = heroImage.querySelector('.image-label');
                if (label) {
                    label.style.opacity = '1';
                    label.style.backgroundColor = 'rgba(0,0,0,0.7)';
                }
            }
        });
        
        if (missingMaps > 0 || missingHeroes > 0) {
            console.log(`Missing ${missingMaps} map images and ${missingHeroes} hero images.`);
            console.log('Check ADDING-IMAGES.md file for instructions on adding images.');
        }
    }
    
    // Run check after a short delay to allow background images to load
    setTimeout(checkMissingImages, 1000);
});