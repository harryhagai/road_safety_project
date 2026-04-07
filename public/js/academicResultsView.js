document.addEventListener('DOMContentLoaded', () => {
  const root = document.querySelector('.academic-results-view');
  const exportBtn = document.getElementById('resultsExportPdfBtn');
  const downloadSection = document.getElementById('downloadSection');
  const downloadLink = document.getElementById('downloadLink');
  const tableBody = document.getElementById('resultsTableBody');
  const lazyLoader = document.getElementById('resultsLazyLoader');
  const lazyEnd = document.getElementById('resultsLazyEnd');
  const lazySentinel = document.getElementById('resultsLazySentinel');

  if (!root) {
    return;
  }
  const examId = root.dataset.examId;
  const className = root.dataset.className || '';
  const year = root.dataset.year;
  const mobilityExamId = root.dataset.mobilityExamId || '';
  const sortBy = root.dataset.sortBy || 'position_asc';
  const exportUrlTemplate = root.dataset.exportUrlTemplate || '';
  const statusUrlTemplate = root.dataset.statusUrlTemplate || '';
  const downloadUrlTemplate = root.dataset.downloadUrlTemplate || '';
  const rowsUrlTemplate = root.dataset.rowsUrlTemplate || '';
  const chunkSize = Number(root.dataset.chunkSize || 30);
  let pdfProgress = 1;
  let currentPage = 1;
  let isFetchingRows = false;
  let hasMoreRows = root.dataset.hasMoreRows === '1';

  const buildUrl = (template, replacements) => {
    let url = template;
    Object.entries(replacements).forEach(([key, value]) => {
      url = url.replace(key, value);
    });
    return url;
  };

  const getExportUrl = () => {
    const exportUrl = buildUrl(exportUrlTemplate, {
      '__EXAM__': encodeURIComponent(examId),
      '__CLASS__': encodeURIComponent(className),
      '__YEAR__': encodeURIComponent(year),
    });

    const query = new URLSearchParams();
    if (mobilityExamId) {
      query.set('mobility_exam_id', mobilityExamId);
    }
    if (sortBy) {
      query.set('sort_by', sortBy);
    }

    return query.toString() ? `${exportUrl}?${query.toString()}` : exportUrl;
  };

  const getStatusUrl = (jobId) => buildUrl(statusUrlTemplate, {
    '__JOB__': encodeURIComponent(jobId),
  });

  const getDownloadUrl = (jobId) => buildUrl(downloadUrlTemplate, {
    '__JOB__': encodeURIComponent(jobId),
  });

  const getRowsUrl = (page) => {
    const rowsUrl = buildUrl(rowsUrlTemplate, {
      '__EXAM__': encodeURIComponent(examId),
      '__CLASS__': encodeURIComponent(className),
      '__YEAR__': encodeURIComponent(year),
    });

    const query = new URLSearchParams({
      page: String(page),
      chunk_size: String(chunkSize),
    });

    if (mobilityExamId) {
      query.set('mobility_exam_id', mobilityExamId);
    }
    if (sortBy) {
      query.set('sort_by', sortBy);
    }

    return `${rowsUrl}?${query.toString()}`;
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
            <a href="#" class="btn btn-outline-primary btn-sm px-3 pdf-status-download-btn" data-pdf-download-btn>
              <i class="bi bi-download me-1"></i>Download PDF
            </a>
          </div>
        </div>
      `,
      didOpen: () => {
        const container = Swal.getHtmlContainer();

        container
          ?.querySelector('[data-pdf-close-btn]')
          ?.addEventListener('click', () => Swal.close());

        container
          ?.querySelector('[data-pdf-download-btn]')
          ?.addEventListener('click', () => {
            window.setTimeout(() => Swal.close(), 150);
          });
      },
    });

    return true;
  };

  const setProgressState = (percentage, detail, barBackground, titleText) => {
    pdfProgress = percentage;

    const container = Swal.getHtmlContainer();
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

  const pollStatus = async (jobId) => {
    try {
      const response = await fetch(getStatusUrl(jobId), {
        headers: {
          'X-Requested-With': 'XMLHttpRequest',
          'Accept': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error('Failed to fetch PDF status.');
      }

      const data = await response.json();

      if (data.status === 'completed') {
        setProgressState(
          100,
          'Your PDF is ready for download',
          'linear-gradient(90deg, #198754 0%, #20c997 100%)',
          'PDF generation completed!'
        );

        const container = Swal.getHtmlContainer();
        const spinner = container?.querySelector('[data-pdf-spinner]');
        const downloadBtn = container?.querySelector('[data-pdf-download-btn]');

        spinner?.remove();
        if (downloadBtn) {
          downloadBtn.classList.remove('pdf-status-download-btn');
          downloadBtn.setAttribute('href', getDownloadUrl(jobId));
        }

        if (downloadSection && downloadLink) {
          downloadSection.classList.remove('d-none');
          downloadLink.href = getDownloadUrl(jobId);
        }
        return;
      }

      if (data.status === 'failed') {
        setProgressState(
          0,
          data.error_message || 'Unknown error occurred',
          'linear-gradient(90deg, #dc3545 0%, #fd7e14 100%)',
          'PDF generation failed'
        );
        Swal.getHtmlContainer()?.querySelector('[data-pdf-spinner]')?.remove();
        if (downloadSection) {
          downloadSection.classList.add('d-none');
        }
        return;
      }

      if (data.status === 'processing') {
        const nextProgress = data.progress !== undefined
          ? Math.min(95, Number(data.progress))
          : Math.min(95, pdfProgress + Math.floor(Math.random() * 8) + 4);

        setProgressState(
          nextProgress,
          `Compiling student data and generating report (${nextProgress}%)`,
          nextProgress < 70
            ? 'linear-gradient(90deg, #0d6efd 0%, #3d8bfd 100%)'
            : 'linear-gradient(90deg, #198754 0%, #20c997 100%)',
          'Processing your PDF...'
        );
      } else {
        const nextProgress = Math.min(10, pdfProgress + 1);
        setProgressState(
          nextProgress,
          `Your request is in the queue (${nextProgress}%)`,
          'linear-gradient(90deg, #6c757d 0%, #adb5bd 100%)',
          'PDF queued for generation'
        );
      }

      window.setTimeout(() => pollStatus(jobId), 2200);
    } catch (error) {
      console.error('Error polling PDF status:', error);
      setProgressState(
        pdfProgress,
        'Please refresh and try again.',
        'linear-gradient(90deg, #dc3545 0%, #fd7e14 100%)',
        'Error checking status'
      );
      Swal.getHtmlContainer()?.querySelector('[data-pdf-spinner]')?.remove();
    }
  };

  if (exportBtn) {
    exportBtn.addEventListener('click', async () => {
      exportBtn.disabled = true;
      if (downloadSection) {
        downloadSection.classList.add('d-none');
      }

      if (!showPdfStatusPopup()) {
        showErrorAlert('SweetAlert is not available for PDF tracking.');
        exportBtn.disabled = false;
        return;
      }

      setProgressState(
        1,
        'Please wait while we process your request',
        'linear-gradient(90deg, #0d6efd 0%, #3d8bfd 100%)',
        'Initializing PDF generation...'
      );

      try {
        const response = await fetch(getExportUrl(), {
          headers: {
            'X-Requested-With': 'XMLHttpRequest',
            'Accept': 'application/json',
          },
        });

        if (!response.ok) {
          throw new Error('Failed to start PDF generation.');
        }

        const data = await response.json();
        if (data.status !== 'queued' || !data.job_id) {
          throw new Error(data.message || 'Unexpected response from server.');
        }

        pollStatus(data.job_id);
      } catch (error) {
        Swal.close();
        showErrorAlert(error.message || 'Failed to start PDF generation. Please try again.');
      } finally {
        exportBtn.disabled = false;
      }
    });
  }

  downloadLink?.addEventListener('click', () => {
    if (window.Swal) {
      window.setTimeout(() => Swal.close(), 150);
    }
  });

  const loadMoreRows = async () => {
    if (isFetchingRows || !hasMoreRows || !tableBody) {
      return;
    }

    isFetchingRows = true;
    lazyLoader?.classList.remove('d-none');

    try {
      const response = await fetch(getRowsUrl(currentPage + 1), {
        headers: {
          'X-Requested-With': 'XMLHttpRequest',
          'Accept': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error('Failed to load more rows.');
      }

      const data = await response.json();
      if (data.html) {
        tableBody.insertAdjacentHTML('beforeend', data.html);
      }

      currentPage += 1;
      hasMoreRows = Boolean(data.hasMore);
      if (!hasMoreRows) {
        lazyEnd?.classList.remove('d-none');
        lazySentinel?.remove();
      }
    } catch (error) {
      console.error('Lazy loading failed:', error);
      hasMoreRows = false;
      lazyEnd?.classList.remove('d-none');
      if (lazyEnd) {
        lazyEnd.textContent = 'Unable to load more students right now.';
      }
    } finally {
      isFetchingRows = false;
      lazyLoader?.classList.add('d-none');
    }
  };

  if (lazySentinel && 'IntersectionObserver' in window) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          loadMoreRows();
        }
      });
    }, {
      rootMargin: '200px 0px',
    });

    observer.observe(lazySentinel);
  }
});
