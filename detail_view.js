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

                <div class="bottom-action-grid">
                    <!-- Left: Inspection Action -->
                    <div class="action-card">
                        <div class="action-card-title">점검 현황</div>
                        <div class="action-card-desc">매장 점검<br>임시 중단</div>
                    </div>

                    <!-- Right: Zone Explore Action -->
                    <div class="action-card">
                        <div class="action-card-title">ZONE 별 매장 현황</div>
                        <button id="open-gallery-btn" class="btn-gallery-open" style="background: var(--lg-red); border: 2px solid var(--lg-red); color: white;">사진 보기</button>
                        <div class="update-date">Update. 2026/03/11</div>
                    </div>
                </div>
            </div>
            
            <button class="download-btn" id="open-download-btn">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v4"></path><polyline points="7 10 12 15 17 10"></polyline><line x1="12" y1="15" x2="12" y2="3"></line></svg>
                매장 이미지 다운로드
            </button>
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

    // Track selected 2nd-level zones per 1st-level category
    let selectedGalleryState = {
        '매장 외부': new Set(['all']),
        '연출존': new Set(['all']),
        '제품존': new Set(['all'])
    };

    const level2Mapping = {
        '매장 외부': ["주출입문", "주차장"],
        '연출존': ["집한채", "M&B", "구독케어존", "웨딩존", "키즈존", "기타"],
        '제품존': ["TV", "RAC", "PC", "냉장고", "세탁기", "CAC", "에어케어", "워터케어", "육성제품", "청소기", "쿠킹", "모니터", "AV"]
    };

    const renderGalleryButtons = () => {
        const availableZones = [...new Set(store.images.map(img => img.zone))];

        filterContainer.innerHTML = `
            <div class="filter-level-1" style="display: flex; gap: 0.5rem; margin-bottom: 1rem; border-bottom: 1px solid #eee; padding-bottom: 1rem; width: 100%;">
                <button class="filter-btn ${currentLevel1 === '전체' ? 'active' : (currentLevel1 === 'all' ? 'active' : '')}" data-level1="all">전체</button>
                <button class="filter-btn ${currentLevel1 === '매장 외부' ? 'active' : ''}" data-level1="매장 외부">매장 외부</button>
                <button class="filter-btn ${currentLevel1 === '제품존' ? 'active' : ''}" data-level1="제품존">제품존</button>
                <button class="filter-btn ${currentLevel1 === '연출존' ? 'active' : ''}" data-level1="연출존">연출존</button>
            </div>
            <div class="filter-level-2" style="display: flex; gap: 0.5rem; flex-wrap: wrap; width: 100%;">
                <!-- 2nd level buttons injected here -->
            </div>
        `;

        const level2Container = filterContainer.querySelector('.filter-level-2');

        const renderLevel2 = () => {
            level2Container.innerHTML = '';

            if (currentLevel1 === 'all' || !level2Mapping[currentLevel1]) {
                return; // Hide 2nd level when "All" is selected or no mapping exists
            }

            const candidates = level2Mapping[currentLevel1];

            // Generate [전체, ...candidates]
            const buttonsToShow = ['all', ...candidates];

            const currentStateSet = selectedGalleryState[currentLevel1];

            buttonsToShow.forEach(zone => {
                const btn = document.createElement('button');
                btn.className = `filter-btn ${currentStateSet.has(zone) ? 'active' : ''}`;
                btn.textContent = zone === 'all' ? '전체' : zone;
                btn.onclick = () => {
                    if (zone === 'all') {
                        // "전체" 클릭 시 다른 모든 선택 해제하고 단일 선택
                        currentStateSet.clear();
                        currentStateSet.add('all');
                    } else {
                        // 다른 특정 항목 클릭 시
                        if (currentStateSet.has('all')) {
                            currentStateSet.delete('all');
                        }

                        if (currentStateSet.has(zone)) {
                            currentStateSet.delete(zone);
                            // 하나도 안 남으면 다시 "전체" 선택
                            if (currentStateSet.size === 0) currentStateSet.add('all');
                        } else {
                            currentStateSet.add(zone);
                        }
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
                // do NOT clear selectedGalleryState when switching 1st-level tabs
                // to retain multi-category selections (user requested cross-category selection)
                renderLevel2();
                renderGallery();
            };
        });

        renderLevel2();
    };

    const renderGallery = () => {
        galleryContainer.innerHTML = '';

        filteredImages = store.images.filter(img => {
            // Find which Level 1 category this image's zone belongs to
            let imgLevel1 = null;
            for (const [l1, l2list] of Object.entries(level2Mapping)) {
                if (l2list.includes(img.zone)) {
                    imgLevel1 = l1;
                    break;
                }
            }

            // If the image doesn't belong to any known mapping, show it if "all" is selected
            if (!imgLevel1) {
                return currentLevel1 === 'all';
            }

            // check user's cross-category selection states
            // we gather all explicitly selected explicit zones (excluding 'all')
            // across ALL Level 1 categories.
            const hasAnyExplicitSelection = Object.values(selectedGalleryState).some(set => !set.has('all'));

            if (!hasAnyExplicitSelection) {
                // If user hasn't made ANY explicit 2nd level choices yet
                if (currentLevel1 === 'all') return true; // everything
                return imgLevel1 === currentLevel1;       // only current Level 1 visible
            } else {
                // User has made explicit choices in some categories
                const stateForThisImg = selectedGalleryState[imgLevel1];

                // If this category's state is explicitly selected zones
                if (!stateForThisImg.has('all')) {
                    if (stateForThisImg.has(img.zone)) return true;
                }
                // If user didn't select explicit zones for this category but did for another,
                // do we show ALL images of this category? The user requested cross-category combination.
                // It makes more sense to only show what is explicitly selected across the board.
                // Except if the user is CURRENTLY on a tab with 'all' state, they might expect to see its contents.
                if (stateForThisImg.has('all') && imgLevel1 === currentLevel1) {
                    return true;
                }

                return false;
            }
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
    const downloadZoneContainer = document.getElementById('download-zones'); // This is .filter-button-group in HTML
    const confirmDownloadBtn = document.getElementById('confirm-download-btn');

    let currentDlLevel1 = 'all';
    let selectedDlState = {
        '매장 외부': new Set(['all']),
        '연출존': new Set(['all']),
        '제품존': new Set(['all'])
    };

    const renderDownloadZones = () => {
        const availableZones = [...new Set(store.images.map(img => img.zone))];

        downloadZoneContainer.innerHTML = `
            <h2 style="font-size: 1.25rem; font-weight: 700; margin-bottom: 0.5rem; color: #333;">매장 이미지 다운로드</h2>
            <div style="font-size: 0.95rem; color: #666; margin-bottom: 0.25rem;">다운로드할 존 이미지를 선택해 주세요.</div>
            <div style="font-size: 0.85rem; color: #999; margin-bottom: 1.5rem;">ZONE을 여러 개 선택하여 한 번에 다운로드할 수 있습니다.</div>
            
            <div class="filter-level-1" style="display: flex; gap: 0.4rem; flex-wrap: wrap; margin-bottom: 1.5rem; border-bottom: 1px solid #EDEDED; padding-bottom: 1.5rem; width: 100%;">
                <button class="filter-btn ${currentDlLevel1 === '전체' ? 'active' : (currentDlLevel1 === 'all' ? 'active' : '')}" style="flex: 1; padding: 0.5rem 0;" data-level1="all">전체</button>
                <button class="filter-btn ${currentDlLevel1 === '매장 외부' ? 'active' : ''}" style="flex: 1; padding: 0.5rem 0;" data-level1="매장 외부">매장 외부</button>
                <button class="filter-btn ${currentDlLevel1 === '제품존' ? 'active' : ''}" style="flex: 1; padding: 0.5rem 0;" data-level1="제품존">제품존</button>
                <button class="filter-btn ${currentDlLevel1 === '연출존' ? 'active' : ''}" style="flex: 1; padding: 0.5rem 0;" data-level1="연출존">연출존</button>
            </div>
            <div class="filter-level-2" style="display: grid; grid-template-columns: repeat(4, 1fr); gap: 0.5rem; width: 100%;">
                <!-- 2nd level buttons injected here -->
            </div>
        `;

        const level2Container = downloadZoneContainer.querySelector('.filter-level-2');

        const renderLevel2 = () => {
            level2Container.innerHTML = '';

            if (currentDlLevel1 === 'all' || !level2Mapping[currentDlLevel1]) {
                return;
            }

            const candidates = level2Mapping[currentDlLevel1];

            const buttonsToShow = ['all', ...candidates];
            const currentStateSet = selectedDlState[currentDlLevel1];

            buttonsToShow.forEach(zone => {
                const btn = document.createElement('button');
                btn.className = `filter-btn ${currentStateSet.has(zone) ? 'active' : ''}`;
                btn.style.width = "100%";
                btn.style.padding = "0.5rem 0";
                btn.textContent = zone === 'all' ? '전체' : zone;
                btn.onclick = () => {
                    if (zone === 'all') {
                        currentStateSet.clear();
                        currentStateSet.add('all');
                    } else {
                        if (currentStateSet.has('all')) {
                            currentStateSet.delete('all');
                        }

                        if (currentStateSet.has(zone)) {
                            currentStateSet.delete(zone);
                            if (currentStateSet.size === 0) currentStateSet.add('all');
                        } else {
                            currentStateSet.add(zone);
                        }
                    }
                    renderLevel2(); // Re-render Level 2 to update active states
                };
                level2Container.appendChild(btn);
            });
        };

        const level1Btns = downloadZoneContainer.querySelectorAll('.filter-level-1 .filter-btn');
        level1Btns.forEach(btn => {
            btn.onclick = () => {
                level1Btns.forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                currentDlLevel1 = btn.dataset.level1;
                // do NOT clear selectedDlState to retain cross-category selections
                renderLevel2();
            };
        });

        renderLevel2();
    };

    openDownloadBtn.onclick = () => {
        downloadModal.style.display = 'flex';
        currentDlLevel1 = 'all';
        selectedDlState = {
            '매장 외부': new Set(['all']),
            '연출존': new Set(['all']),
            '제품존': new Set(['all'])
        };
        renderDownloadZones();
    };

    closeDownloadBtn.onclick = () => downloadModal.style.display = 'none';

    confirmDownloadBtn.onclick = async () => {
        const jszip = new JSZip();

        const imagesToDownload = store.images.filter(img => {
            let imgLevel1 = null;
            for (const [l1, l2list] of Object.entries(level2Mapping)) {
                if (l2list.includes(img.zone)) {
                    imgLevel1 = l1;
                    break;
                }
            }

            if (!imgLevel1) return currentDlLevel1 === 'all';

            const hasAnyExplicitSelection = Object.values(selectedDlState).some(set => !set.has('all'));

            if (!hasAnyExplicitSelection) {
                if (currentDlLevel1 === 'all') return true;
                return imgLevel1 === currentDlLevel1;
            } else {
                const stateForThisImg = selectedDlState[imgLevel1];
                if (!stateForThisImg.has('all')) {
                    if (stateForThisImg.has(img.zone)) return true;
                }
                if (stateForThisImg.has('all') && imgLevel1 === currentDlLevel1) {
                    return true;
                }
                return false;
            }
        });

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
