// Get environment from process.env. TEST_ENV selects the data set and defaults to qa.
const ENV = process.env.TEST_ENV || 'qa'

// QA environment test data
const qaTestData = {
  // Personal details cases
  'QA-101': {
    personalDetails: {
      employeeIdPrefix: 'QA',
      otherIdPrefix: 'QAOID',
      licenseNumberPrefix: 'QADL',
      // OrangeHRM's demo is localized to yyyy-dd-mm
      licenseExpiryDate: '2030-15-06',
      nationality: 'Indian',
      maritalStatus: 'Married',
      dateOfBirth: '1990-20-04',
      gender: 'Female' as const,
    },
    customFields: {
      bloodType: 'O+',
      textFieldLabel: 'Test_Field',
      textValuePrefix: 'qa',
    },
    attachments: {
      fileNamePrefix: 'qa-attachment-',
      fileCount: 2,
    },
    contactDetails: {
      street1: '221 Automation Street',
      street2: 'Suite 4B',
      city: 'Pune',
      stateProvince: 'Maharashtra',
      zipPostalCode: '411001',
      country: 'India',
      emailDomain: 'example.com',
    },
  },
}

// RC environment test data
const rcTestData: typeof qaTestData = {
  'QA-101': {
    personalDetails: {
      employeeIdPrefix: 'RC',
      otherIdPrefix: 'RCOID',
      licenseNumberPrefix: 'RCDL',
      licenseExpiryDate: '2030-15-06',
      nationality: 'Indian',
      maritalStatus: 'Married',
      dateOfBirth: '1990-20-04',
      gender: 'Female' as const,
    },
    customFields: {
      bloodType: 'O+',
      textFieldLabel: 'Test_Field',
      textValuePrefix: 'rc',
    },
    attachments: {
      fileNamePrefix: 'rc-attachment-',
      fileCount: 2,
    },
    contactDetails: {
      street1: '221 Automation Street',
      street2: 'Suite 4B',
      city: 'Pune',
      stateProvince: 'Maharashtra',
      zipPostalCode: '411001',
      country: 'India',
      emailDomain: 'example.com',
    },
  },
}

// Regression environment test data
const regressionTestData: typeof qaTestData = {
  'QA-101': {
    personalDetails: {
      employeeIdPrefix: 'RG',
      otherIdPrefix: 'RGOID',
      licenseNumberPrefix: 'RGDL',
      licenseExpiryDate: '2030-15-06',
      nationality: 'Indian',
      maritalStatus: 'Married',
      dateOfBirth: '1990-20-04',
      gender: 'Female' as const,
    },
    customFields: {
      bloodType: 'O+',
      textFieldLabel: 'Test_Field',
      textValuePrefix: 'rg',
    },
    attachments: {
      fileNamePrefix: 'reg-attachment-',
      fileCount: 2,
    },
    contactDetails: {
      street1: '221 Automation Street',
      street2: 'Suite 4B',
      city: 'Pune',
      stateProvince: 'Maharashtra',
      zipPostalCode: '411001',
      country: 'India',
      emailDomain: 'example.com',
    },
  },
}

// Export test data based on environment
let testData = qaTestData
if (ENV === 'qa') {
  testData = qaTestData
}
if (ENV === 'rc') {
  testData = rcTestData
}
if (ENV === 'regression') {
  testData = regressionTestData
}

export { testData }
