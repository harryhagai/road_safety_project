document.addEventListener('DOMContentLoaded', () => {
  const root = document.querySelector('.academic-consolidated-view');
  const filterForm = document.getElementById('consolidatedFilterForm');
  const yearSelect = document.getElementById('academic_year');
  const classSelect = document.getElementById('class_id');
  const exportBtn = document.getElementById('consolidatedExportPdfBtn');
  const downloadSection = document.getElementById('downloadSection');
  const downloadLink = document.getElementById('downloadLink');
  const filterCard = root?.querySelector('[data-class-id]');
  const resultsTableBody = document.getElementById('resultsTableBody');
  const lazyStatus = document.getElementById('resultsTableLazyStatus');
  const lazySentinel = document.getElementById('resultsTableLazySentinel');
  const lazyRowsData = document.getElementById('consolidatedStudentRowsData');

  if (!root) {
    return;
  }

  const classesUrl = root.dataset.classesUrl || '';
  const exportUrl = root.dataset.exportUrl || '';
  const statusUrlTemplate = root.dataset.statusUrlTemplate || '';
  const downloadUrlTemplate = root.dataset.downloadUrlTemplate || '';
  const csrfToken = document.querySelector('meta[name="csrf-token"]')?.getAttribute('content') || '';
  let pdfProgress = 1;

  const buildUrl = (template, replacements) => {
    let url = template;
    Object.entries(replacements).forEach(([key, value]) => {
      url = url.replace(key, value);
    });
    return url;
  };

  const getStatusUrl = (jobId) => buildUrl(statusUrlTemplate, {
    '__JOB__': encodeURIComponent(jobId),
  });

  const getDownloadUrl = (jobId) => buildUrl(downloadUrlTemplate, {
    '__JOB__': encodeURIComponent(jobId),
  });

  const renderClassOptions = (classes, selectedClassId = '') => {
    if (!classSelect) {
      return;
    }

    classSelect.innerHTML = '<option value="">Select class</option>';

    classes.forEach((item) => {
      const option = document.createElement('option');
      option.value = item.id;
      option.textContent = item.display_name || item.name;

      if (String(selectedClassId) === String(item.id)) {
        option.selected = true;
      }

      classSelect.appendChild(option);
    });
  };

  const loadClassesByAcademicYear = async (academicYearId, selectedClassId = '') => {
    if (!classSelect) {
      return;
    }

    renderClassOptions([], '');

    if (!academicYearId || !classesUrl) {
      return;
    }

    classSelect.disabled = true;

    try {
      const params = new URLSearchParams({ academic_year_id: academicYearId });
      const response = await fetch(`${classesUrl}?${params.toString()}`, {
        headers: {
          'X-Requested-With': 'XMLHttpRequest',
          'Accept': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error('Failed to load classes.');
      }

      const data = await response.json();
      renderClassOptions(data.classes || [], selectedClassId);
    } catch (error) {
      console.error('Error loading classes:', error);
      renderClassOptions([], '');
    } finally {
      classSelect.disabled = false;
    }
  };

  if (filterForm && yearSelect && classSelect) {
    yearSelect.addEventListener('change', () => {
      classSelect.dataset.selectedClassId = '';
      loadClassesByAcademicYear(yearSelect.value, '');
    });

    if (yearSelect.value) {
      loadClassesByAcademicYear(yearSelect.value, classSelect.dataset.selectedClassId || classSelect.value || '');
    }
  }

  if (resultsTableBody && lazyRowsData) {
    const loadingRow = document.getElementById('resultsTableLoadingRow');
    const batchSize = Number(filterCard?.dataset.lazyBatchSize || 40);
    let renderedRows = 0;
    let observer = null;

    const rows = (() => {
      try {
        return JSON.parse(lazyRowsData.textContent || '[]');
      } catch (error) {
        console.error('Failed to parse consolidated rows data:', error);
        return [];
      }
    })();

    const renderStatus = () => {
      if (!lazyStatus) {
        return;
      }

      if (!rows.length) {
        lazyStatus.classList.add('d-none');
        return;
      }

      lazyStatus.classList.remove('d-none');
      lazyStatus.textContent = `Showing ${renderedRows} of ${rows.length} students`;
    };

    const createCell = (value, className = '') => {
      const td = document.createElement('td');
      if (className) {
        td.className = className;
      }

      if (value === null || value === undefined || value === '') {
        td.innerHTML = '<span class="academic-results-empty">--</span>';
      } else {
        td.textContent = String(value);
      }

      return td;
    };

    const appendBatch = () => {
      if (renderedRows >= rows.length) {
        observer?.disconnect();
        lazySentinel?.classList.add('d-none');
        renderStatus();
        return;
      }

      const fragment = document.createDocumentFragment();
      const nextRows = rows.slice(renderedRows, renderedRows + batchSize);

      nextRows.forEach((row) => {
        const tr = document.createElement('tr');
        tr.appendChild(createCell(row.no));
        tr.appendChild(createCell(row.full_name, 'academic-results-student-col'));
        (row.subjects || []).forEach((value) => {
          tr.appendChild(createCell(value));
        });
        tr.appendChild(createCell(row.total));
        tr.appendChild(createCell(row.average));
        tr.appendChild(createCell(row.grade));
        tr.appendChild(createCell(row.division));
        tr.appendChild(createCell(row.position));
        fragment.appendChild(tr);
      });

      loadingRow?.remove();
      resultsTableBody.appendChild(fragment);
      renderedRows += nextRows.length;
      renderStatus();
    };

    appendBatch();

    if (lazySentinel && renderedRows < rows.length && 'IntersectionObserver' in window) {
      observer = new IntersectionObserver((entries) => {
        if (entries.some((entry) => entry.isIntersecting)) {
          appendBatch();
        }
      }, {
        rootMargin: '200px 0px',
      });

      observer.observe(lazySentinel);
    } else {
      while (renderedRows < rows.length) {
        appendBatch();
      }
    }
  }

  if (!exportBtn || !filterCard) {
    return;
  }

  const classId = filterCard.dataset.classId || '';
  const academicYear = filterCard.dataset.academicYear || '';
  const term = filterCard.dataset.term || '';

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
        Swal.getHtmlContainer()
          ?.querySelector('[data-pdf-close-btn]')
          ?.addEventListener('click', () => Swal.close());
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
          'Your consolidated PDF is ready for download',
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

        downloadSection?.classList.remove('d-none');
        if (downloadLink) {
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
        downloadSection?.classList.add('d-none');
        return;
      }

      const nextProgress = data.progress !== undefined
        ? Math.min(95, Number(data.progress))
        : Math.min(95, pdfProgress + 6);

      setProgressState(
        nextProgress,
        `Compiling consolidated rows and analytics (${nextProgress}%)`,
        nextProgress < 70
          ? 'linear-gradient(90deg, #0d6efd 0%, #3d8bfd 100%)'
          : 'linear-gradient(90deg, #198754 0%, #20c997 100%)',
        data.status === 'queued' ? 'PDF queued for generation' : 'Processing your PDF...'
      );

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

  exportBtn.addEventListener('click', async () => {
    exportBtn.disabled = true;
    downloadSection?.classList.add('d-none');

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
      const response = await fetch(exportUrl, {
        method: 'POST',
        headers: {
          'X-Requested-With': 'XMLHttpRequest',
          'Accept': 'application/json',
          'Content-Type': 'application/json',
          'X-CSRF-TOKEN': csrfToken,
        },
        body: JSON.stringify({
          class_id: classId,
          academic_year: academicYear,
          term,
        }),
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
});
