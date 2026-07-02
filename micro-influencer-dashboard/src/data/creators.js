export const platforms = ['tiktok', 'instagram', 'youtube'];

const firstNames = [
  'Alex', 'Jordan', 'Taylor', 'Morgan', 'Casey', 'Riley', 'Quinn', 'Avery',
  'Blake', 'Drew', 'Sage', 'Parker', 'Skyler', 'Reese', 'Jules', 'Rowan',
  'Emery', 'Dakota',
];

const niches = [
  'beauty', 'fitness', 'tech', 'travel', 'food', 'gaming', 'fashion',
  'finance', 'music', 'lifestyle',
];

function pick(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

function randInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function randFloat(min, max, decimals = 2) {
  return parseFloat((Math.random() * (max - min) + min).toFixed(decimals));
}

const creators = Array.from({ length: 18 }, (_, i) => {
  const platform = pick(platforms);
  const name = `@${pick(firstNames).toLowerCase()}_${pick(niches)}`;

  let spend, revenue, roi, cac, clicks;
  const perfTier = i < 6 ? 'high' : i < 12 ? 'mid' : 'low';

  if (platform === 'tiktok') {
    spend = randFloat(800, 5000);
    revenue = perfTier === 'high' ? spend * randFloat(4, 8)
           : perfTier === 'mid' ? spend * randFloat(1.5, 4)
           : spend * randFloat(0.3, 1.5);
    clicks = randInt(20000, 150000);
  } else if (platform === 'instagram') {
    spend = randFloat(1500, 8000);
    revenue = perfTier === 'high' ? spend * randFloat(3, 6)
           : perfTier === 'mid' ? spend * randFloat(1.2, 3)
           : spend * randFloat(0.2, 1.2);
    clicks = randInt(15000, 100000);
  } else {
    spend = randFloat(2000, 12000);
    revenue = perfTier === 'high' ? spend * randFloat(5, 10)
           : perfTier === 'mid' ? spend * randFloat(2, 5)
           : spend * randFloat(0.5, 2);
    clicks = randInt(30000, 250000);
  }

  roi = parseFloat(((revenue - spend) / spend * 100).toFixed(1));
  cac = parseFloat((spend / (clicks / 1000)).toFixed(2));
  if (cac > 200) cac = randFloat(15, 80);
  if (cac < 3) cac = randFloat(5, 40);

  return {
    id: i + 1,
    name,
    platform,
    spend: parseFloat(spend.toFixed(2)),
    revenue: parseFloat(revenue.toFixed(2)),
    roi,
    cac,
    clicks,
    status: perfTier === 'high' || i % 3 !== 0 ? 'active' : 'paused',
  };
});

export default creators;
