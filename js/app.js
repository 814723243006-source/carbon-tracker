/**
 * Main Application Logic
 * Handles UI, navigation, and user interactions
 */

// Current active view
let currentView = 'dashboard';

/**
 * Initialize the application
 */
function initApp() {
    // Set up navigation
    setupNavigation();
    
    // Show dashboard by default
    showView('dashboard');
    
    // Set up event listeners
    setupEventListeners();
    
    // Initialize sample data if needed
    initializeSampleData();
}

/**
 * Initialize sample data for new users
 */
function initializeSampleData() {
    const emissions = getEmissions();
    
    // Add sample data only if storage is empty
    if (emissions.length === 0) {
        const sampleData = [
            {
                category: 'transportation',
                type: 'car_gasoline',
                amount: 25,
                emissions: calculateEmissions('transportation', 'car_gasoline', 25),
                description: 'Commute to work',
                timestamp: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString()
            },
            {
                category: 'energy',
                type: 'electricity',
                amount: 150,
                emissions: calculateEmissions('energy', 'electricity', 150),
                description: 'Monthly electricity usage',
                timestamp: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString()
            },
            {
                category: 'food',
                type: 'chicken',
                amount: 3,
                emissions: calculateEmissions('food', 'chicken', 3),
                description: 'Chicken meals this week',
                timestamp: new Date().toISOString()
            }
        ];
        
        sampleData.forEach(entry => saveEmission(entry));
    }
}

/**
 * Set up navigation event listeners
 */
function setupNavigation() {
    const navLinks = document.querySelectorAll('.nav-link');
    
    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const view = link.getAttribute('data-view');
            showView(view);
        });
    });
}

/**
 * Set up form and button event listeners
 */
function setupEventListeners() {
    // Emission form
    const emissionForm = document.getElementById('emissionForm');
    if (emissionForm) {
        emissionForm.addEventListener('submit', handleEmissionSubmit);
    }
    
    // Category select change
    const categorySelect = document.getElementById('emissionCategory');
    if (categorySelect) {
        categorySelect.addEventListener('change', updateTypeOptions);
    }
    
    // Period select change for charts
    const periodSelect = document.getElementById('periodSelect');
    if (periodSelect) {
        periodSelect.addEventListener('change', updateCharts);
    }
    
    // Goal form
    const goalForm = document.getElementById('goalForm');
    if (goalForm) {
        goalForm.addEventListener('submit', handleGoalSubmit);
    }
    
    // Clear data button
    const clearDataBtn = document.getElementById('clearDataBtn');
    if (clearDataBtn) {
        clearDataBtn.addEventListener('click', clearAllData);
    }
}

/**
 * Show a specific view
 * @param {string} viewName - Name of the view to show
 */
function showView(viewName) {
    currentView = viewName;
    
    // Update navigation active state
    document.querySelectorAll('.nav-link').forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('data-view') === viewName) {
            link.classList.add('active');
        }
    });
    
    // Hide all views
    document.querySelectorAll('.view').forEach(view => {
        view.style.display = 'none';
    });
    
    // Show selected view
    const selectedView = document.getElementById(`${viewName}View`);
    if (selectedView) {
        selectedView.style.display = 'block';
    }
    
    // Load view-specific content
    switch (viewName) {
        case 'dashboard':
            loadDashboard();
            break;
        case 'log':
            loadLogView();
            break;
        case 'history':
            loadHistory();
            break;
        case 'goals':
            loadGoals();
            break;
        case 'tips':
            loadTips();
            break;
    }
}

/**
 * Load dashboard view
 */
function loadDashboard() {
    const emissions = getEmissions();
    const totalEmissions = calculateTotalEmissions(emissions);
    const byCategory = calculateEmissionsByCategory(emissions);
    
    // Update summary stats
    document.getElementById('totalEmissions').textContent = formatEmissions(totalEmissions);
    document.getElementById('totalEntries').textContent = emissions.length;
    
    // Calculate this week's emissions
    const now = new Date();
    const weekStart = new Date(now.getFullYear(), now.getMonth(), now.getDate() - now.getDay());
    const weekEmissions = getEmissionsByDateRange(weekStart, now);
    const weekTotal = calculateTotalEmissions(weekEmissions);
    document.getElementById('weekEmissions').textContent = formatEmissions(weekTotal);
    
    // Update category breakdown
    const categoryBreakdown = document.getElementById('categoryBreakdown');
    categoryBreakdown.innerHTML = '';
    
    const categoryLabels = {
        transportation: 'Transportation',
        energy: 'Home Energy',
        food: 'Food & Diet',
        shopping: 'Shopping & Goods'
    };
    
    Object.entries(byCategory).forEach(([category, amount]) => {
        const percentage = totalEmissions > 0 ? (amount / totalEmissions * 100).toFixed(1) : 0;
        const div = document.createElement('div');
        div.className = 'category-item';
        div.innerHTML = `
            <span class="category-name">${categoryLabels[category] || category}</span>
            <span class="category-value">${formatEmissions(amount)} (${percentage}%)</span>
        `;
        categoryBreakdown.appendChild(div);
    });
    
    // Initialize charts
    setTimeout(() => {
        initializeDashboardCharts();
    }, 100);
}

/**
 * Load emission logging view
 */
function loadLogView() {
    updateTypeOptions();
}

/**
 * Update type options based on selected category
 */
function updateTypeOptions() {
    const categorySelect = document.getElementById('emissionCategory');
    const typeSelect = document.getElementById('emissionType');
    const unitLabel = document.getElementById('unitLabel');
    
    if (!categorySelect || !typeSelect) return;
    
    const category = categorySelect.value;
    const types = getEmissionTypes(category);
    
    typeSelect.innerHTML = '';
    
    Object.entries(types).forEach(([key, value]) => {
        const option = document.createElement('option');
        option.value = key;
        option.textContent = value.label;
        option.dataset.unit = value.unit;
        typeSelect.appendChild(option);
    });
    
    // Update unit label
    if (typeSelect.options.length > 0) {
        const firstOption = typeSelect.options[0];
        unitLabel.textContent = firstOption.dataset.unit || 'units';
    }
    
    // Update unit when type changes
    typeSelect.addEventListener('change', () => {
        const selectedOption = typeSelect.options[typeSelect.selectedIndex];
        unitLabel.textContent = selectedOption.dataset.unit || 'units';
    });
}

/**
 * Handle emission form submission
 * @param {Event} e - Form submit event
 */
function handleEmissionSubmit(e) {
    e.preventDefault();
    
    const category = document.getElementById('emissionCategory').value;
    const type = document.getElementById('emissionType').value;
    const amount = parseFloat(document.getElementById('emissionAmount').value);
    const description = document.getElementById('emissionDescription').value;
    const date = document.getElementById('emissionDate').value;
    
    const emissions = calculateEmissions(category, type, amount);
    
    const entry = {
        category,
        type,
        amount,
        emissions,
        description,
        timestamp: date ? new Date(date).toISOString() : new Date().toISOString()
    };
    
    saveEmission(entry);
    
    // Show success message
    showNotification('Emission logged successfully!', 'success');
    
    // Reset form
    e.target.reset();
    
    // Reload dashboard if it's visible
    if (currentView === 'dashboard') {
        loadDashboard();
    }
}

/**
 * Load history view
 */
function loadHistory() {
    const emissions = getEmissions().sort((a, b) => 
        new Date(b.timestamp) - new Date(a.timestamp)
    );
    
    const historyList = document.getElementById('historyList');
    historyList.innerHTML = '';
    
    if (emissions.length === 0) {
        historyList.innerHTML = '<p class="no-data">No emissions logged yet. Start by logging your first activity!</p>';
        return;
    }
    
    const categoryLabels = {
        transportation: 'Transportation',
        energy: 'Home Energy',
        food: 'Food & Diet',
        shopping: 'Shopping & Goods'
    };
    
    emissions.forEach(entry => {
        const div = document.createElement('div');
        div.className = 'history-item';
        
        const date = new Date(entry.timestamp);
        const typeInfo = EMISSION_FACTORS[entry.category]?.[entry.type];
        
        div.innerHTML = `
            <div class="history-header">
                <span class="history-category">${categoryLabels[entry.category] || entry.category}</span>
                <span class="history-emissions">${formatEmissions(entry.emissions)}</span>
            </div>
            <div class="history-details">
                <span class="history-type">${typeInfo?.label || entry.type}</span>
                <span class="history-amount">${entry.amount} ${typeInfo?.unit || 'units'}</span>
            </div>
            <div class="history-meta">
                <span class="history-date">${date.toLocaleDateString()} ${date.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</span>
                ${entry.description ? `<span class="history-description">${entry.description}</span>` : ''}
            </div>
            <button class="delete-btn" onclick="deleteEmissionEntry('${entry.id}')">Delete</button>
        `;
        
        historyList.appendChild(div);
    });
}

/**
 * Delete an emission entry
 * @param {string} id - Entry ID
 */
function deleteEmissionEntry(id) {
    if (confirm('Are you sure you want to delete this entry?')) {
        deleteEmission(id);
        showNotification('Entry deleted', 'info');
        loadHistory();
        if (currentView === 'dashboard') {
            loadDashboard();
        }
    }
}

/**
 * Load goals view
 */
function loadGoals() {
    const goalsContainer = document.getElementById('goalsList');
    const suggestions = document.getElementById('goalSuggestions');
    
    // Load active goals
    const goals = getActiveGoalsWithProgress();
    goalsContainer.innerHTML = '';
    
    if (goals.length === 0) {
        goalsContainer.innerHTML = '<p class="no-data">No active goals. Create one below!</p>';
    } else {
        goals.forEach(goal => {
            const div = document.createElement('div');
            div.className = 'goal-item';
            
            const progress = goal.progress;
            const statusClass = progress.status === 'on-track' ? 'on-track' : 'exceeded';
            
            div.innerHTML = `
                <div class="goal-header">
                    <h3>${goal.title}</h3>
                    <span class="goal-status ${statusClass}">${progress.status}</span>
                </div>
                <div class="goal-progress">
                    <div class="progress-bar">
                        <div class="progress-fill" style="width: ${Math.min(progress.percentage, 100)}%"></div>
                    </div>
                    <div class="goal-stats">
                        <span>Current: ${formatEmissions(progress.currentEmissions)}</span>
                        <span>Target: ${formatEmissions(progress.targetEmissions)}</span>
                    </div>
                </div>
                <div class="goal-meta">
                    <span>Period: ${goal.period}</span>
                    ${progress.remaining > 0 ? 
                        `<span>${formatEmissions(progress.remaining)} remaining</span>` : 
                        `<span>Target exceeded by ${formatEmissions(Math.abs(progress.remaining))}</span>`
                    }
                </div>
                <button class="delete-btn" onclick="deleteGoalEntry('${goal.id}')">Delete</button>
            `;
            
            goalsContainer.appendChild(div);
        });
    }
    
    // Load goal suggestions
    const suggestionsList = getGoalSuggestions();
    suggestions.innerHTML = '';
    
    suggestionsList.forEach(suggestion => {
        const div = document.createElement('div');
        div.className = 'suggestion-item';
        div.innerHTML = `
            <span>${suggestion.title}</span>
            <button class="btn-small" onclick="createGoalFromSuggestion('${suggestion.title}', ${suggestion.target}, '${suggestion.period}')">
                Add Goal
            </button>
        `;
        suggestions.appendChild(div);
    });
}

/**
 * Delete a goal
 * @param {string} id - Goal ID
 */
function deleteGoalEntry(id) {
    if (confirm('Are you sure you want to delete this goal?')) {
        deleteGoal(id);
        showNotification('Goal deleted', 'info');
        loadGoals();
    }
}

/**
 * Create goal from suggestion
 * @param {string} title - Goal title
 * @param {number} target - Target emissions
 * @param {string} period - Time period
 */
function createGoalFromSuggestion(title, target, period) {
    createGoal(title, target, period);
    showNotification('Goal created!', 'success');
    loadGoals();
}

/**
 * Handle goal form submission
 * @param {Event} e - Form submit event
 */
function handleGoalSubmit(e) {
    e.preventDefault();
    
    const title = document.getElementById('goalTitle').value;
    const target = parseFloat(document.getElementById('goalTarget').value);
    const period = document.getElementById('goalPeriod').value;
    
    createGoal(title, target, period);
    showNotification('Goal created!', 'success');
    
    e.target.reset();
    loadGoals();
}

/**
 * Load tips view
 */
function loadTips() {
    const tipsContainer = document.getElementById('tipsList');
    const tips = getPersonalizedTips();
    
    tipsContainer.innerHTML = '';
    
    tips.forEach(tip => {
        const div = document.createElement('div');
        div.className = 'tip-item';
        
        const impactClass = `impact-${tip.impact}`;
        
        div.innerHTML = `
            <div class="tip-header">
                <h3>${tip.title}</h3>
                <span class="tip-impact ${impactClass}">${tip.impact} impact</span>
            </div>
            <p class="tip-description">${tip.description}</p>
        `;
        
        tipsContainer.appendChild(div);
    });
}

/**
 * Show notification message
 * @param {string} message - Message to display
 * @param {string} type - Notification type (success, error, info)
 */
function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.textContent = message;
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.classList.add('show');
    }, 10);
    
    setTimeout(() => {
        notification.classList.remove('show');
        setTimeout(() => {
            notification.remove();
        }, 300);
    }, 3000);
}

// Initialize app when DOM is loaded
document.addEventListener('DOMContentLoaded', initApp);
