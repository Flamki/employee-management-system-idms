const INTER_FONT_URLS = [
  "/sde-kit/Inter/static/Inter_18pt-Regular.ttf?v=20260219",
  "/sde-kit/Inter/static/Inter_18pt-Medium.ttf?v=20260219",
  "/sde-kit/Inter/static/Inter_18pt-SemiBold.ttf?v=20260219",
  "/sde-kit/Inter/static/Inter_18pt-Bold.ttf?v=20260219",
];

async function checkUrl(url) {
  try {
    const res = await fetch(url, {
      method: "GET",
      cache: "no-store",
      credentials: "same-origin",
    });

    if (!res.ok) {
      console.error("[FontCheck] Inter request failed", {
        url,
        status: res.status,
        statusText: res.statusText || "Unknown",
      });
      return false;
    }

    return true;
  } catch (error) {
    console.error("[FontCheck] Inter request error", {
      url,
      message: error?.message || String(error),
    });
    return false;
  }
}

export async function runInterFontDiagnostics() {
  const checks = await Promise.all(INTER_FONT_URLS.map((url) => checkUrl(url)));
  const allRequestsOk = checks.every(Boolean);

  try {
    await document.fonts.load('400 16px "Inter"');
    const interLoaded =
      document.fonts.check('400 16px "Inter"') &&
      document.fonts.check('600 16px "Inter"');

    if (!interLoaded) {
      console.error("[FontCheck] Inter family is not active after load check", {
        family: "Inter",
      });
      return;
    }
  } catch (error) {
    console.error("[FontCheck] Inter load API failed", {
      message: error?.message || String(error),
    });
    return;
  }

  if (!allRequestsOk) {
    console.error("[FontCheck] Inter family resolved, but one or more font files failed to fetch.");
  }
}

