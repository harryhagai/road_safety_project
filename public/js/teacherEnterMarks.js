document.addEventListener('DOMContentLoaded', function () {
    const pageRoot = document.querySelector('.teacher-enter-marks-page');
    if (!pageRoot) {
        return;
    }

    const filterEndpoint = pageRoot.dataset.filterEndpoint || '';
    const showReasonError = pageRoot.dataset.reasonError || '';
    const teacherName = pageRoot.dataset.teacherName || 'Teacher';
    const teacherGender = pageRoot.dataset.teacherGender || '';
    const subjectFilter = document.getElementById('subjectFilter');
    const classFilter = document.getElementById('classFilter');
    const academicYearFilter = document.getElementById('academicYearFilter');
    const examFilter = document.getElementById('examFilter');
    const tableContainer = document.getElementById('enterMarksTableContainer');
    const loadingIndicator = document.getElementById('enterMarksLoading');
    let requestSequence = 0;
    let activeVoiceStudentKey = '';
    let voiceSessionActive = false;
    let voiceMode = 'search';

    function escapeHtml(value) {
        return String(value ?? '')
            .replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')
            .replace(/"/g, '&quot;')
            .replace(/'/g, '&#039;');
    }

    function showReasonAlert(description, students) {
        const normalizedStudents = Array.from(new Set((students || []).filter(Boolean)));
        const listHtml = normalizedStudents.length
            ? `
                <div class="teacher-enter-marks-alert-list-wrap">
                    <div class="teacher-enter-marks-alert-list-title">Students missing reason</div>
                    <div class="teacher-enter-marks-alert-list">
                        ${normalizedStudents.map((student) => `<span class="teacher-enter-marks-alert-chip">${escapeHtml(student)}</span>`).join('')}
                    </div>
                </div>
            `
            : '';

        Swal.fire({
            html: `
                <div class="teacher-enter-marks-alert-shell">
                    <div class="teacher-enter-marks-alert-hero">
                        <span class="teacher-enter-marks-alert-symbol">!</span>
                    </div>
                    <div class="teacher-enter-marks-alert-head">
                        <div class="teacher-enter-marks-alert-kicker">Marks Review</div>
                        <h2 class="teacher-enter-marks-alert-heading">Reason Required</h2>
                    </div>
                    <div class="teacher-enter-marks-alert-copy">
                        <p>${escapeHtml(description)}</p>
                    </div>
                    ${listHtml}
                </div>
            `,
            confirmButtonText: 'OK',
            confirmButtonColor: '#0d6efd',
            customClass: {
                popup: 'teacher-enter-marks-alert-popup',
                htmlContainer: 'teacher-enter-marks-alert-html',
                confirmButton: 'teacher-enter-marks-alert-button',
            },
        });
    }

    function getCustomSelectRoots() {
        return Array.from(document.querySelectorAll('[data-custom-select]'));
    }

    if (showReasonError) {
        showReasonAlert(showReasonError, []);
    }

    function setLoading(isLoading) {
        if (loadingIndicator) {
            loadingIndicator.classList.toggle('d-none', !isLoading);
        }
    }

    function updateUrl(selected) {
        const url = new URL(window.location.href);
        ['subject_id', 'subject_level', 'class_id', 'academic_year_id', 'exam_id'].forEach((key) => {
            if (selected[key]) {
                url.searchParams.set(key, selected[key]);
            } else {
                url.searchParams.delete(key);
            }
        });

        window.history.replaceState({}, '', url.toString());
    }

    function setSelectOptions(select, items, placeholder, selectedValue, labelBuilder) {
        const normalizedSelected = selectedValue ? String(selectedValue) : '';
        const options = [`<option value="">${placeholder}</option>`];

        items.forEach((item) => {
            const value = String(item.id);
            const selected = value === normalizedSelected ? ' selected' : '';
            options.push(`<option value="${value}"${selected}>${labelBuilder(item)}</option>`);
        });

        select.innerHTML = options.join('');
    }

    function updateFilterState(payload) {
        setSelectOptions(classFilter, payload.classes || [], 'Select class', payload.selected.class_id, (item) => item.name);
        setSelectOptions(academicYearFilter, payload.academicYears || [], 'Select academic year', payload.selected.academic_year_id, (item) => item.label);
        setSelectOptions(examFilter, payload.exams || [], 'Select examination', payload.selected.exam_id, (item) => item.label);

        classFilter.disabled = !subjectFilter.value || (payload.classes || []).length === 0;
        academicYearFilter.disabled = !subjectFilter.value || (payload.academicYears || []).length === 0;
        examFilter.disabled = !classFilter.value || !academicYearFilter.value || (payload.exams || []).length === 0;

        syncAllCustomSelects();
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
        if (select.classList.contains('is-invalid')) {
            trigger.classList.add('is-invalid');
        }
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
            optionButton.dataset.value = option.value;
            optionButton.setAttribute('role', 'option');
            optionButton.setAttribute('aria-selected', option.selected ? 'true' : 'false');
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

    function getLevelKey(level) {
        return String(level || '').toLowerCase().replace(/[\s_-]/g, '');
    }

    function getBadgeClassForGrade(grade) {
        const normalizedGrade = String(grade || '').trim().toUpperCase();

        switch (normalizedGrade) {
            case 'A':
                return 'bg-success text-white';
            case 'B':
                return 'bg-primary text-white';
            case 'C':
                return 'bg-warning text-dark';
            case 'D':
                return 'bg-info text-dark';
            case 'E':
                return 'bg-secondary text-white';
            case 'S':
                return 'bg-dark text-white';
            case 'F':
                return 'bg-danger text-white';
            default:
                return '';
        }
    }

    function parseGradingConfig(form) {
        if (!form?.dataset?.gradingConfig) {
            return null;
        }

        try {
            const parsed = JSON.parse(form.dataset.gradingConfig);
            return Array.isArray(parsed?.bands) ? parsed : null;
        } catch (error) {
            return null;
        }
    }

    function getGradeMeta(score, subjectLevel, gradingConfig) {
        if (!Number.isFinite(score)) {
            return { grade: '', remark: '', badgeClass: '' };
        }

        if (Array.isArray(gradingConfig?.bands) && gradingConfig.bands.length) {
            const matchedBand = gradingConfig.bands.find(function (band) {
                const minScore = band?.min_score === null || typeof band?.min_score === 'undefined'
                    ? Number.NEGATIVE_INFINITY
                    : Number.parseFloat(band.min_score);
                const maxScore = band?.max_score === null || typeof band?.max_score === 'undefined'
                    ? Number.POSITIVE_INFINITY
                    : Number.parseFloat(band.max_score);

                return score >= minScore && score <= maxScore;
            });

            if (matchedBand) {
                const grade = String(matchedBand.grade || '').trim();
                const remark = String(matchedBand.remark || '').trim();

                return {
                    grade,
                    remark,
                    badgeClass: getBadgeClassForGrade(grade),
                };
            }
        }

        const level = getLevelKey(subjectLevel);
        if (level === 'alevel') {
            if (score > 100 || score < 0) return { grade: '', remark: '', badgeClass: '' };
            if (score >= 80) return { grade: 'A', remark: 'Excellent', badgeClass: 'bg-success text-white' };
            if (score >= 70) return { grade: 'B', remark: 'Very good', badgeClass: 'bg-primary text-white' };
            if (score >= 60) return { grade: 'C', remark: 'Good', badgeClass: 'bg-warning text-dark' };
            if (score >= 50) return { grade: 'D', remark: 'Satisfactory', badgeClass: 'bg-info text-dark' };
            if (score >= 40) return { grade: 'E', remark: 'Sufficient', badgeClass: 'bg-secondary text-white' };
            if (score >= 35) return { grade: 'S', remark: 'Sub-minimum', badgeClass: 'bg-dark text-white' };
            if (score >= 0) return { grade: 'F', remark: 'Fail', badgeClass: 'bg-danger text-white' };
            return { grade: '', remark: '', badgeClass: '' };
        }

        if (score > 100 || score < 0) return { grade: '', remark: '', badgeClass: '' };
        if (score >= 75) return { grade: 'A', remark: 'Excellent', badgeClass: 'bg-success text-white' };
        if (score >= 65) return { grade: 'B', remark: 'Very good', badgeClass: 'bg-primary text-white' };
        if (score >= 45) return { grade: 'C', remark: 'Good', badgeClass: 'bg-warning text-dark' };
        if (score >= 30) return { grade: 'D', remark: 'Satisfactory', badgeClass: 'bg-info text-dark' };
        if (score >= 0) return { grade: 'F', remark: 'Fail', badgeClass: 'bg-danger text-white' };
        return { grade: '', remark: '', badgeClass: '' };
    }

    function updateRow(row, subjectLevel, gradingConfig) {
        const scoreInput = row.querySelector('.score-input');
        const remarkField = row.querySelector('.remark-input');
        const gradeBadge = row.querySelector('.grade-badge');
        const reasonSelect = row.querySelector('.reason-select');
        const reasonSelectUi = reasonSelect ? row.querySelector(`[data-target="${reasonSelect.id}"]`) : null;
        const otherInput = row.querySelector('.reason-other-input');
        const score = Number.parseFloat(scoreInput.value);
        const meta = getGradeMeta(score, subjectLevel, gradingConfig);

        remarkField.value = meta.remark;
        gradeBadge.textContent = meta.grade;
        gradeBadge.className = `grade-badge teacher-enter-marks-grade-badge ${meta.badgeClass}`.trim();

        if (!scoreInput.value) {
            if (reasonSelect) {
                reasonSelect.style.display = '';
                if (reasonSelectUi) {
                    reasonSelectUi.classList.remove('d-none');
                    syncCustomSelect(reasonSelectUi);
                }
            }
        } else if (reasonSelect) {
            reasonSelect.value = '';
            reasonSelect.style.display = 'none';
            if (reasonSelectUi) {
                reasonSelectUi.classList.add('d-none');
                syncCustomSelect(reasonSelectUi);
            }
            reasonSelect.classList.remove('is-invalid');
        }

        if (otherInput) {
            if (reasonSelect && reasonSelect.value === 'other' && !scoreInput.value) {
                otherInput.classList.remove('d-none');
            } else {
                otherInput.value = '';
                otherInput.classList.add('d-none');
                otherInput.classList.remove('is-invalid');
            }
        }
    }

    function initSearch(tableRoot) {
        const searchInput = tableRoot.querySelector('#student-search');
        const tableBody = tableRoot.querySelector('#students-table-body');
        if (!searchInput || !tableBody) {
            return;
        }

        searchInput.addEventListener('input', function () {
            const search = this.value.trim().toLowerCase();
            let rowIndex = 1;

            tableBody.querySelectorAll('tr').forEach(function (row) {
                const name = row.querySelector('.student-name')?.textContent.toLowerCase() || '';
                const id = row.querySelector('.student-id')?.textContent.toLowerCase() || '';
                const visible = !search || name.includes(search) || id.includes(search);

                row.style.display = visible ? '' : 'none';
                if (visible) {
                    const indexCell = row.querySelector('.student-index');
                    if (indexCell) {
                        indexCell.textContent = rowIndex++;
                    }
                }
            });
        });
    }

    function normalizeVoiceText(value) {
        return String(value || '')
            .toLowerCase()
            .replace(/\//g, ' slash ')
            .replace(/[^\p{L}\p{N}.\s-]/gu, ' ')
            .replace(/\s+/g, ' ')
            .trim();
    }

    function speechSynthesisReady() {
        return 'speechSynthesis' in window && typeof window.SpeechSynthesisUtterance !== 'undefined';
    }

    function teacherHonorific() {
        const normalizedGender = String(teacherGender || '').toLowerCase().trim();
        if (normalizedGender === 'male') {
            return 'Mr';
        }
        if (normalizedGender === 'female') {
            return 'Mrs';
        }

        return '';
    }

    function teacherGreetingName() {
        const honorific = teacherHonorific();
        return honorific ? `${honorific} ${teacherName}` : teacherName;
    }

    function speakVoicePrompt(text, onDone) {
        if (!speechSynthesisReady()) {
            if (typeof onDone === 'function') {
                onDone();
            }
            return;
        }

        const utterance = new window.SpeechSynthesisUtterance(text);
        utterance.rate = 0.95;
        utterance.pitch = 1;
        utterance.lang = 'en-US';
        utterance.onend = function () {
            if (typeof onDone === 'function') {
                onDone();
            }
        };
        utterance.onerror = function () {
            if (typeof onDone === 'function') {
                onDone();
            }
        };

        window.speechSynthesis.cancel();
        window.speechSynthesis.speak(utterance);
    }

    function speakShortPrompt(text) {
        if (!speechSynthesisReady()) {
            return;
        }

        const utterance = new window.SpeechSynthesisUtterance(text);
        utterance.rate = 1;
        utterance.pitch = 1;
        utterance.lang = 'en-US';
        window.speechSynthesis.cancel();
        window.speechSynthesis.speak(utterance);
    }

    async function getMicrophonePermissionState() {
        if (!navigator.permissions?.query) {
            return 'unknown';
        }

        try {
            const permissionStatus = await navigator.permissions.query({ name: 'microphone' });
            return permissionStatus.state || 'unknown';
        } catch (error) {
            return 'unknown';
        }
    }

    function buildVoiceScore(rawText) {
        const normalized = normalizeVoiceText(rawText)
            .replace(/\bpoint\b/g, '.')
            .replace(/\bdot\b/g, '.')
            .replace(/\s+\.\s+/g, '.')
            .replace(/\s+\./g, '.')
            .replace(/\.\s+/g, '.');

        const match = normalized.match(/(\d+(?:\.\d+)?)\s*$/);
        if (!match) {
            return null;
        }

        const score = Number.parseFloat(match[1]);
        if (!Number.isFinite(score) || score < 0 || score > 100) {
            return null;
        }

        const identifier = normalized.slice(0, match.index).trim();
        if (!identifier) {
            return null;
        }

        return {
            identifier,
            score,
            transcript: normalized,
        };
    }

    function buildScoreOnlyValue(rawText) {
        const normalized = normalizeVoiceText(rawText)
            .replace(/\bpoint\b/g, '.')
            .replace(/\bdot\b/g, '.')
            .replace(/\s+\.\s+/g, '.')
            .replace(/\s+\./g, '.')
            .replace(/\.\s+/g, '.');

        const digitWords = {
            zero: '0',
            oh: '0',
            o: '0',
            one: '1',
            two: '2',
            three: '3',
            four: '4',
            five: '5',
            six: '6',
            seven: '7',
            eight: '8',
            nine: '9',
        };

        const spokenDigits = normalized
            .split(' ')
            .map((token) => digitWords[token] ?? token)
            .join('');

        if (/^\d{1,3}(?:\.\d+)?$/.test(spokenDigits)) {
            const spokenScore = Number.parseFloat(spokenDigits);
            if (Number.isFinite(spokenScore) && spokenScore >= 0 && spokenScore <= 100) {
                return spokenScore;
            }
        }

        const match = normalized.match(/(\d+(?:\.\d+)?)\s*$/);
        if (!match) {
            return null;
        }

        const score = Number.parseFloat(match[1]);
        if (!Number.isFinite(score) || score < 0 || score > 100) {
            return null;
        }

        return score;
    }

    function analyzeScoreOnlyValue(rawText) {
        const score = buildScoreOnlyValue(rawText);
        if (score !== null) {
            return { kind: 'ok', score };
        }

        const normalized = normalizeVoiceText(rawText)
            .replace(/\bpoint\b/g, '.')
            .replace(/\bdot\b/g, '.')
            .replace(/\s+\.\s+/g, '.')
            .replace(/\s+\./g, '.')
            .replace(/\.\s+/g, '.');

        const digitWords = {
            zero: '0',
            oh: '0',
            o: '0',
            one: '1',
            two: '2',
            three: '3',
            four: '4',
            five: '5',
            six: '6',
            seven: '7',
            eight: '8',
            nine: '9',
        };

        const spokenDigits = normalized
            .split(' ')
            .map((token) => digitWords[token] ?? token)
            .join('');

        const candidate = /^\d{1,3}(?:\.\d+)?$/.test(spokenDigits)
            ? Number.parseFloat(spokenDigits)
            : Number.parseFloat(normalized.match(/(\d+(?:\.\d+)?)\s*$/)?.[1] ?? '');

        if (Number.isFinite(candidate) && candidate > 100) {
            return { kind: 'too_high', score: candidate };
        }

        return { kind: 'invalid', score: null };
    }

    function extractLiveIdentifier(rawText) {
        const normalized = normalizeVoiceText(rawText);
        if (!normalized) {
            return '';
        }

        return examSuffix(normalized);
    }

    function normalizeIdentifier(value) {
        return normalizeVoiceText(value).replace(/\s+/g, ' ').trim();
    }

    function stripVoiceCommandWords(value) {
        return normalizeIdentifier(value)
            .replace(/\bstart\b/g, ' ')
            .replace(/\s+/g, ' ')
            .trim();
    }

    function compactIdentifier(value) {
        return normalizeIdentifier(value)
            .replace(/\bslash\b/g, '/')
            .replace(/\s+/g, '')
            .replace(/[^a-z0-9/]/g, '');
    }

    function examSuffix(value) {
        const compact = compactIdentifier(value);
        if (!compact) {
            return '';
        }

        const slashParts = compact.split('/');
        return slashParts[slashParts.length - 1] || compact;
    }

    function normalizeExamSuffix(value) {
        const suffix = examSuffix(value);
        if (!suffix) {
            return '';
        }

        return /^\d+$/.test(suffix) ? suffix.padStart(4, '0') : suffix;
    }

    function findStudentRowByVoice(tableRoot, identifier) {
        const normalizedIdentifier = normalizeIdentifier(identifier);
        const compactIdentifierValue = compactIdentifier(identifier);
        const suffixIdentifier = normalizeExamSuffix(identifier);
        const numericIdentifier = suffixIdentifier.replace(/^0+/, '');
        let partialMatch = null;

        for (const row of tableRoot.querySelectorAll('#students-table-body tr')) {
            const studentId = row.querySelector('.student-id')?.textContent?.trim() || '';
            const studentName = row.querySelector('.student-name')?.textContent?.trim() || '';
            const normalizedStudentId = compactIdentifier(studentId);
            const normalizedStudentSuffix = normalizeExamSuffix(studentId);
            const normalizedStudentName = normalizeIdentifier(studentName);
            const normalizedStudentIdNoZero = normalizedStudentSuffix.replace(/^0+/, '');

            if (
                suffixIdentifier &&
                (
                    normalizedStudentSuffix === suffixIdentifier ||
                    (numericIdentifier && normalizedStudentIdNoZero === numericIdentifier)
                )
            ) {
                return row;
            }

            if (!partialMatch && normalizedIdentifier && normalizedStudentName.includes(normalizedIdentifier)) {
                partialMatch = row;
            }
        }

        return partialMatch;
    }

    function formatVoiceScore(score) {
        return Number.isInteger(score)
            ? String(score)
            : String(Number(score.toFixed(2)));
    }

    function setVoiceStatus(statusNode, message, type) {
        if (!statusNode) {
            return;
        }

        statusNode.textContent = message;
        statusNode.classList.remove('is-success', 'is-error');
        if (type === 'success') {
            statusNode.classList.add('is-success');
        }
        if (type === 'error') {
            statusNode.classList.add('is-error');
        }
    }

    function countStudentsWithoutScores(tableRoot) {
        return Array.from(tableRoot.querySelectorAll('#students-table-body tr')).filter(function (row) {
            const scoreInput = row.querySelector('.score-input');
            return scoreInput && !String(scoreInput.value || '').trim();
        }).length;
    }

    function flashVoiceRow(row) {
        row.classList.remove('teacher-enter-marks-row--voice-hit');
        void row.offsetWidth;
        row.classList.add('teacher-enter-marks-row--voice-hit');
    }

    function setScoreFocusState(row, isActive) {
        if (!row) {
            return;
        }

        const scoreInput = row.querySelector('.score-input');
        if (!scoreInput) {
            return;
        }

        scoreInput.classList.toggle('teacher-enter-marks-input--voice-target', isActive);
        if (isActive) {
            scoreInput.focus({ preventScroll: false });
            scoreInput.select?.();
        }
    }

    function setActiveVoiceStudent(tableRoot, row) {
        tableRoot.querySelectorAll('#students-table-body tr').forEach(function (item) {
            item.classList.remove('teacher-enter-marks-row--voice-active');
            setScoreFocusState(item, false);
        });

        if (!row) {
            activeVoiceStudentKey = '';
            voiceMode = 'search';
            return;
        }

        const studentId = row.querySelector('.student-id')?.textContent?.trim() || '';
        activeVoiceStudentKey = normalizeExamSuffix(studentId);
        row.classList.add('teacher-enter-marks-row--voice-active');
    }

    function getActiveVoiceStudentRow(tableRoot) {
        if (!activeVoiceStudentKey) {
            return null;
        }

        return Array.from(tableRoot.querySelectorAll('#students-table-body tr')).find(function (row) {
            const studentId = row.querySelector('.student-id')?.textContent?.trim() || '';
            return normalizeExamSuffix(studentId) === activeVoiceStudentKey;
        }) || null;
    }

    function activeStudentLabel(row) {
        if (!row) {
            return activeVoiceStudentKey || 'Selected student';
        }

        const studentName = row.querySelector('.student-name')?.textContent?.trim() || 'Selected student';
        const studentId = normalizeExamSuffix(row.querySelector('.student-id')?.textContent?.trim() || '');

        return studentId ? `${studentName} (${studentId})` : studentName;
    }

    function initVoiceEntry(tableRoot) {
        const voiceButton = tableRoot.querySelector('[data-voice-trigger]');
        const voiceDemoButton = tableRoot.querySelector('[data-voice-demo]');
        const voiceStatus = tableRoot.querySelector('[data-voice-status]');
        const form = tableRoot.querySelector('.teacher-marks-form');
        const searchInput = tableRoot.querySelector('#student-search');
        const recognitionApi = window.SpeechRecognition || window.webkitSpeechRecognition;

        if (!voiceButton || !voiceStatus || !form) {
            return;
        }

        if (!recognitionApi) {
            voiceButton.disabled = true;
            setVoiceStatus(voiceStatus, 'Voice entry is not supported in this browser. Try Chrome or Edge.', 'error');
            return;
        }

        const subjectLevel = form.dataset.subjectLevel || '';
        const recognition = new recognitionApi();
        let isListening = false;

        recognition.lang = 'en-US';
        recognition.interimResults = true;
        recognition.maxAlternatives = 1;
        recognition.continuous = false;
        const voicePrompt = 'Example. Say zero zero zero one. The system will ask score. Then say four zero. Then say zero zero zero two.';

        function startRecognitionDirectly() {
            voiceSessionActive = true;
            voiceMode = 'search';
            setVoiceStatus(voiceStatus, 'Listening... Say a student number like 0001. The system will ask score, then you say the mark. Say submit when finished.', null);
            setListeningState(true);

            try {
                recognition.start();
            } catch (error) {
                setListeningState(false);
                voiceSessionActive = false;
                setVoiceStatus(voiceStatus, 'Voice recognition is busy. Please try again.', 'error');
            }
        }

        async function greetAndRequestMicrophone() {
            const permissionState = await getMicrophonePermissionState();
            const greetingName = teacherGreetingName();

            if (permissionState === 'granted') {
                const grantedMessage = `Hello ${greetingName}. Microphone access granted. Let's start.`;
                setVoiceStatus(voiceStatus, grantedMessage, 'success');
                speakVoicePrompt(grantedMessage, function () {
                    startRecognitionDirectly();
                });
                return;
            }

            const requestMessage = permissionState === 'denied'
                ? `Hello ${greetingName}. Microphone access is blocked. Please allow microphone access in your browser, then try again.`
                : `Hello ${greetingName}. Microphone permission is needed. Please allow microphone access in the browser prompt.`;

            setVoiceStatus(voiceStatus, requestMessage, permissionState === 'denied' ? 'error' : null);

            speakVoicePrompt(requestMessage, async function () {
                if (!navigator.mediaDevices?.getUserMedia) {
                    startRecognitionDirectly();
                    return;
                }

                try {
                    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
                    stream.getTracks().forEach(function (track) {
                        track.stop();
                    });

                    const grantedMessage = 'Microphone access granted. Let us start.';
                    setVoiceStatus(voiceStatus, grantedMessage, 'success');
                    speakVoicePrompt(grantedMessage, function () {
                        startRecognitionDirectly();
                    });
                } catch (error) {
                    const message = permissionState === 'denied'
                        ? 'Microphone permission is still denied.'
                        : 'Microphone permission was denied.';
                    setVoiceStatus(voiceStatus, message, 'error');
                    speakShortPrompt(message);
                }
            });
        }

        function setListeningState(listening) {
            isListening = listening;
            voiceButton.classList.toggle('is-listening', listening);
            voiceButton.innerHTML = listening
                ? '<i class="bi bi-mic-mute-fill"></i><span>Stop Listening</span>'
                : '<i class="bi bi-mic-fill"></i><span>Listen Now</span>';
        }
        recognition.addEventListener('start', function () {
            if (searchInput) {
                if (!activeVoiceStudentKey) {
                    searchInput.value = '';
                    searchInput.dispatchEvent(new Event('input', { bubbles: true }));
                }
            }
        });

        recognition.addEventListener('result', function (event) {
            const latestTranscript = Array.from(event.results)
                .map((result) => result[0]?.transcript || '')
                .join(' ')
                .trim();
            const normalizedTranscript = normalizeIdentifier(latestTranscript);

            const liveIdentifier = extractLiveIdentifier(stripVoiceCommandWords(latestTranscript));
            if (searchInput && voiceMode === 'search' && liveIdentifier) {
                searchInput.value = normalizeExamSuffix(liveIdentifier);
                searchInput.dispatchEvent(new Event('input', { bubbles: true }));
            }

            const finalResult = event.results[event.results.length - 1];
            if (!finalResult?.isFinal) {
                if (latestTranscript) {
                    setVoiceStatus(voiceStatus, `Hearing: ${latestTranscript}`, null);
                }
                return;
            }

            const transcript = finalResult[0]?.transcript?.trim() || latestTranscript;
            const normalizedFinalTranscript = normalizeIdentifier(transcript);
            const activeRow = getActiveVoiceStudentRow(tableRoot);

            if (/\bsubmit\b/.test(normalizedFinalTranscript)) {
                const missingScores = countStudentsWithoutScores(tableRoot);
                voiceSessionActive = false;
                setListeningState(false);
                if (missingScores > 0) {
                    const message = 'Sorry, there are students with no marks. Submitting available marks now.';
                    setVoiceStatus(voiceStatus, message, 'error');
                    speakShortPrompt('Sorry, there are students with no marks.');
                } else {
                    setVoiceStatus(voiceStatus, 'Submitting marks now...', 'success');
                    speakShortPrompt(`Congratulations ${teacherName}, you have finished your work.`);
                }
                window.setTimeout(function () {
                    form.requestSubmit();
                }, 900);
                return;
            }

            if (/\bnext\b/.test(normalizedFinalTranscript)) {
                setActiveVoiceStudent(tableRoot, null);
                if (searchInput) {
                    searchInput.value = '';
                    searchInput.dispatchEvent(new Event('input', { bubbles: true }));
                }
                setVoiceStatus(voiceStatus, 'Cleared. Say the next student number.', null);
                return;
            }

            const scoreAnalysis = analyzeScoreOnlyValue(transcript);
            const scoreOnly = scoreAnalysis.kind === 'ok' ? scoreAnalysis.score : null;

            if (activeRow && voiceMode === 'awaiting-score' && scoreOnly !== null) {
                const scoreInput = activeRow.querySelector('.score-input');
                if (!scoreInput) {
                    setVoiceStatus(voiceStatus, 'Selected student row is missing a score field.', 'error');
                    return;
                }

                scoreInput.value = formatVoiceScore(scoreOnly);
                scoreInput.dispatchEvent(new Event('input', { bubbles: true }));
                scoreInput.dispatchEvent(new Event('change', { bubbles: true }));
                activeRow.scrollIntoView({ behavior: 'smooth', block: 'center' });
                flashVoiceRow(activeRow);
                setScoreFocusState(activeRow, false);
                setActiveVoiceStudent(tableRoot, null);
                voiceMode = 'search';
                if (searchInput) {
                    searchInput.value = '';
                    searchInput.dispatchEvent(new Event('input', { bubbles: true }));
                }

                setVoiceStatus(voiceStatus, `Filled ${formatVoiceScore(scoreOnly)} for ${activeStudentLabel(activeRow)}. Now say the next student number.`, 'success');
                return;
            }

            if (activeRow && voiceMode === 'awaiting-score' && scoreAnalysis.kind === 'too_high') {
                const message = 'Maximum score needed is not above 100 value.';
                setVoiceStatus(voiceStatus, message, 'error');
                speakShortPrompt(message);
                return;
            }

            const identifier = normalizeExamSuffix(stripVoiceCommandWords(transcript));
            if (!identifier) {
                setVoiceStatus(voiceStatus, `Could not understand "${transcript}". Say a student number like 0001, then say the score when asked.`, 'error');
                return;
            }

            const row = findStudentRowByVoice(tableRoot, identifier);
            if (!row) {
                const message = 'That examination number not found.';
                setVoiceStatus(voiceStatus, message, 'error');
                speakShortPrompt(message);
                return;
            }

            if (searchInput) {
                searchInput.value = identifier;
                searchInput.dispatchEvent(new Event('input', { bubbles: true }));
            }

            setActiveVoiceStudent(tableRoot, row);
            voiceMode = 'awaiting-score';
            row.scrollIntoView({ behavior: 'smooth', block: 'center' });
            flashVoiceRow(row);
            setScoreFocusState(row, true);

            setVoiceStatus(voiceStatus, `${activeStudentLabel(row)} selected. Now say score value.`, 'success');
            speakShortPrompt('Score?');
        });

        recognition.addEventListener('error', function (event) {
            const message = event.error === 'not-allowed'
                ? 'Microphone permission was denied.'
                : event.error === 'no-speech'
                    ? 'No speech detected. Try again.'
                    : 'Voice entry could not start properly.';
            setVoiceStatus(voiceStatus, message, 'error');
        });

        recognition.addEventListener('end', function () {
            if (voiceSessionActive) {
                window.setTimeout(function () {
                    try {
                        recognition.start();
                    } catch (error) {
                        setListeningState(false);
                        voiceSessionActive = false;
                    }
                }, 150);
                return;
            }

            setListeningState(false);
        });

        voiceButton.addEventListener('click', function () {
            if (voiceSessionActive) {
                voiceSessionActive = false;
                recognition.stop();
                setListeningState(false);
                setVoiceStatus(voiceStatus, 'Voice session stopped. Tap Listen Now when you want to continue.', null);
                return;
            }

            greetAndRequestMicrophone();
        });

        if (voiceDemoButton) {
            voiceDemoButton.addEventListener('click', function () {
                setVoiceStatus(voiceStatus, 'Playing voice example...', null);
                speakVoicePrompt(voicePrompt, function () {
                    setVoiceStatus(voiceStatus, 'Demo finished. Tap Listen Now and say 0001. The system will say score, then you say four zero.', null);
                });
            });
        }
    }

    function initReasonInputs(tableRoot) {
        tableRoot.querySelectorAll('.reason-select').forEach(function (select) {
            select.addEventListener('change', function () {
                const sid = this.getAttribute('data-student');
                const otherInput = tableRoot.querySelector(`input[name="reason_other[${sid}]"]`);

                this.classList.remove('is-invalid');
                if (!otherInput) {
                    return;
                }

                if (this.value === 'other') {
                    otherInput.classList.remove('d-none');
                } else {
                    otherInput.value = '';
                    otherInput.classList.add('d-none');
                    otherInput.classList.remove('is-invalid');
                }
            });
        });
    }

    function initScoreInputs(tableRoot) {
        const form = tableRoot.querySelector('.teacher-marks-form');
        if (!form) {
            return;
        }

        const subjectLevel = form.dataset.subjectLevel || '';
        const gradingConfig = parseGradingConfig(form);
        tableRoot.querySelectorAll('#students-table-body tr').forEach(function (row) {
            const scoreInput = row.querySelector('.score-input');
            if (!scoreInput) {
                return;
            }

            updateRow(row, subjectLevel, gradingConfig);
            scoreInput.addEventListener('input', function () {
                updateRow(row, subjectLevel, gradingConfig);
            });
        });
    }

    function initFormValidation(tableRoot) {
        const form = tableRoot.querySelector('.teacher-marks-form');
        if (!form) {
            return;
        }

        form.addEventListener('submit', function (event) {
            form.querySelectorAll('.score-input').forEach(function (input) {
                const sid = input.name.match(/\d+/)?.[0];
                const reasonSelect = sid ? form.querySelector(`select[name="reasons[${sid}]"]`) : null;
                const otherInput = sid ? form.querySelector(`input[name="reason_other[${sid}]"]`) : null;

                if (!input.value && reasonSelect) {
                    const reasonSelectUi = reasonSelect.id ? form.querySelector(`[data-target="${reasonSelect.id}"]`) : null;
                    reasonSelect.style.display = '';
                    const needsOther = reasonSelect.value === 'other';
                    const hasReason = !!reasonSelect.value && (!needsOther || (otherInput && otherInput.value.trim()));

                    reasonSelect.classList.toggle('is-invalid', !hasReason);
                    if (reasonSelectUi) {
                        syncCustomSelect(reasonSelectUi);
                    }
                    if (otherInput) {
                        otherInput.classList.toggle('is-invalid', needsOther && !otherInput.value.trim());
                    }
                }
            });
        });
    }

    function initMarksTable() {
        const tableRoot = tableContainer;
        syncAllCustomSelects();
        initSearch(tableRoot);
        initVoiceEntry(tableRoot);
        initReasonInputs(tableRoot);
        initScoreInputs(tableRoot);
        initFormValidation(tableRoot);
    }

    async function refreshFilters() {
        const requestId = ++requestSequence;
        const params = new URLSearchParams();
        const selectedSubjectOption = subjectFilter.options[subjectFilter.selectedIndex];

        if (subjectFilter.value) params.set('subject_id', subjectFilter.value);
        if (selectedSubjectOption?.dataset?.subjectLevel) params.set('subject_level', selectedSubjectOption.dataset.subjectLevel);
        if (classFilter.value) params.set('class_id', classFilter.value);
        if (academicYearFilter.value) params.set('academic_year_id', academicYearFilter.value);
        if (examFilter.value) params.set('exam_id', examFilter.value);

        setLoading(true);

        try {
            const response = await fetch(`${filterEndpoint}?${params.toString()}`, {
                headers: {
                    'X-Requested-With': 'XMLHttpRequest',
                    'Accept': 'application/json',
                },
                credentials: 'same-origin',
                cache: 'no-store',
            });

            if (!response.ok) {
                throw new Error('Failed to load marks filters.');
            }

            const payload = await response.json();
            if (requestId !== requestSequence) {
                return;
            }

            subjectFilter.value = payload.selected.subject_id ? String(payload.selected.subject_id) : '';
            updateFilterState(payload);
            classFilter.value = payload.selected.class_id ? String(payload.selected.class_id) : '';
            academicYearFilter.value = payload.selected.academic_year_id ? String(payload.selected.academic_year_id) : '';
            examFilter.value = payload.selected.exam_id ? String(payload.selected.exam_id) : '';
            syncAllCustomSelects();

            tableContainer.innerHTML = payload.tableHtml;
            initMarksTable();
            updateUrl(payload.selected);
        } catch (error) {
            console.error(error);
            Swal.fire({
                icon: 'error',
                title: 'Unable to load data',
                text: 'The marks filters could not be updated right now.',
                confirmButtonText: 'OK',
            });
        } finally {
            if (requestId === requestSequence) {
                setLoading(false);
            }
        }
    }

    [subjectFilter, classFilter, academicYearFilter, examFilter].forEach(function (select) {
        if (select) {
            select.addEventListener('change', refreshFilters);
        }
    });

    document.addEventListener('click', function (event) {
        if (!event.target.closest('[data-custom-select]')) {
            closeAllCustomSelects();
        }
    });

    syncAllCustomSelects();
    initMarksTable();
});
