exports.handler = async function(event, context) {
  // Only allow POST
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: 'Method Not Allowed' };
  }

  try {
    const { email, source } = JSON.parse(event.body);

    if (!email || !email.includes('@')) {
      return { statusCode: 400, body: JSON.stringify({ error: 'Invalid email' }) };
    }

    const MAILERLITE_API_KEY = process.env.MAILERLITE_API_KEY || 'eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiJ9.eyJhdWQiOiI0IiwianRpIjoiNWI4ODExOGJlYTJkZGYyMTljZjc5NjkxMjFmOWRkN2QxNDAxY2FmMWRmOWRiMGFmMmExZDJkMjIwMWZjZDhmZDUyYjhmYjcwNWI5NWZiZDgiLCJpYXQiOjE3NzQ0NDU5NTMuMTI1NzUzLCJuYmYiOjE3NzQ0NDU5NTMuMTI1NzU2LCJleHAiOjQ5MzAxMTk1NTMuMTIxMDIsInN1YiI6IjIxNTE0MzMiLCJzY29wZXMiOltdfQ.pcGygj6uO-NkYgJ446BETAbW5vOr2We_WpXoZApE2cKKySRW2Sko8cX0YDjMIzjzWWCfl9B-JUw0-v0Cio2HgPVYADG0Uun2FCo0cmake-0GDWTUhCEl114KXYQ6x4dV_1P7sER-4dn-Rob8T9YiHDwz1tLbLV_X5ut6cfMrzx6le2sDwuL8GEZC3CJwPFGgzowL7pj_jh5O1ktLPzaAVWNz1sFZwQriV-bKQMxbT9mU-gLwsDRHsjv9GSa9fIuOBoTwuJQP6SUg52a6uHM3ZSjDBrA4OcTTD70q0yatE2ZQPsuux7zA2i9JexUCEl-OPJFVAX8UsIx6Zb66LPAnjvZcL60vsm0-CmHJfQXPn-E_0_4fRwTAEgdVkN0PATghSFU-ZtIFGO10tHKFQ2psmI4DUxJ5Jb6FY4kl9vcISEzddvKdBszs6gtcpU-Qj2dcZ9G8ZRHSKFhTrC3PwhVNSpX1l8r5L9LnbGGpn-P6B6a9_PD1ByvbFYIS6y_kJQ-TTLBQ4qa5ZtgZ3AFoqloiuItBsz8K1G8XfZHGXhpCvj-sYYNl-_HWjCoRYpERu6d8kHPgeW2KYrOPmyaCgjMN5H4b-UF6WHe0dQgsx626vJEDCUhdUY035AGWOj90nINcGJfetDXXg_eQ0s4Ynj9iKqMo4pmQugU7zjPlOmmUoaw';
    const MAILERLITE_GROUP_ID = process.env.MAILERLITE_GROUP_ID || '180474211653911871';

    const payload = {
      email: email,
      fields: {
        source: source || 'quiz-result'
      }
    };

    // Add to group if group ID is set
    if (MAILERLITE_GROUP_ID) {
      payload.groups = [MAILERLITE_GROUP_ID];
    }

    const response = await fetch('https://connect.mailerlite.com/api/subscribers', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${MAILERLITE_API_KEY}`,
        'Accept': 'application/json'
      },
      body: JSON.stringify(payload)
    });

    const data = await response.json();

    if (response.ok || response.status === 200 || response.status === 201) {
      return {
        statusCode: 200,
        body: JSON.stringify({ success: true })
      };
    } else {
      console.error('MailerLite error:', data);
      // Return success to user anyway - don't block on API errors
      return {
        statusCode: 200,
        body: JSON.stringify({ success: true })
      };
    }

  } catch (error) {
    console.error('Function error:', error);
    return {
      statusCode: 200,
      body: JSON.stringify({ success: true })
    };
  }
};
