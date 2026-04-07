<?php

use App\Http\Controllers\OfficerProfileController;
use Illuminate\Support\Facades\Route;

$routeFiles = [
    'public.php',
    'auth.php',
    'student.php',
    'registrator.php',
    'admin.php',
    'accountant.php',
    'academic.php',
    'teacher.php',
    'head_of_school.php',
    'asset_manager.php',
];

foreach ($routeFiles as $routeFile) {
    $path = __DIR__ . '/' . $routeFile;

    if (is_file($path)) {
        require $path;
    }
}

Route::view('/', 'home')->name('home');
Route::view('/home', 'home');
Route::view('/about', 'about')->name('about');
Route::view('/contact', 'contact')->name('contact');
Route::view('/departments', 'departments')->name('departments');
Route::view('/developer', 'developer')->name('developer');
Route::view('/news-events', 'news_events')->name('news-events');
Route::view('/road-officer/dashboard', 'officer.dashboard')->middleware('auth')->name('officer.dashboard');
Route::view('/academic/dashboard', 'officer.dashboard')->middleware('auth')->name('academic.dashboard');
Route::middleware('auth')->group(function () {
    Route::get('/road-officer/profile', [OfficerProfileController::class, 'show'])->name('officer.profile.show');
    Route::put('/road-officer/profile', [OfficerProfileController::class, 'update'])->name('officer.profile.update');
});
Route::redirect('/e-learning', '/login')->name('e-learning');
