import { sendMail } from "@/lib/mail";

/* ─── helpers ─────────────────────────────────────────────── */
function riskColor(level) {
  if (level === "High" || level === "Critical") return "#dc2626";
  if (level === "Medium") return "#ea580c";
  return "#16a34a";
}
function riskBg(level) {
  if (level === "High" || level === "Critical") return "#fef2f2";
  if (level === "Medium") return "#fff7ed";
  return "#f0fdf4";
}
function riskBorder(level) {
  if (level === "High" || level === "Critical") return "#fca5a5";
  if (level === "Medium") return "#fdba74";
  return "#86efac";
}
function fmt(n) {
  return Number(n).toLocaleString("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 });
}
function resolveLevel(r) {
  if (r.risk_level) return r.risk_level;
  const pct = Math.round((r.risk_probability ?? 0) * 100);
  return pct >= 85 ? "High" : pct >= 65 ? "Medium" : "Low";
}

/* ─── Email-safe HTML (inline styles, light background) ────── */
function buildHtml({ distribution, countryRisk, suspicious, generatedAt }) {
  const highPct = distribution
    ? Math.round((distribution.high_risk / (distribution.high_risk + distribution.low_risk)) * 100)
    : 0;

  const tableRows = suspicious.map((r) => {
    const pct = Math.round((r.risk_probability ?? 0) * 100);
    const level = resolveLevel(r);
    const color = riskColor(level);
    const bg = riskBg(level);
    const border = riskBorder(level);
    return `
        <tr>
          <td style="padding:10px 14px;border-bottom:1px solid #f1f5f9;font-size:13px;color:#0f172a;font-weight:600;">${fmt(r.amount)}</td>
          <td style="padding:10px 14px;border-bottom:1px solid #f1f5f9;font-size:13px;color:#334155;">${r.sender_country ?? "—"}</td>
          <td style="padding:10px 14px;border-bottom:1px solid #f1f5f9;font-size:13px;color:#334155;">${r.receiver_country ?? "—"}</td>
          <td style="padding:10px 14px;border-bottom:1px solid #f1f5f9;font-size:13px;color:#334155;">${pct}%</td>
          <td style="padding:10px 14px;border-bottom:1px solid #f1f5f9;">
            <span style="display:inline-block;padding:2px 10px;border-radius:20px;font-size:11px;font-weight:700;
                         background:${bg};color:${color};border:1px solid ${border};">
              ${level}
            </span>
          </td>
        </tr>`;
  }).join("");

  const countryRows = countryRisk.map((c, i) => `
        <tr>
          <td style="padding:10px 14px;border-bottom:1px solid #f1f5f9;font-size:13px;color:#334155;">${c.country}</td>
          <td style="padding:10px 14px;border-bottom:1px solid #f1f5f9;font-size:13px;font-weight:700;color:#dc2626;">${c.suspicious_transactions}</td>
        </tr>`).join("");

  const statCards = [
    { label: "High Risk Txns", value: distribution?.high_risk ?? "—", color: "#dc2626", bg: "#fef2f2", border: "#fca5a5" },
    { label: "Low Risk Txns", value: distribution?.low_risk ?? "—", color: "#16a34a", bg: "#f0fdf4", border: "#86efac" },
    { label: "High Risk Rate", value: `${highPct}%`, color: "#7c3aed", bg: "#f5f3ff", border: "#c4b5fd" },
    { label: "Flagged Transactions", value: suspicious.length, color: "#0f172a", bg: "#f8fafc", border: "#e2e8f0" },
  ].map(({ label, value, color, bg, border }) => `
        <td style="width:25%;padding:0 8px;">
          <div style="background:${bg};border:1px solid ${border};border-radius:12px;padding:18px 16px;">
            <div style="font-size:10px;font-weight:700;letter-spacing:.08em;text-transform:uppercase;color:#94a3b8;margin-bottom:8px;">${label}</div>
            <div style="font-size:28px;font-weight:800;color:${color};line-height:1;">${value}</div>
          </div>
        </td>`).join("");

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8"/>
  <meta name="viewport" content="width=device-width,initial-scale=1"/>
  <title>SentinelAI Analytics Report</title>
</head>
<body style="margin:0;padding:0;background:#f8fafc;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;">

  <!-- Outer wrapper -->
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#f8fafc;padding:32px 0;">
    <tr><td align="center">
      <table width="680" cellpadding="0" cellspacing="0" style="background:#ffffff;border-radius:16px;border:1px solid #e2e8f0;overflow:hidden;">

        <!-- Top accent bar -->
        <tr>
          <td style="background:linear-gradient(90deg,#6366f1,#7c3aed);height:4px;font-size:0;">&nbsp;</td>
        </tr>

        <!-- Header -->
        <tr>
          <td style="padding:28px 32px 24px;border-bottom:1px solid #f1f5f9;">
            <table width="100%" cellpadding="0" cellspacing="0">
              <tr>
                <td style="vertical-align:middle;">
                  <table cellpadding="0" cellspacing="0">
                    <tr>
                      <td style="vertical-align:middle;">
                        <table cellpadding="0" cellspacing="0">
                          <tr>
                    <td align="center" valign="middle"
          style="width:44px;height:44px;border-radius:12px;
          background:linear-gradient(135deg,#6366f1,#7c3aed);">
          
        <img src="https://api.iconify.design/heroicons:shield-check.svg?color=white&width=44&height=44"
     width="22" height="22"
     style="display:block;margin:auto;" />
             
      </td>
    </tr>
  </table>
</td>
                      <td style="vertical-align:middle;padding-left:12px;">
                        <div style="font-size:18px;font-weight:800;color:#0f172a;line-height:1;">SentinelAI</div>
                        <div style="font-size:12px;color:#94a3b8;margin-top:2px;">Fraud Detection Platform</div>
                      </td>
                    </tr>
                  </table>
                </td>
                <td style="text-align:right;vertical-align:middle;">
                  <div style="font-size:12px;font-weight:700;color:#6366f1;text-transform:uppercase;letter-spacing:.06em;">Analytics Report</div>
                  <div style="font-size:11px;color:#94a3b8;margin-top:4px;">${generatedAt}</div>
                </td>
              </tr>
            </table>
          </td>
        </tr>

        <!-- Summary label -->
        <tr>
          <td style="padding:24px 32px 12px;">
            <div style="font-size:10px;font-weight:700;letter-spacing:.12em;text-transform:uppercase;color:#94a3b8;">Summary</div>
          </td>
        </tr>

        <!-- Stat cards -->
        <tr>
          <td style="padding:0 24px 28px;">
            <table width="100%" cellpadding="0" cellspacing="0">
              <tr>${statCards}</tr>
            </table>
          </td>
        </tr>

        <!-- Flagged Transactions -->
        <tr>
          <td style="padding:0 32px 8px;">
            <div style="font-size:10px;font-weight:700;letter-spacing:.12em;text-transform:uppercase;color:#94a3b8;margin-bottom:14px;">Flagged Transactions</div>
            <table width="100%" cellpadding="0" cellspacing="0" style="border:1px solid #e2e8f0;border-radius:12px;overflow:hidden;">
              <thead>
                <tr style="background:#f8fafc;">
                  <th style="padding:10px 14px;text-align:left;font-size:10px;font-weight:700;letter-spacing:.08em;text-transform:uppercase;color:#94a3b8;border-bottom:1px solid #e2e8f0;">Amount</th>
                  <th style="padding:10px 14px;text-align:left;font-size:10px;font-weight:700;letter-spacing:.08em;text-transform:uppercase;color:#94a3b8;border-bottom:1px solid #e2e8f0;">Sender</th>
                  <th style="padding:10px 14px;text-align:left;font-size:10px;font-weight:700;letter-spacing:.08em;text-transform:uppercase;color:#94a3b8;border-bottom:1px solid #e2e8f0;">Receiver</th>
                  <th style="padding:10px 14px;text-align:left;font-size:10px;font-weight:700;letter-spacing:.08em;text-transform:uppercase;color:#94a3b8;border-bottom:1px solid #e2e8f0;">Risk Score</th>
                  <th style="padding:10px 14px;text-align:left;font-size:10px;font-weight:700;letter-spacing:.08em;text-transform:uppercase;color:#94a3b8;border-bottom:1px solid #e2e8f0;">Level</th>
                </tr>
              </thead>
              <tbody>
                ${tableRows || `<tr><td colspan="5" style="text-align:center;color:#94a3b8;padding:20px;font-size:13px;">No flagged transactions</td></tr>`}
              </tbody>
            </table>
          </td>
        </tr>

        <!-- Country Risk -->
        <tr>
          <td style="padding:24px 32px 8px;">
            <div style="font-size:10px;font-weight:700;letter-spacing:.12em;text-transform:uppercase;color:#94a3b8;margin-bottom:14px;">Country Risk Breakdown</div>
            <table width="100%" cellpadding="0" cellspacing="0" style="border:1px solid #e2e8f0;border-radius:12px;overflow:hidden;">
              <thead>
                <tr style="background:#f8fafc;">
                  <th style="padding:10px 14px;text-align:left;font-size:10px;font-weight:700;letter-spacing:.08em;text-transform:uppercase;color:#94a3b8;border-bottom:1px solid #e2e8f0;">Country</th>
                  <th style="padding:10px 14px;text-align:left;font-size:10px;font-weight:700;letter-spacing:.08em;text-transform:uppercase;color:#94a3b8;border-bottom:1px solid #e2e8f0;">Suspicious Transactions</th>
                </tr>
              </thead>
              <tbody>
                ${countryRows || `<tr><td colspan="2" style="text-align:center;color:#94a3b8;padding:20px;font-size:13px;">No data</td></tr>`}
              </tbody>
            </table>
          </td>
        </tr>

        <!-- Footer -->
        <tr>
          <td style="padding:24px 32px;border-top:1px solid #f1f5f9;margin-top:24px;text-align:center;">
            <div style="font-size:11px;color:#cbd5e1;">Generated by <strong style="color:#6366f1;">SentinelAI</strong> &mdash; ${generatedAt} &mdash; Confidential</div>
          </td>
        </tr>

      </table>
    </td></tr>
  </table>

</body>
</html>`;
}

/* ─── PDF builder using pdfkit (pure Node.js, no browser) ── */
async function buildPdf(html) {
  try {
    const chromium = (await import("@sparticuz/chromium")).default
    const puppeteer = (await import("puppeteer-core")).default

    const browser = await puppeteer.launch({
      args: chromium.args,
      executablePath: await chromium.executablePath(),
      headless: chromium.headless,
    })

    const page = await browser.newPage()

    await page.setContent(html, {
      waitUntil: "networkidle0",
    })

    const pdf = await page.pdf({
      format: "A4",
      printBackground: true,
      margin: {
        top: "24px",
        right: "24px",
        bottom: "24px",
        left: "24px",
      },
    })

    await browser.close()

    return pdf
  } catch (err) {
    console.warn("PDF generation failed:", err.message)
    return null
  }
}

/* ─── API route ───────────────────────────────────────────── */
export async function POST(req) {
  try {
    const { email } = await req.json();

    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return Response.json({ error: "Invalid email" }, { status: 400 });
    }

    const BASE = process.env.BACKEND_URL ?? "https://aml-backend-hyt6.onrender.com";
    const res = await fetch(`${BASE}/analytics-report`);
    const data = await res.json();

    const distribution = data.distribution;
    const countryRisk = data.countryRisk;
    const suspicious = data.suspicious;

    const generatedAt = new Date().toLocaleString("en-US", {
      dateStyle: "medium", timeStyle: "short",
    });

    const html = buildHtml({ distribution, countryRisk, suspicious, generatedAt });
    const pdfBuffer = await buildPdf(html);

    const attachments = pdfBuffer
      ? [{ filename: `sentinelai-report-${Date.now()}.pdf`, content: pdfBuffer, contentType: "application/pdf" }]
      : [];

    await sendMail({
      email,
      subject: `SentinelAI Analytics Report — ${generatedAt}`,
      html,
      attachments,
    });

    return Response.json({ success: true });
  } catch (err) {
    console.error("send-report error:", err);
    return Response.json({ error: "Failed to send report. Please try again." }, { status: 500 });
  }
}
