<?php
/**
 * Create/update static pages that mirror Vercel routes (Pulse Mag block theme).
 *
 * Usage (from anywhere):
 *   php create-vercel-parity-pages.php --wp-path="C:\path\to\wordpress\root"
 *
 * Optional:
 *   --set-reading   Assign Home as front page and Pulse News (blog) as posts page
 *
 * Does not create Issues/Events archives (those are CPT archives).
 * /news may be redirected to /blog by Pulse SEO; a News page is optional.
 */

if (php_sapi_name() !== 'cli') {
    fwrite(STDERR, "CLI only.\n");
    exit(1);
}

$opts = getopt('', ['wp-path:', 'set-reading']);
$wpPath = $opts['wp-path'] ?? '';
if ($wpPath === '') {
    fwrite(STDERR, "Missing --wp-path= (path to WordPress root containing wp-load.php)\n");
    exit(1);
}

$wpLoad = rtrim($wpPath, "\\/") . DIRECTORY_SEPARATOR . 'wp-load.php';
if (!is_readable($wpLoad)) {
    fwrite(STDERR, "Cannot read: {$wpLoad}\n");
    exit(1);
}

require $wpLoad;

if (!function_exists('wp_insert_post')) {
    fwrite(STDERR, "WordPress failed to load.\n");
    exit(1);
}

/**
 * Block theme template slug (matches templates/page-*.html filenames without .html).
 */
function pulse_tools_set_page_template(int $post_id, string $template_slug): void
{
    // FSE themes: slug like "page-about" for templates/page-about.html
    update_post_meta($post_id, '_wp_page_template', $template_slug);
}

function pulse_tools_ensure_page(array $args): int
{
    $defaults = [
        'title' => '',
        'slug' => '',
        'parent' => 0,
        'template' => '',
        'content' => '<!-- wp:paragraph --><p></p><!-- /wp:paragraph -->',
    ];
    $a = array_merge($defaults, $args);

    $path = $a['slug'];
    if (!empty($a['parent'])) {
        $parent = get_post($a['parent']);
        if ($parent) {
            $path = $parent->post_name . '/' . $a['slug'];
        }
    }

    $existing = get_page_by_path($path, OBJECT, 'page');
    if ($existing) {
        $id = (int)$existing->ID;
        wp_update_post([
            'ID' => $id,
            'post_title' => $a['title'],
            'post_parent' => (int)$a['parent'],
            'post_status' => 'publish',
        ]);
    } else {
        $id = wp_insert_post([
            'post_title' => $a['title'],
            'post_name' => $a['slug'],
            'post_parent' => (int)$a['parent'],
            'post_status' => 'publish',
            'post_type' => 'page',
            'post_content' => $a['content'],
        ], true);
        if (is_wp_error($id)) {
            fwrite(STDERR, 'Failed to create page: ' . $id->get_error_message() . "\n");
            exit(1);
        }
    }

    if ($a['template'] !== '') {
        pulse_tools_set_page_template((int)$id, $a['template']);
    } else {
        delete_post_meta((int)$id, '_wp_page_template');
    }

    return (int)$id;
}

// --- Pages aligned with apps/web routes (see Navigation.tsx) ---

$home_id = pulse_tools_ensure_page([
    'title' => 'Home',
    'slug' => 'home',
    'template' => '',
    'content' => '<!-- wp:paragraph --><p>Welcome — edit this page or replace with your issue + news blocks.</p><!-- /wp:paragraph -->',
]);

$about_id = pulse_tools_ensure_page([
    'title' => 'About Us',
    'slug' => 'about',
    'template' => 'page-about',
]);

pulse_tools_ensure_page([
    'title' => 'Our Staff',
    'slug' => 'team',
    'parent' => $about_id,
    'template' => 'page-about-team',
]);

pulse_tools_ensure_page([
    'title' => 'Submit Your Work',
    'slug' => 'submit',
    'template' => 'page-submit',
]);

pulse_tools_ensure_page([
    'title' => 'Join Our Team',
    'slug' => 'join',
    'template' => 'page-join',
]);

$blog_id = pulse_tools_ensure_page([
    'title' => 'Pulse News',
    'slug' => 'blog',
    'template' => '',
    'content' => '<!-- wp:paragraph --><p>When set as the Posts page (Settings → Reading), the theme uses <code>home.html</code> for the post listing (Vercel <code>/blog</code> parity).</p><!-- /wp:paragraph -->',
]);

pulse_tools_ensure_page([
    'title' => 'News',
    'slug' => 'news',
    'template' => 'page-news',
    'content' => '<!-- wp:paragraph --><p>If Pulse SEO redirects /news to /blog, use the Blog page for the main news listing.</p><!-- /wp:paragraph -->',
]);

if (isset($opts['set-reading'])) {
    update_option('show_on_front', 'page');
    update_option('page_on_front', $home_id);
    update_option('page_for_posts', $blog_id);
    echo "Reading: static front page = Home (ID {$home_id}), posts page = Pulse News (ID {$blog_id}).\n";
}

echo "Done. Pages created/updated.\n";
echo "URLs (with pretty permalinks): /home/ or set Home as front; /about/ /about/team/ /submit/ /join/ /blog/ /news/\n";
echo "Next: Settings → Permalinks → Save. Then Appearance → Editor if you need to reassign templates.\n";
