/* ============================================
   KABUT DI PELABUHAN LAMA — Novel Online
   Main Application Script — FIXED VERSION
   With Sinopsis & Copyright Page Support
   ============================================ */

// ============================================================
// SCHEDULE SYSTEM
// ============================================================

(function () {

    var FIRST_RELEASE_DATE = new Date(2026, 1, 15, 0, 0, 0);
    var WIB_OFFSET = 7;

    var SCHEDULE_CHAPTERS = [
        { num: 1,  title: "Sungai yang Tidak Pernah Diam",                   part: "Bagian 1 — Porto" },
        { num: 2,  title: "Perempuan di Balik Kanvas",                       part: "Bagian 1 — Porto" },
        { num: 3,  title: "Port Wine dan Percakapan yang Belum Selesai",     part: "Bagian 1 — Porto" },
        { num: 4,  title: "Warna yang Tidak Bisa Dinamai",                   part: "Bagian 1 — Porto" },
        { num: 5,  title: "Anting Bulan Sabit",                              part: "Bagian 1 — Porto" },
        { num: 6,  title: "Malam-Malam di Ribeira",                         part: "Bagian 1 — Porto" },
        { num: 7,  title: "Surat dari Amsterdam",                           part: "Bagian 1 — Porto" },
        { num: 8,  title: "Rumah di Ujung Hutan",                           part: "Bagian 2 — Sintra" },
        { num: 9,  title: "Helena",                                         part: "Bagian 2 — Sintra" },
        { num: 10, title: "Lukisan yang Seharusnya Tidak Ada",               part: "Bagian 2 — Sintra" },
        { num: 11, title: "Álvaro",                                         part: "Bagian 2 — Sintra" },
        { num: 12, title: "Orang Asing dari Lisboa",                         part: "Bagian 3 — Lisboa" },
        { num: 13, title: "Dua Versi Kebenaran",                            part: "Bagian 3 — Lisboa" },
        { num: 14, title: "Retak",                                          part: "Bagian 3 — Lisboa" },
        { num: 15, title: "Kretek Terakhir di Tepi Douro",                  part: "Bagian 3 — Lisboa" },
        { num: 16, title: "Kabut Sintra",                                   part: "Bagian 3 — Lisboa" },
        { num: 17, title: "Konfrontasi",                                    part: "Bagian 3 — Lisboa" },
        { num: 18, title: "Yang Tidak Dikatakan Sari",                      part: "Bagian 3 — Lisboa" },
        { num: 19, title: "Kereta ke Utara",                                part: "Bagian 4 — Bruges" },
        { num: 20, title: "Bruges",                                         part: "Bagian 4 — Bruges" },
        { num: 21, title: "Lukisan Terakhir Álvaro Mendes",                 part: "Bagian 4 — Bruges" },
        { num: 22, title: "Pilihan",                                        part: "Bagian 4 — Bruges" },
        { num: 23, title: "Epilog — Pelabuhan Lama",                        part: "Bagian 4 — Bruges" }
    ];

    function getNowWIB() {
        var now = new Date();
        var utc = now.getTime() + (now.getTimezoneOffset() * 60000);
        return new Date(utc + (WIB_OFFSET * 3600000));
    }

    function getChapterReleaseDate(chapterIndex) {
        var release = new Date(FIRST_RELEASE_DATE);
        release.setDate(release.getDate() + (chapterIndex * 7));
        return release;
    }

    function formatDateIndonesian(date) {
        var days = ['Minggu', 'Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu'];
        var months = ['Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni',
                      'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'];
        return days[date.getDay()] + ', ' + date.getDate() + ' ' + months[date.getMonth()] + ' ' + date.getFullYear();
    }

    function formatDateShort(date) {
        var months = ['Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun',
                      'Jul', 'Agu', 'Sep', 'Okt', 'Nov', 'Des'];
        return date.getDate() + ' ' + months[date.getMonth()] + ' ' + date.getFullYear();
    }

    function getReleasedCount() {
        var now = getNowWIB();
        var count = 0;
        for (var i = 0; i < SCHEDULE_CHAPTERS.length; i++) {
            if (now >= getChapterReleaseDate(i)) count++;
            else break;
        }
        return count;
    }

    function isChapterReleased(chapterIndex) {
        return getNowWIB() >= getChapterReleaseDate(chapterIndex);
    }

    function getNextUnreleasedIndex() {
        var now = getNowWIB();
        for (var i = 0; i < SCHEDULE_CHAPTERS.length; i++) {
            if (now < getChapterReleaseDate(i)) return i;
        }
        return -1;
    }

    function showLockedMessage(chapterNum) {
        var releaseDate = getChapterReleaseDate(chapterNum - 1);
        var dateStr = formatDateIndonesian(releaseDate);

        var overlay = document.createElement('div');
        overlay.className = 'locked-modal-overlay';
        overlay.innerHTML =
            '<div class="locked-modal">' +
                '<div class="locked-modal-icon">🔒</div>' +
                '<h3>Chapter ' + chapterNum + ' Belum Dirilis</h3>' +
                '<p>Chapter ini akan terbuka pada:</p>' +
                '<p class="locked-modal-date">' + dateStr + '</p>' +
                '<p class="locked-modal-sub">Pukul 00:00 WIB</p>' +
                '<button class="locked-modal-btn">Mengerti</button>' +
            '</div>';

        document.body.appendChild(overlay);
        requestAnimationFrame(function () { overlay.classList.add('show'); });

        function closeModal() {
            overlay.classList.remove('show');
            setTimeout(function () {
                if (overlay.parentNode) overlay.parentNode.removeChild(overlay);
            }, 300);
        }

        overlay.querySelector('.locked-modal-btn').addEventListener('click', closeModal);
        overlay.addEventListener('click', function (e) {
            if (e.target === overlay) closeModal();
        });
    }

    function updateTOCLockStatus() {
        var tocItems = document.querySelectorAll('.toc-list li[data-chapter]');
        tocItems.forEach(function (item) {
            var chNum = parseInt(item.getAttribute('data-chapter'));
            if (!chNum) return;

            if (!isChapterReleased(chNum - 1)) {
                item.classList.add('toc-locked');
                if (!item.querySelector('.toc-lock-icon')) {
                    var lock = document.createElement('span');
                    lock.className = 'toc-lock-icon';
                    lock.textContent = ' 🔒';
                    item.appendChild(lock);
                }
            } else {
                item.classList.remove('toc-locked');
                var existingLock = item.querySelector('.toc-lock-icon');
                if (existingLock) existingLock.remove();
            }
        });
    }

    function buildTimeline() {
        var timeline = document.getElementById('schedule-timeline');
        if (!timeline) return;

        timeline.innerHTML = '';
        var now = getNowWIB();
        var nextIndex = getNextUnreleasedIndex();

        SCHEDULE_CHAPTERS.forEach(function (ch, i) {
            var releaseDate = getChapterReleaseDate(i);
            var released = now >= releaseDate;
            var isCurrent = (i === nextIndex);

            var status, statusClass, dotClass, statusIcon, statusText;
            if (released) {
                status = 'released'; statusClass = 'status-released';
                dotClass = 'released'; statusIcon = '✓'; statusText = 'Sudah Rilis';
            } else if (isCurrent) {
                status = 'current'; statusClass = 'status-current';
                dotClass = 'current'; statusIcon = '⏳'; statusText = 'Segera';
            } else {
                status = 'locked'; statusClass = 'status-locked';
                dotClass = 'locked'; statusIcon = '🔒'; statusText = 'Terkunci';
            }

            var dateStr = released ? formatDateShort(releaseDate) : formatDateIndonesian(releaseDate);

            var item = document.createElement('div');
            item.className = 'schedule-item ' + dotClass;
            item.setAttribute('data-status', status);
            item.setAttribute('data-chapter', ch.num);
            item.style.cursor = 'pointer';

            item.innerHTML =
                '<div class="schedule-dot"></div>' +
                '<div class="schedule-card">' +
                    '<div class="schedule-card-info">' +
                        '<span class="schedule-card-part">' + ch.part + '</span>' +
                        '<h4 class="schedule-card-title">Chapter ' + ch.num + ' — ' + ch.title + '</h4>' +
                        '<span class="schedule-card-date">' + dateStr + '</span>' +
                    '</div>' +
                    '<div class="schedule-card-status">' +
                        '<span class="status-badge ' + statusClass + '">' +
                            '<span class="status-icon">' + statusIcon + '</span> ' + statusText +
                        '</span>' +
                    '</div>' +
                '</div>';

            item.addEventListener('click', function () {
                if (released) {
                    if (typeof window.openChapterByNum === 'function') window.openChapterByNum(ch.num);
                } else {
                    showLockedMessage(ch.num);
                }
            });

            timeline.appendChild(item);
        });
    }

    var countdownInterval = null;

    function updateCountdown() {
        var nextIndex = getNextUnreleasedIndex();
        var chapterNameEl = document.getElementById('countdown-chapter-name');
        var timerEl = document.getElementById('countdown-timer');
        var allReleasedEl = document.getElementById('countdown-all-released');
        var daysEl = document.getElementById('countdown-days');
        var hoursEl = document.getElementById('countdown-hours');
        var minutesEl = document.getElementById('countdown-minutes');
        var secondsEl = document.getElementById('countdown-seconds');
        var progressFill = document.getElementById('countdown-progress-fill');
        var progressLabel = document.getElementById('progress-label');

        var released = getReleasedCount();
        var total = SCHEDULE_CHAPTERS.length;

        if (progressFill) progressFill.style.width = ((released / total) * 100) + '%';
        if (progressLabel) progressLabel.textContent = released + ' / ' + total + ' Chapter Dirilis';

        if (nextIndex === -1) {
            if (timerEl) timerEl.style.display = 'none';
            if (allReleasedEl) allReleasedEl.style.display = 'block';
            if (chapterNameEl) chapterNameEl.textContent = 'Semua Chapter Telah Dirilis!';
            if (countdownInterval) clearInterval(countdownInterval);
            return;
        }

        if (timerEl) timerEl.style.display = '';
        if (allReleasedEl) allReleasedEl.style.display = 'none';

        var ch = SCHEDULE_CHAPTERS[nextIndex];
        if (chapterNameEl) chapterNameEl.textContent = 'Chapter ' + ch.num + ' — ' + ch.title;

        var now = getNowWIB();
        var target = getChapterReleaseDate(nextIndex);
        var diff = target.getTime() - now.getTime();

        if (diff <= 0) {
            buildTimeline();
            updateTOCLockStatus();
            updateCountdown();
            showNewChapterNotification(ch);
            return;
        }

        var d = Math.floor(diff / 86400000);
        var h = Math.floor((diff % 86400000) / 3600000);
        var m = Math.floor((diff % 3600000) / 60000);
        var s = Math.floor((diff % 60000) / 1000);

        updateUnit(daysEl, pad(d));
        updateUnit(hoursEl, pad(h));
        updateUnit(minutesEl, pad(m));
        updateUnit(secondsEl, pad(s));
    }

    function updateUnit(el, val) {
        if (!el) return;
        if (el.textContent !== val) {
            el.textContent = val;
            el.classList.remove('tick');
            void el.offsetWidth;
            el.classList.add('tick');
        }
    }

    function pad(n) { return n < 10 ? '0' + n : '' + n; }

    function setupFilters() {
        var btns = document.querySelectorAll('.schedule-filter-btn');
        btns.forEach(function (btn) {
            btn.addEventListener('click', function () {
                var filter = this.getAttribute('data-filter');
                btns.forEach(function (b) { b.classList.remove('active'); });
                this.classList.add('active');

                document.querySelectorAll('.schedule-item').forEach(function (item) {
                    var st = item.getAttribute('data-status');
                    if (filter === 'all') item.classList.remove('filtered-out');
                    else if (filter === 'released' && st === 'released') item.classList.remove('filtered-out');
                    else if (filter === 'upcoming' && st !== 'released') item.classList.remove('filtered-out');
                    else item.classList.add('filtered-out');
                });
            });
        });
    }

    function showNewChapterNotification(chapter) {
        if ('Notification' in window && Notification.permission === 'granted') {
            new Notification('Kabut di Pelabuhan Lama', {
                body: 'Chapter ' + chapter.num + ' — ' + chapter.title + ' sudah dirilis!',
                icon: 'images/cover.jpg'
            });
        }

        var toast = document.createElement('div');
        toast.className = 'new-chapter-toast';
        toast.innerHTML =
            '<div class="toast-content">' +
                '<span class="toast-icon">🎉</span>' +
                '<div class="toast-text">' +
                    '<strong>Chapter Baru!</strong>' +
                    '<span>Chapter ' + chapter.num + ' — ' + chapter.title + '</span>' +
                '</div>' +
                '<button class="toast-read-btn">Baca Sekarang</button>' +
                '<button class="toast-close">✕</button>' +
            '</div>';

        document.body.appendChild(toast);
        requestAnimationFrame(function () { toast.classList.add('show'); });

        toast.querySelector('.toast-read-btn').addEventListener('click', function () {
            if (typeof window.openChapterByNum === 'function') window.openChapterByNum(chapter.num);
            toast.classList.remove('show');
            setTimeout(function () { toast.remove(); }, 400);
        });

        toast.querySelector('.toast-close').addEventListener('click', function () {
            toast.classList.remove('show');
            setTimeout(function () { toast.remove(); }, 400);
        });

        setTimeout(function () {
            if (toast.parentNode) {
                toast.classList.remove('show');
                setTimeout(function () { toast.remove(); }, 400);
            }
        }, 10000);
    }

    function setupNotificationBtn() {
        var btn = document.getElementById('btn-notify');
        var btnText = document.getElementById('notify-btn-text');
        if (!btn || !btnText) return;

        if (!('Notification' in window)) {
            btnText.textContent = 'Tidak Didukung';
            btn.disabled = true; btn.style.opacity = '0.5';
            return;
        }

        function update() {
            if (Notification.permission === 'granted') {
                btnText.textContent = '✓ Notifikasi Aktif';
                btn.classList.add('subscribed');
            } else if (Notification.permission === 'denied') {
                btnText.textContent = 'Notifikasi Diblokir';
                btn.disabled = true; btn.style.opacity = '0.5';
            }
        }
        update();

        btn.addEventListener('click', function () {
            if (Notification.permission === 'granted') return;
            Notification.requestPermission().then(function (p) {
                update();
                if (p === 'granted') {
                    new Notification('Kabut di Pelabuhan Lama', {
                        body: 'Notifikasi aktif!', icon: 'images/cover.jpg'
                    });
                }
            });
        });
    }

    // Expose ke window
    window.isChapterReleased = isChapterReleased;
    window.getReleasedCount = getReleasedCount;
    window.showLockedMessage = showLockedMessage;

    window.refreshSchedule = function () {
        buildTimeline();
        updateCountdown();
        updateTOCLockStatus();
    };

    var lastCount = getReleasedCount();
    document.addEventListener('visibilitychange', function () {
        if (!document.hidden) {
            var now = getReleasedCount();
            if (now > lastCount) {
                lastCount = now;
                buildTimeline();
                updateCountdown();
                updateTOCLockStatus();
                showNewChapterNotification(SCHEDULE_CHAPTERS[now - 1]);
            }
        }
    });

    document.addEventListener('DOMContentLoaded', function () {
        buildTimeline();
        updateCountdown();
        countdownInterval = setInterval(updateCountdown, 1000);
        setupFilters();
        setupNotificationBtn();
        setTimeout(updateTOCLockStatus, 500);
    });

})();


// ============================================================
// MAIN APPLICATION (with Special Pages support)
// ============================================================

(function () {
    'use strict';

    // ========== CHAPTER DATA ==========
    const chapters = [
        { num: 1, title: 'Sungai yang Tidak Pernah Diam', part: 1, partName: 'Bagian 1 — Porto', file: 'chapters/chapter1.txt' },
        { num: 2, title: 'Perempuan di Balik Kanvas', part: 1, partName: 'Bagian 1 — Porto', file: 'chapters/chapter2.txt' },
        { num: 3, title: 'Port Wine dan Percakapan yang Belum Selesai', part: 1, partName: 'Bagian 1 — Porto', file: 'chapters/chapter3.txt' },
        { num: 4, title: 'Warna yang Tidak Bisa Dinamai', part: 1, partName: 'Bagian 1 — Porto', file: 'chapters/chapter4.txt' },
        { num: 5, title: 'Anting Bulan Sabit', part: 1, partName: 'Bagian 1 — Porto', file: 'chapters/chapter5.txt' },
        { num: 6, title: 'Malam-Malam di Ribeira', part: 1, partName: 'Bagian 1 — Porto', file: 'chapters/chapter6.txt' },
        { num: 7, title: 'Surat dari Amsterdam', part: 1, partName: 'Bagian 1 — Porto', file: 'chapters/chapter7.txt' },
        { num: 8, title: 'Rumah di Ujung Hutan', part: 2, partName: 'Bagian 2 — Sintra', file: 'chapters/chapter8.txt' },
        { num: 9, title: 'Helena', part: 2, partName: 'Bagian 2 — Sintra', file: 'chapters/chapter9.txt' },
        { num: 10, title: 'Lukisan yang Seharusnya Tidak Ada', part: 2, partName: 'Bagian 2 — Sintra', file: 'chapters/chapter10.txt' },
        { num: 11, title: 'Álvaro', part: 2, partName: 'Bagian 2 — Sintra', file: 'chapters/chapter11.txt' },
        { num: 12, title: 'Orang Asing dari Lisboa', part: 3, partName: 'Bagian 3 — Lisboa', file: 'chapters/chapter12.txt' },
        { num: 13, title: 'Dua Versi Kebenaran', part: 3, partName: 'Bagian 3 — Lisboa', file: 'chapters/chapter13.txt' },
        { num: 14, title: 'Retak', part: 3, partName: 'Bagian 3 — Lisboa', file: 'chapters/chapter14.txt' },
        { num: 15, title: 'Kretek Terakhir di Tepi Douro', part: 3, partName: 'Bagian 3 — Lisboa', file: 'chapters/chapter15.txt' },
        { num: 16, title: 'Kabut Sintra', part: 3, partName: 'Bagian 3 — Lisboa', file: 'chapters/chapter16.txt' },
        { num: 17, title: 'Konfrontasi', part: 3, partName: 'Bagian 3 — Lisboa', file: 'chapters/chapter17.txt' },
        { num: 18, title: 'Yang Tidak Dikatakan Sari', part: 3, partName: 'Bagian 3 — Lisboa', file: 'chapters/chapter18.txt' },
        { num: 19, title: 'Kereta ke Utara', part: 4, partName: 'Bagian 4 — Bruges', file: 'chapters/chapter19.txt' },
        { num: 20, title: 'Bruges', part: 4, partName: 'Bagian 4 — Bruges', file: 'chapters/chapter20.txt' },
        { num: 21, title: 'Lukisan Terakhir Álvaro Mendes', part: 4, partName: 'Bagian 4 — Bruges', file: 'chapters/chapter21.txt' },
        { num: 22, title: 'Pilihan', part: 4, partName: 'Bagian 4 — Bruges', file: 'chapters/chapter22.txt' },
        { num: 23, title: 'Epilog — Pelabuhan Lama', part: 4, partName: 'Bagian 4 — Bruges', file: 'chapters/chapter23.txt' },
    ];

    // ========== SPECIAL PAGES CONFIG ==========
    const SPECIAL_PAGES = {
        copyright: {
            file: 'chapters/copyright.txt',
            title: 'Hak Cipta & Kredit',
            partLabel: 'Halaman Awal',
            icon: '©',
            headerNum: '©'
        },
        sinopsis: {
            file: 'chapters/sinopsis.txt',
            title: 'Sinopsis',
            partLabel: 'Halaman Awal',
            icon: '📖',
            headerNum: '📖'
        }
    };

    // Navigation order: copyright → sinopsis → chapter1 → chapter2 → ... → chapter23
    const NAV_ORDER = ['copyright', 'sinopsis', ...chapters.map((_, i) => 'chapter-' + i)];

    // ========== STATE ==========
    let currentChapter = 0;
    let currentView = 'home'; // 'home', 'chapter', 'copyright', 'sinopsis'
    let bookmarks = JSON.parse(localStorage.getItem('kabut_bookmarks') || '[]');
    let lastReadChapter = parseInt(localStorage.getItem('kabut_lastread') || '0');
    let fontSize = parseInt(localStorage.getItem('kabut_fontsize') || '18');
    let theme = localStorage.getItem('kabut_theme') || 'light';

    // ========== DOM ELEMENTS ==========
    const $ = (sel) => document.querySelector(sel);
    const $$ = (sel) => document.querySelectorAll(sel);

    const loadingScreen = $('#loading-screen');
    const loadingBarFill = $('.loading-bar-fill');
    const mainNav = $('#main-nav');
    const heroSection = $('#hero-section');
    const aboutSection = $('#about-section');
    const charactersSection = $('#characters-section');
    const scheduleSection = $('#schedule-section');
    const readerSection = $('#reader-section');
    const tocSidebar = $('#toc-sidebar');
    const tocOverlay = $('#toc-overlay');
    const progressBar = $('#reading-progress-bar');
    const backToTopBtn = $('#btn-back-top');

    const landingSections = [heroSection, aboutSection, charactersSection, scheduleSection].filter(Boolean);

    const btnStart = $('#btn-start-reading');
    const btnSinopsis = $('#btn-read-sinopsis');
    const btnScrollAbout = $('#btn-scroll-about');
    const btnToc = $('#btn-toc');
    const btnTocClose = $('#toc-close');
    const btnTheme = $('#btn-theme');
    const btnFontIncrease = $('#btn-font-increase');
    const btnFontDecrease = $('#btn-font-decrease');
    const btnPrev = $('#btn-prev-chapter');
    const btnNext = $('#btn-next-chapter');
    const btnBookmark = $('#btn-bookmark');
    const navBrand = $('#nav-brand');
    const btnBackHome = $('#btn-back-home');

    const chapterPartLabel = $('#chapter-part-label');
    const chapterNumber = $('#chapter-number');
    const chapterTitle = $('#chapter-title');
    const chapterReadTime = $('#chapter-read-time');
    const chapterContent = $('#chapter-content');
    const prevChapterTitle = $('#prev-chapter-title');
    const nextChapterTitle = $('#next-chapter-title');
    const bookmarkIcon = $('#bookmark-icon');
    const themeIcon = $('#theme-icon');
    const chapterNav = $('#chapter-nav');

    // ========== INITIALIZATION ==========
    function init() {
        applyTheme(theme);
        applyFontSize(fontSize);
        buildTOC();
        setupEventListeners();
        setupSpecialPageLinks();
        createHeroParticles();
        simulateLoading();
        console.log('📖 Kabut di Pelabuhan Lama — App initialized');
    }

    // ========== LOADING SCREEN ==========
    function simulateLoading() {
        let progress = 0;
        const interval = setInterval(() => {
            progress += Math.random() * 15 + 5;
            if (progress > 100) progress = 100;
            if (loadingBarFill) loadingBarFill.style.width = progress + '%';
            if (progress >= 100) {
                clearInterval(interval);
                setTimeout(() => {
                    if (loadingScreen) loadingScreen.classList.add('hidden');
                }, 500);
            }
        }, 200);
    }

    // ========== HERO PARTICLES ==========
    function createHeroParticles() {
        const container = $('#hero-particles');
        if (!container) return;
        for (let i = 0; i < 20; i++) {
            const particle = document.createElement('div');
            particle.className = 'hero-particle';
            particle.style.left = Math.random() * 100 + '%';
            particle.style.animationDuration = (Math.random() * 15 + 10) + 's';
            particle.style.animationDelay = (Math.random() * 10) + 's';
            particle.style.width = (Math.random() * 3 + 1) + 'px';
            particle.style.height = particle.style.width;
            particle.style.opacity = Math.random() * 0.5 + 0.1;
            container.appendChild(particle);
        }
    }

    // ========== BUILD TABLE OF CONTENTS ==========
    function buildTOC() {
        const partContainers = {
            1: $('#toc-list-part1'),
            2: $('#toc-list-part2'),
            3: $('#toc-list-part3'),
            4: $('#toc-list-part4'),
        };

        chapters.forEach((ch, index) => {
            const li = document.createElement('li');
            li.dataset.index = index;
            li.dataset.chapter = ch.num;
            const a = document.createElement('a');
            a.innerHTML = `<span class="ch-num">${ch.num}.</span> ${ch.title}`;
            a.addEventListener('click', () => {
                if (typeof window.isChapterReleased === 'function' && !window.isChapterReleased(index)) {
                    if (typeof window.showLockedMessage === 'function') window.showLockedMessage(ch.num);
                    return;
                }
                openChapter(index);
                closeTOC();
            });
            li.appendChild(a);
            if (partContainers[ch.part]) {
                partContainers[ch.part].appendChild(li);
            }
        });

        updateBookmarkList();
    }

    // ========== SPECIAL PAGE TOC LINKS ==========
    function setupSpecialPageLinks() {
        // Handle TOC links with data-page attribute
        const tocPageLinks = $$('.toc-link[data-page]');
        tocPageLinks.forEach(link => {
            link.addEventListener('click', function (e) {
                e.preventDefault();
                const pageType = this.getAttribute('data-page');
                if (pageType && SPECIAL_PAGES[pageType]) {
                    openSpecialPage(pageType);
                    closeTOC();
                }
            });
        });

        // Handle hero sinopsis button
        if (btnSinopsis) {
            btnSinopsis.addEventListener('click', () => {
                openSpecialPage('sinopsis');
            });
        }
    }

    // ========== EVENT LISTENERS ==========
    function setupEventListeners() {
        // Start reading
        if (btnStart) {
            btnStart.addEventListener('click', () => {
                if (typeof window.getReleasedCount === 'function' && window.getReleasedCount() === 0) {
                    if (typeof window.showLockedMessage === 'function') window.showLockedMessage(1);
                    return;
                }

                let startIndex = lastReadChapter || 0;

                if (typeof window.isChapterReleased === 'function' && !window.isChapterReleased(startIndex)) {
                    const released = window.getReleasedCount();
                    startIndex = released > 0 ? released - 1 : 0;
                }

                openChapter(startIndex);
            });
        }

        // Scroll to about
        if (btnScrollAbout) {
            btnScrollAbout.addEventListener('click', () => {
                if (aboutSection) aboutSection.scrollIntoView({ behavior: 'smooth' });
            });
        }

        // TOC
        if (btnToc) btnToc.addEventListener('click', openTOC);
        if (btnTocClose) btnTocClose.addEventListener('click', closeTOC);
        if (tocOverlay) tocOverlay.addEventListener('click', closeTOC);

        // Theme
        if (btnTheme) btnTheme.addEventListener('click', toggleTheme);

        // Font size
        if (btnFontIncrease) btnFontIncrease.addEventListener('click', () => changeFontSize(1));
        if (btnFontDecrease) btnFontDecrease.addEventListener('click', () => changeFontSize(-1));

        // Chapter nav — Previous
        if (btnPrev) {
            btnPrev.addEventListener('click', () => {
                navigatePrev();
            });
        }

        // Chapter nav — Next
        if (btnNext) {
            btnNext.addEventListener('click', () => {
                navigateNext();
            });
        }

        // Bookmark
        if (btnBookmark) btnBookmark.addEventListener('click', toggleBookmark);

        // Nav brand -> home
        if (navBrand) navBrand.addEventListener('click', goToHome);

        // Back to home button
        if (btnBackHome) btnBackHome.addEventListener('click', goToHome);

        // Scroll
        window.addEventListener('scroll', handleScroll);

        // Back to top
        if (backToTopBtn) {
            backToTopBtn.addEventListener('click', () => {
                window.scrollTo({ top: 0, behavior: 'smooth' });
            });
        }

        // Keyboard
        document.addEventListener('keydown', handleKeyboard);
    }

    // ========== NAVIGATION (Prev/Next) ==========
    function navigatePrev() {
        if (currentView === 'chapter') {
            if (currentChapter > 0) {
                openChapter(currentChapter - 1);
            } else {
                // Chapter 1 → go to sinopsis
                openSpecialPage('sinopsis');
            }
        } else if (currentView === 'sinopsis') {
            openSpecialPage('copyright');
        } else if (currentView === 'copyright') {
            // Already first page, do nothing or go home
            goToHome();
        }
    }

    function navigateNext() {
        if (currentView === 'copyright') {
            openSpecialPage('sinopsis');
        } else if (currentView === 'sinopsis') {
            // Go to chapter 1 if released
            if (typeof window.getReleasedCount === 'function' && window.getReleasedCount() > 0) {
                openChapter(0);
            } else {
                if (typeof window.showLockedMessage === 'function') window.showLockedMessage(1);
            }
        } else if (currentView === 'chapter') {
            if (currentChapter < chapters.length - 1) {
                const nextIndex = currentChapter + 1;
                if (typeof window.isChapterReleased === 'function' && !window.isChapterReleased(nextIndex)) {
                    if (typeof window.showLockedMessage === 'function') window.showLockedMessage(chapters[nextIndex].num);
                    return;
                }
                openChapter(nextIndex);
            }
        }
    }

    // ========== SCROLL HANDLER ==========
    function handleScroll() {
        const scrollY = window.scrollY;
        const docHeight = document.documentElement.scrollHeight - window.innerHeight;
        const scrollPercent = docHeight > 0 ? (scrollY / docHeight) * 100 : 0;

        if (readerSection && readerSection.classList.contains('active')) {
            if (progressBar) progressBar.style.width = scrollPercent + '%';
        }

        if (mainNav) {
            if (scrollY > 100 && (readerSection.classList.contains('active') || scrollY > window.innerHeight * 0.5)) {
                mainNav.classList.add('visible');
            } else {
                mainNav.classList.remove('visible');
            }
        }

        if (backToTopBtn) {
            if (scrollY > 500) backToTopBtn.classList.add('visible');
            else backToTopBtn.classList.remove('visible');
        }

        $$('.fade-in').forEach(el => {
            const rect = el.getBoundingClientRect();
            if (rect.top < window.innerHeight * 0.85) el.classList.add('visible');
        });
    }

    // ========== KEYBOARD ==========
    function handleKeyboard(e) {
        if (!readerSection || !readerSection.classList.contains('active')) return;

        if (e.key === 'ArrowLeft') {
            navigatePrev();
        } else if (e.key === 'ArrowRight') {
            navigateNext();
        } else if (e.key === 'Escape') {
            if (tocSidebar && tocSidebar.classList.contains('active')) closeTOC();
        }
    }

    // ========== SHOW READER VIEW ==========
    function showReaderView() {
        landingSections.forEach(section => {
            section.style.display = 'none';
        });

        if (readerSection) {
            readerSection.style.display = 'block';
            readerSection.classList.add('active');
        }

        if (mainNav) mainNav.classList.add('visible');
    }

    // ========== OPEN SPECIAL PAGE (Sinopsis / Copyright) ==========
    async function openSpecialPage(pageType) {
        const pageConfig = SPECIAL_PAGES[pageType];
        if (!pageConfig) return;

        currentView = pageType;
        showReaderView();

        // Remove old special page classes, add new ones
        if (readerSection) {
            readerSection.classList.remove('special-page-copyright', 'special-page-sinopsis');
            readerSection.classList.add('special-page-' + pageType);
        }

        // Update header
        if (chapterPartLabel) chapterPartLabel.textContent = pageConfig.partLabel;
        if (chapterNumber) chapterNumber.textContent = pageConfig.headerNum;
        if (chapterTitle) chapterTitle.textContent = pageConfig.title;
        if (chapterReadTime) chapterReadTime.textContent = '';

        // Hide bookmark button on special pages
        if (btnBookmark) btnBookmark.style.display = 'none';

        // Show loading
        if (chapterContent) {
            chapterContent.innerHTML = `
                <div class="chapter-loading">
                    <div class="chapter-loading-spinner"></div>
                    <p>Memuat halaman...</p>
                </div>
            `;
        }

        // Load content
        try {
            const response = await fetch(pageConfig.file);
            if (!response.ok) throw new Error(`HTTP ${response.status}: ${response.statusText}`);
            const text = await response.text();

            renderSpecialPageContent(text, pageType);

            // Read time
            if (chapterReadTime && chapterContent) {
                const wordCount = chapterContent.textContent.split(/\s+/).length;
                const minutes = Math.max(1, Math.round(wordCount / 200));
                chapterReadTime.textContent = `± ${minutes} menit baca`;
            }
        } catch (err) {
            console.error('Error loading special page:', err);
            if (chapterContent) {
                chapterContent.innerHTML = `
                    <div class="chapter-error">
                        <div class="chapter-error-icon">⚠️</div>
                        <h3>Gagal Memuat Halaman</h3>
                        <p>File <code>${pageConfig.file}</code> tidak ditemukan.</p>
                        <p class="chapter-error-hint">Pastikan file tersedia di folder <code>chapters/</code></p>
                        <p class="chapter-error-detail"><small>${err.message}</small></p>
                        <button class="chapter-error-btn" onclick="location.reload()">Coba Lagi</button>
                    </div>
                `;
            }
        }

        // Update navigation buttons
        updateSpecialPageNav(pageType);

        // Update TOC active state
        updateTOCActiveSpecial(pageType);

        window.scrollTo({ top: 0, behavior: 'smooth' });
    }

        // ========== RENDER SPECIAL PAGE (UPDATED) ==========
    function renderSpecialPageContent(rawText, pageType) {
        if (!chapterContent) return;

        var lines = rawText.split('\n');
        var html = '<div class="special-page-content special-page-content-' + pageType + '">';
        var i = 0;

        while (i < lines.length) {
            var trimmed = lines[i].trim();

            // Empty line — skip
            if (trimmed === '') { i++; continue; }

            // Ornamental double line ═══
            if (/^═{3,}$/.test(trimmed)) {
                html += '<div class="ornamental-line">═══════════════════</div>';
                i++; continue;
            }

            // Horizontal rule ---
            if (trimmed === '---' || trimmed === '***' || trimmed === '* * *') {
                html += '<hr class="special-divider">';
                i++; continue;
            }

            // Decorative separator ✦ ✦ ✦
            if (/^[✦\*·•]{1,5}(\s+[✦\*·•]{1,5}){1,5}$/.test(trimmed)) {
                html += '<div class="decorative-separator">' + trimmed + '</div>';
                i++; continue;
            }

            // Blockquote > text
            if (trimmed.startsWith('> ')) {
                var quoteLines = [];
                while (i < lines.length && lines[i].trim().startsWith('> ')) {
                    quoteLines.push(lines[i].trim().substring(2));
                    i++;
                }
                var quoteHtml = quoteLines.map(function(l) {
                    return formatInlineText(l);
                }).join('<br>');
                html += '<blockquote class="special-blockquote">' + quoteHtml + '</blockquote>';
                continue;
            }

            // ## Subheading (Markdown-style)
            if (trimmed.startsWith('## ')) {
                html += '<h3 class="special-subheading">' + formatInlineText(trimmed.substring(3)) + '</h3>';
                i++; continue;
            }

            // ALL CAPS heading (but not ©, not —, must have letters, min 3 chars)
            if (trimmed === trimmed.toUpperCase() && trimmed.length > 2 &&
                !trimmed.startsWith('©') && !trimmed.startsWith('—') &&
                !trimmed.startsWith('"') && /[A-Z]/.test(trimmed)) {
                html += '<h3 class="special-heading">' + toTitleCase(trimmed) + '</h3>';
                i++; continue;
            }

            // Credit line (key : value) — copyright page
            if (pageType === 'copyright' && trimmed.includes(' : ')) {
                var colonIdx = trimmed.indexOf(' : ');
                var key = trimmed.substring(0, colonIdx).trim();
                var val = trimmed.substring(colonIdx + 3).trim();
                if (key.length <= 30 && val.length > 0) {
                    html += '<div class="credit-line-row">' +
                            '<span class="credit-row-label">' + key + '</span>' +
                            '<span class="credit-row-value">' + val + '</span>' +
                            '</div>';
                    i++; continue;
                }
            }

            // Regular paragraph — collect until break marker
            var paragraph = trimmed;
            i++;

            while (i < lines.length) {
                var nextLine = lines[i].trim();

                // Stop conditions
                if (nextLine === '') break;
                if (/^═{3,}$/.test(nextLine)) break;
                if (nextLine === '---' || nextLine === '***' || nextLine === '* * *') break;
                if (/^[✦\*·•]{1,5}(\s+[✦\*·•]{1,5}){1,5}$/.test(nextLine)) break;
                if (nextLine.startsWith('> ')) break;
                if (nextLine.startsWith('## ')) break;
                if (nextLine === nextLine.toUpperCase() && nextLine.length > 2 &&
                    !nextLine.startsWith('©') && !nextLine.startsWith('"') && /[A-Z]/.test(nextLine)) break;
                if (pageType === 'copyright' && nextLine.includes(' : ')) {
                    var ci = nextLine.indexOf(' : ');
                    var k = nextLine.substring(0, ci).trim();
                    var v = nextLine.substring(ci + 3).trim();
                    if (k.length <= 30 && v.length > 0) break;
                }

                paragraph += ' ' + nextLine;
                i++;
            }

            // Determine paragraph class
            var pClass = 'special-paragraph';
            if (paragraph.startsWith('©')) pClass += ' copyright-notice';
            if (paragraph.startsWith('"') || paragraph.startsWith('\u201C')) pClass += ' special-quote';

            // Format inline (bold, italic, etc)
            paragraph = formatInlineText(paragraph);

            html += '<p class="' + pClass + '">' + paragraph + '</p>';
        }

        html += '</div>';
        chapterContent.innerHTML = html;
    }

    function formatInlineTextSpecial(text) {
        text = text.replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>');
        text = text.replace(/\*(.+?)\*/g, '<em>$1</em>');
        text = text.replace(/--/g, '—');
        return text;
    }

    function toTitleCase(str) {
        return str.toLowerCase().replace(/(?:^|\s)\S/g, function (a) {
            return a.toUpperCase();
        });
    }

    function updateSpecialPageNav(pageType) {
        if (pageType === 'copyright') {
            // Prev: none (first page)
            if (btnPrev) {
                btnPrev.disabled = true;
                btnPrev.style.display = 'none';
            }
            if (prevChapterTitle) prevChapterTitle.textContent = '—';

            // Next: sinopsis
            if (btnNext) {
                btnNext.disabled = false;
                btnNext.style.display = '';
            }
            if (nextChapterTitle) nextChapterTitle.textContent = 'Sinopsis';

        } else if (pageType === 'sinopsis') {
            // Prev: copyright
            if (btnPrev) {
                btnPrev.disabled = false;
                btnPrev.style.display = '';
            }
            if (prevChapterTitle) prevChapterTitle.textContent = 'Hak Cipta & Kredit';

            // Next: chapter 1 (if released)
            const releasedCount = typeof window.getReleasedCount === 'function' ? window.getReleasedCount() : 0;
            if (releasedCount > 0) {
                if (btnNext) {
                    btnNext.disabled = false;
                    btnNext.style.display = '';
                }
                if (nextChapterTitle) nextChapterTitle.textContent = 'Ch.1: ' + chapters[0].title;
            } else {
                if (btnNext) {
                    btnNext.disabled = false;
                    btnNext.style.display = '';
                }
                if (nextChapterTitle) nextChapterTitle.textContent = '🔒 ' + chapters[0].title;
            }
        }
    }

    function updateTOCActiveSpecial(pageType) {
        // Remove active from all chapter items
        $$('.toc-list li').forEach((li) => {
            li.classList.remove('active');
        });

        // Add active to special page link
        $$('.toc-link[data-page]').forEach(link => {
            const parent = link.closest('li');
            if (parent) {
                if (link.getAttribute('data-page') === pageType) {
                    parent.classList.add('active');
                } else {
                    parent.classList.remove('active');
                }
            }
        });
    }

    // ========== OPEN CHAPTER ==========
    async function openChapter(index) {
        if (index < 0 || index >= chapters.length) return;

        if (typeof window.isChapterReleased === 'function' && !window.isChapterReleased(index)) {
            if (typeof window.showLockedMessage === 'function') window.showLockedMessage(chapters[index].num);
            return;
        }

        currentChapter = index;
        currentView = 'chapter';

        showReaderView();

        // Remove special page classes
        if (readerSection) {
            readerSection.classList.remove('special-page-copyright', 'special-page-sinopsis');
        }

        // Show bookmark button
        if (btnBookmark) btnBookmark.style.display = '';

        const ch = chapters[index];

        // Update header
        if (chapterPartLabel) chapterPartLabel.textContent = ch.partName;
        if (chapterNumber) chapterNumber.textContent = `Chapter ${ch.num}`;
        if (chapterTitle) chapterTitle.textContent = ch.title;

        // Show loading
        if (chapterContent) {
            chapterContent.innerHTML = `
                <div class="chapter-loading">
                    <div class="chapter-loading-spinner"></div>
                    <p>Memuat chapter...</p>
                </div>
            `;
        }

        // Load content
        try {
            const text = await loadChapterFile(ch.file);
            renderChapterContent(text);
        } catch (err) {
            if (chapterContent) {
                chapterContent.innerHTML = `
                    <div class="chapter-error">
                        <div class="chapter-error-icon">⚠️</div>
                        <h3>Gagal Memuat Chapter</h3>
                        <p>File <code>${ch.file}</code> tidak ditemukan.</p>
                        <p class="chapter-error-hint">Pastikan file chapter sudah ada di folder <code>chapters/</code></p>
                        <p class="chapter-error-detail"><small>${err.message}</small></p>
                        <button class="chapter-error-btn" onclick="location.reload()">Coba Lagi</button>
                    </div>
                `;
            }
        }

        updateChapterNav();
        updateBookmarkState();
        updateTOCActive();

        localStorage.setItem('kabut_lastread', index.toString());

        // Read time
        if (chapterContent && chapterReadTime) {
            const wordCount = chapterContent.textContent.split(/\s+/).length;
            const minutes = Math.max(1, Math.round(wordCount / 200));
            chapterReadTime.textContent = `± ${minutes} menit baca`;
        }

        window.scrollTo({ top: 0, behavior: 'smooth' });
    }

    async function loadChapterFile(filePath) {
        const response = await fetch(filePath);
        if (!response.ok) throw new Error(`HTTP ${response.status}: ${response.statusText}`);
        return await response.text();
    }

    function renderChapterContent(rawText) {
        if (!chapterContent) return;

        const lines = rawText.split('\n');
        let html = '';

        lines.forEach((line) => {
            const trimmed = line.trim();

            if (trimmed === '') return;

            if (trimmed === '***' || trimmed === '---' || trimmed === '* * *') {
                html += '<div class="separator">· · ·</div>';
                return;
            }

            if (trimmed.startsWith('## ')) {
                html += `<h3>${trimmed.substring(3)}</h3>`;
                return;
            }

            if (trimmed.startsWith('> ')) {
                html += `<blockquote>${formatInlineText(trimmed.substring(2))}</blockquote>`;
                return;
            }

            html += `<p>${formatInlineText(trimmed)}</p>`;
        });

        chapterContent.innerHTML = html;
    }

    function formatInlineText(text) {
        text = text.replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>');
        text = text.replace(/\*(.+?)\*/g, '<em>$1</em>');
        text = text.replace(/--/g, '—');
        return text;
    }

    function updateChapterNav() {
        // Prev button
        if (btnPrev) {
            if (currentChapter > 0) {
                btnPrev.disabled = false;
                btnPrev.style.display = '';
                if (prevChapterTitle) prevChapterTitle.textContent = chapters[currentChapter - 1].title;
            } else {
                // Chapter 1: prev goes to sinopsis
                btnPrev.disabled = false;
                btnPrev.style.display = '';
                if (prevChapterTitle) prevChapterTitle.textContent = 'Sinopsis';
            }
        }

        // Next button
        if (btnNext) {
            if (currentChapter < chapters.length - 1) {
                const nextIndex = currentChapter + 1;
                const released = typeof window.isChapterReleased === 'function' ? window.isChapterReleased(nextIndex) : true;
                btnNext.disabled = false;
                btnNext.style.display = '';
                if (nextChapterTitle) {
                    nextChapterTitle.textContent = released ? chapters[nextIndex].title : '🔒 ' + chapters[nextIndex].title;
                }
            } else {
                btnNext.disabled = true;
                btnNext.style.display = '';
                if (nextChapterTitle) nextChapterTitle.textContent = 'Tamat';
            }
        }
    }

    function updateTOCActive() {
        $$('.toc-list li').forEach((li) => {
            li.classList.remove('active');
            if (parseInt(li.dataset.index) === currentChapter) li.classList.add('active');
        });

        // Remove active from special page links
        $$('.toc-link[data-page]').forEach(link => {
            const parent = link.closest('li');
            if (parent) parent.classList.remove('active');
        });
    }

    // ========== BOOKMARK ==========
    function toggleBookmark() {
        if (currentView !== 'chapter') return; // Only bookmark chapters

        const chNum = chapters[currentChapter].num;
        const idx = bookmarks.indexOf(chNum);
        if (idx >= 0) bookmarks.splice(idx, 1);
        else bookmarks.push(chNum);
        localStorage.setItem('kabut_bookmarks', JSON.stringify(bookmarks));
        updateBookmarkState();
        updateBookmarkList();
    }

    function updateBookmarkState() {
        if (!bookmarkIcon || !btnBookmark) return;

        if (currentView !== 'chapter') {
            btnBookmark.style.display = 'none';
            return;
        }

        btnBookmark.style.display = '';
        const chNum = chapters[currentChapter].num;
        const isBookmarked = bookmarks.includes(chNum);
        bookmarkIcon.textContent = isBookmarked ? '★' : '☆';
        btnBookmark.classList.toggle('active', isBookmarked);
    }

    function updateBookmarkList() {
        const list = $('#bookmark-list');
        if (!list) return;
        if (bookmarks.length === 0) {
            list.innerHTML = '<li class="toc-empty">Belum ada bookmark</li>';
            return;
        }
        list.innerHTML = '';
        bookmarks.forEach(chNum => {
            const ch = chapters.find(c => c.num === chNum);
            if (!ch) return;
            const index = chapters.indexOf(ch);
            const li = document.createElement('li');
            const a = document.createElement('a');
            a.innerHTML = `<span class="ch-num">${ch.num}.</span> ${ch.title}`;
            a.addEventListener('click', () => { openChapter(index); closeTOC(); });
            li.appendChild(a);
            list.appendChild(li);
        });
    }

    // ========== TOC ==========
    function openTOC() {
        if (tocSidebar) tocSidebar.classList.add('active');
        if (tocOverlay) tocOverlay.classList.add('active');
        document.body.style.overflow = 'hidden';
    }

    function closeTOC() {
        if (tocSidebar) tocSidebar.classList.remove('active');
        if (tocOverlay) tocOverlay.classList.remove('active');
        document.body.style.overflow = '';
    }

    // ========== THEME ==========
    function toggleTheme() {
        theme = theme === 'light' ? 'dark' : 'light';
        applyTheme(theme);
        localStorage.setItem('kabut_theme', theme);
    }

    function applyTheme(t) {
        document.documentElement.setAttribute('data-theme', t);
        if (themeIcon) themeIcon.textContent = t === 'dark' ? '☀' : '🌙';
        theme = t;
    }

    // ========== FONT SIZE ==========
    function changeFontSize(direction) {
        fontSize += direction * 2;
        if (fontSize < 14) fontSize = 14;
        if (fontSize > 26) fontSize = 26;
        applyFontSize(fontSize);
        localStorage.setItem('kabut_fontsize', fontSize.toString());
    }

    function applyFontSize(size) {
        document.documentElement.style.setProperty('--font-size-base', size + 'px');
    }

    // ========== GO TO HOME ==========
    function goToHome() {
        currentView = 'home';

        if (readerSection) {
            readerSection.classList.remove('active', 'special-page-copyright', 'special-page-sinopsis');
            readerSection.style.display = 'none';
        }

        landingSections.forEach(section => {
            section.style.display = '';
        });

        if (mainNav) mainNav.classList.remove('visible');
        if (progressBar) progressBar.style.width = '0%';

        window.scrollTo({ top: 0, behavior: 'smooth' });

        if (typeof window.refreshSchedule === 'function') window.refreshSchedule();
    }

    // ★ Expose openChapter & openSpecialPage ke window
    window.openChapterByNum = function (chapterNum) {
        const index = chapterNum - 1;
        if (index >= 0 && index < chapters.length) openChapter(index);
    };

    window.openSpecialPage = function (pageType) {
        openSpecialPage(pageType);
    };

    // ========== START ==========
    init();

})();


// ============================================================
// BOOK COVER - IMAGE HANDLER
// ============================================================

document.addEventListener('DOMContentLoaded', function() {
    const coverImage = document.getElementById('cover-image');
    const coverFallback = document.getElementById('cover-fallback');

    if (coverImage) {
        coverImage.addEventListener('load', function() {
            this.classList.add('loaded');
            this.classList.remove('error');
            if (coverFallback) coverFallback.style.display = 'none';
        });

        coverImage.addEventListener('error', function() {
            this.classList.add('error');
            this.classList.remove('loaded');
            this.style.display = 'none';
            if (coverFallback) coverFallback.style.display = 'flex';
        });

        if (coverImage.complete) {
            if (coverImage.naturalWidth === 0) {
                coverImage.classList.add('error');
                coverImage.style.display = 'none';
                if (coverFallback) coverFallback.style.display = 'flex';
            } else {
                coverImage.classList.add('loaded');
                if (coverFallback) coverFallback.style.display = 'none';
            }
        }
    }

    const bookCover = document.querySelector('.book-cover');
    const btnStartReading = document.getElementById('btn-start-reading');

    if (bookCover) {
        bookCover.addEventListener('click', function() {
            this.classList.add('opening');
            setTimeout(function() {
                if (btnStartReading) btnStartReading.click();
            }, 800);
            setTimeout(function() {
                bookCover.classList.remove('opening');
            }, 1500);
        });
    }

    const bookWrapper = document.querySelector('.book-cover-wrapper');

    if (bookWrapper && window.matchMedia('(min-width: 769px)').matches) {
        document.addEventListener('mousemove', function(e) {
            if (!isElementInViewport(bookWrapper)) return;

            const rect = bookWrapper.getBoundingClientRect();
            const centerX = rect.left + rect.width / 2;
            const centerY = rect.top + rect.height / 2;
            const deltaX = (e.clientX - centerX) / window.innerWidth;
            const deltaY = (e.clientY - centerY) / window.innerHeight;
            const rotateY = -18 + (deltaX * 10);
            const rotateX = 3 + (deltaY * -5);

            const cover = bookWrapper.querySelector('.book-cover');
            if (cover && !cover.classList.contains('opening')) {
                cover.style.transform = `rotateY(${rotateY}deg) rotateX(${rotateX}deg)`;
            }
        });

        bookWrapper.addEventListener('mouseleave', function() {
            const cover = this.querySelector('.book-cover');
            if (cover && !cover.classList.contains('opening')) {
                cover.style.transform = 'rotateY(-18deg) rotateX(3deg)';
            }
        });
    }
});

function isElementInViewport(el) {
    const rect = el.getBoundingClientRect();
    return (
        rect.top < window.innerHeight &&
        rect.bottom > 0 &&
        rect.left < window.innerWidth &&
        rect.right > 0
    );
}


// ============================================================
// CHARACTER SECTION - INTERACTIONS
// ============================================================

document.addEventListener('DOMContentLoaded', function () {

    const detailBtns = document.querySelectorAll('.character-detail-btn');
    const closeBtns = document.querySelectorAll('.detail-close-btn');

    detailBtns.forEach(function (btn) {
        btn.addEventListener('click', function () {
            const targetId = this.getAttribute('data-target');
            const panel = document.getElementById(targetId);
            if (!panel) return;

            document.querySelectorAll('.character-detail-panel.open').forEach(function (p) {
                if (p.id !== targetId) p.classList.remove('open');
            });

            panel.classList.toggle('open');

            if (panel.classList.contains('open')) {
                setTimeout(function () {
                    panel.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
                }, 300);
            }
        });
    });

    closeBtns.forEach(function (btn) {
        btn.addEventListener('click', function () {
            const panel = this.closest('.character-detail-panel');
            if (panel) panel.classList.remove('open');
        });
    });

    const characterImages = document.querySelectorAll('.character-image');
    const initialsMap = {
        'Arka Wisesa': 'AW', 'Inês Ferreira': 'IF',
        'Helena': 'H', 'Rafael': 'R',
        'Álvaro Mendes': 'ÁM', 'Sari': 'S',
        'Arka': 'AW', 'Inês': 'IF', 'Álvaro': 'ÁM'
    };

    characterImages.forEach(function (img) {
        img.addEventListener('error', function () {
            this.classList.add('img-error');
            this.style.display = 'none';
            const frame = this.closest('.character-image-frame');
            const avatar = this.closest('.relation-avatar');

            if (frame) {
                const altText = this.getAttribute('alt') || '';
                frame.classList.add('no-image');
                frame.setAttribute('data-initials', initialsMap[altText] || altText.charAt(0).toUpperCase());
            }

            if (avatar) {
                const altText = this.getAttribute('alt') || '';
                avatar.classList.add('no-image');
                avatar.setAttribute('data-initials', initialsMap[altText] || altText.charAt(0).toUpperCase());
                this.style.display = 'none';
            }
        });

        if (img.complete && img.naturalWidth === 0) {
            img.dispatchEvent(new Event('error'));
        }
    });

    const relationAvatarImgs = document.querySelectorAll('.relation-avatar img');
    relationAvatarImgs.forEach(function (img) {
        img.addEventListener('error', function () {
            this.style.display = 'none';
            const avatar = this.closest('.relation-avatar');
            if (avatar) {
                const altText = this.getAttribute('alt') || '';
                avatar.classList.add('no-image');
                avatar.setAttribute('data-initials', initialsMap[altText] || altText.charAt(0).toUpperCase());
            }
        });
        if (img.complete && img.naturalWidth === 0) {
            img.dispatchEvent(new Event('error'));
        }
    });

    const revealObserver = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                revealObserver.unobserve(entry.target);
            }
        });
    }, { root: null, rootMargin: '0px 0px -60px 0px', threshold: 0.1 });

    document.querySelectorAll('.character-card').forEach(function (card) {
        revealObserver.observe(card);
    });

    const relationSection = document.querySelector('.character-relation-section');
    if (relationSection) revealObserver.observe(relationSection);

    if (window.matchMedia('(min-width: 769px)').matches) {
        document.querySelectorAll('.character-card-main').forEach(function (card) {
            card.addEventListener('mousemove', function (e) {
                const rect = card.getBoundingClientRect();
                const x = e.clientX - rect.left;
                const y = e.clientY - rect.top;
                const centerX = rect.width / 2;
                const centerY = rect.height / 2;
                const rotateX = ((y - centerY) / centerY) * -3;
                const rotateY = ((x - centerX) / centerX) * 3;
                card.style.transform = 'translateY(-6px) perspective(800px) rotateX(' + rotateX + 'deg) rotateY(' + rotateY + 'deg)';
            });

            card.addEventListener('mouseleave', function () {
                card.style.transform = 'translateY(0) perspective(800px) rotateX(0deg) rotateY(0deg)';
            });
        });
    }
});

// ============================================================
// MUSIC PLAYER
// ============================================================

(function () {

    // ★★★ DAFTAR LAGU — GANTI DENGAN FILE MUSIKMU ★★★
    var playlist = [
        {
            title: "Kabut Pagi di Porto",
            artist: "Ambient",
            src: "https://files.catbox.moe/xuxaah.mp3"
        },
        {
            title: "Sungai Douro",
            artist: "Piano",
            src: "https://files.catbox.moe/9tn7qc.mp3"
        },
        {
            title: "Malam di Ribeira",
            artist: "Guitar",
            src: "music/track3.mp3"
        },
        {
            title: "Fado untuk Inês",
            artist: "Fado",
            src: "music/track4.mp3"
        },
        {
            title: "Kabut Sintra",
            artist: "Ambient",
            src: "music/track5.mp3"
        },
        {
            title: "Kereta ke Bruges",
            artist: "Piano",
            src: "music/track6.mp3"
        }
    ];

    // State
    var audio = new Audio();
    var currentTrack = 0;
    var isPlaying = false;
    var isPanelOpen = false;
    var isPlaylistOpen = false;
    var isShuffle = false;
    var repeatMode = 0; // 0=off, 1=all, 2=one
    var volume = 0.8;
    var isSeeking = false;

    // DOM
    var player = document.getElementById('music-player');
    var toggle = document.getElementById('music-toggle');
    var panel = document.getElementById('music-panel');
    var disc = document.getElementById('music-disc');
    var songTitle = document.getElementById('music-song-title');
    var songArtist = document.getElementById('music-song-artist');
    var playBtn = document.getElementById('music-play');
    var playIcon = document.getElementById('music-play-icon');
    var prevBtn = document.getElementById('music-prev');
    var nextBtn = document.getElementById('music-next');
    var progressBar = document.getElementById('music-progress-bar');
    var progressFill = document.getElementById('music-progress-fill');
    var currentTimeEl = document.getElementById('music-current-time');
    var durationEl = document.getElementById('music-duration');
    var volBtn = document.getElementById('music-vol-btn');
    var volIcon = document.getElementById('music-vol-icon');
    var volumeBar = document.getElementById('music-volume-bar');
    var volumeFill = document.getElementById('music-volume-fill');
    var playlistToggle = document.getElementById('music-playlist-toggle');
    var playlistEl = document.getElementById('music-playlist');
    var playlistCount = document.getElementById('playlist-count');
    var shuffleBtn = document.getElementById('music-shuffle');
    var repeatBtn = document.getElementById('music-repeat');

    // ========== INIT ==========
    function initPlayer() {
        if (playlist.length === 0) {
            if (player) player.style.display = 'none';
            return;
        }

        audio.volume = volume;
        buildPlaylist();
        loadTrack(0, false);
        bindEvents();

        // Load saved volume
        try {
            var savedVol = parseFloat(localStorage.getItem('kabut_music_vol'));
            if (!isNaN(savedVol)) {
                volume = savedVol;
                audio.volume = volume;
                updateVolumeUI();
            }
        } catch (e) {}
    }

    // ========== BUILD PLAYLIST ==========
    function buildPlaylist() {
        if (!playlistEl) return;
        playlistEl.innerHTML = '';
        if (playlistCount) playlistCount.textContent = playlist.length;

        playlist.forEach(function (track, index) {
            var li = document.createElement('li');
            li.setAttribute('data-index', index);
            li.innerHTML =
                '<span class="pl-num">' + (index + 1) + '.</span>' +
                '<span class="pl-playing-icon">♪</span>' +
                '<span>' + track.title + '</span>';

            li.addEventListener('click', function () {
                loadTrack(index, true);
            });

            playlistEl.appendChild(li);
        });
    }

    // ========== LOAD TRACK ==========
    function loadTrack(index, autoplay) {
        if (index < 0 || index >= playlist.length) return;

        currentTrack = index;
        var track = playlist[index];

        audio.src = track.src;
        audio.load();

        if (songTitle) songTitle.textContent = track.title;
        if (songArtist) songArtist.textContent = track.artist;

        // Update playlist active
        if (playlistEl) {
            var items = playlistEl.querySelectorAll('li');
            items.forEach(function (li) { li.classList.remove('active'); });
            if (items[index]) items[index].classList.add('active');
        }

        // Reset progress
        if (progressFill) progressFill.style.width = '0%';
        if (currentTimeEl) currentTimeEl.textContent = '0:00';
        if (durationEl) durationEl.textContent = '0:00';

        if (autoplay) {
            audio.play().then(function () {
                setPlayingState(true);
            }).catch(function (e) {
                console.log('Autoplay blocked:', e.message);
            });
        }
    }

    // ========== PLAY / PAUSE ==========
    function togglePlay() {
        if (!audio.src || audio.src === window.location.href) {
            loadTrack(0, true);
            return;
        }

        if (isPlaying) {
            audio.pause();
            setPlayingState(false);
        } else {
            audio.play().then(function () {
                setPlayingState(true);
            }).catch(function (e) {
                console.log('Play blocked:', e.message);
            });
        }
    }

    function setPlayingState(playing) {
        isPlaying = playing;
        if (playIcon) playIcon.textContent = playing ? '▐▐' : '▶';

        if (player) {
            player.classList.toggle('playing', playing);
            player.classList.toggle('paused', !playing);
            if (!playing) player.classList.remove('playing');
        }
    }

    // ========== NEXT / PREV ==========
    function nextTrack() {
        var next;
        if (isShuffle) {
            next = Math.floor(Math.random() * playlist.length);
            while (next === currentTrack && playlist.length > 1) {
                next = Math.floor(Math.random() * playlist.length);
            }
        } else {
            next = currentTrack + 1;
            if (next >= playlist.length) {
                if (repeatMode >= 1) next = 0;
                else { setPlayingState(false); return; }
            }
        }
        loadTrack(next, true);
    }

    function prevTrack() {
        if (audio.currentTime > 3) {
            audio.currentTime = 0;
            return;
        }
        var prev = currentTrack - 1;
        if (prev < 0) prev = playlist.length - 1;
        loadTrack(prev, true);
    }

    // ========== TIME FORMAT ==========
    function formatTime(sec) {
        if (isNaN(sec) || !isFinite(sec)) return '0:00';
        var m = Math.floor(sec / 60);
        var s = Math.floor(sec % 60);
        return m + ':' + (s < 10 ? '0' : '') + s;
    }

    // ========== UPDATE PROGRESS ==========
    function updateProgress() {
        if (isSeeking) return;
        if (!audio.duration) return;

        var pct = (audio.currentTime / audio.duration) * 100;
        if (progressFill) progressFill.style.width = pct + '%';
        if (currentTimeEl) currentTimeEl.textContent = formatTime(audio.currentTime);
    }

    // ========== SEEK ==========
    function seekTo(e) {
        var rect = progressBar.getBoundingClientRect();
        var x = e.clientX - rect.left;
        var pct = Math.max(0, Math.min(1, x / rect.width));
        audio.currentTime = pct * audio.duration;
        if (progressFill) progressFill.style.width = (pct * 100) + '%';
    }

    // ========== VOLUME ==========
    function setVolume(e) {
        var rect = volumeBar.getBoundingClientRect();
        var x = e.clientX - rect.left;
        volume = Math.max(0, Math.min(1, x / rect.width));
        audio.volume = volume;
        updateVolumeUI();
        try { localStorage.setItem('kabut_music_vol', volume); } catch (ex) {}
    }

    function toggleMute() {
        if (audio.volume > 0) {
            audio._prevVol = audio.volume;
            audio.volume = 0;
            volume = 0;
        } else {
            volume = audio._prevVol || 0.8;
            audio.volume = volume;
        }
        updateVolumeUI();
    }

    function updateVolumeUI() {
        if (volumeFill) volumeFill.style.width = (volume * 100) + '%';
        if (volIcon) {
            if (volume === 0) volIcon.textContent = '🔇';
            else if (volume < 0.4) volIcon.textContent = '🔈';
            else if (volume < 0.7) volIcon.textContent = '🔉';
            else volIcon.textContent = '🔊';
        }
    }

    // ========== SHUFFLE / REPEAT ==========
    function toggleShuffle() {
        isShuffle = !isShuffle;
        if (shuffleBtn) shuffleBtn.classList.toggle('active', isShuffle);
    }

    function toggleRepeat() {
        repeatMode = (repeatMode + 1) % 3;
        if (repeatBtn) {
            repeatBtn.classList.toggle('active', repeatMode > 0);
            var span = repeatBtn.querySelector('span');
            if (span) {
                if (repeatMode === 0) span.textContent = '🔁';
                else if (repeatMode === 1) span.textContent = '🔁';
                else span.textContent = '🔂';
            }
        }
    }

    // ========== EVENT BINDINGS ==========
    function bindEvents() {

        // Toggle panel
        if (toggle) {
            toggle.addEventListener('click', function () {
                isPanelOpen = !isPanelOpen;
                if (panel) panel.classList.toggle('open', isPanelOpen);
            });
        }

        // Close panel when clicking outside
        document.addEventListener('click', function (e) {
            if (!player) return;
            if (!player.contains(e.target) && isPanelOpen) {
                isPanelOpen = false;
                if (panel) panel.classList.remove('open');
            }
        });

        // Play / Pause
        if (playBtn) playBtn.addEventListener('click', togglePlay);

        // Next / Prev
        if (nextBtn) nextBtn.addEventListener('click', nextTrack);
        if (prevBtn) prevBtn.addEventListener('click', prevTrack);

        // Audio events
        audio.addEventListener('timeupdate', updateProgress);

        audio.addEventListener('loadedmetadata', function () {
            if (durationEl) durationEl.textContent = formatTime(audio.duration);
        });

        audio.addEventListener('ended', function () {
            if (repeatMode === 2) {
                audio.currentTime = 0;
                audio.play();
            } else {
                nextTrack();
            }
        });

        audio.addEventListener('error', function () {
            console.warn('Music file not found:', playlist[currentTrack].src);
            if (songTitle) songTitle.textContent = '⚠ File tidak ditemukan';
        });

        // Progress seek
        if (progressBar) {
            progressBar.addEventListener('click', seekTo);

            progressBar.addEventListener('mousedown', function () { isSeeking = true; });
            document.addEventListener('mousemove', function (e) {
                if (isSeeking) seekTo(e);
            });
            document.addEventListener('mouseup', function () { isSeeking = false; });
        }

        // Volume
        if (volumeBar) volumeBar.addEventListener('click', setVolume);
        if (volBtn) volBtn.addEventListener('click', toggleMute);

        // Playlist toggle
        if (playlistToggle) {
            playlistToggle.addEventListener('click', function () {
                isPlaylistOpen = !isPlaylistOpen;
                if (playlistEl) playlistEl.classList.toggle('open', isPlaylistOpen);
            });
        }

        // Shuffle & Repeat
        if (shuffleBtn) shuffleBtn.addEventListener('click', toggleShuffle);
        if (repeatBtn) repeatBtn.addEventListener('click', toggleRepeat);

        // Keyboard: Space to play/pause (only when not typing)
        document.addEventListener('keydown', function (e) {
            if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') return;
            if (e.code === 'Space' && isPanelOpen) {
                e.preventDefault();
                togglePlay();
            }
        });
    }

    // ========== START ==========
    document.addEventListener('DOMContentLoaded', initPlayer);

})();

// ============================================================
// ZEN MODE / READING MODE
// ============================================================

(function () {

    var zenOverlay = null;
    var zenFontSize = 115; // percentage
    var isZenActive = false;
    var isSettingsOpen = false;

    // ========== CREATE ZEN MODE OVERLAY ==========
    function createZenOverlay() {
        if (zenOverlay) return;

        zenOverlay = document.createElement('div');
        zenOverlay.className = 'zen-mode-overlay';
        zenOverlay.id = 'zen-mode-overlay';

        zenOverlay.innerHTML = 
            // Progress bar
            '<div class="zen-progress"><div class="zen-progress-fill" id="zen-progress-fill"></div></div>' +

            // Exit button
            '<button class="zen-exit-btn" id="zen-exit-btn" title="Keluar Zen Mode">✕</button>' +

            // Container
            '<div class="zen-container">' +
                '<div class="zen-header">' +
                    '<span class="zen-part-label" id="zen-part-label"></span>' +
                    '<span class="zen-chapter-num" id="zen-chapter-num"></span>' +
                    '<h1 class="zen-title" id="zen-title"></h1>' +
                '</div>' +
                '<div class="zen-content" id="zen-content"></div>' +
            '</div>' +

            // Settings panel
            '<div class="zen-settings" id="zen-settings">' +
                '<h4 class="zen-settings-title">Pengaturan</h4>' +
                '<div class="zen-setting-row">' +
                    '<span class="zen-setting-label">Ukuran Font</span>' +
                    '<div class="zen-font-controls">' +
                        '<button class="zen-font-btn" id="zen-font-decrease">A-</button>' +
                        '<span class="zen-font-size" id="zen-font-display">115%</span>' +
                        '<button class="zen-font-btn" id="zen-font-increase">A+</button>' +
                    '</div>' +
                '</div>' +
                '<div class="zen-setting-row">' +
                    '<span class="zen-setting-label">Tema</span>' +
                    '<button class="zen-theme-toggle" id="zen-theme-toggle">🌙 / ☀️</button>' +
                '</div>' +
            '</div>' +

            // Bottom controls
            '<div class="zen-controls">' +
                '<button class="zen-ctrl-btn" id="zen-prev-chapter">' +
                    '<span>←</span> Sebelumnya' +
                '</button>' +
                '<button class="zen-ctrl-btn" id="zen-settings-btn">' +
                    '<span>⚙️</span> Pengaturan' +
                '</button>' +
                '<button class="zen-ctrl-btn primary" id="zen-next-chapter">' +
                    'Selanjutnya <span>→</span>' +
                '</button>' +
            '</div>';

        document.body.appendChild(zenOverlay);
        bindZenEvents();
    }

    // ========== OPEN ZEN MODE ==========
    function openZenMode() {
        createZenOverlay();

        // Get current chapter content
        var partLabel = document.getElementById('chapter-part-label');
        var chapterNum = document.getElementById('chapter-number');
        var chapterTitle = document.getElementById('chapter-title');
        var chapterContent = document.getElementById('chapter-content');

        if (!chapterContent) return;

        // Copy content to zen mode
        document.getElementById('zen-part-label').textContent = partLabel ? partLabel.textContent : '';
        document.getElementById('zen-chapter-num').textContent = chapterNum ? chapterNum.textContent : '';
        document.getElementById('zen-title').textContent = chapterTitle ? chapterTitle.textContent : '';
        document.getElementById('zen-content').innerHTML = chapterContent.innerHTML;

        // Apply font size
        applyZenFontSize();

        // Show overlay
        zenOverlay.classList.add('active');
        document.body.classList.add('zen-active');
        isZenActive = true;

        // Reset scroll
        zenOverlay.scrollTop = 0;

        // Update progress
        updateZenProgress();
    }

    // ========== CLOSE ZEN MODE ==========
    function closeZenMode() {
        if (!zenOverlay) return;

        zenOverlay.classList.remove('active');
        document.body.classList.remove('zen-active');
        isZenActive = false;
        isSettingsOpen = false;

        var settings = document.getElementById('zen-settings');
        if (settings) settings.classList.remove('open');
    }

    // ========== FONT SIZE ==========
    function applyZenFontSize() {
        var content = document.getElementById('zen-content');
        var display = document.getElementById('zen-font-display');

        if (content) content.style.fontSize = zenFontSize + '%';
        if (display) display.textContent = zenFontSize + '%';

        try { localStorage.setItem('kabut_zen_fontsize', zenFontSize); } catch (e) {}
    }

    function changeZenFontSize(delta) {
        zenFontSize = Math.max(80, Math.min(160, zenFontSize + delta));
        applyZenFontSize();
    }

    // ========== PROGRESS ==========
    function updateZenProgress() {
        if (!zenOverlay || !isZenActive) return;

        var scrollTop = zenOverlay.scrollTop;
        var scrollHeight = zenOverlay.scrollHeight - zenOverlay.clientHeight;
        var progress = scrollHeight > 0 ? (scrollTop / scrollHeight) * 100 : 0;

        var fill = document.getElementById('zen-progress-fill');
        if (fill) fill.style.width = progress + '%';
    }

    // ========== TOGGLE SETTINGS ==========
    function toggleZenSettings() {
        var settings = document.getElementById('zen-settings');
        if (!settings) return;

        isSettingsOpen = !isSettingsOpen;
        settings.classList.toggle('open', isSettingsOpen);
    }

    // ========== CHAPTER NAVIGATION ==========
    function zenPrevChapter() {
        closeZenMode();
        var prevBtn = document.getElementById('btn-prev-chapter');
        if (prevBtn && !prevBtn.disabled) {
            prevBtn.click();
            setTimeout(function () { openZenMode(); }, 500);
        }
    }

    function zenNextChapter() {
        closeZenMode();
        var nextBtn = document.getElementById('btn-next-chapter');
        if (nextBtn && !nextBtn.disabled) {
            nextBtn.click();
            setTimeout(function () { openZenMode(); }, 500);
        }
    }

    // ========== THEME TOGGLE ==========
    function zenToggleTheme() {
        var currentTheme = document.documentElement.getAttribute('data-theme') || 'light';
        var newTheme = currentTheme === 'dark' ? 'light' : 'dark';
        document.documentElement.setAttribute('data-theme', newTheme);

        // Update main theme icon if exists
        var themeIcon = document.getElementById('theme-icon');
        if (themeIcon) themeIcon.textContent = newTheme === 'dark' ? '☀' : '🌙';

        try { localStorage.setItem('kabut_theme', newTheme); } catch (e) {}
    }

    // ========== BIND EVENTS ==========
    function bindZenEvents() {
        // Exit button
        var exitBtn = document.getElementById('zen-exit-btn');
        if (exitBtn) exitBtn.addEventListener('click', closeZenMode);

        // Settings toggle
        var settingsBtn = document.getElementById('zen-settings-btn');
        if (settingsBtn) settingsBtn.addEventListener('click', toggleZenSettings);

        // Font size
        var fontInc = document.getElementById('zen-font-increase');
        var fontDec = document.getElementById('zen-font-decrease');
        if (fontInc) fontInc.addEventListener('click', function () { changeZenFontSize(10); });
        if (fontDec) fontDec.addEventListener('click', function () { changeZenFontSize(-10); });

        // Theme toggle
        var themeToggle = document.getElementById('zen-theme-toggle');
        if (themeToggle) themeToggle.addEventListener('click', zenToggleTheme);

        // Chapter navigation
        var prevBtn = document.getElementById('zen-prev-chapter');
        var nextBtn = document.getElementById('zen-next-chapter');
        if (prevBtn) prevBtn.addEventListener('click', zenPrevChapter);
        if (nextBtn) nextBtn.addEventListener('click', zenNextChapter);

        // Scroll progress
        zenOverlay.addEventListener('scroll', updateZenProgress);

        // ESC key to close
        document.addEventListener('keydown', function (e) {
            if (e.key === 'Escape' && isZenActive) {
                closeZenMode();
            }
        });

        // Click outside settings to close
        zenOverlay.addEventListener('click', function (e) {
            var settings = document.getElementById('zen-settings');
            var settingsBtn = document.getElementById('zen-settings-btn');
            if (isSettingsOpen && settings && !settings.contains(e.target) && e.target !== settingsBtn) {
                isSettingsOpen = false;
                settings.classList.remove('open');
            }
        });
    }

    // ========== LOAD SAVED FONT SIZE ==========
    function loadZenSettings() {
        try {
            var saved = parseInt(localStorage.getItem('kabut_zen_fontsize'));
            if (!isNaN(saved) && saved >= 80 && saved <= 160) {
                zenFontSize = saved;
            }
        } catch (e) {}
    }

    // ========== INIT ==========
    document.addEventListener('DOMContentLoaded', function () {
        loadZenSettings();

        // Bind zen mode button
        var zenBtn = document.getElementById('btn-zen-mode');
        if (zenBtn) {
            zenBtn.addEventListener('click', openZenMode);
        }
    });

    // Expose for external use
    window.openZenMode = openZenMode;
    window.closeZenMode = closeZenMode;

})();
// ============================================================
// FONT PICKER
// ============================================================

(function () {

    // ========== DEFAULT SETTINGS ==========
    var defaults = {
        font: 'serif',
        size: 18,
        line: 'normal',
        width: 'normal',
        align: 'justify'
    };

    // ========== STATE ==========
    var settings = {};

    // ========== DOM ==========
    var btnOpen = null;
    var panel = null;
    var overlay = null;
    var btnClose = null;
    var btnReset = null;
    var sizeSlider = null;
    var sizeValue = null;
    var sizeDecrease = null;
    var sizeIncrease = null;
    var previewBox = null;
    var readerSection = null;
    var chapterContent = null;

    // ========== LOAD SETTINGS ==========
    function loadSettings() {
        try {
            var saved = JSON.parse(localStorage.getItem('kabut_font_settings'));
            if (saved) {
                settings = {
                    font: saved.font || defaults.font,
                    size: saved.size || defaults.size,
                    line: saved.line || defaults.line,
                    width: saved.width || defaults.width,
                    align: saved.align || defaults.align
                };
            } else {
                settings = Object.assign({}, defaults);
            }
        } catch (e) {
            settings = Object.assign({}, defaults);
        }
    }

    // ========== SAVE SETTINGS ==========
    function saveSettings() {
        try {
            localStorage.setItem('kabut_font_settings', JSON.stringify(settings));
        } catch (e) {}
    }

    // ========== APPLY SETTINGS ==========
    function applySettings() {
        readerSection = document.getElementById('reader-section');
        chapterContent = document.getElementById('chapter-content');

        if (!readerSection) return;

        // Remove old classes
        var removeClasses = [];
        readerSection.classList.forEach(function (cls) {
            if (cls.startsWith('reader-font-') || 
                cls.startsWith('reader-line-') || 
                cls.startsWith('reader-width-') || 
                cls.startsWith('reader-align-')) {
                removeClasses.push(cls);
            }
        });
        removeClasses.forEach(function (cls) {
            readerSection.classList.remove(cls);
        });

        // Apply new classes
        readerSection.classList.add('reader-font-' + settings.font);
        readerSection.classList.add('reader-line-' + settings.line);
        readerSection.classList.add('reader-width-' + settings.width);
        readerSection.classList.add('reader-align-' + settings.align);

        // Apply font size
        document.documentElement.style.setProperty('--font-size-base', settings.size + 'px');
        if (chapterContent) {
            chapterContent.style.fontSize = settings.size + 'px';
        }

        // Update preview
        updatePreview();

        // Update active buttons
        updateActiveStates();
    }

    // ========== UPDATE PREVIEW ==========
    function updatePreview() {
        if (!previewBox) return;

        var p = previewBox.querySelector('p');
        if (!p) return;

        // Font family
        switch (settings.font) {
            case 'serif': p.style.fontFamily = "'Lora', Georgia, serif"; break;
            case 'sans': p.style.fontFamily = "'Inter', -apple-system, sans-serif"; break;
            case 'mono': p.style.fontFamily = "'Courier New', monospace"; break;
        }

        // Size (scaled down for preview)
        p.style.fontSize = (settings.size * 0.85) + 'px';

        // Line height
        switch (settings.line) {
            case 'compact': p.style.lineHeight = '1.6'; break;
            case 'normal': p.style.lineHeight = '1.9'; break;
            case 'relaxed': p.style.lineHeight = '2.3'; break;
        }

        // Align
        p.style.textAlign = settings.align === 'justify' ? 'justify' : 'left';
    }

    // ========== UPDATE ACTIVE STATES ==========
    function updateActiveStates() {
        // Font buttons
        document.querySelectorAll('.fp-font-btn').forEach(function (btn) {
            btn.classList.toggle('active', btn.getAttribute('data-font') === settings.font);
        });

        // Line buttons
        document.querySelectorAll('.fp-line-btn').forEach(function (btn) {
            btn.classList.toggle('active', btn.getAttribute('data-line') === settings.line);
        });

        // Width buttons
        document.querySelectorAll('.fp-width-btn').forEach(function (btn) {
            btn.classList.toggle('active', btn.getAttribute('data-width') === settings.width);
        });

        // Align buttons
        document.querySelectorAll('.fp-align-btn').forEach(function (btn) {
            btn.classList.toggle('active', btn.getAttribute('data-align') === settings.align);
        });

        // Size slider
        if (sizeSlider) sizeSlider.value = settings.size;
        if (sizeValue) sizeValue.textContent = settings.size + 'px';
    }

    // ========== OPEN / CLOSE ==========
    function openPanel() {
        if (panel) panel.classList.add('open');
        if (overlay) overlay.classList.add('open');
        document.body.style.overflow = 'hidden';
    }

    function closePanel() {
        if (panel) panel.classList.remove('open');
        if (overlay) overlay.classList.remove('open');
        document.body.style.overflow = '';
    }

    // ========== RESET ==========
    function resetSettings() {
        settings = Object.assign({}, defaults);
        saveSettings();
        applySettings();
        updateActiveStates();
    }

    // ========== BIND EVENTS ==========
    function bindEvents() {
        // Open
        if (btnOpen) btnOpen.addEventListener('click', openPanel);

        // Close
        if (btnClose) btnClose.addEventListener('click', closePanel);
        if (overlay) overlay.addEventListener('click', closePanel);

        // ESC key
        document.addEventListener('keydown', function (e) {
            if (e.key === 'Escape' && panel && panel.classList.contains('open')) {
                closePanel();
            }
        });

        // Font family
        document.querySelectorAll('.fp-font-btn').forEach(function (btn) {
            btn.addEventListener('click', function () {
                settings.font = this.getAttribute('data-font');
                saveSettings();
                applySettings();
            });
        });

        // Font size slider
        if (sizeSlider) {
            sizeSlider.addEventListener('input', function () {
                settings.size = parseInt(this.value);
                saveSettings();
                applySettings();
            });
        }

        // Font size buttons
        if (sizeDecrease) {
            sizeDecrease.addEventListener('click', function () {
                settings.size = Math.max(14, settings.size - 1);
                saveSettings();
                applySettings();
            });
        }

        if (sizeIncrease) {
            sizeIncrease.addEventListener('click', function () {
                settings.size = Math.min(26, settings.size + 1);
                saveSettings();
                applySettings();
            });
        }

        // Line height
        document.querySelectorAll('.fp-line-btn').forEach(function (btn) {
            btn.addEventListener('click', function () {
                settings.line = this.getAttribute('data-line');
                saveSettings();
                applySettings();
            });
        });

        // Text width
        document.querySelectorAll('.fp-width-btn').forEach(function (btn) {
            btn.addEventListener('click', function () {
                settings.width = this.getAttribute('data-width');
                saveSettings();
                applySettings();
            });
        });

        // Text align
        document.querySelectorAll('.fp-align-btn').forEach(function (btn) {
            btn.addEventListener('click', function () {
                settings.align = this.getAttribute('data-align');
                saveSettings();
                applySettings();
            });
        });

        // Reset
        if (btnReset) btnReset.addEventListener('click', resetSettings);
    }

    // ========== INIT ==========
    function init() {
        btnOpen = document.getElementById('btn-font-picker');
        panel = document.getElementById('font-picker-panel');
        overlay = document.getElementById('font-picker-overlay');
        btnClose = document.getElementById('fp-close');
        btnReset = document.getElementById('fp-reset');
        sizeSlider = document.getElementById('fp-size-slider');
        sizeValue = document.getElementById('fp-size-value');
        sizeDecrease = document.getElementById('fp-size-decrease');
        sizeIncrease = document.getElementById('fp-size-increase');
        previewBox = document.getElementById('fp-preview-box');

        if (!panel) return;

        loadSettings();
        applySettings();
        bindEvents();
    }

    // ========== START ==========
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

})();
// ============================================================
// GLOSSARY — Glosarium Istilah Novel
// ============================================================

(function () {

    // ★★★ DATA GLOSARIUM ★★★
    var glossaryData = [
        // === BAHASA PORTUGIS ===
        {
            word: "Saudade",
            pronounce: "/saw-DAH-deh/",
            category: "bahasa",
            definition: "Perasaan rindu yang mendalam terhadap sesuatu atau seseorang yang hilang. Bukan sekadar rindu — tapi rindu yang bercampur dengan kesadaran bahwa apa yang dirindukan mungkin tidak akan pernah kembali.",
            context: "\"Saudade bukan soal kehilangan. Saudade adalah soal mencintai sesuatu yang sudah tidak ada, dan tetap mencintainya.\"",
            chapter: "Muncul pertama di Chapter 3"
        },
        {
            word: "Obrigado / Obrigada",
            pronounce: "/oh-bree-GAH-doo/",
            category: "bahasa",
            definition: "Terima kasih dalam bahasa Portugis. 'Obrigado' diucapkan oleh laki-laki, 'Obrigada' oleh perempuan.",
            context: "",
            chapter: "Digunakan sepanjang novel"
        },
        {
            word: "Desculpe",
            pronounce: "/desh-KOOL-peh/",
            category: "bahasa",
            definition: "Maaf / permisi dalam bahasa Portugis. Kata pertama yang Arka pelajari sebelum tiba di Porto.",
            context: "\"Desculpe,\" kata Arka. Satu-satunya kata Portugis yang dia hapal dari buku panduan murahan.",
            chapter: "Chapter 1"
        },
        {
            word: "Boa noite",
            pronounce: "/BOH-ah NOY-teh/",
            category: "bahasa",
            definition: "Selamat malam dalam bahasa Portugis.",
            context: "",
            chapter: "Chapter 6"
        },
        {
            word: "Amor",
            pronounce: "/ah-MOR/",
            category: "bahasa",
            definition: "Cinta dalam bahasa Portugis.",
            context: "",
            chapter: "Chapter 5"
        },
        {
            word: "Mentira",
            pronounce: "/men-TEE-rah/",
            category: "bahasa",
            definition: "Kebohongan dalam bahasa Portugis. Salah satu kata kunci dalam misteri novel ini.",
            context: "",
            chapter: "Chapter 13"
        },
        {
            word: "Verdade",
            pronounce: "/ver-DAH-deh/",
            category: "bahasa",
            definition: "Kebenaran dalam bahasa Portugis. Berlawanan dengan 'mentira'.",
            context: "",
            chapter: "Chapter 13"
        },

        // === TEMPAT ===
        {
            word: "Porto",
            pronounce: "/POR-too/",
            category: "tempat",
            definition: "Kota tua di utara Portugal, di tepi Sungai Douro. Terkenal dengan port wine, jembatan besi Dom Luís I, dan distrik bersejarah Ribeira. Tempat Arka belajar seni dan bertemu Inês.",
            context: "\"Porto. Kota tua di mulut Sungai Douro. Kota yang lahir dari anggur dan pelabuhan.\"",
            chapter: "Bagian 1 (Chapter 1-7)"
        },
        {
            word: "Ribeira",
            pronounce: "/ree-BAY-rah/",
            category: "tempat",
            definition: "Distrik bersejarah di tepi Sungai Douro, Porto. Situs Warisan Dunia UNESCO. Penuh dengan bangunan warna-warni, kafe, dan galeri seni. Tempat galeri Inês berada.",
            context: "",
            chapter: "Chapter 2, 6"
        },
        {
            word: "Sungai Douro",
            pronounce: "/DOO-roo/",
            category: "tempat",
            definition: "Sungai utama yang mengalir melalui Porto menuju Samudra Atlantik. Arka sering berjalan malam di sepanjang tepiannya.",
            context: "\"Punya kebiasaan jalan kaki malam-malam di sepanjang tepian Sungai Douro sambil ngerokok kretek.\"",
            chapter: "Chapter 1, 6, 15"
        },
        {
            word: "Sintra",
            pronounce: "/SEEN-trah/",
            category: "tempat",
            definition: "Kota kecil berkabut di atas bukit, sekitar 30 km dari Lisboa. Penuh kastil, istana, dan hutan pinus yang misterius. Tempat kelahiran Inês dan tempat Helena tinggal.",
            context: "",
            chapter: "Bagian 2 (Chapter 8-11)"
        },
        {
            word: "Lisboa / Lisbon",
            pronounce: "/leezh-BOH-ah/",
            category: "tempat",
            definition: "Ibukota Portugal. Kota yang hidup dengan trem kuning, musik fado, dan tujuh bukit. Tempat Rafael muncul dan konfrontasi terjadi.",
            context: "",
            chapter: "Bagian 3 (Chapter 12-18)"
        },
        {
            word: "Bruges",
            pronounce: "/BROOZH/",
            category: "tempat",
            definition: "Kota kecil di Belgia yang dijuluki 'Venice of the North'. Penuh kanal, jembatan batu, dan ketenangan. Tempat pengungkapan misteri besar di akhir cerita.",
            context: "",
            chapter: "Bagian 4 (Chapter 19-23)"
        },
        {
            word: "Estação de São Bento",
            pronounce: "/esh-tah-SOWNG deh sowng BEN-too/",
            category: "tempat",
            definition: "Stasiun kereta utama di Porto, terkenal dengan dinding interior yang dihiasi ubin azulejo biru-putih yang menggambarkan sejarah Portugal.",
            context: "\"Arka berdiri di depan Estação de São Bento dengan ransel besar di punggung.\"",
            chapter: "Chapter 1"
        },

        // === BUDAYA ===
        {
            word: "Fado",
            pronounce: "/FAH-doo/",
            category: "budaya",
            definition: "Genre musik tradisional Portugal yang penuh melankoli dan kerinduan. Biasanya diiringi gitar Portugis. Sering dinyanyikan di kafe-kafe kecil di Lisboa dan Porto. Mengekspresikan saudade.",
            context: "",
            chapter: "Chapter 6"
        },
        {
            word: "Azulejo",
            pronounce: "/ah-zoo-LAY-zhoo/",
            category: "budaya",
            definition: "Ubin keramik dekoratif khas Portugal, biasanya berwarna biru dan putih. Menghiasi fasad bangunan, gereja, dan stasiun kereta di seluruh Portugal.",
            context: "",
            chapter: "Chapter 1"
        },
        {
            word: "Port Wine",
            pronounce: "/port wayn/",
            category: "budaya",
            definition: "Anggur manis khas Porto, Portugal. Diproduksi di lembah Douro dan disimpan di gudang-gudang di Vila Nova de Gaia, seberang sungai dari Porto. Simbol kota ini.",
            context: "",
            chapter: "Chapter 3"
        },
        {
            word: "Dom Luís I",
            pronounce: "/dong loo-EESH/",
            category: "budaya",
            definition: "Jembatan besi ikonik di Porto yang dirancang oleh murid Gustave Eiffel. Menghubungkan Porto dengan Vila Nova de Gaia melintasi Sungai Douro.",
            context: "",
            chapter: "Chapter 1, 6"
        },
        {
            word: "Kretek",
            pronounce: "/KREH-tek/",
            category: "budaya",
            definition: "Rokok cengkeh khas Indonesia. Arka membawa satu slop Gudang Garam Surya dari Bandung — satu-satunya koneksi fisiknya dengan rumah.",
            context: "\"Dia menyalakan sebatang kretek. Gudang Garam Surya, yang dia bawa satu slop penuh dari Bandung.\"",
            chapter: "Chapter 1, 15"
        },

        // === KULINER ===
        {
            word: "Pastel de Nata",
            pronounce: "/pash-TEL deh NAH-tah/",
            category: "makanan",
            definition: "Kue tart telur khas Portugal dengan kulit pastry yang renyah dan isian custard yang creamy. Biasanya ditaburi kayu manis dan gula bubuk.",
            context: "",
            chapter: "Chapter 3"
        },
        {
            word: "Francesinha",
            pronounce: "/fran-seh-SEEN-yah/",
            category: "makanan",
            definition: "Sandwich khas Porto yang berisi daging, sosis, dan ham, ditutup keju leleh dan saus tomat-bir pedas. Makanan ikonik Porto.",
            context: "",
            chapter: "Chapter 4"
        },
        {
            word: "Bacalhau",
            pronounce: "/bah-kah-LYOW/",
            category: "makanan",
            definition: "Ikan cod kering asin, makanan nasional Portugal. Konon ada 365 cara memasak bacalhau — satu untuk setiap hari dalam setahun.",
            context: "",
            chapter: "Chapter 6"
        },
        {
            word: "Vinho Verde",
            pronounce: "/VEEN-yoo VER-deh/",
            category: "makanan",
            definition: "Anggur muda khas Portugal utara, sedikit bersoda, ringan dan segar. 'Verde' berarti hijau/muda, merujuk pada usia anggurnya.",
            context: "",
            chapter: "Chapter 3"
        },

        // === KARAKTER ===
        {
            word: "Anting Bulan Sabit",
            pronounce: "",
            category: "karakter",
            definition: "Anting perak kecil berbentuk bulan sabit yang selalu dipakai Inês. Detail kecil yang ternyata menyimpan signifikansi besar dalam misteri novel.",
            context: "\"Rambut gelap, selalu pakai anting perak kecil berbentuk bulan sabit.\"",
            chapter: "Chapter 5"
        },
        {
            word: "Álvaro Mendes",
            pronounce: "/AL-vah-roo MEN-desh/",
            category: "karakter",
            definition: "Seniman terkenal Portugal yang menghilang secara misterius tujuh tahun sebelum cerita dimulai (1993). Lukisan-lukisannya menyimpan pesan tersembunyi yang menjadi kunci seluruh misteri.",
            context: "",
            chapter: "Chapter 11, 21"
        },
        {
            word: "Universidade do Porto",
            pronounce: "/oo-nee-ver-see-DAH-deh doo POR-too/",
            category: "karakter",
            definition: "Universitas tempat Arka belajar seni rupa. Salah satu universitas tertua dan terbaik di Portugal.",
            context: "",
            chapter: "Chapter 1"
        }
    ];

    // ========== STATE ==========
    var isOpen = false;
    var currentFilter = 'all';
    var searchQuery = '';

    // ========== DOM ==========
    var btnOpen = null;
    var panelEl = null;
    var overlayEl = null;
    var btnClose = null;
    var searchInput = null;
    var searchClear = null;
    var listEl = null;
    var countEl = null;

    // ========== OPEN / CLOSE ==========
    function openGlossary() {
        if (panelEl) panelEl.classList.add('open');
        if (overlayEl) overlayEl.classList.add('open');
        document.body.style.overflow = 'hidden';
        isOpen = true;

        // Focus search
        setTimeout(function () {
            if (searchInput) searchInput.focus();
        }, 400);
    }

    function closeGlossary() {
        if (panelEl) panelEl.classList.remove('open');
        if (overlayEl) overlayEl.classList.remove('open');
        document.body.style.overflow = '';
        isOpen = false;
    }

    // ========== RENDER LIST ==========
    function renderList() {
        if (!listEl) return;

        // Filter data
        var filtered = glossaryData.filter(function (item) {
            // Category filter
            if (currentFilter !== 'all' && item.category !== currentFilter) return false;

            // Search filter
            if (searchQuery) {
                var q = searchQuery.toLowerCase();
                return (
                    item.word.toLowerCase().indexOf(q) !== -1 ||
                    item.definition.toLowerCase().indexOf(q) !== -1 ||
                    item.category.toLowerCase().indexOf(q) !== -1
                );
            }

            return true;
        });

        // Sort alphabetically
        filtered.sort(function (a, b) {
            return a.word.localeCompare(b.word);
        });

        // Update count
        if (countEl) {
            countEl.textContent = filtered.length + ' istilah';
        }

        // No results
        if (filtered.length === 0) {
            listEl.innerHTML =
                '<div class="glossary-no-results">' +
                    '<span class="glossary-no-results-icon">🔍</span>' +
                    '<p class="glossary-no-results-text">Tidak ada istilah yang cocok</p>' +
                '</div>';
            return;
        }

        // Group by letter
        var groups = {};
        filtered.forEach(function (item) {
            var letter = item.word.charAt(0).toUpperCase();
            // Handle special characters
            if (letter === 'Á' || letter === 'À' || letter === 'Ã') letter = 'A';
            if (!groups[letter]) groups[letter] = [];
            groups[letter].push(item);
        });

        // Build HTML
        var html = '';
        var letters = Object.keys(groups).sort();

        letters.forEach(function (letter) {
            html += '<div class="glossary-letter-group">';
            html += '<h3 class="glossary-letter">' + letter + '</h3>';

            groups[letter].forEach(function (item, idx) {
                var id = 'glossary-' + letter + '-' + idx;
                var categoryLabels = {
                    bahasa: 'Bahasa',
                    tempat: 'Tempat',
                    budaya: 'Budaya',
                    makanan: 'Kuliner',
                    karakter: 'Karakter'
                };

                html += '<div class="glossary-item" data-id="' + id + '">';

                // Header
                html += '<div class="glossary-item-header">';
                html += '<span class="glossary-item-word">' + item.word + '</span>';
                html += '<span class="glossary-item-category">' + (categoryLabels[item.category] || item.category) + '</span>';
                html += '</div>';

                // Pronunciation
                if (item.pronounce) {
                    html += '<span class="glossary-item-pronounce">' + item.pronounce + '</span>';
                }

                // Definition
                html += '<p class="glossary-item-def">' + item.definition + '</p>';

                // Expandable detail
                if (item.context || item.chapter) {
                    html += '<div class="glossary-item-detail">';
                    if (item.context) {
                        html += '<p class="glossary-item-context">' + item.context + '</p>';
                    }
                    if (item.chapter) {
                        html += '<span class="glossary-item-chapter">📍 ' + item.chapter + '</span>';
                    }
                    html += '</div>';
                }

                html += '</div>';
            });

            html += '</div>';
        });

        listEl.innerHTML = html;

        // Bind click to expand
        listEl.querySelectorAll('.glossary-item').forEach(function (item) {
            item.addEventListener('click', function () {
                // Close others
                listEl.querySelectorAll('.glossary-item.expanded').forEach(function (other) {
                    if (other !== item) other.classList.remove('expanded');
                });
                item.classList.toggle('expanded');
            });
        });
    }

    // ========== BIND EVENTS ==========
    function bindEvents() {
        // Open button
        if (btnOpen) btnOpen.addEventListener('click', openGlossary);

        // Close
        if (btnClose) btnClose.addEventListener('click', closeGlossary);
        if (overlayEl) overlayEl.addEventListener('click', closeGlossary);

        // ESC
        document.addEventListener('keydown', function (e) {
            if (e.key === 'Escape' && isOpen) closeGlossary();
        });

        // Search
        if (searchInput) {
            searchInput.addEventListener('input', function () {
                searchQuery = this.value.trim();
                if (searchClear) {
                    searchClear.classList.toggle('visible', searchQuery.length > 0);
                }
                renderList();
            });
        }

        // Search clear
        if (searchClear) {
            searchClear.addEventListener('click', function () {
                if (searchInput) searchInput.value = '';
                searchQuery = '';
                this.classList.remove('visible');
                renderList();
                if (searchInput) searchInput.focus();
            });
        }

        // Category filters
        document.querySelectorAll('.glossary-filter-btn').forEach(function (btn) {
            btn.addEventListener('click', function () {
                currentFilter = this.getAttribute('data-category');

                document.querySelectorAll('.glossary-filter-btn').forEach(function (b) {
                    b.classList.remove('active');
                });
                this.classList.add('active');

                renderList();
            });
        });
    }

    // ========== INIT ==========
    function init() {
        btnOpen = document.getElementById('btn-glossary');
        panelEl = document.getElementById('glossary-panel');
        overlayEl = document.getElementById('glossary-overlay');
        btnClose = document.getElementById('glossary-close');
        searchInput = document.getElementById('glossary-search');
        searchClear = document.getElementById('glossary-search-clear');
        listEl = document.getElementById('glossary-list');
        countEl = document.getElementById('glossary-count');

        if (!panelEl) return;

        renderList();
        bindEvents();
    }

    // ========== START ==========
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

})();

// ============================================================
// READING STATISTICS
// ============================================================

(function () {

    // ========== STORAGE KEY ==========
    var STORAGE_KEY = 'kabut_reading_stats';

    // ========== DEFAULT DATA ==========
    function getDefaultStats() {
        return {
            chaptersRead: {},       // { "1": { time: 300, date: "2025-06-29", words: 2000 } }
            dailyMinutes: {},       // { "2025-06-29": 15 }
            totalSeconds: 0,
            currentStreak: 0,
            bestStreak: 0,
            lastReadDate: null,
            sessionStart: null
        };
    }

    // ========== STATE ==========
    var stats = getDefaultStats();
    var sessionTimer = null;
    var sessionSeconds = 0;
    var currentReadingChapter = null;
    var isOpen = false;

    // Chapter word counts (approximate)
    var chapterWords = {
        1: 2000, 2: 2200, 3: 1800, 4: 2100, 5: 1900,
        6: 2300, 7: 1700, 8: 2400, 9: 2000, 10: 2100,
        11: 1800, 12: 2200, 13: 2500, 14: 1900, 15: 2000,
        16: 2100, 17: 2300, 18: 1800, 19: 2000, 20: 2200,
        21: 2400, 22: 2100, 23: 2500
    };

    var chapterTitles = {
        1: "Sungai yang Tidak Pernah Diam", 2: "Perempuan di Balik Kanvas",
        3: "Port Wine dan Percakapan yang Belum Selesai", 4: "Warna yang Tidak Bisa Dinamai",
        5: "Anting Bulan Sabit", 6: "Malam-Malam di Ribeira",
        7: "Surat dari Amsterdam", 8: "Rumah di Ujung Hutan",
        9: "Helena", 10: "Lukisan yang Seharusnya Tidak Ada",
        11: "Álvaro", 12: "Orang Asing dari Lisboa",
        13: "Dua Versi Kebenaran", 14: "Retak",
        15: "Kretek Terakhir di Tepi Douro", 16: "Kabut Sintra",
        17: "Konfrontasi", 18: "Yang Tidak Dikatakan Sari",
        19: "Kereta ke Utara", 20: "Bruges",
        21: "Lukisan Terakhir Álvaro Mendes", 22: "Pilihan",
        23: "Epilog — Pelabuhan Lama"
    };

    // ========== DOM ==========
    var btnOpen = null;
    var panelEl = null;
    var overlayEl = null;
    var btnClose = null;
    var btnReset = null;

    // ========== LOAD / SAVE ==========
    function loadStats() {
        try {
            var saved = JSON.parse(localStorage.getItem(STORAGE_KEY));
            if (saved) {
                stats = Object.assign(getDefaultStats(), saved);
            }
        } catch (e) {
            stats = getDefaultStats();
        }
    }

    function saveStats() {
        try {
            localStorage.setItem(STORAGE_KEY, JSON.stringify(stats));
        } catch (e) {}
    }

    // ========== DATE UTILS ==========
    function getToday() {
        var d = new Date();
        return d.getFullYear() + '-' +
            String(d.getMonth() + 1).padStart(2, '0') + '-' +
            String(d.getDate()).padStart(2, '0');
    }

    function getDayName(dateStr) {
        var days = ['Min', 'Sen', 'Sel', 'Rab', 'Kam', 'Jum', 'Sab'];
        var d = new Date(dateStr);
        return days[d.getDay()];
    }

    function formatMinutes(totalSeconds) {
        var mins = Math.floor(totalSeconds / 60);
        if (mins < 60) return mins + 'm';
        var hours = Math.floor(mins / 60);
        var remainMins = mins % 60;
        if (remainMins === 0) return hours + 'j';
        return hours + 'j ' + remainMins + 'm';
    }

    // ========== STREAK CALCULATION ==========
    function updateStreak() {
        var today = getToday();

        if (!stats.lastReadDate) {
            stats.currentStreak = 1;
            stats.bestStreak = 1;
            stats.lastReadDate = today;
            return;
        }

        if (stats.lastReadDate === today) return;

        var lastDate = new Date(stats.lastReadDate);
        var todayDate = new Date(today);
        var diffDays = Math.floor((todayDate - lastDate) / 86400000);

        if (diffDays === 1) {
            stats.currentStreak++;
        } else if (diffDays > 1) {
            stats.currentStreak = 1;
        }

        if (stats.currentStreak > stats.bestStreak) {
            stats.bestStreak = stats.currentStreak;
        }

        stats.lastReadDate = today;
    }

    // ========== TRACKING ==========
    function startTracking(chapterNum) {
        currentReadingChapter = chapterNum;
        sessionSeconds = 0;

        if (sessionTimer) clearInterval(sessionTimer);

        sessionTimer = setInterval(function () {
            sessionSeconds++;
            stats.totalSeconds++;

            // Update daily minutes
            var today = getToday();
            if (!stats.dailyMinutes[today]) stats.dailyMinutes[today] = 0;

            // Add 1 second worth of minutes every 60 seconds
            if (sessionSeconds % 60 === 0) {
                stats.dailyMinutes[today]++;
            }

            // Save every 30 seconds
            if (sessionSeconds % 30 === 0) {
                saveStats();
            }
        }, 1000);

        // Update streak
        updateStreak();

        // Mark chapter as read
        if (!stats.chaptersRead[chapterNum]) {
            stats.chaptersRead[chapterNum] = {
                time: 0,
                date: getToday(),
                words: chapterWords[chapterNum] || 2000
            };
        }

        saveStats();
    }

    function stopTracking() {
        if (sessionTimer) {
            clearInterval(sessionTimer);
            sessionTimer = null;
        }

        // Save reading time for current chapter
        if (currentReadingChapter && stats.chaptersRead[currentReadingChapter]) {
            stats.chaptersRead[currentReadingChapter].time += sessionSeconds;
        }

        sessionSeconds = 0;
        saveStats();
    }

    // ========== RENDER DASHBOARD ==========
    function renderDashboard() {
        var chaptersReadCount = Object.keys(stats.chaptersRead).length;
        var totalChapters = 23;

        // Overview cards
        var el;

        // Chapters read
        el = document.getElementById('stat-chapters-read');
        if (el) el.textContent = chaptersReadCount;

        el = document.getElementById('stat-chapters-total');
        if (el) el.textContent = 'dari ' + totalChapters + ' chapter';

        // Total time
        el = document.getElementById('stat-total-time');
        if (el) el.textContent = formatMinutes(stats.totalSeconds);

        el = document.getElementById('stat-avg-time');
        if (el) {
            var avgSecs = chaptersReadCount > 0 ? Math.floor(stats.totalSeconds / chaptersReadCount) : 0;
            el.textContent = 'rata-rata: ' + formatMinutes(avgSecs) + '/chapter';
        }

        // Words read
        var totalWords = 0;
        Object.keys(stats.chaptersRead).forEach(function (ch) {
            totalWords += stats.chaptersRead[ch].words || 0;
        });

        el = document.getElementById('stat-words-read');
        if (el) el.textContent = totalWords.toLocaleString();

        el = document.getElementById('stat-pages-est');
        if (el) el.textContent = '± ' + Math.ceil(totalWords / 250) + ' halaman buku';

        // Streak
        el = document.getElementById('stat-streak');
        if (el) el.textContent = stats.currentStreak;

        el = document.getElementById('stat-streak-best');
        if (el) el.textContent = 'terbaik: ' + stats.bestStreak + ' hari';

        // Progress ring
        var percent = Math.round((chaptersReadCount / totalChapters) * 100);
        var circumference = 326.73;
        var offset = circumference - (percent / 100) * circumference;

        el = document.getElementById('stats-ring-fill');
        if (el) {
            setTimeout(function () { el.style.strokeDashoffset = offset; }, 100);
        }

        el = document.getElementById('stats-ring-percent');
        if (el) el.textContent = percent + '%';

        el = document.getElementById('stat-remaining-chapters');
        if (el) el.textContent = (totalChapters - chaptersReadCount) + ' chapter tersisa';

        el = document.getElementById('stat-remaining-time');
        if (el) {
            var avgMins = chaptersReadCount > 0 ? Math.floor(stats.totalSeconds / 60 / chaptersReadCount) : 8;
            var remaining = (totalChapters - chaptersReadCount) * avgMins;
            el.textContent = '± ' + formatMinutes(remaining * 60) + ' lagi';
        }

        // History
        renderHistory();

        // Heatmap
        renderHeatmap();

        // Favorite chapter
        renderFavorite();

        // Fun facts
        renderFacts();
    }

    // ========== RENDER HISTORY ==========
    function renderHistory() {
        var container = document.getElementById('stats-history');
        if (!container) return;

        var chapters = Object.keys(stats.chaptersRead).sort(function (a, b) {
            return parseInt(b) - parseInt(a);
        });

        if (chapters.length === 0) {
            container.innerHTML = '<div class="stats-empty">Belum ada riwayat membaca</div>';
            return;
        }

        var html = '';
        chapters.forEach(function (ch) {
            var data = stats.chaptersRead[ch];
            var title = chapterTitles[ch] || 'Chapter ' + ch;

            html += '<div class="stats-history-item">' +
                '<span class="stats-history-num">' + ch + '</span>' +
                '<div class="stats-history-info">' +
                    '<div class="stats-history-title">' + title + '</div>' +
                    '<div class="stats-history-meta">' + (data.date || '-') + '</div>' +
                '</div>' +
                '<span class="stats-history-time">' + formatMinutes(data.time || 0) + '</span>' +
            '</div>';
        });

        container.innerHTML = html;
    }

    // ========== RENDER HEATMAP ==========
    function renderHeatmap() {
        var container = document.getElementById('stats-heatmap');
        if (!container) return;

        var html = '';
        var today = new Date();

        for (var i = 6; i >= 0; i--) {
            var d = new Date(today);
            d.setDate(d.getDate() - i);
            var dateStr = d.getFullYear() + '-' +
                String(d.getMonth() + 1).padStart(2, '0') + '-' +
                String(d.getDate()).padStart(2, '0');

            var mins = stats.dailyMinutes[dateStr] || 0;
            var level = 0;
            if (mins > 0) level = 1;
            if (mins >= 10) level = 2;
            if (mins >= 20) level = 3;
            if (mins >= 40) level = 4;

            var dayName = getDayName(dateStr);
            var isToday = dateStr === getToday();

            html += '<div class="stats-heatmap-day heatmap-level-' + level + '" ' +
                'title="' + dayName + ': ' + mins + ' menit"' +
                (isToday ? ' style="outline: 2px solid rgba(196,168,124,0.3); outline-offset: 2px;"' : '') + '>' +
                '<span class="heatmap-day-label">' + dayName + '</span>' +
                '<span class="heatmap-day-value">' + (mins > 0 ? mins + 'm' : '-') + '</span>' +
            '</div>';
        }

        container.innerHTML = html;
    }

    // ========== RENDER FAVORITE ==========
    function renderFavorite() {
        var container = document.getElementById('stats-favorite');
        if (!container) return;

        var chapters = Object.keys(stats.chaptersRead);
        if (chapters.length === 0) {
            container.innerHTML = '<div class="stats-empty">Belum ada data</div>';
            return;
        }

        var maxTime = 0;
        var favChapter = null;

        chapters.forEach(function (ch) {
            var time = stats.chaptersRead[ch].time || 0;
            if (time > maxTime) {
                maxTime = time;
                favChapter = ch;
            }
        });

        if (!favChapter) {
            container.innerHTML = '<div class="stats-empty">Belum ada data</div>';
            return;
        }

        var title = chapterTitles[favChapter] || 'Chapter ' + favChapter;

        container.innerHTML =
            '<div class="stats-favorite-item">' +
                '<div class="stats-favorite-chapter">Ch. ' + favChapter + ' — ' + title + '</div>' +
                '<div class="stats-favorite-time">⏱ ' + formatMinutes(maxTime) + ' dihabiskan membaca</div>' +
            '</div>';
    }

    // ========== RENDER FUN FACTS ==========
    function renderFacts() {
        var container = document.getElementById('stats-facts');
        if (!container) return;

        var chaptersReadCount = Object.keys(stats.chaptersRead).length;
        var totalMins = Math.floor(stats.totalSeconds / 60);
        var totalWords = 0;

        Object.keys(stats.chaptersRead).forEach(function (ch) {
            totalWords += stats.chaptersRead[ch].words || 0;
        });

        var facts = [];

        if (totalMins > 0) {
            var coffees = Math.max(1, Math.floor(totalMins / 15));
            facts.push({
                icon: '☕',
                text: 'Kamu sudah menghabiskan waktu setara <span class="stats-fact-highlight">' + coffees + ' cangkir kopi</span> untuk membaca novel ini.'
            });
        }

        if (totalWords > 0) {
            facts.push({
                icon: '📄',
                text: 'Total <span class="stats-fact-highlight">' + totalWords.toLocaleString() + ' kata</span> yang sudah kamu baca — setara ' + Math.ceil(totalWords / 250) + ' halaman buku.'
            });
        }

        if (chaptersReadCount >= 7) {
            facts.push({
                icon: '🌉',
                text: 'Kamu sudah menemani Arka melewati <span class="stats-fact-highlight">seluruh Porto</span>.'
            });
        }

        if (chaptersReadCount >= 11) {
            facts.push({
                icon: '🌫️',
                text: 'Kamu sudah memasuki <span class="stats-fact-highlight">kabut Sintra</span> bersama Arka.'
            });
        }

        if (chaptersReadCount >= 18) {
            facts.push({
                icon: '🏙️',
                text: 'Kamu sudah melewati <span class="stats-fact-highlight">konfrontasi di Lisboa</span>.'
            });
        }

        if (chaptersReadCount >= 23) {
            facts.push({
                icon: '🎉',
                text: 'Kamu telah menyelesaikan <span class="stats-fact-highlight">seluruh novel</span>! Selamat!'
            });
        }

        if (stats.bestStreak >= 3) {
            facts.push({
                icon: '🔥',
                text: 'Streak terbaikmu: <span class="stats-fact-highlight">' + stats.bestStreak + ' hari berturut-turut</span> membaca!'
            });
        }

        if (facts.length === 0) {
            facts.push({
                icon: '✨',
                text: 'Mulai membaca untuk melihat fun facts tentang perjalanan bacamu!'
            });
        }

        var html = '';
        facts.forEach(function (fact) {
            html += '<div class="stats-fact">' +
                '<span class="stats-fact-icon">' + fact.icon + '</span>' +
                '<span class="stats-fact-text">' + fact.text + '</span>' +
            '</div>';
        });

        container.innerHTML = html;
    }

    // ========== OPEN / CLOSE ==========
    function openStats() {
        renderDashboard();
        if (panelEl) panelEl.classList.add('open');
        if (overlayEl) overlayEl.classList.add('open');
        document.body.style.overflow = 'hidden';
        isOpen = true;
    }

    function closeStats() {
        if (panelEl) panelEl.classList.remove('open');
        if (overlayEl) overlayEl.classList.remove('open');
        document.body.style.overflow = '';
        isOpen = false;
    }

    function resetStats() {
        if (!confirm('Yakin ingin menghapus semua statistik membaca?')) return;
        stats = getDefaultStats();
        saveStats();
        renderDashboard();
    }

    // ========== HOOK INTO CHAPTER LOADING ==========
    // Listen for chapter opens
    var originalOpenChapter = window.openChapterByNum;
    window.openChapterByNum = function (num) {
        stopTracking();
        if (typeof originalOpenChapter === 'function') {
            originalOpenChapter(num);
        }
        startTracking(num);
    };

    // Track on page visibility change
    document.addEventListener('visibilitychange', function () {
        if (document.hidden) {
            stopTracking();
        } else if (currentReadingChapter) {
            startTracking(currentReadingChapter);
        }
    });

    // Track on page unload
    window.addEventListener('beforeunload', function () {
        stopTracking();
    });

    // ========== INIT ==========
    function init() {
        btnOpen = document.getElementById('btn-stats');
        panelEl = document.getElementById('stats-panel');
        overlayEl = document.getElementById('stats-overlay');
        btnClose = document.getElementById('stats-close');
        btnReset = document.getElementById('stats-reset');

        if (!panelEl) return;

        loadStats();

        if (btnOpen) btnOpen.addEventListener('click', openStats);
        if (btnClose) btnClose.addEventListener('click', closeStats);
        if (overlayEl) overlayEl.addEventListener('click', closeStats);
        if (btnReset) btnReset.addEventListener('click', resetStats);

        document.addEventListener('keydown', function (e) {
            if (e.key === 'Escape' && isOpen) closeStats();
        });

        // Auto-start tracking if reader is already open
        var lastRead = parseInt(localStorage.getItem('kabut_lastread'));
        var readerSection = document.getElementById('reader-section');
        if (lastRead && readerSection && readerSection.classList.contains('active')) {
            startTracking(lastRead + 1);
        }
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

})();
