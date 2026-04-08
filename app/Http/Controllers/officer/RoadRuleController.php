<?php

namespace App\Http\Controllers\officer;

use App\Http\Controllers\Controller;
use App\Models\RoadRule;
use App\Models\RoadSegment;
use App\Services\MapConfigService;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\View\View;

class RoadRuleController extends Controller
{
    public function index(MapConfigService $mapConfigService): View
    {
        $segments = RoadSegment::query()
            ->orderBy('segment_name')
            ->get()
            ->map(function (RoadSegment $segment) {
                return [
                    'id' => $segment->id,
                    'segment_name' => $segment->segment_name,
                    'segment_type' => $segment->segment_type,
                    'description' => $segment->description,
                    'length_km' => $segment->length_km,
                    'boundary_coordinates' => $segment->boundary_coordinates,
                ];
            });

        $rules = RoadRule::query()
            ->with('segment:id,segment_name')
            ->latest()
            ->get()
            ->map(function (RoadRule $rule) {
                return [
                    'id' => $rule->id,
                    'rule_name' => $rule->rule_name,
                    'rule_type' => $rule->rule_type,
                    'rule_value' => $rule->rule_value,
                    'description' => $rule->description,
                    'location_name' => $rule->location_name,
                    'effective_from' => optional($rule->effective_from)?->format('d M Y H:i'),
                    'effective_to' => optional($rule->effective_to)?->format('d M Y H:i'),
                    'is_active' => $rule->is_active,
                    'segment_id' => $rule->segment_id,
                    'segment_name' => $rule->segment?->segment_name,
                ];
            });

        return view('officer.road-rules.index', [
            'mapConfig' => $mapConfigService->forFrontend(),
            'segments' => $segments,
            'rules' => $rules,
        ]);
    }

    public function store(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'rule_name' => ['required', 'string', 'max:255'],
            'rule_type' => ['required', 'string', 'max:100'],
            'rule_value' => ['nullable', 'string', 'max:255'],
            'description' => ['nullable', 'string', 'max:2000'],
            'location_name' => ['nullable', 'string', 'max:255'],
            'effective_from' => ['nullable', 'date'],
            'effective_to' => ['nullable', 'date', 'after_or_equal:effective_from'],
            'is_active' => ['nullable', 'boolean'],
            'segment_id' => ['required', 'exists:road_segments,id'],
        ]);

        $segment = RoadSegment::findOrFail($validated['segment_id']);
        $coordinates = data_get($segment->boundary_coordinates, 'geometry.coordinates', []);

        if (! is_array($coordinates) || count($coordinates) < 2) {
            return back()
                ->withInput()
                ->with('error', 'Selected segment does not have valid geometry.');
        }

        $start = $coordinates[0];
        $end = $coordinates[count($coordinates) - 1];

        RoadRule::create([
            'rule_name' => $validated['rule_name'],
            'rule_type' => $validated['rule_type'],
            'rule_value' => $validated['rule_value'] ?: null,
            'description' => $validated['description'] ?: null,
            'location_name' => $validated['location_name'] ?: $segment->segment_name,
            'effective_from' => $validated['effective_from'] ?: null,
            'effective_to' => $validated['effective_to'] ?: null,
            'is_active' => $request->boolean('is_active', true),
            'segment_id' => $segment->id,
            'created_by' => $request->user()?->id,
            'latitude_start' => $start[1] ?? null,
            'longitude_start' => $start[0] ?? null,
            'latitude_end' => $end[1] ?? null,
            'longitude_end' => $end[0] ?? null,
        ]);

        return redirect()
            ->route('officer.road-rules.index')
            ->with('success', 'Road rule saved successfully.');
    }
}
