import {connect} from 'react-redux'
import {connectToAgensGraph} from '../../../features/database/DatabaseSlice'
import {getMetaData} from '../../../features/database/MetadataSlice'
import {removeFrame, pinFrame} from '../../../features/frame/FrameSlice'
import {addAlert} from '../../../features/alert/AlertSlice'
import ServerConnectFrame from '../presentations/ServerConnectFrame'

const mapStateToProps = (state) => {
    return {
    }
}

const mapDispatchToProps = { connectToAgensGraph, removeFrame, pinFrame, addAlert, getMetaData }


export default connect(mapStateToProps, mapDispatchToProps)(ServerConnectFrame);
