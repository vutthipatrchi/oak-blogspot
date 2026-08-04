import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'

const resources = {
  th: {
    translation: {
      common: {
        notifications: 'การแจ้งเตือน',
        profile: 'โปรไฟล์',
        resetPassword: 'รีเซ็ตรหัสผ่าน',
        logout: 'ออกจากระบบ',
        login: 'เข้าสู่ระบบ',
        signup: 'สมัครสมาชิก',
        language: 'ภาษา',
        switchLanguage: 'เปลี่ยนภาษาเป็น {{language}}',
        thai: 'ไทย',
        english: 'อังกฤษ',
      },
      hero: {
        bookKicker: 'คลังบทความคัดสรร',
        bookTitleLine1: 'The',
        bookTitleLine2: 'Intellectual',
        bookAction: 'เปิดหนังสือ',
        openArticle: 'เปิดบทความ {{title}}',
        previousPage: 'หน้าก่อนหน้า',
        nextPage: 'หน้าถัดไป',
        pageRange: 'หน้า {{start}}-{{end}} / {{total}}',
        closeBook: 'ปิด',
        titleLine1: 'อ่านให้ทัน',
        titleLine2: 'คิดให้ลึก',
        titleLine3: 'มีแรงบันดาลใจ',
        subtitle: 'สำรวจชีวิต แนวคิด และผลงานของนักคิดกับนักเขียนที่น่าจดจำ',
        aboutLabel: '— เกี่ยวกับคลังบทความนี้',
        aboutTitle: 'นักคิดและนักเขียน',
        aboutParagraphOne:
          'พื้นที่รวบรวมเรื่องราวของนักคิดและนักเขียนที่เราชื่นชอบ ผ่านบทความ ประวัติ แนวคิด และผลงานที่น่าสนใจ',
        aboutParagraphTwo:
          'เปิดหนังสือเล่มกลางเพื่อไล่ดูภาพ และเลือกหน้าที่ต้องการเพื่ออ่านบทความฉบับเต็ม',
      },
      articles: {
        latest: 'บทความล่าสุด',
        categoryLabel: 'หมวดหมู่บทความ',
        categories: {
          Highlight: 'แนะนำ',
          Thinker: 'นักคิด',
          Writer: 'นักเขียน',
          Literature: 'วรรณกรรม',
        },
        searchLabel: 'ค้นหาบทความ',
        searchPlaceholder: 'ค้นหา',
        noMatching: 'ไม่พบบทความที่ตรงกัน',
        resultsStatus: 'พบ {{count}} บทความ',
        empty: 'ไม่พบบทความ',
        emptyWithQuery: 'ไม่พบบทความสำหรับ “{{query}}”',
        viewMore: 'ดูเพิ่มเติม',
      },
      footer: {
        getInTouch: 'ติดต่อเรา',
        adminPanel: 'แผงผู้ดูแล',
        homePage: 'หน้าแรก',
      },
      article: {
        sourceLabel: 'แหล่งข้อมูล',
        copyLink: 'คัดลอกลิงก์',
        copied: 'คัดลอกแล้ว',
        failed: 'คัดลอกไม่สำเร็จ',
        shareFacebook: 'แชร์ไปยัง Facebook',
        shareLinkedIn: 'แชร์ไปยัง LinkedIn',
        shareX: 'แชร์ไปยัง X',
        commentTitle: 'ความคิดเห็น',
        commentPlaceholder: 'คุณคิดเห็นอย่างไร?',
        send: 'ส่ง',
        author: 'ผู้เขียน',
        commentAuthTitle: 'สร้างบัญชีเพื่อดำเนินการต่อ',
        createAccount: 'สร้างบัญชี',
        alreadyHaveAccount: 'มีบัญชีอยู่แล้ว?',
        close: 'ปิด',
      },
      auth: {
        name: 'ชื่อ',
        fullName: 'ชื่อ-นามสกุล',
        username: 'ชื่อผู้ใช้',
        email: 'อีเมล',
        emailOrUsername: 'อีเมลหรือชื่อผู้ใช้',
        password: 'รหัสผ่าน',
        emailTaken: 'อีเมลนี้ถูกใช้งานแล้ว โปรดลองใช้อีเมลอื่น',
        registrationSuccess: 'สมัครสมาชิกสำเร็จ',
        verificationSent: 'กรุณาตรวจสอบอีเมลและกดลิงก์ยืนยันก่อนเข้าสู่ระบบ',
        continue: 'ดำเนินการต่อ',
        alreadyHaveAccount: 'มีบัญชีอยู่แล้ว?',
        dontHaveAccount: 'ยังไม่มีบัญชี?',
      },
      member: {
        settings: 'ตั้งค่าสมาชิก',
        profilePreview: 'ตัวอย่างรูปโปรไฟล์',
        uploadProfilePicture: 'อัปโหลดรูปโปรไฟล์',
        name: 'ชื่อ',
        username: 'ชื่อผู้ใช้',
        email: 'อีเมล',
        save: 'บันทึก',
        currentPassword: 'รหัสผ่านปัจจุบัน',
        newPassword: 'รหัสผ่านใหม่',
        confirmNewPassword: 'ยืนยันรหัสผ่านใหม่',
        profileSaved: 'บันทึกโปรไฟล์แล้ว',
        passwordsDoNotMatch: 'รหัสผ่านไม่ตรงกัน',
        passwordUpdated: 'อัปเดตรหัสผ่านแล้ว',
      },
      admin: {
        panel: 'แผงผู้ดูแล',
        loginSuccess: 'เข้าสู่ระบบสำเร็จ',
        welcome: 'ยินดีต้อนรับ Thompson P.',
        incorrectTitle: 'รหัสผ่านไม่ถูกต้องหรือไม่มีอีเมลนี้',
        incorrectHelp: 'โปรดลองใช้รหัสผ่านหรืออีเมลอื่น',
        closeError: 'ปิดข้อความผิดพลาด',
      },
    },
  },
  en: {
    translation: {
      common: {
        notifications: 'Notifications',
        profile: 'Profile',
        resetPassword: 'Reset password',
        logout: 'Log out',
        login: 'Log in',
        signup: 'Sign up',
        language: 'Language',
        switchLanguage: 'Switch language to {{language}}',
        thai: 'Thai',
        english: 'English',
      },
      hero: {
        bookKicker: 'A curated archive',
        bookTitleLine1: 'The',
        bookTitleLine2: 'Intellectual',
        bookAction: 'Open book',
        openArticle: 'Open article {{title}}',
        previousPage: 'Previous page',
        nextPage: 'Next page',
        pageRange: 'Page {{start}}-{{end}} / {{total}}',
        closeBook: 'Close',
        titleLine1: 'Stay',
        titleLine2: 'Informed,',
        titleLine3: 'Stay Inspired',
        subtitle: 'Discover remarkable thinkers and writers through their lives, ideas, and work.',
        aboutLabel: '— About this archive',
        aboutTitle: 'Thinkers & Writers',
        aboutParagraphOne:
          'A collection of stories about thinkers and writers we admire, told through essays, biographies, ideas, and notable works.',
        aboutParagraphTwo:
          'Open the book in the center to browse images, then choose a page to read the full article.',
      },
      articles: {
        latest: 'Latest articles',
        categoryLabel: 'Article category',
        categories: {
          Highlight: 'Highlight',
          Thinker: 'Thinker',
          Writer: 'Writer',
          Literature: 'Literature',
        },
        searchLabel: 'Search articles',
        searchPlaceholder: 'Search',
        noMatching: 'No matching articles',
        resultsStatus: '{{count}} article found',
        resultsStatus_other: '{{count}} articles found',
        empty: 'No articles found',
        emptyWithQuery: 'No articles found for “{{query}}”',
        viewMore: 'View more',
      },
      footer: {
        getInTouch: 'Get in touch',
        adminPanel: 'Admin panel',
        homePage: 'Home page',
      },
      article: {
        sourceLabel: 'Source',
        copyLink: 'Copy link',
        copied: 'Copied!',
        failed: 'Failed',
        shareFacebook: 'Share on Facebook',
        shareLinkedIn: 'Share on LinkedIn',
        shareX: 'Share on X',
        commentTitle: 'Comment',
        commentPlaceholder: 'What are your thoughts?',
        send: 'Send',
        author: 'Author',
        commentAuthTitle: 'Create an account to continue',
        createAccount: 'Create account',
        alreadyHaveAccount: 'Already have an account?',
        close: 'Close',
      },
      auth: {
        name: 'Name',
        fullName: 'Full name',
        username: 'Username',
        email: 'Email',
        emailOrUsername: 'Email or username',
        password: 'Password',
        emailTaken: 'Email is already taken. Please try another email.',
        registrationSuccess: 'Registration success',
        verificationSent: 'Check your email and confirm your account before signing in.',
        continue: 'Continue',
        alreadyHaveAccount: 'Already have an account?',
        dontHaveAccount: "Don't have an account?",
      },
      member: {
        settings: 'Member settings',
        profilePreview: 'Profile preview',
        uploadProfilePicture: 'Upload profile picture',
        name: 'Name',
        username: 'Username',
        email: 'Email',
        save: 'Save',
        currentPassword: 'Current password',
        newPassword: 'New password',
        confirmNewPassword: 'Confirm new password',
        profileSaved: 'Profile saved',
        passwordsDoNotMatch: 'Passwords do not match',
        passwordUpdated: 'Password updated',
      },
      admin: {
        panel: 'Admin panel',
        loginSuccess: 'Login success',
        welcome: 'Welcome, Thompson P.',
        incorrectTitle: 'Your password is incorrect or this email does not exist',
        incorrectHelp: 'Please try another password or email',
        closeError: 'Close error',
      },
    },
  },
} as const

type SupportedLanguage = keyof typeof resources

const supportedLanguages = Object.keys(resources) as SupportedLanguage[]

function getInitialLanguage(): SupportedLanguage {
  const savedLanguage = window.localStorage.getItem('hh.language')

  if (supportedLanguages.includes(savedLanguage as SupportedLanguage)) {
    return savedLanguage as SupportedLanguage
  }

  return 'th'
}

void i18n
  .use(initReactI18next)
  .init({
    resources,
    lng: getInitialLanguage(),
    fallbackLng: 'th',
    interpolation: {
      escapeValue: false,
    },
  })

i18n.on('languageChanged', (language) => {
  const normalizedLanguage = supportedLanguages.includes(language as SupportedLanguage)
    ? language
    : 'th'

  document.documentElement.lang = normalizedLanguage
  window.localStorage.setItem('hh.language', normalizedLanguage)
})

document.documentElement.lang = i18n.language

export { supportedLanguages }
export type { SupportedLanguage }
export default i18n
