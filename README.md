# hana-mta-deployer

Streamline SAP HANA deployment with a single command. Automatically generate an MTA deployment file, update your package lock, build, and deploy to Cloud Foundry with hana-mta-deployer.

## Installation

**To install the HMD Deploy Tool, run the following command:**

    npm install -g hmd-deploy

## Usage

Check Dependencies

To check if all the dependencies required for deploying your application are installed, run the following command:

     hmd -check

## Deploy Application

To deploy your application, run the following command:

    hmd deploy [--secure]

The **- -secure** flag is optional and can be used if your application requires authentication using XSUAA, use the **- -secure** flag when running the deploy command. This will perform the following steps:

- Add the hana and xsuaa services to your MTA.
- Add the application router to your MTA.
- Add xs-security.json.
- Update the mta.yaml file to include the security section.
- Update the mta.yaml file to include the routes section for the.
- application router.
- Update the package.json file to include the required dependencies.
- Build the MTA.
- Deploy the MTA to Cloud Foundry.

## Check Version

To check the version of the HMD Deploy Tool that is installed, run the following command:

    hmd --version

## License

The HMD Deploy Tool is licensed under the MIT License. See the [LICENSE](https://github.com/CrimsonMckay/hana-mta-deployer/blob/main/LICENSE.md) file for more information.
