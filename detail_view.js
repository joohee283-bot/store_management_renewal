document.addEventListener('DOMContentLoaded', () => {
    const STORES = window.STORES;
    const urlParams = new URLSearchParams(window.location.search);
    const storeId = parseInt(urlParams.get('id'));
    const store = STORES ? STORES.find(s => s.id === storeId) : null;

    if (!store) {
        alert('매장을 찾을 수 없습니다.');
        window.location.href = 'index.html';
        return;
    }

    // Render Detail Layout
    const detailContainer = document.getElementById('detail-card-layout');
    detailContainer.innerHTML = `
        <div class="left-section">
            <div class="main-img-container">
                <img src="${store.mainImage}" id="main-detail-img">
                <div class="scene-tabs">
                    <div class="scene-tab active" data-index="0">전경1</div>
                    <div class="scene-tab" data-index="1">전경2</div>
                    <div class="scene-tab" data-index="2">전경3</div>
                </div>
            </div>
            <div class="thumb-nav">
                ${(store.images.length > 0 ? store.images : [{ url: store.mainImage }]).slice(0, 3).map((img, i) => `
                    <img src="${typeof img === 'string' ? img : img.url}" class="${i === 0 ? 'active' : ''}" data-idx="${i}">
                `).join('')}
            </div>
            <button class="explore-btn" id="open-gallery-btn">ZONE별 매장 살펴보기</button>
            <button class="download-btn" id="open-download-btn">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v4"></path><polyline points="7 10 12 15 17 10"></polyline><line x1="12" y1="15" x2="12" y2="3"></line></svg>
                매장 이미지 다운로드
            </button>
        </div>
        <div class="right-section">
            <div class="info-card">
                <div class="info-header">
                    <h2><span class="store-path">홈플러스 |</span> ${store.name}</h2>
                    <p style="color: var(--text-gray); font-size: 0.95rem;">${store.address}</p>
                    <div style="margin-top: 0.5rem; font-size: 0.9rem; color: #666;">
                        ${store.info}
                    </div>
                    <div style="margin-top: 0.5rem; color: #333; font-weight: 500;">
                        ${store.tel}
                    </div>
                </div>

                <div class="manager-section">
                    <div class="manager-title">매장 담당자 정보</div>
                    <div class="manager-tabs" id="manager-tabs">
                        <button class="manager-tab active" data-type="HSAD">HSAD</button>
                        <button class="manager-tab" data-type="마케터/지점장">마케터/지점장</button>
                        <button class="manager-tab" data-type="도급사">도급사</button>
                    </div>
                    <div id="manager-info-content">
                        <!-- Filled by JS -->
                    </div>
                </div>

                <div class="inspection-section">
                    <div class="inspection-title">${store.inspection.date} 주요매장 월점검</div>
                    <div class="inspection-grid">
                        <div class="inspection-item">
                            <label>점검 상태</label>
                            <span class="highlight-red">${store.inspection.status}</span>
                        </div>
                        <div class="inspection-item">
                            <label>점검 등급</label>
                            <span class="highlight-red">${store.inspection.grade}</span>
                        </div>
                    </div>
                    <button class="btn-more">점검 내역 더 보기</button>
                </div>
            </div>
        </div>
    `;

    // Back Button Logic
    document.getElementById('back-btn').onclick = () => {
        window.location.href = 'index.html';
    };

    // Manager Tab Logic
    const managerTabs = document.getElementById('manager-tabs');
    const managerContent = document.getElementById('manager-info-content');

    const renderManagerInfo = (type) => {
        const info = store.managers[type];
        managerContent.innerHTML = `
            <div class="manager-field">${info.name}</div>
            <div class="manager-field">${info.email}</div>
            <div class="manager-field">${info.tel}</div>
        `;
    };

    managerTabs.querySelectorAll('.manager-tab').forEach(tab => {
        tab.onclick = () => {
            managerTabs.querySelectorAll('.manager-tab').forEach(t => t.classList.remove('active'));
            tab.classList.add('active');
            renderManagerInfo(tab.dataset.type);
        };
    });

    // Initial Manager Info
    renderManagerInfo('HSAD');

    // Scene/Thumb Navigation Logic
    const sceneTabs = document.querySelectorAll('.scene-tab');
    const thumbImgs = document.querySelectorAll('.thumb-nav img');
    const mainImg = document.getElementById('main-detail-img');

    const updateActiveImage = (index) => {
        const targetImg = store.images[index] || { url: store.mainImage };
        mainImg.src = targetImg.url;

        sceneTabs.forEach(t => t.classList.remove('active'));
        if (sceneTabs[index]) sceneTabs[index].classList.add('active');

        thumbImgs.forEach(t => t.classList.remove('active'));
        if (thumbImgs[index]) thumbImgs[index].classList.add('active');
    };

    sceneTabs.forEach((tab, i) => {
        tab.onclick = () => updateActiveImage(i);
    });

    thumbImgs.forEach((thumb, i) => {
        thumb.onclick = () => updateActiveImage(i);
    });

    // Gallery Logic
    const galleryModal = document.getElementById('gallery-modal');
    const openGalleryBtn = document.getElementById('open-gallery-btn');
    const closeGalleryBtn = document.getElementById('close-gallery');
    const galleryContainer = document.getElementById('gallery-container');
    const filterContainer = document.getElementById('gallery-filters');

    let currentLevel1 = 'all';
    let selectedLevel2 = new Set(['all']);

    const level2Mapping = {
        '연출존': ["구독케어존", "집한채", "M&B"],
        '제품존': ["냉장고", "세탁기", "주방가전"]
    };

    const renderGalleryButtons = () => {
        const availableZones = [...new Set(store.images.map(img => img.zone))];
        
        filterContainer.innerHTML = `
            <div class="filter-level-1" style="display: flex; gap: 0.5rem; margin-bottom: 1rem; border-bottom: 1px solid #eee; padding-bottom: 1rem; width: 100%;">
                <button class="filter-btn ${currentLevel1 === 'all' ? 'active' : ''}" data-level1="all">전체</button>
                <button class="filter-btn ${currentLevel1 === '연출존' ? 'active' : ''}" data-level1="연출존">연출존</button>
                <button class="filter-btn ${currentLevel1 === '제품존' ? 'active' : ''}" data-level1="제품존">제품존</button>
            </div>
            <div class="filter-level-2" style="display: flex; gap: 0.5rem; flex-wrap: wrap; width: 100%;">
                <!-- 2nd level buttons injected here -->
            </div>
        `;

        const level2Container = filterContainer.querySelector('.filter-level-2');
        
        const renderLevel2 = () => {
            level2Container.innerHTML = '';
            let buttonsToShow = [];
            
            if (currentLevel1 === 'all') {
                buttonsToShow = []; // Hide 2nd level when "All" is selected, or show all? 
                // User said: "1st level button press lets you select 2nd level". 
                // Let's hide 2nd level if 'all' is selected.
            } else {
                const candidates = level2Mapping[currentLevel1] || [];
                buttonsToShow = candidates.filter(z => availableZones.includes(z));
            }

            buttonsToShow.forEach(zone => {
                const btn = document.createElement('button');
                btn.className = `filter-btn ${selectedLevel2.has(zone) ? 'active' : ''}`;
                btn.textContent = zone;
                btn.onclick = () => {
                    if (selectedLevel2.has('all')) selectedLevel2.delete('all');
                    if (selectedLevel2.has(zone)) {
                        selectedLevel2.delete(zone);
                        if (selectedLevel2.size === 0) selectedLevel2.add('all');
                    } else {
                        selectedLevel2.add(zone);
                    }
                    renderLevel2();
                    renderGallery();
                };
                level2Container.appendChild(btn);
            });
        };

        const level1Btns = filterContainer.querySelectorAll('.filter-level-1 .filter-btn');
        level1Btns.forEach(btn => {
            btn.onclick = () => {
                level1Btns.forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                currentLevel1 = btn.dataset.level1;
                selectedLevel2.clear();
                selectedLevel2.add('all');
                renderLevel2();
                renderGallery();
            };
        });

        renderLevel2();
    };

    const renderGallery = () => {
        galleryContainer.innerHTML = '';
        
        filteredImages = store.images.filter(img => {
            if (selectedLevel2.has('all')) {
                if (currentLevel1 === 'all') return true;
                // If Level 1 is selected but no Level 2, show all images belonging to that Level 1
                return level2Mapping[currentLevel1].includes(img.zone);
            }
            return selectedLevel2.has(img.zone);
        });

        if (filteredImages.length === 0) {
            galleryContainer.innerHTML = '<p style="grid-column: 1/-1; text-align: center; padding: 2rem; color: #999;">해당하는 이미지가 없습니다.</p>';
            return;
        }

        filteredImages.forEach((img, index) => {
            const item = document.createElement('div');
            item.className = 'gallery-item';
            item.innerHTML = `<img src="${img.url}" alt="${img.tag}">`;
            item.onclick = () => openZoom(index);
            galleryContainer.appendChild(item);
        });
    };

    openGalleryBtn.onclick = () => {
        galleryModal.style.display = 'flex';
        renderGalleryButtons();
        renderGallery();
    };

    closeGalleryBtn.onclick = () => {
        galleryModal.style.display = 'none';
    };

    // Zoom Logic
    const zoomModal = document.getElementById('zoom-modal');
    const zoomImg = document.getElementById('zoom-image');
    const closeZoomBtn = document.getElementById('close-zoom');
    const prevBtn = document.getElementById('prev-btn');
    const nextBtn = document.getElementById('next-btn');
    let currentZoomIndex = 0;

    const openZoom = (index) => {
        currentZoomIndex = index;
        zoomImg.src = filteredImages[currentZoomIndex].url;
        zoomModal.style.display = 'flex';
    };

    closeZoomBtn.onclick = () => zoomModal.style.display = 'none';

    prevBtn.onclick = (e) => {
        e.stopPropagation();
        currentZoomIndex = (currentZoomIndex - 1 + filteredImages.length) % filteredImages.length;
        zoomImg.src = filteredImages[currentZoomIndex].url;
    };

    nextBtn.onclick = (e) => {
        e.stopPropagation();
        currentZoomIndex = (currentZoomIndex + 1) % filteredImages.length;
        zoomImg.src = filteredImages[currentZoomIndex].url;
    };

    // Download Modal Logic
    const downloadModal = document.getElementById('download-modal');
    const openDownloadBtn = document.getElementById('open-download-btn');
    const closeDownloadBtn = document.getElementById('close-download');
    const downloadZoneContainer = document.getElementById('download-zones');
    const confirmDownloadBtn = document.getElementById('confirm-download-btn');

    let selectedDownloadZones = new Set(['all']);

    const renderDownloadZones = () => {
        const availableZones = [...new Set(store.images.map(img => img.zone))];
        const zonesToDisplay = ['all', ...availableZones];

        downloadZoneContainer.innerHTML = zonesToDisplay.map(zone => `
            <button class="download-filter-btn ${selectedDownloadZones.has(zone) ? 'active' : ''}" data-zone="${zone}">
                <div class="check-circle"></div>
                ${zone === 'all' ? '전체' : zone}
            </button>
        `).join('');

        downloadZoneContainer.querySelectorAll('.download-filter-btn').forEach(btn => {
            btn.onclick = () => {
                const zone = btn.dataset.zone;
                if (zone === 'all') {
                    selectedDownloadZones.clear();
                    selectedDownloadZones.add('all');
                } else {
                    selectedDownloadZones.delete('all');
                    if (selectedDownloadZones.has(zone)) {
                        selectedDownloadZones.delete(zone);
                        if (selectedDownloadZones.size === 0) selectedDownloadZones.add('all');
                    } else {
                        selectedDownloadZones.add(zone);
                    }
                }
                renderDownloadZones();
            };
        });
    };

    openDownloadBtn.onclick = () => {
        downloadModal.style.display = 'flex';
        selectedDownloadZones = new Set(['all']);
        renderDownloadZones();
    };

    closeDownloadBtn.onclick = () => downloadModal.style.display = 'none';

    confirmDownloadBtn.onclick = async () => {
        const jszip = new JSZip();
        const imagesToDownload = selectedDownloadZones.has('all')
            ? store.images
            : store.images.filter(img => selectedDownloadZones.has(img.zone));

        if (imagesToDownload.length === 0) {
            alert('다운로드할 이미지가 없습니다.');
            return;
        }

        confirmDownloadBtn.disabled = true;
        confirmDownloadBtn.innerText = '압축 중...';

        try {
            for (const img of imagesToDownload) {
                const response = await fetch(img.url);
                const blob = await response.blob();
                const fileName = `${img.zone}_${img.tag}_${img.url.split('/').pop()}`;
                jszip.file(fileName, blob);
            }

            const content = await jszip.generateAsync({ type: 'blob' });
            saveAs(content, `${store.name}_images.zip`);
            downloadModal.style.display = 'none';
        } catch (error) {
            console.error('Download failed:', error);
            alert('다운로드 중 오류가 발생했습니다.');
        } finally {
            confirmDownloadBtn.disabled = false;
            confirmDownloadBtn.innerText = '다운로드';
        }
    };

    window.onclick = (event) => {
        if (event.target === galleryModal) galleryModal.style.display = 'none';
        if (event.target === zoomModal) zoomModal.style.display = 'none';
        if (event.target === downloadModal) downloadModal.style.display = 'none';
    };
});
