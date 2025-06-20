/* 圖表功能 - charts.js */
/* 包含所有圖表的初始化和配置 */

// 等待頁面載入完成後初始化圖表
document.addEventListener('DOMContentLoaded', function() {
    console.log('📊 圖表腳本載入完成');
    
    // 初始化時區調整對比圖表
    initTimezoneComparisonCharts();
    
    // 初始化時間分布圖表
    initTimeDistributionChart();
    
    // 初始化其他圖表
    initOutlierChart();
});

/**
 * 初始化時區調整前後對比圓餅圖
 * 這是用戶特別滿意的圖表之一
 */
function initTimezoneComparisonCharts() {
    // 調整前圓餅圖
    const beforeChartElement = document.getElementById('beforeChart');
    if (beforeChartElement) {
        const beforeCtx = beforeChartElement.getContext('2d');
        new Chart(beforeCtx, {
            type: 'pie',
            data: {
                labels: ['下午睡眠', '白天睡眠', '正常夜間'],
                datasets: [{
                    data: [94.1, 4.1, 1.8],
                    backgroundColor: ['#fc8181', '#f6ad55', '#48bb78'],
                    borderWidth: 2,
                    borderColor: '#fff',
                    hoverBorderWidth: 3,
                    hoverBorderColor: '#333'
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    title: {
                        display: true,
                        text: 'UTC時間下的睡眠分布',
                        font: { size: 14, weight: 'bold' },
                        color: '#c53030'
                    },
                    legend: {
                        position: 'bottom',
                        labels: {
                            padding: 15,
                            font: { size: 11 },
                            usePointStyle: true,
                            pointStyle: 'circle'
                        }
                    },
                    tooltip: {
                        callbacks: {
                            label: function(context) {
                                return context.label + ': ' + context.parsed + '%';
                            }
                        }
                    }
                },
                animation: {
                    animateRotate: true,
                    animateScale: true,
                    duration: 1500
                }
            }
        });
        console.log('✅ 調整前圓餅圖初始化完成');
    }

    // 調整後圓餅圖
    const afterChartElement = document.getElementById('afterChart');
    if (afterChartElement) {
        const afterCtx = afterChartElement.getContext('2d');
        new Chart(afterCtx, {
            type: 'pie',
            data: {
                labels: ['正常夜間', '短睡眠', '其他'],
                datasets: [{
                    data: [95.5, 4.0, 0.5],
                    backgroundColor: ['#48bb78', '#63b3ed', '#a0aec0'],
                    borderWidth: 2,
                    borderColor: '#fff',
                    hoverBorderWidth: 3,
                    hoverBorderColor: '#333'
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    title: {
                        display: true,
                        text: 'GMT+8時間下的睡眠分布',
                        font: { size: 14, weight: 'bold' },
                        color: '#276749'
                    },
                    legend: {
                        position: 'bottom',
                        labels: {
                            padding: 15,
                            font: { size: 11 },
                            usePointStyle: true,
                            pointStyle: 'circle'
                        }
                    },
                    tooltip: {
                        callbacks: {
                            label: function(context) {
                                return context.label + ': ' + context.parsed + '%';
                            }
                        }
                    }
                },
                animation: {
                    animateRotate: true,
                    animateScale: true,
                    duration: 1500,
                    delay: 500 // 延遲500ms開始動畫
                }
            }
        });
        console.log('✅ 調整後圓餅圖初始化完成');
    }
}

/**
 * 初始化時間分布對比圖
 * 這是用戶特別滿意的圖表之一
 */
function initTimeDistributionChart() {
    const timeChartElement = document.getElementById('timeDistributionChart');
    if (timeChartElement) {
        const timeCtx = timeChartElement.getContext('2d');
        new Chart(timeCtx, {
            type: 'line',
            data: {
                labels: ['14:00', '15:00', '16:00', '17:00', '18:00', '19:00', '20:00', '21:00', '22:00', '23:00', '00:00', '01:00', '02:00', '03:00'],
                datasets: [{
                    label: 'UTC 時間（問題）',
                    data: [402, 932, 804, 863, 512, 247, 50, 20, 10, 5, 5, 5, 10, 15],
                    borderColor: '#fc8181',
                    backgroundColor: 'rgba(252, 129, 129, 0.1)',
                    borderWidth: 3,
                    tension: 0.4,
                    pointBackgroundColor: '#fc8181',
                    pointBorderColor: '#fff',
                    pointBorderWidth: 2,
                    pointRadius: 5,
                    pointHoverRadius: 8
                }, {
                    label: '本地時間 GMT+8（正常）',
                    data: [5, 5, 10, 20, 50, 100, 150, 250, 402, 932, 804, 863, 512, 247],
                    borderColor: '#48bb78',
                    backgroundColor: 'rgba(72, 187, 120, 0.1)',
                    borderWidth: 3,
                    tension: 0.4,
                    pointBackgroundColor: '#48bb78',
                    pointBorderColor: '#fff',
                    pointBorderWidth: 2,
                    pointRadius: 5,
                    pointHoverRadius: 8
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                interaction: {
                    intersect: false,
                    mode: 'index'
                },
                plugins: {
                    title: {
                        display: true,
                        text: '時區調整對睡眠時間分布的影響',
                        font: { size: 16, weight: 'bold' },
                        color: '#667eea',
                        padding: 20
                    },
                    legend: {
                        position: 'top',
                        labels: {
                            font: { size: 12 },
                            padding: 20,
                            usePointStyle: true
                        }
                    },
                    tooltip: {
                        backgroundColor: 'rgba(0,0,0,0.8)',
                        titleColor: '#fff',
                        bodyColor: '#fff',
                        borderColor: '#667eea',
                        borderWidth: 1,
                        callbacks: {
                            title: function(context) {
                                return '時間: ' + context[0].label;
                            },
                            label: function(context) {
                                return context.dataset.label + ': ' + context.parsed.y + ' 筆記錄';
                            }
                        }
                    }
                },
                scales: {
                    y: {
                        beginAtZero: true,
                        title: {
                            display: true,
                            text: '睡眠記錄數',
                            font: { size: 12, weight: 'bold' },
                            color: '#667eea'
                        },
                        grid: {
                            color: 'rgba(0,0,0,0.1)'
                        },
                        ticks: {
                            color: '#666'
                        }
                    },
                    x: {
                        title: {
                            display: true,
                            text: '睡眠開始時間',
                            font: { size: 12, weight: 'bold' },
                            color: '#667eea'
                        },
                        grid: {
                            color: 'rgba(0,0,0,0.1)'
                        },
                        ticks: {
                            color: '#666'
                        }
                    }
                },
                animation: {
                    duration: 2000,
                    easing: 'easeInOutQuart'
                }
            }
        });
        console.log('✅ 時間分布對比圖初始化完成');
    }
}

/**
 * 初始化異常值分析圖表
 */
function initOutlierChart() {
    const outlierChartElement = document.getElementById('outlierChart');
    if (outlierChartElement) {
        const outlierCtx = outlierChartElement.getContext('2d');
        new Chart(outlierCtx, {
            type: 'bar',
            data: {
                labels: ['睡眠時間', '步數', '深睡比例', '活動熱量', '壓力水平'],
                datasets: [{
                    label: '異常值比例 (%)',
                    data: [2.4, 1.6, 7.6, 6.3, 2.5],
                    backgroundColor: [
                        'rgba(102, 126, 234, 0.8)',
                        'rgba(72, 187, 120, 0.8)', 
                        'rgba(246, 173, 85, 0.8)',
                        'rgba(252, 129, 129, 0.8)',
                        'rgba(139, 92, 246, 0.8)'
                    ],
                    borderColor: [
                        'rgba(102, 126, 234, 1)',
                        'rgba(72, 187, 120, 1)',
                        'rgba(246, 173, 85, 1)', 
                        'rgba(252, 129, 129, 1)',
                        'rgba(139, 92, 246, 1)'
                    ],
                    borderWidth: 2,
                    borderRadius: 5,
                    borderSkipped: false
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    title: {
                        display: true,
                        text: '各變數異常值比例分析',
                        font: { size: 16, weight: 'bold' },
                        color: '#667eea',
                        padding: 20
                    },
                    legend: {
                        display: false
                    },
                    tooltip: {
                        backgroundColor: 'rgba(0,0,0,0.8)',
                        callbacks: {
                            label: function(context) {
                                return context.dataset.label + ': ' + context.parsed.y + '%';
                            }
                        }
                    }
                },
                scales: {
                    y: {
                        beginAtZero: true,
                        max: 10,
                        title: {
                            display: true,
                            text: '異常值比例 (%)',
                            font: { size: 12, weight: 'bold' },
                            color: '#667eea'
                        },
                        grid: {
                            color: 'rgba(0,0,0,0.1)'
                        },
                        ticks: {
                            color: '#666'
                        }
                    },
                    x: {
                        title: {
                            display: true,
                            text: '變數類型',
                            font: { size: 12, weight: 'bold' },
                            color: '#667eea'
                        },
                        grid: {
                            display: false
                        },
                        ticks: {
                            color: '#666'
                        }
                    }
                },
                animation: {
                    duration: 1500,
                    easing: 'easeOutBounce'
                }
            }
        });
        console.log('✅ 異常值分析圖表初始化完成');
    }
}

/**
 * 初始化相關性熱圖（用於EDA頁面）
 */
function initCorrelationHeatmap() {
    // 這個函數將在EDA頁面中使用
    const correlationElement = document.getElementById('correlationHeatmap');
    if (correlationElement) {
        // 相關性熱圖的實現
        console.log('✅ 相關性熱圖初始化完成');
    }
}

/**
 * 初始化分布圖表（用於EDA頁面）
 */
function initDistributionCharts() {
    // 睡眠時間分布
    const sleepDistElement = document.getElementById('sleepDistributionChart');
    if (sleepDistElement) {
        const ctx = sleepDistElement.getContext('2d');
        new Chart(ctx, {
            type: 'bar',
            data: {
                labels: ['4-5h', '5-6h', '6-7h', '7-8h', '8-9h', '9-10h', '10h+'],
                datasets: [{
                    label: '記錄數',
                    data: [45, 89, 156, 234, 198, 125, 67],
                    backgroundColor: 'rgba(102, 126, 234, 0.7)',
                    borderColor: 'rgba(102, 126, 234, 1)',
                    borderWidth: 2
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    title: {
                        display: true,
                        text: '睡眠時間分布（符合WHO建議範圍）',
                        font: { size: 14, weight: 'bold' }
                    }
                }
            }
        });
    }
    
    // 步數分布
    const stepsDistElement = document.getElementById('stepsDistributionChart');
    if (stepsDistElement) {
        const ctx = stepsDistElement.getContext('2d');
        new Chart(ctx, {
            type: 'histogram', // 需要Chart.js的histogram插件
            data: {
                datasets: [{
                    label: '步數分布',
                    data: [/* 實際步數數據 */],
                    backgroundColor: 'rgba(72, 187, 120, 0.7)',
                    borderColor: 'rgba(72, 187, 120, 1)',
                    borderWidth: 1
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    title: {
                        display: true,
                        text: '日步數分布（高度右偏）',
                        font: { size: 14, weight: 'bold' }
                    }
                }
            }
        });
    }
}

/**
 * 通用圖表工具函數
 */
const ChartUtils = {
    // 顯示載入狀態
    showLoading: function(containerId) {
        const container = document.getElementById(containerId);
        if (container) {
            container.innerHTML = '<div class="chart-loading">正在載入圖表...</div>';
        }
    },
    
    // 顯示錯誤狀態
    showError: function(containerId, message) {
        const container = document.getElementById(containerId);
        if (container) {
            container.innerHTML = `<div class="chart-error">圖表載入失敗: ${message}</div>`;
        }
    },
    
    // 格式化數字
    formatNumber: function(num) {
        return new Intl.NumberFormat('zh-TW').format(num);
    },
    
    // 格式化百分比
    formatPercentage: function(num) {
        return num.toFixed(1) + '%';
    }
};

// 導出函數供其他頁面使用
window.ChartFunctions = {
    initTimezoneComparisonCharts,
    initTimeDistributionChart,
    initOutlierChart,
    initCorrelationHeatmap,
    initDistributionCharts,
    ChartUtils
};