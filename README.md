# AWS Security Group Authorize Ingress Rule

This action allows you to authorize an ingress rule for an AWS Security Group temporarily using AWS. 
The rule is deleted after the job is done. The CIDR of the rule is based on the ip of the machine running the
job.

## Why this?

Because GitHub Action runners can potentially have an ip inside one of 2500+ CIDR that [Github publishes][meta].
It is impossible to maintain these CIDR in AWS in an efficient way because prefix lists only allow 1000 elements
(but you can only batch updated in hundreds) and because security group rules can only be created one
after the other. Plus, is not very secure as other services may be running from those Azure CIDRs.

You can find more info on [this thread][thread].

## Using this Action

### Quick Start

```yaml
- name: Authorize SSH Connections
  uses: mnavarrocarter/authorize-aws-security-group-ingress-action@v1
  with:
    aws-access-key-id: ${{ secrets.AWS_ACCESS_KEY_ID }}
    aws-secret-access-key: ${{ secrets.AWS_SECRET_ACCESS_KEY }}
    aws-region: 'eu-west-2' # Your AWS region
    aws-security-group-id: ${{ secrets.AWS_SSH_SECURITY_GROUP_ID }}
    protocol: 'tcp'
    port: ${{ secrets.SSH_PORT }}
- name: Runs a command inside the instance
  uses: appleboy/ssh-action@v0.1.7
  with:
    host: ${{ secrets.SSH_HOST }}
    username: ${{ secrets.SSH_USERNAME }}
    password: ${{ secrets.SSH_PASSWORD }}
    port: ${{ secrets.SSH_PORT }}
    script: |
      echo "Im inside the EC2 instance!"
```

### Requirements

Make sure your AWS credentials have two essential permissions:
- [`ec2:AuthorizeSecurityGroupIngress`][authorize]
- [`ec2:RevokeSecurityGroupIngress`][revoke]

Optionally, if you want to be extra safe, allow access only to the specific AWS security group you want to modify
with the following resource-level permission:
- `arn:aws:ec2:$region:$account:security-group/$security-group-id`

### Configuration Reference

TBW

## Development

The development environment is powered by `docker` + `docker-compose`. Simply run `make` to boot up a development
container. And then `make pr` to audit, lint, test and build the code.

[thread]: https://github.com/orgs/community/discussions/26719
[meta]: https://api.github.com/meta
[authorize]: https://iam.cloudonaut.io/reference/ec2/AuthorizeSecurityGroupIngress.html
[revoke]: https://iam.cloudonaut.io/reference/ec2/RevokeSecurityGroupIngress.html