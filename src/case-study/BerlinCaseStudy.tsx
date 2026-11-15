import { useState, type ReactNode } from 'react';
import { ArrowLeft, ArrowRight, Calendar, Check, Database, ExternalLink, Github, Scale } from 'lucide-react';
import { ChartDivider, Eyebrow, Reveal } from '../components/ui';
import { Bubbles, C, ChartCard, ChartLabel, Columns, Donut, Dumbbells, Lines, Ranges, Stat, Waffles, type Bubble, type Part } from './charts';
import { q02, q03, q04, q05, q06, q07, q08, q09, q10, q11, q12 } from './data';

const SOURCE_URL = 'https://insideairbnb.com/get-the-data/';
const REPO_URL = 'https://github.com/AEMSabbirRifat/berlin-airbnb-case-study';
const BERLIN_RULE_URL = 'https://www.berlin.de/sen/wohnen/rechtliches/zweckentfremdungsverbot/';
const BERLIN_PERMIT_URL = 'https://service.berlin.de/dienstleistung/328146/';
const BERLIN_FAQ_URL = 'https://www.berlin.de/sen/wohnen/rechtliches/zweckentfremdungsverbot/fragen-und-antworten/';
const AIRBNB_RULE_URL = 'https://news.airbnb.com/de/airbnb-unternimmt-schritte-fuer-verantwortungsvollen-tourismus-in-berlin/';
/* Set this to the Tableau Public share link once the workbook is published. Empty = block hidden. */
const TABLEAU_URL = '';

const n = (v: number) => v.toLocaleString('en-US');
const eur = (v: number) => `€${v.toLocaleString('en-US')}`;
const H = q12[0];

/* ---------- derived figures (all from the SQL result tables) ---------- */
const band = (name: string) => q03.find((r) => r.stay_band === name)!;
const longStay = band('90+ nights');
const shortStay = band('1-3 nights');
const hostRow = (name: string) => q05.find((r) => r.host_size === name)!;
const hadGuests = q06.filter((r) => !r.review_history.includes('Never')).reduce((s, r) => s + r.listings, 0);
const tenPlus = q06.filter((r) => r.review_history.includes('10-49') || r.review_history.includes('50+')).reduce((s, r) => s + r.listings, 0);
const big = q07.filter((r) => r.host_size === '5-9 listings' || r.host_size === '10+ listings');
const bigListingShare = +big.reduce((s, r) => s + r.pct_of_listings, 0).toFixed(1);
const bigRevenueShare = +big.reduce((s, r) => s + r.pct_of_est_revenue, 0).toFixed(1);
const home = q09.find((r) => r.room_type === 'Entire home/apt')!;
const room = q09.find((r) => r.room_type === 'Private room')!;
const superhost = q10.find((r) => r.host_status === 'Superhost')!;
const notSuperhost = q10.find((r) => r.host_status === 'Not superhost')!;
const works = q11.find((r) => r.activity.startsWith('Reviewed'))!;
const silent = q11.find((r) => r.activity.startsWith('No review'))!;
const secondHomeCeiling = 90 * home.price_median;

const regColor: Record<string, string> = {
  'Registration number': C.blue,
  'Business details': C.teal,
  'Nothing displayed': C.orange,
};
const regName: Record<string, string> = {
  'Registration number': 'Registration number',
  'Business details': 'Business contact details',
  'Nothing displayed': 'Nothing displayed',
};
const regOrder = ['Registration number', 'Business details', 'Nothing displayed'];
const regRows = ['1-3 nights', '4-29 nights', '30-89 nights', '90+ nights'].map((b) => {
  const rows = q04.filter((r) => r.stay_band === b);
  const parts: Part[] = regOrder.map((k) => {
    const r = rows.find((x) => x.registration_display === k);
    return { name: regName[k], pct: r ? r.pct_of_band : 0, count: r ? r.listings : 0, color: regColor[k] };
  });
  const rest = +(100 - parts.reduce((s, p) => s + p.pct, 0)).toFixed(1);
  if (rest > 0.05) parts.push({ name: 'Other', pct: rest, count: band(b).listings - parts.reduce((s, p) => s + p.count, 0), color: C.other });
  const shown = +(parts[0].pct + parts[1].pct).toFixed(1);
  const hidden = parts[2].pct;
  const caption =
    hidden > shown ? (
      <>
        <strong className="text-ink">{hidden}%</strong> display nothing
      </>
    ) : (
      <>
        <strong className="text-ink">{shown}%</strong> show a number or business details
      </>
    );
  return { label: b === '90+ nights' ? '90+ nights' : b, note: `${n(band(b).listings)} listings`, caption, parts };
});

const historyParts: Part[] = q06.map((r, i) => ({
  name: r.review_history.slice(2),
  pct: r.pct,
  count: r.listings,
  color: C.ramp[i],
}));

/* label side per district, chosen so names do not collide; `minor` names are hidden on small screens */
const labelSide: Record<string, Bubble['label']> = {
  Mitte: 'right',
  'Charlottenburg-Wilm.': 'left',
  'Friedrichshain-Kreuzberg': 'right',
  Pankow: 'right',
  Lichtenberg: 'left',
  'Tempelhof - Schöneberg': 'bottom',
  Neukölln: 'right',
  Reinickendorf: 'top',
  'Steglitz - Zehlendorf': 'left',
  Spandau: 'right',
  'Treptow - Köpenick': 'left',
  'Marzahn - Hellersdorf': 'right',
};
const majorDistricts = ['Mitte', 'Neukölln', 'Reinickendorf', 'Marzahn - Hellersdorf'];
const districtPoints: Bubble[] = q08.map((d) => ({
  name: d.district.replace(' - ', '-'),
  x: d.median_price_entire_home,
  y: d.pct_active_from_5plus_hosts,
  size: d.active_short_stay,
  label: labelSide[d.district],
  minor: !majorDistricts.includes(d.district),
}));

/* ---------- small layout helpers ---------- */

function Section({ id, tone = 'white', children }: { id?: string; tone?: 'white' | 'soft'; children: ReactNode }) {
  return (
    <section id={id} className={`py-10 sm:py-14 px-4 sm:px-8 ${tone === 'soft' ? 'bg-slate-50' : 'bg-white'}`}>
      <div className="max-w-5xl mx-auto">{children}</div>
    </section>
  );
}

function SectionHead({ step, eyebrow, title, lead }: { step: string; eyebrow: string; title: string; lead?: ReactNode }) {
  return (
    <Reveal className="mb-10">
      <Eyebrow>
        <span className="tabular">{step}</span> · {eyebrow}
      </Eyebrow>
      <h4 className="text-2xl sm:text-3xl font-bold text-ink tracking-tight mb-4 max-w-3xl">{title}</h4>
      <ChartDivider className="!justify-start mb-5" />
      {lead && <p className="text-lg text-slate-600 leading-relaxed max-w-3xl">{lead}</p>}
    </Reveal>
  );
}

const A = ({ href, children }: { href: string; children: ReactNode }) => (
  <a href={href} target="_blank" rel="noopener noreferrer" className="font-semibold text-brand-700 underline decoration-brand-200 underline-offset-2 hover:decoration-brand-600">
    {children}
  </a>
);

/* ---------- the six investigation views ---------- */

const views = [
  {
    key: 'Minimum stay',
    chart: 'Column chart',
    node: (
      <ChartCard
        title="Where do Berlin hosts set the minimum stay?"
        takeaway={
          <>
            Most listings ask for one to three nights. Then there is a wall: <strong>{H.pct_exactly_92_nights}% of all listings sit at exactly 92 nights</strong>. A
            number that precise is a threshold, not a preference.
          </>
        }
        table={{ head: ['Minimum stay', 'Listings', 'Share of all'], rows: q02.map((r) => [r.minimum_stay, r.listings, `${r.pct_of_all}%`]) }}
      >
        <ChartLabel>Number of listings by minimum stay</ChartLabel>
        <Columns
          axisTitle="Minimum stay, in nights"
          rows={q02
            .filter((r) => r.minimum_stay !== 'Unknown')
            .map((r) => ({
              label: r.minimum_stay,
              value: r.listings,
              display: n(r.listings),
              detail: `${r.pct_of_all}% of all listings`,
              highlight: r.minimum_stay === '92 nights',
            }))}
        />
      </ChartCard>
    ),
  },
  {
    key: 'Guest activity',
    chart: 'Line chart',
    node: (
      <ChartCard
        title="Do long-stay listings still get guests?"
        takeaway={
          <>
            Reviews are the public trace of a stay. <strong>{shortStay.pct_reviewed_last_12m}%</strong> of 1–3 night listings were reviewed in the past 12 months. Once the
            minimum passes 90 nights, that falls to <strong>{longStay.pct_reviewed_last_12m}%</strong>, and only{' '}
            <strong>{longStay.pct_with_bookable_price}%</strong> still show a price a guest could book.
          </>
        }
        table={{
          head: ['Minimum stay', 'Listings', 'Reviewed in last 12 months', 'Never reviewed', 'Bookable price shown'],
          rows: q03.map((r) => [r.stay_band, r.listings, `${r.pct_reviewed_last_12m}%`, `${r.pct_never_reviewed}%`, `${r.pct_with_bookable_price}%`]),
        }}
        footnote="Long stays produce fewer reviews by design: a 92-night listing can host four guests a year at most. That is why the chart also tracks whether a bookable price is shown, and the next views look at review history."
      >
        <ChartLabel>Share of listings, by minimum stay</ChartLabel>
        <Lines
          categories={q03.map((r) => r.stay_band)}
          detail={q03.map((r) => `${n(r.listings)} listings`)}
          series={[
            { name: 'Reviewed in the past 12 months', color: C.blue, values: q03.map((r) => r.pct_reviewed_last_12m) },
            { name: 'Bookable price shown', color: C.teal, values: q03.map((r) => r.pct_with_bookable_price) },
          ]}
        />
      </ChartCard>
    ),
  },
  {
    key: 'The rule',
    chart: 'Waffle charts',
    node: (
      <ChartCard
        title="What sits behind the 92-night line?"
        takeaway={
          <>
            Berlin has required a registration number in every short-term rental advert since August 2018. Since March 2023 Airbnb enforces it: a Berlin listing without a
            number or business contact details can only take stays of three months or more. The data shows the split exactly.{' '}
            <strong>{H.pct_short_stay_with_number_or_details}%</strong> of listings under 30 nights display a number, business details or an exemption.{' '}
            <strong>{H.pct_long_stay_nothing_displayed}%</strong> of long-stay-only listings display nothing.
          </>
        }
        table={{
          head: ['Minimum stay', 'What the listing displays', 'Listings', 'Share of band'],
          rows: q04.map((r) => [r.stay_band, regName[r.registration_display] ?? r.registration_display, r.listings, `${r.pct_of_band}%`]),
        }}
        footnote={
          <>
            Sources: <A href={BERLIN_RULE_URL}>Berlin Senate, housing misuse ban</A> and <A href={AIRBNB_RULE_URL}>Airbnb newsroom, Berlin</A>. Displaying nothing on a
            long-stay listing is what the platform rule allows; it says nothing about any individual host.
          </>
        }
      >
        <ChartLabel>What each listing displays, by minimum stay</ChartLabel>
        <Waffles
          items={regRows}
          legend={[
            { name: 'Registration number', color: C.blue },
            { name: 'Business contact details', color: C.teal },
            { name: 'Nothing displayed', color: C.orange },
            { name: 'Other', color: C.other },
          ]}
        />
      </ChartCard>
    ),
  },
  {
    key: 'Who is parked',
    chart: 'Dumbbell + donut',
    node: (
      <ChartCard
        title="Who ended up on the quiet side?"
        takeaway={
          <>
            Small hosts. <strong>{hostRow('1 listing').pct_long_stay_only}%</strong> of listings from single-listing hosts are long-stay only, against{' '}
            <strong>{hostRow('5-9 listings').pct_long_stay_only}%</strong> for hosts with 5–9 listings. Single-listing hosts are the only group with more listings parked
            than active. And these are not all dormant accounts: <strong>{n(hadGuests)}</strong> of the long-stay-only listings have hosted before, and{' '}
            <strong>{n(tenPlus)}</strong> carry ten or more reviews.
          </>
        }
        table={[
          {
            caption: 'By host size',
            head: ['Host size', 'Listings', 'Long-stay only', 'Active short-stay'],
            rows: q05.map((r) => [r.host_size, r.listings, `${r.pct_long_stay_only}%`, `${r.pct_active_short_stay}%`]),
          },
          {
            caption: 'Review history of the long-stay-only listings',
            head: ['Lifetime reviews', 'Listings', 'Share'],
            rows: q06.map((r) => [r.review_history.slice(2), r.listings, `${r.pct}%`]),
          },
        ]}
      >
        <ChartLabel>Share of each host group's listings · hosts grouped by how many listings they run</ChartLabel>
        <Dumbbells
          max={80}
          series={[
            { name: 'Long-stay only', color: C.blue },
            { name: 'Active short-stay', color: C.teal },
          ]}
          rows={q05.map((r) => ({ label: r.host_size, a: r.pct_long_stay_only, b: r.pct_active_short_stay, detail: `${n(r.listings)} listings` }))}
        />
        <div className="mt-10 pt-8 border-t border-slate-200">
          <ChartLabel>Review history of the {n(H.long_stay_only)} long-stay-only listings</ChartLabel>
          <Donut parts={historyParts} centre={`${Math.round((hadGuests / H.long_stay_only) * 100)}%`} centreLabel="have hosted before" />
        </div>
      </ChartCard>
    ),
  },
  {
    key: 'Who serves the market',
    chart: 'Bubble chart',
    node: (
      <ChartCard
        title="Who serves the short-stay market now?"
        takeaway={
          <>
            Larger operators, most of all where prices are highest. Hosts with five or more listings hold <strong>{bigListingShare}%</strong> of active short-stay
            listings and <strong>{bigRevenueShare}%</strong> of estimated revenue. In Mitte, the most expensive district, they run{' '}
            <strong>{q08.find((d) => d.district === 'Mitte')!.pct_active_from_5plus_hosts}%</strong> of the active supply.
          </>
        }
        table={[
          {
            caption: 'By district',
            head: ['District', 'All listings', 'Long-stay only', 'Active short-stay', 'Median price, entire home', 'From hosts with 5+ listings'],
            rows: q08.map((d) => [d.district, d.listings, `${d.pct_long_stay_only}%`, d.active_short_stay, eur(d.median_price_entire_home), `${d.pct_active_from_5plus_hosts}%`]),
          },
          {
            caption: 'Active short-stay listings by host size',
            head: ['Host size', 'Active listings', 'Share of active listings', 'Share of estimated revenue'],
            rows: q07.map((r) => [r.host_size, r.listings, `${r.pct_of_listings}%`, `${r.pct_of_est_revenue}%`]),
          },
        ]}
        footnote="Active short-stay: minimum stay under 30 nights, a bookable price, and at least one review in the past 12 months. Revenue is Inside Airbnb's model estimate. On small screens only the larger districts are labelled; tap a bubble or open the table for the rest."
      >
        <ChartLabel>Berlin's 12 districts · bubble size = active short-stay listings</ChartLabel>
        <Bubbles
          points={districtPoints}
          xDomain={[100, 230]}
          yDomain={[0, 50]}
          xTicks={[100, 125, 150, 175, 200, 225]}
          yTicks={[0, 10, 20, 30, 40, 50]}
          xTitle="Median nightly price of an entire home"
          yTitle="Share of active short-stay listings run by hosts with 5+ listings"
          fx={eur}
          fy={(v) => `${v}%`}
          sizeLabel="active short-stay listings"
        />
        <div className="mt-8 grid sm:grid-cols-2 gap-4">
          <Stat value={`${bigListingShare}%`} label="of active short-stay listings come from hosts with 5+ listings" />
          <Stat
            value={`${q07[0].pct_of_est_revenue}%`}
            label="of estimated revenue goes to single-listing hosts"
            sub={`They supply ${q07[0].pct_of_listings}% of the active listings`}
          />
        </div>
      </ChartCard>
    ),
  },
  {
    key: 'What works',
    chart: 'Range plot',
    node: (
      <ChartCard
        title="What does a working small-host listing look like?"
        takeaway={
          <>
            The benchmark is single-listing hosts who display a registration number and are active. Entire homes earn more at the median but the range is wide; private
            rooms sit in a tighter band and see more guests ({room.median_reviews_12m} reviews a year against {home.median_reviews_12m}). In both cases service quality
            matters more than price: Superhosts charge almost the same and collect{' '}
            <strong>
              {superhost.median_reviews_12m} reviews a year against {notSuperhost.median_reviews_12m}
            </strong>
            .
          </>
        }
        table={[
          {
            caption: 'Single-listing hosts with a registration number',
            head: ['Listing type', 'Comparable listings', 'Median price', 'Price, middle half', 'Median reviews, 12 months', 'Est. revenue, median', 'Est. revenue, middle half'],
            rows: q09.map((r) => [
              r.room_type,
              r.listings,
              eur(r.price_median),
              `${eur(r.price_p25)} – ${eur(r.price_p75)}`,
              r.median_reviews_12m,
              eur(r.est_revenue_median),
              `${eur(r.est_revenue_p25)} – ${eur(r.est_revenue_p75)}`,
            ]),
          },
          {
            caption: 'Entire homes from single-listing hosts, by Superhost status',
            head: ['Host status', 'Listings', 'Median price', 'Median reviews, 12 months', 'Est. revenue, median'],
            rows: q10.map((r) => [r.host_status, r.listings, eur(r.median_price), r.median_reviews_12m, eur(r.est_revenue_median)]),
          },
        ]}
        footnote="Estimated revenue is Inside Airbnb's model (reviews-based occupancy, capped). Treat it as an indication of scale, not as income."
      >
        <ChartLabel>Estimated revenue per year</ChartLabel>
        <Ranges
          max={40000}
          f={(v) => `€${Math.round(v / 100) / 10}K`}
          rows={q09.map((r) => ({
            label: r.room_type === 'Entire home/apt' ? 'Entire home' : r.room_type,
            lo: r.est_revenue_p25,
            mid: r.est_revenue_median,
            hi: r.est_revenue_p75,
            detail: `${n(r.listings)} listings, ${eur(r.price_median)} a night`,
          }))}
        />
        <div className="mt-10 pt-8 border-t border-slate-200">
          <ChartLabel>The Superhost effect · entire homes from single-listing hosts</ChartLabel>
          <div className="grid grid-cols-2 gap-4">
            {q10.map((r) => (
              <div key={r.host_status} className={`rounded-xl border p-4 ${r.host_status === 'Superhost' ? 'border-brand-300 bg-brand-50/50' : 'border-slate-200 bg-slate-50'}`}>
                <p className="text-sm font-semibold text-slate-700">{r.host_status === 'Superhost' ? 'Superhost' : 'Not a Superhost'}</p>
                <p className="mt-1 text-3xl sm:text-4xl font-bold text-ink">{r.median_reviews_12m}</p>
                <p className="text-sm text-slate-700">reviews a year</p>
                <p className="mt-2 text-xs text-slate-500 leading-snug">
                  {eur(r.median_price)} a night · est. {eur(r.est_revenue_median)} a year · {n(r.listings)} listings
                </p>
              </div>
            ))}
          </div>
        </div>
      </ChartCard>
    ),
  },
];

/* ---------- options and scoring ---------- */

const options = [
  {
    tag: 'Option A',
    title: 'Register and return to short stays with the whole home',
    points: [
      `${n(home.listings)} comparable listings: ${eur(home.price_median)} a night, ${home.median_reviews_12m} reviews a year`,
      `Estimated revenue ${eur(home.est_revenue_median)} a year, middle half ${eur(home.est_revenue_p25)} to ${eur(home.est_revenue_p75)}`,
      `Needs a permit. A second home is limited to 90 days a year, a ceiling of about ${eur(secondHomeCeiling)} at the median price`,
    ],
    scores: [3, 2, 1],
  },
  {
    tag: 'Option B',
    title: 'Register and share a room in the home you live in',
    points: [
      `${n(room.listings)} comparable listings: ${eur(room.price_median)} a night, ${room.median_reviews_12m} reviews a year, the highest guest flow`,
      `Estimated revenue ${eur(room.est_revenue_median)} a year, middle half ${eur(room.est_revenue_p25)} to ${eur(room.est_revenue_p75)}`,
      'Letting less than half of your own home needs a registration number but no permit, and has no 90-day cap',
    ],
    scores: [2, 3, 2],
  },
  {
    tag: 'Option C',
    title: 'Stay long-stay only, and run it properly',
    points: [
      `${n(works.listings)} long-stay listings (${works.pct}%) still show guests: ${works.pct_entire_home}% are entire homes and ${works.pct_superhost}% are run by Superhosts`,
      `They price lower: ${eur(works.median_price)} a night against ${eur(silent.median_price)} for the silent ones`,
      'No registration needed, but revenue cannot be estimated from this data and demand evidence is the weakest',
    ],
    scores: [1, 1, 3],
  },
];
const criteria = ['Earning evidence', 'Guest demand evidence', 'Ease of compliance'];

/* ---------- page ---------- */

export default function BerlinCaseStudy() {
  const [view, setView] = useState(0);
  const [loadViz, setLoadViz] = useState(false);

  return (
    <div className="bg-white">
      {/* 1 · intro (the project title sits in the row above the drawer) */}
      <div className="px-4 sm:px-8 pt-6 pb-8">
        <p className="text-lg text-slate-600 leading-relaxed max-w-3xl">
          A data story built on {n(H.all_listings)} public listings: from the problem, through the fix that most hosts fell back on, to a recommendation a
          single-listing host can act on.
        </p>
        <ul className="mt-5 flex flex-wrap gap-2 text-xs font-semibold text-slate-600">
          <li className="flex items-center gap-1.5 rounded-full border border-slate-200 bg-white px-3 py-1.5">
            <Database size={14} className="text-teal-600" /> Source: Inside Airbnb, Berlin
          </li>
          <li className="flex items-center gap-1.5 rounded-full border border-slate-200 bg-white px-3 py-1.5">
            <Calendar size={14} className="text-teal-600" /> Data as of 19 September 2026
          </li>
          <li className="flex items-center gap-1.5 rounded-full border border-slate-200 bg-white px-3 py-1.5">
            <Scale size={14} className="text-teal-600" /> Independent analysis
          </li>
        </ul>
      </div>

      {/* 2 · hook */}
      <Section tone="soft">
        <SectionHead
          step="01"
          eyebrow="The problem"
          title={`${n(H.long_stay_only)} listings are online but, by every public signal, not hosting`}
          lead={
            <>
              They can only be booked for 90 nights or more, and almost none of them show recent guests. Most belong to people with a single listing. This case study
              finds out why, tests the fix they fell back on, and sizes three ways out.
            </>
          }
        />
        <Reveal>
          <div className="grid sm:grid-cols-3 gap-4">
            <div className="rounded-2xl bg-white border border-slate-200 p-6">
              <p className="text-5xl sm:text-6xl font-black text-ink">{H.pct_long_stay_only}%</p>
              <p className="mt-2 text-slate-700 leading-snug">of Berlin's listings can only be booked for 90 nights or more</p>
            </div>
            <div className="rounded-2xl bg-white border border-slate-200 p-6">
              <p className="text-3xl sm:text-4xl font-bold text-ink">{H.pct_long_stay_no_review_12m}%</p>
              <p className="mt-2 text-slate-700 leading-snug">of those had no guest review in the past 12 months</p>
            </div>
            <div className="rounded-2xl bg-white border border-slate-200 p-6">
              <p className="text-3xl sm:text-4xl font-bold text-ink">{H.pct_short_stay_reviewed_12m}%</p>
              <p className="mt-2 text-slate-700 leading-snug">of 1–3 night listings did get a review in the same period</p>
            </div>
          </div>
        </Reveal>
      </Section>

      {/* 3 · investigation */}
      <Section>
        <SectionHead
          step="02"
          eyebrow="The investigation"
          title="Six questions, one after the other"
          lead="Each view answers one question with the chart that fits it, and sets up the next. Hover or tab onto any mark for detail, or switch a view to its table."
        />
        <div role="tablist" aria-label="Investigation views" className="flex gap-2 overflow-x-auto pb-3 mb-5 -mx-1 px-1">
          {views.map((v, i) => (
            <button
              key={v.key}
              role="tab"
              aria-selected={view === i}
              onClick={() => setView(i)}
              className={`shrink-0 rounded-full px-4 py-2 text-sm font-semibold border transition-colors ${
                view === i ? 'bg-brand-700 text-white border-brand-700' : 'bg-white text-slate-600 border-slate-200 hover:border-brand-300 hover:text-brand-800'
              }`}
            >
              <span className="tabular opacity-70 mr-1.5">{i + 1}</span>
              {v.key}
            </button>
          ))}
        </div>
        <div role="tabpanel">{views[view].node}</div>
        <div className="mt-5 flex items-center justify-between text-sm font-semibold">
          <button
            type="button"
            onClick={() => setView((v) => Math.max(0, v - 1))}
            disabled={view === 0}
            className="flex items-center gap-1.5 text-slate-600 hover:text-brand-800 disabled:opacity-30"
          >
            <ArrowLeft size={16} /> Previous
          </button>
          <span className="text-slate-400 tabular">
            {view + 1} / {views.length} · {views[view].chart}
          </span>
          <button
            type="button"
            onClick={() => setView((v) => Math.min(views.length - 1, v + 1))}
            disabled={view === views.length - 1}
            className="flex items-center gap-1.5 text-brand-700 hover:text-brand-900 disabled:opacity-30"
          >
            Next question <ArrowRight size={16} />
          </button>
        </div>

        {TABLEAU_URL && (
          <div className="mt-10 rounded-2xl border border-slate-200 bg-slate-50 p-6">
            <h5 className="text-lg font-bold text-ink mb-1">The same views as a Tableau workbook</h5>
            {loadViz ? (
              <iframe title="Berlin short-stay case study on Tableau Public" src={`${TABLEAU_URL}?:embed=y&:showVizHome=no&:toolbar=bottom`} className="mt-4 w-full h-[720px] rounded-xl border border-slate-200 bg-white" />
            ) : (
              <>
                <p className="text-sm text-slate-600 mb-4 max-w-2xl">
                  The workbook is hosted by Tableau Public. Loading it connects your browser to Tableau's servers, so it only loads when you ask for it.
                </p>
                <button type="button" onClick={() => setLoadViz(true)} className="px-5 py-2.5 bg-brand-700 text-white text-sm font-semibold rounded-lg hover:bg-brand-800">
                  Load the Tableau workbook
                </button>
              </>
            )}
          </div>
        )}
      </Section>

      {/* 4 · what was tried */}
      <Section tone="soft">
        <SectionHead
          step="03"
          eyebrow="What was tried"
          title="The fallback: stay listed, switch to 92 nights"
          lead="When the registration rule was enforced, the path of least effort was to keep the listing online as long-stay only. That is what the 92-night wall is. The numbers show what it delivered."
        />
        <Reveal>
          <div className="grid sm:grid-cols-3 gap-4 mb-8">
            <Stat value={n(H.exactly_92_nights)} label="listings sit at exactly 92 nights" sub={`${H.pct_exactly_92_nights}% of everything listed in Berlin`} />
            <Stat value={`${longStay.pct_with_bookable_price}%`} label="of long-stay-only listings show a bookable price" sub={`${shortStay.pct_with_bookable_price}% for 1–3 night listings`} />
            <Stat value={`${works.pct}%`} label="show a guest review in the past 12 months" sub={`${n(works.listings)} of ${n(H.long_stay_only)} listings`} />
          </div>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="rounded-2xl bg-white border border-slate-200 p-6">
              <h5 className="font-bold text-ink mb-3">Why it did not work</h5>
              <ul className="space-y-2.5 text-slate-700 leading-relaxed">
                <li>The platform is built for nights and weeks. A three-month minimum takes a listing out of most searches a guest runs.</li>
                <li>
                  Nothing else changed. The silent listings are still priced like short stays: {eur(silent.median_price)} a night, which is about{' '}
                  {eur(silent.median_price * 30)} a month.
                </li>
                <li>
                  The few that do get guests price lower ({eur(works.median_price)}) and are run like a service: {works.pct_superhost}% are Superhosts, against{' '}
                  {silent.pct_superhost}% of the silent ones.
                </li>
              </ul>
            </div>
            <div className="rounded-2xl bg-white border border-slate-200 p-6">
              <h5 className="font-bold text-ink mb-3">What the data cannot say</h5>
              <ul className="space-y-2.5 text-slate-700 leading-relaxed">
                <li>This is one snapshot. The timeline comes from public sources, not from the data.</li>
                <li>Long stays leave few reviews, so some of these listings may be let to a single long-term tenant.</li>
                <li>
                  Not every parked listing lost income: {q06[0].pct}% have never had a review, and Airbnb itself reported that most affected listings were not hosting
                  before the change.
                </li>
              </ul>
            </div>
          </div>
        </Reveal>
      </Section>

      {/* 5 · three options */}
      <Section>
        <SectionHead
          step="04"
          eyebrow="Three ways out"
          title="Three options for a single-listing host, sized from listings that work"
          lead={
            <>
              Each option is benchmarked against comparable Berlin listings in the same data. The rules are summarised from the{' '}
              <A href={BERLIN_RULE_URL}>Berlin Senate</A>, its <A href={BERLIN_FAQ_URL}>questions and answers</A> and the{' '}
              <A href={BERLIN_PERMIT_URL}>city's permit service</A>. Every application is assessed individually by the district office.
            </>
          }
        />
        <div className="grid md:grid-cols-3 gap-5">
          {options.map((o, i) => (
            <Reveal key={o.tag} delay={i * 100}>
              <div className={`h-full rounded-2xl border p-6 ${i === 1 ? 'border-brand-300 bg-brand-50/50' : 'border-slate-200 bg-white'}`}>
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-teal-700 mb-2">{o.tag}</p>
                <h5 className="text-lg font-bold text-ink leading-snug mb-4">{o.title}</h5>
                <ul className="space-y-2.5 text-sm text-slate-700 leading-relaxed">
                  {o.points.map((p) => (
                    <li key={p} className="flex gap-2">
                      <span className="mt-2 w-1.5 h-1.5 rounded-full bg-brand-500 shrink-0" aria-hidden="true" />
                      {p}
                    </li>
                  ))}
                </ul>
              </div>
            </Reveal>
          ))}
        </div>
      </Section>

      {/* 6 · recommendation */}
      <Section tone="soft">
        <SectionHead step="05" eyebrow="The recommendation" title="Register, then share a room in the home you live in" />
        <Reveal>
          <div className="grid md:grid-cols-5 gap-6">
            <div className="md:col-span-3 rounded-2xl bg-white border border-slate-200 p-6 overflow-x-auto">
              <h5 className="font-bold text-ink mb-4">How the options score</h5>
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-slate-200 text-left text-slate-500">
                    <th className="py-2 pr-3 font-semibold">Criterion (1 = weak, 3 = strong)</th>
                    {options.map((o) => (
                      <th key={o.tag} className="py-2 px-2 font-semibold text-center">
                        {o.tag.replace('Option ', '')}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {criteria.map((c, ci) => (
                    <tr key={c} className="border-b border-slate-100">
                      <td className="py-2.5 pr-3 text-slate-700">{c}</td>
                      {options.map((o) => (
                        <td key={o.tag} className="py-2.5 px-2 text-center tabular text-slate-700">
                          {o.scores[ci]}
                        </td>
                      ))}
                    </tr>
                  ))}
                  <tr>
                    <td className="py-2.5 pr-3 font-bold text-ink">Total</td>
                    {options.map((o, i) => (
                      <td key={o.tag} className={`py-2.5 px-2 text-center tabular font-bold ${i === 1 ? 'text-brand-700' : 'text-ink'}`}>
                        {o.scores.reduce((s, v) => s + v, 0)}
                      </td>
                    ))}
                  </tr>
                </tbody>
              </table>
              <p className="mt-4 text-xs text-slate-500 leading-relaxed">Equal weights. A host who is away for long periods would weight earnings higher, which moves Option A to the top.</p>
            </div>
            <div className="md:col-span-2 rounded-2xl bg-ink text-white p-6">
              <h5 className="font-bold mb-4">Why Option B</h5>
              <ul className="space-y-3 text-sm text-slate-200 leading-relaxed">
                {[
                  `It has the strongest demand: ${room.median_reviews_12m} reviews a year at the median, against ${home.median_reviews_12m} for entire homes.`,
                  'It is the lightest route back to short stays: a registration number, no permit, no 90-day cap.',
                  `The earning range is the most predictable: ${eur(room.est_revenue_p25)} to ${eur(room.est_revenue_p75)} for the middle half.`,
                ].map((t) => (
                  <li key={t} className="flex gap-2.5">
                    <Check size={16} className="mt-0.5 text-teal-300 shrink-0" /> {t}
                  </li>
                ))}
              </ul>
              <p className="mt-5 pt-4 border-t border-white/10 text-sm text-slate-300 leading-relaxed">
                For a host with no visible bookings today, the benchmark is about <strong className="text-white">{eur(room.est_revenue_median)} a year</strong>. Earning
                Superhost status is the lever that matters most after that.
              </p>
            </div>
          </div>
        </Reveal>
      </Section>

      {/* 7 · how it was built */}
      <Section>
        <SectionHead
          step="06"
          eyebrow="How it was built"
          title="Reproduce it, or run the same method on your own data"
          lead="The public file was queried with SQL, one query per question. Only summary tables leave the database, and every number on this page is read from them."
        />
        <Reveal>
          <div className="grid sm:grid-cols-2 gap-5">
            <a href={REPO_URL} target="_blank" rel="noopener noreferrer" className="group rounded-2xl border border-slate-200 p-6 hover:border-brand-300 hover:shadow-lg transition-all">
              <Github className="text-ink mb-3" size={28} />
              <h5 className="font-bold text-ink mb-1 flex items-center gap-2">
                SQL, result tables and method on GitHub <ExternalLink size={14} className="text-slate-400 group-hover:text-brand-600" />
              </h5>
              <p className="text-sm text-slate-600 leading-relaxed">The SQL for every question, the summary tables behind every chart, and the steps to re-run it on the source file.</p>
            </a>
            <a href="#consult" className="group rounded-2xl bg-brand-700 text-white p-6 hover:bg-brand-800 transition-colors">
              <Calendar className="mb-3" size={28} />
              <h5 className="font-bold mb-1 flex items-center gap-2">
                Want this for your business? <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
              </h5>
              <p className="text-sm text-brand-100 leading-relaxed">Book a 20-minute call and I will walk you through the whole process and how it would work on your data.</p>
            </a>
          </div>

          <details className="mt-8 rounded-2xl border border-slate-200 bg-slate-50 p-6 text-sm text-slate-700 leading-relaxed">
            <summary className="cursor-pointer font-bold text-ink">Method, limits and sources</summary>
            <ul className="mt-4 space-y-2 list-disc pl-5">
              <li>
                Source: <A href={SOURCE_URL}>Inside Airbnb</A>, Berlin, 19 September 2026, a publicly available file licensed CC BY 4.0. {n(H.all_listings)} listings.
              </li>
              <li>Host names, host and listing identifiers, links, photos, free text and coordinates were removed before analysis. Only summary tables are published.</li>
              <li>Prices are advertised nightly prices in euros, not booked prices. Occupancy and revenue are Inside Airbnb's model estimates.</li>
              <li>"Active short-stay" means a minimum stay under 30 nights, a bookable price and at least one review in the past 12 months.</li>
              <li>"Displays nothing" describes the public listing only. Listings limited to stays of three months or more are not required to show a number.</li>
              <li>
                Rules: <A href={BERLIN_RULE_URL}>Berlin Senate</A>, <A href={BERLIN_FAQ_URL}>Senate questions and answers</A>,{' '}
                <A href={BERLIN_PERMIT_URL}>Berlin permit service</A>, <A href={AIRBNB_RULE_URL}>Airbnb newsroom</A>.
                This is an analysis, not legal advice.
              </li>
              <li>Independent work. Not affiliated with or endorsed by Airbnb or Inside Airbnb, and their attribution does not imply they share these conclusions.</li>
            </ul>
          </details>
        </Reveal>
      </Section>

      <p className="px-4 sm:px-8 py-5 text-xs text-slate-500 border-t border-slate-200">Source: Inside Airbnb, Berlin, September 2026.</p>
    </div>
  );
}
