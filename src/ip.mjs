import 'isomorphic-fetch';

const ipProvider = 'https://ipinfo.io/ip';

/**
 * Determines the ip address calling the ip provider url
 * @return {Promise<string>}
 */
export async function determineIp()
{
    const resp = await fetch(ipProvider);
    if (!resp.ok) {
        throw new Error('Unexpected status code');
    }

    const ip = await resp.text();

    return ip.trim();
}