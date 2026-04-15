<?php
/**
 * Generate a WordPress WXR (export) that mirrors apps/web routes and starter copy
 * aligned with the Vercel site — for clean imports without legacy theme cruft.
 *
 * Usage (repo root, requires PHP CLI):
 *   php wordpress/tools/generate-vercel-parity-wxr.php
 *
 * Output:
 *   wordpress/data/pulse-vercel-parity.WordPress.xml
 *
 * If you do not have PHP installed, use the checked-in copy of that file under
 * `wordpress/data/` — it is kept in sync when this script is run in CI or by a maintainer.
 *
 * Import: activate Pulse Mag theme + Pulse Mag Core + Pulse Flipbook (and SEO if used)
 * first so issue/event CPTs and the Issue Flipbook block are available, then run
 * import-wxr.ps1 against this file.
 */

if (php_sapi_name() !== 'cli') {
    fwrite(STDERR, "CLI only.\n");
    exit(1);
}

$repoRoot = dirname(__DIR__, 2);
$outPath = $repoRoot . DIRECTORY_SEPARATOR . 'wordpress' . DIRECTORY_SEPARATOR . 'data' . DIRECTORY_SEPARATOR . 'pulse-vercel-parity.WordPress.xml';

$now = gmdate('D, d M Y H:i:s') . ' +0000';
$stamp = gmdate('Y-m-d H:i:s');
$siteUrl = 'https://pulseliterary.com';
$authorLogin = 'pulseeditor';
$authorEmail = 'editor@pulseliterary.com';
$authorName = 'Pulse Editorial';

// Stable numeric IDs for parent/child relationships in the export.
$ids = [
    'home' => 5001,
    'about' => 5002,
    'team' => 5003,
    'submit' => 5004,
    'join' => 5005,
    'blog' => 5006,
    'news' => 5007,
    'events' => 5008,
    'post_welcome' => 5010,
    'post_second' => 5011,
    'issue_1' => 5020,
    'event_1' => 5030,
];

$cdata = static function (string $s): string {
    return '<![CDATA[' . str_replace(']]>', ']]]]><![CDATA[>', $s) . ']]>';
};

$aboutBlocks = <<<'HTML'
<!-- wp:heading {"level":1} -->
<h1 class="wp-block-heading">About Us</h1>
<!-- /wp:heading -->
<!-- wp:paragraph -->
<p><strong>About</strong></p>
<!-- /wp:paragraph -->
<!-- wp:paragraph -->
<p>Pulse Literary &amp; Arts Magazine is an annual multimedia literary and arts magazine led by students at Point Park University. As a multimedia magazine, we publish all art forms, including literature, poetry, scripts, art, photography, dance, and music.</p>
<!-- /wp:paragraph -->
<!-- wp:paragraph -->
<p>At Pulse, we believe every voice has a story worth telling. Our mission is to amplify the creative spirit of Point Park University and beyond, creating a space where art and literature converge to inspire, challenge, and connect us all.</p>
<!-- /wp:paragraph -->
<!-- wp:paragraph -->
<p><em>— Pulse Editorial Team</em></p>
<!-- /wp:paragraph -->
HTML;

$teamBlocks = <<<'HTML'
<!-- wp:heading {"level":1} -->
<h1 class="wp-block-heading">Our Staff</h1>
<!-- /wp:heading -->
<!-- wp:paragraph -->
<p>Meet the student editors and contributors who produce each issue. Replace this placeholder with your team bios and photos.</p>
<!-- /wp:paragraph -->
HTML;

$submitBlocks = <<<'HTML'
<!-- wp:heading {"level":1} -->
<h1 class="wp-block-heading">Submit Your Work</h1>
<!-- /wp:heading -->
<!-- wp:paragraph -->
<p><strong>Pulse Magazine is Pittsburgh's premier literary journal</strong> dedicated to publishing poetry, fiction, visual art, and multimedia from emerging writers and artists. We welcome submissions from Point Park University students and emerging writers in the Pittsburgh area.</p>
<!-- /wp:paragraph -->
<!-- wp:paragraph -->
<p>Our yearly submission window opens <strong>October 1</strong> and closes <strong>January 31</strong>. All accepted work receives author bylines and featured placement on our website.</p>
<!-- /wp:paragraph -->
<!-- wp:paragraph -->
<p>Review our guidelines, prepare your best work, and use the contact paths your editorial team provides during the open window.</p>
<!-- /wp:paragraph -->
HTML;

$joinBlocks = <<<'HTML'
<!-- wp:heading {"level":1} -->
<h1 class="wp-block-heading">Join Our Team</h1>
<!-- /wp:heading -->
<!-- wp:paragraph -->
<p>We're looking to grow our team of creatives. These volunteer roles offer a creative outlet, experience in literary magazine publishing, and connections with talented creators. Role descriptions and requirements live in your internal handbook — use this page to explain how candidates should apply.</p>
<!-- /wp:paragraph -->
HTML;

$homeBlocks = <<<'HTML'
<!-- wp:paragraph -->
<p>Welcome — this page mirrors the Vercel home intent. Set it as your static front page under Settings → Reading, or merge blocks with your issue highlights and news.</p>
<!-- /wp:paragraph -->
HTML;

$blogBlocks = <<<'HTML'
<!-- wp:paragraph -->
<p>When this page is set as the <strong>Posts page</strong> (Settings → Reading), WordPress uses your theme's blog template for post listings — parity with the Vercel <code>/blog</code> route.</p>
<!-- /wp:paragraph -->
HTML;

$newsBlocks = <<<'HTML'
<!-- wp:paragraph -->
<p>On the Next.js site, <code>/news</code> redirects to <code>/blog</code>. Use Pulse SEO or redirects if you want the same behavior in WordPress, or edit this page for a dedicated news intro.</p>
<!-- /wp:paragraph -->
HTML;

$eventsBlocks = <<<'HTML'
<!-- wp:heading {"level":1} -->
<h1 class="wp-block-heading">Events</h1>
<!-- /wp:heading -->
<!-- wp:paragraph -->
<p>Upcoming readings, workshops, and community gatherings. Replace this intro with your schedule; the theme archive at <code>/events/</code> lists <strong>event</strong> posts.</p>
<!-- /wp:paragraph -->
HTML;

$postWelcome = <<<'HTML'
<!-- wp:paragraph -->
<p>We are excited to launch our site and welcome submissions from emerging writers and artists in Pittsburgh and beyond. Follow Pulse News for calls, deadlines, and issue announcements.</p>
<!-- /wp:paragraph -->
HTML;

$postSecond = <<<'HTML'
<!-- wp:paragraph -->
<p>Short reads, craft notes, and community updates from the editorial desk — edit or replace with migrated Sanity or legacy blog content.</p>
<!-- /wp:paragraph -->
HTML;

function item_page(
    int $id,
    string $title,
    string $slug,
    string $linkPath,
    string $content,
    int $parent,
    string $template,
    string $siteUrl,
    string $stamp,
    string $now,
    string $authorLogin,
    callable $cdata
): string {
    $guid = $siteUrl . '/?page_id=' . $id;
    $link = $siteUrl . $linkPath;
    $meta = '';
    if ($template !== '') {
        $meta = "\n\t\t<wp:postmeta>\n\t\t<wp:meta_key><![CDATA[_wp_page_template]]></wp:meta_key>\n\t\t<wp:meta_value>{$cdata($template)}</wp:meta_value>\n\t\t</wp:postmeta>";
    }
    $parentXml = $parent > 0 ? (string)$parent : '0';

    return <<<XML
\t\t<item>
\t\t<title>{$cdata($title)}</title>
\t\t<link>{$cdata($link)}</link>
\t\t<pubDate>{$now}</pubDate>
\t\t<dc:creator>{$cdata($authorLogin)}</dc:creator>
\t\t<guid isPermaLink="false">{$cdata($guid)}</guid>
\t\t<description></description>
\t\t<content:encoded>{$cdata($content)}</content:encoded>
\t\t<excerpt:encoded><![CDATA[]]></excerpt:encoded>
\t\t<wp:post_id>{$id}</wp:post_id>
\t\t<wp:post_date>{$cdata($stamp)}</wp:post_date>
\t\t<wp:post_date_gmt>{$cdata($stamp)}</wp:post_date_gmt>
\t\t<wp:post_modified>{$cdata($stamp)}</wp:post_modified>
\t\t<wp:post_modified_gmt>{$cdata($stamp)}</wp:post_modified_gmt>
\t\t<wp:comment_status><![CDATA[closed]]></wp:comment_status>
\t\t<wp:ping_status><![CDATA[closed]]></wp:ping_status>
\t\t<wp:post_name>{$cdata($slug)}</wp:post_name>
\t\t<wp:status><![CDATA[publish]]></wp:status>
\t\t<wp:post_parent>{$parentXml}</wp:post_parent>
\t\t<wp:menu_order>0</wp:menu_order>
\t\t<wp:post_type><![CDATA[page]]></wp:post_type>
\t\t<wp:post_password><![CDATA[]]></wp:post_password>
\t\t<wp:is_sticky>0</wp:is_sticky>{$meta}
\t\t\t\t\t\t</item>
XML;
}

function item_post(
    int $id,
    string $title,
    string $slug,
    string $content,
    string $siteUrl,
    string $stamp,
    string $now,
    string $authorLogin,
    callable $cdata
): string {
    $guid = $siteUrl . '/?p=' . $id;
    $link = $siteUrl . '/' . $slug . '/';

    return <<<XML
\t\t<item>
\t\t<title>{$cdata($title)}</title>
\t\t<link>{$cdata($link)}</link>
\t\t<pubDate>{$now}</pubDate>
\t\t<dc:creator>{$cdata($authorLogin)}</dc:creator>
\t\t<guid isPermaLink="false">{$cdata($guid)}</guid>
\t\t<description></description>
\t\t<content:encoded>{$cdata($content)}</content:encoded>
\t\t<excerpt:encoded><![CDATA[]]></excerpt:encoded>
\t\t<category domain="category" nicename="news"><![CDATA[News]]></category>
\t\t<wp:post_id>{$id}</wp:post_id>
\t\t<wp:post_date>{$cdata($stamp)}</wp:post_date>
\t\t<wp:post_date_gmt>{$cdata($stamp)}</wp:post_date_gmt>
\t\t<wp:post_modified>{$cdata($stamp)}</wp:post_modified>
\t\t<wp:post_modified_gmt>{$cdata($stamp)}</wp:post_modified_gmt>
\t\t<wp:comment_status><![CDATA[open]]></wp:comment_status>
\t\t<wp:ping_status><![CDATA[open]]></wp:ping_status>
\t\t<wp:post_name>{$cdata($slug)}</wp:post_name>
\t\t<wp:status><![CDATA[publish]]></wp:status>
\t\t<wp:post_parent>0</wp:post_parent>
\t\t<wp:menu_order>0</wp:menu_order>
\t\t<wp:post_type><![CDATA[post]]></wp:post_type>
\t\t<wp:post_password><![CDATA[]]></wp:post_password>
\t\t<wp:is_sticky>0</wp:is_sticky>
\t\t\t\t\t\t</item>
XML;
}

function item_cpt_issue(
    int $id,
    string $title,
    string $slug,
    string $summary,
    string $siteUrl,
    string $stamp,
    string $now,
    string $authorLogin,
    callable $cdata
): string {
    $guid = $siteUrl . '/?post_type=issue&p=' . $id;
    $link = $siteUrl . '/issues/' . $slug . '/';

    $meta = [
        '_pulse_issue_season' => 'Summer 2026',
        '_pulse_issue_status' => 'current',
        '_pulse_issue_number' => '1',
        '_pulse_issue_summary' => $summary,
        '_pulse_issue_window_text' => 'Open for pitches through June 20',
        '_pulse_issue_status_note' => 'Brief and reading package publishing soon.',
        '_pulse_issue_pdf_url' => '',
        '_pulse_issue_pdf_attachment_id' => '0',
    ];
    $metaXml = '';
    foreach ($meta as $k => $v) {
        $metaXml .= "\n\t\t<wp:postmeta>\n\t\t<wp:meta_key>{$cdata($k)}</wp:meta_key>\n\t\t<wp:meta_value>{$cdata($v)}</wp:meta_value>\n\t\t</wp:postmeta>";
    }

    return <<<XML
\t\t<item>
\t\t<title>{$cdata($title)}</title>
\t\t<link>{$cdata($link)}</link>
\t\t<pubDate>{$now}</pubDate>
\t\t<dc:creator>{$cdata($authorLogin)}</dc:creator>
\t\t<guid isPermaLink="false">{$cdata($guid)}</guid>
\t\t<description></description>
\t\t<content:encoded>{$cdata(
            '<!-- wp:pulse/issue-flipbook {"viewerHeight":760,"showDownload":true} /-->'
            . '<!-- wp:paragraph --><p>Sample issue entry — attach a PDF in the Issue PDF (Flipbook) box to power the native Issue Flipbook block render.</p><!-- /wp:paragraph -->'
        )}</content:encoded>
\t\t<excerpt:encoded>{$cdata($summary)}</excerpt:encoded>
\t\t<wp:post_id>{$id}</wp:post_id>
\t\t<wp:post_date>{$cdata($stamp)}</wp:post_date>
\t\t<wp:post_date_gmt>{$cdata($stamp)}</wp:post_date_gmt>
\t\t<wp:post_modified>{$cdata($stamp)}</wp:post_modified>
\t\t<wp:post_modified_gmt>{$cdata($stamp)}</wp:post_modified_gmt>
\t\t<wp:comment_status><![CDATA[closed]]></wp:comment_status>
\t\t<wp:ping_status><![CDATA[closed]]></wp:ping_status>
\t\t<wp:post_name>{$cdata($slug)}</wp:post_name>
\t\t<wp:status><![CDATA[publish]]></wp:status>
\t\t<wp:post_parent>0</wp:post_parent>
\t\t<wp:menu_order>0</wp:menu_order>
\t\t<wp:post_type><![CDATA[issue]]></wp:post_type>
\t\t<wp:post_password><![CDATA[]]></wp:post_password>
\t\t<wp:is_sticky>0</wp:is_sticky>{$metaXml}
\t\t\t\t\t\t</item>
XML;
}

function item_cpt_event(
    int $id,
    string $title,
    string $slug,
    string $siteUrl,
    string $stamp,
    string $now,
    string $authorLogin,
    callable $cdata
): string {
    $guid = $siteUrl . '/?post_type=event&p=' . $id;
    $link = $siteUrl . '/events/' . $slug . '/';

    $meta = [
        '_pulse_event_date' => '2026-09-15T18:00:00',
        '_pulse_event_location' => 'Point Park University, Pittsburgh',
        '_pulse_event_link' => $siteUrl,
        '_pulse_event_summary' => 'Kickoff reading for the new issue — replace with your event.',
    ];
    $metaXml = '';
    foreach ($meta as $k => $v) {
        $metaXml .= "\n\t\t<wp:postmeta>\n\t\t<wp:meta_key>{$cdata($k)}</wp:meta_key>\n\t\t<wp:meta_value>{$cdata($v)}</wp:meta_value>\n\t\t</wp:postmeta>";
    }

    return <<<XML
\t\t<item>
\t\t<title>{$cdata($title)}</title>
\t\t<link>{$cdata($link)}</link>
\t\t<pubDate>{$now}</pubDate>
\t\t<dc:creator>{$cdata($authorLogin)}</dc:creator>
\t\t<guid isPermaLink="false">{$cdata($guid)}</guid>
\t\t<description></description>
\t\t<content:encoded>{$cdata('<!-- wp:paragraph --><p>Sample event — edit date and location in Pulse Mag event fields.</p><!-- /wp:paragraph -->')}</content:encoded>
\t\t<excerpt:encoded><![CDATA[]]></excerpt:encoded>
\t\t<wp:post_id>{$id}</wp:post_id>
\t\t<wp:post_date>{$cdata($stamp)}</wp:post_date>
\t\t<wp:post_date_gmt>{$cdata($stamp)}</wp:post_date_gmt>
\t\t<wp:post_modified>{$cdata($stamp)}</wp:post_modified>
\t\t<wp:post_modified_gmt>{$cdata($stamp)}</wp:post_modified_gmt>
\t\t<wp:comment_status><![CDATA[closed]]></wp:comment_status>
\t\t<wp:ping_status><![CDATA[closed]]></wp:ping_status>
\t\t<wp:post_name>{$cdata($slug)}</wp:post_name>
\t\t<wp:status><![CDATA[publish]]></wp:status>
\t\t<wp:post_parent>0</wp:post_parent>
\t\t<wp:menu_order>0</wp:menu_order>
\t\t<wp:post_type><![CDATA[event]]></wp:post_type>
\t\t<wp:post_password><![CDATA[]]></wp:post_password>
\t\t<wp:is_sticky>0</wp:is_sticky>{$metaXml}
\t\t\t\t\t\t</item>
XML;
}

$items = [];
$items[] = item_page($ids['home'], 'Home', 'home', '/home/', $homeBlocks, 0, '', $siteUrl, $stamp, $now, $authorLogin, $cdata);
$items[] = item_page($ids['about'], 'About Us', 'about', '/about/', $aboutBlocks, 0, 'page-about', $siteUrl, $stamp, $now, $authorLogin, $cdata);
$items[] = item_page($ids['team'], 'Our Staff', 'team', '/about/team/', $teamBlocks, $ids['about'], 'page-about-team', $siteUrl, $stamp, $now, $authorLogin, $cdata);
$items[] = item_page($ids['submit'], 'Submit Your Work', 'submit', '/submit/', $submitBlocks, 0, 'page-submit', $siteUrl, $stamp, $now, $authorLogin, $cdata);
$items[] = item_page($ids['join'], 'Join Our Team', 'join', '/join/', $joinBlocks, 0, 'page-join', $siteUrl, $stamp, $now, $authorLogin, $cdata);
$items[] = item_page($ids['blog'], 'Pulse News', 'blog', '/blog/', $blogBlocks, 0, '', $siteUrl, $stamp, $now, $authorLogin, $cdata);
$items[] = item_page($ids['news'], 'News', 'news', '/news/', $newsBlocks, 0, 'page-news', $siteUrl, $stamp, $now, $authorLogin, $cdata);
$items[] = item_page($ids['events'], 'Events', 'events', '/events/', $eventsBlocks, 0, '', $siteUrl, $stamp, $now, $authorLogin, $cdata);

$items[] = item_post($ids['post_welcome'], 'Welcome to Pulse Magazine', 'welcome-to-pulse', $postWelcome, $siteUrl, $stamp, $now, $authorLogin, $cdata);
$items[] = item_post($ids['post_second'], 'From the Editors', 'from-the-editors', $postSecond, $siteUrl, $stamp, $now, $authorLogin, $cdata);

$items[] = item_cpt_issue(
    $ids['issue_1'],
    'Signal / Noise',
    'signal-noise',
    'Essays, dispatches, and criticism about what survives the algorithm: local scenes, durable ideas, and the people who keep culture legible.',
    $siteUrl,
    $stamp,
    $now,
    $authorLogin,
    $cdata
);
$items[] = item_cpt_event($ids['event_1'], 'Fall Reading & Launch', 'fall-reading-launch', $siteUrl, $stamp, $now, $authorLogin, $cdata);

$itemsXml = implode("\n", $items);

// One category term for posts.
$categoryXml = <<<'XML'
	<wp:category>
		<wp:term_id>91001</wp:term_id>
		<wp:category_nicename><![CDATA[news]]></wp:category_nicename>
		<wp:category_parent><![CDATA[]]></wp:category_parent>
		<wp:cat_name><![CDATA[News]]></wp:cat_name>
	</wp:category>
XML;

$xml = <<<XML
<?xml version="1.0" encoding="UTF-8" ?>
<rss version="2.0"
	xmlns:excerpt="http://wordpress.org/export/1.2/excerpt/"
	xmlns:content="http://purl.org/rss/1.0/modules/content/"
	xmlns:wfw="http://wellformedweb.org/CommentAPI/"
	xmlns:dc="http://purl.org/dc/elements/1.1/"
	xmlns:wp="http://wordpress.org/export/1.2/"
>

<channel>
	<title>Pulse Literary Magazine (Vercel parity seed)</title>
	<link>{$siteUrl}</link>
	<description>Generated seed export aligned with apps/web routes — not a full site backup.</description>
	<pubDate>{$now}</pubDate>
	<language>en-US</language>
	<wp:wxr_version>1.2</wp:wxr_version>
	<wp:base_site_url>{$siteUrl}</wp:base_site_url>
	<wp:base_blog_url>{$siteUrl}</wp:base_blog_url>

	<wp:author>
		<wp:author_id>91001</wp:author_id>
		<wp:author_login>{$cdata($authorLogin)}</wp:author_login>
		<wp:author_email>{$cdata($authorEmail)}</wp:author_email>
		<wp:author_display_name>{$cdata($authorName)}</wp:author_display_name>
		<wp:author_first_name><![CDATA[Pulse]]></wp:author_first_name>
		<wp:author_last_name><![CDATA[Editorial]]></wp:author_last_name>
	</wp:author>

{$categoryXml}

	<generator>https://wordpress.org/?v=6.9</generator>

{$itemsXml}

</channel>
</rss>

XML;

$dir = dirname($outPath);
if (!is_dir($dir)) {
    mkdir($dir, 0775, true);
}

if (file_put_contents($outPath, $xml) === false) {
    fwrite(STDERR, "Failed to write: {$outPath}\n");
    exit(1);
}

echo "Wrote {$outPath}\n";
echo "Pages: home, about, about/team, submit, join, blog, news, events. Posts: 2. CPT: 1 issue, 1 event.\n";
echo "After import: run create-vercel-parity-pages.php --set-reading OR set Home + Pulse News under Settings → Reading.\n";
