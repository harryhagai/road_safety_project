@props([
    'title',
    'subtitle' => null,
])

<section class="academic-shared-page-header">
    <div class="academic-shared-page-header__content">
        <h1 class="academic-shared-page-header__title">{{ $title }}</h1>
        @if ($subtitle)
            <p class="academic-shared-page-header__subtitle">{{ $subtitle }}</p>
        @endif
    </div>
</section>
