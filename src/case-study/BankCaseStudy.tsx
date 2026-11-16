import { C, ChartCard, ChartLabel, Dumbbells, Stat } from './charts';
import { Heatmap, LineXY, Lollipop, MirrorBars, type HeatCell, type XYPoint } from './charts-more';
import Story, { A, type StoryConfig } from './Story';
import { q01, q02, q04, q05, q06, q07, q08, q09, q10, q11, q12 } from './bank-data';

const SOURCE_URL = 'https://archive.ics.uci.edu/dataset/222/bank+marketing';
const LICENCE_URL = 'https://creativecommons.org/licenses/by/4.0/';
const REPO_URL = 'https://github.com/AEMSabbirRifat/bank-campaign-performance-case-study';

const n = (v: number) => v.toLocaleString('en-US');
const O = q01[0];
const H = q12[0];

/* ---------- derived figures (all from the SQL result tables) ---------- */
const year = (y: number) => q02.find((r) => r.campaign_year === y)!;
const channel = (y: number, ch: string) => q04.find((r) => r.campaign_year === y && r.channel === ch)!;
const history = (h: string, period: string) => q07.find((r) => r.history.startsWith(h) && `${r.period}` === period)!;
const histories = [...new Set(q07.map((r) => r.history))];
const periods = ['2008', '2009', '2010', 'All years'];
const job = (name: string) => q08.find((r) => r.job_group === name)!;
const group = (order: number) => q10.find((r) => r.call_order === order)!;
const option = (o: string) => q11.find((r) => r.option === o)!;
const persistent = q06.find((r) => r.sort_order === 4)!;
const callsPerSale = (calls: number, sales: number) => (calls / sales).toFixed(calls / sales >= 30 ? 0 : 1);
const lowResponseShare = +(job('Blue-collar').pct_of_clients + job('Services').pct_of_clients).toFixed(1);
const groupShort = ['Earlier buyers', 'Students, retired', 'Other mobile', 'Declined before', 'Landline'];
const groupSide: XYPoint['side'][] = ['right', 'right', 'bottom', 'left', 'left'];

/* ---------- the six investigation views ---------- */

const views: StoryConfig['views'] = [
  {
    key: 'The calls',
    chart: 'Mirrored bars',
    node: (
      <ChartCard
        title="Where did the calls go, and where did the sales come from?"
        takeaway={
          <>
            <strong>
              2008 took {year(2008).pct_of_all_calls}% of the calls and returned {year(2008).pct_of_all_sales}% of the sales.
            </strong>{' '}
            2010 took {year(2010).pct_of_all_calls}% of the calls and returned {year(2010).pct_of_all_sales}%. Calls per sale fell from {year(2008).calls_per_sale} to{' '}
            {year(2009).calls_per_sale} to {year(2010).calls_per_sale}.
          </>
        }
        table={{
          head: ['Year', 'Clients contacted', 'Calls', 'Share of calls', 'Deposits sold', 'Share of sales', 'Clients who bought', 'Calls per sale', 'Avg. 3-month Euribor'],
          rows: q02.map((r) => [
            `${r.campaign_year}`,
            r.clients_contacted,
            r.calls_made,
            `${r.pct_of_all_calls}%`,
            r.deposits_sold,
            `${r.pct_of_all_sales}%`,
            `${r.pct_clients_who_bought}%`,
            r.calls_per_sale,
            `${r.avg_euribor_3m}%`,
          ]),
        }}
        footnote={`Interest rates fell sharply over the period: the 3-month Euribor averaged ${year(2008).avg_euribor_3m}% across the 2008 contacts and ${year(2010).avg_euribor_3m}% in 2010. The years differ in more than how the bank called, so from here on every comparison is made inside a year.`}
      >
        <ChartLabel>Each year's share of all calls and of all sales</ChartLabel>
        <MirrorBars
          max={80}
          left={{ name: 'Share of all calls', color: C.orange }}
          right={{ name: 'Share of all sales', color: C.blue }}
          rows={q02.map((r) => ({
            label: `${r.campaign_year}`,
            sub: `${n(r.clients_contacted)} clients`,
            left: r.pct_of_all_calls,
            right: r.pct_of_all_sales,
            leftTip: `of all calls, ${n(r.calls_made)} calls`,
            rightTip: `of all sales, ${n(r.deposits_sold)} deposits`,
          }))}
        />
        <div className="mt-8 grid grid-cols-3 gap-3">
          {q02.map((r) => (
            <Stat key={r.campaign_year} value={`${r.calls_per_sale}`} label={`calls per sale in ${r.campaign_year}`} />
          ))}
        </div>
      </ChartCard>
    ),
  },
  {
    key: 'Channel',
    chart: 'Dumbbell chart',
    node: (
      <ChartCard
        title="Does the channel matter?"
        takeaway={
          <>
            Yes, in every year. Among first-time contacts, <strong>mobile beats landline</strong>: {channel(2008, 'Mobile').pct_clients_who_bought}% against{' '}
            {channel(2008, 'Landline').pct_clients_who_bought}% in 2008, {channel(2009, 'Mobile').pct_clients_who_bought}% against{' '}
            {channel(2009, 'Landline').pct_clients_who_bought}% in 2009, and {channel(2010, 'Mobile').pct_clients_who_bought}% against{' '}
            {channel(2010, 'Landline').pct_clients_who_bought}% in 2010. In 2008, {year(2008).pct_landline}% of all contacts were still made on a landline.
          </>
        }
        table={{
          head: ['Year', 'Channel', 'First-time clients', 'Calls', 'Deposits sold', 'Clients who bought', 'Calls per sale'],
          rows: q04.map((r) => [`${r.campaign_year}`, r.channel, r.clients_contacted, r.calls_made, r.deposits_sold, `${r.pct_clients_who_bought}%`, r.calls_per_sale]),
        }}
        footnote="First-time contacts only, so that the comparison is not flattered by clients the bank already knew."
      >
        <ChartLabel>Share of first-time contacts who bought, by year</ChartLabel>
        <Dumbbells
          max={60}
          series={[
            { name: 'Landline', color: C.orange },
            { name: 'Mobile', color: C.blue },
          ]}
          rows={[2008, 2009, 2010].map((y) => ({
            label: `${y}`,
            a: channel(y, 'Landline').pct_clients_who_bought,
            b: channel(y, 'Mobile').pct_clients_who_bought,
            detail: `${n(channel(y, 'Landline').clients_contacted)} landline, ${n(channel(y, 'Mobile').clients_contacted)} mobile`,
          }))}
        />
      </ChartCard>
    ),
  },
  {
    key: 'Persistence',
    chart: 'Line chart',
    node: (
      <ChartCard
        title="Does calling again pay?"
        takeaway={
          <>
            In 2009 and 2010, {q05[0].pct_bought_2009_2010}% of the clients who were called once bought. Among clients called seven times or more it was{' '}
            <strong>{q05[6].pct_bought_2009_2010}%</strong>. In 2008 the rate sat near 5% however often the bank called.{' '}
            <strong>
              {n(H.clients_called_10_plus)} clients were called ten times or more: {n(H.calls_to_those_clients)} calls for {H.sales_from_those_clients} sales.
            </strong>
          </>
        }
        table={[
          {
            caption: 'Share who bought, by number of calls to the client',
            head: ['Calls to the client', 'Clients, 2008', 'Bought, 2008', 'Clients, 2009 and 2010', 'Bought, 2009 and 2010'],
            rows: q05.map((r) => [r.calls_to_client, r.clients_2008, `${r.pct_bought_2008}%`, r.clients_2009_2010, `${r.pct_bought_2009_2010}%`]),
          },
          {
            caption: 'What repeated calling cost, all years',
            head: ['Calls to the client', 'Clients', 'Calls', 'Share of calls', 'Deposits sold', 'Share of sales', 'Calls per sale'],
            rows: q06.map((r) => [r.calls_to_client, r.clients_contacted, r.calls_made, `${r.pct_of_all_calls}%`, r.deposits_sold, `${r.pct_of_all_sales}%`, r.calls_per_sale]),
          },
        ]}
        footnote="The file records a client's outcome at the last call, so each point is the share of clients who bought after that many calls in total."
      >
        <ChartLabel>Share of clients who bought, by number of calls to the client</ChartLabel>
        <LineXY
          xDomain={[0.6, 7.4]}
          yDomain={[0, 30]}
          xTicks={[1, 2, 3, 4, 5, 6, 7]}
          yTicks={[0, 10, 20, 30]}
          fx={(v) => (v === 7 ? '7+' : `${v}`)}
          fy={(v) => `${v}%`}
          xTitle="Calls made to the client in the campaign"
          series={[
            {
              name: '2009 and 2010',
              color: C.blue,
              points: q05.map((r) => ({
                x: r.sort_order,
                y: r.pct_bought_2009_2010,
                label: `${r.pct_bought_2009_2010}%`,
                side: 'top' as const,
                tipTitle: `${r.calls_to_client} call${r.sort_order === 1 ? '' : 's'}, 2009 and 2010`,
                tip: [
                  { value: `${r.pct_bought_2009_2010}%`, label: 'bought' },
                  { value: n(r.clients_2009_2010), label: 'clients' },
                ],
              })),
            },
            {
              name: '2008',
              color: C.orange,
              points: q05.map((r, i) => ({
                x: r.sort_order,
                y: r.pct_bought_2008,
                label: i === 0 || i === q05.length - 1 ? `${r.pct_bought_2008}%` : undefined,
                side: 'bottom' as const,
                tipTitle: `${r.calls_to_client} call${r.sort_order === 1 ? '' : 's'}, 2008`,
                tip: [
                  { value: `${r.pct_bought_2008}%`, label: 'bought' },
                  { value: n(r.clients_2008), label: 'clients' },
                ],
              })),
            },
          ]}
        />
      </ChartCard>
    ),
  },
  {
    key: 'History',
    chart: 'Heatmap',
    node: (
      <ChartCard
        title="Who says yes?"
        takeaway={
          <>
            Clients who bought in an earlier campaign are the best leads by far: {history('Bought', '2009').pct_clients_who_bought}% bought again in 2009 and{' '}
            {history('Bought', '2010').pct_clients_who_bought}% in 2010. <strong>The pooled column hides a trap.</strong> Across all years, clients who declined before (
            {history('Declined', 'All years').pct_clients_who_bought}%) look better than first-time contacts ({history('Never', 'All years').pct_clients_who_bought}%).
            Inside every single year it is the other way round.
          </>
        }
        table={{
          head: ['History with the bank', 'Period', 'Clients contacted', 'Deposits sold', 'Clients who bought'],
          rows: q07.map((r) => [r.history, `${r.period}`, r.clients_contacted, r.deposits_sold, r.pct_clients_who_bought === null ? 'n/a' : `${r.pct_clients_who_bought}%`]),
        }}
        footnote="The pooled figure for clients who declined before is high only because they were mostly called in 2009 and 2010, the better years. Comparing inside each year removes that effect."
      >
        <ChartLabel>Share of clients who bought (%), by history with the bank</ChartLabel>
        <Heatmap
          max={80}
          legend={['Fewer bought', 'More bought']}
          cols={periods}
          rows={histories.map((h) => ({
            label: h,
            cells: periods.map((p): HeatCell => {
              const r = q07.find((x) => x.history === h && `${x.period}` === p)!;
              return r.pct_clients_who_bought === null
                ? null
                : {
                    v: r.pct_clients_who_bought,
                    text: `${r.pct_clients_who_bought}`,
                    tip: [
                      { value: `${r.pct_clients_who_bought}%`, label: 'bought' },
                      { value: `${n(r.deposits_sold)} of ${n(r.clients_contacted)}`, label: 'clients' },
                    ],
                  };
            }),
          }))}
        />
      </ChartCard>
    ),
  },
  {
    key: 'Segments',
    chart: 'Lollipop chart',
    node: (
      <ChartCard
        title="Which groups respond?"
        takeaway={
          <>
            In 2009, the year with both volume and spread, <strong>retired clients ({job('Retired').pct_bought_2009}%) and students ({job('Student').pct_bought_2009}%)</strong>{' '}
            bought about three times as often as blue-collar ({job('Blue-collar').pct_bought_2009}%) and services clients ({job('Services').pct_bought_2009}%). Those
            two low-response groups made up {lowResponseShare}% of everyone the bank contacted.
          </>
        }
        table={[
          {
            caption: 'By job group',
            head: ['Job group', 'Clients contacted', 'Share of clients', 'Bought, 2008', 'Bought, 2009', 'Bought, 2010'],
            rows: q08.map((r) => [r.job_group, r.clients_contacted, `${r.pct_of_clients}%`, `${r.pct_bought_2008}%`, `${r.pct_bought_2009}%`, `${r.pct_bought_2010}%`]),
          },
          {
            caption: 'By age band',
            head: ['Age', 'Clients contacted', 'Bought, 2008', 'Bought, 2009', 'Bought, 2010'],
            rows: q09.map((r) => [r.age_band, r.clients_contacted, r.pct_bought_2008 === null ? 'n/a' : `${r.pct_bought_2008}%`, `${r.pct_bought_2009}%`, `${r.pct_bought_2010}%`]),
          },
        ]}
        footnote="In 2008 every job group sat between 3% and 7%, and in 2010 between 42% and 56%. The spread between groups is widest in 2009, which is why the chart shows that year. The table has all three."
      >
        <ChartLabel>Share of clients who bought in 2009, by job group</ChartLabel>
        <Lollipop
          max={42}
          rows={q08.map((r, i) => ({
            label: r.job_group,
            value: r.pct_bought_2009,
            display: `${r.pct_bought_2009}%`,
            highlight: i < 2,
            tip: [
              { value: `${r.pct_bought_2009}%`, label: `bought in 2009, of ${n(r.clients_2009)} clients` },
              { value: `${r.pct_bought_2008}%`, label: 'in 2008' },
              { value: `${r.pct_bought_2010}%`, label: 'in 2010' },
            ],
          }))}
        />
      </ChartCard>
    ),
  },
  {
    key: 'Call order',
    chart: 'Gains curve',
    node: (
      <ChartCard
        title="What would a plain call order have done?"
        takeaway={
          <>
            Five groups, called in the order the findings support. <strong>The first two groups took {group(2).cumulative_pct_of_calls}% of the calls and produced{' '}
            {group(2).cumulative_pct_of_sales}% of the sales.</strong> First-time landline contacts, the last group, took{' '}
            {(100 - group(4).cumulative_pct_of_calls).toFixed(1)}% of the calls and produced {(100 - group(4).cumulative_pct_of_sales).toFixed(1)}% of the sales.
          </>
        }
        table={{
          head: ['Order', 'Client group', 'Clients', 'Calls', 'Deposits sold', 'Clients who bought', 'Calls per sale', 'Cumulative calls', 'Cumulative sales'],
          rows: q10.map((r) => [
            r.call_order,
            r.client_group,
            r.clients_contacted,
            r.calls_made,
            r.deposits_sold,
            `${r.pct_clients_who_bought}%`,
            r.calls_per_sale,
            `${r.cumulative_pct_of_calls}%`,
            `${r.cumulative_pct_of_sales}%`,
          ]),
        }}
        footnote="No model and no machine learning: the five groups are plain rules taken from views 2, 4 and 5, in the order that holds inside each year. Sales are counted as they happened, so this replays the past and does not predict the future."
      >
        <ChartLabel>Cumulative share of sales against cumulative share of calls</ChartLabel>
        <LineXY
          height="h-72"
          xDomain={[0, 100]}
          yDomain={[0, 100]}
          xTicks={[0, 20, 40, 60, 80, 100]}
          yTicks={[0, 25, 50, 75, 100]}
          fx={(v) => `${v}%`}
          fy={(v) => `${v}%`}
          xTitle="Share of all calls, groups added in call order"
          series={[
            {
              name: 'Called in this order',
              color: C.blue,
              area: true,
              points: [
                { x: 0, y: 0 },
                ...q10.map((r, i) => ({
                  x: r.cumulative_pct_of_calls,
                  y: r.cumulative_pct_of_sales,
                  label: groupShort[i],
                  side: groupSide[i],
                  tipTitle: `${r.call_order}. ${r.client_group}`,
                  tip: [
                    { value: `${r.cumulative_pct_of_sales}%`, label: 'of sales so far' },
                    { value: `${r.cumulative_pct_of_calls}%`, label: 'of calls so far' },
                    { value: `${r.calls_per_sale}`, label: 'calls per sale in this group' },
                  ],
                })),
              ],
            },
            {
              name: 'Calls spread evenly',
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
];

/* ---------- the story ---------- */

const story: StoryConfig = {
  intro: (
    <>
      A performance marketing story built on {n(O.clients_contacted)} client contacts from a bank's phone campaigns for a term deposit: from the problem, through the
      volume push that was tried first, to a call plan the next campaign can use.
    </>
  ),
  chips: ['Source: UCI Bank Marketing, CC BY 4.0', 'May 2008 to November 2010', 'Independent analysis'],
  problem: {
    title: `${n(H.calls_made)} calls, ${n(H.deposits_sold)} deposits sold: ${Math.round(H.calls_per_sale)} calls for every sale`,
    lead: (
      <>
        A Portuguese bank sold a term deposit by phone over three years. Almost three in four of its calls were made in the first year, when it took{' '}
        {Math.round(H.calls_per_sale_2008)} calls to make one sale. By the third year it took fewer than four. This case study finds out which calls paid, and turns
        that into a call plan.
      </>
    ),
    stats: [
      { value: `${H.calls_per_sale}`, label: 'calls for every deposit sold, across the three years' },
      { value: `${H.pct_calls_in_2008}%`, label: `of all calls were made in 2008. They produced ${H.pct_sales_in_2008}% of the sales` },
      { value: `${H.calls_per_sale_2008} → ${H.calls_per_sale_2010}`, label: 'calls per sale in 2008 and in 2010' },
    ],
  },
  views,
  tried: {
    title: 'The first plan: volume',
    lead: (
      <>
        In 2008 the bank worked through its client list by phone: {n(year(2008).clients_contacted)} clients and {n(year(2008).calls_made)} calls. Almost everyone was a
        first-time contact, half were reached on a landline, and clients who had not decided were called again and again.
      </>
    ),
    stats: [
      { value: `${year(2008).calls_per_sale}`, label: 'calls for every deposit sold in 2008', sub: `${year(2009).calls_per_sale} in 2009, ${year(2010).calls_per_sale} in 2010` },
      { value: `${year(2008).pct_first_time_contacts}%`, label: 'of the 2008 contacts had never been contacted before' },
      {
        value: `${persistent.calls_per_sale}`,
        label: 'calls per sale among clients called ten times or more',
        sub: `${n(persistent.clients_contacted)} clients, ${n(persistent.calls_made)} calls, ${persistent.deposits_sold} sales`,
      },
    ],
    why: [
      <>
        Volume went to the weakest leads. First-time landline contacts took {n(H.first_time_landline_calls)} calls and returned {H.first_time_landline_sales} sales:{' '}
        {callsPerSale(H.first_time_landline_calls, H.first_time_landline_sales)} calls per sale.
      </>,
      <>
        Persistence had no payoff. After the third call to a client, {n(H.calls_after_the_third)} further calls produced {H.sales_after_the_third} sales, about{' '}
        {callsPerSale(H.calls_after_the_third, H.sales_after_the_third)} calls per sale.
      </>,
      <>Nothing separated good leads from bad ones in 2008. Every job group and both channels sat between 3% and 7%, so more calls only bought more of the same.</>,
    ],
    limits: [
      <>
        The economy changed too. Market interest rates fell from about 5% to under 1% between 2008 and 2010, so the better results of the later years cannot be
        credited to targeting alone.
      </>,
      <>There are no costs or deposit amounts in this analysis, so the unit is calls per sale, not euros.</>,
      <>The file records each client's outcome at the last call, so a sale is attributed to the final contact.</>,
      <>The source file gives the month but not the year. The year is rebuilt from the order of the rows, which the source documents as chronological.</>,
    ],
  },
  options: {
    title: 'Three ways to spend fewer calls per sale',
    lead: 'Each option is replayed on the calls that were actually made: which calls it would have dropped, and which sales would have gone with them.',
    criteria: ['Calls saved', 'Sales kept', 'Holds in every year'],
    pick: 1,
    items: [
      {
        title: 'Stop after three calls to a client',
        points: [
          `Saves ${n(H.calls_made - option('A').calls_made)} calls, ${option('A').pct_calls_saved}% of the total`,
          `Keeps ${option('A').pct_sales_kept}% of the sales, ${n(option('A').deposits_sold)} of ${n(H.deposits_sold)}`,
          `Calls per sale fall from ${H.calls_per_sale} to ${option('A').calls_per_sale}. In 2008 the rate did not drop with more calls, so the evidence is mixed`,
        ],
        scores: [1, 3, 2],
      },
      {
        title: 'No first-time calls to landlines',
        points: [
          `Saves ${n(H.calls_made - option('B').calls_made)} calls, ${option('B').pct_calls_saved}% of the total`,
          `Keeps ${option('B').pct_sales_kept}% of the sales`,
          `Calls per sale fall to ${option('B').calls_per_sale}. Mobile beats landline for first-time contacts in all three years`,
        ],
        scores: [2, 2, 3],
      },
      {
        title: 'Both rules together',
        points: [
          `Saves ${option('C').pct_calls_saved}% of the calls, the most of the three`,
          `Keeps ${option('C').pct_sales_kept}% of the sales, the largest loss`,
          `Calls per sale fall to ${option('C').calls_per_sale}, the best efficiency, but it inherits the mixed evidence on the call cap`,
        ],
        scores: [3, 1, 2],
      },
    ],
  },
  recommendation: {
    title: 'Move first-time calls to mobile, then spend the saved calls on better leads',
    scoreNote: 'Equal weights. A team that is short of callers rather than short of leads would weight calls saved higher, which brings Option C level with B.',
    why: [
      `It removes the worst calls first: first-time landline contacts cost ${callsPerSale(H.first_time_landline_calls, H.first_time_landline_sales)} calls per sale, against ${callsPerSale(H.first_time_mobile_calls, H.first_time_mobile_sales)} for first-time mobile contacts.`,
      'It is the only rule that holds in all three years, in a good market and a bad one.',
      'It is simple to run: one field in the client list decides it, with no scoring model.',
    ],
    closing: (
      <>
        The {n(H.first_time_landline_calls)} calls it frees are the growth budget. Earlier buyers come first:{' '}
        <strong className="text-white">{group(1).pct_clients_who_bought}% of them bought again</strong>, at {group(1).calls_per_sale} calls per sale. Add the three-call
        cap once the list is ordered, and track calls per sale by year, never pooled.
      </>
    ),
  },
  built: {
    lead: 'The public file was queried with SQL, one query per question. Only summary tables leave the database, and every number on this page is read from them.',
    repoUrl: REPO_URL,
    repoText: 'The SQL for every question, the summary tables behind every chart, the source file and the steps to re-run it.',
    method: [
      <>
        Source: Moro, S., Rita, P. and Cortez, P. (2014). <A href={SOURCE_URL}>Bank Marketing</A> [dataset]. UCI Machine Learning Repository, licensed{' '}
        <A href={LICENCE_URL}>CC BY 4.0</A>. File bank-additional-full.csv: {n(O.clients_contacted)} clients contacted by a Portuguese bank between May 2008 and November
        2010. The bank is not named in the source.
      </>,
      <>One row is one client in the campaign, with the number of calls made to that client and whether the client opened the deposit.</>,
      <>The source file holds no names or identifiers. Only summary tables are published, and cells with fewer than 30 clients are left empty.</>,
      <>The length of the last call is in the file but is not used: it is only known after the call, so it cannot guide who to call.</>,
      <>The options replay past calls under each rule. They are not forecasts, and no statistical or machine-learning model is used.</>,
      <>Changes made to the source: aggregation into counts, shares and ratios. Independent work, not affiliated with or endorsed by the bank, UCI or the dataset's authors.</>,
    ],
  },
  footer: 'Source: Moro, S., Rita, P. and Cortez, P. (2014). Bank Marketing. UCI Machine Learning Repository. CC BY 4.0.',
};

export default function BankCaseStudy() {
  return <Story c={story} />;
}
