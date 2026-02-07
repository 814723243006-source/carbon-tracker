/**
 * Emission Calculation Engine
 * Contains emission factors and calculation logic
 */

// Emission factors (kg CO2e per unit)
const EMISSION_FACTORS = {
    transportation: {
        car_gasoline: { factor: 0.21, unit: 'km', label: 'Car (Gasoline)' },
        bus: { factor: 0.089, unit: 'km', label: 'Bus' },
        train: { factor: 0.041, unit: 'km', label: 'Train' },
        flight_domestic: { factor: 0.255, unit: 'km', label: 'Flight (Domestic)' },
        flight_international: { factor: 0.195, unit: 'km', label: 'Flight (International)' }
    },
    energy: {
        electricity: { factor: 0.42, unit: 'kWh', label: 'Electricity' },
        natural_gas: { factor: 2.0, unit: 'm³', label: 'Natural Gas' },
        heating_oil: { factor: 2.68, unit: 'L', label: 'Heating Oil' }
    },
    food: {
        beef: { factor: 6.61, unit: 'meal', label: 'Beef Meal' },
        chicken: { factor: 1.82, unit: 'meal', label: 'Chicken Meal' },
        pork: { factor: 2.45, unit: 'meal', label: 'Pork Meal' },
        fish: { factor: 1.35, unit: 'meal', label: 'Fish Meal' },
        vegetarian: { factor: 0.51, unit: 'meal', label: 'Vegetarian Meal' },
        vegan: { factor: 0.39, unit: 'meal', label: 'Vegan Meal' }
    },
    shopping: {
        clothing: { factor: 10.0, unit: 'item', label: 'Clothing Item' },
        electronics: { factor: 50.0, unit: 'item', label: 'Electronics' },
        furniture: { factor: 100.0, unit: 'item', label: 'Furniture' },
        general: { factor: 5.0, unit: 'item', label: 'General Purchase' }
    }
};

/**
 * Calculate emissions for a given activity
 * @param {string} category - Main category (transportation, energy, food, shopping)
 * @param {string} type - Specific activity type
 * @param {number} amount - Amount of activity
 * @returns {number} Emissions in kg CO2e
 */
function calculateEmissions(category, type, amount) {
    if (!EMISSION_FACTORS[category] || !EMISSION_FACTORS[category][type]) {
        console.error(`Invalid category or type: ${category}, ${type}`);
        return 0;
    }
    
    const factor = EMISSION_FACTORS[category][type].factor;
    return factor * amount;
}

/**
 * Get all emission types for a category
 * @param {string} category - Category name
 * @returns {Object} Emission types for the category
 */
function getEmissionTypes(category) {
    return EMISSION_FACTORS[category] || {};
}

/**
 * Get all categories
 * @returns {Array} List of category names
 */
function getCategories() {
    return Object.keys(EMISSION_FACTORS);
}

/**
 * Format emissions value for display
 * @param {number} value - Emissions value in kg CO2e
 * @returns {string} Formatted string
 */
function formatEmissions(value) {
    if (value >= 1000) {
        return `${(value / 1000).toFixed(2)} t CO2e`;
    }
    return `${value.toFixed(2)} kg CO2e`;
}
