(function () {
    const token = document.querySelector('meta[name="csrf-token"]')?.getAttribute('content');

    function setBadgeState(badge, isApproved) {
        if (!badge) {
            return;
        }

        badge.textContent = isApproved ? 'Visible To Students' : 'Hidden From Students';
        badge.className = `badge ${isApproved ? 'bg-success' : 'bg-secondary'}`;
    }

    function setButtonState(button, isApproved) {
        if (!button) {
            return;
        }

        const icon = button.querySelector('[data-approval-icon]');
        const label = button.querySelector('[data-approval-label]');
        const approveLabel = button.getAttribute('data-approve-label') || 'Approve';
        const hideLabel = button.getAttribute('data-hide-label') || 'Hide';
        const hasSmallSize = button.classList.contains('btn-sm');

        button.className = `btn ${isApproved ? 'btn-outline-danger' : 'btn-outline-success'}${hasSmallSize ? ' btn-sm' : ''}`;

        if (icon) {
            icon.className = `bi ${isApproved ? 'bi-eye-slash' : 'bi-check2-circle'} me-1`;
        }

        if (label) {
            label.textContent = isApproved ? hideLabel : approveLabel;
        } else {
            button.textContent = isApproved ? hideLabel : approveLabel;
        }
    }

    function setShellState(shell, isApproved, approvedAtLabel) {
        if (!shell) {
            return;
        }

        shell.querySelectorAll('[data-approval-badge]').forEach((badge) => setBadgeState(badge, isApproved));
        shell.querySelectorAll('[data-approval-submit]').forEach((button) => setButtonState(button, isApproved));
        shell.querySelectorAll('input[name="results_visibility"], input[name="publication_visibility"]').forEach((input) => {
            input.value = isApproved ? 'hidden' : 'approved';
        });
        shell.querySelectorAll('[data-approval-time]').forEach((timeEl) => {
            const prefix = timeEl.getAttribute('data-approval-time-prefix') || '';
            timeEl.textContent = approvedAtLabel ? `${prefix}${approvedAtLabel}` : 'N/A';
        });
    }

    function getVisibilityInput(form) {
        return form.querySelector('input[name="results_visibility"], input[name="publication_visibility"]');
    }

    function getApprovalId(form) {
        return form.getAttribute('data-approval-id')
            || form.getAttribute('data-exam-id')
            || form.querySelector('input[name="exam_id"]')?.value
            || '';
    }

    function setLoading(button, isLoading) {
        if (!button) {
            return;
        }

        if (isLoading) {
            if (!button.dataset.originalHtml) {
                button.dataset.originalHtml = button.innerHTML;
            }

            button.disabled = true;
            button.innerHTML = `
                <span class="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                <span>Processing...</span>
            `;
            return;
        }

        if (button.dataset.originalHtml) {
            button.innerHTML = button.dataset.originalHtml;
        }

        button.disabled = false;
    }

    async function submitApprovalForm(form) {
        const action = form.getAttribute('action');
        const submitButton = form.querySelector('[data-approval-submit]') || form.querySelector('button[type="submit"]');
        let nextState = null;
        let nextApprovedAtLabel = null;

        if (!action || !token || !submitButton) {
            return;
        }

        setLoading(submitButton, true);

        try {
            const visibilityInput = getVisibilityInput(form);
            const response = await fetch(action, {
                method: 'POST',
                headers: {
                    'X-CSRF-TOKEN': token,
                    'X-Requested-With': 'XMLHttpRequest',
                    'Accept': 'application/json',
                },
                body: new FormData(form),
                credentials: 'same-origin',
            });

            const payload = await response.json();

            if (!response.ok || !payload.success) {
                throw new Error(payload.message || 'Failed to update result visibility.');
            }

            const isApproved = payload.results_visibility === 'approved';
            const approvedAtLabel = payload.results_approved_at_label || null;
            nextState = isApproved;
            nextApprovedAtLabel = approvedAtLabel;

            const approvalId = getApprovalId(form);
            const shells = approvalId
                ? document.querySelectorAll(`[data-approval-shell][data-approval-id="${approvalId}"]`)
                : [form.closest('[data-approval-shell]')];

            shells.forEach((shell) => setShellState(shell, isApproved, approvedAtLabel));

            if (visibilityInput) {
                visibilityInput.value = isApproved ? 'hidden' : 'approved';
            }

            document.querySelectorAll(`[data-approval-view-trigger][data-exam-id="${approvalId}"]`).forEach((trigger) => {
                trigger.dataset.examVisibility = payload.results_visibility;
                trigger.dataset.examApprovedAt = approvedAtLabel || 'N/A';
            });

            if (window.showAcademicUiAlert) {
                window.showAcademicUiAlert({
                    theme: 'success',
                    title: 'Visibility updated',
                    text: payload.message || 'Result visibility updated successfully.',
                    timer: 2200,
                    showConfirmButton: false,
                });
            }
        } catch (error) {
            if (window.showAcademicUiAlert) {
                window.showAcademicUiAlert({
                    theme: 'danger',
                    title: 'Update failed',
                    text: error.message || 'Failed to update result visibility.',
                });
            }
        } finally {
            setLoading(submitButton, false);

            if (nextState !== null) {
                const approvalId = getApprovalId(form);
                const shells = approvalId
                    ? document.querySelectorAll(`[data-approval-shell][data-approval-id="${approvalId}"]`)
                    : [form.closest('[data-approval-shell]')];

                shells.forEach((shell) => setShellState(shell, nextState, nextApprovedAtLabel));
            }
        }
    }

    document.addEventListener('submit', function (event) {
        const form = event.target.closest('[data-approval-form]');

        if (!form) {
            return;
        }

        event.preventDefault();
        submitApprovalForm(form);
    });
})();
