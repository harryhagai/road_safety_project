(function () {
    function ensureTeacherAlertStyles() {
        if (document.getElementById('teacher-alert-theme-styles')) {
            return;
        }

        const style = document.createElement('style');
        style.id = 'teacher-alert-theme-styles';
        style.textContent = `
            .teacher-ui-alert-popup {
                border-radius: 24px;
                padding: 0 !important;
                overflow: hidden;
                width: 28rem !important;
            }

            .teacher-ui-alert-html {
                margin: 0 !important;
                padding: 0 !important;
            }

            .teacher-ui-alert {
                padding: 1.2rem 1rem 0.8rem;
                text-align: center;
                background: linear-gradient(180deg, var(--teacher-alert-bg-top, #f7fffb) 0%, #ffffff 100%);
            }

            .teacher-ui-alert__icon-wrap {
                display: flex;
                justify-content: center;
                margin-bottom: 0.7rem;
            }

            .teacher-ui-alert__icon {
                width: 56px;
                height: 56px;
                border-radius: 999px;
                display: inline-flex;
                align-items: center;
                justify-content: center;
                background: var(--teacher-alert-icon-bg, #ecfdf3);
                color: var(--teacher-alert-accent, #198754);
                font-size: 1.4rem;
                border: 1px solid var(--teacher-alert-icon-border, #ccebd7);
            }

            .teacher-ui-alert__kicker {
                font-size: 0.74rem;
                font-weight: 600;
                letter-spacing: 0.08em;
                text-transform: uppercase;
                color: var(--teacher-alert-kicker, #2d7a52);
                margin-bottom: 0.35rem;
            }

            .teacher-ui-alert__title {
                font-size: 1.15rem;
                line-height: 1.2;
                color: var(--teacher-alert-title, #14532d);
                margin: 0 0 0.4rem;
                font-weight: 600;
            }

            .teacher-ui-alert__copy {
                margin: 0;
                color: #6b7280;
                font-size: 0.86rem;
                line-height: 1.45;
            }

            .teacher-ui-alert-confirm {
                border: 1px solid var(--teacher-alert-accent, #198754);
                border-radius: 999px;
                padding: 0.62rem 0.95rem;
                font-weight: 500;
                min-width: 122px;
                margin: 0 0.25rem 0.95rem;
                background: transparent;
                color: var(--teacher-alert-accent, #198754);
                display: inline-flex;
                align-items: center;
                justify-content: center;
            }
        `;

        document.head.appendChild(style);
    }

    window.showTeacherUiAlert = function showTeacherUiAlert(options) {
        if (!window.Swal) {
            return;
        }

        ensureTeacherAlertStyles();

        const theme = options.theme || 'success';
        const themeVars = theme === 'success'
            ? {
                accent: '#198754',
                bgTop: '#f7fffb',
                iconBg: '#ecfdf3',
                iconBorder: '#ccebd7',
                kicker: '#2d7a52',
                title: '#14532d',
                icon: 'bi-check2-circle',
                kickerText: options.kicker || 'Success',
            }
            : {
                accent: '#dc3545',
                bgTop: '#fff8f8',
                iconBg: '#fff1f2',
                iconBorder: '#ffd5da',
                kicker: '#b54757',
                title: '#7f1d1d',
                icon: 'bi-exclamation-circle',
                kickerText: options.kicker || 'Notice',
            };

        window.Swal.fire({
            html: `
                <div
                    class="teacher-ui-alert"
                    style="
                        --teacher-alert-accent:${themeVars.accent};
                        --teacher-alert-bg-top:${themeVars.bgTop};
                        --teacher-alert-icon-bg:${themeVars.iconBg};
                        --teacher-alert-icon-border:${themeVars.iconBorder};
                        --teacher-alert-kicker:${themeVars.kicker};
                        --teacher-alert-title:${themeVars.title};
                    "
                >
                    <div class="teacher-ui-alert__icon-wrap">
                        <span class="teacher-ui-alert__icon">
                            <i class="bi ${options.icon || themeVars.icon}"></i>
                        </span>
                    </div>
                    <div class="teacher-ui-alert__kicker">${themeVars.kickerText}</div>
                    <h2 class="teacher-ui-alert__title">${options.title || ''}</h2>
                    <p class="teacher-ui-alert__copy">${options.text || ''}</p>
                </div>
            `,
            timer: options.timer,
            showConfirmButton: options.showConfirmButton ?? true,
            confirmButtonText: options.confirmButtonText || '<i class="bi bi-check2 me-1"></i> OK',
            customClass: {
                popup: 'teacher-ui-alert-popup',
                htmlContainer: 'teacher-ui-alert-html',
                confirmButton: 'teacher-ui-alert-confirm',
            },
            buttonsStyling: false,
        });
    };
})();
