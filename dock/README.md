# Dock page

Local route: `/dock/`. Styles: `css/dock.css`. Interactions: `js/dock.js`.

## Hero layers

- `images/dock/dock-first-layer.png`: stationary hands, bottom layer.
- `images/dock/dock-second-layer-1.png` through `dock-second-layer-7.png`: middle slides, in order.
- `images/dock/dock-third-layer.png`: stationary foreground fingers, above every middle slide.

Export all final layers on the same centered 3450 × 985 canvas, retaining transparent margins and object positions. The three layers share one `.dock-hero__layers` wrapper and a single centering transform. There are no separate offsets or animations on the hands or fingers. The wrapper preserves the original composition scale while allowing the wider canvas to extend sideways. Legacy 2250px slide placeholders remain centered at the same height until replaced.

The cursor reveal effect is removed from the hero. The existing mountains/footer effect is unchanged. Slides advance every 2 seconds with the shared homepage controls; playback pauses outside the viewport or in a hidden tab, and starts paused for reduced motion.

## Pick what you want

Put individual exports in `images/dock/widgets/1-1.png`, `1-2.png`, etc. The first number is the row (top to bottom); the second is the position (left to right). The build discovers all files and creates rows with their actual number of cards, sorted numerically. WebP, JPG, JPEG and SVG are supported too.

Run `npm run build:dock` (also included in the full build) after adding or removing exports. Widget images render at their intrinsic dimensions (currently 98px high), without cropping or fixed-height wrappers; the gap is 12px on desktop and 8px on mobile. Row widths can differ while remaining centered. No manual HTML slots are needed.

Individual cards start with large additional horizontal spacing and converge toward each row’s center with scroll progress. The final shared gap is 12px on desktop and 8px on mobile. Scrolling back spreads them apart again. Reduced motion shows the final layout immediately. Cards are enlarged by about 16%, letting outer edges extend slightly beyond the viewport at the reference desktop size.

## Other media

The same build command fills other gray `data-dock-asset` slots from matching filenames in `images/dock/`. Examples: `customize-1.png` … `customize-7.png`, `dock-spaces.png`, `dock-monitors.png`, `dock-player.png`, `dock-together.png`, `dock-workflow.png`, `big-screen.png`, `dock-details-1.png` … `dock-details-4.png`, `dock-discover-1.png` … `dock-discover-4.png`, and `dock-inspiration-1.png` … `dock-inspiration-10.png`.

Carousels reuse the homepage's `.ai-vi` component and `js/sections.js`. Header and footer use the existing build scripts. Languages are copied from the homepage. Dock pricing has Monthly ($2.99), Lifetime Access ($59.99, previously $79.99), and Yearly ($19.99), as in the reference. Cards use `images/dock/pricing-bg.jpg`.

The image-only gallery has ten source slots (`dock-inspiration-1` … `dock-inspiration-10`). It loops right to left, supports mouse dragging, native touch scrolling, trackpad scrolling, and arrow keys. Automatic movement pauses during interaction and resumes after 1.8 seconds; reduced motion disables autoplay.

Dock FAQ questions follow the supplied screenshot. The second answer matches the reference; the other answers are temporary copy approved by the user. The homepage shares the `.faq--cards` design and keeps its original text.
