<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;

class RegisterController extends Controller
{
    public function showRegistrationForm(): RedirectResponse
    {
        return redirect()->route('login')
            ->with('status', 'Self-registration is disabled. Please contact the system administrator.');
    }

    public function register(Request $request): RedirectResponse
    {
        return redirect()->route('login')
            ->with('status', 'Self-registration is disabled. Please contact the system administrator.');
    }
}
