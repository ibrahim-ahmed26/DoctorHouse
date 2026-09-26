import { getAdminAuth } from "@/lib/firebase/admin";
import type { LeadInput } from "@/lib/types";

// Sends one email per dashboard user. Sent individually (not as one call
// with multiple recipients) because Resend's unverified sender only allows
// delivery to the address you signed up with — sending them separately means
// that one still goes through during testing, instead of the whole request
// failing because of the other recipients.
export async function notifyAdminsOfNewLead(lead: LeadInput) {
  if (!process.env.RESEND_API_KEY) {
    console.warn("RESEND_API_KEY not set — skipping lead notification email.");
    return;
  }

  const { users } = await getAdminAuth().listUsers(1000);
  const emails = users.map((u) => u.email).filter(Boolean) as string[];

  const from =
    process.env.RESEND_FROM_EMAIL ||
    "Doctor House Care <onboarding@resend.dev>";

  const html = `
    <div style="font-family:sans-serif;max-width:480px">
      <h2 style="margin:0 0 4px">Doctor House Has A new Notification</h2>
      <p style="color:#666;margin:0 0 20px">A new booking request just came in.</p>
      <table style="width:100%;border-collapse:collapse">
        <tr><td style="padding:8px 0;color:#666">Name</td><td style="padding:8px 0"><strong>${lead.name}</strong></td></tr>
        <tr><td style="padding:8px 0;color:#666">Phone</td><td style="padding:8px 0"><strong>${lead.phone}</strong></td></tr>
        <tr><td style="padding:8px 0;color:#666">Need</td><td style="padding:8px 0"><strong>${lead.need}</strong></td></tr>
        <tr><td style="padding:8px 0;color:#666">Language</td><td style="padding:8px 0"><strong>${lead.locale}</strong></td></tr>
      </table>
      <p style="margin-top:24px;font-size:13px;color:#999">Open the dashboard's Leads tab to follow up.</p>
    </div>
  `;

  await Promise.all(
    emails.map(async (to) => {
      try {
        const res = await fetch("https://api.resend.com/emails", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${process.env.RESEND_API_KEY}`,
          },
          body: JSON.stringify({
            from,
            to: [to],
            subject: "Doctor House Has A new Notification",
            html,
          }),
        });
        if (!res.ok) {
          console.error(`Failed to email ${to}:`, await res.text());
        }
      } catch (err) {
        console.error(`Error emailing ${to}:`, err);
      }
    }),
  );
}
