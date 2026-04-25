
// Subscription Plans
export const SUBSCRIPTION_PLANS = {
  studyHub: {
    sixMonths: {
      name: 'Study Hub - 6 Months',
      price: 70000, // Paystack expects amount in kobo (₦700)
      duration: 6,
      features: [
        'All past questions (JAMB, WAEC, NECO)',
        'CBT practice mode',
        'Performance analytics',
        'Study plans & reminders',
        'Offline access',
        'Progress tracking',
      ],
    },
    oneYear: {
      name: 'Study Hub - 1 Year',
      price: 100000, // ₦1,000
      duration: 12,
      features: [
        'All past questions (JAMB, WAEC, NECO)',
        'CBT practice mode',
        'Performance analytics',
        'Study plans & reminders',
        'Offline access',
        'Progress tracking',
        'Priority support',
      ],
    },
  },
  businessSchool: {
    lifetime: {
      name: 'Digital Business School - Lifetime',
      price: 100000, // ₦1,000
      duration: null, // Lifetime
      features: [
        'Platform access',
        'Free courses library',
        'Community access',
        'Premium courses (paid separately)',
        'Expert-led content',
        'Sales funnel templates',
        'Marketing playbooks',
      ],
    },
  },
  aiLab: {
    lifetime: {
      name: 'AI Skills Lab - Lifetime',
      price: 100000, // ₦1,000
      duration: null, // Lifetime
      features: [
        'Platform access',
        'Free AI tools',
        'Basic tutorials',
        'Premium tools (paid separately)',
        'Weekly updates',
        'Prompt engineering course',
        'AI automation templates',
      ],
    },
  },
};

// Exam Types
export const EXAM_TYPES = [
  { value: 'JAMB', label: 'JAMB' },
  { value: 'WAEC', label: 'WAEC' },
  { value: 'NECO', label: 'NECO' },
];

// Subjects (fallback if API doesn't return subjects)
export const SUBJECTS = [
  { value: 'mathematics', label: 'Mathematics' },
  { value: 'english', label: 'English Language' },
  { value: 'physics', label: 'Physics' },
  { value: 'chemistry', label: 'Chemistry' },
  { value: 'biology', label: 'Biology' },
  { value: 'geography', label: 'Geography' },
  { value: 'economics', label: 'Economics' },
  { value: 'government', label: 'Government' },
  { value: 'literature', label: 'Literature in English' },
  { value: 'commerce', label: 'Commerce' },
  { value: 'accounting', label: 'Accounting' },
  { value: 'crk', label: 'Christian Religious Knowledge' },
  { value: 'irk', label: 'Islamic Religious Knowledge' },
  { value: 'civileducation', label: 'Civic Education' },
  { value: 'agricultural-science', label: 'Agricultural Science' },
];

// Course Categories
export const COURSE_CATEGORIES = [
  { value: 'digital-marketing', label: 'Digital Marketing' },
  { value: 'sales', label: 'Sales' },
  { value: 'business-strategy', label: 'Business Strategy' },
  { value: 'entrepreneurship', label: 'Entrepreneurship' },
  { value: 'social-media', label: 'Social Media' },
  { value: 'content-creation', label: 'Content Creation' },
];

// Course Levels
export const COURSE_LEVELS = [
  { value: 'beginner', label: 'Beginner' },
  { value: 'intermediate', label: 'Intermediate' },
  { value: 'advanced', label: 'Advanced' },
];