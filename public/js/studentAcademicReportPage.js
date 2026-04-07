document.addEventListener('DOMContentLoaded', () => {
    const root = document.getElementById('student-report-page-root');
    const csrfToken = document.querySelector('meta[name="csrf-token"]')?.getAttribute('content') || '';
    const dottedLoadingMarkup = (label) => `
        <span class="sar-btn-loading">
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
            <span>${label}</span>
        </span>
    `;

    if (!root) {
        return;
    }

    const showError = (message) => {
        if (window.Swal) {
            Swal.fire({
                icon: 'error',
                title: 'Request Failed',
                text: message || 'Unable to load the report right now.',
            });
            return;
        }

        window.alert(message || 'Unable to load the report right now.');
    };

    const setButtonLoadingState = (link, label) => {
        if (!link) {
            return;
        }

        link.innerHTML = dottedLoadingMarkup(label);
    };

    const triggerBlobDownload = async (url, fallbackName = 'student-report.pdf') => {
        const response = await fetch(url, {
            method: 'GET',
            headers: {
                'X-Requested-With': 'XMLHttpRequest',
            },
            cache: 'no-store',
            credentials: 'same-origin',
        });

        if (!response.ok) {
            throw new Error('Unable to download the PDF right now.');
        }

        const blob = await response.blob();
        const contentDisposition = response.headers.get('Content-Disposition') || '';
        const filenameMatch = contentDisposition.match(/filename="?([^"]+)"?/i);
        const filename = filenameMatch ? filenameMatch[1] : fallbackName;
        const blobUrl = window.URL.createObjectURL(blob);
        const downloadLink = document.createElement('a');

        downloadLink.href = blobUrl;
        downloadLink.download = filename;
        document.body.appendChild(downloadLink);
        downloadLink.click();
        downloadLink.remove();
        window.setTimeout(() => window.URL.revokeObjectURL(blobUrl), 1000);
    };

    const pollQueuedPdfStatus = async (link, statusUrl, downloadUrlTemplate) => {
        const response = await fetch(statusUrl, {
            headers: {
                Accept: 'application/json',
                'X-Requested-With': 'XMLHttpRequest',
            },
            credentials: 'same-origin',
            cache: 'no-store',
        });

        if (!response.ok) {
            throw new Error('Failed to fetch PDF status.');
        }

        const payload = await response.json();
        const status = payload.status || 'queued';

        if (status === 'completed') {
            setButtonLoadingState(link, 'Downloading PDF...');
            await triggerBlobDownload(payload.download_url || downloadUrlTemplate, 'student-report.pdf');
            return;
        }

        if (status === 'failed' || status === 'error') {
            throw new Error(payload.error_message || 'Unable to generate the PDF right now.');
        }

        const nextProgress = payload.progress !== undefined
            ? Math.min(95, Number(payload.progress))
            : 15;

        setButtonLoadingState(
            link,
            status === 'processing'
                ? (nextProgress >= 85 ? 'Finalizing PDF...' : 'Preparing PDF...')
                : 'Preparing PDF...'
        );

        await new Promise((resolve) => window.setTimeout(resolve, 1800));
        return pollQueuedPdfStatus(link, statusUrl, downloadUrlTemplate);
    };

    const startQueuedPdfDownload = async (link) => {
        const queueUrl = link.dataset.pdfQueueUrl;
        const statusUrlTemplate = link.dataset.pdfStatusUrlTemplate;
        const downloadUrlTemplateRaw = link.dataset.pdfDownloadUrlTemplate;
        const termInput = root.querySelector('select[name="term"]');
        const term = termInput ? termInput.value : '';

        if (!queueUrl || !statusUrlTemplate || !downloadUrlTemplateRaw || !csrfToken) {
            throw new Error('PDF queue configuration is missing.');
        }

        if (!term) {
            throw new Error('Select a term before downloading the PDF.');
        }

        setButtonLoadingState(link, 'Preparing PDF...');

        const formData = new FormData();
        formData.append('term', term);

        const response = await fetch(queueUrl, {
            method: 'POST',
            headers: {
                'X-CSRF-TOKEN': csrfToken,
                Accept: 'application/json',
                'X-Requested-With': 'XMLHttpRequest',
            },
            credentials: 'same-origin',
            body: formData,
        });

        if (!response.ok) {
            let message = 'Unable to start PDF generation.';
            try {
                const payload = await response.json();
                message = payload.message || message;
            } catch (error) {
                // Ignore JSON parse issues.
            }

            throw new Error(message);
        }

        const payload = await response.json();
        const jobId = payload.job_id;
        if (!jobId) {
            throw new Error(payload.message || 'Unexpected response from server.');
        }

        const statusUrl = statusUrlTemplate.replace('__JOB__', encodeURIComponent(jobId));
        const downloadUrl = downloadUrlTemplateRaw.replace('__JOB__', encodeURIComponent(jobId));

        await pollQueuedPdfStatus(link, statusUrl, downloadUrl);
    };

    const bindPdfButtons = (scope = document) => {
        scope.querySelectorAll('.js-direct-report-pdf-btn').forEach((link) => {
            if (link.dataset.boundPdf === '1') {
                return;
            }

            link.dataset.boundPdf = '1';

            link.addEventListener('click', async (event) => {
                event.preventDefault();

                const url = link.getAttribute('href');
                const originalHtml = link.innerHTML;
                const loadingText = link.dataset.loadingText || 'Preparing PDF...';

                if (!url || link.dataset.loading === '1') {
                    return;
                }

                link.dataset.loading = '1';
                link.classList.add('disabled');
                link.setAttribute('aria-disabled', 'true');
                link.innerHTML = dottedLoadingMarkup(loadingText);

                try {
                    if (link.dataset.pdfQueueUrl) {
                        await startQueuedPdfDownload(link);
                    } else {
                        await triggerBlobDownload(url, 'student-report.pdf');
                    }
                } catch (error) {
                    showError(error.message || 'Unable to generate the report PDF right now.');
                } finally {
                    link.dataset.loading = '0';
                    link.classList.remove('disabled');
                    link.removeAttribute('aria-disabled');
                    link.innerHTML = originalHtml;
                }
            });
        });
    };

    const hydrateReportHtml = (html, nextUrl = null, pushToHistory = false) => {
        const parser = new DOMParser();
        const doc = parser.parseFromString(html, 'text/html');
        const nextRoot = doc.getElementById('student-report-page-root');

        if (!nextRoot) {
            throw new Error('Unable to refresh the report content.');
        }

        root.innerHTML = nextRoot.innerHTML;

        bindPdfButtons(root);
        bindAjaxForms(root);

        if (pushToHistory && nextUrl) {
            window.history.pushState({ studentReportAjax: true }, '', nextUrl);
        }
    };

    const fetchAndRender = async (url, pushToHistory = false) => {
        try {
            const response = await fetch(url, {
                method: 'GET',
                headers: {
                    'X-Requested-With': 'XMLHttpRequest',
                    'Accept': 'text/html,application/xhtml+xml',
                },
                cache: 'no-store',
                credentials: 'same-origin',
            });

            if (!response.ok) {
                throw new Error('Unable to load the report right now.');
            }

            const html = await response.text();
            hydrateReportHtml(html, url, pushToHistory);
        } catch (error) {
            showError(error.message || 'Unable to load the report right now.');
        }
    };

    const bindAjaxForms = (scope = document) => {
        const forms = scope.matches && scope.matches('.student-report-page')
            ? scope.querySelectorAll('form')
            : scope.querySelectorAll('.student-report-page form');

        forms.forEach((form) => {
            if (form.dataset.boundAjax === '1') {
                return;
            }

            form.dataset.boundAjax = '1';

            form.addEventListener('submit', async (event) => {
                if ((form.method || 'GET').toUpperCase() !== 'GET') {
                    return;
                }

                event.preventDefault();

                const submitButton = form.querySelector('button[type="submit"]');
                const originalHtml = submitButton ? submitButton.innerHTML : '';

                const action = form.getAttribute('action') || window.location.pathname;
                const url = new URL(action, window.location.origin);
                const formData = new FormData(form);

                Array.from(formData.entries()).forEach(([key, value]) => {
                    if (value !== null && `${value}`.trim() !== '') {
                        url.searchParams.set(key, value);
                    }
                });

                if (submitButton) {
                    submitButton.disabled = true;
                    submitButton.setAttribute('aria-disabled', 'true');
                    submitButton.innerHTML = dottedLoadingMarkup('Loading report...');
                }

                try {
                    await fetchAndRender(url.toString(), true);
                } finally {
                    if (submitButton && document.body.contains(submitButton)) {
                        submitButton.disabled = false;
                        submitButton.removeAttribute('aria-disabled');
                        submitButton.innerHTML = originalHtml;
                    }
                }
            });
        });
    };

    window.addEventListener('popstate', async () => {
        if (window.location.pathname.includes('/report')) {
            await fetchAndRender(window.location.href, false);
        }
    });

    bindPdfButtons(root);
    bindAjaxForms(root);
});
