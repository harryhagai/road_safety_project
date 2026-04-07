document.addEventListener('DOMContentLoaded', () => {
  const root = document.querySelector('.academic-results-overview');
  const filterForm = document.getElementById('resultsOverviewFilterForm');
  const yearSelect = document.getElementById('academic_year_id');
  const classSelect = document.getElementById('class_id');
  const inlineLoading = document.getElementById('resultsOverviewInlineLoading');

  const showLoading = () => {
    inlineLoading?.classList.remove('d-none');
  };

  if (filterForm && yearSelect && classSelect) {
    filterForm.addEventListener('submit', showLoading);

    yearSelect.addEventListener('change', () => {
      showLoading();
      filterForm.submit();
    });

    classSelect.addEventListener('change', () => {
      showLoading();
      filterForm.submit();
    });
  }

  if (!root) {
    return;
  }

  const mobilityUrl = root.dataset.mobilityUrlTemplate || '';
  const selectedClassId = root.dataset.selectedClassId || '';
  const selectedYearId = root.dataset.selectedYearId || '';

  document.querySelectorAll('.mobility-exam-select').forEach((select) => {
    select.addEventListener('change', async (event) => {
      const form = event.target.closest('.mobilityForm');
      const baseExamId = form?.dataset.examId;
      const mobilityExamId = event.target.value;
      const output = document.getElementById(`mobility_${baseExamId}`);

      if (!output || !baseExamId) {
        return;
      }

      if (!mobilityExamId || !selectedClassId || !selectedYearId) {
        output.textContent = 'Choose mobility examination below.';
        return;
      }

      output.textContent = 'Loading mobility comparison...';

      try {
        const params = new URLSearchParams({
          exam_id: baseExamId,
          mobility_exam_id: mobilityExamId,
          class_id: selectedClassId,
          year_id: selectedYearId,
        });

        const response = await fetch(`${mobilityUrl}?${params.toString()}`, {
          headers: {
            'X-Requested-With': 'XMLHttpRequest',
            'Accept': 'application/json',
          },
        });

        if (!response.ok) {
          throw new Error('Failed to load mobility overview.');
        }

        const data = await response.json();
        output.textContent = typeof data.mobility !== 'undefined' ? data.mobility : '--';
      } catch (error) {
        console.error('Mobility overview failed:', error);
        output.textContent = 'Unable to load mobility overview right now.';
      }
    });
  });
});
