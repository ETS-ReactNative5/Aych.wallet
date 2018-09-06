import React from 'react'
import PropTypes from 'prop-types'
import { compose, bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import { actions, selectors } from 'data'

import modalEnhancer from 'providers/ModalEnhancer'
import LockboxSetup from './template'
import SetupTypeStep from './SetupTypeStep'
import ConnectDeviceStep from './ConnectDeviceStep'
import NameDeviceStep from './NameDeviceStep'
import OpenBtcAppStep from './OpenBtcAppStep'
import DuplicateDeviceStep from './DuplicateDeviceStep'
import AuthenticityCheckStep from './AuthenticityCheckStep'

class LockboxSetupContainer extends React.PureComponent {
  render () {
    const { currentStep, position, total, closeAll } = this.props

    // TODO: need to block closing of modal during entire setup
    return (
      <LockboxSetup position={position} total={total} closeAll={closeAll}>
        {(!currentStep || currentStep === 'setup-type') && <SetupTypeStep />}
        {currentStep === 'connect-device' && <ConnectDeviceStep />}
        {currentStep === 'authenticity-check' && (
          <AuthenticityCheckStep closeModal={closeAll} />
        )}
        {currentStep === 'open-btc-app' && <OpenBtcAppStep />}
        {currentStep === 'duplicate-device' && <DuplicateDeviceStep />}
        {currentStep === 'name-device' && <NameDeviceStep />}
      </LockboxSetup>
    )
  }
}

LockboxSetupContainer.propTypes = {
  currentStep: PropTypes.string.isRequired,
  position: PropTypes.number.isRequired,
  total: PropTypes.number.isRequired,
  closeAll: PropTypes.func.isRequired
}

const mapStateToProps = state => ({
  currentStep: selectors.components.lockbox.getNewDeviceSetupStep(state)
})

const mapDispatchToProps = dispatch => ({
  lockboxActions: bindActionCreators(actions.components.lockbox, dispatch)
})

const enhance = compose(
  modalEnhancer('LockboxSetup'),
  connect(
    mapStateToProps,
    mapDispatchToProps
  )
)

export default enhance(LockboxSetupContainer)