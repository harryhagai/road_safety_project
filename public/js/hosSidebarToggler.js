// Sidebar toggler for Head of School
const sidebarToggle = document.getElementById('sidebarToggle');
const sidebar = document.getElementById('sidebar');
if (sidebarToggle && sidebar) {
    sidebarToggle.addEventListener('click', function () {
        if (sidebar.style.left === '0px' || sidebar.style.left === '') {
            sidebar.style.left = '-220px';
        } else {
            sidebar.style.left = '0px';
        }
    });
}
