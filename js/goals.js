/**
 * Goals Tracking System
 * Manages carbon reduction goals and progress tracking
 */

/**
 * Create a new goal
 * @param {string} title - Goal title
 * @param {number} targetEmissions - Target emissions in kg CO2e
 * @param {string} period - Time period (daily, weekly, monthly, yearly)
 * @param {string} category - Optional specific category
 * @returns {Object} Created goal
 */
function createGoal(title, targetEmissions, period, category = null) {
    const goal = {
        title,
        targetEmissions,
        period,
        category,
        active: true
    };
    
    saveGoal(goal);
    return goal;
}

/**
 * Calculate progress for a goal
 * @param {Object} goal - Goal object
 * @returns {Object} Progress information
 */
function calculateGoalProgress(goal) {
    const now = new Date();
    let startDate, endDate;
    
    // Determine date range based on period
    switch (goal.period) {
        case 'daily':
            startDate = new Date(now.getFullYear(), now.getMonth(), now.getDate());
            endDate = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1);
            break;
        case 'weekly':
            const dayOfWeek = now.getDay();
            startDate = new Date(now.getFullYear(), now.getMonth(), now.getDate() - dayOfWeek);
            endDate = new Date(startDate.getTime() + 7 * 24 * 60 * 60 * 1000);
            break;
        case 'monthly':
            startDate = new Date(now.getFullYear(), now.getMonth(), 1);
            endDate = new Date(now.getFullYear(), now.getMonth() + 1, 1);
            break;
        case 'yearly':
            startDate = new Date(now.getFullYear(), 0, 1);
            endDate = new Date(now.getFullYear() + 1, 0, 1);
            break;
        default:
            return { error: 'Invalid period' };
    }
    
    // Get emissions for the period
    let emissions = getEmissionsByDateRange(startDate, endDate);
    
    // Filter by category if specified
    if (goal.category) {
        emissions = emissions.filter(e => e.category === goal.category);
    }
    
    const currentEmissions = calculateTotalEmissions(emissions);
    const targetEmissions = goal.targetEmissions;
    const percentage = (currentEmissions / targetEmissions) * 100;
    const remaining = targetEmissions - currentEmissions;
    const status = currentEmissions <= targetEmissions ? 'on-track' : 'exceeded';
    
    return {
        currentEmissions,
        targetEmissions,
        percentage: Math.min(percentage, 100),
        remaining,
        status,
        startDate,
        endDate
    };
}

/**
 * Get all active goals with their progress
 * @returns {Array} Goals with progress information
 */
function getActiveGoalsWithProgress() {
    const goals = getGoals().filter(g => g.active);
    
    return goals.map(goal => ({
        ...goal,
        progress: calculateGoalProgress(goal)
    }));
}

/**
 * Check if any goals are met
 * @returns {Array} Met goals
 */
function checkMetGoals() {
    const goals = getActiveGoalsWithProgress();
    return goals.filter(g => g.progress.status === 'on-track' && g.progress.percentage < 100);
}

/**
 * Get goal suggestions based on current emissions
 * @returns {Array} Suggested goals
 */
function getGoalSuggestions() {
    const emissions = getEmissions();
    
    if (emissions.length === 0) {
        return [
            { title: 'Daily emissions under 10 kg', target: 10, period: 'daily' },
            { title: 'Weekly emissions under 70 kg', target: 70, period: 'weekly' },
            { title: 'Monthly emissions under 300 kg', target: 300, period: 'monthly' }
        ];
    }
    
    // Calculate average daily emissions
    const daysSinceFirst = Math.max(1, 
        (new Date() - new Date(emissions[0].timestamp)) / (1000 * 60 * 60 * 24)
    );
    const totalEmissions = calculateTotalEmissions();
    const avgDaily = totalEmissions / daysSinceFirst;
    
    // Suggest 10% reduction
    const targetDaily = avgDaily * 0.9;
    const targetWeekly = targetDaily * 7;
    const targetMonthly = targetDaily * 30;
    
    return [
        { 
            title: 'Reduce daily emissions by 10%', 
            target: Math.round(targetDaily * 10) / 10, 
            period: 'daily' 
        },
        { 
            title: 'Reduce weekly emissions by 10%', 
            target: Math.round(targetWeekly * 10) / 10, 
            period: 'weekly' 
        },
        { 
            title: 'Reduce monthly emissions by 10%', 
            target: Math.round(targetMonthly * 10) / 10, 
            period: 'monthly' 
        }
    ];
}
