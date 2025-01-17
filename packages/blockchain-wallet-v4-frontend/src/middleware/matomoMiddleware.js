import { contains, equals, path, prop } from 'ramda'

const PAYLOAD = ['payload']
const NAME = ['payload', 'name']
const TYPE = ['payload', 'type']
const FORM = ['meta', 'form']
const FIELD = ['meta', 'field']
const LOCATION = ['payload', 'location', 'pathname']
const _ERROR = ['payload', '_error']

// keep alphabetized
const TYPE_WHITELIST = [
  '@@redux-form/CHANGE',
  '@@redux-form/SET_SUBMIT_SUCCEEDED',
  '@@redux-form/STOP_SUBMIT',
  '@@redux-form/START_SUBMIT',
  '@@router/LOCATION_CHANGE',
  '@ANALYTICS.LOG_EVENT',
  '@CORE.SET_ACCOUNT_ARCHIVED',
  '@CORE.SET_ACCOUNT_LABEL',
  '@CORE.SET_DEFAULT_ACCOUNT',
  '@CORE.SET_EMAIL_VERIFIED',
  '@EVENT.KYC.INITIALIZE_VERIFICATION',
  '@EVENT.KYC.UPDATE_EMAIL',
  '@EVENT.BORROW.SET_STEP',
  // Removing because https://blockc.slack.com/archives/CFE6HGEJD/p1578311066001100
  // 'LOG_ERROR_MSG',
  'SHOW_MODAL'
]

let lastEvent = []

const matomoMiddleware = () => store => next => action => {
  try {
    const eventCategory = prop('type', action)
    const nextAction =
      path(FORM, action) ||
      path(NAME, action) ||
      path(TYPE, action) ||
      path(LOCATION, action) ||
      path(PAYLOAD, action)
    const eventName = path(FIELD, action) || path(_ERROR, action)
    const eventAction =
      typeof nextAction !== 'string' ? JSON.stringify(nextAction) : nextAction
    const logEvent = contains(action.type, TYPE_WHITELIST)
    const nextEvent = [eventCategory, eventAction, eventName]

    if (logEvent && !equals(nextEvent, lastEvent)) {
      const frame = document.getElementById('matomo-iframe')
      frame.contentWindow.postMessage(
        {
          method: 'trackEvent',
          messageData: nextEvent
        },
        '*'
      )

      lastEvent = nextEvent
    }
  } catch (e) {
    /* eslint-disable-next-line */
    console.log(e)
  }

  return next(action)
}

export default matomoMiddleware
