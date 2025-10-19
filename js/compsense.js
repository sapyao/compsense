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

    // Hero effectiveness on different maps
    const heroMapEffectiveness = {
        // Tank heroes
        'Doomfist': {
            'ilios': 90, 'circuit-royal': 75
        },
        'D.Va': {
            'dorado': 90,
            'new-junk-city': 40, 'suravasa': 40,
        },
        'Hazard': {
            'gibraltar': 90, 'dorado': 80, 'new-junk-city': 80, 'paraiso': 75, 'eichenwalde': 60, 'kings-row': 60,
            'havana': 40, 'shambali': 40
        },
        'Junker Queen': {
            'suravasa': 90,
            'gibraltar': 40, 'paraiso': 40
        },
        'Mauga': {
            'oasis': 90,
            'dorado': 40, 'junkertown': 40
        },
        'Orisa': {
            'ilios': 90, 
            'gibraltar': 40, 'numbani': 40
        },
        'Ramattra': {
            'colosseo': 90,
            'new-queen-street': 40, 'dorado': 40
        },
        'Reinhardt': {
            'lijiang': 90,
            'dorado': 40, 'paraiso': 40
        },
        'Roadhog': {
            'ilios': 90,
            'havana': 40, 'gibraltar': 40
        },
        'Sigma': {
            'circuit-royal': 90,
            'new-junk-city': 40, 'gibraltar': 40
        },
        'Winston': {
            'dorado': 90, 'gibraltar': 80,
            'new-junk-city': 40, 'havana': 40
        },
        'Wrecking Ball': {
            'junkertown': 90, 'colosseo': 75, 'new-queen-street': 75, 'runasapi': 75, 'suravasa': 75, 'new-junk-city': 75,
            'circuit-royal': 40, 'kings-row': 40
        },
        'Zarya': {
            'kings-row': 90, 
            'gibraltar': 40, 'havana': 40 
        },

        // Damage heroes
        'Ashe': {
            'route66': 90,
            'suravasa': 40, 'lijiang': 40
        },
        'Bastion': {
            'junkertown': 85, 'circuit-royal': 80, 'havana': 75,   // Strong on maps with sightlines
            'kings-row': 70, 'eichenwalde': 65,                    // Average on hybrid maps
            'ilios': 55, 'lijiang': 50                             // Weak on control maps
        },
        'Cassidy': {
            'kings-row': 80, 'dorado': 75, 'route66': 75,          // Strong on medium-range maps
            'lijiang': 75, 'nepal': 70,                            // Good on control maps
            'junkertown': 65, 'circuit-royal': 70                  // Average on open maps
        },
        'Echo': {
            'ilios': 85, 'gibraltar': 80, 'numbani': 80,           // Strong on maps with verticality
            'busan': 75, 'lijiang': 75,                            // Good on control maps
            'kings-row': 65, 'eichenwalde': 70                     // Average on enclosed maps
        },
        'Freja': {
            'junkertown': 80, 'circuit-royal': 75, 'havana': 70,   // Strong on open maps
            'ilios': 75, 'busan': 70,                              // Good on control maps
            'kings-row': 65, 'eichenwalde': 60                     // Average on tight maps
        },
        'Genji': {
            'ilios': 85, 'lijiang': 80, 'busan': 75,               // Strong on control maps
            'numbani': 80, 'gibraltar': 75,                        // Good on vertical maps
            'junkertown': 65, 'circuit-royal': 70                  // Average on open maps
        },
        'Hanzo': {
            'junkertown': 85, 'havana': 80, 'gibraltar': 80,       // Strong on maps with sightlines
            'kings-row': 80, 'eichenwalde': 75,                    // Good on hybrid maps
            'ilios': 70, 'lijiang': 75                             // Average on control maps
        },
        'Junkrat': {
            'kings-row': 90, 'eichenwalde': 85, 'colosseo': 80,    // Strong on choke point maps
            'lijiang': 80, 'nepal': 75,                            // Good on enclosed control maps
            'junkertown': 65, 'circuit-royal': 60                  // Weaker on open maps
        },
        'Mei': {
            'kings-row': 85, 'eichenwalde': 80, 'colosseo': 80,    // Strong on maps with chokes
            'lijiang': 80, 'nepal': 75,                            // Good on control maps
            'junkertown': 60, 'circuit-royal': 65                  // Weaker on open maps
        },
        'Pharah': {
            'ilios': 90, 'lijiang': 85, 'oasis': 85,               // Strong on maps with open skybox
            'numbani': 80, 'gibraltar': 80,                        // Good on vertical maps
            'kings-row': 60, 'eichenwalde': 65                     // Weak on enclosed maps
        },
        'Reaper': {
            'kings-row': 90, 'eichenwalde': 85, 'colosseo': 80,    // Strong on tight maps
            'lijiang': 85, 'nepal': 80,                            // Good on control maps
            'junkertown': 50, 'circuit-royal': 55                  // Weak on open maps
        },
        'Sojourn': {
            'junkertown': 85, 'circuit-royal': 80, 'havana': 80,   // Strong on long sightline maps
            'kings-row': 75, 'eichenwalde': 70,                    // Good on hybrid maps
            'lijiang': 70, 'nepal': 70                             // Average on control maps
        },
        'Soldier: 76': {
            'junkertown': 85, 'circuit-royal': 80, 'havana': 75,   // Strong on maps with high ground
            'gibraltar': 80, 'numbani': 75,                        // Good on vertical maps
            'kings-row': 70, 'colosseo': 70                        // Average on enclosed maps
        },
        'Sombra': {
            'ilios': 80, 'lijiang': 75, 'busan': 75,               // Strong on control maps
            'numbani': 75, 'dorado': 70,                           // Good on maps with health packs
            'kings-row': 65, 'eichenwalde': 70                     // Average on tight maps
        },
        'Symmetra': {
            'kings-row': 85, 'eichenwalde': 80, 'colosseo': 75,    // Strong on maps with chokes
            'lijiang': 75, 'nepal': 70,                            // Good on control maps
            'junkertown': 55, 'circuit-royal': 50                  // Weak on open maps
        },
        'Torbjorn': {
            'kings-row': 80, 'eichenwalde': 75, 'havana': 70,      // Strong on defense maps
            'lijiang': 70, 'nepal': 65,                            // Average on control maps
            'ilios': 65, 'busan': 60                               // Weaker on open control maps
        },
        'Tracer': {
            'ilios': 90, 'lijiang': 85, 'oasis': 85,              // Strong on control maps
            'kings-row': 80, 'numbani': 75,                        // Good on maps with flanking routes
            'junkertown': 60, 'havana': 65                         // Weaker on open maps
        },
        'Venture': {
            'kings-row': 80, 'eichenwalde': 75, 'colosseo': 75,    // Strong on maps with underground routes
            'lijiang': 75, 'nepal': 70,                            // Good on control maps
            'junkertown': 65, 'circuit-royal': 60                  // Average on open maps
        },
        'Widowmaker': {
            'junkertown': 95, 'circuit-royal': 90, 'havana': 85,   // Strong on long sightline maps
            'ilios': 80, 'gibraltar': 85,                          // Good on maps with sightlines
            'kings-row': 60, 'eichenwalde': 65                     // Weaker on enclosed maps
        },

        // Support heroes
        'Ana': {
            'junkertown': 85, 'havana': 80, 'gibraltar': 85,       // Strong on maps with sightlines
            'kings-row': 75, 'blizzard-world': 80,                 // Good on hybrid maps
            'ilios': 65, 'nepal': 70                               // Variable on control maps
        },
        'Baptiste': {
            'kings-row': 80, 'eichenwalde': 75, 'colosseo': 75,    // Strong on maps with high ground
            'havana': 75, 'junkertown': 70,                        // Good on maps with sightlines
            'ilios': 65, 'lijiang': 60                             // Average on control maps
        },
        'Brigitte': {
            'kings-row': 85, 'eichenwalde': 80, 'colosseo': 80,    // Strong on brawl maps
            'lijiang': 80, 'nepal': 75,                            // Good on control maps
            'junkertown': 50, 'circuit-royal': 55                  // Weak on open maps
        },
        'Illari': {
            'junkertown': 80, 'circuit-royal': 75, 'havana': 75,   // Strong on long sightline maps
            'kings-row': 70, 'eichenwalde': 65,                    // Average on hybrid maps
            'lijiang': 70, 'nepal': 65                             // Average on control maps
        },
        'Juno': {
            'kings-row': 80, 'eichenwalde': 75, 'colosseo': 75,    // Strong on tight maps
            'lijiang': 75, 'nepal': 70,                            // Good on control maps
            'junkertown': 65, 'circuit-royal': 60                  // Average on open maps
        },
        'Kiriko': {
            'kings-row': 80, 'eichenwalde': 75, 'colosseo': 75,    // Strong on maps with verticality
            'lijiang': 80, 'nepal': 75,                            // Good on control maps
            'junkertown': 65, 'circuit-royal': 60                  // Average on open maps
        },
        'Lifeweaver': {
            'kings-row': 75, 'eichenwalde': 70, 'havana': 70,      // Good on maps with high ground
            'ilios': 75, 'nepal': 70,                              // Good on control maps
            'junkertown': 65, 'circuit-royal': 60                  // Average on open maps
        },
        'Lucio': {
            'ilios': 95, 'lijiang': 90, 'nepal': 85,               // Strong on maps with ledges
            'kings-row': 85, 'eichenwalde': 80,                    // Good on brawl maps
            'junkertown': 60, 'circuit-royal': 65                  // Weaker on open maps
        },
        'Mercy': {
            'ilios': 80, 'lijiang': 75, 'numbani': 85,             // Strong with vertical mobility
            'gibraltar': 80, 'dorado': 75,                         // Good on maps with cover
            'kings-row': 65, 'eichenwalde': 70                     // Average on enclosed maps
        },
        'Moira': {
            'kings-row': 90, 'eichenwalde': 85, 'colosseo': 80,    // Strong on enclosed maps
            'lijiang': 80, 'nepal': 75,                            // Good on control maps
            'junkertown': 55, 'circuit-royal': 60                  // Weak on open maps
        },
        'Wuyang': {
            'kings-row': 80, 'eichenwalde': 75, 'colosseo': 75,    // Strong on choke point maps
            'lijiang': 75, 'nepal': 70,                            // Good on control maps
            'junkertown': 65, 'circuit-royal': 60                  // Average on open maps
        },
        'Zenyatta': {
            'junkertown': 80, 'havana': 75, 'gibraltar': 75,       // Strong on open sightline maps
            'kings-row': 70, 'eichenwalde': 65,                    // Average on hybrid maps
            'ilios': 65, 'lijiang': 60                             // Weaker on control maps
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
    
    // Set the map image
    const mapImage = document.getElementById('selected-map-image');
    if (mapImage) {
        mapImage.src = `images/maps/${selectedMap}.png`;
        mapImage.alt = mapInfo?.name || selectedMap;
    }
    
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

    displayWorstHeroes();
}

function getBestHeroesForMap(mapId, role, bannedHeroes = []) {
    const mapInfo = mapData[mapId];
    if (!mapInfo) return [];
    
    // Get all heroes of the specified role
    let heroes = [];
    if (role === 'tank') {
        // Combine all tank heroes from all compositions
        heroes = [...new Set(Object.values(compositionData).flatMap(comp => comp.heroes.tank))];
    } else if (role === 'damage') {
        heroes = [...new Set(Object.values(compositionData).flatMap(comp => comp.heroes.damage))];
    } else if (role === 'support') {
        heroes = [...new Set(Object.values(compositionData).flatMap(comp => comp.heroes.support))];
    }
    
    // Filter out banned heroes
    heroes = heroes.filter(hero => !bannedHeroes.some(banned => 
        hero.toLowerCase().includes(banned.toLowerCase())
    ));
    
    // Calculate effectiveness scores
    const heroScores = heroes.map(hero => {
        // Base score from hero-map data if available
        let score = heroMapEffectiveness[hero]?.[mapId] || 50;
        
        // Adjust score based on map type and composition strengths
        const mapType = mapInfo.type;
        const mapStrengths = mapInfo.strengths;
        
        // Find which compositions this hero is part of
        const heroComps = Object.entries(compositionData)
            .filter(([_, comp]) => comp.heroes[role].includes(hero))
            .map(([key, _]) => key);
        
        // Boost score based on composition effectiveness on this map
        let compBonus = 0;
        heroComps.forEach(compKey => {
            compBonus += (mapStrengths[compKey] || 50) * 0.3; // 30% weight from comp effectiveness
        });
        
        // Average the bonus if hero is in multiple comps
        if (heroComps.length > 0) {
            compBonus /= heroComps.length;
            score = score * 0.7 + compBonus; // 70% from hero-map data, 30% from comp effectiveness
        }
        
        return { hero, score };
    });
    
    // Sort heroes by score
    return heroScores.sort((a, b) => b.score - a.score);
}

function getWorstHeroesForMap(mapId, role, bannedHeroes = []) {
    // Reuse the same logic as getBestHeroesForMap but sort in ascending order
    const mapInfo = mapData[mapId];
    if (!mapInfo) return [];
    
    // Get all heroes of the specified role
    let heroes = [];
    if (role === 'tank') {
        heroes = [...new Set(Object.values(compositionData).flatMap(comp => comp.heroes.tank))];
    } else if (role === 'damage') {
        heroes = [...new Set(Object.values(compositionData).flatMap(comp => comp.heroes.damage))];
    } else if (role === 'support') {
        heroes = [...new Set(Object.values(compositionData).flatMap(comp => comp.heroes.support))];
    }
    
    // Filter out banned heroes
    heroes = heroes.filter(hero => !bannedHeroes.some(banned => 
        hero.toLowerCase().includes(banned.toLowerCase())
    ));
    
    // Calculate effectiveness scores
    const heroScores = heroes.map(hero => {
        // Base score from hero-map data if available
        let score = heroMapEffectiveness[hero]?.[mapId] || 50;
        
        // Adjust score based on map type and composition strengths
        const mapType = mapInfo.type;
        const mapStrengths = mapInfo.strengths;
        
        // Find which compositions this hero is part of
        const heroComps = Object.entries(compositionData)
            .filter(([_, comp]) => comp.heroes[role].includes(hero))
            .map(([key, _]) => key);
        
        // Factor in composition effectiveness on this map
        let compBonus = 0;
        heroComps.forEach(compKey => {
            compBonus += (mapStrengths[compKey] || 50) * 0.3;
        });
        
        if (heroComps.length > 0) {
            compBonus /= heroComps.length;
            score = score * 0.7 + compBonus;
        }
        
        return { hero, score };
    });
    
    // Sort heroes by score ascending (worst first)
    return heroScores.sort((a, b) => a.score - b.score);
}

function displayCompositionCard(compData, isPrimary) {
    if (!compData) return;
    
    const { comp, effectiveness, key } = compData;
    const container = document.querySelector(isPrimary ? '.primary-comp' : '.alternative-comp');
    
    if (!container) return;
    
    // Update composition name and description
    const titleElement = container.querySelector('h4');
    if (titleElement) {
        titleElement.textContent = comp.name;
    }
    
    const descriptionElement = container.querySelector('p');
    if (descriptionElement) {
        descriptionElement.textContent = comp.strategy;
    }
    
    // Get best heroes for this map for each role
    const bestTanks = getBestHeroesForMap(selectedMap, 'tank', bannedHeroes).slice(0, 2);
    const bestDamage = getBestHeroesForMap(selectedMap, 'damage', bannedHeroes).slice(0, 3);
    const bestSupport = getBestHeroesForMap(selectedMap, 'support', bannedHeroes).slice(0, 2);
    
    // Create hero recommendations HTML
    const heroRecommendations = document.createElement('div');
    heroRecommendations.classList.add('hero-recommendations');
    
    // Add tank recommendations
    const tankSection = document.createElement('div');
    tankSection.classList.add('role-recommendations');
    tankSection.innerHTML = '<h5>Tank</h5>';
    bestTanks.forEach(tank => {
        const heroDiv = document.createElement('div');
        heroDiv.classList.add('recommended-hero');
        heroDiv.innerHTML = `
            <div class="hero-image" data-hero="${tank.hero.toLowerCase().replace(/[:\s\.\']+/g, '-')}"></div>
            <span class="hero-name">${tank.hero}</span>
            <div class="hero-score">${Math.round(tank.score)}%</div>
        `;
        tankSection.appendChild(heroDiv);
    });
    heroRecommendations.appendChild(tankSection);
    
    // Add damage recommendations
    const damageSection = document.createElement('div');
    damageSection.classList.add('role-recommendations');
    damageSection.innerHTML = '<h5>Damage</h5>';
    bestDamage.forEach(damage => {
        const heroDiv = document.createElement('div');
        heroDiv.classList.add('recommended-hero');
        heroDiv.innerHTML = `
            <div class="hero-image" data-hero="${damage.hero.toLowerCase().replace(/[:\s\.\']+/g, '-')}"></div>
            <span class="hero-name">${damage.hero}</span>
            <div class="hero-score">${Math.round(damage.score)}%</div>
        `;
        damageSection.appendChild(heroDiv);
    });
    heroRecommendations.appendChild(damageSection);
    
    // Add support recommendations
    const supportSection = document.createElement('div');
    supportSection.classList.add('role-recommendations');
    supportSection.innerHTML = '<h5>Support</h5>';
    bestSupport.forEach(support => {
        const heroDiv = document.createElement('div');
        heroDiv.classList.add('recommended-hero');
        heroDiv.innerHTML = `
            <div class="hero-image" data-hero="${support.hero.toLowerCase().replace(/[:\s\.\']+/g, '-')}"></div>
            <span class="hero-name">${support.hero}</span>
            <div class="hero-score">${Math.round(support.score)}%</div>
        `;
        supportSection.appendChild(heroDiv);
    });
    heroRecommendations.appendChild(supportSection);
    
    // Clear existing recommendations and add new ones
    const existingRecs = container.querySelector('.hero-recommendations');
    if (existingRecs) {
        existingRecs.remove();
    }
    
    container.appendChild(heroRecommendations);
    
    // Update effectiveness bar
    const strengthFill = container.querySelector('.strength-fill');
    if (strengthFill) {
        strengthFill.style.width = `${effectiveness}%`;
    }
}

function displayWorstHeroes() {
    // Create container or use existing one
    let container = document.querySelector('.worst-heroes-section');
    if (!container) {
        container = document.createElement('div');
        container.classList.add('worst-heroes-section', 'comp-card');
        
        // Add heading
        const heading = document.createElement('h3');
        heading.textContent = 'Heroes to Avoid';
        container.appendChild(heading);
        
        // Add to DOM before the comp-actions div
        const compActions = document.querySelector('.comp-actions');
        document.querySelector('.recommended-comps').insertBefore(container, compActions);
    } else {
        // Clear existing content except heading
        const heading = container.querySelector('h3');
        container.innerHTML = '';
        if (heading) {
            container.appendChild(heading);
        } else {
            const newHeading = document.createElement('h3');
            newHeading.textContent = 'Heroes to Avoid';
            container.appendChild(newHeading);
        }
    }
    
    // Get worst heroes for each role
    const worstTanks = getWorstHeroesForMap(selectedMap, 'tank', bannedHeroes).slice(0, 2);
    const worstDamage = getWorstHeroesForMap(selectedMap, 'damage', bannedHeroes).slice(0, 2);
    const worstSupport = getWorstHeroesForMap(selectedMap, 'support', bannedHeroes).slice(0, 2);
    
    // Create hero recommendations-style layout
    const heroRecommendations = document.createElement('div');
    heroRecommendations.classList.add('hero-recommendations');
    
    // Add tank section
    const tankSection = document.createElement('div');
    tankSection.classList.add('role-recommendations');
    tankSection.innerHTML = '<h5>Tank</h5>';
    worstTanks.forEach(tank => {
        const heroDiv = document.createElement('div');
        heroDiv.classList.add('recommended-hero');
        heroDiv.innerHTML = `
            <div class="hero-image" data-hero="${tank.hero.toLowerCase().replace(/[:\s\.\']+/g, '-')}"></div>
            <span class="hero-name">${tank.hero}</span>
            <div class="hero-score">${Math.round(tank.score)}%</div>
        `;
        tankSection.appendChild(heroDiv);
    });
    heroRecommendations.appendChild(tankSection);
    
    // Add damage section
    const damageSection = document.createElement('div');
    damageSection.classList.add('role-recommendations');
    damageSection.innerHTML = '<h5>Damage</h5>';
    worstDamage.forEach(damage => {
        const heroDiv = document.createElement('div');
        heroDiv.classList.add('recommended-hero');
        heroDiv.innerHTML = `
            <div class="hero-image" data-hero="${damage.hero.toLowerCase().replace(/[:\s\.\']+/g, '-')}"></div>
            <span class="hero-name">${damage.hero}</span>
            <div class="hero-score">${Math.round(damage.score)}%</div>
        `;
        damageSection.appendChild(heroDiv);
    });
    heroRecommendations.appendChild(damageSection);
    
    // Add support section
    const supportSection = document.createElement('div');
    supportSection.classList.add('role-recommendations');
    supportSection.innerHTML = '<h5>Support</h5>';
    worstSupport.forEach(support => {
        const heroDiv = document.createElement('div');
        heroDiv.classList.add('recommended-hero');
        heroDiv.innerHTML = `
            <div class="hero-image" data-hero="${support.hero.toLowerCase().replace(/[:\s\.\']+/g, '-')}"></div>
            <span class="hero-name">${support.hero}</span>
            <div class="hero-score">${Math.round(support.score)}%</div>
        `;
        supportSection.appendChild(heroDiv);
    });
    heroRecommendations.appendChild(supportSection);
    
    // Add description/strategy section to match your layout
    const avoidDetails = document.createElement('div');
    avoidDetails.classList.add('comp-details');
    
    const avoidTitle = document.createElement('h4');
    avoidTitle.textContent = 'Map Weaknesses';
    avoidDetails.appendChild(avoidTitle);
    
    const avoidDescription = document.createElement('p');
    avoidDescription.textContent = 'These heroes are less effective on this map due to map layout, sightlines, or objective type.';
    avoidDetails.appendChild(avoidDescription);
    
    container.appendChild(heroRecommendations);
    container.appendChild(avoidDetails);
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