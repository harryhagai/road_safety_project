document.addEventListener('DOMContentLoaded', () => {
    const addSpinner = (button, label) => {
        if (!button) return;

        const text = label || 'Please wait...';
        button.disabled = true;
        button.innerHTML = `<span class="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>${text}`;
    };

    const wireFormSpinner = (formSelector, buttonSelector, label) => {
        const form = document.querySelector(formSelector);
        if (!form) return;

        form.addEventListener('submit', () => {
            addSpinner(form.querySelector(buttonSelector), label);
        });
    };

    document.querySelectorAll('.delete-button').forEach((button) => {
        button.addEventListener('click', function () {
            const form = this.closest('form');
            if (!form || typeof Swal === 'undefined') return;

            Swal.fire({
                title: 'Are you sure?',
                text: 'This academic year will be deleted!',
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
                    addSpinner(this, 'Deleting...');
                    form.submit();
                }
            });
        });
    });

    document.querySelectorAll('.js-show-year').forEach((button) => {
        button.addEventListener('click', function () {
            document.getElementById('showYearName').textContent = this.dataset.name;
            document.getElementById('showYearStart').textContent = this.dataset.start;
            document.getElementById('showYearEnd').textContent = this.dataset.end;
            document.getElementById('showYearLevel').textContent = this.dataset.level;
            document.getElementById('showYearActive').textContent = this.dataset.active;
        });
    });

    document.querySelectorAll('.js-edit-year').forEach((button) => {
        button.addEventListener('click', function () {
            const form = document.getElementById('editAcademicYearForm');
            if (!form) return;

            form.action = this.dataset.updateUrl;
            form.querySelector('[name="name"]').value = this.dataset.name;
            form.querySelector('[name="start_date"]').value = this.dataset.start;
            form.querySelector('[name="end_date"]').value = this.dataset.end;
            form.querySelector('[name="level"]').value = this.dataset.level;
            form.querySelector('[name="is_active"]').checked = this.dataset.active === '1';
        });
    });

    wireFormSpinner('#createAcademicYearForm', 'button[type="submit"]', 'Saving...');
    wireFormSpinner('#editAcademicYearForm', 'button[type="submit"]', 'Updating...');

    if (typeof Swal === 'undefined') {
        const script = document.createElement('script');
        script.src = 'https://cdn.jsdelivr.net/npm/sweetalert2@11';
        document.head.appendChild(script);
    }
});
