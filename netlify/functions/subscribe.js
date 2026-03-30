exports.handler = async function(event, context) {
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: 'Method Not Allowed' };
  }

  try {
    const { email, source, score, band, who } = JSON.parse(event.body);

    if (!email || !email.includes('@')) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: 'Invalid email' })
      };
    }

    const MAILERLITE_API_KEY  = process.env.MAILERLITE_API_KEY;
    const GROUP_7SIGNS        = process.env.MAILERLITE_GROUP_ID;
    const GROUP_FATHER        = process.env.MAILERLITE_GROUP_FATHER;
    const GROUP_PARTNER       = process.env.MAILERLITE_GROUP_PARTNER;

    // Determine which group to add subscriber to
    let groupId = GROUP_7SIGNS; // default — 7 Signs lead magnet

    if (who === 'father')  groupId = GROUP_FATHER;
    if (who === 'partner') groupId = GROUP_PARTNER;

    // Build payload
    const payload = {
      email: email,
      fields: {
        assessment_score: score || null,
        assessment_band:  band  || null,
        assessment_who:   who   || null,
        source:           source || (who ? 'assessment' : '7signs')
      }
    };

    if (groupId) {
      payload.groups = [groupId];
    }

    const response = await fetch('https://connect.mailerlite.com/api/subscribers', {
      method: 'POST',
      headers: {
        'Content-Type':  'application/json',
        'Authorization': `Bearer ${MAILERLITE_API_KEY}`,
        'Accept':        'application/json'
      },
      body: JSON.stringify(payload)
    });

    const data = await response.json();
    console.log('MailerLite response:', data);

    return {
      statusCode: 200,
      body: JSON.stringify({ success: true })
    };

  } catch (error) {
    console.error('Function error:', error);
    return {
      statusCode: 200,
      body: JSON.stringify({ success: true })
    };
  }
};
