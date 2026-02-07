/**
 * Data Storage Layer
 * Handles localStorage operations for emissions, goals, and settings
 */

const STORAGE_KEYS = {
    EMISSIONS: 'carbonTracker_emissions',
    GOALS: 'carbonTracker_goals',
    SETTINGS: 'carbonTracker_settings'
};

/**
 * Save emission entry
 * @param {Object} entry - Emission entry object
 */
function saveEmission(entry) {
    const emissions = getEmissions();
    
    // Add timestamp and unique ID if not present
    if (!entry.id) {
        entry.id = Date.now().toString();
    }
    if (!entry.timestamp) {
        entry.timestamp = new Date().toISOString();
    }
    
    emissions.push(entry);
    localStorage.setItem(STORAGE_KEYS.EMISSIONS, JSON.stringify(emissions));
}

/**
 * Get all emissions
 * @returns {Array} Array of emission entries
 */
function getEmissions() {
    const data = localStorage.getItem(STORAGE_KEYS.EMISSIONS);
    return data ? JSON.parse(data) : [];
}

/**
 * Delete emission entry
 * @param {string} id - Entry ID
 */
function deleteEmission(id) {
    const emissions = getEmissions();
    const filtered = emissions.filter(e => e.id !== id);
    localStorage.setItem(STORAGE_KEYS.EMISSIONS, JSON.stringify(filtered));
}

/**
 * Get emissions by date range
 * @param {Date} startDate - Start date
 * @param {Date} endDate - End date
 * @returns {Array} Filtered emissions
 */
function getEmissionsByDateRange(startDate, endDate) {
    const emissions = getEmissions();
    return emissions.filter(e => {
        const date = new Date(e.timestamp);
        return date >= startDate && date <= endDate;
    });
}

/**
 * Get emissions by category
 * @param {string} category - Category name
 * @returns {Array} Filtered emissions
 */
function getEmissionsByCategory(category) {
    const emissions = getEmissions();
    return emissions.filter(e => e.category === category);
}

/**
 * Calculate total emissions
 * @param {Array} emissions - Optional emissions array (defaults to all)
 * @returns {number} Total emissions in kg CO2e
 */
function calculateTotalEmissions(emissions = null) {
    const data = emissions || getEmissions();
    return data.reduce((sum, entry) => sum + entry.emissions, 0);
}

/**
 * Calculate emissions by category
 * @param {Array} emissions - Optional emissions array
 * @returns {Object} Emissions grouped by category
 */
function calculateEmissionsByCategory(emissions = null) {
    const data = emissions || getEmissions();
    const byCategory = {};
    
    data.forEach(entry => {
        if (!byCategory[entry.category]) {
            byCategory[entry.category] = 0;
        }
        byCategory[entry.category] += entry.emissions;
    });
    
    return byCategory;
}

/**
 * Save goal
 * @param {Object} goal - Goal object
 */
function saveGoal(goal) {
    const goals = getGoals();
    
    if (!goal.id) {
        goal.id = Date.now().toString();
    }
    if (!goal.createdAt) {
        goal.createdAt = new Date().toISOString();
    }
    
    goals.push(goal);
    localStorage.setItem(STORAGE_KEYS.GOALS, JSON.stringify(goals));
}

/**
 * Get all goals
 * @returns {Array} Array of goal objects
 */
function getGoals() {
    const data = localStorage.getItem(STORAGE_KEYS.GOALS);
    return data ? JSON.parse(data) : [];
}

/**
 * Update goal
 * @param {string} id - Goal ID
 * @param {Object} updates - Updated fields
 */
function updateGoal(id, updates) {
    const goals = getGoals();
    const index = goals.findIndex(g => g.id === id);
    
    if (index !== -1) {
        goals[index] = { ...goals[index], ...updates };
        localStorage.setItem(STORAGE_KEYS.GOALS, JSON.stringify(goals));
    }
}

/**
 * Delete goal
 * @param {string} id - Goal ID
 */
function deleteGoal(id) {
    const goals = getGoals();
    const filtered = goals.filter(g => g.id !== id);
    localStorage.setItem(STORAGE_KEYS.GOALS, JSON.stringify(filtered));
}

/**
 * Get settings
 * @returns {Object} Settings object
 */
function getSettings() {
    const data = localStorage.getItem(STORAGE_KEYS.SETTINGS);
    return data ? JSON.parse(data) : {
        displayUnit: 'kg',
        theme: 'light',
        notifications: true
    };
}

/**
 * Save settings
 * @param {Object} settings - Settings object
 */
function saveSettings(settings) {
    localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(settings));
}

/**
 * Clear all data (for testing/reset)
 */
function clearAllData() {
    if (confirm('Are you sure you want to clear all data? This cannot be undone.')) {
        localStorage.removeItem(STORAGE_KEYS.EMISSIONS);
        localStorage.removeItem(STORAGE_KEYS.GOALS);
        localStorage.removeItem(STORAGE_KEYS.SETTINGS);
        window.location.reload();
    }
}
