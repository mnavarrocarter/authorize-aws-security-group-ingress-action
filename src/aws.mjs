import { EC2Client, AuthorizeSecurityGroupIngressCommand, RevokeSecurityGroupIngressCommand } from '@aws-sdk/client-ec2';

export default class AWS {
  constructor({ accessKeyId, secretAccessKey, region }) {
    this.client = new EC2Client({
      apiVersion: "2016-11-15",
      region: region,
      credentials: {
        accessKeyId: accessKeyId,
        secretAccessKey: secretAccessKey
      }
    });
  }

  /**
   * Creates a new security group rule for the specified address
   *
   * @param {String} securityGroupId
   * @param {String} ip
   * @param {String} protocol
   * @param {Number} port
   * @return {Promise<String>} The id of the created security group
   */
  async authorizeIngressRule(securityGroupId, ip, protocol, port) {
    const cmd = new AuthorizeSecurityGroupIngressCommand({
      GroupId: securityGroupId,
      CidrIp: ip + '/32',
      FromPort: port,
      ToPort: port,
      IpProtocol: protocol,
    });

    const result = await this.client.send(cmd);

    // A Single rule should have been added
    return result.SecurityGroupRules[0].SecurityGroupRuleId;
  }

  /**
   * Creates a new security group rule for the specified address
   *
   * @param {String} securityGroupId
   * @param {String} ip
   * @param {String} protocol
   * @param {Number} port
   * @return {Promise<String>} The id of the created security group
   */
  async revokeIngressRule(securityGroupId, ip, protocol, port) {
    const cmd = new RevokeSecurityGroupIngressCommand({
      GroupId: securityGroupId,
      CidrIp: ip + '/32',
      FromPort: port,
      ToPort: port,
      IpProtocol: protocol
    });

    await this.client.send(cmd);
  }
}