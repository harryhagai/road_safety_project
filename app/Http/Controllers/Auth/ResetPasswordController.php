<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use Illuminate\Http\RedirectResponse;

class ResetPasswordController extends Controller
{
    public function showResetForm(): RedirectResponse
    {
        return redirect()->route('password.request');
    }
}
