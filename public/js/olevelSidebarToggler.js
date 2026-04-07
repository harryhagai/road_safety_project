document.addEventListener('DOMContentLoaded', function() {
    const sidebar = document.getElementById('sidebar');
    const toggleBtn = document.getElementById('sidebarToggle');
    const mainHeader = document.getElementById('main-header');
    const body = document.body;
    
    if (!sidebar || !toggleBtn || !mainHeader) return;
    
    // Function to update layout based on screen size and sidebar state
    function updateLayout() {
        const sidebarWidth = getComputedStyle(document.documentElement)
            .getPropertyValue('--sidebar-width')
            .trim();
        
        if (window.innerWidth <= 768) {
            // Mobile view
            if (sidebar.classList.contains('active')) {
                // Sidebar is open
                body.style.paddingLeft = '0';
                mainHeader.style.left = '0';
                mainHeader.style.width = '100%';
            } else {
                // Sidebar is closed
                body.style.paddingLeft = '0';
                mainHeader.style.left = '0';
                mainHeader.style.width = '100%';
            }
        } else {
            // Desktop view - always show sidebar
            sidebar.classList.remove('active');
            body.style.paddingLeft = sidebarWidth;
            mainHeader.style.left = sidebarWidth;
            mainHeader.style.width = `calc(100% - ${sidebarWidth})`;
        }
    }
    
    // Toggle button click handler
    toggleBtn.addEventListener('click', function(e) {
        e.stopPropagation();
        if (window.innerWidth <= 768) {
            sidebar.classList.toggle('active');
            updateLayout();
        }
    });
    
    // Click outside handler (mobile only)
    document.addEventListener('click', function(e) {
        if (window.innerWidth <= 768 && 
            sidebar.classList.contains('active') && 
            !sidebar.contains(e.target) && 
            e.target !== toggleBtn) {
            sidebar.classList.remove('active');
            updateLayout();
        }
    });
    
    // Prevent clicks inside sidebar from closing it
    sidebar.addEventListener('click', function(e) {
        e.stopPropagation();
    });
    
    // Handle window resize
    window.addEventListener('resize', function() {
        updateLayout();
    });
    
    // Initialize layout
    updateLayout();
});