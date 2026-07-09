export const sendWa = async (target, message) => {
  let settings = {};
  try { const r = await fetch("/api/pengaturan"); settings = await r.json(); } catch {}
  if (!settings.waNotif || !settings.fonnteToken) return false;
  try {
    const formData = new URLSearchParams();
    formData.append("target", target);
    formData.append("message", message);
    formData.append("delay", "1-3");
    formData.append("countryCode", "62");
    formData.append("connectOnly", "false");
    const res = await fetch("https://api.fonnte.com/send", {
      method: "POST",
      headers: {
        "Authorization": settings.fonnteToken,
        "Content-Type": "application/x-www-form-urlencoded"
      },
      body: formData
    });
    const result = await res.json();
    const ok = result.status !== false && result.Status !== false;
    if (!ok) {
      return { error: result.reason || "unknown error", detail: result };
    }
    return { ok: true, requestid: result.requestid };
  } catch (e) {
    return { error: e.message };
  }
};

export const formatRupiah = (num) => "Rp " + (parseInt(num) || 0).toLocaleString("id-ID");
