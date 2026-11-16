import { Bubbles, C, ChartCard, ChartLabel, type Bubble } from './charts';
import { Heatmap, LineXY, MirrorBars, StackedColumns, type HeatCell } from './charts-more';
import Story, { A, type StoryConfig } from './Story';
import { q01, q02, q03, q04, q05, q06, q07, q09, q10, q11 } from './retail-data';

const SOURCE_URL = 'https://archive.ics.uci.edu/dataset/352/online+retail';
const LICENCE_URL = 'https://creativecommons.org/licenses/by/4.0/';
const REPO_URL = 'https://github.com/AEMSabbirRifat/online-retail-bi-case-study';

const n = (v: number) => v.toLocaleString('en-US');
const gbp = (v: number) => `£${n(Math.round(v))}`;
const gbpK = (v: number) => `£${n(Math.round(v / 1000))}k`;
const gbpM = (v: number) => `£${(v / 1e6).toFixed(2)}M`;
const O = q01[0];
const H = q11[0];

/* ---------- derived figures (all from the SQL result tables) ---------- */
const fullMonths = q02.filter((m) => m.partial_month === 'False');
const peak = fullMonths.reduce((a, b) => (b.revenue > a.revenue ? b : a));
const low = fullMonths.reduce((a, b) => (b.revenue < a.revenue ? b : a));
const quietHigh = Math.max(...fullMonths.filter((m) => m.month < '2011-09').map((m) => m.revenue));
const fullNames: Record<string, string> = { Jan: 'January', Feb: 'February', Mar: 'March', Apr: 'April', Jun: 'June', Jul: 'July', Aug: 'August', Sep: 'September', Oct: 'October', Nov: 'November', Dec: 'December' };
const monthName = (label: string) => fullNames[label.split(' ')[0]] ?? label.split(' ')[0];
const curve = (pct: number) => q03.find((r) => r.pct_of_customers === pct)!;
const tier = (order: number) => q04.find((r) => r.tier_order === order)!;
const small = [tier(1), tier(2)];
const smallCustomers = +(small[0].pct_of_customers + small[1].pct_of_customers).toFixed(1);
const smallRevenue = +(small[0].pct_of_revenue + small[1].pct_of_revenue).toFixed(1);
const mid = tier(3);
const key = tier(5);
const midYear = q05.filter((m) => m.month > '2010-12' && m.month < '2011-12');
const fromMay = midYear.filter((m) => m.month >= '2011-05');
const retMin = Math.round(Math.min(...fromMay.map((m) => m.pct_revenue_returning)));
const retMax = Math.round(Math.max(...fromMay.map((m) => m.pct_revenue_returning)));
const firstTimers = (month: string) => q05.find((m) => m.month === month)!.first_month_customers;
const cohortCell = (cohort: string, later: number) => q06.find((r) => r.cohort === cohort && r.months_later === later);
const cohorts = [...new Set(q06.map((r) => r.cohort))];
const country = (name: string) => q07.find((r) => r.country === name)!;
const market = (item: string) => q09.find((r) => r.item === item)!;
const thin = market('Export markets with under 10 customers');
const deep = market('Export markets with 50+ customers');
const tail = market('Bottom half of products');
const head = market('Top 10% of products');
const opt = (o: string) => q10.find((r) => r.option === o)!;
const pctOfRevenue = (v: number) => +((100 * v) / H.revenue_with_account).toFixed(1);

const labelSide: Record<string, Bubble['label']> = {
  'United Kingdom': 'top',
  Netherlands: 'right',
  Australia: 'left',
  Ireland: 'right',
  Germany: 'right',
  France: 'left',
};
const marketPoints: Bubble[] = q07
  .filter((r) => r.countries === 1 && r.country !== 'Unspecified' && r.pct_from_largest_account !== null)
  .map((r) => ({
    name: r.country,
    x: Math.log10(r.customers),
    y: r.pct_from_largest_account as number,
    size: r.revenue,
    label: labelSide[r.country] ?? 'none',
    minor: !['United Kingdom', 'Netherlands', 'Germany', 'Ireland'].includes(r.country),
  }));

/* ---------- the six investigation views ---------- */

const views: StoryConfig['views'] = [
  {
    key: 'The year',
    chart: 'Area line chart',
    node: (
      <ChartCard
        title="How does revenue move through the year?"
        takeaway={
          <>
            Monthly revenue stays between {gbpM(low.revenue)} and {gbpM(quietHigh)} until August, then climbs to{' '}
            <strong>
              {gbpM(peak.revenue)} in {monthName(peak.month_label)}
            </strong>
            , {(peak.revenue / low.revenue).toFixed(1)} times the {monthName(low.month_label)} low. The business is seasonal, so the question is who carries the peak.
          </>
        }
        table={{
          head: ['Month', 'Revenue', 'Orders', 'Active customer accounts'],
          rows: q02.map((m) => [m.partial_month === 'True' ? `${m.month_label} (to 9 Dec)` : m.month_label, gbp(m.revenue), m.orders, m.active_customers]),
        }}
        footnote="Product revenue net of cancellations. December 2011 covers nine days only and is left out of the chart."
      >
        <ChartLabel>Revenue per month</ChartLabel>
        <LineXY
          xDomain={[-0.4, fullMonths.length - 0.6]}
          yDomain={[0, 1600000]}
          xTicks={fullMonths.map((_, i) => i)}
          yTicks={[0, 400000, 800000, 1200000, 1600000]}
          fx={(i) => fullMonths[i].month_label.slice(0, 3)}
          fy={(v) => (v === 0 ? '0' : `£${v / 1e6}M`)}
          xTitle="December 2010 to November 2011"
          thinX
          series={[
            {
              name: 'Revenue',
              color: C.blue,
              area: true,
              points: fullMonths.map((m, i) => ({
                x: i,
                y: m.revenue,
                label: m === peak || m === low ? gbpM(m.revenue) : undefined,
                side: m === peak ? 'left' : 'bottom',
                tipTitle: m.month_label,
                tip: [
                  { value: gbp(m.revenue), label: 'revenue' },
                  { value: n(m.orders), label: 'orders' },
                ],
              })),
            },
          ]}
        />
      </ChartCard>
    ),
  },
  {
    key: 'Concentration',
    chart: 'Concentration curve',
    node: (
      <ChartCard
        title="How many customers does the revenue depend on?"
        takeaway={
          <>
            Rank the customers from largest to smallest. The <strong>top 1% ({curve(1).customers} accounts) bring {curve(1).pct_of_revenue}%</strong> of revenue and
            the top 10% bring {curve(10).pct_of_revenue}%. The smaller half of all customers brings {H.pct_revenue_smaller_half}%.
          </>
        }
        table={{
          head: ['Largest customers', 'Accounts', 'Revenue', 'Share of revenue'],
          rows: q03.map((r) => [`Top ${r.pct_of_customers}%`, r.customers, gbp(r.revenue), `${r.pct_of_revenue}%`]),
        }}
        footnote={`Covers the ${n(H.customers)} customer accounts with revenue in the period. ${O.pct_revenue_without_account}% of all revenue was sold without an account and cannot be ranked.`}
      >
        <ChartLabel>Cumulative share of revenue, customers ranked largest first</ChartLabel>
        <LineXY
          height="h-72"
          xDomain={[0, 100]}
          yDomain={[0, 100]}
          xTicks={[0, 20, 40, 60, 80, 100]}
          yTicks={[0, 25, 50, 75, 100]}
          fx={(v) => `${v}%`}
          fy={(v) => `${v}%`}
          xTitle="Share of customers"
          series={[
            {
              name: 'This retailer',
              color: C.blue,
              area: true,
              points: [
                { x: 0, y: 0 },
                ...q03.map((r) => ({
                  x: r.pct_of_customers,
                  y: r.pct_of_revenue,
                  label: r.pct_of_customers === 1 ? `Top 1%: ${r.pct_of_revenue}%` : r.pct_of_customers === 10 ? `Top 10%: ${r.pct_of_revenue}%` : r.pct_of_customers === 50 ? `Top half: ${r.pct_of_revenue}%` : undefined,
                  side: (r.pct_of_customers === 50 ? 'bottom' : 'right') as 'bottom' | 'right',
                  tipTitle: `Top ${r.pct_of_customers}% of customers`,
                  tip: [
                    { value: `${r.pct_of_revenue}%`, label: 'of revenue' },
                    { value: n(r.customers), label: 'accounts' },
                  ],
                })),
              ],
            },
            {
              name: 'If every customer spent the same',
              color: C.other,
              dashed: true,
              dots: false,
              points: [
                { x: 0, y: 0 },
                { x: 100, y: 100 },
              ],
            },
          ]}
        />
      </ChartCard>
    ),
  },
  {
    key: 'Tiers',
    chart: 'Mirrored bars',
    node: (
      <ChartCard
        title="Which customers are many, and which ones pay?"
        takeaway={
          <>
            {smallCustomers}% of customers spend under £1,000 a year and bring {smallRevenue}% of revenue. At the other end, {key.customers} accounts bring{' '}
            {key.pct_of_revenue}%. The largest block sits in between: <strong>{n(mid.customers)} accounts between £1,000 and £4,999 bring {mid.pct_of_revenue}%</strong>.
          </>
        }
        table={{
          head: ['Revenue in the period', 'Accounts', 'Share of customers', 'Revenue', 'Share of revenue', 'Orders per account', 'Typical order value'],
          rows: q04.map((t) => [t.tier, t.customers, `${t.pct_of_customers}%`, gbp(t.revenue), `${t.pct_of_revenue}%`, t.avg_orders, gbp(t.median_order_value)]),
        }}
        footnote="Typical order value is the median across accounts of each account's own median order."
      >
        <ChartLabel>Customer tiers by revenue in the period</ChartLabel>
        <MirrorBars
          max={45}
          left={{ name: 'Share of customers', color: C.teal }}
          right={{ name: 'Share of revenue', color: C.blue }}
          rows={q04.map((t) => ({
            label: t.tier,
            sub: `${n(t.customers)} accounts`,
            left: t.pct_of_customers,
            right: t.pct_of_revenue,
            leftTip: `of customers, ${n(t.customers)} accounts`,
            rightTip: `of revenue, ${gbp(t.revenue)}`,
          }))}
        />
      </ChartCard>
    ),
  },
  {
    key: 'New or returning',
    chart: 'Stacked columns',
    node: (
      <ChartCard
        title="Is the growth coming from new customers?"
        takeaway={
          <>
            No. From May on, customers seen before bring <strong>{retMin}% to {retMax}%</strong> of each month's revenue. The number of first-time customers fell from{' '}
            {firstTimers('2011-01')} in January to {firstTimers('2011-08')} in August, and reached only {firstTimers('2011-11')} in the November peak.
          </>
        }
        table={{
          head: ['Month', 'First-time customers', 'Their revenue', 'Returning customers', 'Their revenue', 'Returning share of revenue'],
          rows: midYear.map((m) => [m.month_label, m.first_month_customers, gbp(m.revenue_first_month_customers), m.returning_customers, gbp(m.revenue_returning_customers), `${m.pct_revenue_returning}%`]),
        }}
        footnote="Revenue tied to a customer account. December 2010 is the first month in the file, so new and existing customers cannot be told apart there; it is left out, as is the partial December 2011."
      >
        <ChartLabel>Monthly revenue by customer type, 2011</ChartLabel>
        <StackedColumns
          max={1200000}
          yTicks={[0, 400000, 800000, 1200000]}
          f={(v) => (v === 0 ? '0' : v % 100000 === 0 && v >= 400000 ? `£${v / 1e6}M` : gbp(v))}
          categories={midYear.map((m) => ({ label: m.month_label.slice(0, 3), tipTitle: m.month_label }))}
          series={[
            { name: 'Customers seen before', color: C.blue, values: midYear.map((m) => m.revenue_returning_customers) },
            { name: 'First-time customers', color: C.teal, values: midYear.map((m) => m.revenue_first_month_customers) },
          ]}
        />
      </ChartCard>
    ),
  },
  {
    key: 'Retention',
    chart: 'Cohort heatmap',
    node: (
      <ChartCard
        title="Do customers come back?"
        takeaway={
          <>
            Of the customers first seen in January 2011, <strong>{cohortCell('2011-01', 1)!.pct_ordering}% ordered again the next month</strong> and{' '}
            {cohortCell('2011-01', 10)!.pct_ordering}% ten months later, in the autumn peak. Later groups behave the same way: roughly one in five orders in any given
            month, more in the peak. The base is loyal but not growing.
          </>
        }
        table={{
          head: ['First order in', 'Customers', 'Months later', 'Ordered again', 'Share'],
          rows: q06.map((r) => [r.cohort_label, r.cohort_size, r.months_later, r.customers_ordering, `${r.pct_ordering}%`]),
        }}
        footnote="The December 2010 row is higher because it holds the whole existing customer base, not only new customers. Read across a row to follow one group through the year."
      >
        <ChartLabel>Share of each group ordering again, by months since the first order (%)</ChartLabel>
        <Heatmap
          dense
          max={50}
          corner="First order"
          colsTitle="Months after the first order"
          legend={['Fewer order again', 'More order again']}
          cols={Array.from({ length: 11 }, (_, i) => `${i + 1}`)}
          rows={cohorts.map((c) => {
            const first = q06.find((r) => r.cohort === c)!;
            return {
              label: first.cohort_label,
              sub: `${n(first.cohort_size)}`,
              cells: Array.from({ length: 11 }, (_, i): HeatCell => {
                const cell = cohortCell(c, i + 1);
                return cell
                  ? {
                      v: cell.pct_ordering,
                      text: `${Math.round(cell.pct_ordering)}`,
                      tip: [
                        { value: `${cell.pct_ordering}%`, label: `ordered again ${i + 1} month${i ? 's' : ''} later` },
                        { value: `${n(cell.customers_ordering)} of ${n(first.cohort_size)}`, label: 'customers' },
                      ],
                    }
                  : null;
              }),
            };
          })}
        />
      </ChartCard>
    ),
  },
  {
    key: 'Markets',
    chart: 'Bubble chart',
    node: (
      <ChartCard
        title="Is export a second leg to stand on?"
        takeaway={
          <>
            Export brings {H.pct_revenue_export}% of revenue from {H.export_markets} markets outside the UK. But in the Netherlands and Australia a single account brings{' '}
            {country('Netherlands').pct_from_largest_account}% and {country('Australia').pct_from_largest_account}% of the country's revenue.{' '}
            <strong>
              Only Germany and France combine a real customer base ({country('Germany').customers} and {country('France').customers} accounts) with low dependence
            </strong>{' '}
            on any one of them.
          </>
        }
        table={{
          head: ['Market', 'Accounts', 'Revenue', 'Share of revenue', 'Revenue per account', 'Orders per account', 'From the largest account'],
          rows: q07.map((r) => [
            r.country,
            r.customers,
            gbp(r.revenue),
            `${r.pct_of_revenue}%`,
            gbp(r.revenue_per_customer),
            r.orders_per_customer,
            r.pct_from_largest_account === null ? 'n/a' : `${r.pct_from_largest_account}%`,
          ]),
        }}
        footnote="Markets with three or more customer accounts. The horizontal axis is logarithmic so that the UK and the small markets fit on one chart. Unlabelled bubbles are the other export markets; hover, tap or open the table."
      >
        <ChartLabel>Each bubble is a market · bubble size = revenue</ChartLabel>
        <Bubbles
          points={marketPoints}
          xDomain={[0.3, 4.1]}
          yDomain={[0, 110]}
          xTicks={[Math.log10(3), 1, 2, 3]}
          yTicks={[0, 25, 50, 75, 100]}
          xTitle="Customer accounts in the market (log scale)"
          yTitle="Share of the market's revenue that comes from its largest account"
          fx={(v) => n(Math.round(10 ** v))}
          fy={(v) => `${v}%`}
          sizeLabel="pounds of revenue"
          yTipLabel="of revenue from the largest account"
        />
      </ChartCard>
    ),
  },
];

/* ---------- the story ---------- */

const story: StoryConfig = {
  intro: (
    <>
      A business intelligence story built on {n(O.invoice_lines)} invoice lines from one year of trading at a UK online gift retailer: from the problem, through the
      growth levers already in use, to a recommendation a sales team can act on.
    </>
  ),
  chips: ['Source: UCI Online Retail, CC BY 4.0', '1 December 2010 to 9 December 2011', 'Independent analysis'],
  problem: {
    title: `A record November that rests on ${H.key_accounts} customers`,
    lead: (
      <>
        {monthName(peak.month_label)} revenue was almost three times the {monthName(low.month_label)} figure. But {H.key_accounts} accounts out of {n(H.customers)} bring in {H.pct_revenue_key_accounts}% of it, and
        a third of all customers ordered only once. This case study maps where the money comes from, tests the growth levers already in use, and sizes three ways to
        grow on a wider base.
      </>
    ),
    stats: [
      { value: `${H.pct_revenue_key_accounts}%`, label: `of revenue comes from ${H.key_accounts} accounts, fewer than 1 in 100 customers` },
      { value: `${H.pct_one_order_customers}%`, label: `of customers ordered once in the year, and bring ${H.pct_revenue_one_order_customers}% of revenue` },
      { value: `${O.pct_revenue_without_account}%`, label: 'of all revenue is not tied to any customer account' },
    ],
  },
  views,
  tried: {
    title: 'The levers already in use: a wider catalogue and a wider map',
    lead: (
      <>
        The file shows two growth levers at work. The retailer sells {n(O.products)} products and ships to {H.export_markets} markets besides the UK. The numbers
        show what that breadth delivered.
      </>
    ),
    stats: [
      { value: `${tail.pct_of_revenue}%`, label: 'of revenue comes from the bottom half of the catalogue', sub: `${n(tail.units)} products` },
      { value: `${thin.units}`, label: 'export markets have fewer than 10 customer accounts', sub: `${deep.units} export markets have 50 or more` },
      { value: `${thin.pct_from_20k_accounts}%`, label: 'of revenue in those thin markets comes from accounts above £20,000', sub: `${gbp(thin.revenue)} in total` },
    ],
    why: [
      <>
        Reach is not depth. The {thin.units} thin markets bring {thin.pct_of_revenue}% of revenue, but {thin.pct_from_20k_accounts}% of that comes from a few wholesale
        accounts. Lose one of them and the market is gone.
      </>,
      <>
        The long tail adds choice, not revenue. The top 10% of products bring {head.pct_of_revenue}%; the bottom half brings {tail.pct_of_revenue}%.
      </>,
      <>
        Neither lever changed who pays. With {n(O.products)} products in {H.export_markets + 1} markets, {H.key_accounts} accounts still bring {H.pct_revenue_key_accounts}% of
        revenue.
      </>,
    ],
    limits: [
      <>One year of data cannot show whether the concentration is rising or falling.</>,
      <>There are no costs or margins in the file. This is revenue, not profit, and wholesale accounts may buy at lower margins.</>,
      <>
        {O.pct_revenue_without_account}% of revenue has no customer account, so the customer views describe the other {(100 - O.pct_revenue_without_account).toFixed(1)}%.
      </>,
      <>The file shows what was sold, not what management intended. "In use" means visible in the data.</>,
    ],
  },
  options: {
    title: "Three ways to grow, sized from the retailer's own customers",
    lead: 'Each option is sized at rates already observed in this file. The sizes are scenarios for comparing the options, not forecasts.',
    criteria: ['Size of the gain', 'Widens the revenue base', 'Evidence in the data'],
    pick: 1,
    items: [
      {
        title: `Protect and grow the ${H.key_accounts} key accounts`,
        points: [
          `${opt('A').customers} accounts bring ${gbpM(opt('A').revenue_today)}, ${opt('A').pct_of_revenue}% of revenue, and order ${key.avg_orders} times a year on average`,
          `One in ten of them leaving would cost about ${gbpK(opt('A').sized_effect)}`,
          'Growing them is the fastest route to more revenue, and it deepens the dependence',
        ],
        scores: [2, 1, 3],
      },
      {
        title: 'Build the middle: one more order from each mid-tier account',
        points: [
          `${n(opt('B').customers)} accounts between £1,000 and £4,999 bring ${opt('B').pct_of_revenue}% of revenue`,
          `They already order ${mid.avg_orders} times a year, at a typical order of ${gbp(mid.median_order_value)}`,
          `One more order each, at each account's own typical order value, adds about ${gbpK(opt('B').sized_effect)}, or ${pctOfRevenue(opt('B').sized_effect)}% of revenue`,
        ],
        scores: [3, 3, 2],
      },
      {
        title: 'Win a second order from one-time buyers',
        points: [
          `${n(opt('C').customers)} customers ordered once and bring ${opt('C').pct_of_revenue}% of revenue`,
          `A second order from one in four of them adds about ${gbpK(opt('C').sized_effect)}`,
          'The weakest evidence: the file cannot tell a lost customer from an occasional one',
        ],
        scores: [1, 2, 1],
      },
    ],
  },
  recommendation: {
    title: 'Build the middle, and put a named owner on every key account',
    scoreNote: 'Equal weights. A team that needs revenue this quarter would weight the evidence higher, which narrows the gap between A and B.',
    why: [
      `It is the largest sized gain: about ${gbpK(opt('B').sized_effect)} from behaviour these customers already show, ${mid.avg_orders} orders a year.`,
      `It spreads revenue across ${n(mid.customers)} accounts instead of ${H.key_accounts}, so concentration falls as revenue grows.`,
      'It needs no new customers, markets or products. The accounts and their buying history are already in the system.',
    ],
    closing: (
      <>
        Option A stays as a guard, not a growth plan: each key account is worth about{' '}
        <strong className="text-white">{gbpK(key.revenue / key.customers)} a year</strong>, so each one needs a named owner. And tie the{' '}
        {O.pct_revenue_without_account}% of revenue that has no account to a customer record, so the next review covers all of it.
      </>
    ),
  },
  built: {
    lead: 'The public file was queried with SQL, one query per question. Only summary tables leave the database, and every number on this page is read from them.',
    repoUrl: REPO_URL,
    repoText: 'The SQL for every question, the summary tables behind every chart, the source file and the steps to re-run it.',
    method: [
      <>
        Source: Chen, D. (2015). <A href={SOURCE_URL}>Online Retail</A> [dataset]. UCI Machine Learning Repository, licensed <A href={LICENCE_URL}>CC BY 4.0</A>.{' '}
        {n(O.invoice_lines)} invoice lines from a UK-based online gift retailer, 1 December 2010 to 9 December 2011. The retailer is not named in the source.
      </>,
      <>Revenue is quantity times unit price on product lines, net of cancellations, in pounds sterling. Postage, fees, manual adjustments and bad-debt lines are left out.</>,
      <>Customer views use the revenue tied to a customer account. Accounts whose only activity was a cancelled order are left out.</>,
      <>Customer account numbers are used only to group lines. No account number appears in any result, and countries with one or two accounts are grouped.</>,
      <>The option sizes are scenarios at observed rates, not forecasts. The file holds no cost or margin data.</>,
      <>Changes made to the source: aggregation into counts, sums, shares and medians. Independent work, not affiliated with or endorsed by the retailer, UCI or the dataset's author.</>,
    ],
  },
  footer: 'Source: Chen, D. (2015). Online Retail. UCI Machine Learning Repository. CC BY 4.0.',
};

export default function RetailCaseStudy() {
  return <Story c={story} />;
}
