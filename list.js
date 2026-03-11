document.addEventListener('DOMContentLoaded', () => {
    const STORES = window.STORES;
    const filterContainer = document.getElementById('zone-filters');
    const storeContainer = document.getElementById('store-container');
    const totalCountSpan = document.getElementById('store-total');
    const viewToggles = document.querySelectorAll('.view-toggle');

    if (!STORES) return;

    // Zone hierarchy data
    const ZONE_HIERARCHY = {
        '매장외부': ['주출입문', '주차장'],
        '제품존': ['TV', 'RAC', 'PC', '냉장고', '세탁기', 'CAC', '에어케어', '워터케어', '육성제품', '청소기', '쿠킹', '모니터', 'AV'],
        '연출존': ['집한채', 'M&B', '구독케어존', '웨딩존', '키즈존', '기타']
    };

    let pageLevel1 = 'all'; // current level1 selection on page
    let pageActiveLevel2 = new Set(['all']); // selected level2 zones on page
    let currentView = 'card';

    // ---------- Page-level zone filter (1st/2nd level) ----------
    const pageZoneLevel1Row = filterContainer.querySelector('.zone-level1-row');
    const pageZoneLevel2Row = document.getElementById('zone-level2-row');

    const getZonesForFilter = () => {
        if (pageLevel1 === 'all') return null; // null means no filter
        if (pageActiveLevel2.has('all')) {
            return ZONE_HIERARCHY[pageLevel1] || [];
        }
        return Array.from(pageActiveLevel2);
    };

    const renderPageLevel2 = () => {
        if (pageLevel1 === 'all') {
            pageZoneLevel2Row.style.display = 'none';
            pageZoneLevel2Row.innerHTML = '';
            return;
        }
        const options = ZONE_HIERARCHY[pageLevel1] || [];
        pageZoneLevel2Row.innerHTML = '';
        // Add "전체" button first
        const allBtn = document.createElement('button');
        allBtn.className = 'filter-btn' + (pageActiveLevel2.has('all') ? ' active' : '');
        allBtn.textContent = '전체';
        allBtn.dataset.level2 = 'all';
        pageZoneLevel2Row.appendChild(allBtn);

        options.forEach(zone => {
            const btn = document.createElement('button');
            btn.className = 'filter-btn' + (pageActiveLevel2.has(zone) ? ' active' : '');
            btn.textContent = zone;
            btn.dataset.level2 = zone;
            pageZoneLevel2Row.appendChild(btn);
        });
        pageZoneLevel2Row.style.display = 'flex';
    };

    const renderStores = () => {
        storeContainer.innerHTML = '';

        const activeZones = getZonesForFilter();
        const filteredStores = STORES.filter(store => {
            if (activeZones === null) return true;
            return activeZones.some(z => store.zones.includes(z));
        });

        totalCountSpan.textContent = filteredStores.length;

        if (currentView === 'list') {
            storeContainer.style.display = 'block';
            filteredStores.forEach(store => {
                const item = document.createElement('div');
                item.style.padding = '1rem';
                item.style.borderBottom = '1px solid #eee';
                item.style.backgroundColor = '#fff';
                item.style.cursor = 'pointer';
                item.style.display = 'flex';
                item.style.justifyContent = 'space-between';
                item.innerHTML = `
                    <div>
                        <strong>${store.name}</strong>
                        <span style="font-size: 0.8rem; color: #888; margin-left:1rem;">${store.address}</span>
                    </div>
                    <div style="font-size: 0.8rem; color: #666;">${store.info}</div>
                `;
                item.onclick = () => window.location.href = `detail.html?id=${store.id}`;
                storeContainer.appendChild(item);
            });
        } else {
            storeContainer.style.display = 'grid';
            filteredStores.forEach(store => {
                const card = document.createElement('div');
                card.className = 'store-card';
                card.innerHTML = `
                    <div class="store-img-container">
                        <img src="${store.mainImage}" alt="${store.name}" class="store-img">
                        <div class="store-tag">${store.inspection.grade}</div>
                    </div>
                    <div class="store-info">
                        <div class="store-name">${store.name}</div>
                        <div class="store-info-row">
                            <span class="store-info-badge">${store.info.split('|')[0].trim()}</span>
                            <span class="store-info-type">${store.info.split('|')[1].trim()}</span>
                        </div>
                        <div class="store-addr">${store.address}</div>
                        <div class="store-managers">
                            <div><span class="manager-label">HSAD</span><span class="manager-name">${store.managers.HSAD.name}</span></div>
                            <div><span class="manager-label">마케터/지점장</span><span class="manager-name">${store.managers["마케터/지점장"].name}</span></div>
                        </div>
                    </div>
                `;
                card.addEventListener('click', () => {
                    window.location.href = `detail.html?id=${store.id}`;
                });
                storeContainer.appendChild(card);
            });
        }
    };

    // Level 1 button click
    pageZoneLevel1Row.addEventListener('click', (e) => {
        const btn = e.target.closest('.filter-btn');
        if (!btn) return;
        const filter = btn.dataset.filter;
        pageLevel1 = filter;
        pageActiveLevel2.clear();
        pageActiveLevel2.add('all');
        pageZoneLevel1Row.querySelectorAll('.filter-btn').forEach(b => b.classList.toggle('active', b.dataset.filter === filter));
        renderPageLevel2();
        renderStores();
    });

    // Level 2 button click (delegated)
    pageZoneLevel2Row.addEventListener('click', (e) => {
        const btn = e.target.closest('.filter-btn');
        if (!btn) return;
        const zone = btn.dataset.level2;
        if (zone === 'all') {
            pageActiveLevel2.clear();
            pageActiveLevel2.add('all');
        } else {
            pageActiveLevel2.delete('all');
            if (pageActiveLevel2.has(zone)) {
                pageActiveLevel2.delete(zone);
                if (pageActiveLevel2.size === 0) pageActiveLevel2.add('all');
            } else {
                pageActiveLevel2.add(zone);
            }
        }
        pageZoneLevel2Row.querySelectorAll('.filter-btn').forEach(b => {
            const z = b.dataset.level2;
            b.classList.toggle('active', pageActiveLevel2.has(z));
        });
        renderStores();
    });

    viewToggles.forEach(toggle => {
        toggle.onclick = () => {
            viewToggles.forEach(t => t.classList.remove('active'));
            toggle.classList.add('active');
            currentView = toggle.dataset.view;
            renderStores();
        };
    });

    // Download Modal Logic
    const downloadModal = document.getElementById('list-download-modal');
    const openDownloadBtn = document.getElementById('open-list-download-btn');
    const closeDownloadBtn = document.getElementById('close-list-download');
    const modalSearchBtn = document.getElementById('modal-search-btn');
    const confirmDownloadBtn = document.getElementById('confirm-list-download-btn');
    const resultsBody = document.getElementById('modal-results-body');
    const checkAllHeaders = document.getElementById('check-all-stores');

    const distMapping = {
        'B2B': ['B2B'],
        '기타': ['기타'],
        '전매': ['기타', '전문점', '백화점', 'PC상가', 'HIP'],
        '혼매': ['홈플러스', '하이마트', '코스트코', '전자랜드', '이마트']
    };

    let selectedDists = new Set(['all']);
    let selectedChannels = new Set(['all']);
    // Zone: level1 + level2
    let modalZoneLevel1 = 'all';
    let modalSelectedLevel2 = new Set(['all']);
    const performModalSearch = () => {
        const searchTerm = document.getElementById('modal-search-input').value.toLowerCase();
        const startDateInput = document.getElementById('start-date').value;
        const endDateInput = document.getElementById('end-date').value;
        const startDate = startDateInput ? new Date(startDateInput) : null;
        const endDate = endDateInput ? new Date(endDateInput) : null;

        const getModalZones = () => {
            if (modalZoneLevel1 === 'all') return null;
            if (modalSelectedLevel2.has('all')) return ZONE_HIERARCHY[modalZoneLevel1] || [];
            return Array.from(modalSelectedLevel2);
        };

        const filtered = STORES.filter(s => {
            const matchSearch = s.name.toLowerCase().includes(searchTerm) || s.address.toLowerCase().includes(searchTerm);
            const matchDist = selectedDists.has('all') || selectedDists.has(s.distribution);
            const matchChannel = selectedChannels.has('all') || selectedChannels.has(s.channel);
            const activeZones = getModalZones();
            const matchZone = activeZones === null || s.zones.some(z => activeZones.includes(z));

            const storeDate = new Date(s.inspection.date);
            let matchDate = true;
            if (startDate) matchDate = matchDate && storeDate >= startDate;
            if (endDate) matchDate = matchDate && storeDate <= endDate;

            return matchSearch && matchDist && matchChannel && matchZone && matchDate;
        });

        renderModalResults(filtered);
    };

    const setupButtonMultiSelect = (containerId, tagsContainerId, selectedSet, onUpdate) => {
        const container = document.getElementById(containerId);

        const getOrCreateTagsContainer = () => {
            if (!tagsContainerId) return null;
            let tc = document.getElementById(tagsContainerId);
            if (!tc) {
                tc = document.createElement('div');
                tc.className = 'selected-tags-container';
                tc.id = tagsContainerId;
                container.parentElement.appendChild(tc);
            }
            return tc;
        };

        const updateUI = () => {
            container.querySelectorAll('.filter-btn-item').forEach(btn => {
                const val = btn.dataset.value;
                btn.classList.toggle('active', selectedSet.has(val));
            });
            renderTags();
        };

        const renderTags = () => {
            if (!tagsContainerId) return;

            if (selectedSet.has('all')) {
                // Remove container entirely so it takes no space
                const existing = document.getElementById(tagsContainerId);
                if (existing) existing.remove();
                return;
            }

            const tc = getOrCreateTagsContainer();
            tc.innerHTML = '';

            selectedSet.forEach(val => {
                const tag = document.createElement('div');
                tag.className = 'filter-tag';
                tag.innerHTML = `
                    <span>${val}</span>
                    <span class="tag-remove" data-value="${val}">&times;</span>
                `;
                tag.querySelector('.tag-remove').onclick = () => {
                    selectedSet.delete(val);
                    if (selectedSet.size === 0) selectedSet.add('all');
                    updateUI();
                    if (onUpdate) onUpdate();
                    performModalSearch();
                };
                tc.appendChild(tag);
            });
        };

        container.addEventListener('click', (e) => {
            const btn = e.target.closest('.filter-btn-item');
            if (!btn) return;

            const val = btn.dataset.value;
            if (val === 'all') {
                selectedSet.clear();
                selectedSet.add('all');
            } else {
                selectedSet.delete('all');
                if (selectedSet.has(val)) {
                    selectedSet.delete(val);
                    if (selectedSet.size === 0) selectedSet.add('all');
                } else {
                    selectedSet.add(val);
                }
            }
            updateUI();
            if (onUpdate) onUpdate();
            performModalSearch();
        });

        return { updateUI };
    };

    const updateChannelOptions = () => {
        const channelGroup = document.getElementById('channel-btn-group');
        const channelParent = channelGroup.parentElement;
        let availableChannels = [];
        if (selectedDists.has('all')) {
            availableChannels = Object.values(distMapping).flat();
        } else {
            selectedDists.forEach(d => {
                if (distMapping[d]) availableChannels.push(...distMapping[d]);
            });
        }
        availableChannels = [...new Set(availableChannels)];

        // Clean up selected channels that are no longer available
        if (!selectedChannels.has('all')) {
            selectedChannels.forEach(c => {
                if (!availableChannels.includes(c)) selectedChannels.delete(c);
            });
            if (selectedChannels.size === 0) selectedChannels.add('all');
        }

        channelGroup.innerHTML = `<button class="filter-btn-item ${selectedChannels.has('all') ? 'active' : ''}" data-value="all">전체</button>` +
            availableChannels.map(c => `<button class="filter-btn-item ${selectedChannels.has(c) ? 'active' : ''}" data-value="${c}">${c}</button>`).join('');

        // Manage channel tags container dynamically
        let channelTagsContainer = document.getElementById('channel-tags-container');
        if (selectedChannels.has('all')) {
            if (channelTagsContainer) channelTagsContainer.remove();
        } else {
            if (!channelTagsContainer) {
                channelTagsContainer = document.createElement('div');
                channelTagsContainer.className = 'selected-tags-container';
                channelTagsContainer.id = 'channel-tags-container';
                channelParent.appendChild(channelTagsContainer);
            }
            channelTagsContainer.innerHTML = '';
            selectedChannels.forEach(val => {
                const tag = document.createElement('div');
                tag.className = 'filter-tag';
                tag.innerHTML = `
                    <span>${val}</span>
                    <span class="tag-remove" data-value="${val}">&times;</span>
                `;
                tag.querySelector('.tag-remove').onclick = () => {
                    selectedChannels.delete(val);
                    if (selectedChannels.size === 0) selectedChannels.add('all');
                    updateChannelOptions();
                    performModalSearch();
                };
                channelTagsContainer.appendChild(tag);
            });
        }
    };

    const distLogic = setupButtonMultiSelect('dist-btn-group', 'dist-tags-container', selectedDists, updateChannelOptions);
    const channelLogic = setupButtonMultiSelect('channel-btn-group', 'channel-tags-container', selectedChannels);

    // --- Modal Zone Level1/Level2 logic ---
    const modalZoneLevel1Group = document.getElementById('modal-zone-level1-group');
    const modalZoneLevel2Wrap = document.getElementById('modal-zone-level2-wrap');
    const modalZoneLevel2Group = document.getElementById('modal-zone-level2-group');
    const zoneTagsContainer = document.getElementById('zone-tags-container');

    const renderModalZoneLevel2 = () => {
        if (modalZoneLevel1 === 'all') {
            modalZoneLevel2Wrap.style.display = 'none';
            modalZoneLevel2Group.innerHTML = '';
            zoneTagsContainer.innerHTML = '';
            return;
        }
        const options = ZONE_HIERARCHY[modalZoneLevel1] || [];
        modalZoneLevel2Wrap.style.display = 'block';
        modalZoneLevel2Group.innerHTML = '';

        // 전체 button
        const allBtn = document.createElement('button');
        allBtn.className = 'filter-btn-item' + (modalSelectedLevel2.has('all') ? ' active' : '');
        allBtn.textContent = '전체';
        allBtn.dataset.value = 'all';
        modalZoneLevel2Group.appendChild(allBtn);

        options.forEach(zone => {
            const btn = document.createElement('button');
            btn.className = 'filter-btn-item' + (modalSelectedLevel2.has(zone) ? ' active' : '');
            btn.textContent = zone;
            btn.dataset.value = zone;
            modalZoneLevel2Group.appendChild(btn);
        });
        renderZoneTags();
    };

    const renderZoneTags = () => {
        zoneTagsContainer.innerHTML = '';
        if (modalSelectedLevel2.has('all') || modalZoneLevel1 === 'all') return;
        modalSelectedLevel2.forEach(val => {
            const tag = document.createElement('div');
            tag.className = 'filter-tag';
            tag.innerHTML = `<span>${val}</span><span class="tag-remove" data-value="${val}">&times;</span>`;
            tag.querySelector('.tag-remove').onclick = () => {
                modalSelectedLevel2.delete(val);
                if (modalSelectedLevel2.size === 0) modalSelectedLevel2.add('all');
                renderModalZoneLevel2();
                performModalSearch();
            };
            zoneTagsContainer.appendChild(tag);
        });
    };

    // Level 1 click
    modalZoneLevel1Group.addEventListener('click', (e) => {
        const btn = e.target.closest('.filter-btn-item');
        if (!btn) return;
        const val = btn.dataset.zone1;
        modalZoneLevel1 = val;
        modalSelectedLevel2.clear();
        modalSelectedLevel2.add('all');
        modalZoneLevel1Group.querySelectorAll('.filter-btn-item').forEach(b => b.classList.toggle('active', b.dataset.zone1 === val));
        renderModalZoneLevel2();
        performModalSearch();
    });

    // Level 2 click
    modalZoneLevel2Group.addEventListener('click', (e) => {
        const btn = e.target.closest('.filter-btn-item');
        if (!btn) return;
        const val = btn.dataset.value;
        if (val === 'all') {
            modalSelectedLevel2.clear();
            modalSelectedLevel2.add('all');
        } else {
            modalSelectedLevel2.delete('all');
            if (modalSelectedLevel2.has(val)) {
                modalSelectedLevel2.delete(val);
                if (modalSelectedLevel2.size === 0) modalSelectedLevel2.add('all');
            } else {
                modalSelectedLevel2.add(val);
            }
        }
        renderModalZoneLevel2();
        performModalSearch();
    });

    openDownloadBtn.onclick = () => {
        downloadModal.style.display = 'flex';
        // Reset zone state
        modalZoneLevel1 = 'all';
        modalSelectedLevel2.clear();
        modalSelectedLevel2.add('all');
        modalZoneLevel1Group.querySelectorAll('.filter-btn-item').forEach(b => b.classList.toggle('active', b.dataset.zone1 === 'all'));
        renderModalZoneLevel2();
        distLogic.updateUI();
        channelLogic.updateUI();
        updateChannelOptions();
        renderModalResults(STORES);
    };

    closeDownloadBtn.onclick = () => downloadModal.style.display = 'none';

    const renderModalResults = (storesToRender) => {
        resultsBody.innerHTML = storesToRender.map(s => `
            <tr>
                <td><input type="checkbox" class="store-check" value="${s.id}" checked></td>
                <td>${s.name}</td>
                <td>${s.distribution}</td>
                <td>${s.channel}</td>
                <td style="max-width: 300px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;">${s.address}</td>
                <td>${s.inspection.status}</td>
            </tr>
        `).join('');
        checkAllHeaders.checked = true;
    };

    checkAllHeaders.onchange = () => {
        document.querySelectorAll('.store-check').forEach(cb => cb.checked = checkAllHeaders.checked);
    };

    modalSearchBtn.onclick = performModalSearch;

    confirmDownloadBtn.onclick = () => {
        const checkedIds = Array.from(document.querySelectorAll('.store-check:checked')).map(cb => parseInt(cb.value));
        const storesToExport = STORES.filter(s => checkedIds.includes(s.id));

        if (storesToExport.length === 0) {
            alert('다운로드할 매장을 선택해주세요.');
            return;
        }

        const data = storesToExport.map(s => ({
            '매장명': s.name,
            '유통': s.distribution,
            '채널': s.channel,
            '주소': s.address,
            '전화번호': s.tel,
            '비고': s.info,
            '최근점검일': s.inspection.date,
            '점검상태': s.inspection.status,
            'ZONE': s.zones.join(', ')
        }));

        const ws = XLSX.utils.json_to_sheet(data);
        const wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, "StoreList");
        XLSX.writeFile(wb, `LG_StoreList_${new Date().toISOString().slice(0, 10)}.xlsx`);
    };

    window.onclick = (e) => {
        if (e.target === downloadModal) downloadModal.style.display = 'none';
    };

    renderStores();
});
