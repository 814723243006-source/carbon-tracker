/**
 * Chart and Visualization Logic
 * Uses Chart.js for data visualization
 */

let dashboardCharts = {};

/**
 * Initialize dashboard charts
 */
function initializeDashboardCharts() {
    // Check if Chart.js is available
    if (typeof Chart === 'undefined') {
        console.warn('Chart.js not loaded. Charts will not be displayed.');
        displayChartPlaceholder('categoryChart', 'Category chart requires Chart.js library');
        displayChartPlaceholder('trendChart', 'Trend chart requires Chart.js library');
        return;
    }
    
    createCategoryPieChart();
    createTrendLineChart();
}

/**
 * Display placeholder when Chart.js is not available
 */
function displayChartPlaceholder(canvasId, message) {
    const canvas = document.getElementById(canvasId);
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    const width = canvas.offsetWidth || 400;
    const height = canvas.offsetHeight || 300;
    
    canvas.width = width;
    canvas.height = height;
    
    ctx.fillStyle = '#f5f5f5';
    ctx.fillRect(0, 0, width, height);
    
    ctx.fillStyle = '#757575';
    ctx.font = '14px Arial';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(message, width / 2, height / 2);
}

/**
 * Create pie chart for emissions by category
 */
function createCategoryPieChart() {
    const ctx = document.getElementById('categoryChart');
    if (!ctx || typeof Chart === 'undefined') return;
    
    const emissions = getEmissions();
    const byCategory = calculateEmissionsByCategory(emissions);
    
    const categoryLabels = {
        transportation: 'Transportation',
        energy: 'Home Energy',
        food: 'Food & Diet',
        shopping: 'Shopping & Goods'
    };
    
    const labels = Object.keys(byCategory).map(cat => categoryLabels[cat] || cat);
    const data = Object.values(byCategory);
    const colors = ['#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0'];
    
    // Destroy existing chart if it exists
    if (dashboardCharts.categoryChart) {
        dashboardCharts.categoryChart.destroy();
    }
    
    if (data.length === 0 || data.every(d => d === 0)) {
        ctx.getContext('2d').font = '16px Arial';
        ctx.getContext('2d').fillStyle = '#666';
        ctx.getContext('2d').textAlign = 'center';
        ctx.getContext('2d').fillText('No data yet', ctx.width / 2, ctx.height / 2);
        return;
    }
    
    dashboardCharts.categoryChart = new Chart(ctx, {
        type: 'doughnut',
        data: {
            labels: labels,
            datasets: [{
                data: data,
                backgroundColor: colors,
                borderWidth: 2,
                borderColor: '#fff'
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    position: 'bottom',
                    labels: {
                        padding: 15,
                        font: { size: 12 }
                    }
                },
                tooltip: {
                    callbacks: {
                        label: function(context) {
                            const label = context.label || '';
                            const value = context.parsed || 0;
                            return `${label}: ${formatEmissions(value)}`;
                        }
                    }
                }
            }
        }
    });
}

/**
 * Create line chart for emission trends over time
 */
function createTrendLineChart() {
    const ctx = document.getElementById('trendChart');
    if (!ctx || typeof Chart === 'undefined') return;
    
    const emissions = getEmissions();
    const period = document.getElementById('periodSelect')?.value || 'week';
    
    const { labels, data } = aggregateEmissionsByPeriod(emissions, period);
    
    // Destroy existing chart if it exists
    if (dashboardCharts.trendChart) {
        dashboardCharts.trendChart.destroy();
    }
    
    if (data.length === 0) {
        ctx.getContext('2d').font = '16px Arial';
        ctx.getContext('2d').fillStyle = '#666';
        ctx.getContext('2d').textAlign = 'center';
        ctx.getContext('2d').fillText('No data yet', ctx.width / 2, ctx.height / 2);
        return;
    }
    
    dashboardCharts.trendChart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: labels,
            datasets: [{
                label: 'Emissions (kg CO2e)',
                data: data,
                borderColor: '#4CAF50',
                backgroundColor: 'rgba(76, 175, 80, 0.1)',
                borderWidth: 2,
                fill: true,
                tension: 0.4
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    display: false
                },
                tooltip: {
                    callbacks: {
                        label: function(context) {
                            return `${formatEmissions(context.parsed.y)}`;
                        }
                    }
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    ticks: {
                        callback: function(value) {
                            return value.toFixed(1);
                        }
                    }
                }
            }
        }
    });
}

/**
 * Aggregate emissions by time period
 * @param {Array} emissions - Emissions array
 * @param {string} period - Period type (day, week, month, year)
 * @returns {Object} Labels and data arrays
 */
function aggregateEmissionsByPeriod(emissions, period) {
    if (emissions.length === 0) {
        return { labels: [], data: [] };
    }
    
    const aggregated = {};
    
    emissions.forEach(entry => {
        const date = new Date(entry.timestamp);
        let key;
        
        switch (period) {
            case 'day':
                key = date.toISOString().split('T')[0];
                break;
            case 'week':
                const weekStart = new Date(date);
                weekStart.setDate(date.getDate() - date.getDay());
                key = weekStart.toISOString().split('T')[0];
                break;
            case 'month':
                key = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
                break;
            case 'year':
                key = date.getFullYear().toString();
                break;
            default:
                key = date.toISOString().split('T')[0];
        }
        
        if (!aggregated[key]) {
            aggregated[key] = 0;
        }
        aggregated[key] += entry.emissions;
    });
    
    // Sort by date
    const sortedKeys = Object.keys(aggregated).sort();
    
    // Format labels
    const labels = sortedKeys.map(key => {
        switch (period) {
            case 'day':
                return new Date(key).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
            case 'week':
                return `Week of ${new Date(key).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}`;
            case 'month':
                const [year, month] = key.split('-');
                return new Date(year, month - 1).toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
            case 'year':
                return key;
            default:
                return key;
        }
    });
    
    const data = sortedKeys.map(key => aggregated[key]);
    
    return { labels, data };
}

/**
 * Update charts with new data
 */
function updateCharts() {
    createCategoryPieChart();
    createTrendLineChart();
}

/**
 * Destroy all charts (for cleanup)
 */
function destroyAllCharts() {
    Object.values(dashboardCharts).forEach(chart => {
        if (chart && typeof chart.destroy === 'function') {
            chart.destroy();
        }
    });
    dashboardCharts = {};
}
