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
        // Control Maps
        'antarctic-peninsula': { name: 'Antarctic Peninsula', type: 'Control', strengths: { dive: 80, brawl: 70, poke: 65 }},
        'busan': { name: 'Busan', type: 'Control', strengths: { dive: 85, brawl: 70, poke: 60 }},
        'ilios': { name: 'Ilios', type: 'Control', strengths: { dive: 90, brawl: 65, poke: 70 }},
        'lijiang': { name: 'Lijiang Tower', type: 'Control', strengths: { dive: 85, brawl: 75, poke: 60 }},
        'nepal': { name: 'Nepal', type: 'Control', strengths: { dive: 80, brawl: 75, poke: 65 }},
        'oasis': { name: 'Oasis', type: 'Control', strengths: { dive: 85, brawl: 70, poke: 65 }},
        'samoa': { name: 'Samoa', type: 'Control', strengths: { dive: 75, brawl: 80, poke: 60 }},
        
        // Escort Maps
        'circuit-royal': { name: 'Circuit Royal', type: 'Escort', strengths: { dive: 60, brawl: 70, poke: 85 }},
        'dorado': { name: 'Dorado', type: 'Escort', strengths: { dive: 75, brawl: 65, poke: 80 }},
        'havana': { name: 'Havana', type: 'Escort', strengths: { dive: 70, brawl: 75, poke: 75 }},
        'junkertown': { name: 'Junkertown', type: 'Escort', strengths: { dive: 55, brawl: 65, poke: 90 }},
        'rialto': { name: 'Rialto', type: 'Escort', strengths: { dive: 70, brawl: 80, poke: 70 }},
        'route66': { name: 'Route 66', type: 'Escort', strengths: { dive: 65, brawl: 70, poke: 85 }},
        'shambali': { name: 'Shambali Monastery', type: 'Escort', strengths: { dive: 75, brawl: 75, poke: 70 }},
        'gibraltar': { name: 'Watchpoint: Gibraltar', type: 'Escort', strengths: { dive: 70, brawl: 65, poke: 80 }},
        
        // Hybrid Maps
        'blizzard-world': { name: 'Blizzard World', type: 'Hybrid', strengths: { dive: 70, brawl: 80, poke: 70 }},
        'eichenwalde': { name: 'Eichenwalde', type: 'Hybrid', strengths: { dive: 65, brawl: 85, poke: 70 }},
        'hollywood': { name: 'Hollywood', type: 'Hybrid', strengths: { dive: 75, brawl: 80, poke: 65 }},
        'kings-row': { name: 'King\'s Row', type: 'Hybrid', strengths: { dive: 70, brawl: 90, poke: 65 }},
        'midtown': { name: 'Midtown', type: 'Hybrid', strengths: { dive: 75, brawl: 75, poke: 75 }},
        'numbani': { name: 'Numbani', type: 'Hybrid', strengths: { dive: 80, brawl: 70, poke: 70 }},
        'paraiso': { name: 'Paraíso', type: 'Hybrid', strengths: { dive: 85, brawl: 70, poke: 65 }},
        
        // Push Maps
        'colosseo': { name: 'Colosseo', type: 'Push', strengths: { dive: 80, brawl: 85, poke: 60 }},
        'esperanca': { name: 'Esperança', type: 'Push', strengths: { dive: 75, brawl: 80, poke: 65 }},
        'new-queen-street': { name: 'New Queen Street', type: 'Push', strengths: { dive: 85, brawl: 75, poke: 60 }},
        'runasapi': { name: 'Runasapi', type: 'Push', strengths: { dive: 80, brawl: 80, poke: 65 }},
        
        // Flashpoint Maps
        'aatlis': { name: 'Aatlis', type: 'Flashpoint', strengths: { dive: 85, brawl: 75, poke: 60 }},
        'new-junk-city': { name: 'New Junk City', type: 'Flashpoint', strengths: { dive: 80, brawl: 80, poke: 65 }},
        'suravasa': { name: 'Suravasa', type: 'Flashpoint', strengths: { dive: 85, brawl: 70, poke: 65 }},
        
        // Clash Maps
        'hanaoka': { name: 'Hanaoka', type: 'Clash', strengths: { dive: 75, brawl: 85, poke: 60 }},
        'throne-of-anubis': { name: 'Throne of Anubis', type: 'Clash', strengths: { dive: 70, brawl: 85, poke: 65 }}
};

    // Hero composition data
    // according to Cakariey
    const compositionData = {
        dive: {
            name: 'Dive Composition',
            heroes: {
                tank: ['Winston', 'D.Va', 'Wrecking Ball', 'Doomfist', 'Hazard', 'Orisa'],
                damage: ['Tracer', 'Genji', 'Sombra', 'Venture'],
                support: ['Lucio', 'Ana', 'Zenyatta', 'Kiriko', 'Moira']
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
                tank: ['Reinhardt', 'Zarya', 'Junker Queen', 'Mauga', 'Orisa', 'Ramattra'],
                damage: ['Reaper', 'Mei', 'Cassidy', 'Symmetra', 'Bastion', 'Venture'],
                support: ['Lucio', 'Moira', 'Brigitte', 'Ana', 'Lifeweaver', 'Wuyang']
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
                tank: ['Sigma', 'Orisa', 'Roadhog', 'Ramattra'],
                damage: ['Soldier: 76', 'Widowmaker', 'Hanzo', 'Ashe', 'Junkrat', 'Sojourn', 'Echo', 'Pharah', 'Freja', 'Torbjorn', 'Venture'],
                support: ['Ana', 'Baptiste', 'Zenyatta', 'Mercy', 'Illari', 'Juno', 'Wuyang']
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
    const mapInfo = mapData[selectedMap];
    document.getElementById('selected-map').textContent = mapInfo?.name || selectedMap;
    document.getElementById('map-type').textContent = mapInfo?.type || selectedMapType;
    
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
    
    // Determine best compositions based on map effectiveness
    const mapStrengths = mapInfo.strengths
    
    // Sort compositions by effectiveness on this map
    const sortedComps = Object.entries(compositionData)
        .map(([key, comp]) => ({
            key,
            comp,
            effectiveness: mapStrengths[key] || 50
        }))
        .sort((a, b) => b.effectiveness - a.effectiveness);
    
    // Filter out compositions with banned heroes
    const availableComps = sortedComps.filter(({ comp }) => {
        const allHeroes = [...comp.heroes.tank, ...comp.heroes.damage, ...comp.heroes.support];
        return !bannedHeroes.some(banned => 
            allHeroes.some(hero => hero.toLowerCase().includes(banned.toLowerCase()))
        );
    });
    
    // Display primary and alternative compositions
    displayCompositionCard(availableComps[0], true);
    if (availableComps.length > 1) {
        displayCompositionCard(availableComps[1], false);
    }
}

function displayCompositionCard(compData, isPrimary) {
    if (!compData) return;
    
    const { comp, effectiveness } = compData;
    const cardClass = isPrimary ? 'primary-comp' : 'alternative-comp';
    const cardTitle = isPrimary ? 'Primary Recommendation' : 'Alternative Option';
    
    // This would update the existing card in the HTML
    // You'd need to add logic to dynamically create cards or update existing ones
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