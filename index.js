#!/usr/bin/env node

const { execSync } = require("child_process");
const replaceInFile = require("replace-in-file");
const prompts = require("prompts");

async function checkLoggedIn() {
  let loggedIn = false;

  try {
    const output = execSync("cf target").toString();
    loggedIn = output.includes("API endpoint") && output.includes("user");
  } catch (error) {
    // Ignore errors from `cf target` command
  }

  if (!loggedIn) {
    console.log("You are not logged into Cloud Foundry.");
    const { shouldLogin } = await prompts({
      type: "confirm",
      name: "shouldLogin",
      message: "Would you like to login to Cloud Foundry now?",
      initial: true,
    });

    if (shouldLogin) {
      console.log("Please enter your Cloud Foundry credentials:");
      execSync("cf login", { stdio: "inherit" });
      console.log("Successfully logged in to Cloud Foundry.");
    } else {
      console.log(
        "Please login to Cloud Foundry before running the deploy command."
      );
      process.exit(1);
    }
  }
}

async function deploy(secure = false) {
  await checkLoggedIn();

  const commands = secure
    ? [
        "cds add hana --for production",
        "cds add xsuaa --for production",
        "cds add mta",
        "cds add approuter --for production",
        "npm update --package-lock-only",
        "cds build --production",
        "mbt build -t gen --mtar mta.tar",
      ]
    : [
        "cds add hana --for production",
        "cds add mta",
        () => {
          try {
            const results = replaceInFile.sync({
              files: "mta.yaml",
              from: /path:\s*gen\/db/,
              to: "path: db",
            });
          } catch (error) {
            console.error("Error occurred:", error);
          }
        },
        "npm update --package-lock-only",
        "cds build --production",
        "mbt build -t gen --mtar mta.tar",
      ];

  commands.forEach((command) => {
    if (typeof command === "function") {
      command();
    } else {
      console.log(`Running command: ${command}`);
      execSync(command, { stdio: "inherit" });
    }
  });

  const { shouldDeploy } = await prompts({
    type: "confirm",
    name: "shouldDeploy",
    message: "Would you like to deploy your application now?",
    initial: true,
  });

  if (shouldDeploy) {
    execSync("cf deploy gen/mta.tar", { stdio: "inherit" });
    console.log("Application deployed successfully.");
  } else {
    console.log("Skipping deployment.");
  }
}

if (process.argv[2] === "deploy") {
  if (process.argv[3] === "--secure") {
    deploy(true);
  } else {
    deploy();
  }
} else {
  console.log(
    "Unknown command. Please use 'hmd deploy' to deploy your project."
  );
}
