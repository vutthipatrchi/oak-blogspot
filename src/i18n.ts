import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'

const resources = {
  th: {
    translation: {
      common: {
        notifications: 'การแจ้งเตือน',
        profile: 'โปรไฟล์',
        adminPanel: 'แผงผู้ดูแล',
        resetPassword: 'รีเซ็ตรหัสผ่าน',
        showPassword: 'แสดงรหัสผ่าน',
        hidePassword: 'ซ่อนรหัสผ่าน',
        logout: 'ออกจากระบบ',
        login: 'เข้าสู่ระบบ',
        signup: 'สมัครสมาชิก',
        language: 'ภาษา',
        switchLanguage: 'เปลี่ยนภาษาเป็น {{language}}',
        thai: 'ไทย',
        english: 'อังกฤษ',
      },
      notifications: {
        empty: 'ยังไม่มีการแจ้งเตือน',
        newComment: '{{actor}} แสดงความคิดเห็นใน {{title}}',
        articleLike: '{{actor}} ถูกใจบทความ {{title}}',
        commentReply: '{{actor}} ตอบกลับความคิดเห็นของคุณใน {{title}}',
        commentLike: '{{actor}} ถูกใจความคิดเห็นของคุณใน {{title}}',
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
        loading: 'กำลังโหลดบทความ...',
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
        reply: 'ตอบกลับ',
        replyPlaceholder: 'เขียนคำตอบ...',
        likeComment: 'ถูกใจความคิดเห็นนี้',
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
        forgotPassword: 'ลืมรหัสผ่าน?',
        recoveryHelp: 'กรอกอีเมลที่ใช้สมัครสมาชิกเพื่อรับลิงก์ตั้งรหัสผ่านใหม่',
        sendRecoveryLink: 'ส่งลิงก์รีเซ็ตรหัสผ่าน',
        recoverySent: 'หากมีบัญชีที่ใช้อีเมลนี้ เราได้ส่งลิงก์ตั้งรหัสผ่านใหม่ให้แล้ว โปรดตรวจสอบอีเมล',
        tooManyRecoveryRequests: 'ส่งคำขอหลายครั้งเกินไป โปรดลองอีกครั้งภายหลัง',
        recoveryRequestFailed: 'ส่งลิงก์รีเซ็ตรหัสผ่านไม่สำเร็จ โปรดลองอีกครั้ง',
        recoveryServiceUnavailable: 'ระบบส่งอีเมลยังไม่พร้อมใช้งาน โปรดลองอีกครั้งภายหลัง',
        backToLogin: 'กลับไปหน้าเข้าสู่ระบบ',
        setNewPassword: 'ตั้งรหัสผ่านใหม่',
        newPassword: 'รหัสผ่านใหม่',
        confirmPassword: 'ยืนยันรหัสผ่านใหม่',
        passwordsDoNotMatch: 'รหัสผ่านใหม่ไม่ตรงกัน',
        saveNewPassword: 'บันทึกรหัสผ่านใหม่',
        recoveryLinkInvalid: 'ลิงก์รีเซ็ตรหัสผ่านไม่ถูกต้องหรือหมดอายุ โปรดขอลิงก์ใหม่',
        passwordResetFailed: 'ตั้งรหัสผ่านใหม่ไม่สำเร็จ โปรดลองอีกครั้ง',
        passwordResetSuccess: 'ตั้งรหัสผ่านใหม่แล้ว คุณสามารถเข้าสู่ระบบได้',
        invalidCredentials: 'อีเมล ชื่อผู้ใช้ หรือรหัสผ่านไม่ถูกต้อง',
        adminRequired: 'บัญชีนี้ไม่มีสิทธิ์เข้าถึงแผงผู้ดูแล',
        tooManyAttempts: 'ลองเข้าสู่ระบบหลายครั้งเกินไป โปรดลองอีกครั้งภายหลัง',
        serviceUnavailable: 'ระบบเข้าสู่ระบบยังไม่พร้อมใช้งาน โปรดลองอีกครั้งภายหลัง',
        connectionError: 'เชื่อมต่อระบบเข้าสู่ระบบไม่ได้ โปรดลองอีกครั้ง',
        loginFailed: 'เข้าสู่ระบบไม่สำเร็จ โปรดลองอีกครั้ง',
        signupFailed: 'สมัครสมาชิกไม่สำเร็จ โปรดลองอีกครั้ง',
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
        adminPanel: 'Admin panel',
        resetPassword: 'Reset password',
        showPassword: 'Show password',
        hidePassword: 'Hide password',
        logout: 'Log out',
        login: 'Log in',
        signup: 'Sign up',
        language: 'Language',
        switchLanguage: 'Switch language to {{language}}',
        thai: 'Thai',
        english: 'English',
      },
      notifications: {
        empty: 'No notifications yet.',
        newComment: '{{actor}} commented on {{title}}',
        articleLike: '{{actor}} liked {{title}}',
        commentReply: '{{actor}} replied to your comment on {{title}}',
        commentLike: '{{actor}} liked your comment on {{title}}',
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
        loading: 'Loading articles...',
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
        reply: 'Reply',
        replyPlaceholder: 'Write a reply...',
        likeComment: 'Like this comment',
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
        forgotPassword: 'Forgot password?',
        recoveryHelp: 'Enter the email address for your account to receive a password reset link.',
        sendRecoveryLink: 'Send reset link',
        recoverySent: 'If an account exists for this email, a password reset link has been sent. Please check your inbox.',
        tooManyRecoveryRequests: 'Too many reset requests. Please try again later.',
        recoveryRequestFailed: 'Could not send the reset link. Please try again.',
        recoveryServiceUnavailable: 'The email service is temporarily unavailable. Please try again later.',
        backToLogin: 'Back to login',
        setNewPassword: 'Set a new password',
        newPassword: 'New password',
        confirmPassword: 'Confirm new password',
        passwordsDoNotMatch: 'Passwords do not match.',
        saveNewPassword: 'Save new password',
        recoveryLinkInvalid: 'This reset link is invalid or expired. Please request a new one.',
        passwordResetFailed: 'Could not reset your password. Please try again.',
        passwordResetSuccess: 'Your password has been updated. You can now log in.',
        invalidCredentials: 'Email, username, or password is incorrect.',
        adminRequired: 'This account cannot access the admin panel.',
        tooManyAttempts: 'Too many login attempts. Please try again later.',
        serviceUnavailable: 'Login is temporarily unavailable. Please try again later.',
        connectionError: 'Could not connect to the login service. Please try again.',
        loginFailed: 'Login failed. Please try again.',
        signupFailed: 'Sign up failed. Please try again.',
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
