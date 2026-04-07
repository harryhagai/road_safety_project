document.addEventListener('DOMContentLoaded', function () {
    const subjectSearchInput = document.getElementById('subject-search');
    const clearSearchButton = document.getElementById('search-clear');
    const searchableItems = Array.from(document.querySelectorAll('.subject-search-item'));
    const subjectsTableBody = document.getElementById('subjects-table-body');
    const subjectsMobileList = document.getElementById('subjects-mobile-list');
    const studentsModalElement = document.getElementById('studentsModal');
    const downloadBtn = document.getElementById('downloadPdfBtn');

    function ensureEmptySearchState() {
        const existingEmptyRow = document.getElementById('subjects-search-empty-row');
        const existingMobileEmpty = document.getElementById('subjects-search-empty-mobile');
        const tableItems = searchableItems.filter((item) => item.classList.contains('subject-row'));
        const mobileItems = searchableItems.filter((item) => item.classList.contains('subject-card-item'));
        const visibleTableItems = tableItems.filter((item) => item.style.display !== 'none');
        const visibleMobileItems = mobileItems.filter((item) => item.style.display !== 'none');

        if (subjectsTableBody && visibleTableItems.length === 0 && tableItems.length > 0) {
            if (!existingEmptyRow) {
                const emptyRow = document.createElement('tr');
                emptyRow.id = 'subjects-search-empty-row';
                emptyRow.innerHTML = `
                    <td colspan="7" class="text-center py-5">
                        <i class="bi bi-search text-secondary fs-1 mb-2 d-block"></i>
                        <span class="text-muted">No subjects match your search.</span>
                    </td>
                `;
                subjectsTableBody.appendChild(emptyRow);
            }
        } else if (existingEmptyRow) {
            existingEmptyRow.remove();
        }

        if (subjectsMobileList && visibleMobileItems.length === 0 && mobileItems.length > 0) {
            if (!existingMobileEmpty) {
                const emptyState = document.createElement('div');
                emptyState.className = 'col-12';
                emptyState.id = 'subjects-search-empty-mobile';
                emptyState.innerHTML = `
                    <div class="alert alert-info text-center mb-0">
                        No subjects match your search.
                    </div>
                `;
                subjectsMobileList.appendChild(emptyState);
            }
        } else if (existingMobileEmpty) {
            existingMobileEmpty.remove();
        }
    }

    if (subjectSearchInput) {
        subjectSearchInput.addEventListener('input', function () {
            const query = this.value.trim().toLowerCase();

            searchableItems.forEach(function (item) {
                const searchableText = (item.dataset.search || '').toLowerCase();
                item.style.display = searchableText.includes(query) ? '' : 'none';
            });

            ensureEmptySearchState();
        });
    }

    if (clearSearchButton) {
        clearSearchButton.addEventListener('click', function () {
            if (subjectSearchInput) {
                subjectSearchInput.value = '';
                subjectSearchInput.dispatchEvent(new Event('input'));
                subjectSearchInput.focus();
            }
        });
    }

    if (studentsModalElement) {
        studentsModalElement.addEventListener('hidden.bs.modal', function () {
            const studentsModalBody = document.getElementById('studentsModalBody');

            studentsModalBody.innerHTML = `
                <div class="text-center py-4">
                    <span class="spinner-border text-primary" role="status"></span>
                    <span class="ms-2">Loading students...</span>
                </div>
            `;

            if (downloadBtn) {
                downloadBtn.href = '#';
                downloadBtn.style.display = 'none';
            }
        });
    }
});

function showStudentsForSubject(btn) {
    const subjectId = btn.dataset.subjectId;
    const level = btn.dataset.level;
    const classId = btn.dataset.classId;
    const subjectName = btn.dataset.subjectName;
    const studentsModalElement = document.getElementById('studentsModal');
    const studentsModalBody = document.getElementById('studentsModalBody');
    const studentsModalLabel = document.getElementById('studentsModalLabel');
    const downloadBtn = document.getElementById('downloadPdfBtn');

    if (!studentsModalElement || !studentsModalBody || !studentsModalLabel || !downloadBtn) {
        return;
    }

    const studentsModal = new bootstrap.Modal(studentsModalElement);

    studentsModalLabel.innerHTML = `<i class="bi bi-people me-2"></i> Students for ${subjectName}`;
    studentsModalBody.innerHTML = `
        <div class="text-center py-4">
            <span class="spinner-border text-primary" role="status"></span>
            <span class="ms-2">Loading students...</span>
        </div>
    `;

    studentsModal.show();

    fetch('/teacher/subjects/students?subject_id=' + subjectId + '&level=' + level + '&class_id=' + classId)
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(data => {
            let html = '';

            if (data.students && data.students.length > 0) {
                html += '<div class="table-responsive">';
                html += '<table class="table table-hover align-middle">';
                html += '<thead class="table-light">';
                html += '<tr><th>#</th><th>Student Name</th><th>Class</th></tr>';
                html += '</thead><tbody>';

                data.students.forEach(function (student, index) {
                    html += `<tr>
                        <td>${index + 1}</td>
                        <td>${student.name || 'N/A'}</td>
                        <td>${student.class_name || 'N/A'}</td>
                    </tr>`;
                });

                html += '</tbody></table></div>';
                html += `<div class="mt-3 text-muted">Total: ${data.students.length} students</div>`;

                downloadBtn.href = '/teacher/subjects/students/pdf?subject_id=' + subjectId + '&level=' + level +
                    '&class_id=' + classId;
                downloadBtn.style.display = 'inline-block';
            } else {
                html = `
                    <div class="text-center text-muted py-5">
                        <i class="bi bi-people display-4 text-secondary mb-3"></i><br>
                        <h5>No students found</h5>
                        <p class="mb-0">No students are currently assigned to this subject.</p>
                    </div>
                `;
                downloadBtn.style.display = 'none';
            }

            studentsModalBody.innerHTML = html;
        })
        .catch(error => {
            console.error('Error fetching students:', error);
            studentsModalBody.innerHTML = `
                <div class="text-center text-danger py-4">
                    <i class="bi bi-exclamation-triangle display-4 mb-3"></i><br>
                    <h5>Failed to load students</h5>
                    <p class="mb-0">Please try again later.</p>
                </div>
            `;
            downloadBtn.style.display = 'none';
        });
}
