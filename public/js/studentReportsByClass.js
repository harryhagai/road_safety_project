(function () {
    const page = document.querySelector('[data-student-reports-page]');

    if (!page) {
        return;
    }

    const filterForm = document.getElementById('studentReportsFilterForm');
    const searchInput = page.querySelector('[data-student-report-search]');
    const studentCards = Array.from(page.querySelectorAll('[data-student-card]'));
    const visibleCount = page.querySelector('[data-visible-count]');
    const emptyState = page.querySelector('[data-search-empty]');
    const pdfButton = page.querySelector('[data-generate-pdf]');
    const csrfToken = document.querySelector('meta[name="csrf-token"]')?.getAttribute('content') || '';
    const pdfStartUrl = page.dataset.pdfStartUrl || '';
    const pdfStatusUrlTemplate = page.dataset.pdfStatusUrlTemplate || '';
    const pdfDefaultButtonHtml = pdfButton ? pdfButton.innerHTML : '';
    let pdfProgress = 1;

    const normalize = (value) => (value || '').toString().toLowerCase().trim();

    const applyStudentSearch = () => {
        if (!searchInput || studentCards.length === 0) {
            return;
        }

        const searchTerm = normalize(searchInput.value);
        let matches = 0;

        studentCards.forEach((card) => {
            const haystack = normalize(card.dataset.studentSearch);
            const matched = !searchTerm || haystack.includes(searchTerm);
            card.classList.toggle('d-none', !matched);

            if (matched) {
                matches += 1;
            }
        });

        if (visibleCount) {
            visibleCount.textContent = matches;
        }

        if (emptyState) {
            emptyState.classList.toggle('d-none', matches !== 0);
        }
    };

    const setPdfButtonState = (isLoading, label) => {
        if (!pdfButton) {
            return;
        }

        if (isLoading) {
            pdfButton.disabled = true;
            pdfButton.innerHTML = `
                <span class="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>${label}
            `;
            return;
        }

        pdfButton.disabled = false;
        pdfButton.innerHTML = label || pdfDefaultButtonHtml;
    };

    const showErrorAlert = (message) => {
        if (window.Swal) {
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: message,
            });
            return;
        }

        window.alert(message);
    };

    const getStatusUrl = (jobId) => pdfStatusUrlTemplate.replace('__JOB__', encodeURIComponent(jobId));
    const getDownloadUrl = (jobId) => `/student-reports/class/download-pdf/${encodeURIComponent(jobId)}`;

    const showPdfStatusPopup = () => {
        if (!window.Swal) {
            return false;
        }

        Swal.fire({
            title: 'PDF Generation Status',
            width: 360,
            padding: '0.95rem',
            showConfirmButton: false,
            allowOutsideClick: false,
            allowEscapeKey: true,
            customClass: {
                popup: 'pdf-status-alert',
                title: 'pdf-status-alert-title',
                htmlContainer: 'pdf-status-alert-html',
            },
            html: `
                <div class="pdf-status-body">
                  <div class="pdf-status-progress">
                    <div class="pdf-status-progress-bar" data-pdf-progress-bar>1%</div>
                  </div>
                  <div class="pdf-status-spinner" data-pdf-spinner></div>
                  <div class="pdf-status-text" data-pdf-status-text>Initializing PDF generation...</div>
                  <div class="pdf-status-detail" data-pdf-status-detail>Please wait while we process your request</div>
                  <div class="pdf-status-actions">
                    <button type="button" class="btn btn-outline-secondary btn-sm px-3" data-pdf-close-btn>Close</button>
                    <a href="#" class="btn btn-outline-primary btn-sm px-3 pdf-status-download-btn" data-pdf-download-btn target="_blank" rel="noopener">
                      <i class="bi bi-download me-1"></i>Download PDF
                    </a>
                  </div>
                </div>
            `,
            didOpen: () => {
                Swal.getHtmlContainer()
                    ?.querySelector('[data-pdf-close-btn]')
                    ?.addEventListener('click', () => Swal.close());
            },
        });

        return true;
    };

    const setProgressState = (percentage, detail, barBackground, titleText) => {
        pdfProgress = percentage;

        const container = window.Swal ? Swal.getHtmlContainer() : null;
        const progressBar = container?.querySelector('[data-pdf-progress-bar]');
        const statusText = container?.querySelector('[data-pdf-status-text]');
        const statusDetail = container?.querySelector('[data-pdf-status-detail]');

        if (progressBar) {
            progressBar.style.width = `${percentage}%`;
            progressBar.textContent = `${percentage}%`;
            progressBar.style.background = barBackground;
        }

        if (statusDetail) {
            statusDetail.textContent = detail;
        }

        if (statusText && titleText) {
            statusText.textContent = titleText;
        }
    };

    const pollPdfStatus = async (jobId) => {
        try {
            const response = await fetch(getStatusUrl(jobId), {
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
                setProgressState(
                    100,
                    payload.progress_label
                        ? `Generated ${payload.progress_label} reports. Your ZIP file is ready for download.`
                        : 'Your student reports ZIP file is ready for download',
                    'linear-gradient(90deg, #198754 0%, #20c997 100%)',
                    'Report generation completed!'
                );

                const container = Swal.getHtmlContainer();
                const spinner = container?.querySelector('[data-pdf-spinner]');
                const downloadBtn = container?.querySelector('[data-pdf-download-btn]');

                spinner?.remove();

                if (downloadBtn) {
                    downloadBtn.classList.remove('pdf-status-download-btn');
                    downloadBtn.setAttribute('href', payload.download_url || getDownloadUrl(jobId));
                    downloadBtn.innerHTML = '<i class="bi bi-download me-1"></i>Download ZIP';
                }

                return;
            }

            if (status === 'failed' || status === 'error') {
                setProgressState(
                    0,
                    payload.error_message || 'Unknown error occurred',
                    'linear-gradient(90deg, #dc3545 0%, #fd7e14 100%)',
                    'PDF generation failed'
                );
                Swal.getHtmlContainer()?.querySelector('[data-pdf-spinner]')?.remove();
                return;
            }

            if (status === 'processing') {
                const nextProgress = payload.progress !== undefined
                    ? Math.min(95, Number(payload.progress))
                    : Math.min(95, pdfProgress + Math.floor(Math.random() * 8) + 4);
                const progressLabel = payload.progress_label || '';
                const totalCount = Number(payload.total_count || 0);
                const generatedCount = Number(payload.generated_count || 0);
                const detail = progressLabel && totalCount > 0
                    ? `Generated ${progressLabel} reports (${nextProgress}%)`
                    : generatedCount > 0
                        ? `Generated ${generatedCount} reports (${nextProgress}%)`
                        : `Compiling student report pages (${nextProgress}%)`;

                setProgressState(
                    nextProgress,
                    detail,
                    nextProgress < 70
                        ? 'linear-gradient(90deg, #0d6efd 0%, #3d8bfd 100%)'
                        : 'linear-gradient(90deg, #198754 0%, #20c997 100%)',
                    'Processing your PDF...'
                );
            } else {
                const nextProgress = Math.min(10, pdfProgress + 1);

                setProgressState(
                    nextProgress,
                    'Your request is in the queue and will start shortly',
                    'linear-gradient(90deg, #0d6efd 0%, #3d8bfd 100%)',
                    'PDF queued for generation'
                );
            }

            window.setTimeout(() => pollPdfStatus(jobId), 2200);
        } catch (error) {
            console.error('Error polling PDF status:', error);
            setProgressState(
                pdfProgress,
                'Please refresh and try again.',
                'linear-gradient(90deg, #dc3545 0%, #fd7e14 100%)',
                'Error checking status'
            );
            window.Swal?.getHtmlContainer()?.querySelector('[data-pdf-spinner]')?.remove();
        }
    };

    const startPdfGeneration = async () => {
        if (!filterForm || !pdfButton || !pdfStartUrl || !pdfStatusUrlTemplate || !csrfToken) {
            return;
        }

        const formData = new FormData(filterForm);
        const missingFields = ['academic_year', 'class_id', 'term'].filter((field) => !formData.get(field));

        if (missingFields.length > 0) {
            showErrorAlert('Select academic year, class, and term before generating the PDF.');
            return;
        }

        setPdfButtonState(true, 'Preparing PDF...');

        if (!showPdfStatusPopup()) {
            showErrorAlert('SweetAlert is not available for PDF tracking.');
            setPdfButtonState(false);
            return;
        }

        setProgressState(
            1,
            'Please wait while we process your request',
            'linear-gradient(90deg, #0d6efd 0%, #3d8bfd 100%)',
            'Initializing PDF generation...'
        );

        try {
            const response = await fetch(pdfStartUrl, {
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
                throw new Error('Failed to start PDF generation.');
            }

            const payload = await response.json();

            if (!payload.job_id) {
                throw new Error(payload.message || 'Unexpected response from server.');
            }

            pollPdfStatus(payload.job_id);
        } catch (error) {
            window.Swal?.close();
            showErrorAlert(error.message || 'Failed to start PDF generation. Please try again.');
        } finally {
            setPdfButtonState(false);
        }
    };

    if (searchInput) {
        searchInput.addEventListener('input', applyStudentSearch);
        applyStudentSearch();
    }

    if (pdfButton) {
        pdfButton.addEventListener('click', startPdfGeneration);
    }
})();
