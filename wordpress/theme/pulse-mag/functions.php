<?php
/**
 * Pulse Mag theme bootstrap.
 */

if (!defined('ABSPATH')) {
    exit;
}

/** Google Fonts matching apps/web (Next.js next/font: Playfair Display + Libre Baskerville). */
const PULSE_MAG_GOOGLE_FONTS_URL = 'https://fonts.googleapis.com/css2?family=Libre+Baskerville:ital,wght@0,400;0,700;1,400&family=Playfair+Display:ital,wght@0,400;0,500;0,600;0,700;1,400&display=swap';

function pulse_mag_theme_setup(): void
{
    add_theme_support('title-tag');
    add_theme_support('post-thumbnails');
    add_theme_support('editor-styles');
    add_editor_style('style.css');
    add_theme_support('automatic-feed-links');
    add_theme_support('responsive-embeds');
    add_theme_support('wp-block-styles');
    add_theme_support('html5', [
        'search-form',
        'comment-form',
        'comment-list',
        'gallery',
        'caption',
        'style',
        'script',
    ]);

    register_nav_menus([
        'primary' => __('Primary Menu', 'pulse-mag'),
        'footer' => __('Footer Menu', 'pulse-mag'),
    ]);
}
add_action('after_setup_theme', 'pulse_mag_theme_setup');

/**
 * Load display/body fonts on the front end and in the block editor so the site matches the Vercel design.
 */
function pulse_mag_enqueue_fonts(): void
{
    wp_enqueue_style(
        'pulse-mag-fonts',
        esc_url(PULSE_MAG_GOOGLE_FONTS_URL),
        [],
        null
    );
}
add_action('wp_enqueue_scripts', 'pulse_mag_enqueue_fonts', 1);
add_action('enqueue_block_editor_assets', 'pulse_mag_enqueue_fonts', 1);

/**
 * Preconnect to Google Fonts hosts (preferred over raw echoes in wp_head).
 * Long-term: self-host woff2 and declare @font-face in theme.json for stronger privacy/performance.
 *
 * @param array<int, string|array<string, string>> $urls
 * @return array<int, string|array<string, string>>
 */
function pulse_mag_resource_hints(array $urls, string $relation_type): array
{
    if ($relation_type !== 'preconnect') {
        return $urls;
    }

    $urls[] = [
        'href' => 'https://fonts.googleapis.com',
    ];
    $urls[] = [
        'href' => 'https://fonts.gstatic.com',
        'crossorigin' => 'anonymous',
    ];

    return $urls;
}
add_filter('wp_resource_hints', 'pulse_mag_resource_hints', 10, 2);

function pulse_mag_enqueue_assets(): void
{
    wp_enqueue_style(
        'pulse-mag-style',
        get_stylesheet_uri(),
        ['pulse-mag-fonts'],
        wp_get_theme()->get('Version')
    );
}
add_action('wp_enqueue_scripts', 'pulse_mag_enqueue_assets', 5);

/**
 * Copyright line with current year (matches Vercel Footer dynamic year).
 */
function pulse_mag_shortcode_copyright_line(): string
{
    $y = (string) gmdate('Y');

    $html = '<p class="has-text-align-center has-x-small-font-size pulse-footer-copy">&copy; '
        . esc_html($y)
        . ' Pulse Literary &amp; Arts Magazine</p>';

    return wp_kses_post($html);
}
add_shortcode('pulse_copyright_line', 'pulse_mag_shortcode_copyright_line');

require_once get_template_directory() . '/inc/patterns.php';
