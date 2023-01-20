import core from "@actions/core";

const validProtocols = ['tcp', 'udp'];
const maxPort = 65535;

const ipKey = 'ip';
const protocolKey = 'protocol';
const portKey = 'port';
const awsAccessKeyIdKey = 'aws-access-key-id';
const awsSecretAccessKeyKey = 'aws-secret-access-key';
const awsSecurityGroupIdKey = 'aws-security-group-id';
const awsRegionKey = 'aws-region';
const ruleIdKey = 'aws-security-group-rule-id';

/**
 * Returns the ip address
 * @return {String} The ip
 */
export function getIp() {
    return core.getInput(ipKey);
}

/**
 * @param {String} ip
 */
export function setIp(ip) {
    core.setOutput(ipKey, ip);
}

/**
 * @return {string}
 */
export function getAwsAccessKeyId() {
    return core.getInput(awsAccessKeyIdKey);
}

/**
 * @return {string}
 */
export function getAwsSecretAccessKey() {
    return core.getInput(awsSecretAccessKeyKey);
}

/**
 * @return {string}
 */
export function getAwsRegion() {
    return core.getInput(awsRegionKey);
}

/**
 * @return {string}
 */
export function getAwsSecurityGroupId() {
    return core.getInput(awsSecurityGroupIdKey);
}

/**
 * @return {'tcp'|'udp'}
 */
export function getProtocol() {
    const protocol = core.getInput(protocolKey);
    if (!validProtocols.includes(protocol)) {
        throw new Error(`Invalid protocol "${protocol}" provided`);
    }
}

/**
 * @return {Number}
 */
export function getPortNumber() {
    const portNumber = Number.parseInt(core.getInput(portKey));
    if (isNaN(portNumber) || portNumber <= 0 || portNumber > maxPort) {
        throw new Error('Invalid port number');
    }

    return portNumber;
}

/**
 * Stores the rule id in the output
 * @param {string} ruleId
 */
export function setRuleId(ruleId) {
    core.setOutput(ruleIdKey, ruleId);
}