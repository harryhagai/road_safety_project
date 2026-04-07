document.addEventListener('DOMContentLoaded', function () {
    document.body.addEventListener('click', function (event) {
        const passwordToggle = event.target.closest('[data-toggle-password]');
        if (!passwordToggle) {
            return;
        }

        const targetId = passwordToggle.dataset.target;
        const input = document.getElementById(targetId);
        const icon = passwordToggle.querySelector('i');

        if (!input || !icon) {
            return;
        }

        if (input.type === 'password') {
            input.type = 'text';
            icon.classList.remove('bi-eye');
            icon.classList.add('bi-eye-slash');
            return;
        }

        input.type = 'password';
        icon.classList.remove('bi-eye-slash');
        icon.classList.add('bi-eye');
    });

    const profileForm = document.querySelector('[data-student-profile-form]');
    if (profileForm) {
        profileForm.addEventListener('submit', function (event) {
            const password = document.getElementById('password');
            const passwordConfirmation = document.getElementById('password_confirmation');

            if (password && passwordConfirmation && password.value && password.value !== passwordConfirmation.value) {
                event.preventDefault();
                alert('Passwords do not match.');
                return;
            }

            if (password && password.value && password.value.length < 8) {
                event.preventDefault();
                alert('Password must be at least 8 characters long.');
            }
        });
    }

    document.querySelectorAll('[data-preview-input]').forEach(function (input) {
        input.addEventListener('change', function (event) {
            const file = event.target.files && event.target.files[0];
            const targetSelector = event.target.dataset.previewTarget;
            const previewTarget = targetSelector ? document.querySelector(targetSelector) : null;

            if (!file || !previewTarget) {
                return;
            }

            const reader = new FileReader();
            reader.onload = function (loadEvent) {
                previewTarget.src = loadEvent.target.result;
            };
            reader.readAsDataURL(file);
        });
    });
});
