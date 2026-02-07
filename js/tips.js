/**
 * Tips and Recommendations Engine
 * Provides actionable suggestions based on user's emission patterns
 */

// Static tips database
const TIPS_DATABASE = {
    transportation: [
        {
            title: 'Use Public Transportation',
            description: 'Take the bus or train instead of driving. Public transit emits significantly less CO2 per passenger.',
            impact: 'high',
            category: 'transportation'
        },
        {
            title: 'Carpool When Possible',
            description: 'Share rides with colleagues or friends to reduce individual carbon footprint from driving.',
            impact: 'medium',
            category: 'transportation'
        },
        {
            title: 'Walk or Bike for Short Trips',
            description: 'For trips under 3km, consider walking or cycling. Zero emissions and good for your health!',
            impact: 'medium',
            category: 'transportation'
        },
        {
            title: 'Combine Errands',
            description: 'Plan your trips to accomplish multiple tasks in one journey, reducing overall mileage.',
            impact: 'low',
            category: 'transportation'
        },
        {
            title: 'Consider Electric Vehicles',
            description: 'Electric vehicles produce zero direct emissions and are increasingly affordable.',
            impact: 'high',
            category: 'transportation'
        }
    ],
    energy: [
        {
            title: 'Switch to LED Bulbs',
            description: 'LED bulbs use up to 75% less energy than traditional incandescent bulbs.',
            impact: 'medium',
            category: 'energy'
        },
        {
            title: 'Unplug Devices When Not in Use',
            description: 'Phantom power drain can account for 10% of your electricity bill. Unplug chargers and appliances.',
            impact: 'low',
            category: 'energy'
        },
        {
            title: 'Adjust Your Thermostat',
            description: 'Lower heating by 1°C or raise cooling by 1°C to save significant energy.',
            impact: 'high',
            category: 'energy'
        },
        {
            title: 'Use Energy-Efficient Appliances',
            description: 'When replacing appliances, choose Energy Star certified models.',
            impact: 'high',
            category: 'energy'
        },
        {
            title: 'Insulate Your Home',
            description: 'Proper insulation reduces heating and cooling needs significantly.',
            impact: 'high',
            category: 'energy'
        }
    ],
    food: [
        {
            title: 'Reduce Meat Consumption',
            description: 'Beef production generates the highest emissions. Try Meatless Mondays or reduce portion sizes.',
            impact: 'high',
            category: 'food'
        },
        {
            title: 'Choose Locally Sourced Food',
            description: 'Local food requires less transportation, reducing associated emissions.',
            impact: 'medium',
            category: 'food'
        },
        {
            title: 'Minimize Food Waste',
            description: 'Plan meals, store food properly, and compost scraps to reduce waste emissions.',
            impact: 'medium',
            category: 'food'
        },
        {
            title: 'Eat Seasonal Produce',
            description: 'Seasonal fruits and vegetables require less energy for growth and storage.',
            impact: 'low',
            category: 'food'
        },
        {
            title: 'Try Plant-Based Alternatives',
            description: 'Plant-based meals have a fraction of the carbon footprint of meat-based meals.',
            impact: 'high',
            category: 'food'
        }
    ],
    shopping: [
        {
            title: 'Buy Less, Choose Quality',
            description: 'Invest in durable, high-quality items that last longer rather than cheap disposables.',
            impact: 'high',
            category: 'shopping'
        },
        {
            title: 'Shop Second-Hand',
            description: 'Buying used items gives them a second life and avoids manufacturing emissions.',
            impact: 'high',
            category: 'shopping'
        },
        {
            title: 'Repair Instead of Replace',
            description: 'Fix broken items when possible instead of buying new ones.',
            impact: 'medium',
            category: 'shopping'
        },
        {
            title: 'Choose Sustainable Brands',
            description: 'Support companies committed to sustainable practices and carbon reduction.',
            impact: 'medium',
            category: 'shopping'
        },
        {
            title: 'Avoid Fast Fashion',
            description: 'Fast fashion has a huge carbon footprint. Buy timeless pieces that last.',
            impact: 'high',
            category: 'shopping'
        }
    ],
    general: [
        {
            title: 'Track Your Progress',
            description: 'Regular tracking helps you stay aware and motivated to reduce your footprint.',
            impact: 'medium',
            category: 'general'
        },
        {
            title: 'Educate Others',
            description: 'Share what you learn about carbon reduction with friends and family.',
            impact: 'low',
            category: 'general'
        },
        {
            title: 'Support Green Policies',
            description: 'Vote for and advocate for policies that address climate change.',
            impact: 'medium',
            category: 'general'
        }
    ]
};

/**
 * Get personalized tips based on user's emission patterns
 * @returns {Array} Array of recommended tips
 */
function getPersonalizedTips() {
    const emissions = getEmissions();
    
    if (emissions.length === 0) {
        // Return general tips for new users
        return [
            ...TIPS_DATABASE.general,
            TIPS_DATABASE.transportation[0],
            TIPS_DATABASE.energy[0],
            TIPS_DATABASE.food[0]
        ].slice(0, 5);
    }
    
    // Calculate emissions by category
    const byCategory = calculateEmissionsByCategory();
    
    // Find highest emission categories
    const sortedCategories = Object.entries(byCategory)
        .sort((a, b) => b[1] - a[1])
        .map(([category]) => category);
    
    const tips = [];
    
    // Add tips from highest emission categories first
    sortedCategories.forEach(category => {
        if (TIPS_DATABASE[category]) {
            tips.push(...TIPS_DATABASE[category].filter(tip => tip.impact === 'high'));
        }
    });
    
    sortedCategories.forEach(category => {
        if (TIPS_DATABASE[category]) {
            tips.push(...TIPS_DATABASE[category].filter(tip => tip.impact === 'medium'));
        }
    });
    
    // Add some general tips
    tips.push(...TIPS_DATABASE.general);
    
    // Remove duplicates and limit to 8 tips
    const uniqueTips = Array.from(new Map(tips.map(tip => [tip.title, tip])).values());
    return uniqueTips.slice(0, 8);
}

/**
 * Get tips for a specific category
 * @param {string} category - Category name
 * @returns {Array} Tips for the category
 */
function getTipsByCategory(category) {
    return TIPS_DATABASE[category] || [];
}

/**
 * Get all tips
 * @returns {Object} All tips organized by category
 */
function getAllTips() {
    return TIPS_DATABASE;
}

/**
 * Calculate potential savings from implementing a tip
 * @param {string} category - Category name
 * @param {number} currentEmissions - Current emissions in category
 * @param {string} impact - Impact level (high, medium, low)
 * @returns {number} Estimated savings in kg CO2e
 */
function calculateTipSavings(category, currentEmissions, impact) {
    const reductionPercent = {
        high: 0.30,    // 30% reduction
        medium: 0.15,  // 15% reduction
        low: 0.05      // 5% reduction
    };
    
    return currentEmissions * (reductionPercent[impact] || 0);
}
