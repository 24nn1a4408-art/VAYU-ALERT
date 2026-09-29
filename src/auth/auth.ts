export interface AuthUser {
  id: string;
  name: string;
  email: string;
  createdAt: string;
  role: 'citizen' | 'disaster_mgmt';
}

interface StoredAccount extends AuthUser {
  passwordHash: string;
}

const ACCOUNTS_KEY = 'vayu_alert_accounts_v1';
const SESSION_KEY = 'vayu_alert_session_v1';

const DEMO_ACCOUNT: StoredAccount = {
  id: 'demo-admin',
  name: 'VAYU Alert Admin',
  email: 'admin@vayualert.com',
  passwordHash: 'Vayu@123',
  createdAt: new Date().toISOString(),
  role: 'disaster_mgmt',
};

function readAccounts(): StoredAccount[] {
  try {
    const raw = localStorage.getItem(ACCOUNTS_KEY);
    if (!raw) {
      localStorage.setItem(ACCOUNTS_KEY, JSON.stringify([DEMO_ACCOUNT]));
      return [DEMO_ACCOUNT];
    }
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [DEMO_ACCOUNT];
    return parsed.map((account) =>
      account.email?.toLowerCase() === DEMO_ACCOUNT.email.toLowerCase()
        ? { ...account, role: 'disaster_mgmt' }
        : { ...account, role: account.role || 'citizen' }
    );
  } catch {
    return [DEMO_ACCOUNT];
  }
}

function writeAccounts(accounts: StoredAccount[]) {
  localStorage.setItem(ACCOUNTS_KEY, JSON.stringify(accounts));
}

export function getSession(): AuthUser | null {
  try {
    const raw = localStorage.getItem(SESSION_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

export function login(email: string, password: string): AuthUser {
  const normalizedEmail = email.trim().toLowerCase();
  const account = readAccounts().find((item) => item.email.toLowerCase() === normalizedEmail);
  if (!account || account.passwordHash !== password) {
    throw new Error('Invalid email or password.');
  }

  const user: AuthUser = {
    id: account.id,
    name: account.name,
    email: account.email,
    createdAt: account.createdAt,
    role: account.role || 'citizen',
  };
  localStorage.setItem(SESSION_KEY, JSON.stringify(user));
  return user;
}

export function signup(name: string, email: string, password: string): AuthUser {
  const normalizedEmail = email.trim().toLowerCase();
  const accounts = readAccounts();

  if (accounts.some((item) => item.email.toLowerCase() === normalizedEmail)) {
    throw new Error('An account with this email already exists.');
  }

  const account: StoredAccount = {
    id: `user-${Date.now()}`,
    name: name.trim(),
    email: normalizedEmail,
    passwordHash: password,
    createdAt: new Date().toISOString(),
    role: 'citizen',
  };

  accounts.push(account);
  writeAccounts(accounts);
  return login(normalizedEmail, password);
}

export function resetPassword(email: string, newPassword: string) {
  const normalizedEmail = email.trim().toLowerCase();
  const accounts = readAccounts();
  const index = accounts.findIndex((item) => item.email.toLowerCase() === normalizedEmail);

  if (index === -1) {
    throw new Error('No account was found with that email.');
  }

  accounts[index] = { ...accounts[index], passwordHash: newPassword };
  writeAccounts(accounts);
}

export function logout() {
  localStorage.removeItem(SESSION_KEY);
}

export const DEMO_CREDENTIALS = {
  email: 'admin@vayualert.com',
  password: 'Vayu@123',
};
