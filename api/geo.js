// 방문 지역 통계용: Vercel이 붙여 주는 지역 헤더만 돌려준다.
// IP는 읽지도, 돌려주지도, 저장하지도 않는다.
module.exports = function handler(req, res) {
  function header(name, max) {
    const raw = req.headers[name];
    if (!raw || Array.isArray(raw)) return null;
    let value = raw;
    try { value = decodeURIComponent(raw); } catch (_) { /* 깨진 인코딩은 원문 그대로 */ }
    value = value.trim();
    return value ? value.slice(0, max) : null;
  }

  res.setHeader('Cache-Control', 'private, no-store');
  res.setHeader('Content-Type', 'application/json; charset=utf-8');
  res.statusCode = 200;
  res.end(JSON.stringify({
    country: header('x-vercel-ip-country', 2),
    region: header('x-vercel-ip-country-region', 10),
    city: header('x-vercel-ip-city', 60)
  }));
};
