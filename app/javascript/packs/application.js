/* eslint no-console:0 */

window.jQuery = require("jquery")
window.$ = jQuery

var componentRequireContext = require.context("components", true)
var ReactRailsUJS = require("react_ujs")
ReactRailsUJS.useContext(componentRequireContext)
