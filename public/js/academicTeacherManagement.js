document.addEventListener('DOMContentLoaded', function () {
  const teachersTableBody = document.getElementById('teachers-table-body');
  const loadMoreTeachersButton = document.getElementById('load-more-teachers');
  const teacherFilterForm = document.getElementById('teacherFilterForm');
  const teacherSearchInput = document.getElementById('search');
  let isLoadingTeachers = false;
  let teacherSearchDebounce;

  document.querySelectorAll('.teacher-auto-filter').forEach((element) => {
    element.addEventListener('change', function () {
      if (teacherFilterForm) {
        teacherFilterForm.submit();
      }
    });
  });

  if (teacherSearchInput && teacherFilterForm) {
    teacherSearchInput.addEventListener('input', function () {
      window.clearTimeout(teacherSearchDebounce);
      teacherSearchDebounce = window.setTimeout(() => {
        teacherFilterForm.submit();
      }, 400);
    });
  }

  document.addEventListener('click', function (event) {
    const toggleButton = event.target.closest('.teacher-password-toggle');

    if (!toggleButton) {
      return;
    }

    const inputGroup = toggleButton.closest('.input-group');
    const passwordInput = inputGroup ? inputGroup.querySelector('.teacher-password-input') : null;
    const icon = toggleButton.querySelector('i');

    if (!passwordInput || !icon) {
      return;
    }

    const showingPassword = passwordInput.type === 'text';
    passwordInput.type = showingPassword ? 'password' : 'text';
    icon.className = showingPassword ? 'bi bi-eye' : 'bi bi-eye-slash';
    toggleButton.setAttribute('aria-label', showingPassword ? 'Show password' : 'Hide password');
  });

  document.addEventListener('click', function (event) {
    const deleteButton = event.target.closest('.delete-button');

    if (!deleteButton) {
      return;
    }

    const form = deleteButton.closest('form');

    Swal.fire({
      title: 'Are you sure?',
      text: 'This teacher record, linked subjects, and assigned classes will be removed.',
      icon: 'warning',
      width: 320,
      padding: '0.9rem',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: '<i class="bi bi-trash"></i> Delete',
      cancelButtonText: '<i class="bi bi-x-circle"></i> Cancel',
      customClass: {
        popup: 'exam-delete-alert',
        title: 'exam-delete-alert-title',
        htmlContainer: 'exam-delete-alert-text',
        icon: 'exam-delete-alert-icon',
        confirmButton: 'btn btn-outline-danger btn-sm px-3',
        cancelButton: 'btn btn-outline-secondary btn-sm px-3'
      },
      allowHtml: true,
      buttonsStyling: false
    }).then((result) => {
      if (result.isConfirmed) {
        form.submit();
      }
    });
  });

  function updateTeacherLoadMoreState(nextPageUrl) {
    if (!loadMoreTeachersButton) {
      return;
    }

    if (!nextPageUrl) {
      loadMoreTeachersButton.classList.add('d-none');
      loadMoreTeachersButton.dataset.nextPage = '';
      return;
    }

    loadMoreTeachersButton.classList.remove('d-none');
    loadMoreTeachersButton.dataset.nextPage = nextPageUrl;
  }

  function removeTeacherEmptyStateRow() {
    if (!teachersTableBody) {
      return;
    }

    const emptyRow = teachersTableBody.querySelector('.empty-state-row');

    if (emptyRow) {
      emptyRow.remove();
    }
  }

  function loadMoreTeachers() {
    if (!loadMoreTeachersButton) {
      return;
    }

    const nextPageUrl = loadMoreTeachersButton.dataset.nextPage;

    if (!nextPageUrl || isLoadingTeachers) {
      return;
    }

    isLoadingTeachers = true;
    loadMoreTeachersButton.disabled = true;
    loadMoreTeachersButton.innerHTML = '<i class="bi bi-arrow-down-circle me-2"></i><span class="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>Loading more...';

    fetch(nextPageUrl, {
      headers: {
        'X-Requested-With': 'XMLHttpRequest',
        'Accept': 'application/json'
      }
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.rows && teachersTableBody) {
          removeTeacherEmptyStateRow();
          teachersTableBody.insertAdjacentHTML('beforeend', data.rows);
        }

        updateTeacherLoadMoreState(data.next_page_url);
      })
      .catch(() => {
        Swal.fire({
          icon: 'error',
          title: 'Load failed',
          text: 'Unable to load more teachers right now.'
        });
      })
      .finally(() => {
        isLoadingTeachers = false;

        if (loadMoreTeachersButton) {
          loadMoreTeachersButton.disabled = false;
          loadMoreTeachersButton.innerHTML = '<i class="bi bi-arrow-down-circle"></i> Load More';
        }
      });
  }

  if (loadMoreTeachersButton) {
    loadMoreTeachersButton.addEventListener('click', loadMoreTeachers);

    const loadMoreTeacherObserver = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          loadMoreTeachers();
        }
      });
    }, {
      rootMargin: '200px 0px'
    });

    loadMoreTeacherObserver.observe(loadMoreTeachersButton);
  }
});
