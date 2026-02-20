const TRANSLATION_MAP: Record<string, string> = {
  "Нэвтрэх": "Login",
  "Бүртгүүлэх": "Register",
  "Нэр": "Username",
  "Имэйл": "Email",
  "Нууц үг": "Password",
  "Нууц үг давтах": "Confirm password",
  "Нэр эсвэл имэйл": "Username or email",
  "Бүртгүүлж амжаагүй юу?": "Don't have an account yet?",
  "Бүртгэлтэй юу?": "Already have an account?",
  "Зөв нэр оруулна уу.": "Please enter a valid username.",
  "Зөв имэйл оруулна уу.": "Please enter a valid email.",
  "Нэвтэрч чадсангүй. Та нууц үгээ нягтлаад дахин оролдоно уу.": "Login failed. Please verify your password and try again.",
  "Урт нь 3 тэмдэгтээс бага байх ёсгүй.": "Username must be at least 3 characters.",
  "Урт нь 20 тэмдэгтээс хэтрэх ёсгүй.": "Username must be at most 20 characters.",
  "Зөвхөн латин үсэг, тоо, доогуур зураас, дундуур зураас зөвшөөрөгдөнө.": "Only latin letters, numbers, underscore and dash are allowed.",
  "Энэ нэр бүртгэлтэй байна.": "This username is already registered.",
  "Имэйлийн урт 100 тэмдэгтээс хэтрэх ёсгүй.": "Email must be at most 100 characters.",
  "Имэйлийг таньж чадсангүй. Зөв имэйл оруулна уу.": "Invalid email format. Please enter a valid email.",
  "Энэ имэйл хаяг бүртгэлтэй байна.": "This email is already registered.",
  "Давтан оруулсан нууц үг ижилхэн биш байна.": "Password confirmation does not match.",
  "Таны нууц үг 6-30 тэмдэгтийн урттай байх ёстой.": "Password must be 6-30 characters long.",
  "Required.": "Required.",
  "Login required": "Login required",
  "No one solved yet.": "No one solved yet.",
  "Correct": "Correct",
  "Incorrect": "Incorrect",
};

export function toEnglish(input: string): string {
  const trimmed = input.trim();
  if (!trimmed) {
    return "";
  }
  return TRANSLATION_MAP[trimmed] ?? trimmed;
}
