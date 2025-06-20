/* 共用JavaScript函數 - common.js */
/* 適用於所有頁面的基礎功能 */

document.addEventListener('DOMContentLoaded', function() {
    console.log('🚀 共用腳本載入完成');
    
    // 初始化所有共用功能
    initActiveNavigation();
    initScrollEffects();
    initTooltips();
    initResponsiveTable();
});

/**
 * 初始化導航高亮功能
 * 根據當前頁面自動高亮對應的導航項目
 */
function initActiveNavigation() {
    const currentPath = window.location.pathname;
    const navLinks = document.querySelectorAll('.nav-link');
    
    navLinks.forEach(link => {
        const href = link.getAttribute('href');
        
        // 檢查當前路徑是否匹配導航鏈接
        if (currentPath.includes(href) && href !== '../' && href !== './') {
            link.classList.add('active');
        }
        
        // 特殊處理首頁
        if ((currentPath.endsWith('/') || currentPath.endsWith('index.html')) && 
            (href === '../' || href === './' || href === 'index.html')) {
            link.classList.add('active');
        }
    });
    
    console.log('✅ 導航高亮初始化完成');
}

/**
 * 初始化滾動效果
 * 包括頁面滾動時的視覺效果
 */
function initScrollEffects() {
    let lastScrollTop = 0;
    const header = document.querySelector('.header');
    const navigation = document.querySelector('.navigation');
    
    window.addEventListener('scroll', function() {
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        
        // 導航欄滾動效果
        if (navigation) {
            if (scrollTop > 100) {
                navigation.style.boxShadow = '0 4px 20px rgba(0,0,0,0.15)';
                navigation.style.backgroundColor = 'rgba(255,255,255,0.95)';
                navigation.style.backdropFilter = 'blur(10px)';
            } else {
                navigation.style.boxShadow = '0 2px 10px rgba(0,0,0,0.1)';
                navigation.style.backgroundColor = 'white';
                navigation.style.backdropFilter = 'none';
            }
        }
        
        // 區塊進入視野動畫
        const sections = document.querySelectorAll('.section');
        sections.forEach(section => {
            const rect = section.getBoundingClientRect();
            const isVisible = rect.top < window.innerHeight && rect.bottom > 0;
            
            if (isVisible && !section.classList.contains('animated')) {
                section.style.animation = 'slideInUp 0.6s ease-out';
                section.classList.add('animated');
            }
        });
        
        lastScrollTop = scrollTop;
    });
    
    console.log('✅ 滾動效果初始化完成');
}

/**
 * 初始化工具提示功能
 */
function initTooltips() {
    const tooltipElements = document.querySelectorAll('[data-tooltip]');
    
    tooltipElements.forEach(element => {
        element.addEventListener('mouseenter', showTooltip);
        element.addEventListener('mouseleave', hideTooltip);
    });
    
    function showTooltip(e) {
        const text = e.target.getAttribute('data-tooltip');
        if (!text) return;
        
        const tooltip = document.createElement('div');
        tooltip.className = 'tooltip';
        tooltip.textContent = text;
        document.body.appendChild(tooltip);
        
        const rect = e.target.getBoundingClientRect();
        tooltip.style.left = rect.left + (rect.width / 2) - (tooltip.offsetWidth / 2) + 'px';
        tooltip.style.top = rect.top - tooltip.offsetHeight - 10 + 'px';
        
        tooltip.style.opacity = '1';
    }
    
    function hideTooltip() {
        const tooltip = document.querySelector('.tooltip');
        if (tooltip) {
            tooltip.remove();
        }
    }
    
    console.log('✅ 工具提示初始化完成');
}

/**
 * 初始化響應式表格
 */
function initResponsiveTable() {
    const tables = document.querySelectorAll('.statistical-table');
    
    tables.forEach(table => {
        // 為表格添加響應式包裝
        if (!table.parentElement.classList.contains('table-wrapper')) {
            const wrapper = document.createElement('div');
            wrapper.className = 'table-wrapper';
            table.parentNode.insertBefore(wrapper, table);
            wrapper.appendChild(table);
        }
        
        // 為手機端添加滾動提示
        if (window.innerWidth <= 768) {
            const scrollHint = document.createElement('div');
            scrollHint.className = 'scroll-hint';
            scrollHint.textContent = '← 左右滑動查看更多 →';
            table.parentElement.insertBefore(scrollHint, table);
        }
    });
    
    console.log('✅ 響應式表格初始化完成');
}

/**
 * 通用工具函數
 */
const Utils = {
    // 格式化日期
    formatDate: function(dateString) {
        const date = new Date(dateString);
        return date.toLocaleDateString('zh-TW', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    },
    
    // 格式化數字
    formatNumber: function(num, decimals = 0) {
        return new Intl.NumberFormat('zh-TW', {
            minimumFractionDigits: decimals,
            maximumFractionDigits: decimals
        }).format(num);
    },
    
    // 格式化百分比
    formatPercentage: function(num, decimals = 1) {
        return (num).toFixed(decimals) + '%';
    },
    
    // 防抖函數
    debounce: function(func, delay) {
        let timeoutId;
        return function (...args) {
            clearTimeout(timeoutId);
            timeoutId = setTimeout(() => func.apply(this, args), delay);
        };
    },
    
    // 節流函數
    throttle: function(func, delay) {
        let lastCall = 0;
        return function (...args) {
            const now = Date.now();
            if (now - lastCall >= delay) {
                lastCall = now;
                func.apply(this, args);
            }
        };
    },
    
    // 平滑滾動到指定元素
    scrollToElement: function(elementId, offset = 0) {
        const element = document.getElementById(elementId);
        if (element) {
            const y = element.getBoundingClientRect().top + window.pageYOffset - offset;
            window.scrollTo({ top: y, behavior: 'smooth' });
        }
    },
    
    // 顯示載入狀態
    showLoading: function(containerId) {
        const container = document.getElementById(containerId);
        if (container) {
            container.innerHTML = `
                <div class="loading-spinner">
                    <div class="spinner"></div>
                    <p>正在載入...</p>
                </div>
            `;
        }
    },
    
    // 隱藏載入狀態
    hideLoading: function(containerId) {
        const container = document.getElementById(containerId);
        if (container) {
            const spinner = container.querySelector('.loading-spinner');
            if (spinner) {
                spinner.remove();
            }
        }
    },
    
    // 複製文字到剪貼板
    copyToClipboard: function(text) {
        if (navigator.clipboard) {
            navigator.clipboard.writeText(text).then(() => {
                this.showNotification('已複製到剪貼板', 'success');
            });
        } else {
            // 備用方法
            const textArea = document.createElement('textarea');
            textArea.value = text;
            document.body.appendChild(textArea);
            textArea.select();
            document.execCommand('copy');
            document.body.removeChild(textArea);
            this.showNotification('已複製到剪貼板', 'success');
        }
    },
    
    // 顯示通知
    showNotification: function(message, type = 'info') {
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.textContent = message;
        
        document.body.appendChild(notification);
        
        // 顯示動畫
        setTimeout(() => {
            notification.classList.add('show');
        }, 100);
        
        // 自動移除
        setTimeout(() => {
            notification.classList.remove('show');
            setTimeout(() => {
                if (notification.parentNode) {
                    notification.parentNode.removeChild(notification);
                }
            }, 300);
        }, 3000);
    }
};

/**
 * 動畫相關功能
 */
const Animations = {
    // 淡入動畫
    fadeIn: function(element, duration = 500) {
        element.style.opacity = '0';
        element.style.display = 'block';
        
        let start = null;
        function animate(timestamp) {
            if (!start) start = timestamp;
            const progress = timestamp - start;
            
            element.style.opacity = Math.min(progress / duration, 1);
            
            if (progress < duration) {
                requestAnimationFrame(animate);
            }
        }
        
        requestAnimationFrame(animate);
    },
    
    // 滑入動畫
    slideIn: function(element, direction = 'up', duration = 500) {
        const directions = {
            up: { from: 'translateY(30px)', to: 'translateY(0)' },
            down: { from: 'translateY(-30px)', to: 'translateY(0)' },
            left: { from: 'translateX(30px)', to: 'translateX(0)' },
            right: { from: 'translateX(-30px)', to: 'translateX(0)' }
        };
        
        const dir = directions[direction];
        element.style.transform = dir.from;
        element.style.opacity = '0';
        element.style.transition = `transform ${duration}ms ease-out, opacity ${duration}ms ease-out`;
        
        setTimeout(() => {
            element.style.transform = dir.to;
            element.style.opacity = '1';
        }, 50);
    }
};

// 全域可用
window.Utils = Utils;
window.Animations = Animations;

// 添加必要的CSS樣式
const additionalStyles = `
    <style>
        .loading-spinner {
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            padding: 40px;
        }
        
        .spinner {
            width: 40px;
            height: 40px;
            border: 4px solid #f3f3f3;
            border-top: 4px solid #667eea;
            border-radius: 50%;
            animation: spin 1s linear infinite;
        }
        
        @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
        }
        
        @keyframes slideInUp {
            from {
                opacity: 0;
                transform: translateY(30px);
            }
            to {
                opacity: 1;
                transform: translateY(0);
            }
        }
        
        .tooltip {
            position: absolute;
            background: rgba(0,0,0,0.8);
            color: white;
            padding: 8px 12px;
            border-radius: 4px;
            font-size: 12px;
            pointer-events: none;
            z-index: 1000;
            opacity: 0;
            transition: opacity 0.3s;
        }
        
        .notification {
            position: fixed;
            top: 20px;
            right: 20px;
            padding: 12px 20px;
            border-radius: 6px;
            color: white;
            font-weight: 500;
            z-index: 1000;
            transform: translateX(100%);
            transition: transform 0.3s ease;
        }
        
        .notification.show {
            transform: translateX(0);
        }
        
        .notification-success { background: #48bb78; }
        .notification-error { background: #f56565; }
        .notification-info { background: #4299e1; }
        
        .table-wrapper {
            overflow-x: auto;
            margin: 20px 0;
        }
        
        .scroll-hint {
            text-align: center;
            color: #999;
            font-size: 0.8em;
            margin-bottom: 10px;
        }
    </style>
`;

document.head.insertAdjacentHTML('beforeend', additionalStyles);