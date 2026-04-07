document.addEventListener('DOMContentLoaded', function () {
    const page = document.getElementById('registratorUsersPage');
    if (!page) {
        return;
    }

    const searchInput = document.getElementById('userSearchInput');
    const searchType = document.getElementById('userSearchType');
    const clearButton = document.getElementById('clearUserSearch');
    const tableWrapper = document.getElementById('usersTableWrapper');
    const usersMeta = document.getElementById('usersMeta');
    const usersLoadState = document.getElementById('usersLoadState');
    const scrollSentinel = document.getElementById('usersScrollSentinel');
    const modalElement = document.getElementById('userActionModal');
    const modalTitle = document.getElementById('userActionModalLabel');
    const modalBody = document.getElementById('userActionModalBody');
    const userModal = new bootstrap.Modal(modalElement);
    const searchUrl = page.dataset.searchUrl;
    let debounceTimer = null;
    let listController = null;
    let currentPage = 1;
    let hasMorePages = true;
    let isLoading = false;
    let observer = null;
    let activeSearchToken = 0;
    const searchCache = new Map();
    const minimumSearchLength = 2;

    function usersLoadingMarkup(message = 'Loading users...') {
        return `
            <div class="d-flex flex-column align-items-center justify-content-center py-5 text-muted">
                <div class="spinner-border text-primary mb-3" role="status" aria-hidden="true"></div>
                <span>${message}</span>
            </div>
        `;
    }

    function modalLoadingMarkup() {
        return `
            <div class="d-flex flex-column align-items-center justify-content-center py-4 text-muted">
                <div class="spinner-border text-primary mb-3" role="status" aria-hidden="true"></div>
                <span>Loading...</span>
            </div>
        `;
    }

    function buildUsersUrl(pageNumber = 1) {
        const params = new URLSearchParams({
            type: searchType.value,
            query: searchInput.value.trim(),
            page: pageNumber,
        });

        return `${searchUrl}?${params.toString()}`;
    }

    function normalizedQuery() {
        return searchInput.value.trim().toLowerCase();
    }

    function requestKey(pageNumber = 1) {
        return `${searchType.value}::${normalizedQuery()}::${pageNumber}`;
    }

    function setLoadState(message = '') {
        usersLoadState.textContent = message;
        scrollSentinel.textContent = message;
    }

    function ensureTableShell() {
        if (!document.getElementById('usersTableBody')) {
            tableWrapper.innerHTML = `
                <div class="table-responsive">
                    <table class="table table-hover align-middle mb-0">
                        <thead>
                            <tr>
                                <th>#</th>
                                <th>Name</th>
                                <th>Email</th>
                                <th>Role</th>
                                <th>Status</th>
                                <th class="text-end">Actions</th>
                            </tr>
                        </thead>
                        <tbody id="usersTableBody"></tbody>
                    </table>
                </div>
            `;
        }
    }

    function updateMeta(from, to, total) {
        if (!total) {
            usersMeta.textContent = 'No users found.';
            return;
        }

        usersMeta.textContent = `Showing ${from} to ${to} of ${total} users`;
    }

    function shouldUseSearch(query) {
        return query.length === 0 || query.length >= minimumSearchLength;
    }

    function renderPayload(payload, append = false) {
        ensureTableShell();

        const tableBody = document.getElementById('usersTableBody');
        if (!append) {
            tableBody.innerHTML = payload.rows;
        } else {
            tableBody.insertAdjacentHTML('beforeend', payload.rows);
        }

        currentPage = payload.current_page;
        hasMorePages = payload.has_more;
        updateMeta(payload.from, payload.to, payload.total);
        setLoadState(hasMorePages ? 'Scroll down to load more' : 'All users loaded');
    }

    async function fetchUsers(pageNumber = 1, append = false) {
        const query = normalizedQuery();
        const token = ++activeSearchToken;
        const cacheKey = requestKey(pageNumber);

        if (pageNumber === 1 && !shouldUseSearch(query)) {
            tableWrapper.innerHTML = `
                <div class="alert alert-light border mb-0 text-muted">
                    Continue typing to search. Enter at least ${minimumSearchLength} characters.
                </div>
            `;
            usersMeta.textContent = 'Waiting for more characters...';
            setLoadState('');
            currentPage = 1;
            hasMorePages = false;
            return;
        }

        if (!append && searchCache.has(cacheKey)) {
            renderPayload(searchCache.get(cacheKey), false);
            return;
        }

        if (append && searchCache.has(cacheKey)) {
            renderPayload(searchCache.get(cacheKey), true);
            return;
        }

        if (listController && pageNumber === 1) {
            listController.abort();
        }

        isLoading = true;
        listController = new AbortController();

        if (!append) {
            tableWrapper.innerHTML = usersLoadingMarkup('Loading users...');
            usersMeta.textContent = 'Loading users...';
        } else {
            setLoadState('Loading more users...');
        }

        try {
            const response = await fetch(buildUsersUrl(pageNumber), {
                headers: {
                    'X-Requested-With': 'XMLHttpRequest',
                },
                signal: listController.signal,
            });

            if (!response.ok) {
                throw new Error('Failed to load users');
            }

            const payload = await response.json();
            payload.current_page = pageNumber;

            if (token !== activeSearchToken && !append) {
                return;
            }

            searchCache.set(cacheKey, payload);
            renderPayload(payload, append);
        } catch (error) {
            if (error.name === 'AbortError') {
                return;
            }

            tableWrapper.innerHTML = `
                <div class="alert alert-danger mb-0">
                    Unable to load users right now. Please try again.
                </div>
            `;
            usersMeta.textContent = 'Unable to load users right now.';
            setLoadState('');
        } finally {
            isLoading = false;
        }
    }

    async function openUserModal(button) {
        const url = button.dataset.url;
        const title = button.dataset.title || 'User Details';

        modalTitle.textContent = title;
        modalBody.innerHTML = modalLoadingMarkup();
        userModal.show();

        try {
            const response = await fetch(url, {
                headers: {
                    'X-Requested-With': 'XMLHttpRequest',
                },
            });

            if (!response.ok) {
                throw new Error('Failed to load modal content');
            }

            modalBody.innerHTML = await response.text();
        } catch (error) {
            modalBody.innerHTML = `
                <div class="alert alert-danger mb-0">
                    Unable to load this user right now.
                </div>
            `;
        }
    }

    function queueFetch(pageNumber = 1) {
        clearTimeout(debounceTimer);
        debounceTimer = setTimeout(function () {
            currentPage = 1;
            hasMorePages = true;
            activeSearchToken++;
            fetchUsers(pageNumber, false);
        }, 220);
    }

    function setupInfiniteScroll() {
        if (observer) {
            observer.disconnect();
        }

        observer = new IntersectionObserver(function (entries) {
            const entry = entries[0];
            if (!entry.isIntersecting || isLoading || !hasMorePages) {
                return;
            }

            fetchUsers(currentPage + 1, true);
        }, {
            rootMargin: '250px 0px',
        });

        observer.observe(scrollSentinel);
    }

    searchInput.addEventListener('input', function () {
        queueFetch(1);
    });

    searchType.addEventListener('change', function () {
        currentPage = 1;
        hasMorePages = true;
        activeSearchToken++;
        fetchUsers(1, false);
    });

    clearButton.addEventListener('click', function () {
        searchInput.value = '';
        searchType.value = 'name';
        currentPage = 1;
        hasMorePages = true;
        activeSearchToken++;
        fetchUsers(1, false);
    });

    tableWrapper.addEventListener('click', function (event) {
        const modalButton = event.target.closest('[data-user-modal]');
        if (modalButton) {
            event.preventDefault();
            openUserModal(modalButton);
        }
    });

    document.addEventListener('submit', function (event) {
        const deleteForm = event.target.closest('.delete-user-form');
        const resetForm = event.target.closest('.reset-password-form');

        if (deleteForm) {
            event.preventDefault();
            Swal.fire({
                title: 'Are you sure?',
                text: 'This user will be permanently deleted.',
                icon: 'warning',
                showCancelButton: true,
                confirmButtonColor: '#d33',
                cancelButtonColor: '#3085d6',
                confirmButtonText: 'Yes, delete',
                cancelButtonText: 'Cancel',
                reverseButtons: true,
            }).then(function (result) {
                if (result.isConfirmed) {
                    deleteForm.submit();
                }
            });
            return;
        }

        if (resetForm) {
            event.preventDefault();
            Swal.fire({
                title: 'Reset Password?',
                text: 'The password will be set to: hgss@44242444!',
                icon: 'warning',
                showCancelButton: true,
                confirmButtonColor: '#FFC107',
                cancelButtonColor: '#3085d6',
                confirmButtonText: 'Yes, reset',
                cancelButtonText: 'Cancel',
                reverseButtons: true,
            }).then(function (result) {
                if (result.isConfirmed) {
                    resetForm.submit();
                }
            });
        }
    });

    setupInfiniteScroll();
    fetchUsers(1, false);
});
