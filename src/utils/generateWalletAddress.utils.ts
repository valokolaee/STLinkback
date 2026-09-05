// utils/generateWalletAddress.ts

const PROJECT_CODE = "ST";
const ACCOUNT_LENGTH = 10;
const MODULUS = 10 ** ACCOUNT_LENGTH; // 10,000,000,000

// باید نسبت به MODULUS (که فقط عوامل ۲ و ۵ داره) coprime باشه
// یعنی نه زوج باشه، نه مضرب ۵ — یه عدد بزرگ و دلخواه، ولی بعد از انتخاب دیگه تغییرش نده
const MULTIPLIER = 4_999_999_937n; // یه عدد اول بزرگ، مثال
const MULTIPLIER_INVERSE = modInverse(MULTIPLIER, BigInt(MODULUS)); // برای برگشت (اختیاری)

function toNumeric(s: string): string {
    return s
        .toUpperCase()
        .split("")
        .map((ch) => (/[0-9]/.test(ch) ? ch : (ch.charCodeAt(0) - 55).toString()))
        .join("");
}

function mod97(numStr: string): number {
    let remainder = 0;
    for (const digit of numStr) {
        remainder = (remainder * 10 + parseInt(digit, 10)) % 97;
    }
    return remainder;
}

// محاسبه معکوس ضربی (برای برگشت از آدرس به id — اختیاریه، اگه نیاز نداری حذفش کن)
function modInverse(a: bigint, m: bigint): bigint {
    let [old_r, r] = [a, m];
    let [old_s, s] = [1n, 0n];
    while (r !== 0n) {
        const q = old_r / r;
        [old_r, r] = [r, old_r - q * r];
        [old_s, s] = [s, old_s - q * s];
    }
    return ((old_s % m) + m) % m;
}

/** id واقعی رو به یه عدد به‌ظاهر تصادفی (ولی یکتا) تبدیل می‌کنه */
function obfuscateId(id: number): string {
    const obfuscated = (BigInt(id) * MULTIPLIER) % BigInt(MODULUS);
    return obfuscated.toString().padStart(ACCOUNT_LENGTH, "0");
}

/** برگشت از عدد مبهم‌شده به id واقعی (فقط برای مصارف داخلی خودت) */
function deobfuscateId(obfuscatedStr: string): number {
    const obfuscated = BigInt(obfuscatedStr);
    const original = (obfuscated * MULTIPLIER_INVERSE) % BigInt(MODULUS);
    return Number(original);
}

export function generateWalletAddress(id: number): string {
    const accountNumber = obfuscateId(id);

    const rearranged = accountNumber + PROJECT_CODE + "00";
    const numeric = toNumeric(rearranged);
    const remainder = mod97(numeric);
    const checkDigits = String(98 - remainder).padStart(2, "0");

    return `${PROJECT_CODE}${checkDigits}${accountNumber}`;
}

export function isValidWalletAddress(address: string): boolean {
    if (!address.startsWith(PROJECT_CODE)) return false;
    const checkDigits = address.slice(PROJECT_CODE.length, PROJECT_CODE.length + 2);
    const accountNumber = address.slice(PROJECT_CODE.length + 2);
    if (accountNumber.length !== ACCOUNT_LENGTH) return false;
    const rearranged = accountNumber + PROJECT_CODE + checkDigits;
    return mod97(toNumeric(rearranged)) === 1;
}

/** فقط داخل خودت استفاده کن، برای پیدا کردن id از روی آدرس (مثلا برای دیباگ یا ادمین‌پنل) */
export function extractWalletId(address: string): number | null {
    if (!isValidWalletAddress(address)) return null;
    const accountNumber = address.slice(PROJECT_CODE.length + 2);
    return deobfuscateId(accountNumber);
}