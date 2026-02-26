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
            src: "music/track1.mp3"
        },
        {
            title: "Sungai Douro",
            artist: "Piano",
            src: "music/track2.mp3"
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
        if (playIcon) playIcon.textContent = playing ? '⏸' : '▶';

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