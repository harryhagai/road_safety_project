document.addEventListener('DOMContentLoaded', function() {
    const levelSelect = document.querySelector('select[name="level"]');
    const classSelect = document.querySelector('select[name="class"]');
    const streamSelect = document.querySelector('select[name="stream"]');
    if (!levelSelect || !classSelect || !streamSelect) return;
    const allClasses = Array.from(classSelect.options).map(opt => ({id: opt.value, name: opt.text, level: opt.getAttribute('data-level')}));
    const allStreams = Array.from(streamSelect.options).map(opt => ({id: opt.value, name: opt.text, classId: opt.getAttribute('data-class-id')}));

    function filterClasses() {
        const level = levelSelect.value;
        classSelect.innerHTML = '<option value="">-- Select Class --</option>';
        allClasses.forEach(cls => {
            if (!level || cls.level === level) {
                classSelect.innerHTML += `<option value="${cls.id}" data-level="${cls.level}">${cls.name}</option>`;
            }
        });
        filterStreams();
    }

    function filterStreams() {
        const classId = classSelect.value;
        streamSelect.innerHTML = '<option value="">-- Select Stream --</option>';
        allStreams.forEach(str => {
            if (!classId || str.classId === classId) {
                streamSelect.innerHTML += `<option value="${str.id}" data-class-id="${str.classId}">${str.name}</option>`;
            }
        });
    }

    levelSelect.addEventListener('change', filterClasses);
    classSelect.addEventListener('change', filterStreams);

    // Initial filter
    filterClasses();
});
