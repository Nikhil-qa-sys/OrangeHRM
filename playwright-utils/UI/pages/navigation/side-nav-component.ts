import { type Locator, type Page } from '@playwright/test'

export class SideNavComponent {
  public readonly menu: Locator
  public readonly myInfoLink: Locator

  constructor(private page: Page) {
    this.menu = this.page.getByRole('navigation', { name: 'Sidepanel' })
    this.myInfoLink = this.menu.getByRole('link', { name: 'My Info' })
  }

  async openMyInfo() {
    await this.myInfoLink.click()
  }
}
