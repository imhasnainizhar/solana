import type { Category, Media, Product } from '@/payload-types'
import type { RequiredDataFromCollectionSlug } from 'payload'

type Args = {
  heroTiles: Media[]
  productImage: Media
  calloutImage: Media
  slides: Media[]
  pressImages: Media[]
  aura: Product
  accessories: Category
  metaImage: Media
}

/** Sabi-style home page: hero → product intro → steps → featured product → slideshow → collection → press → newsletter. */
export const homePageData = ({
  heroTiles,
  productImage,
  calloutImage,
  slides,
  pressImages,
  aura,
  accessories,
  metaImage,
}: Args): RequiredDataFromCollectionSlug<'pages'> => ({
  title: 'Home',
  slug: 'home',
  _status: 'published',
  hero: { type: 'none' },
  meta: {
    title: 'Solana Studio — Aura One',
    description: 'Aura One is a palm-sized companion that reads your breath and gently guides you back to focus.',
    image: metaImage.id,
  },
  layout: [
    {
      blockType: 'sabiHero',
      headline: 'Just Breathe.',
      tiles: heroTiles.map((image) => ({ image: image.id })),
      columnsDesktop: 6,
      columnsMobile: 3,
      height: 'tall',
      overlay: 55,
      parallax: 35,
      drift: true,
    },
    {
      blockType: 'productIntro',
      anchor: 'aura-one',
      name: 'Aura One',
      watermark: 'Aura One',
      promise:
        'A palm-sized companion that reads your breath and gently guides you back to focus — wherever you are.',
      secondary: 'No screens. No feeds. Just you, thinking clearly.',
      image: productImage.id,
      tagline: 'Focus, held in your hand',
      callouts: [{ image: calloutImage.id, label: 'Breath sensor array', detail: '0.4 mm membrane' }],
      enableLink: false,
      background: 'cream',
    },
    {
      blockType: 'steps',
      anchor: 'science',
      heading: 'The Science\nBehind Calm\nFocus',
      steps: [
        { body: 'A breath sensor array, thinner than a coin, listens to the rhythm of your breathing.' },
        { body: 'On-device models learn your personal baseline over the first week — nothing leaves the device.' },
        { body: 'Gentle haptics pace your breath back to a focused state, in under ninety seconds.' },
      ],
      numberStyle: 'padded',
      background: 'sand',
    },
    {
      blockType: 'featuredProduct',
      anchor: 'buy',
      product: aura.id,
      eyebrow: 'First batch · Ships in December',
      heading: 'Aura One',
      description:
        'Machined aluminium shell, a fabric-soft underside and a battery that lasts a fortnight. Choose your finish.',
      highlights: [
        { text: 'Two-week battery, USB-C and wireless charging' },
        { text: 'Works offline — your data stays on the device' },
        { text: 'Free shipping and 60-night returns' },
      ],
      imagePosition: 'left',
      buttonLabel: 'Add to cart',
      background: 'cream',
    },
    {
      blockType: 'slideshow',
      slides: [
        {
          image: slides[0].id,
          eyebrow: 'Morning',
          heading: 'Begin before the noise.',
          subheading: 'Three slow minutes with Aura One set the tone for the whole day.',
          label: 'Morning ritual',
          scheme: 'light',
          position: 'bottom-left',
          positionMobile: 'bottom',
          alignment: 'left',
          overlay: 35,
          links: [{ link: { type: 'custom', url: '/products/aura-one', label: 'Shop Aura One', appearance: 'default' } }],
        },
        {
          image: slides[1].id,
          eyebrow: 'Deep work',
          heading: 'Hold the thread.',
          subheading: 'A quiet pulse when your attention drifts — never a notification.',
          label: 'Deep work',
          scheme: 'cream',
          position: 'middle-right',
          positionMobile: 'bottom',
          alignment: 'left',
          overlay: 0,
        },
        {
          image: slides[2].id,
          eyebrow: 'Evening',
          heading: 'Let the day go.',
          subheading: 'Wind-down sessions that slow your breath and your thoughts.',
          label: 'Evening wind-down',
          scheme: 'light',
          position: 'bottom-center',
          positionMobile: 'bottom',
          alignment: 'center',
          overlay: 40,
        },
      ],
      transition: 'rise',
      autoplay: true,
      interval: 6,
      pauseOnHover: true,
      swipe: true,
      controls: 'bars',
      progressStyle: 'timer',
      counterStyle: 'divider',
      arrowStyle: 'chevron',
      container: 'inset',
      heightDesktop: 88,
      heightMobile: 78,
      radius: 24,
    },
    {
      blockType: 'collection',
      heading: 'Complete the set',
      intro: 'Thoughtful accessories, made in the same small batches.',
      source: 'category',
      category: accessories.id,
      display: 'grid',
      columns: '3',
      limit: 6,
      enableLink: true,
      link: { type: 'custom', url: '/shop', label: 'Shop all' },
      background: 'cream',
    },
    {
      blockType: 'press',
      anchor: 'press',
      heading: 'In the Press',
      style: 'cards',
      items: [
        {
          publication: 'THE QUIET REVIEW',
          date: '2026-10-02T00:00:00.000Z',
          quote: 'A Pocket-Sized Object That Teaches You to Breathe Again',
          url: 'https://example.com/press/quiet-review',
          image: pressImages[0].id,
        },
        {
          publication: 'FORM & FIELD',
          date: '2026-09-14T00:00:00.000Z',
          quote: 'The Calmest Gadget We Tested This Year',
          url: 'https://example.com/press/form-and-field',
          image: pressImages[1].id,
        },
      ],
      background: 'cream',
    },
    {
      blockType: 'newsletter',
      heading: 'Join the waitlist to be the first to try the next batch of Aura One.',
      placeholder: 'Enter your email',
      buttonLabel: 'Join waitlist',
      source: 'waitlist',
      successMessage: "You're on the list. We'll write when your batch is ready.",
      layout: 'minimal',
      background: 'stone',
    },
  ],
})
