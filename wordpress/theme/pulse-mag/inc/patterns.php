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
        register_block_pattern_category('pulse-mag-pages', ['label' => __('Pulse Magazine: Pages', 'pulse-mag')]);
        register_block_pattern_category('pulse-mag-sections', ['label' => __('Pulse Magazine: Sections', 'pulse-mag')]);
        register_block_pattern_category('pulse-mag-editorial', ['label' => __('Pulse Magazine: Editorial', 'pulse-mag')]);
        register_block_pattern_category('pulse-mag-states', ['label' => __('Pulse Magazine: States', 'pulse-mag')]);
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
            'categories'  => ['pulse-mag-sections'],
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
            'categories'  => ['pulse-mag-sections'],
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
            'categories'  => ['pulse-mag-states'],
            'content'     =>
                '<!-- wp:group {"className":"pulse-loading","layout":{"type":"constrained"}} -->' .
                '<div class="wp-block-group pulse-loading">' .
                '<!-- wp:paragraph {"className":"pulse-kicker"} --><p class="pulse-kicker">Loading</p><!-- /wp:paragraph -->' .
                '<!-- wp:separator {"className":"pulse-loading-bar"} --><hr class="wp-block-separator has-alpha-channel-opacity pulse-loading-bar"/><!-- /wp:separator -->' .
                '</div><!-- /wp:group -->',
        ]
    );

    register_block_pattern(
        'pulse-mag/empty-state',
        [
            'title'       => __('Empty State', 'pulse-mag'),
            'description' => __('Guidance block when no content exists yet.', 'pulse-mag'),
            'categories'  => ['pulse-mag-states'],
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
            'categories'  => ['pulse-mag-states'],
            'content'     =>
                '<!-- wp:group {"className":"pulse-error","layout":{"type":"constrained"}} -->' .
                '<div class="wp-block-group pulse-error">' .
                '<!-- wp:paragraph {"className":"pulse-kicker"} --><p class="pulse-kicker">Unable to load</p><!-- /wp:paragraph -->' .
                '<!-- wp:paragraph --><p>Check connection settings and retry the latest import.</p><!-- /wp:paragraph -->' .
                '<!-- wp:buttons --><div class="wp-block-buttons"><!-- wp:button {"backgroundColor":"accent","textColor":"surface"} --><div class="wp-block-button"><a class="wp-block-button__link has-surface-color has-accent-background-color has-text-color has-background wp-element-button">Retry</a></div><!-- /wp:button --></div><!-- /wp:buttons -->' .
                '</div><!-- /wp:group -->',
        ]
    );

    register_block_pattern(
        'pulse-mag/page-hero',
        [
            'title'       => __('Page Hero', 'pulse-mag'),
            'description' => __('Top-of-page hero section for About/Submit/Join style pages.', 'pulse-mag'),
            'categories'  => ['pulse-mag-sections'],
            'content'     =>
                '<!-- wp:group {"align":"wide","className":"pulse-panel","layout":{"type":"constrained"}} -->' .
                '<div class="wp-block-group alignwide pulse-panel">' .
                '<!-- wp:paragraph {"align":"center","className":"pulse-kicker"} --><p class="has-text-align-center pulse-kicker">Section</p><!-- /wp:paragraph -->' .
                '<!-- wp:heading {"textAlign":"center","level":1,"fontSize":"display"} --><h1 class="wp-block-heading has-text-align-center has-display-font-size">Page title</h1><!-- /wp:heading -->' .
                '<!-- wp:paragraph {"align":"center","fontSize":"lg"} --><p class="has-text-align-center has-lg-font-size">Use this lead paragraph to match the Vercel page intro tone and keep the narrative concise.</p><!-- /wp:paragraph -->' .
                '</div><!-- /wp:group -->',
        ]
    );

    register_block_pattern(
        'pulse-mag/section-heading',
        [
            'title'       => __('Section Heading + Rule', 'pulse-mag'),
            'description' => __('Centered section title with divider for page sections.', 'pulse-mag'),
            'categories'  => ['pulse-mag-sections'],
            'content'     =>
                '<!-- wp:group {"className":"pulse-news-head","layout":{"type":"constrained"}} -->' .
                '<div class="wp-block-group pulse-news-head">' .
                '<!-- wp:heading {"textAlign":"center","level":2} --><h2 class="wp-block-heading has-text-align-center">Section heading</h2><!-- /wp:heading -->' .
                '</div><!-- /wp:group -->' .
                '<!-- wp:separator {"className":"pulse-news-rule"} --><hr class="wp-block-separator has-alpha-channel-opacity pulse-news-rule"/><!-- /wp:separator -->',
        ]
    );

    register_block_pattern(
        'pulse-mag/two-column-editorial',
        [
            'title'       => __('Two Column Editorial', 'pulse-mag'),
            'description' => __('Balanced two-column content section for About and Team pages.', 'pulse-mag'),
            'categories'  => ['pulse-mag-sections'],
            'content'     =>
                '<!-- wp:columns {"style":{"spacing":{"blockGap":{"left":"3rem"}}}} -->' .
                '<div class="wp-block-columns">' .
                '<!-- wp:column --><div class="wp-block-column">' .
                '<!-- wp:paragraph {"className":"pulse-kicker"} --><p class="pulse-kicker">Column one</p><!-- /wp:paragraph -->' .
                '<!-- wp:paragraph {"fontSize":"lg"} --><p class="has-lg-font-size">Add core narrative content here. Keep the first sentence strong and specific.</p><!-- /wp:paragraph -->' .
                '</div><!-- /wp:column -->' .
                '<!-- wp:column --><div class="wp-block-column">' .
                '<!-- wp:paragraph {"className":"pulse-kicker"} --><p class="pulse-kicker">Column two</p><!-- /wp:paragraph -->' .
                '<!-- wp:paragraph {"fontSize":"lg"} --><p class="has-lg-font-size">Use the second column for mission, process, or supporting details in the same voice.</p><!-- /wp:paragraph -->' .
                '</div><!-- /wp:column -->' .
                '</div><!-- /wp:columns -->',
        ]
    );

    register_block_pattern(
        'pulse-mag/cta-buttons-centered',
        [
            'title'       => __('Centered CTA Buttons', 'pulse-mag'),
            'description' => __('Two call-to-action buttons centered in a page section.', 'pulse-mag'),
            'categories'  => ['pulse-mag-sections'],
            'content'     =>
                '<!-- wp:buttons {"layout":{"type":"flex","justifyContent":"center","flexWrap":"wrap"}} -->' .
                '<div class="wp-block-buttons">' .
                '<!-- wp:button {"backgroundColor":"nav","textColor":"surface"} --><div class="wp-block-button"><a class="wp-block-button__link has-surface-color has-nav-background-color has-text-color has-background wp-element-button">Primary action</a></div><!-- /wp:button -->' .
                '<!-- wp:button {"className":"is-style-outline"} --><div class="wp-block-button is-style-outline"><a class="wp-block-button__link wp-element-button">Secondary action</a></div><!-- /wp:button -->' .
                '</div><!-- /wp:buttons -->',
        ]
    );

    register_block_pattern(
        'pulse-mag/contact-strip',
        [
            'title'       => __('Contact Strip', 'pulse-mag'),
            'description' => __('Simple contact/info strip for Submit/Join pages.', 'pulse-mag'),
            'categories'  => ['pulse-mag-sections'],
            'content'     =>
                '<!-- wp:group {"align":"wide","className":"pulse-panel","layout":{"type":"constrained"}} -->' .
                '<div class="wp-block-group alignwide pulse-panel">' .
                '<!-- wp:paragraph {"className":"pulse-kicker"} --><p class="pulse-kicker">Contact</p><!-- /wp:paragraph -->' .
                '<!-- wp:paragraph --><p>Email <a href="mailto:hello@pulseliterary.com">hello@pulseliterary.com</a> for editorial questions, submissions, or collaboration requests.</p><!-- /wp:paragraph -->' .
                '</div><!-- /wp:group -->',
        ]
    );

    register_block_pattern(
        'pulse-mag/about-section-stack',
        [
            'title'       => __('About Section Stack', 'pulse-mag'),
            'description' => __('Stacked about-page sections for mission, values, and process.', 'pulse-mag'),
            'categories'  => ['pulse-mag-editorial'],
            'content'     =>
                '<!-- wp:group {"align":"wide","className":"pulse-panel","layout":{"type":"constrained"}} -->' .
                '<div class="wp-block-group alignwide pulse-panel">' .
                '<!-- wp:paragraph {"className":"pulse-kicker"} --><p class="pulse-kicker">About Pulse</p><!-- /wp:paragraph -->' .
                '<!-- wp:heading {"level":2} --><h2>Who We Are</h2><!-- /wp:heading -->' .
                '<!-- wp:paragraph --><p>Pulse is a student-led literary and arts magazine centered on strong editorial curation and multimedia storytelling.</p><!-- /wp:paragraph -->' .
                '</div><!-- /wp:group -->' .
                '<!-- wp:group {"align":"wide","className":"pulse-panel","layout":{"type":"constrained"}} -->' .
                '<div class="wp-block-group alignwide pulse-panel">' .
                '<!-- wp:paragraph {"className":"pulse-kicker"} --><p class="pulse-kicker">Mission</p><!-- /wp:paragraph -->' .
                '<!-- wp:heading {"level":3} --><h3>What We Publish</h3><!-- /wp:heading -->' .
                '<!-- wp:paragraph --><p>We publish work that reflects contemporary experience across poetry, fiction, scripts, visual art, photography, dance, and music.</p><!-- /wp:paragraph -->' .
                '</div><!-- /wp:group -->' .
                '<!-- wp:group {"align":"wide","className":"pulse-panel","layout":{"type":"constrained"}} -->' .
                '<div class="wp-block-group alignwide pulse-panel">' .
                '<!-- wp:paragraph {"className":"pulse-kicker"} --><p class="pulse-kicker">Editorial Process</p><!-- /wp:paragraph -->' .
                '<!-- wp:paragraph --><p>Submissions are reviewed by section editors, discussed by the team, and finalized through managing editorial review.</p><!-- /wp:paragraph -->' .
                '</div><!-- /wp:group -->',
        ]
    );

    register_block_pattern(
        'pulse-mag/team-profile-card-row',
        [
            'title'       => __('Team Profile Card Row', 'pulse-mag'),
            'description' => __('Three profile cards for editor/staff highlights.', 'pulse-mag'),
            'categories'  => ['pulse-mag-editorial'],
            'content'     =>
                '<!-- wp:columns {"style":{"spacing":{"blockGap":{"left":"1rem"}}}} -->' .
                '<div class="wp-block-columns">' .
                '<!-- wp:column --><div class="wp-block-column"><!-- wp:group {"className":"pulse-panel","layout":{"type":"constrained"}} --><div class="wp-block-group pulse-panel">' .
                '<!-- wp:heading {"level":4} --><h4>Editor Name</h4><!-- /wp:heading -->' .
                '<!-- wp:paragraph {"className":"pulse-kicker"} --><p class="pulse-kicker">Role Title</p><!-- /wp:paragraph -->' .
                '<!-- wp:paragraph --><p>Short bio describing focus area and editorial contributions.</p><!-- /wp:paragraph -->' .
                '</div><!-- /wp:group --></div><!-- /wp:column -->' .
                '<!-- wp:column --><div class="wp-block-column"><!-- wp:group {"className":"pulse-panel","layout":{"type":"constrained"}} --><div class="wp-block-group pulse-panel">' .
                '<!-- wp:heading {"level":4} --><h4>Editor Name</h4><!-- /wp:heading -->' .
                '<!-- wp:paragraph {"className":"pulse-kicker"} --><p class="pulse-kicker">Role Title</p><!-- /wp:paragraph -->' .
                '<!-- wp:paragraph --><p>Short bio describing section leadership and publication interests.</p><!-- /wp:paragraph -->' .
                '</div><!-- /wp:group --></div><!-- /wp:column -->' .
                '<!-- wp:column --><div class="wp-block-column"><!-- wp:group {"className":"pulse-panel","layout":{"type":"constrained"}} --><div class="wp-block-group pulse-panel">' .
                '<!-- wp:heading {"level":4} --><h4>Editor Name</h4><!-- /wp:heading -->' .
                '<!-- wp:paragraph {"className":"pulse-kicker"} --><p class="pulse-kicker">Role Title</p><!-- /wp:paragraph -->' .
                '<!-- wp:paragraph --><p>Short bio describing multidisciplinary work and collaboration approach.</p><!-- /wp:paragraph -->' .
                '</div><!-- /wp:group --></div><!-- /wp:column -->' .
                '</div><!-- /wp:columns -->',
        ]
    );

    register_block_pattern(
        'pulse-mag/news-feature-list-combo',
        [
            'title'       => __('News Feature + List Combo', 'pulse-mag'),
            'description' => __('Featured news panel plus compact recent story list.', 'pulse-mag'),
            'categories'  => ['pulse-mag-editorial'],
            'content'     =>
                '<!-- wp:columns {"style":{"spacing":{"blockGap":{"left":"1.25rem"}}}} -->' .
                '<div class="wp-block-columns">' .
                '<!-- wp:column {"width":"62%"} --><div class="wp-block-column" style="flex-basis:62%"><!-- wp:group {"className":"pulse-panel","layout":{"type":"constrained"}} --><div class="wp-block-group pulse-panel">' .
                '<!-- wp:paragraph {"className":"pulse-kicker"} --><p class="pulse-kicker">Featured Story</p><!-- /wp:paragraph -->' .
                '<!-- wp:heading {"level":3} --><h3>Lead headline from the latest Pulse News post</h3><!-- /wp:heading -->' .
                '<!-- wp:paragraph --><p>Use this area for the story summary and one clear path to continue reading.</p><!-- /wp:paragraph -->' .
                '<!-- wp:buttons --><div class="wp-block-buttons"><!-- wp:button {"backgroundColor":"accent","textColor":"surface"} --><div class="wp-block-button"><a class="wp-block-button__link has-surface-color has-accent-background-color has-text-color has-background wp-element-button">Read Feature</a></div><!-- /wp:button --></div><!-- /wp:buttons -->' .
                '</div><!-- /wp:group --></div><!-- /wp:column -->' .
                '<!-- wp:column {"width":"38%"} --><div class="wp-block-column" style="flex-basis:38%"><!-- wp:group {"className":"pulse-panel","layout":{"type":"constrained"}} --><div class="wp-block-group pulse-panel">' .
                '<!-- wp:paragraph {"className":"pulse-kicker"} --><p class="pulse-kicker">Recent Stories</p><!-- /wp:paragraph -->' .
                '<!-- wp:list --><ul><li><a href="#">Story title one</a></li><li><a href="#">Story title two</a></li><li><a href="#">Story title three</a></li><li><a href="#">Story title four</a></li></ul><!-- /wp:list -->' .
                '</div><!-- /wp:group --></div><!-- /wp:column -->' .
                '</div><!-- /wp:columns -->',
        ]
    );

    register_block_pattern(
        'pulse-mag/submit-guidelines-block',
        [
            'title'       => __('Submit Guidelines Block', 'pulse-mag'),
            'description' => __('Structured submission requirements and checklist section.', 'pulse-mag'),
            'categories'  => ['pulse-mag-editorial'],
            'content'     =>
                '<!-- wp:group {"align":"wide","className":"pulse-panel","layout":{"type":"constrained"}} -->' .
                '<div class="wp-block-group alignwide pulse-panel">' .
                '<!-- wp:paragraph {"className":"pulse-kicker"} --><p class="pulse-kicker">Submissions</p><!-- /wp:paragraph -->' .
                '<!-- wp:heading {"level":2} --><h2>Guidelines</h2><!-- /wp:heading -->' .
                '<!-- wp:list --><ul><li>Submit original work only.</li><li>Include title, creator name, and contact email.</li><li>Follow format requirements listed for your category.</li><li>Respect published deadline windows.</li></ul><!-- /wp:list -->' .
                '<!-- wp:paragraph --><p>Questions: <a href="mailto:submissions@pulseliterary.com">submissions@pulseliterary.com</a></p><!-- /wp:paragraph -->' .
                '<!-- wp:buttons --><div class="wp-block-buttons"><!-- wp:button {"backgroundColor":"accent","textColor":"surface"} --><div class="wp-block-button"><a class="wp-block-button__link has-surface-color has-accent-background-color has-text-color has-background wp-element-button">Start Submission</a></div><!-- /wp:button --></div><!-- /wp:buttons -->' .
                '</div><!-- /wp:group -->',
        ]
    );

    register_block_pattern(
        'pulse-mag/join-role-cards',
        [
            'title'       => __('Join Role Cards', 'pulse-mag'),
            'description' => __('Card set describing open roles for recruiting pages.', 'pulse-mag'),
            'categories'  => ['pulse-mag-editorial'],
            'content'     =>
                '<!-- wp:columns {"style":{"spacing":{"blockGap":{"left":"1rem"}}}} -->' .
                '<div class="wp-block-columns">' .
                '<!-- wp:column --><div class="wp-block-column"><!-- wp:group {"className":"pulse-panel","layout":{"type":"constrained"}} --><div class="wp-block-group pulse-panel">' .
                '<!-- wp:paragraph {"className":"pulse-kicker"} --><p class="pulse-kicker">Open Role</p><!-- /wp:paragraph -->' .
                '<!-- wp:heading {"level":3} --><h3>Poetry Editor</h3><!-- /wp:heading -->' .
                '<!-- wp:paragraph --><p>Review submissions, shape issue curation, and collaborate on editorial planning.</p><!-- /wp:paragraph -->' .
                '</div><!-- /wp:group --></div><!-- /wp:column -->' .
                '<!-- wp:column --><div class="wp-block-column"><!-- wp:group {"className":"pulse-panel","layout":{"type":"constrained"}} --><div class="wp-block-group pulse-panel">' .
                '<!-- wp:paragraph {"className":"pulse-kicker"} --><p class="pulse-kicker">Open Role</p><!-- /wp:paragraph -->' .
                '<!-- wp:heading {"level":3} --><h3>Visual Arts Editor</h3><!-- /wp:heading -->' .
                '<!-- wp:paragraph --><p>Lead visual selection across art, photography, and multimedia submissions.</p><!-- /wp:paragraph -->' .
                '</div><!-- /wp:group --></div><!-- /wp:column -->' .
                '<!-- wp:column --><div class="wp-block-column"><!-- wp:group {"className":"pulse-panel","layout":{"type":"constrained"}} --><div class="wp-block-group pulse-panel">' .
                '<!-- wp:paragraph {"className":"pulse-kicker"} --><p class="pulse-kicker">Open Role</p><!-- /wp:paragraph -->' .
                '<!-- wp:heading {"level":3} --><h3>News Contributor</h3><!-- /wp:heading -->' .
                '<!-- wp:paragraph --><p>Write Pulse News coverage on events, features, and behind-the-scenes stories.</p><!-- /wp:paragraph -->' .
                '</div><!-- /wp:group --></div><!-- /wp:column -->' .
                '</div><!-- /wp:columns -->' .
                '<!-- wp:buttons {"layout":{"type":"flex","justifyContent":"center"}} --><div class="wp-block-buttons"><!-- wp:button {"backgroundColor":"nav","textColor":"surface"} --><div class="wp-block-button"><a class="wp-block-button__link has-surface-color has-nav-background-color has-text-color has-background wp-element-button">Apply to Join</a></div><!-- /wp:button --></div><!-- /wp:buttons -->',
        ]
    );

    register_block_pattern(
        'pulse-mag/about-page-starter',
        [
            'title'       => __('About Page Starter', 'pulse-mag'),
            'description' => __('Complete About page starter matching Pulse editorial style.', 'pulse-mag'),
            'categories'  => ['pulse-mag-pages'],
            'content'     =>
                '<!-- wp:group {"align":"wide","className":"pulse-panel","layout":{"type":"constrained"}} --><div class="wp-block-group alignwide pulse-panel">' .
                '<!-- wp:paragraph {"align":"center","className":"pulse-kicker"} --><p class="has-text-align-center pulse-kicker">About Us</p><!-- /wp:paragraph -->' .
                '<!-- wp:heading {"textAlign":"center","level":1,"fontSize":"display"} --><h1 class="wp-block-heading has-text-align-center has-display-font-size">About Pulse</h1><!-- /wp:heading -->' .
                '<!-- wp:paragraph {"align":"center","fontSize":"lg"} --><p class="has-text-align-center has-lg-font-size">Pulse Literary &amp; Arts Magazine is an annual multimedia publication led by students at Point Park University.</p><!-- /wp:paragraph -->' .
                '</div><!-- /wp:group -->' .
                '<!-- wp:pattern {"slug":"pulse-mag/about-section-stack"} /-->' .
                '<!-- wp:pattern {"slug":"pulse-mag/cta-buttons-centered"} /-->',
        ]
    );

    register_block_pattern(
        'pulse-mag/submit-page-starter',
        [
            'title'       => __('Submit Page Starter', 'pulse-mag'),
            'description' => __('Complete submissions page starter with guidelines and CTA.', 'pulse-mag'),
            'categories'  => ['pulse-mag-pages'],
            'content'     =>
                '<!-- wp:group {"align":"wide","className":"pulse-panel","layout":{"type":"constrained"}} --><div class="wp-block-group alignwide pulse-panel">' .
                '<!-- wp:paragraph {"align":"center","className":"pulse-kicker"} --><p class="has-text-align-center pulse-kicker">Submit</p><!-- /wp:paragraph -->' .
                '<!-- wp:heading {"textAlign":"center","level":1,"fontSize":"display"} --><h1 class="wp-block-heading has-text-align-center has-display-font-size">Submit Your Work</h1><!-- /wp:heading -->' .
                '<!-- wp:paragraph {"align":"center","fontSize":"lg"} --><p class="has-text-align-center has-lg-font-size">Share work that reflects voice, craft, and contemporary experience across literary and visual forms.</p><!-- /wp:paragraph -->' .
                '</div><!-- /wp:group -->' .
                '<!-- wp:pattern {"slug":"pulse-mag/submit-guidelines-block"} /-->' .
                '<!-- wp:pattern {"slug":"pulse-mag/contact-strip"} /-->',
        ]
    );

    register_block_pattern(
        'pulse-mag/join-page-starter',
        [
            'title'       => __('Join Page Starter', 'pulse-mag'),
            'description' => __('Complete recruiting page starter with role cards and CTA.', 'pulse-mag'),
            'categories'  => ['pulse-mag-pages'],
            'content'     =>
                '<!-- wp:group {"align":"wide","className":"pulse-panel","layout":{"type":"constrained"}} --><div class="wp-block-group alignwide pulse-panel">' .
                '<!-- wp:paragraph {"align":"center","className":"pulse-kicker"} --><p class="has-text-align-center pulse-kicker">Join Pulse</p><!-- /wp:paragraph -->' .
                '<!-- wp:heading {"textAlign":"center","level":1,"fontSize":"display"} --><h1 class="wp-block-heading has-text-align-center has-display-font-size">Work With Our Editorial Team</h1><!-- /wp:heading -->' .
                '<!-- wp:paragraph {"align":"center","fontSize":"lg"} --><p class="has-text-align-center has-lg-font-size">We are always looking for editors, contributors, and collaborators across literary and arts disciplines.</p><!-- /wp:paragraph -->' .
                '</div><!-- /wp:group -->' .
                '<!-- wp:pattern {"slug":"pulse-mag/join-role-cards"} /-->' .
                '<!-- wp:pattern {"slug":"pulse-mag/contact-strip"} /-->',
        ]
    );
}
add_action('init', 'pulse_mag_register_patterns');
