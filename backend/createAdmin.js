// Creates an admin account (or resets an existing admin's password).
// Usage: npm run create-admin
//        npm run create-admin -- --email you@example.com --name "Your Name"
//        npm run create-admin -- --email you@example.com --reset
// The password is always asked for interactively, so it never ends up in
// your shell history.
const readline = require("readline");
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const dotenv = require("dotenv");
const Admin = require("./models/admin");

dotenv.config();
const DATABASE_URL =
  process.env.DATABASE_URL || "mongodb://127.0.0.1:27017/MCQ";
const MIN_PASSWORD_LENGTH = 8;

const arg = (name) => {
  const i = process.argv.indexOf(`--${name}`);
  return i !== -1 ? process.argv[i + 1] : undefined;
};

// Lines are queued as they arrive, so input typed or pasted ahead of a prompt
// isn't lost. While muted (password prompts) nothing typed is echoed.
let rl;
let muted = false;
const queued = [];
let waiting = null;

const ask = (question, { hidden = false } = {}) => {
  if (!rl) {
    rl = readline.createInterface({ input: process.stdin, output: process.stdout });
    const write = rl._writeToOutput.bind(rl);
    rl._writeToOutput = (text) => {
      if (!muted) write(text);
    };
    rl.on("line", (line) => {
      if (waiting) waiting.resolve(line);
      else queued.push(line);
    });
    rl.on("close", () => waiting?.reject(new Error("Input ended before all answers were given.")));
  }

  process.stdout.write(question);
  muted = hidden;
  return new Promise((resolve, reject) => {
    const finish = (line) => {
      waiting = null;
      if (hidden) {
        muted = false;
        process.stdout.write("\n");
      }
      resolve(line.trim());
    };
    if (queued.length) finish(queued.shift());
    else waiting = { resolve: finish, reject };
  });
};

const main = async () => {
  const reset = process.argv.includes("--reset");
  const email = (arg("email") || (await ask("Email: "))).toLowerCase();
  if (!/^\S+@\S+\.\S+$/.test(email)) throw new Error("Enter a valid email.");

  await mongoose.connect(DATABASE_URL);
  const existing = await Admin.findOne({ email });

  if (existing && !reset) {
    throw new Error(
      `An admin with ${email} already exists. Add --reset to change its password.`
    );
  }
  if (!existing && reset) throw new Error(`No admin with ${email} exists.`);

  const name = existing
    ? existing.name
    : arg("name") || (await ask("Name: ")) || email.split("@")[0];

  const password = await ask("Password: ", { hidden: true });
  if (password.length < MIN_PASSWORD_LENGTH) {
    throw new Error(`Password must be at least ${MIN_PASSWORD_LENGTH} characters.`);
  }
  if ((await ask("Confirm password: ", { hidden: true })) !== password) {
    throw new Error("Passwords don't match.");
  }

  const passwordHash = await bcrypt.hash(password, 12);
  if (existing) {
    existing.passwordHash = passwordHash;
    await existing.save();
    console.log(`Password updated for ${email}.`);
  } else {
    await Admin.create({ name, email, passwordHash });
    console.log(`Admin ${email} created. Sign in at /admin/login.`);
  }
};

main()
  .catch((error) => {
    console.error(error.message);
    process.exitCode = 1;
  })
  .finally(() => {
    rl?.close();
    mongoose.disconnect();
  });
