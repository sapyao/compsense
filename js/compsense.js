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
                tank: ['Winston', 'D.Va', 'Wrecking Ball', 'Doomfist', 'Hazard'],
                damage: ['Tracer', 'Genji', 'Sombra', 'Venture'],
                support: ['Lucio', 'Ana', 'Zenyatta', 'Kiriko', 'Moira']
            },
            strategy: 'Highly mobile composition focused on diving backline targets and securing eliminations through coordinated attacks.',
            
        },
        brawl: {
            name: 'Brawl Composition',
            heroes: {
                tank: ['Reinhardt', 'Zarya', 'Junker Queen', 'Mauga', 'Orisa', 'Ramattra'],
                damage: ['Reaper', 'Mei', 'Cassidy', 'Symmetra', 'Bastion', 'Venture'],
                support: ['Lucio', 'Moira', 'Brigitte', 'Ana', 'Lifeweaver', 'Wuyang']
            },
            strategy: 'Close-range fighting composition that excels at controlling space and winning direct team fights through sustain and area damage.',
            
        },
        poke: {
            name: 'Poke Composition',
            heroes: {
                tank: ['Sigma', 'Orisa', 'Roadhog', 'Ramattra'],
                damage: ['Soldier: 76', 'Widowmaker', 'Hanzo', 'Ashe', 'Junkrat', 'Sojourn', 'Echo', 'Pharah', 'Freja', 'Torbjorn', 'Venture'],
                support: ['Ana', 'Baptiste', 'Zenyatta', 'Mercy', 'Illari', 'Juno', 'Wuyang']
            },
            strategy: 'Long-range composition that focuses on dealing damage from a distance while maintaining safe positioning.',
            
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
            'kings-row': 90,
            'gibraltar': 45, 'junkertown': 40, 'havana': 40
        },
        'Cassidy': {
            'kings-row': 80, 'dorado': 75, 'route66': 75,          // Strong on medium-range maps
            'circuit-royal': 40, 'gibraltar': 40
        },
        'Echo': {
            'ilios': 90,
            'busan': 40, 'circuit-royal': 40
        },
        'Freja': {
            'ilios': 90,
            'busan': 40, 'circuit-royal': 40 //edit
        },
        'Genji': {
            'ilios': 90, 'circuit-royal': 70, 'havana': 70,
            'busan': 40, 'new-junk-city': 40
        },
        'Hanzo': {
            'junkertown': 90,
            'oasis': 40, 'suravasa': 40
        },
        'Junkrat': {
            'kings-row': 90, 'eichenwalde': 90,
            'gibraltar': 40, 'circuit-royal': 40, 'havana': 40
        },
        'Mei': {
            'lijiang': 90,
            'gibraltar': 40, 'junkertown': 40
        },
        'Pharah': {
            'ilios': 90, 
            'circuit-royal': 40, 'junkertown': 40
        },
        'Reaper': {
            'antarctic-peninsula': 90,
            'esperanca': 40, 'havana': 40
        },
        'Sojourn': {
            'suravasa': 90,
            'junkertown': 40, 'dorado': 40
        },
        'Soldier: 76': {
            'new-junk-city': 90, 'new-queen-street': 90,
            'circuit-royal': 40, 'havana': 40
        },
        'Sombra': {
            'new-queen-street': 90,
            'circuit-royal': 40, 'shambali': 40
        },
        'Symmetra': {
            'lijiang': 90,
            'esperanca': 40
        },
        'Torbjorn': {
            'oasis': 90,
            'havana': 40, 'junkertown': 40
        },
        'Tracer': {
            'blizzard-world': 90,
            'havana': 45, 'circuit-royal': 40 
        },
        'Venture': {
            'kings-row': 80, 'eichenwalde': 75, 'colosseo': 75,    // Strong on maps with underground routes
            'lijiang': 75, 'nepal': 70,                            // Good on control maps
            'junkertown': 65, 'circuit-royal': 60                  // Average on open maps
        },
        'Widowmaker': {
            'circuit-royal': 90,
            'aatlis': 45, 'new-junk-city': 45, 'oasis': 40, 'suravasa': 40
        },

        // Support heroes
        'Ana': {
            'dorado': 90,
            'circuit-royal': 40, 'havana': 40
        },
        'Baptiste': {
            'colosseo': 90, 'circuit-royal': 80,
            'dorado': 45, 'gibraltar': 40
        },
        'Brigitte': {
            'rialto': 80,
            'circuit-royal': 40, 'havana': 40
        },
        'Illari': {
            'rialto': 90, 'suravasa': 75, 'new-junk-city': 75, 'aatlis': 75,
            'gibraltar': 40, 'circuit-royal': 40
        },
        'Juno': {
            'kings-row': 80, 'eichenwalde': 75, 'colosseo': 75,    // Strong on tight maps
            'lijiang': 75, 'nepal': 70,                            // Good on control maps
            'junkertown': 65, 'circuit-royal': 60                  // Average on open maps
        },
        'Kiriko': {
            'esperanca': 90, 'lijiang': 60,
            'circuit-royal': 40
        },
        'Lifeweaver': {
            'numbani': 90,
            'havana': 40, 'lijiang': 40
        },
        'Lucio': {
            'ilios': 90,
            'havana': 40, 'gibraltar': 40
        },
        'Mercy': {
            'paraiso': 90, 'lijiang': 60,
            'new-junk-city': 40, 'antarctic-peninsula': 40
        },
        'Moira': {
            'antarctic-peninsula': 90,
            'havana': 40, 'junkertown': 40
        },
        'Wuyang': {
            'kings-row': 80, 'eichenwalde': 75, 'colosseo': 75,    // Strong on choke point maps
            'lijiang': 75, 'nepal': 70,                            // Good on control maps
            'junkertown': 65, 'circuit-royal': 60                  // Average on open maps
        },
        'Zenyatta': {
            'havana': 90, 'circuit-royal': 80, 'blizzard-world': 80,
            'lijiang': 40, 'aatlis': 40, 'new-junk-city': 40, 'suravasa': 40
        }
    };

    // Google Gemini AI Integration for composition descriptions and tips
    async function getAICompDescription(compName, mapName, tanks, damage, support) {
        // Extract hero names from the arrays
        const tankNames = tanks.map(h => h.hero).join(', ');
        const damageNames = damage.map(h => h.hero).join(', ');
        const supportNames = support.map(h => h.hero).join(', ');
        
        const prompt = `Overwatch 2 ${compName} on ${mapName}.
Team: Tanks: ${tankNames}, Damage: ${damageNames}, Support: ${supportNames}

Return ONLY this JSON (no markdown):
{"description":"2 sentence analysis","tips":["tip 1","tip 2","tip 3"]}`;

        try {
            const response = await fetch('/.netlify/functions/gemini-proxy', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    contents: [{
                        parts: [{
                            text: prompt
                        }]
                    }],
                    generationConfig: {
                        temperature: 0.7,
                        maxOutputTokens: 2048
                    }
                })
            });
            
            if (!response.ok) {
                const errorData = await response.json();
                console.error('Gemini API error:', errorData);
                throw new Error(`Gemini API request failed: ${response.status} ${response.statusText}`);
            }
            
            const data = await response.json();
            console.log('Gemini API response:', data);
            console.log('Candidates:', data.candidates);
            console.log('First candidate:', data.candidates?.[0]);
            console.log('Content:', data.candidates?.[0]?.content);
            console.log('Parts:', data.candidates?.[0]?.content?.parts);
            
            // Check if response has expected structure
            if (!data.candidates || !data.candidates[0]) {
                console.error('No candidates in response');
                return null;
            }
            
            if (!data.candidates[0].content) {
                console.error('No content in candidate');
                return null;
            }
            
            if (!data.candidates[0].content.parts || !data.candidates[0].content.parts[0]) {
                console.error('No parts in content');
                return null;
            }
            
            const generatedText = data.candidates[0].content.parts[0].text;
            console.log('Generated text:', generatedText);
            
            // Remove markdown code blocks if present
            let cleanedText = generatedText.trim();
            if (cleanedText.startsWith('```json')) {
                cleanedText = cleanedText.replace(/```json\n?/g, '').replace(/```\n?/g, '');
            } else if (cleanedText.startsWith('```')) {
                cleanedText = cleanedText.replace(/```\n?/g, '');
            }
            
            // Parse the JSON response
            try {
                const parsed = JSON.parse(cleanedText.trim());
                console.log('Parsed AI response:', parsed);
                return parsed;
            } catch (parseError) {
                console.error('Error parsing Gemini response:', parseError);
                console.log('Raw response:', generatedText);
                console.log('Cleaned text:', cleanedText);
                return null;
            }
        } catch (error) {
            console.error('Error getting AI description:', error);
            return null;
        }
    }

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
    
    // Get compositions sorted by effectiveness for this map
    const mapStrengths = mapInfo?.strengths || { dive: 50, brawl: 50, poke: 50 };
    
    // Create composition objects for all three strategies
    const strategyComps = [
        { key: 'dive', comp: compositionData.dive, effectiveness: mapStrengths.dive || 50 },
        { key: 'brawl', comp: compositionData.brawl, effectiveness: mapStrengths.brawl || 50 },
        { key: 'poke', comp: compositionData.poke, effectiveness: mapStrengths.poke || 50 }
    ];
    
    // Sort by effectiveness (highest first)
    strategyComps.sort((a, b) => b.effectiveness - a.effectiveness);
    
    // Clear existing composition cards
    const recommendedComps = document.querySelector('.recommended-comps');
    
    // Store comp-actions and worst-heroes-section to add back later
    const compActions = document.querySelector('.comp-actions');
    if (compActions) compActions.remove(); // Temporarily remove
    
    const worstHeroesSection = document.querySelector('.worst-heroes-section');
    if (worstHeroesSection) worstHeroesSection.remove();
    
    // Clear all other content
    recommendedComps.innerHTML = '';
    
    // Create three comp cards
    for (let i = 0; i < strategyComps.length; i++) {
        const strategy = strategyComps[i];
        
        // Create comp card with appropriate class
        const compCard = document.createElement('div');
        compCard.classList.add('comp-card');
        
        // Add primary class to the most effective strategy
        if (i === 0) {
            compCard.classList.add('primary-comp');
        } else {
            compCard.classList.add('alternative-comp');
        }
        
        // Add a heading that shows position
        let headingText = '';
        if (i === 0) headingText = 'Best Strategy';
        else if (i === 1) headingText = 'Second Best Strategy';
        else headingText = 'Third Strategy';
        
        compCard.innerHTML = `<h3>${headingText}</h3>`;
        recommendedComps.appendChild(compCard);
        
        // Populate the card with composition details
        displayCompositionCard(strategy, i === 0, compCard);
    }
    
    // Display heroes to avoid
    displayWorstHeroes();
    
    // Add back the comp-actions
    if (compActions) recommendedComps.appendChild(compActions);
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

// New function to get best heroes for a specific strategy on a map
function getBestHeroesForStrategy(mapId, strategy, role, bannedHeroes = []) {
    const mapInfo = mapData[mapId];
    if (!mapInfo) return [];
    
    const comp = compositionData[strategy];
    if (!comp) return [];
    
    // Get the heroes for this strategy and role
    let heroes = [];
    if (role === 'tank') {
        heroes = [...comp.heroes.tank];
    } else if (role === 'damage') {
        heroes = [...comp.heroes.damage];
    } else if (role === 'support') {
        heroes = [...comp.heroes.support];
    }
    
    // Filter out banned heroes
    heroes = heroes.filter(hero => !bannedHeroes.some(banned => 
        hero.toLowerCase().includes(banned.toLowerCase())
    ));
    
    // Calculate effectiveness scores
    const heroScores = heroes.map(hero => {
        // Base score from hero-map data if available
        let score = heroMapEffectiveness[hero]?.[mapId] || 50;
        
        // Boost score a bit since this hero is part of the recommended strategy
        score = Math.min(100, score * 1.1); // 10% boost, max 100
        
        return { hero, score };
    });
    
    // Sort heroes by score
    return heroScores.sort((a, b) => b.score - a.score);
}

function displayCompositionCard(compData, isPrimary, container) {
    if (!compData) return;
    
    const { comp, effectiveness, key } = compData;
    
    // Update composition name
    const titleElement = container.querySelector('h3');
    if (titleElement) {
        // Keep the existing title (Best Strategy, Second Best, etc.)
        const originalTitle = titleElement.textContent;
        titleElement.textContent = `${originalTitle} - ${comp.name}`;
    }
    
    // Get best heroes for this strategy on this map
    const bestTanks = getBestHeroesForStrategy(selectedMap, key, 'tank', bannedHeroes).slice(0, 2);
    const bestDamage = getBestHeroesForStrategy(selectedMap, key, 'damage', bannedHeroes).slice(0, 3);
    const bestSupport = getBestHeroesForStrategy(selectedMap, key, 'support', bannedHeroes).slice(0, 2);
    
    // Create the composition details div
    const compDetails = document.createElement('div');
    compDetails.classList.add('comp-details');
    
    // Add strategy description (p) with loading state
    const strategyDesc = document.createElement('p');
    strategyDesc.classList.add('ai-description');
    strategyDesc.innerHTML = '<em>Generating AI analysis...</em>';
    compDetails.appendChild(strategyDesc);
    
    // Add effectiveness bar
    const strengthContainer = document.createElement('div');
    strengthContainer.classList.add('comp-strength');
    
    const strengthLabel = document.createElement('span');
    strengthLabel.classList.add('strength-label');
    strengthLabel.textContent = 'Map Effectiveness:';
    strengthContainer.appendChild(strengthLabel);
    
    const strengthBar = document.createElement('div');
    strengthBar.classList.add('strength-bar');
    
    const strengthFill = document.createElement('div');
    strengthFill.classList.add('strength-fill');
    strengthFill.style.width = `${effectiveness}%`;
    strengthBar.appendChild(strengthFill);
    
    strengthContainer.appendChild(strengthBar);
    
    const strengthValue = document.createElement('span');
    strengthValue.classList.add('strength-value');
    strengthValue.textContent = `${effectiveness}%`;
    strengthContainer.appendChild(strengthValue);
    
    compDetails.appendChild(strengthContainer);
    
    // Add strategy tips with loading state
    const tipsContainer = document.createElement('div');
    tipsContainer.classList.add('strategy-tips');
    
    const tipsHeader = document.createElement('h4');
    tipsHeader.textContent = 'Strategy Tips:';
    tipsContainer.appendChild(tipsHeader);
    
    const tipsList = document.createElement('ul');
    const loadingTip = document.createElement('li');
    loadingTip.innerHTML = '<em>Generating tips...</em>';
    tipsList.appendChild(loadingTip);
    tipsContainer.appendChild(tipsList);
    
    compDetails.appendChild(tipsContainer);
    
    // Get AI-generated description and tips
    getAICompDescription(comp.name, selectedMap, bestTanks, bestDamage, bestSupport)
        .then(aiContent => {
            if (aiContent) {
                // Update description with AI content
                strategyDesc.textContent = aiContent.description;
                strategyDesc.classList.add('fade-in');
                
                // Update tips with AI content
                tipsList.innerHTML = '';
                aiContent.tips.forEach(tip => {
                    const listItem = document.createElement('li');
                    listItem.textContent = tip;
                    tipsList.appendChild(listItem);
                });
                tipsContainer.classList.add('fade-in');
            } else {
                // Fallback to static content if AI fails
                strategyDesc.textContent = comp.strategy;
                
                tipsList.innerHTML = '';
                comp.tips.forEach(tip => {
                    const listItem = document.createElement('li');
                    listItem.textContent = tip;
                    tipsList.appendChild(listItem);
                });
            }
        })
        .catch(error => {
            console.error('Error getting AI description:', error);
            // Fallback to static content on error
            strategyDesc.textContent = comp.strategy;
            
            tipsList.innerHTML = '';
            comp.tips.forEach(tip => {
                const listItem = document.createElement('li');
                listItem.textContent = tip;
                tipsList.appendChild(listItem);
            });
        });
    
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
    
    // Add hero recommendations and details to container
    container.appendChild(heroRecommendations);
    container.appendChild(compDetails);
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