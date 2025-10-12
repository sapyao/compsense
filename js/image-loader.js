// Function to modify HTML for improved image display
document.addEventListener('DOMContentLoaded', function() {
    // Update map images
    const mapDivs = document.querySelectorAll('.map-option');
    mapDivs.forEach(mapDiv => {
        const mapId = mapDiv.getAttribute('data-map');
        const mapName = mapDiv.querySelector('.map-name').textContent;
        const mapImageDiv = mapDiv.querySelector('.map-image');
        
        // Add data attribute for CSS selection
        mapImageDiv.setAttribute('data-map', mapId);
        
        // Clear text content and add label element
        const originalText = mapImageDiv.textContent;
        mapImageDiv.textContent = '';
        
        // Add label for accessibility
        const label = document.createElement('span');
        label.classList.add('image-label');
        label.textContent = originalText;
        mapImageDiv.appendChild(label);
    });

    // Update hero images
    const heroDivs = document.querySelectorAll('.hero-ban-option');
    heroDivs.forEach(heroDiv => {
        const heroId = heroDiv.getAttribute('data-hero');
        const heroName = heroDiv.querySelector('.hero-name').textContent;
        const heroImageDiv = heroDiv.querySelector('.hero-image');
        
        // Add data attribute for CSS selection
        heroImageDiv.setAttribute('data-hero', heroId);
        
        // Clear text content and add label element
        const originalText = heroImageDiv.textContent;
        heroImageDiv.textContent = '';
        
        // Add label for accessibility
        const label = document.createElement('span');
        label.classList.add('image-label');
        label.textContent = originalText;
        heroImageDiv.appendChild(label);
    });
});