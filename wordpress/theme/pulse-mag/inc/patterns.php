<?php
/**
 * Register Pulse Mag block patterns and categories.
 */

if (!defined('ABSPATH')) {
    exit;
}

function pulse_mag_register_pattern_category(): void
{
    if (function_exists('register_block_pattern_category')) {
        register_block_pattern_category(
            'pulse-mag',
            ['label' => __('Pulse Magazine', 'pulse-mag')]
        );
    }
}
add_action('init', 'pulse_mag_register_pattern_category');

function pulse_mag_register_patterns(): void
{
    if (!function_exists('register_block_pattern')) {
        return;
    }

    register_block_pattern(
        'pulse-mag/hero-story',
        [
            'title'       => __('Hero Story', 'pulse-mag'),
            'description' => __('Featured story block with a split editorial layout.', 'pulse-mag'),
            'categories'  => ['pulse-mag'],
            'content'     =>
                '<!-- wp:columns {"verticalAlignment":"center","lock":{"move":true,"remove":true},"style":{"spacing":{"blockGap":{"left":"1.25rem"}}}} -->' .
                '<div class="wp-block-columns are-vertically-aligned-center">' .
                '<!-- wp:column {"verticalAlignment":"center","width":"65%"} --><div class="wp-block-column is-vertically-aligned-center" style="flex-basis:65%">' .
                '<!-- wp:paragraph {"className":"pulse-kicker"} --><p class="pulse-kicker">Featured Story</p><!-- /wp:paragraph -->' .
                '<!-- wp:heading {"level":2} --><h2>Lead story headline with editorial focus</h2><!-- /wp:heading -->' .
                '<!-- wp:paragraph --><p>Use this for the strongest narrative on your front page with one direct path to read more.</p><!-- /wp:paragraph -->' .
                '<!-- wp:buttons --><div class="wp-block-buttons"><!-- wp:button {"backgroundColor":"accent","textColor":"surface"} --><div class="wp-block-button"><a class="wp-block-button__link has-surface-color has-accent-background-color has-text-color has-background wp-element-button">Read feature</a></div><!-- /wp:button --></div><!-- /wp:buttons -->' .
                '</div><!-- /wp:column -->' .
                '<!-- wp:column {"width":"35%"} --><div class="wp-block-column" style="flex-basis:35%">' .
                '<!-- wp:group {"className":"pulse-panel","lock":{"move":true,"remove":true},"layout":{"type":"constrained"}} --><div class="wp-block-group pulse-panel">' .
                '<!-- wp:paragraph {"className":"pulse-kicker"} --><p class="pulse-kicker">Current Issue</p><!-- /wp:paragraph -->' .
                '<!-- wp:heading {"level":3} --><h3>Summer 2026</h3><!-- /wp:heading -->' .
                '<!-- wp:paragraph --><p>Submission desk closes June 20.</p><!-- /wp:paragraph -->' .
                '</div><!-- /wp:group -->' .
                '</div><!-- /wp:column -->' .
                '</div><!-- /wp:columns -->',
        ]
    );

    register_block_pattern(
        'pulse-mag/issue-card-grid',
        [
            'title'       => __('Issue Card Grid', 'pulse-mag'),
            'description' => __('Asymmetric issue preview grid for current and archived issues.', 'pulse-mag'),
            'categories'  => ['pulse-mag'],
            'content'     =>
                '<!-- wp:columns {"lock":{"move":true,"remove":true},"style":{"spacing":{"blockGap":{"top":"1rem","left":"1rem"}}}} -->' .
                '<div class="wp-block-columns">' .
                '<!-- wp:column {"width":"66.66%"} --><div class="wp-block-column" style="flex-basis:66.66%"><!-- wp:group {"className":"pulse-panel","lock":{"move":true,"remove":true},"layout":{"type":"constrained"}} --><div class="wp-block-group pulse-panel"><!-- wp:paragraph {"className":"pulse-kicker"} --><p class="pulse-kicker">Current</p><!-- /wp:paragraph --><!-- wp:heading {"level":3} --><h3>Issue title</h3><!-- /wp:heading --><!-- wp:paragraph --><p>Season and summary snippet.</p><!-- /wp:paragraph --></div><!-- /wp:group --></div><!-- /wp:column -->' .
                '<!-- wp:column {"width":"33.33%"} --><div class="wp-block-column" style="flex-basis:33.33%"><!-- wp:group {"className":"pulse-panel","lock":{"move":true,"remove":true},"layout":{"type":"constrained"}} --><div class="wp-block-group pulse-panel"><!-- wp:paragraph {"className":"pulse-kicker"} --><p class="pulse-kicker">Up Next</p><!-- /wp:paragraph --><!-- wp:heading {"level":4} --><h4>Issue title</h4><!-- /wp:heading --><!-- wp:paragraph --><p>Season and summary snippet.</p><!-- /wp:paragraph --></div><!-- /wp:group --></div><!-- /wp:column -->' .
                '</div><!-- /wp:columns -->',
        ]
    );

    register_block_pattern(
        'pulse-mag/loading-skeleton',
        [
            'title'       => __('Loading Skeleton', 'pulse-mag'),
            'description' => __('Skeleton placeholder for loading states.', 'pulse-mag'),
            'categories'  => ['pulse-mag'],
            'content'     =>
                '<!-- wp:group {"className":"pulse-loading","layout":{"type":"constrained"}} -->' .
                '<div class="wp-block-group pulse-loading">' .
                '<!-- wp:paragraph {"className":"pulse-kicker"} --><p class="pulse-kicker">Loading</p><!-- /wp:paragraph -->' .
                '<!-- wp:html --><div class="pulse-loading-bar"></div><!-- /wp:html -->' .
                '</div><!-- /wp:group -->',
        ]
    );

    register_block_pattern(
        'pulse-mag/empty-state',
        [
            'title'       => __('Empty State', 'pulse-mag'),
            'description' => __('Guidance block when no content exists yet.', 'pulse-mag'),
            'categories'  => ['pulse-mag'],
            'content'     =>
                '<!-- wp:group {"className":"pulse-empty","layout":{"type":"constrained"}} -->' .
                '<div class="wp-block-group pulse-empty">' .
                '<!-- wp:paragraph {"className":"pulse-kicker"} --><p class="pulse-kicker">No entries yet</p><!-- /wp:paragraph -->' .
                '<!-- wp:paragraph --><p>Create your first story or issue to populate this section.</p><!-- /wp:paragraph -->' .
                '</div><!-- /wp:group -->',
        ]
    );

    register_block_pattern(
        'pulse-mag/error-state',
        [
            'title'       => __('Error State', 'pulse-mag'),
            'description' => __('Inline error state with recovery action.', 'pulse-mag'),
            'categories'  => ['pulse-mag'],
            'content'     =>
                '<!-- wp:group {"className":"pulse-error","layout":{"type":"constrained"}} -->' .
                '<div class="wp-block-group pulse-error">' .
                '<!-- wp:paragraph {"className":"pulse-kicker"} --><p class="pulse-kicker">Unable to load</p><!-- /wp:paragraph -->' .
                '<!-- wp:paragraph --><p>Check connection settings and retry the latest import.</p><!-- /wp:paragraph -->' .
                '<!-- wp:buttons --><div class="wp-block-buttons"><!-- wp:button {"backgroundColor":"accent","textColor":"surface"} --><div class="wp-block-button"><a class="wp-block-button__link has-surface-color has-accent-background-color has-text-color has-background wp-element-button">Retry</a></div><!-- /wp:button --></div><!-- /wp:buttons -->' .
                '</div><!-- /wp:group -->',
        ]
    );
}
add_action('init', 'pulse_mag_register_patterns');
