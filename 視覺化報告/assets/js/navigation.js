/* 導航功能 - navigation.js */
/* 統一的導航邏輯和頁面間切換功能 */

document.addEventListener('DOMContentLoaded', function() {
    console.log('🧭 導航腳本載入完成');
    
    // 初始化導航功能
    initNavigationEvents();
    initBreadcrumbs();
    initPageProgress();
});

/**
 * 初始化導航事件
 */
function initNavigationEvents() {
    const navLinks = document.querySelectorAll('.nav-link');
    
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            // 如果是外部連結或相對路徑，正常跳轉
            const href = this.getAttribute('href');
            if (href.startsWith('http') || href.includes('../') || href.includes('./')) {
                return; // 讓瀏覽器處理正常跳轉
            }
            
            // 移除其他active狀態
            navLinks.forEach(l => l.classList.remove('active'));
            
            // 添加當前active狀態
            this.classList.add('active');
            
            // 平滑滾動到頂部
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });
    });
    
    console.log('✅ 導航事件初始化完成');
}

/**
 * 初始化麵包屑導航
 */
function initBreadcrumbs() {
    const breadcrumbContainer = document.querySelector('.breadcrumb');
    if (!breadcrumbContainer) return;
    
    const pathSegments = window.location.pathname.split('/').filter(segment => segment);
    const breadcrumbs = generateBreadcrumbs(pathSegments);
    
    breadcrumbContainer.innerHTML = breadcrumbs;
    console.log('✅ 麵包屑導航初始化完成');
}

/**
 * 生成麵包屑HTML
 */
function generateBreadcrumbs(segments) {
    const breadcrumbItems = [
        { name: '首頁', path: '../' }
    ];
    
    // 根據路徑生成麵包屑
    segments.forEach((segment, index) => {
        const pathMap = {
            'data-cleaning': '資料清理與品質控制',
            'eda-analysis': '探索性資料分析',
            'multivariate-analysis': '多變量分析'
        };
        
        const name = pathMap[segment] || segment;
        const path = index === segments.length - 1 ? null : '../'.repeat(segments.length - index - 1);
        
        breadcrumbItems.push({ name, path });
    });
    
    return breadcrumbItems.map((item, index) => {
        const isLast = index === breadcrumbItems.length - 1;
        const arrow = index > 0 ? '<span class="breadcrumb-arrow">→</span>' : '';
        
        if (isLast || !item.path) {
            return `${arrow}<span class="breadcrumb-current">${item.name}</span>`;
        } else {
            return `${arrow}<a href="${item.path}" class="breadcrumb-link">${item.name}</a>`;
        }
    }).join('');
}

/**
 * 初始化頁面進度指示器
 */
function initPageProgress() {
    // 創建進度條
    const progressBar = document.createElement('div');
    progressBar.className = 'page-progress';
    progressBar.innerHTML = '<div class="progress-fill"></div>';
    document.body.appendChild(progressBar);
    
    const progressFill = progressBar.querySelector('.progress-fill');
    
    // 計算並更新進度
    function updateProgress() {
        const scrollTop = window.pageYOffset;
        const docHeight = document.documentElement.scrollHeight - window.innerHeight;
        const scrollPercent = (scrollTop / docHeight) * 100;
        
        progressFill.style.width = Math.min(scrollPercent, 100) + '%';
    }
    
    // 監聽滾動事件
    window.addEventListener('scroll', Utils.throttle(updateProgress, 10));
    
    console.log('✅ 頁面進度指示器初始化完成');
}

/**
 * 頁面導航工具函數
 */
const NavigationUtils = {
    // 獲取當前頁面資訊
    getCurrentPage: function() {
        const path = window.location.pathname;
        if (path.includes('data-cleaning')) return 'data-cleaning';
        if (path.includes('eda-analysis')) return 'eda-analysis';
        if (path.includes('multivariate-analysis')) return 'multivariate-analysis';
        return 'home';
    },
    
    // 獲取頁面標題
    getPageTitle: function() {
        const titleMap = {
            'home': 'Garmin運動手環多變量分析報告',
            'data-cleaning': '資料清理與品質控制',
            'eda-analysis': '探索性資料分析',
            'multivariate-analysis': '多變量分析'
        };
        
        return titleMap[this.getCurrentPage()] || '未知頁面';
    },
    
    // 創建統一的導航HTML
    createNavigation: function(currentPage = '') {
        const navItems = [
            { id: 'home', name: '🏠 首頁', href: '../', description: '報告概覽' },
            { id: 'data-cleaning', name: '📋 資料清理', href: '../data-cleaning/', description: '品質控制流程' },
            { id: 'eda-analysis', name: '📊 探索性分析', href: '../eda-analysis/', description: '統計特徵分析' },
            { id: 'multivariate-analysis', name: '🔬 多變量分析', href: '../multivariate-analysis/', description: 'PCA・聚類・迴歸' }
        ];
        
        return `
            <nav class="navigation">
                <div class="nav-container">
                    <ul class="nav-list">
                        ${navItems.map(item => `
                            <li class="nav-item">
                                <a href="${item.href}" 
                                   class="nav-link ${currentPage === item.id ? 'active' : ''}"
                                   data-tooltip="${item.description}">
                                    ${item.name}
                                </a>
                            </li>
                        `).join('')}
                    </ul>
                </div>
            </nav>
        `;
    },
    
    // 創建頁面間連接器
    createPageConnector: function(nextPage, nextTitle, nextDescription) {
        return `
            <div class="page-connector">
                <div class="connector-content">
                    <p class="connector-text">分析完成，準備進入下一階段</p>
                    <div class="connector-arrow">→</div>
                    <a href="../${nextPage}/" class="connector-link">
                        <strong>${nextTitle}</strong>
                        <span class="connector-description">${nextDescription}</span>
                    </a>
                </div>
            </div>
        `;
    },
    
    // 創建返回頂部按鈕
    createBackToTop: function() {
        const backToTop = document.createElement('button');
        backToTop.className = 'back-to-top';
        backToTop.innerHTML = '↑';
        backToTop.title = '返回頂部';
        
        backToTop.addEventListener('click', () => {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });
        
        // 滾動時顯示/隱藏按鈕
        window.addEventListener('scroll', () => {
            if (window.pageYOffset > 300) {
                backToTop.classList.add('show');
            } else {
                backToTop.classList.remove('show');
            }
        });
        
        document.body.appendChild(backToTop);
        return backToTop;
    },
    
    // 創建側邊目錄
    createTableOfContents: function() {
        const headings = document.querySelectorAll('h2, h3');
        if (headings.length === 0) return;
        
        const toc = document.createElement('div');
        toc.className = 'table-of-contents';
        toc.innerHTML = '<h4>頁面目錄</h4>';
        
        const list = document.createElement('ul');
        
        headings.forEach((heading, index) => {
            // 為標題添加ID
            const id = `heading-${index}`;
            heading.id = id;
            
            // 創建目錄項目
            const listItem = document.createElement('li');
            listItem.className = `toc-${heading.tagName.toLowerCase()}`;
            
            const link = document.createElement('a');
            link.href = `#${id}`;
            link.textContent = heading.textContent;
            link.addEventListener('click', (e) => {
                e.preventDefault();
                Utils.scrollToElement(id, 80);
            });
            
            listItem.appendChild(link);
            list.appendChild(listItem);
        });
        
        toc.appendChild(list);
        
        // 添加到頁面右側
        document.body.appendChild(toc);
        
        // 滾動時高亮當前章節
        this.highlightCurrentSection(headings);
        
        return toc;
    },
    
    // 高亮當前章節
    highlightCurrentSection: function(headings) {
        window.addEventListener('scroll', Utils.throttle(() => {
            let current = '';
            
            headings.forEach(heading => {
                const rect = heading.getBoundingClientRect();
                if (rect.top <= 100) {
                    current = heading.id;
                }
            });
            
            // 更新目錄高亮
            document.querySelectorAll('.table-of-contents a').forEach(link => {
                link.classList.remove('active');
                if (link.getAttribute('href') === `#${current}`) {
                    link.classList.add('active');
                }
            });
        }, 100));
    }
};

// 全域可用
window.NavigationUtils = NavigationUtils;

// 添加導航相關的CSS樣式
const navigationStyles = `
    <style>
        .breadcrumb {
            background: #f8f9fa;
            padding: 15px 20px;
            font-size: 0.9em;
            border-bottom: 1px solid #e0e0e0;
        }
        
        .breadcrumb-link {
            color: #667eea;
            text-decoration: none;
        }
        
        .breadcrumb-link:hover {
            text-decoration: underline;
        }
        
        .breadcrumb-current {
            color: #666;
            font-weight: 500;
        }
        
        .breadcrumb-arrow {
            margin: 0 8px;
            color: #999;
        }
        
        .page-progress {
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 3px;
            background: rgba(102, 126, 234, 0.2);
            z-index: 1000;
        }
        
        .progress-fill {
            height: 100%;
            background: linear-gradient(90deg, #667eea, #764ba2);
            width: 0%;
            transition: width 0.1s ease;
        }
        
        .page-connector {
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            padding: 30px;
            margin: 40px 0;
            border-radius: 15px;
            text-align: center;
        }
        
        .connector-content {
            display: flex;
            align-items: center;
            justify-content: center;
            gap: 20px;
            flex-wrap: wrap;
        }
        
        .connector-arrow {
            font-size: 2em;
            font-weight: bold;
        }
        
        .connector-link {
            color: white;
            text-decoration: none;
            padding: 15px 25px;
            background: rgba(255,255,255,0.2);
            border-radius: 10px;
            transition: all 0.3s ease;
            display: flex;
            flex-direction: column;
            gap: 5px;
        }
        
        .connector-link:hover {
            background: rgba(255,255,255,0.3);
            transform: translateY(-2px);
        }
        
        .connector-description {
            font-size: 0.9em;
            opacity: 0.8;
        }
        
        .back-to-top {
            position: fixed;
            bottom: 30px;
            right: 30px;
            width: 50px;
            height: 50px;
            background: #667eea;
            color: white;
            border: none;
            border-radius: 50%;
            font-size: 20px;
            cursor: pointer;
            opacity: 0;
            transform: translateY(100px);
            transition: all 0.3s ease;
            z-index: 1000;
        }
        
        .back-to-top.show {
            opacity: 1;
            transform: translateY(0);
        }
        
        .back-to-top:hover {
            background: #5a6fd8;
            transform: translateY(-3px);
        }
        
        .table-of-contents {
            position: fixed;
            right: 20px;
            top: 50%;
            transform: translateY(-50%);
            background: white;
            border-radius: 10px;
            padding: 20px;
            box-shadow: 0 4px 20px rgba(0,0,0,0.1);
            max-width: 250px;
            max-height: 60vh;
            overflow-y: auto;
            z-index: 999;
        }
        
        .table-of-contents h4 {
            margin: 0 0 15px 0;
            color: #667eea;
            font-size: 1em;
        }
        
        .table-of-contents ul {
            list-style: none;
            margin: 0;
            padding: 0;
        }
        
        .table-of-contents li {
            margin: 8px 0;
        }
        
        .table-of-contents a {
            color: #666;
            text-decoration: none;
            font-size: 0.9em;
            display: block;
            padding: 5px 0;
            border-left: 3px solid transparent;
            padding-left: 10px;
            transition: all 0.3s ease;
        }
        
        .table-of-contents a:hover,
        .table-of-contents a.active {
            color: #667eea;
            border-left-color: #667eea;
        }
        
        .toc-h3 a {
            padding-left: 20px;
            font-size: 0.85em;
        }
        
        @media (max-width: 1024px) {
            .table-of-contents {
                display: none;
            }
        }
        
        @media (max-width: 768px) {
            .connector-content {
                flex-direction: column;
            }
            
            .connector-arrow {
                transform: rotate(90deg);
            }
        }
    </style>
`;

document.head.insertAdjacentHTML('beforeend', navigationStyles);