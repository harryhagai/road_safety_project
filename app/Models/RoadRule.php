<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class RoadRule extends Model
{
    use HasFactory;

    /**
     * The attributes that are mass assignable.
     *
     * @var list<string>
     */
    protected $fillable = [
        'rule_name',
        'rule_type',
        'latitude_start',
        'longitude_start',
        'latitude_end',
        'longitude_end',
        'location_name',
        'rule_value',
        'description',
        'effective_from',
        'effective_to',
        'is_active',
        'segment_id',
        'created_by',
    ];

    /**
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'latitude_start' => 'decimal:7',
            'longitude_start' => 'decimal:7',
            'latitude_end' => 'decimal:7',
            'longitude_end' => 'decimal:7',
            'effective_from' => 'datetime',
            'effective_to' => 'datetime',
            'is_active' => 'boolean',
        ];
    }

    public function segment(): BelongsTo
    {
        return $this->belongsTo(RoadSegment::class, 'segment_id');
    }

    public function creator(): BelongsTo
    {
        return $this->belongsTo(Officer::class, 'created_by');
    }

    public function ruleViolations(): HasMany
    {
        return $this->hasMany(RuleViolation::class, 'rule_id');
    }

    public function hotspots(): HasMany
    {
        return $this->hasMany(Hotspot::class, 'rule_id');
    }
}
