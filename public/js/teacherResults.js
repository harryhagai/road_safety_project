document.addEventListener('DOMContentLoaded', function () {
    const pageRoot = document.querySelector('.teacher-results-page');
    if (!pageRoot) {
        return;
    }

    const filterEndpoint = pageRoot.dataset.filterEndpoint || '';
    const classFilter = document.getElementById('resultsClassFilter');
    const streamFilter = document.getElementById('resultsStreamFilter');
    const academicYearFilter = document.getElementById('resultsAcademicYearFilter');
    const examFilter = document.getElementById('resultsExamFilter');
    const subjectFilter = document.getElementById('resultsSubjectFilter');
    const sortFilter = document.getElementById('resultsSortFilter');
    const tableContainer = document.getElementById('teacherResultsTableContainer');
    const loadingIndicator = document.getElementById('teacherResultsLoading');
    let requestSequence = 0;

    function ensureSpinnerStyles() {
        if (document.getElementById('inline-dotted-spinner-styles')) {
            return;
        }

        const style = document.createElement('style');
        style.id = 'inline-dotted-spinner-styles';
        style.textContent = `
            .inline-dotted-spinner {
                position: relative;
                display: inline-flex;
                align-items: center;
                justify-content: center;
                width: 18px;
                height: 18px;
                margin-right: 0.45rem;
                flex-shrink: 0;
            }

            .inline-dotted-spinner__track {
                display: none;
            }

            .inline-dotted-spinner__dots {
                position: absolute;
                inset: 0;
                border-radius: 50%;
                animation: inlineDottedSpinnerRotate 1.35s linear infinite;
            }

            .inline-dotted-spinner__dots span {
                position: absolute;
                width: 3px;
                height: 3px;
                border-radius: 50%;
                background: currentColor;
                opacity: 0.9;
            }

            .inline-dotted-spinner__dots span:nth-child(1) {
                top: 0;
                left: 50%;
                transform: translateX(-50%);
            }

            .inline-dotted-spinner__dots span:nth-child(2) {
                top: 2px;
                right: 2px;
            }

            .inline-dotted-spinner__dots span:nth-child(3) {
                right: 0;
                top: 50%;
                transform: translateY(-50%);
            }

            .inline-dotted-spinner__dots span:nth-child(4) {
                right: 2px;
                bottom: 2px;
            }

            .inline-dotted-spinner__dots span:nth-child(5) {
                bottom: 0;
                left: 50%;
                transform: translateX(-50%);
            }

            .inline-dotted-spinner__dots span:nth-child(6) {
                left: 2px;
                bottom: 2px;
            }

            .inline-dotted-spinner__dots span:nth-child(7) {
                left: 0;
                top: 50%;
                transform: translateY(-50%);
            }

            .inline-dotted-spinner__dots span:nth-child(8) {
                top: 2px;
                left: 2px;
            }

            @keyframes inlineDottedSpinnerRotate {
                to {
                    transform: rotate(360deg);
                }
            }
        `;

        document.head.appendChild(style);
    }

    function spinnerMarkup() {
        ensureSpinnerStyles();

        return `
            <span class="inline-dotted-spinner" aria-hidden="true">
                <span class="inline-dotted-spinner__track"></span>
                <span class="inline-dotted-spinner__dots">
                    <span></span>
                    <span></span>
                    <span></span>
                    <span></span>
                    <span></span>
                    <span></span>
                    <span></span>
                    <span></span>
                </span>
            </span>
        `;
    }

    function setExportButtonLoading(button, isLoading) {
        if (!button) {
            return;
        }

        if (isLoading) {
            if (button.dataset.exportLoading === '1') {
                return;
            }

            button.dataset.exportLoading = '1';
            button.dataset.originalHtml = button.innerHTML;
            button.classList.add('disabled');
            button.setAttribute('aria-disabled', 'true');
            button.style.pointerEvents = 'none';
            button.innerHTML = `${spinnerMarkup()}<span>${button.dataset.loadingText || 'Preparing download...'}</span>`;

            return;
        }

        if (button.dataset.originalHtml) {
            button.innerHTML = button.dataset.originalHtml;
        }

        delete button.dataset.exportLoading;
        delete button.dataset.originalHtml;
        button.classList.remove('disabled');
        button.removeAttribute('aria-disabled');
        button.style.pointerEvents = '';
    }

    function extractFilename(response, fallbackUrl) {
        const disposition = response.headers.get('content-disposition') || '';
        const utf8Match = disposition.match(/filename\*=UTF-8''([^;]+)/i);
        if (utf8Match && utf8Match[1]) {
            return decodeURIComponent(utf8Match[1]);
        }

        const asciiMatch = disposition.match(/filename="?([^"]+)"?/i);
        if (asciiMatch && asciiMatch[1]) {
            return asciiMatch[1];
        }

        const pathname = new URL(fallbackUrl, window.location.origin).pathname;
        return pathname.split('/').pop() || 'download';
    }

    function triggerBlobDownload(blob, filename) {
        const objectUrl = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = objectUrl;
        link.download = filename;
        document.body.appendChild(link);
        link.click();
        link.remove();
        window.setTimeout(() => window.URL.revokeObjectURL(objectUrl), 1000);
    }

    async function handleExportClick(event) {
        const link = event.target.closest('a[data-results-export]');
        if (!link) {
            return;
        }

        event.preventDefault();

        if (link.dataset.exportLoading === '1') {
            return;
        }

        setExportButtonLoading(link, true);

        try {
            const response = await fetch(link.href, {
                method: 'GET',
                credentials: 'same-origin',
                cache: 'no-store',
                headers: {
                    'X-Requested-With': 'XMLHttpRequest',
                },
            });

            if (!response.ok) {
                throw new Error('Download failed.');
            }

            const blob = await response.blob();
            const filename = extractFilename(response, link.href);
            triggerBlobDownload(blob, filename);
        } catch (error) {
            console.error(error);
            if (window.Swal) {
                Swal.fire({
                    icon: 'error',
                    title: 'Download failed',
                    text: 'PDF or Excel could not be downloaded right now.',
                    confirmButtonText: 'OK',
                });
            }
        } finally {
            setExportButtonLoading(link, false);
        }
    }

    function getCustomSelectRoots() {
        return Array.from(document.querySelectorAll('[data-custom-select]'));
    }

    function setLoading(isLoading) {
        if (loadingIndicator) {
            loadingIndicator.classList.toggle('d-none', !isLoading);
        }
    }

    function closeAllCustomSelects(exceptRoot) {
        getCustomSelectRoots().forEach((root) => {
            if (root !== exceptRoot) {
                root.classList.remove('is-open');
            }
        });
    }

    function syncCustomSelect(root) {
        const targetId = root.dataset.target;
        const select = document.getElementById(targetId);
        if (!select) {
            return;
        }

        root.innerHTML = '';

        const trigger = document.createElement('button');
        trigger.type = 'button';
        trigger.className = 'teacher-enter-marks-custom-select-trigger';
        trigger.disabled = select.disabled;
        trigger.setAttribute('aria-haspopup', 'listbox');
        trigger.setAttribute('aria-expanded', root.classList.contains('is-open') ? 'true' : 'false');

        const label = document.createElement('span');
        label.className = 'teacher-enter-marks-custom-select-label';
        const selectedOption = select.options[select.selectedIndex] || select.options[0];
        label.textContent = selectedOption ? selectedOption.textContent : 'Select option';
        trigger.appendChild(label);

        const menu = document.createElement('div');
        menu.className = 'teacher-enter-marks-custom-select-menu';
        menu.setAttribute('role', 'listbox');

        Array.from(select.options).forEach((option, index) => {
            const optionButton = document.createElement('button');
            optionButton.type = 'button';
            optionButton.className = 'teacher-enter-marks-custom-select-option';
            if (!option.value) {
                optionButton.classList.add('teacher-enter-marks-custom-select-option--placeholder');
            }
            if (option.selected) {
                optionButton.classList.add('is-active');
            }
            optionButton.textContent = option.textContent;
            optionButton.disabled = option.disabled && index !== 0;

            optionButton.addEventListener('click', function () {
                if (optionButton.disabled) {
                    return;
                }

                select.value = option.value;
                root.classList.remove('is-open');
                select.dispatchEvent(new Event('change', { bubbles: true }));
                syncCustomSelect(root);
            });

            menu.appendChild(optionButton);
        });

        trigger.addEventListener('click', function () {
            if (trigger.disabled) {
                return;
            }

            const willOpen = !root.classList.contains('is-open');
            closeAllCustomSelects(root);
            root.classList.toggle('is-open', willOpen);
            trigger.setAttribute('aria-expanded', willOpen ? 'true' : 'false');
        });

        root.appendChild(trigger);
        root.appendChild(menu);
    }

    function syncAllCustomSelects() {
        getCustomSelectRoots().forEach(syncCustomSelect);
    }

    function setSelectOptions(select, items, placeholder, selectedValue, labelBuilder, withLevelData = false) {
        const normalizedSelected = selectedValue ? String(selectedValue) : '';
        const options = [`<option value="">${placeholder}</option>`];

        items.forEach((item) => {
            const value = String(item.id);
            const selected = value === normalizedSelected ? ' selected' : '';
            const levelData = withLevelData && item.subject_level ? ` data-subject-level="${item.subject_level}"` : '';
            options.push(`<option value="${value}"${selected}${levelData}>${labelBuilder(item)}</option>`);
        });

        select.innerHTML = options.join('');
    }

    function updateUrl(selected) {
        const url = new URL(window.location.href);
        ['class_id', 'stream_id', 'academic_year_id', 'exam_id', 'subject_id', 'subject_level', 'sort_by'].forEach((key) => {
            if (selected[key]) {
                url.searchParams.set(key, selected[key]);
            } else {
                url.searchParams.delete(key);
            }
        });

        window.history.replaceState({}, '', url.toString());
    }

    function updateFilterState(payload) {
        setSelectOptions(classFilter, payload.classes || [], 'Select class', payload.selected.class_id, (item) => item.name);
        setSelectOptions(streamFilter, payload.streams || [], 'All assigned streams', payload.selected.stream_id, (item) => item.name);
        setSelectOptions(academicYearFilter, payload.academicYears || [], 'Select academic year', payload.selected.academic_year_id, (item) => item.label);
        setSelectOptions(examFilter, payload.exams || [], 'Select examination', payload.selected.exam_id, (item) => item.label);
        setSelectOptions(subjectFilter, payload.subjects || [], 'Select subject', payload.selected.subject_id, (item) => item.label, true);
        if (sortFilter && payload.selected.sort_by) {
            sortFilter.value = payload.selected.sort_by;
        }

        streamFilter.disabled = !classFilter.value || (payload.streams || []).length === 0;
        academicYearFilter.disabled = !classFilter.value || (payload.academicYears || []).length === 0;
        examFilter.disabled = !classFilter.value || !academicYearFilter.value || (payload.exams || []).length === 0;
        subjectFilter.disabled = !classFilter.value || (payload.subjects || []).length === 0;

        syncAllCustomSelects();
    }

    function initSearch() {
        const searchInput = document.getElementById('teacher-results-search');
        const tableBody = document.getElementById('teacher-results-table-body');
        if (!searchInput || !tableBody) {
            return;
        }

        searchInput.addEventListener('input', function () {
            const search = this.value.trim().toLowerCase();
            let visibleIndex = 1;

            tableBody.querySelectorAll('tr').forEach((row) => {
                const name = row.querySelector('.teacher-results-student-name')?.textContent.toLowerCase() || '';
                const examNumber = row.querySelector('.teacher-results-exam-number')?.textContent.toLowerCase() || '';
                const stream = row.querySelector('.teacher-results-stream')?.textContent.toLowerCase() || '';
                const visible = !search || name.includes(search) || examNumber.includes(search) || stream.includes(search);

                row.style.display = visible ? '' : 'none';
                if (visible) {
                    const indexCell = row.querySelector('.teacher-results-index');
                    if (indexCell) {
                        indexCell.textContent = visibleIndex++;
                    }
                }
            });
        });
    }

    function initTableUi() {
        syncAllCustomSelects();
        initSearch();
    }

    async function refreshFilters() {
        const requestId = ++requestSequence;
        const params = new URLSearchParams();
        const selectedSubjectOption = subjectFilter.options[subjectFilter.selectedIndex];

        if (classFilter.value) params.set('class_id', classFilter.value);
        if (streamFilter.value) params.set('stream_id', streamFilter.value);
        if (academicYearFilter.value) params.set('academic_year_id', academicYearFilter.value);
        if (examFilter.value) params.set('exam_id', examFilter.value);
        if (subjectFilter.value) params.set('subject_id', subjectFilter.value);
        if (selectedSubjectOption?.dataset?.subjectLevel) params.set('subject_level', selectedSubjectOption.dataset.subjectLevel);
        if (sortFilter?.value) params.set('sort_by', sortFilter.value);

        setLoading(true);

        try {
            const response = await fetch(`${filterEndpoint}?${params.toString()}`, {
                headers: {
                    'X-Requested-With': 'XMLHttpRequest',
                    Accept: 'application/json',
                },
                credentials: 'same-origin',
                cache: 'no-store',
            });

            if (!response.ok) {
                throw new Error('Failed to load results filters.');
            }

            const payload = await response.json();
            if (requestId !== requestSequence) {
                return;
            }

            updateFilterState(payload);
            classFilter.value = payload.selected.class_id ? String(payload.selected.class_id) : '';
            streamFilter.value = payload.selected.stream_id ? String(payload.selected.stream_id) : '';
            academicYearFilter.value = payload.selected.academic_year_id ? String(payload.selected.academic_year_id) : '';
            examFilter.value = payload.selected.exam_id ? String(payload.selected.exam_id) : '';
            subjectFilter.value = payload.selected.subject_id ? String(payload.selected.subject_id) : '';
            if (sortFilter) {
                sortFilter.value = payload.selected.sort_by ? String(payload.selected.sort_by) : 'position_asc';
            }
            syncAllCustomSelects();

            tableContainer.innerHTML = payload.summaryHtml;
            initTableUi();
            updateUrl(payload.selected);
        } catch (error) {
            console.error(error);
            if (window.Swal) {
                Swal.fire({
                    icon: 'error',
                    title: 'Unable to load results',
                    text: 'The results filters could not be updated right now.',
                    confirmButtonText: 'OK',
                });
            }
        } finally {
            if (requestId === requestSequence) {
                setLoading(false);
            }
        }
    }

    [classFilter, streamFilter, academicYearFilter, examFilter, subjectFilter, sortFilter].forEach((select) => {
        if (select) {
            select.addEventListener('change', refreshFilters);
        }
    });

    document.addEventListener('click', function (event) {
        if (!event.target.closest('[data-custom-select]')) {
            closeAllCustomSelects();
        }
    });

    document.addEventListener('click', handleExportClick);

    initTableUi();
});
