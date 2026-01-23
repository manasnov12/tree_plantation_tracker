document.addEventListener('DOMContentLoaded', function() {
    // ----------------------------------------------------
    // Chart.js Default Settings (Optional, for consistent styling)
    // ----------------------------------------------------
    Chart.defaults.font.family = 'Poppins, sans-serif';
    Chart.defaults.font.size = 12;
    Chart.defaults.color = '#555';

    // ----------------------------------------------------
    // 1. Tree Distribution Chart 1 & 2 (Doughnut Chart)
    // ----------------------------------------------------
    const treeDistributionData = {
        labels: ['199 (30.71%)', '248 (38.2%)', '201 (31.02%)'], // Labels with percentage as in image
        datasets: [{
            data: [199, 248, 201],
            backgroundColor: [
                '#a3cc9c', // Lighter green
                '#4a8e52', // Medium green
                '#1a4d2e'  // Darker green
            ],
            borderColor: '#ffffff', // White border for segments
            borderWidth: 2,
            hoverOffset: 4
        }]
    };

    const configDoughnut = {
        type: 'doughnut',
        data: treeDistributionData,
        options: {
            responsive: true,
            maintainAspectRatio: false, // Allows flexible sizing
            plugins: {
                legend: {
                    position: 'right', // Legend position as in the image
                    labels: {
                        boxWidth: 10,
                        padding: 15, // Padding between legend items
                        font: {
                            size: 10 // Smaller font for legend
                        }
                    }
                },
                tooltip: {
                    callbacks: {
                        label: function(context) {
                            let label = context.label || '';
                            if (label) {
                                label += ': ';
                            }
                            if (context.parsed !== null) {
                                label += context.parsed;
                            }
                            return label;
                        }
                    }
                }
            },
            cutout: '70%', // Doughnut size
            elements: {
                arc: {
                    // borderWidth: 0 // Removed to allow custom borderColor
                }
            }
        }
    };

    new Chart(
        document.getElementById('treeDistribution1'),
        configDoughnut
    );

    new Chart(
        document.getElementById('treeDistribution2'),
        configDoughnut
    );

    // ----------------------------------------------------
    // 2. Plantation Date Trends Chart (Line Chart with Area Fill)
    // ----------------------------------------------------
    const dateLabels = Array.from({length: 30}, (_, i) => i + 1); // Days 1 to 30
    const dateDataValues = [
        100, 90, 120, 80, 110, 130, 100, 90, 110, 140, 90, 70, 120, 150, 110,
        130, 100, 110, 90, 120, 130, 110, 140, 100, 120, 110, 130, 100, 90, 120
    ]; // Sample data resembling the trend in the image

    const configDateTrends = {
        type: 'line',
        data: {
            labels: dateLabels,
            datasets: [{
                label: 'Plantation Count',
                data: dateDataValues,
                fill: true, // Fill area below the line
                backgroundColor: 'rgba(74, 142, 82, 0.4)', // Green with transparency
                borderColor: '#1a4d2e', // Dark green line
                tension: 0.3, // Smooth curve
                pointRadius: 0, // No points on the line
                pointHoverRadius: 5,
                borderWidth: 2,
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    display: false // No legend for this chart
                },
                tooltip: {
                    mode: 'index',
                    intersect: false,
                }
            },
            scales: {
                x: {
                    grid: {
                        display: false // No vertical grid lines
                    },
                    ticks: {
                        autoSkip: true,
                        maxTicksLimit: 10 // Limit x-axis labels
                    },
                    title: {
                        display: true,
                        text: 'Day',
                        font: {
                            size: 12,
                            weight: 'bold'
                        }
                    }
                },
                y: {
                    beginAtZero: true,
                    grid: {
                        color: '#eee' // Light grey horizontal grid lines
                    },
                    title: {
                        display: false // No y-axis title
                    }
                }
            }
        }
    };

    new Chart(
        document.getElementById('plantationDateTrends'),
        configDateTrends
    );

    // ----------------------------------------------------
    // 3. User Wise Tree Plantation Chart (Horizontal Bar Chart)
    // ----------------------------------------------------
    const userWiseData = {
        labels: ['Vivaan Sin...', 'Vipin Singh', 'Yuvraj Bhatt', 'Yash Chau...', 'Zara Green'],
        datasets: [{
            label: 'NoOfTrees',
            data: [50, 45, 40, 30, 20], // Sample data, descending order for visual resemblance
            backgroundColor: [
                '#599e63', // Darkest for top
                '#73ad7d',
                '#8dc097',
                '#a7d3b1',
                '#c1e6cb'  // Lightest for bottom
            ],
            borderColor: '#1a4d2e',
            borderWidth: 1,
            barThickness: 15 // Thinner bars for a cleaner look
        }]
    };

    const configUserWise = {
        type: 'bar',
        data: userWiseData,
        options: {
            indexAxis: 'y', // Horizontal bars
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    display: false
                },
                tooltip: {
                    mode: 'index',
                    intersect: false,
                }
            },
            scales: {
                x: {
                    beginAtZero: true,
                    grid: {
                        display: false
                    },
                    ticks: {
                        stepSize: 10
                    }
                },
                y: {
                    grid: {
                        display: false // No horizontal grid lines
                    },
                    title: {
                        display: true,
                        text: 'UserName',
                        font: {
                            size: 12,
                            weight: 'bold'
                        }
                    },
                    // Reverse the order of labels to match image (highest bar at top)
                    // This can also be done by reversing the labels/data directly.
                    // beginAtZero: true, // Keep this if needed
                    reverse: true,
                }
            }
        }
    };

    new Chart(
        document.getElementById('userWisePlantation'),
        configUserWise
    );

    // ----------------------------------------------------
    // 4. NoOfTrees by SiteName Chart (Vertical Bar Chart)
    // ----------------------------------------------------
    const siteWiseData = {
        labels: ['River Side Garden', 'Hill View Park', 'Sunshine Eco Park', 'Village Green Belt', 'Heritage Eco Zone'],
        datasets: [{
            label: 'NoOfTrees',
            data: [220, 200, 200, 190, 180], // Sample data
            backgroundColor: '#4a8e52', // Single green color for all bars
            borderRadius: 5, // Rounded corners for bars
            borderSkipped: false, // Ensure border radius applies to all corners
            barPercentage: 0.7, // Width of the bars relative to the category width
            categoryPercentage: 0.8 // Space between categories
        }]
    };

    const configSiteWise = {
        type: 'bar',
        data: siteWiseData,
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    display: false
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    grid: {
                        color: '#eee'
                    },
                    title: {
                        display: true,
                        text: 'NoOfTrees',
                        font: {
                            size: 12,
                            weight: 'bold'
                        }
                    }
                },
                x: {
                    grid: {
                        display: false // No vertical grid lines
                    },
                    title: {
                        display: true,
                        text: 'SiteName',
                        font: {
                            size: 12,
                            weight: 'bold'
                        }
                    },
                    ticks: {
                        autoSkip: false,
                        maxRotation: 45,
                        minRotation: 45 // Rotate labels for better readability
                    }
                }
            }
        }
    };

    new Chart(
        document.getElementById('siteWiseTrees'),
        configSiteWise
    );
});