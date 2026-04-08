@props([
    'title',
    'subtitle' => null,
])

<div class="officer-shared-page-header__text">
    <h1 class="officer-shared-page-header__title">{{ $title }}</h1>
    @if ($subtitle)
        <p class="officer-shared-page-header__subtitle">{{ $subtitle }}</p>
    @endif
</div>
