document.addEventListener('DOMContentLoaded', function() {
    // References to screens
    // Welcome screen removed
    const mapScreen = document.getElementById('map-selection');
    const heroBanScreen = document.getElementById('hero-ban');
    const compResultsScreen = document.getElementById('composition-results');
    const mainContent = document.querySelector('main');
    const header = document.querySelector('header');
    const footer = document.querySelector('footer');
    
    // Show main interface by default
    showMainInterface();

    // Get buttons
    const mainStartBtn = document.getElementById('main-start-btn');
    const closeButtons = document.querySelectorAll('.close-button');
    const resetBansButton = document.querySelector('.reset-bans-btn');
    const confirmBansButton = document.querySelector('.confirm-bans-btn');
    const newSearchButton = document.querySelector('.new-search-btn');
    const noBansButton = document.querySelector('.no-bans-btn');
    const quickButtons = {
        maps: document.getElementById('maps-btn'),
        heroes: document.getElementById('heroes-btn'),
        meta: document.getElementById('meta-btn')
    };

    // State variables
    let selectedMap = '';
    let selectedMapType = '';
    let bannedHeroes = [];
    const MAX_BANS = 4;

    // Map data structure (name, type, strength for different comps)
    const mapData = {
        'lijiang': { name: 'Lijiang Tower', type: 'Control', strengths: { dive: 85, brawl: 75, poke: 60 }},
        'kings-row': { name: 'King\'s Row', type: 'Hybrid', strengths: { dive: 70, brawl: 90, poke: 65 }},
        'dorado': { name: 'Dorado', type: 'Escort', strengths: { dive: 75, brawl: 65, poke: 80 }},
        // Add data for all maps
    };

    // Hero composition data
    const compositionData = {
        dive: {
            name: 'Dive Composition',
            heroes: {
                tank: ['Winston', 'D.Va', 'Wrecking Ball'],
                damage: ['Tracer', 'Genji', 'Echo', 'Sombra'],
                support: ['Mercy', 'Lucio', 'Ana', 'Zenyatta']
            },
            strategy: 'Highly mobile composition focused on diving backline targets and securing eliminations through coordinated attacks.',
            tips: [
                'Use Winston\'s jump pack to initiate engagements',
                'Follow up with damage heroes to secure eliminations',
                'Coordinate dives on high-value targets like supports',
                'Use vertical mobility to access high ground positions'
            ]
        },
        brawl: {
            name: 'Brawl Composition',
            heroes: {
                tank: ['Reinhardt', 'Zarya', 'Junker Queen'],
                damage: ['Reaper', 'Mei', 'Cassidy', 'Symmetra'],
                support: ['Lucio', 'Moira', 'Brigitte', 'Baptiste']
            },
            strategy: 'Close-range fighting composition that excels at controlling space and winning direct team fights through sustain and area damage.',
            tips: [
                'Use Lucio\'s speed boost to engage or disengage quickly',
                'Control choke points with Reinhardt\'s shield and Mei\'s wall',
                'Focus on staying grouped for maximum healing efficiency',
                'Rotate as a unit to maintain team cohesion'
            ]
        },
        poke: {
            name: 'Poke Composition',
            heroes: {
                tank: ['Sigma', 'Orisa', 'Roadhog'],
                damage: ['Soldier: 76', 'Widowmaker', 'Hanzo', 'Ashe', 'Junkrat'],
                support: ['Ana', 'Baptiste', 'Zenyatta', 'Mercy']
            },
            strategy: 'Long-range composition that focuses on dealing damage from a distance while maintaining safe positioning.',
            tips: [
                'Establish control of high ground or long sightlines',
                'Use shield and cover to minimize incoming damage',
                'Apply consistent pressure to force resource usage',
                'Avoid being forced into close-range engagements'
            ]
        }
    };

    // Screen navigation functions
    function showMainInterface() {
        // Welcome screen removed
        mainContent.style.display = 'block';
        header.style.display = 'block';
        footer.style.display = 'block';
    }

    function hideMainInterface() {
        mainContent.style.display = 'none';
        header.style.display = 'none';
        footer.style.display = 'none';
    }

    function showMapSelection() {
        hideAllScreens();
        mapScreen.style.display = 'block';
        hideMainInterface();
    }

    function showHeroBanSelection() {
        hideAllScreens();
        heroBanScreen.style.display = 'block';
        hideMainInterface();
    }

    function showCompResults() {
        hideAllScreens();
        compResultsScreen.style.display = 'block';
        hideMainInterface();
        
        // Populate the results
        populateCompResults();
    }

    function hideAllScreens() {
        // Welcome screen removed
        mapScreen.style.display = 'none';
        heroBanScreen.style.display = 'none';
        compResultsScreen.style.display = 'none';
    }

    function backToMain() {
        hideAllScreens();
        showMainInterface();
        resetState();
    }

    // Data handling functions
    function selectMap(mapId, mapName, mapType) {
        selectedMap = mapId;
        selectedMapType = mapType;
        
        // Update UI on hero ban screen
        document.getElementById('selected-map').textContent = mapName;
        document.getElementById('map-type').textContent = mapType;
        
        // Move to hero ban selection
        showHeroBanSelection();
    }

    function toggleHeroBan(heroElement) {
        if (heroElement.classList.contains('selected')) {
            // Remove from selected
            heroElement.classList.remove('selected');
            const heroName = heroElement.querySelector('.hero-name').textContent;
            bannedHeroes = bannedHeroes.filter(hero => hero !== heroName);
        } else {
            // Check if max selections reached
            if (bannedHeroes.length >= MAX_BANS) {
                alert(`Maximum ${MAX_BANS} hero bans allowed.`);
                return;
            }
            
            // Add to selected
            heroElement.classList.add('selected');
            const heroName = heroElement.querySelector('.hero-name').textContent;
            bannedHeroes.push(heroName);
        }
        
        // Update ban count
        updateBanCount();
    }

    function updateBanCount() {
        const banCountElement = document.querySelector('.ban-count');
        banCountElement.textContent = `${bannedHeroes.length}/${MAX_BANS} selected`;
    }

    function resetBans() {
        const selectedHeroes = document.querySelectorAll('.hero-ban-option.selected');
        selectedHeroes.forEach(hero => {
            hero.classList.remove('selected');
        });
        
        bannedHeroes = [];
        updateBanCount();
    }

    function populateCompResults() {
        // Display selected map and type
        document.getElementById('selected-map').textContent = mapData[selectedMap]?.name || selectedMap;
        document.getElementById('map-type').textContent = mapData[selectedMap]?.type || selectedMapType;
        
        // Display banned heroes
        const bannedHeroesList = document.getElementById('banned-heroes-list');
        bannedHeroesList.innerHTML = '';
        
        if (bannedHeroes.length > 0) {
            bannedHeroes.forEach(hero => {
                const heroSpan = document.createElement('div');
                heroSpan.classList.add('banned-hero');
                heroSpan.textContent = hero;
                bannedHeroesList.appendChild(heroSpan);
            });
        } else {
            const noHeroesSpan = document.createElement('div');
            noHeroesSpan.classList.add('banned-hero');
            noHeroesSpan.textContent = 'No banned heroes';
            bannedHeroesList.appendChild(noHeroesSpan);
        }
        
        // Determine best compositions based on map and bans
        // This would be much more complex in a real application
        // For now we'll just use the pre-defined sample data
        
        // Primary recommendation would typically be calculated based on map strengths and banned heroes
        // This is a simplified example
    }

    function resetState() {
        selectedMap = '';
        selectedMapType = '';
        bannedHeroes = [];
        resetBans();
    }

    // Event listeners
    if (mainStartBtn) {
        mainStartBtn.addEventListener('click', showMapSelection);
    }
    
    // Start with main interface shown
    showMainInterface();

    closeButtons.forEach(btn => {
        btn.addEventListener('click', backToMain);
    });

    // Map selection
    const mapOptions = document.querySelectorAll('.map-option');
    mapOptions.forEach(map => {
        map.addEventListener('click', function() {
            const mapId = this.getAttribute('data-map');
            const mapName = this.querySelector('.map-name').textContent;
            const mapType = this.closest('.map-category').querySelector('h3').textContent;
            selectMap(mapId, mapName, mapType);
        });
    });

    // Hero ban selection
    const heroBanOptions = document.querySelectorAll('.hero-ban-option');
    heroBanOptions.forEach(hero => {
        hero.addEventListener('click', function() {
            toggleHeroBan(this);
        });
    });

    // Button actions
    if (mainStartBtn) {
        mainStartBtn.addEventListener('click', showMapSelection);
    }
    
    if (resetBansButton) {
        resetBansButton.addEventListener('click', resetBans);
    }
    
    if (confirmBansButton) {
        confirmBansButton.addEventListener('click', showCompResults);
    }
    
    if (newSearchButton) {
        newSearchButton.addEventListener('click', showMapSelection);
    }
    
    if (noBansButton) {
        noBansButton.addEventListener('click', function() {
            // Clear any selected bans
            resetBans();
            // Move directly to composition results
            showCompResults();
        });
    }

    // Quick access buttons
    if (quickButtons.maps) {
        quickButtons.maps.addEventListener('click', showMapSelection);
    }
    
    if (quickButtons.heroes) {
        quickButtons.heroes.addEventListener('click', function() {
            window.location.href = 'heroes.html';
        });
    }
    
    if (quickButtons.meta) {
        quickButtons.meta.addEventListener('click', function() {
            window.location.href = 'meta.html';
        });
    }
});