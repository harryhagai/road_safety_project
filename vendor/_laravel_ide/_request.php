<?php

namespace Illuminate\Http;

interface Request
{
    /**
     * @return \App\Models\Officer|null
     */
    public function user($guard = null);
}