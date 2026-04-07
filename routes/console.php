<?php

use Illuminate\Foundation\Inspiring;
use Illuminate\Support\Facades\Artisan;
use App\Models\ReportConfig;
use App\Services\ReportRowService;

Artisan::command('inspire', function () {
    $this->comment(Inspiring::quote());
})->purpose('Display an inspiring quote');

Artisan::command('reports:backfill {--config_id=} {--class_id=} {--academic_year_id=}', function (ReportRowService $reportRowService) {
    $configs = ReportConfig::query()
        ->with('exams')
        ->when($this->option('config_id'), fn ($query, $configId) => $query->where('id', $configId))
        ->get();

    foreach ($configs as $config) {
        $classIds = $this->option('class_id')
            ? [(int) $this->option('class_id')]
            : \App\Models\Student::query()
                ->when($this->option('academic_year_id'), fn ($query, $yearId) => $query->where('academic_year_id', $yearId))
                ->distinct()
                ->pluck('class_id')
                ->filter()
                ->all();

        foreach ($classIds as $classId) {
            $academicYearIds = $this->option('academic_year_id')
                ? [(int) $this->option('academic_year_id')]
                : \App\Models\Student::query()
                    ->where('class_id', $classId)
                    ->distinct()
                    ->pluck('academic_year_id')
                    ->filter()
                    ->all();

            foreach ($academicYearIds as $academicYearId) {
                $reportRowService->recalculateClassRows($config, (int) $classId, (int) $academicYearId);
                $this->info("Backfilled config {$config->id} for class {$classId}, year {$academicYearId}");
            }
        }
    }
})->purpose('Backfill computed report rows');
