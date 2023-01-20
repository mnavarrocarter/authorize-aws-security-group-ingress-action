import core from "@actions/core";

const isPostKey = 'isPost';
const ruleIdKey = 'ruleId';
const ipKey = 'ip';

export const IsPost = core.getState(isPostKey) === 'true';

/**
 * @param {String} ruleId
 */
export function saveRuleId(ruleId) {
    core.saveState(ruleIdKey, ruleId);
}

/**
 * @return {string}
 */
export function getRuleId() {
    return core.getState(ruleIdKey);
}

/**
 * Saves the ip address in the state to avoid recomputing it in cleanup
 * @param {String} ip
 */
export function saveIp(ip) {
    core.saveState(ipKey, ip);
}

/**
 * Returns the save ip address
 * @return {string}
 */
export function getIp() {
    return core.getState(ipKey);
}

// We publish something in the state to indicate next run of the entrypoint is the cleanup.
if (!IsPost) {
    core.saveState(isPostKey, 'true');
}