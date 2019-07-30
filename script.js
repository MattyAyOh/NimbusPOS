const {
  openBrowser,
  goto,
  click,
  toLeftOf,
  toRightOf,
  inputField,
  below,
  closeBrowser,
} = require("taiko");

const { DateTime } = require("luxon");

(async () => {
  try {
    const nextMinute = DateTime.local().get("minute") + 1;

    await openBrowser();
    await goto("http://localhost:3060");

    // Reservation
    await click("KTV");
    await click("4", toRightOf("KTV"));
    await click("--:--", toLeftOf("--:--"));
    await click(String(nextMinute), toRightOf($("span"), below("--:--")));
    await click("--:--", toRightOf("to"));
    await click(String(nextMinute), toRightOf($("span"), below("--:--")));
    await click("Save")

    // Group
    await click("1");
    await click("+");
    await click("Checkout");
    await click("Confirm");

    // Close reservation
    await click("Remove");

    // Admin
    await goto("http://localhost:3060/admin");
    await click("100%");
    await click("90%");
    await click("Month to date");
    await click("Tue");
    await goto("http://localhost:3060");
    await goto("http://localhost:3060/admin");
    await click("50%");
    await click("Any Day");

    // Menu
    await goto("http://localhost:3060/bigscreen");
    await goto("http://localhost:3060");
  } catch (error) {
    console.error(error);
  } finally {
    await closeBrowser();
  }
})();
