<?php
/**
 * Pulse Mag theme bootstrap.
 */

if (!defined('ABSPATH')) {
    exit;
}

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

function pulse_mag_enqueue_assets(): void
{
    wp_enqueue_style(
        'pulse-mag-style',
        get_stylesheet_uri(),
        [],
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
