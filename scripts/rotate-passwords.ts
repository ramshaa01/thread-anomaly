import 'dotenv/config';
import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

// One-off credential rotation for the seeded admin/customer accounts.
// New passwords are NEVER hardcoded here — supply them via env vars
// (NEW_ADMIN_PASSWORD / NEW_CUSTOMER_PASSWORD) or, in an interactive
// terminal, this prompts for them with masked input. Nothing typed or
// generated here is ever written to a file or printed back out.

const UserSchema = new mongoose.Schema({
  email: { type: String, unique: true },
  password: String,
  role: String,
}, { timestamps: true });
const User = mongoose.models.User || mongoose.model('User', UserSchema);

const OLD_DEFAULTS = new Set(['admin123', 'customer123', 'password']);

const ACCOUNTS = [
  { email: 'admin@threadanomaly.com', envVar: 'NEW_ADMIN_PASSWORD', label: 'admin' },
  { email: 'customer@threadanomaly.com', envVar: 'NEW_CUSTOMER_PASSWORD', label: 'customer' },
];

const CTRL_D = String.fromCharCode(4); // Ctrl-D / EOF
const CTRL_C = String.fromCharCode(3); // Ctrl-C
const DEL = String.fromCharCode(127); // Backspace on most terminals

const ENTER_CODES = new Set(['\n', '\r', CTRL_D]);
const INTERRUPT_CODE = CTRL_C;
const BACKSPACE_CODES = new Set([DEL, '\b']);

function readMasked(promptText: string): Promise<string> {
  return new Promise((resolve, reject) => {
    if (!process.stdin.isTTY) {
      reject(new Error('no interactive terminal available'));
      return;
    }
    process.stdout.write(promptText);
    const stdin = process.stdin;
    stdin.resume();
    stdin.setRawMode(true);
    stdin.setEncoding('utf8');
    let value = '';
    const onData = (char: string) => {
      if (ENTER_CODES.has(char)) {
        stdin.setRawMode(false);
        stdin.pause();
        stdin.removeListener('data', onData);
        process.stdout.write('\n');
        resolve(value);
      } else if (char === INTERRUPT_CODE) {
        process.stdout.write('\n');
        process.exit(1);
      } else if (BACKSPACE_CODES.has(char)) {
        if (value.length > 0) {
          value = value.slice(0, -1);
          process.stdout.write('\b \b');
        }
      } else {
        value += char;
        process.stdout.write('*');
      }
    };
    stdin.on('data', onData);
  });
}

function validate(label: string, password: string, other: string): string | null {
  if (!password || password.length < 10) return `${label} password must be at least 10 characters.`;
  if (OLD_DEFAULTS.has(password.toLowerCase())) return `${label} password can't be one of the old default passwords.`;
  if (password === other) return `admin and customer passwords must be different (this was the original bug).`;
  return null;
}

async function getPassword(account: typeof ACCOUNTS[number]): Promise<string> {
  const fromEnv = process.env[account.envVar];
  if (fromEnv) return fromEnv;

  const first = await readMasked(`New ${account.label} password: `);
  const second = await readMasked(`Confirm ${account.label} password: `);
  if (first !== second) {
    throw new Error(`${account.label} password entries did not match.`);
  }
  return first;
}

async function main() {
  const uri = process.env.MONGODB_URI;
  if (!uri) throw new Error('MONGODB_URI not set (expected in .env).');

  console.log(`\nRotating passwords against: ${uri.replace(/\/\/.*@/, '//<credentials-hidden>@')}\n`);

  // Sequential, not Promise.all — two concurrent masked prompts would both
  // attach listeners to the same stdin stream and interleave keystrokes.
  let adminPassword: string;
  let customerPassword: string;
  try {
    adminPassword = await getPassword(ACCOUNTS[0]);
    customerPassword = await getPassword(ACCOUNTS[1]);
  } catch (err: any) {
    if (err.message.includes('no interactive terminal available')) {
      throw new Error(
        `NEW_ADMIN_PASSWORD / NEW_CUSTOMER_PASSWORD are not set and no interactive terminal is available.\n` +
        `Set both as env vars, or run this in a real terminal so it can prompt you.`
      );
    }
    throw err;
  }

  const adminErr = validate('admin', adminPassword, customerPassword);
  if (adminErr) throw new Error(adminErr);
  const customerErr = validate('customer', customerPassword, adminPassword);
  if (customerErr) throw new Error(customerErr);

  await mongoose.connect(uri);

  const adminHash = await bcrypt.hash(adminPassword, 10);
  const customerHash = await bcrypt.hash(customerPassword, 10);

  const adminResult = await User.findOneAndUpdate(
    { email: 'admin@threadanomaly.com' },
    { password: adminHash },
    {},
  );
  const customerResult = await User.findOneAndUpdate(
    { email: 'customer@threadanomaly.com' },
    { password: customerHash },
    {},
  );

  if (!adminResult) throw new Error('admin@threadanomaly.com not found — no update made.');
  if (!customerResult) throw new Error('customer@threadanomaly.com not found — no update made.');

  console.log('✅ admin@threadanomaly.com password rotated.');
  console.log('✅ customer@threadanomaly.com password rotated.');
  console.log('\nNothing above this line contains the new passwords — they were never logged.');

  await mongoose.disconnect();
  process.exit(0);
}

main().catch((err) => {
  console.error(`\n❌ Rotation failed: ${err.message}`);
  process.exit(1);
});
