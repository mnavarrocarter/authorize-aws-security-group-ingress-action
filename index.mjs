import core from '@actions/core'
import AWS from './src/aws.mjs';
import { determineIp } from './src/ip.mjs'
import * as state from './src/state.mjs';
import * as io from './src/io.mjs';

/**
 * Runs the main action
 *
 * It attempts to determine the ip if none provided, and then proceeds to create the relevant inbound rule
 * in the specified security group.
 *
 * @returns {Promise<void>}
 */
async function main() {
  try {
    let ip = io.getIp();

    if (ip === '' || !ip) {
      core.info(`Determining the ip address...`);
      ip = await determineIp();
    }

    io.setIp(ip);
    state.saveIp(ip);
    core.info(`Ip address to use: ${ip}`);

    const client = new AWS({
      accessKeyId: io.getAwsAccessKeyId(),
      secretAccessKey: io.getAwsSecretAccessKey(),
      region: io.getAwsRegion(),
    });

    const ruleId = await client.authorizeIngressRule(
        io.getAwsSecurityGroupId(),
        ip,
        io.getProtocol(),
        io.getPortNumber(),
    );

    core.info(`Inbound rule created successfully: ${ruleId}`);

    // Save the rule to the output and the state
    io.setRuleId(ruleId);
    state.saveRuleId(ruleId);

  } catch (error) {
    core.setFailed(error.message);
  }
}

/**
 * Cleans up after the action
 *
 * This runs after the job ends and removes the created security group rule from AWS.
 *
 * @returns {Promise<void>}
 */
async function cleanup() {
  const ruleId = state.getRuleId();
  if (!ruleId) {
    core.info('Nothing to clean because rule was not created');
    return;
  }

  core.info('Removing created inbound rule');

  const ip = state.getIp();

  const client = new AWS({
    accessKeyId: io.getAwsAccessKeyId(),
    secretAccessKey: io.getAwsSecretAccessKey(),
    region: io.getAwsRegion(),
  });

  await client.revokeIngressRule(
      io.getAwsSecurityGroupId(),
      ip,
      io.getProtocol(),
      io.getPortNumber(),
  );

  core.info('Inbound rule removed successfully');
}

// Self executing async function that runs everything
(async () => {
  if (state.IsPost) {
    await cleanup();
  } else {
    await main();
  }
})();