@extends('layouts.officerDashboardLayout')

@section('content')
<div class="container-fluid px-3 px-lg-4 py-4 officer-profile-page">
    <div class="row g-4">
        <div class="col-12 col-xl-4">
            <section class="profile-summary-card h-100">
                <div class="profile-summary-top">
                    <div class="profile-avatar-shell">
                        <div class="profile-avatar-fallback">
                            {{ strtoupper(substr($officer->full_name ?? 'RO', 0, 1)) }}
                        </div>
                    </div>
                    <div>
                        <span class="profile-status-pill">
                            <i class="bi bi-shield-check"></i>
                            System Officer
                        </span>
                        <h2 class="profile-name">{{ $officer->full_name }}</h2>
                        <p class="profile-email">{{ $officer->email }}</p>
                    </div>
                </div>

                <div class="profile-meta-list">
                    <div class="profile-meta-item">
                        <span class="profile-meta-label">Role</span>
                        <span class="profile-meta-value text-capitalize">{{ $officer->role ?? 'officer' }}</span>
                    </div>
                    <div class="profile-meta-item">
                        <span class="profile-meta-label">Last Login</span>
                        <span class="profile-meta-value">
                            {{ optional($officer->last_login_at)->format('d M Y, H:i') ?? 'Not recorded yet' }}
                        </span>
                    </div>
                    <div class="profile-meta-item">
                        <span class="profile-meta-label">Account Created</span>
                        <span class="profile-meta-value">{{ optional($officer->created_at)->format('d M Y') ?? 'Unknown' }}</span>
                    </div>
                </div>

                <button type="button" class="btn btn-primary profile-edit-btn" data-bs-toggle="modal" data-bs-target="#profileUpdateModal">
                    <i class="bi bi-pencil-square me-2"></i>Edit Profile
                </button>
            </section>
        </div>

        <div class="col-12 col-xl-8">
            <section class="profile-details-card">
                <div class="profile-section-head">
                    <div>
                        <div class="profile-section-kicker">Account Overview</div>
                        <h3 class="profile-section-title">System officer information</h3>
                    </div>
                    <button type="button" class="btn btn-outline-primary" data-bs-toggle="modal" data-bs-target="#profileUpdateModal">
                        <i class="bi bi-person-gear me-2"></i>Update Details
                    </button>
                </div>

                <div class="row g-3 profile-info-grid">
                    <div class="col-md-6">
                        <article class="profile-info-card">
                            <span class="profile-info-label">Full Name</span>
                            <span class="profile-info-value">{{ $officer->full_name }}</span>
                        </article>
                    </div>
                    <div class="col-md-6">
                        <article class="profile-info-card">
                            <span class="profile-info-label">Email Address</span>
                            <span class="profile-info-value">{{ $officer->email }}</span>
                        </article>
                    </div>
                    <div class="col-md-6">
                        <article class="profile-info-card">
                            <span class="profile-info-label">Role</span>
                            <span class="profile-info-value text-capitalize">{{ $officer->role ?? 'officer' }}</span>
                        </article>
                    </div>
                    <div class="col-md-6">
                        <article class="profile-info-card">
                            <span class="profile-info-label">Security</span>
                            <span class="profile-info-value">Password can be changed from the popup form</span>
                        </article>
                    </div>
                </div>
            </section>
        </div>
    </div>
    
    <div class="modal fade" id="profileUpdateModal" tabindex="-1" aria-labelledby="profileUpdateModalLabel" aria-hidden="true">
        <div class="modal-dialog modal-dialog-centered modal-lg">
            <div class="modal-content profile-modal">
                <div class="modal-header border-0 pb-0">
                    <div>
                        <div class="profile-section-kicker">Edit Profile</div>
                        <h4 class="modal-title profile-modal-title" id="profileUpdateModalLabel">Update system officer details</h4>
                    </div>
                    <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                </div>

                <form method="POST" action="{{ route('officer.profile.update') }}">
                    @csrf
                    @method('PUT')

                    <div class="modal-body pt-3">
                        <div class="row g-3">
                            <div class="col-md-6">
                                <label for="full_name" class="form-label">Full Name</label>
                                <input
                                    type="text"
                                    id="full_name"
                                    name="full_name"
                                    class="form-control @error('full_name') is-invalid @enderror"
                                    value="{{ old('full_name', $officer->full_name) }}"
                                    required
                                >
                                @error('full_name')
                                    <div class="invalid-feedback">{{ $message }}</div>
                                @enderror
                            </div>

                            <div class="col-md-6">
                                <label for="email" class="form-label">Email Address</label>
                                <input
                                    type="email"
                                    id="email"
                                    name="email"
                                    class="form-control @error('email') is-invalid @enderror"
                                    value="{{ old('email', $officer->email) }}"
                                    required
                                >
                                @error('email')
                                    <div class="invalid-feedback">{{ $message }}</div>
                                @enderror
                            </div>

                            <div class="col-md-6">
                                <label for="role_display" class="form-label">Role</label>
                                <input
                                    type="text"
                                    id="role_display"
                                    class="form-control"
                                    value="{{ ucfirst($officer->role ?? 'officer') }}"
                                    readonly
                                >
                                <div class="form-text">Role is displayed for reference only.</div>
                            </div>

                            <div class="col-md-6">
                                <label for="password" class="form-label">New Password</label>
                                <input
                                    type="password"
                                    id="password"
                                    name="password"
                                    class="form-control @error('password') is-invalid @enderror"
                                    placeholder="Leave blank to keep current password"
                                >
                                @error('password')
                                    <div class="invalid-feedback">{{ $message }}</div>
                                @enderror
                            </div>

                            <div class="col-md-6">
                                <label for="password_confirmation" class="form-label">Confirm Password</label>
                                <input
                                    type="password"
                                    id="password_confirmation"
                                    name="password_confirmation"
                                    class="form-control"
                                    placeholder="Repeat the new password"
                                >
                            </div>
                        </div>
                    </div>

                    <div class="modal-footer border-0 pt-0">
                        <button type="button" class="btn btn-light" data-bs-dismiss="modal">Cancel</button>
                        <button type="submit" class="btn btn-primary" data-loading-text="Saving changes...">
                            <i class="bi bi-check2-circle me-2"></i>Save Changes
                        </button>
                    </div>
                </form>
            </div>
        </div>
    </div>
</div>
@endsection

@push('styles')
<style>
    .officer-profile-page {
        color: #183153;
        font-size: 0.95rem;
    }

    .profile-summary-card,
    .profile-details-card {
        background: #ffffff;
        border: 1px solid #e4ecf7;
        border-radius: 24px;
        padding: 1.6rem;
        box-shadow: 0 16px 40px rgba(15, 57, 105, 0.08);
    }

    .profile-summary-card {
        display: flex;
        flex-direction: column;
        gap: 1.5rem;
        background: linear-gradient(180deg, #f8fbff 0%, #ffffff 100%);
    }

    .profile-summary-top {
        display: flex;
        align-items: center;
        gap: 1rem;
    }

    .profile-avatar-shell {
        flex-shrink: 0;
    }

    .profile-avatar-fallback {
        width: 84px;
        height: 84px;
        border-radius: 24px;
        display: flex;
        align-items: center;
        justify-content: center;
        background: linear-gradient(135deg, #0d6efd, #0ea5e9);
        color: #fff;
        font-size: 1.45rem;
        font-weight: 500;
        box-shadow: 0 10px 24px rgba(13, 110, 253, 0.22);
    }

    .profile-status-pill {
        display: inline-flex;
        align-items: center;
        gap: 0.45rem;
        padding: 0.35rem 0.8rem;
        border-radius: 999px;
        background: #e8f1ff;
        color: #1557b0;
        font-size: 0.72rem;
        font-weight: 400;
        margin-bottom: 0.75rem;
    }

    .profile-name {
        margin: 0;
        font-size: 1.12rem;
        font-weight: 400;
    }

    .profile-email {
        margin: 0.35rem 0 0;
        color: #5f7698;
        font-size: 0.88rem;
    }

    .profile-meta-list {
        display: grid;
        gap: 0.85rem;
    }

    .profile-meta-item,
    .profile-info-card {
        background: #f8fbff;
        border: 1px solid #e0eaf6;
        border-radius: 18px;
        padding: 1rem 1.05rem;
    }

    .profile-meta-label,
    .profile-info-label {
        display: block;
        font-size: 0.7rem;
        font-weight: 400;
        letter-spacing: 0.04em;
        text-transform: uppercase;
        color: #6d84a6;
        margin-bottom: 0.4rem;
    }

    .profile-meta-value,
    .profile-info-value {
        color: #183153;
        font-size: 0.88rem;
    }

    .profile-edit-btn {
        border-radius: 16px;
        padding: 0.7rem 0.95rem;
        font-weight: 400;
        font-size: 0.88rem;
    }

    .profile-section-head {
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: 1rem;
        margin-bottom: 1.2rem;
    }

    .profile-section-kicker {
        font-size: 0.68rem;
        font-weight: 400;
        letter-spacing: 0.08em;
        text-transform: uppercase;
        color: #0d6efd;
        margin-bottom: 0.35rem;
    }

    .profile-section-title,
    .profile-modal-title {
        margin: 0;
        font-weight: 400;
        color: #183153;
        font-size: 1rem;
    }

    .profile-modal {
        border: 0;
        border-radius: 24px;
        box-shadow: 0 22px 50px rgba(15, 57, 105, 0.18);
    }

    .profile-modal .form-control {
        border-radius: 14px;
        min-height: 42px;
        border-color: #d8e3f2;
        font-size: 0.88rem;
    }

    .profile-modal .form-control:focus {
        border-color: #86b7fe;
        box-shadow: 0 0 0 0.2rem rgba(13, 110, 253, 0.12);
    }

    .profile-modal .btn {
        border-radius: 14px;
        min-width: 140px;
        font-size: 0.88rem;
    }

    .profile-modal .form-label,
    .profile-modal .form-text,
    .profile-modal .invalid-feedback {
        font-size: 0.82rem;
    }

    @media (max-width: 767.98px) {
        .profile-summary-top,
        .profile-section-head {
            flex-direction: column;
            align-items: flex-start;
        }
    }
</style>
@endpush

@section('scripts')
<script>
    document.addEventListener('DOMContentLoaded', () => {
        const shouldOpenModal = @json($errors->any());
        if (!shouldOpenModal) {
            return;
        }

        const profileModalElement = document.getElementById('profileUpdateModal');
        if (!profileModalElement || !window.bootstrap?.Modal) {
            return;
        }

        window.bootstrap.Modal.getOrCreateInstance(profileModalElement).show();
    });
</script>
@endsection
