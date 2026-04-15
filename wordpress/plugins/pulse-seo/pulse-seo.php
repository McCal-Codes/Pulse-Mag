<?php
/**
 * Plugin Name: Pulse SEO
 * Description: Opinionated SEO layer for Pulse Magazine with strict defaults and minimal override surface.
 * Version: 0.2.2
 * Requires at least: 6.5
 * Requires PHP: 8.1
 * Author: Pulse Magazine
 * Text Domain: pulse-seo
 * GitHub Plugin URI: https://github.com/McCal-Codes/pulse-seo
 * Primary Branch: main
 */

if (!defined('ABSPATH')) {
    exit;
}

function pulse_seo_defaults(): array
{
    return [
        'site_name' => 'Pulse Magazine',
        'home_title' => 'Pulse Magazine | Pittsburgh Literary and Arts Journal',
        'default_description' => "Submit poetry, fiction, and creative work to Pulse Magazine, Point Park University's literary journal.",
        'default_og_image' => '',
        'twitter_site' => '@pulsemagazine',
        'enable_json_ld' => 1,
        'blog_archive_title' => 'Pulse News | Pulse Magazine',
        'blog_archive_description' => 'News, updates, and behind-the-scenes from Pulse Literary & Arts Magazine.',
        'issues_archive_title' => 'Issues | Pulse Magazine',
        'issues_archive_description' => 'Current and upcoming issues from Pulse Literary & Arts Magazine.',
        'events_archive_title' => 'Events | Pulse Magazine',
        'events_archive_description' => 'Upcoming events, readings, and workshops from Pulse Literary & Arts Magazine.',
        'noindex_date_archives' => 1,
        'noindex_search_pages' => 1,
        'redirect_news_to_blog' => 1,
    ];
}

function pulse_seo_clamp_text(string $value, int $max_length): string
{
    $trimmed = trim($value);
    if ($trimmed === '') {
        return '';
    }
    return mb_substr($trimmed, 0, $max_length);
}

function pulse_seo_get_options(): array
{
    $saved = get_option('pulse_seo_options', []);
    if (!is_array($saved)) {
        $saved = [];
    }
    return wp_parse_args($saved, pulse_seo_defaults());
}

function pulse_seo_option(string $key, $fallback = null)
{
    $options = pulse_seo_get_options();
    return array_key_exists($key, $options) ? $options[$key] : $fallback;
}

function pulse_seo_is_external_seo_active(): bool
{
    if (defined('WPSEO_VERSION') || defined('RANK_MATH_VERSION') || defined('AIOSEO_VERSION')) {
        return true;
    }
    return class_exists('\AIOSEO\Plugin\Common\Main');
}

function pulse_seo_sanitize_options(array $input): array
{
    $defaults = pulse_seo_defaults();
    $output = $defaults;

    $output['site_name'] = pulse_seo_clamp_text(sanitize_text_field((string)($input['site_name'] ?? $defaults['site_name'])), 70);
    $output['home_title'] = pulse_seo_clamp_text(sanitize_text_field((string)($input['home_title'] ?? $defaults['home_title'])), 60);
    $output['default_description'] = pulse_seo_clamp_text(sanitize_textarea_field((string)($input['default_description'] ?? $defaults['default_description'])), 160);
    $output['default_og_image'] = esc_url_raw((string)($input['default_og_image'] ?? ''));
    $output['twitter_site'] = pulse_seo_clamp_text(sanitize_text_field((string)($input['twitter_site'] ?? $defaults['twitter_site'])), 30);
    $output['enable_json_ld'] = empty($input['enable_json_ld']) ? 0 : 1;
    $output['blog_archive_title'] = pulse_seo_clamp_text(sanitize_text_field((string)($input['blog_archive_title'] ?? $defaults['blog_archive_title'])), 60);
    $output['blog_archive_description'] = pulse_seo_clamp_text(sanitize_textarea_field((string)($input['blog_archive_description'] ?? $defaults['blog_archive_description'])), 160);
    $output['issues_archive_title'] = pulse_seo_clamp_text(sanitize_text_field((string)($input['issues_archive_title'] ?? $defaults['issues_archive_title'])), 60);
    $output['issues_archive_description'] = pulse_seo_clamp_text(sanitize_textarea_field((string)($input['issues_archive_description'] ?? $defaults['issues_archive_description'])), 160);
    $output['events_archive_title'] = pulse_seo_clamp_text(sanitize_text_field((string)($input['events_archive_title'] ?? $defaults['events_archive_title'])), 60);
    $output['events_archive_description'] = pulse_seo_clamp_text(sanitize_textarea_field((string)($input['events_archive_description'] ?? $defaults['events_archive_description'])), 160);
    $output['noindex_date_archives'] = empty($input['noindex_date_archives']) ? 0 : 1;
    $output['noindex_search_pages'] = empty($input['noindex_search_pages']) ? 0 : 1;
    $output['redirect_news_to_blog'] = empty($input['redirect_news_to_blog']) ? 0 : 1;

    if ($output['site_name'] === '') {
        $output['site_name'] = $defaults['site_name'];
    }
    if ($output['home_title'] === '') {
        $output['home_title'] = $defaults['home_title'];
    }
    if ($output['blog_archive_title'] === '') {
        $output['blog_archive_title'] = $defaults['blog_archive_title'];
    }
    if ($output['issues_archive_title'] === '') {
        $output['issues_archive_title'] = $defaults['issues_archive_title'];
    }
    if ($output['events_archive_title'] === '') {
        $output['events_archive_title'] = $defaults['events_archive_title'];
    }

    return $output;
}

function pulse_seo_register_settings(): void
{
    register_setting('pulse_seo_group', 'pulse_seo_options', [
        'type' => 'array',
        'sanitize_callback' => 'pulse_seo_sanitize_options',
        'default' => pulse_seo_defaults(),
    ]);

    add_settings_section('pulse_seo_main', __('Pulse SEO Defaults', 'pulse-seo'), '__return_false', 'pulse-seo');
    add_settings_section('pulse_seo_archives', __('Archive SEO Defaults', 'pulse-seo'), '__return_false', 'pulse-seo');
    add_settings_section('pulse_seo_guardrails', __('Indexing and Routing Guardrails', 'pulse-seo'), '__return_false', 'pulse-seo');

    foreach ([
        'site_name' => __('Site Name', 'pulse-seo'),
        'home_title' => __('Homepage Title', 'pulse-seo'),
        'default_og_image' => __('Default Open Graph Image URL', 'pulse-seo'),
        'twitter_site' => __('Twitter Site Handle', 'pulse-seo'),
    ] as $key => $label) {
        add_settings_field($key, $label, 'pulse_seo_render_text', 'pulse-seo', 'pulse_seo_main', ['key' => $key]);
    }

    add_settings_field(
        'default_description',
        __('Default Description', 'pulse-seo'),
        'pulse_seo_render_textarea',
        'pulse-seo',
        'pulse_seo_main',
        ['key' => 'default_description']
    );

    add_settings_field(
        'enable_json_ld',
        __('Enable JSON-LD', 'pulse-seo'),
        'pulse_seo_render_checkbox',
        'pulse-seo',
        'pulse_seo_main',
        ['key' => 'enable_json_ld']
    );

    foreach ([
        'blog_archive_title' => __('Blog Archive Title', 'pulse-seo'),
        'issues_archive_title' => __('Issues Archive Title', 'pulse-seo'),
        'events_archive_title' => __('Events Archive Title', 'pulse-seo'),
    ] as $key => $label) {
        add_settings_field($key, $label, 'pulse_seo_render_text', 'pulse-seo', 'pulse_seo_archives', ['key' => $key]);
    }

    foreach ([
        'blog_archive_description' => __('Blog Archive Description', 'pulse-seo'),
        'issues_archive_description' => __('Issues Archive Description', 'pulse-seo'),
        'events_archive_description' => __('Events Archive Description', 'pulse-seo'),
    ] as $key => $label) {
        add_settings_field($key, $label, 'pulse_seo_render_textarea', 'pulse-seo', 'pulse_seo_archives', ['key' => $key]);
    }

    foreach ([
        'noindex_date_archives' => __('Noindex Date Archives', 'pulse-seo'),
        'noindex_search_pages' => __('Noindex Search Pages', 'pulse-seo'),
        'redirect_news_to_blog' => __('Redirect /news to /blog', 'pulse-seo'),
    ] as $key => $label) {
        add_settings_field($key, $label, 'pulse_seo_render_checkbox', 'pulse-seo', 'pulse_seo_guardrails', ['key' => $key]);
    }
}
add_action('admin_init', 'pulse_seo_register_settings');

function pulse_seo_render_text(array $args): void
{
    $key = (string)$args['key'];
    $value = (string)pulse_seo_option($key, '');
    printf('<input type="text" class="regular-text" name="pulse_seo_options[%1$s]" value="%2$s" />', esc_attr($key), esc_attr($value));
}

function pulse_seo_render_textarea(array $args): void
{
    $key = (string)$args['key'];
    $value = (string)pulse_seo_option($key, '');
    printf('<textarea class="large-text" rows="4" name="pulse_seo_options[%1$s]">%2$s</textarea>', esc_attr($key), esc_textarea($value));
}

function pulse_seo_render_checkbox(array $args): void
{
    $key = (string)$args['key'];
    $checked = (int)pulse_seo_option($key, 0) === 1 ? 'checked' : '';
    printf('<label><input type="checkbox" name="pulse_seo_options[%1$s]" value="1" %2$s /> %3$s</label>', esc_attr($key), $checked, esc_html__('Enabled', 'pulse-seo'));
}

function pulse_seo_admin_menu(): void
{
    add_options_page(
        __('Pulse SEO', 'pulse-seo'),
        __('Pulse SEO', 'pulse-seo'),
        'manage_options',
        'pulse-seo',
        'pulse_seo_render_settings_page'
    );
}
add_action('admin_menu', 'pulse_seo_admin_menu');

function pulse_seo_admin_notice_conflict(): void
{
    if (!current_user_can('manage_options')) {
        return;
    }
    if (!pulse_seo_is_external_seo_active()) {
        return;
    }
    echo '<div class="notice notice-warning"><p>';
    echo esc_html__('Pulse SEO detected another SEO plugin (AIOSEO/Yoast/RankMath). Pulse SEO head output is disabled to prevent duplicate metadata.', 'pulse-seo');
    echo '</p></div>';
}
add_action('admin_notices', 'pulse_seo_admin_notice_conflict');

function pulse_seo_render_settings_page(): void
{
    ?>
    <div class="wrap">
        <h1><?php esc_html_e('Pulse SEO Settings', 'pulse-seo'); ?></h1>
        <p><?php esc_html_e('Minimal, opinionated SEO settings with strict defaults and limited override surface.', 'pulse-seo'); ?></p>
        <form method="post" action="options.php">
            <?php
            settings_fields('pulse_seo_group');
            do_settings_sections('pulse-seo');
            submit_button(__('Save Settings', 'pulse-seo'));
            ?>
        </form>
    </div>
    <?php
}

function pulse_seo_post_types(): array
{
    $types = ['post', 'page', 'issue', 'event'];
    if (post_type_exists('author_profile')) {
        $types[] = 'author_profile';
    }

    return $types;
}

function pulse_seo_add_meta_box(): void
{
    foreach (pulse_seo_post_types() as $post_type) {
        add_meta_box('pulse_seo_meta', __('Pulse SEO', 'pulse-seo'), 'pulse_seo_render_meta_box', $post_type, 'side', 'high');
    }
}
add_action('add_meta_boxes', 'pulse_seo_add_meta_box');

function pulse_seo_render_meta_box(\WP_Post $post): void
{
    wp_nonce_field('pulse_seo_meta_save', 'pulse_seo_meta_nonce');
    $meta_title = get_post_meta($post->ID, '_pulse_seo_title', true);
    $meta_desc = get_post_meta($post->ID, '_pulse_seo_description', true);
    $meta_noindex = get_post_meta($post->ID, '_pulse_seo_noindex', true);
    ?>
    <p><label for="pulse-seo-title"><strong><?php esc_html_e('SEO Title Override', 'pulse-seo'); ?></strong></label><br />
    <input id="pulse-seo-title" type="text" class="widefat" name="pulse_seo_title" value="<?php echo esc_attr((string)$meta_title); ?>" /></p>

    <p><label for="pulse-seo-description"><strong><?php esc_html_e('SEO Description Override', 'pulse-seo'); ?></strong></label><br />
    <textarea id="pulse-seo-description" class="widefat" rows="3" name="pulse_seo_description"><?php echo esc_textarea((string)$meta_desc); ?></textarea></p>

    <p><label><input type="checkbox" name="pulse_seo_noindex" value="1" <?php checked((string)$meta_noindex, '1'); ?> />
    <?php esc_html_e('Noindex this content', 'pulse-seo'); ?></label></p>

    <p><em><?php esc_html_e('Canonical URL and social image are auto-managed to reduce SEO misconfiguration.', 'pulse-seo'); ?></em></p>
    <?php
}

function pulse_seo_save_meta_box(int $post_id): void
{
    if (!isset($_POST['pulse_seo_meta_nonce']) || !wp_verify_nonce((string)$_POST['pulse_seo_meta_nonce'], 'pulse_seo_meta_save')) {
        return;
    }
    if (defined('DOING_AUTOSAVE') && DOING_AUTOSAVE) {
        return;
    }
    if (!current_user_can('edit_post', $post_id)) {
        return;
    }

    update_post_meta($post_id, '_pulse_seo_title', pulse_seo_clamp_text(sanitize_text_field((string)($_POST['pulse_seo_title'] ?? '')), 60));
    update_post_meta($post_id, '_pulse_seo_description', pulse_seo_clamp_text(sanitize_textarea_field((string)($_POST['pulse_seo_description'] ?? '')), 160));
    update_post_meta($post_id, '_pulse_seo_noindex', empty($_POST['pulse_seo_noindex']) ? '0' : '1');
}
add_action('save_post', 'pulse_seo_save_meta_box');

function pulse_seo_meta_value(int $post_id, string $key): string
{
    $value = get_post_meta($post_id, $key, true);
    return is_string($value) ? $value : '';
}

function pulse_seo_context_title(): string
{
    $site_name = (string)pulse_seo_option('site_name', get_bloginfo('name'));

    if (is_front_page()) {
        return (string)pulse_seo_option('home_title', $site_name);
    }
    if (is_home() || is_post_type_archive('post')) {
        return (string)pulse_seo_option('blog_archive_title', 'Pulse News | ' . $site_name);
    }
    if (is_post_type_archive('issue')) {
        return (string)pulse_seo_option('issues_archive_title', 'Issues | ' . $site_name);
    }
    if (is_post_type_archive('event')) {
        return (string)pulse_seo_option('events_archive_title', 'Events | ' . $site_name);
    }
    if (is_archive()) {
        return 'Pulse News | ' . $site_name;
    }
    if (is_singular()) {
        $post_id = get_queried_object_id();
        if ($post_id) {
            $override = pulse_seo_meta_value($post_id, '_pulse_seo_title');
            if ($override !== '') {
                return $override;
            }

            $title = get_the_title($post_id);
            $type = get_post_type($post_id);
            if ($type === 'post') {
                return $title . ' | Pulse News | ' . $site_name;
            }
            if ($type === 'issue') {
                return $title . ' | Issues | ' . $site_name;
            }
            if ($type === 'event') {
                return $title . ' | Events | ' . $site_name;
            }
            return $title . ' | ' . $site_name;
        }
    }

    return wp_get_document_title();
}

function pulse_seo_document_title_filter(string $title): string
{
    if (pulse_seo_is_external_seo_active()) {
        return $title;
    }
    return pulse_seo_context_title();
}
add_filter('pre_get_document_title', 'pulse_seo_document_title_filter', 20);

function pulse_seo_context_description(): string
{
    $default = (string)pulse_seo_option('default_description', get_bloginfo('description'));
    if (is_home() || is_post_type_archive('post')) {
        return (string)pulse_seo_option('blog_archive_description', $default);
    }
    if (is_post_type_archive('issue')) {
        return (string)pulse_seo_option('issues_archive_description', $default);
    }
    if (is_post_type_archive('event')) {
        return (string)pulse_seo_option('events_archive_description', $default);
    }
    if (is_singular()) {
        $post_id = get_queried_object_id();
        if ($post_id) {
            $override = pulse_seo_meta_value($post_id, '_pulse_seo_description');
            if ($override !== '') {
                return $override;
            }
            $excerpt = get_the_excerpt($post_id);
            if (is_string($excerpt) && $excerpt !== '') {
                return wp_trim_words(wp_strip_all_tags($excerpt), 28, '...');
            }
            $content = (string)get_post_field('post_content', $post_id);
            return wp_trim_words(wp_strip_all_tags($content), 30, '...');
        }
    }
    return $default;
}

function pulse_seo_context_noindex(): bool
{
    if (is_singular()) {
        $post_id = get_queried_object_id();
        if ($post_id) {
            return pulse_seo_meta_value($post_id, '_pulse_seo_noindex') === '1';
        }
    }

    if (is_date() && (int)pulse_seo_option('noindex_date_archives', 1) === 1) {
        return true;
    }
    if (is_search() && (int)pulse_seo_option('noindex_search_pages', 1) === 1) {
        return true;
    }

    return false;
}

function pulse_seo_context_canonical(): string
{
    if (is_singular()) {
        $post_id = get_queried_object_id();
        if ($post_id) {
            $canonical = wp_get_canonical_url($post_id);
            if (is_string($canonical) && $canonical !== '') {
                return $canonical;
            }

            return (string) get_permalink($post_id);
        }
    }
    if (is_front_page()) {
        return home_url('/');
    }

    $request_uri = isset($_SERVER['REQUEST_URI']) ? (string) $_SERVER['REQUEST_URI'] : '/';
    $path = wp_parse_url($request_uri, PHP_URL_PATH);
    if (!is_string($path) || $path === '') {
        $path = '/';
    }

    return home_url($path);
}

function pulse_seo_context_image(): string
{
    if (is_singular()) {
        $post_id = get_queried_object_id();
        if ($post_id) {
            $thumb_id = get_post_thumbnail_id($post_id);
            if ($thumb_id) {
                $url = wp_get_attachment_image_url($thumb_id, 'large');
                if (is_string($url) && $url !== '') {
                    return $url;
                }
            }
        }
    }
    return (string)pulse_seo_option('default_og_image', '');
}

function pulse_seo_output_head_tags(): void
{
    if (pulse_seo_is_external_seo_active()) {
        return;
    }

    if (!(is_front_page() || is_home() || is_archive() || is_singular())) {
        return;
    }

    $site_name = (string)pulse_seo_option('site_name', get_bloginfo('name'));
    $twitter_site = (string)pulse_seo_option('twitter_site', '');
    $title = pulse_seo_context_title();
    $description = pulse_seo_context_description();
    $canonical = pulse_seo_context_canonical();
    $image = pulse_seo_context_image();

    $noindex = pulse_seo_context_noindex();

    echo "\n" . '<meta name="description" content="' . esc_attr($description) . '" />' . "\n";
    echo '<link rel="canonical" href="' . esc_url($canonical) . '" />' . "\n";
    echo '<meta property="og:site_name" content="' . esc_attr($site_name) . '" />' . "\n";
    echo '<meta property="og:type" content="' . esc_attr(is_singular('post') ? 'article' : 'website') . '" />' . "\n";
    echo '<meta property="og:title" content="' . esc_attr($title) . '" />' . "\n";
    echo '<meta property="og:description" content="' . esc_attr($description) . '" />' . "\n";
    echo '<meta property="og:url" content="' . esc_url($canonical) . '" />' . "\n";
    if ($image !== '') {
        echo '<meta property="og:image" content="' . esc_url($image) . '" />' . "\n";
    }
    echo '<meta name="twitter:card" content="summary_large_image" />' . "\n";
    echo '<meta name="twitter:title" content="' . esc_attr($title) . '" />' . "\n";
    echo '<meta name="twitter:description" content="' . esc_attr($description) . '" />' . "\n";
    if ($image !== '') {
        echo '<meta name="twitter:image" content="' . esc_url($image) . '" />' . "\n";
    }
    if ($twitter_site !== '') {
        echo '<meta name="twitter:site" content="' . esc_attr($twitter_site) . '" />' . "\n";
    }

    echo $noindex
        ? '<meta name="robots" content="noindex,nofollow" />' . "\n"
        : '<meta name="robots" content="index,follow,max-image-preview:large,max-snippet:-1,max-video-preview:-1" />' . "\n";

    if ((int)pulse_seo_option('enable_json_ld', 1) === 1) {
        $orgSchema = [
            '@context' => 'https://schema.org',
            '@type' => 'Organization',
            'name' => $site_name,
            'url' => home_url('/'),
        ];
        echo '<script type="application/ld+json">' . wp_json_encode($orgSchema, JSON_UNESCAPED_SLASHES | JSON_UNESCAPED_UNICODE) . '</script>' . "\n";

        if (is_singular(['post', 'issue', 'event'])) {
            $post_id = get_queried_object_id();
            if ($post_id) {
                $post_type = get_post_type($post_id);
                $schema_type = 'Article';
                if ($post_type === 'event') {
                    $schema_type = 'Event';
                } elseif ($post_type === 'issue') {
                    $schema_type = 'CreativeWork';
                }
                $articleSchema = [
                    '@context' => 'https://schema.org',
                    '@type' => $schema_type,
                    'headline' => get_the_title($post_id),
                    'description' => $description,
                    'datePublished' => get_post_time('c', true, $post_id),
                    'dateModified' => get_post_modified_time('c', true, $post_id),
                    'author' => [
                        '@type' => 'Person',
                        'name' => get_the_author_meta('display_name', (int)get_post_field('post_author', $post_id)),
                    ],
                    'publisher' => [
                        '@type' => 'Organization',
                        'name' => $site_name,
                        'url' => home_url('/'),
                    ],
                    'mainEntityOfPage' => [
                        '@type' => 'WebPage',
                        '@id' => $canonical,
                    ],
                ];
                if ($image !== '') {
                    $articleSchema['image'] = $image;
                }
                echo '<script type="application/ld+json">' . wp_json_encode($articleSchema, JSON_UNESCAPED_SLASHES | JSON_UNESCAPED_UNICODE) . '</script>' . "\n";
            }
        }
    }
}
add_action('wp_head', 'pulse_seo_output_head_tags', 1);

function pulse_seo_handle_news_redirect(): void
{
    if (is_admin() || wp_doing_ajax() || (int)pulse_seo_option('redirect_news_to_blog', 1) !== 1) {
        return;
    }

    $request_uri = isset($_SERVER['REQUEST_URI']) ? (string)$_SERVER['REQUEST_URI'] : '';
    $path = (string)wp_parse_url($request_uri, PHP_URL_PATH);

    if (untrailingslashit($path) === '/news') {
        wp_safe_redirect(home_url('/blog/'), 301);
        exit;
    }
}
add_action('template_redirect', 'pulse_seo_handle_news_redirect');
