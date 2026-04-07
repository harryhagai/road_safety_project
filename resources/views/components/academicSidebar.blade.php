@php
    $isOperationsMenuOpen = request()->is('road-officer/road-rules*') ||
        request()->is('road-officer/road-segments*') ||
        request()->is('road-officer/violation-types*');
    $isReportsMenuOpen = request()->is('road-officer/reports*') ||
        request()->is('road-officer/evidence-files*') ||
        request()->is('road-officer/rule-violations*');
    $isMonitoringMenuOpen = request()->is('road-officer/hotspots*') ||
        request()->is('road-officer/notifications*');
    $isAdministrationMenuOpen = request()->is('road-officer/officers*') ||
        request()->is('road-officer/settings*') ||
        request()->is('road-officer/profile*');
@endphp

<aside id="sidebar">
    <div class="p-3">
        <div class="academic-sidebar-brand mb-3">
            <img src="{{ asset('img/hg-logo.png') }}" alt="HG Logo" class="academic-sidebar-logo">
            <div class="academic-sidebar-brand-text">
                <div class="academic-sidebar-brand-title">RSRS</div>
                <div class="academic-sidebar-brand-subtitle">Road Officer Panel</div>
            </div>
        </div>
        <ul class="nav flex-column">
            <li class="nav-item">
                <a href="{{ url('/road-officer/dashboard') }}"
                    class="nav-link {{ request()->is('road-officer/dashboard') ? 'active' : '' }}">
                    <i class="bi bi-speedometer2"></i> Dashboard
                </a>
            </li>

            <li class="nav-item">
                <a class="nav-link academic-sidebar-toggle d-flex justify-content-between align-items-center {{ $isOperationsMenuOpen ? 'active' : '' }}"
                    data-bs-toggle="collapse" href="#operationsMenu" role="button"
                    aria-expanded="{{ $isOperationsMenuOpen ? 'true' : 'false' }}"
                    aria-controls="operationsMenu">
                    <span class="academic-sidebar-link-content">
                        <i class="bi bi-kanban-fill"></i>
                        <span class="academic-sidebar-link-label">Operations</span>
                    </span>
                    <i class="bi bi-chevron-right academic-sidebar-caret"></i>
                </a>
                <div class="collapse ps-3 {{ $isOperationsMenuOpen ? 'show' : '' }}" id="operationsMenu">
                    <ul class="nav flex-column">
                        <li class="nav-item mb-1">
                            <a href="{{ url('/road-officer/road-rules') }}"
                                class="nav-link academic-sidebar-sub-link {{ request()->is('road-officer/road-rules*') ? 'active is-current fw-bold shadow-sm' : '' }}">
                                <i class="bi bi-dot"></i> Road Rules
                            </a>
                        </li>
                        <li class="nav-item mb-1">
                            <a href="{{ url('/road-officer/road-segments') }}"
                                class="nav-link academic-sidebar-sub-link {{ request()->is('road-officer/road-segments*') ? 'active is-current fw-bold shadow-sm' : '' }}">
                                <i class="bi bi-dot"></i> Road Segments
                            </a>
                        </li>
                        <li class="nav-item mb-1">
                            <a href="{{ url('/road-officer/violation-types') }}"
                                class="nav-link academic-sidebar-sub-link {{ request()->is('road-officer/violation-types*') ? 'active is-current fw-bold shadow-sm' : '' }}">
                                <i class="bi bi-dot"></i> Violation Types
                            </a>
                        </li>
                    </ul>
                </div>
            </li>

            <li class="nav-item">
                <a class="nav-link academic-sidebar-toggle d-flex justify-content-between align-items-center {{ $isReportsMenuOpen ? 'active' : '' }}"
                    data-bs-toggle="collapse" href="#reportsMenu" role="button"
                    aria-expanded="{{ $isReportsMenuOpen ? 'true' : 'false' }}"
                    aria-controls="reportsMenu">
                    <span class="academic-sidebar-link-content">
                        <i class="bi bi-folder-check"></i>
                        <span class="academic-sidebar-link-label">Reports</span>
                    </span>
                    <i class="bi bi-chevron-right academic-sidebar-caret"></i>
                </a>
                <div class="collapse ps-3 {{ $isReportsMenuOpen ? 'show' : '' }}" id="reportsMenu">
                    <ul class="nav flex-column">
                        <li class="nav-item mb-1">
                            <a href="{{ url('/road-officer/reports') }}"
                                class="nav-link academic-sidebar-sub-link {{ request()->is('road-officer/reports*') ? 'active is-current fw-bold shadow-sm' : '' }}">
                                <i class="bi bi-dot"></i> Incident Reports
                            </a>
                        </li>
                        <li class="nav-item mb-1">
                            <a href="{{ url('/road-officer/evidence-files') }}"
                                class="nav-link academic-sidebar-sub-link {{ request()->is('road-officer/evidence-files*') ? 'active is-current fw-bold shadow-sm' : '' }}">
                                <i class="bi bi-dot"></i> Evidence Files
                            </a>
                        </li>
                        <li class="nav-item mb-1">
                            <a href="{{ url('/road-officer/rule-violations') }}"
                                class="nav-link academic-sidebar-sub-link {{ request()->is('road-officer/rule-violations*') ? 'active is-current fw-bold shadow-sm' : '' }}">
                                <i class="bi bi-dot"></i> Rule Violations
                            </a>
                        </li>
                    </ul>
                </div>
            </li>

            <li class="nav-item">
                <a class="nav-link academic-sidebar-toggle d-flex justify-content-between align-items-center {{ $isMonitoringMenuOpen ? 'active' : '' }}"
                    data-bs-toggle="collapse" href="#monitoringMenu" role="button"
                    aria-expanded="{{ $isMonitoringMenuOpen ? 'true' : 'false' }}"
                    aria-controls="monitoringMenu">
                    <span class="academic-sidebar-link-content">
                        <i class="bi bi-journal-bookmark-fill"></i>
                        <span class="academic-sidebar-link-label">Monitoring</span>
                    </span>
                    <i class="bi bi-chevron-right academic-sidebar-caret"></i>
                </a>
                <div class="collapse ps-3 {{ $isMonitoringMenuOpen ? 'show' : '' }}" id="monitoringMenu">
                    <ul class="nav flex-column">
                        <li class="nav-item mb-1">
                            <a href="{{ url('/road-officer/hotspots') }}"
                                class="nav-link academic-sidebar-sub-link {{ request()->is('road-officer/hotspots*') ? 'active is-current fw-bold shadow-sm' : '' }}">
                                <i class="bi bi-dot"></i> Hotspots
                            </a>
                        </li>
                        <li class="nav-item mb-1">
                            <a href="{{ url('/road-officer/notifications') }}"
                                class="nav-link {{ request()->is('road-officer/notifications*') ? 'active' : '' }}">
                                <i class="bi bi-dot"></i> Notifications
                            </a>
                        </li>
                    </ul>
                </div>
            </li>

            <li class="nav-item">
                <a class="nav-link academic-sidebar-toggle d-flex justify-content-between align-items-center {{ $isAdministrationMenuOpen ? 'active' : '' }}"
                    data-bs-toggle="collapse" href="#administrationMenu" role="button"
                    aria-expanded="{{ $isAdministrationMenuOpen ? 'true' : 'false' }}"
                    aria-controls="administrationMenu">
                    <span class="academic-sidebar-link-content">
                        <i class="bi bi-file-earmark-bar-graph-fill"></i>
                        <span class="academic-sidebar-link-label">Administration</span>
                    </span>
                    <i class="bi bi-chevron-right academic-sidebar-caret"></i>
                </a>
                <div class="collapse ps-3 {{ $isAdministrationMenuOpen ? 'show' : '' }}" id="administrationMenu">
                    <ul class="nav flex-column">
                        <li class="nav-item mb-1">
                            <a href="{{ url('/road-officer/officers') }}"
                                class="nav-link academic-sidebar-sub-link {{ request()->is('road-officer/officers*') ? 'active is-current fw-bold shadow-sm' : '' }}">
                                <i class="bi bi-dot"></i> Officers
                            </a>
                        </li>
                        <li class="nav-item mb-1">
                            <a href="{{ url('/road-officer/settings') }}"
                                class="nav-link academic-sidebar-sub-link {{ request()->is('road-officer/settings*') ? 'active is-current fw-bold shadow-sm' : '' }}">
                                <i class="bi bi-dot"></i> Settings
                            </a>
                        </li>
                        <li class="nav-item mb-1">
                            <a href="{{ url('/road-officer/profile') }}"
                                class="nav-link academic-sidebar-sub-link {{ request()->is('road-officer/profile*') ? 'active is-current fw-bold shadow-sm' : '' }}">
                                <i class="bi bi-dot"></i> My Profile
                            </a>
                        </li>
                    </ul>
                </div>
            </li>
        </ul>
    </div>
</aside>
