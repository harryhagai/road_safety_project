(function () {
    const navigationStorageKey = 'hgss-inline-spinner-navigation';

    function ensureDeleteAlertStyles() {
        if (document.getElementById('teacher-doc-delete-alert-styles')) {
            return;
        }

        const style = document.createElement('style');
        style.id = 'teacher-doc-delete-alert-styles';
        style.textContent = `
            .teacher-doc-delete-popup {
                border-radius: 24px;
                padding: 0 !important;
                overflow: hidden;
                width: 28rem !important;
            }

            .teacher-doc-delete-html {
                margin: 0 !important;
                padding: 0 !important;
            }

            .teacher-doc-delete-alert {
                padding: 1.2rem 1rem 0.8rem;
                text-align: center;
                background: linear-gradient(180deg, #fff8f8 0%, #ffffff 100%);
            }

            .teacher-doc-delete-alert__icon-wrap {
                display: flex;
                justify-content: center;
                margin-bottom: 0.7rem;
            }

            .teacher-doc-delete-alert__icon {
                width: 56px;
                height: 56px;
                border-radius: 999px;
                display: inline-flex;
                align-items: center;
                justify-content: center;
                background: #fff1f2;
                color: #dc3545;
                font-size: 1.4rem;
                border: 1px solid #ffd5da;
            }

            .teacher-doc-delete-alert__kicker {
                font-size: 0.74rem;
                font-weight: 600;
                letter-spacing: 0.08em;
                text-transform: uppercase;
                color: #b54757;
                margin-bottom: 0.35rem;
            }

            .teacher-doc-delete-alert__title {
                font-size: 1.15rem;
                line-height: 1.2;
                color: #7f1d1d;
                margin: 0 0 0.4rem;
                font-weight: 600;
            }

            .teacher-doc-delete-alert__name {
                margin: 0 0 0.45rem;
                color: #111827;
                font-weight: 500;
                word-break: break-word;
                font-size: 0.94rem;
            }

            .teacher-doc-delete-alert__copy {
                margin: 0;
                color: #6b7280;
                font-size: 0.86rem;
                line-height: 1.45;
            }

            .teacher-doc-delete-confirm,
            .teacher-doc-delete-cancel {
                border: 1px solid transparent;
                border-radius: 999px;
                padding: 0.62rem 0.95rem;
                font-weight: 500;
                min-width: 122px;
                margin: 0 0.25rem 0.95rem;
                background: transparent;
                display: inline-flex;
                align-items: center;
                justify-content: center;
            }

            .teacher-doc-delete-confirm {
                border-color: #dc3545;
                color: #dc3545;
            }

            .teacher-doc-delete-cancel {
                border-color: #cbd5e1;
                color: #334155;
            }
        `;

        document.head.appendChild(style);
    }

    function ensureInlineSpinnerStyles() {
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

            .inline-spinner-button-active {
                background-color: #0d6efd !important;
                border-color: #0d6efd !important;
                color: #ffffff !important;
                box-shadow: none !important;
            }
        `;

        document.head.appendChild(style);
    }

    function spinnerMarkup() {
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

    function activateInlineSpinner(button) {
        if (!button || button.dataset.spinnerActive === '1') {
            return;
        }

        ensureInlineSpinnerStyles();
        button.dataset.spinnerActive = '1';
        button.disabled = true;
        button.classList.add('inline-spinner-button-active');

        const loadingText = button.getAttribute('data-loading-text')
            || button.dataset.loadingText
            || button.textContent.trim()
            || 'Processing...';

        if (button.tagName === 'INPUT') {
            button.dataset.originalValue = button.value;
            button.value = loadingText;
            return;
        }

        button.dataset.originalHtml = button.innerHTML;
        button.innerHTML = `
            ${spinnerMarkup()}
            <span style="font-weight:400;">${loadingText}</span>
        `;
    }

    function resetInlineSpinner(button) {
        if (!button) {
            return;
        }

        button.disabled = false;
        button.dataset.spinnerActive = '0';
        button.classList.remove('inline-spinner-button-active');

        if (button.tagName === 'INPUT' && button.dataset.originalValue !== undefined) {
            button.value = button.dataset.originalValue;
            delete button.dataset.originalValue;
            return;
        }

        if (button.dataset.originalHtml !== undefined) {
            button.innerHTML = button.dataset.originalHtml;
            delete button.dataset.originalHtml;
        }
    }

    function clearInlineNavigationState() {
        const overlay = document.getElementById('inline-spinner-navigation-overlay');
        if (overlay) {
            overlay.classList.remove('is-visible');
        }

        try {
            sessionStorage.removeItem(navigationStorageKey);
        } catch (error) {
            // Ignore storage issues.
        }
    }

    document.addEventListener('submit', function (event) {
        const form = event.target.closest('form[data-delete-confirm="1"]');
        if (!form || form.dataset.confirmed === '1') {
            return;
        }

        event.preventDefault();

        const submitter = event.submitter
            || form.__lastClickedSubmit
            || form.querySelector('button[type="submit"], input[type="submit"]');

        resetInlineSpinner(submitter);
        clearInlineNavigationState();

        const itemLabel = form.dataset.itemLabel || 'this file';
        const title = form.dataset.deleteTitle || 'Delete this file?';
        const kicker = form.dataset.deleteKicker || 'Delete Confirmation';
        const copy = form.dataset.deleteText || 'This will permanently remove the record and delete the file from storage.';
        const confirmText = form.dataset.confirmText || 'Yes, delete it';
        const cancelText = form.dataset.cancelText || 'Cancel';

        if (!window.Swal) {
            form.dataset.confirmed = '1';
            form.submit();
            return;
        }

        ensureDeleteAlertStyles();

        window.Swal.fire({
            html: `
                <div class="teacher-doc-delete-alert">
                    <div class="teacher-doc-delete-alert__icon-wrap">
                        <span class="teacher-doc-delete-alert__icon">
                            <i class="bi bi-trash3"></i>
                        </span>
                    </div>
                    <div class="teacher-doc-delete-alert__text">
                        <div class="teacher-doc-delete-alert__kicker">${kicker}</div>
                        <h2 class="teacher-doc-delete-alert__title">${title}</h2>
                        <p class="teacher-doc-delete-alert__name">${itemLabel}</p>
                        <p class="teacher-doc-delete-alert__copy">${copy}</p>
                    </div>
                </div>
            `,
            showCancelButton: true,
            confirmButtonText: `<i class="bi bi-trash3 me-1"></i> ${confirmText}`,
            cancelButtonText: `<i class="bi bi-x-circle me-1"></i> ${cancelText}`,
            reverseButtons: true,
            focusCancel: true,
            customClass: {
                popup: 'teacher-doc-delete-popup',
                htmlContainer: 'teacher-doc-delete-html',
                confirmButton: 'teacher-doc-delete-confirm',
                cancelButton: 'teacher-doc-delete-cancel',
            },
            buttonsStyling: false,
        }).then((result) => {
            if (result.isConfirmed) {
                activateInlineSpinner(submitter);
                form.dataset.confirmed = '1';
                form.submit();
                return;
            }

            resetInlineSpinner(submitter);
            clearInlineNavigationState();
        });
    });
})();
