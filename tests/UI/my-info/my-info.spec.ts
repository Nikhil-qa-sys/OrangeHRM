import { expect, test } from '@playwright/test'
import { LoginPage } from '../../../playwright-utils/UI/pages/auth/login-page'
import { SideNavComponent } from '../../../playwright-utils/UI/pages/navigation/side-nav-component'
import { PersonalDetailsPage } from '../../../playwright-utils/UI/pages/my-info/personal-details-page'
import { ContactDetailsPage } from '../../../playwright-utils/UI/pages/my-info/contact-details-page'
import { testData } from '../../../playwright-utils/UI/test-data/my-info.data'

let employeeFullName = ''

test.describe('My Info', () => {
  test('QA-101 | User can update personal details, custom fields, attachments and contact details from My Info', async ({ page }) => {
    const loginPage = new LoginPage(page)
    const sideNavComponent = new SideNavComponent(page)
    const personalDetailsPage = new PersonalDetailsPage(page)
    const contactDetailsPage = new ContactDetailsPage(page)

    await test.step('Log in to OrangeHRM', async () => {
      await loginPage.open(process.env.BASE_URL!)
      await loginPage.login(process.env.TEST_USERNAME!, process.env.TEST_PASSWORD!)
      await expect(sideNavComponent.menu).toBeVisible()
    })

    await test.step('Open My Info from the side navigation', async () => {
      const sectionsLoaded = personalDetailsPage.waitForSectionsToLoad()
      await sideNavComponent.openMyInfo()
      await sectionsLoaded
      await expect(page).toHaveURL(/\/pim\/viewPersonalDetails\/empNumber\/\d+$/)
      await expect(personalDetailsPage.heading).toBeVisible()
    })

    await test.step('Fill every personal detail with unique values and save', async () => {
      const details = await personalDetailsPage.updatePersonalDetails(testData['QA-101'].personalDetails)
      await expect(personalDetailsPage.personalDetailsUpdatedMessage).toBeVisible()
      await expect(personalDetailsPage.firstNameInput).toHaveValue(details.firstName)
      await expect(personalDetailsPage.middleNameInput).toHaveValue(details.middleName)
      await expect(personalDetailsPage.lastNameInput).toHaveValue(details.lastName)
      await expect(personalDetailsPage.employeeIdInput).toHaveValue(details.employeeId)
      await expect(personalDetailsPage.otherIdInput).toHaveValue(details.otherId)
      await expect(personalDetailsPage.licenseNumberInput).toHaveValue(details.licenseNumber)
      await expect(personalDetailsPage.licenseExpiryDateInput).toHaveValue(details.licenseExpiryDate)
      await expect(personalDetailsPage.nationalitySelect).toHaveText(details.nationality)
      await expect(personalDetailsPage.maritalStatusSelect).toHaveText(details.maritalStatus)
      await expect(personalDetailsPage.dateOfBirthInput).toHaveValue(details.dateOfBirth)
      await expect(personalDetailsPage.genderRadio(details.gender)).toBeChecked()
      employeeFullName = `${details.firstName} ${details.lastName}`
    })

    await test.step('Fill the custom fields and save', async () => {
      const customTextValue = await personalDetailsPage.updateCustomFields(testData['QA-101'].customFields)
      await expect(personalDetailsPage.customFieldsSavedMessage).toBeVisible()
      await expect(personalDetailsPage.bloodTypeSelect).toHaveText(testData['QA-101'].customFields.bloodType)
      await expect(personalDetailsPage.customTextInput(testData['QA-101'].customFields.textFieldLabel)).toHaveValue(customTextValue)
    })

    await test.step('Replace every attachment with two new files', async () => {
      await personalDetailsPage.deleteAllAttachments()
      await expect(personalDetailsPage.attachmentsRecordsFoundLabel).toHaveText('No Records Found')

      const uploadedFileNames = await personalDetailsPage.uploadAttachments(testData['QA-101'].attachments)
      await expect(personalDetailsPage.attachmentsRecordsFoundLabel).toHaveText(`(${uploadedFileNames.length}) Records Found`)
      for (const fileName of uploadedFileNames) {
        await expect(personalDetailsPage.attachmentRow(fileName)).toBeVisible()
      }
    })

    await test.step('Open Contact Details from the personal details tabs', async () => {
      const contactDetailsLoaded = contactDetailsPage.waitForContactDetailsToLoad()
      await personalDetailsPage.openContactDetails()
      await contactDetailsLoaded
      await expect(page).toHaveURL(/\/pim\/contactDetails\/empNumber\/\d+$/)
      await expect(contactDetailsPage.heading).toBeVisible()
      await expect(contactDetailsPage.employeeNameHeading(employeeFullName)).toBeVisible()
    })

    await test.step('Fill every contact detail and save', async () => {
      const details = await contactDetailsPage.updateContactDetails(testData['QA-101'].contactDetails)
      await expect(contactDetailsPage.contactDetailsUpdatedMessage).toBeVisible()
      await expect(contactDetailsPage.street1Input).toHaveValue(details.street1)
      await expect(contactDetailsPage.street2Input).toHaveValue(details.street2)
      await expect(contactDetailsPage.cityInput).toHaveValue(details.city)
      await expect(contactDetailsPage.stateProvinceInput).toHaveValue(details.stateProvince)
      await expect(contactDetailsPage.zipPostalCodeInput).toHaveValue(details.zipPostalCode)
      await expect(contactDetailsPage.countrySelect).toHaveText(details.country)
      await expect(contactDetailsPage.homePhoneInput).toHaveValue(details.homePhone)
      await expect(contactDetailsPage.mobilePhoneInput).toHaveValue(details.mobilePhone)
      await expect(contactDetailsPage.workPhoneInput).toHaveValue(details.workPhone)
      await expect(contactDetailsPage.workEmailInput).toHaveValue(details.workEmail)
      await expect(contactDetailsPage.otherEmailInput).toHaveValue(details.otherEmail)
    })
  })
})
