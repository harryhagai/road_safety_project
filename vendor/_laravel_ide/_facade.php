<?php

namespace Illuminate\Support\Facades;

interface Auth
{
    /**
     * @return \App\Models\Officer|false
     */
    public static function loginUsingId(mixed $id, bool $remember = false);

    /**
     * @return \App\Models\Officer|false
     */
    public static function onceUsingId(mixed $id);

    /**
     * @return \App\Models\Officer|null
     */
    public static function getUser();

    /**
     * @return \App\Models\Officer
     */
    public static function authenticate();

    /**
     * @return \App\Models\Officer|null
     */
    public static function user();

    /**
     * @return \App\Models\Officer|null
     */
    public static function logoutOtherDevices(string $password);

    /**
     * @return \App\Models\Officer
     */
    public static function getLastAttempted();
}