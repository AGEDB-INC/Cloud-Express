import React, { useEffect, useState } from 'react'
import { useDispatch } from 'react-redux'
import { Collapse } from 'react-bootstrap';

const ServerDisconnectFrame = ({ refKey, isPinned, reqString, disconnectToAgensGraph, addFrame, removeFrame, pinFrame, addAlert }) => {
    const [isExpanded, setIsExpanded] = useState(true)
    const dispatch = useDispatch();

    useEffect(() => {
        dispatch(() => disconnectToAgensGraph())
        /*dispatch(() => addFrame(':server connect'));*/
        /*dispatch(() => addAlert('NoticeServerDisconnected'));*/
    }, [dispatch, disconnectToAgensGraph, addFrame, addAlert])



    const setIconForIsExpanded = (isExpanded) => {
        if (isExpanded) {
            return <span className="fas fa-angle-up fa-lg" aria-hidden="true"></span>
        } else {
            return <span className="fas fa-angle-down fa-lg" aria-hidden="true"></span>
        }
    }


    return (
        <div className="card mt-3">
            <div className="card-header">
                <div className="d-flex card-title text-muted">
                    <div className="mr-auto"><strong> $ {reqString} </strong></div>
                    <button className={"frame-head-button btn btn-link px-3" + (isPinned ? " selected " : "")} onClick={() => pinFrame(refKey)}><span className="fas fa-paperclip fa-lg"
                        aria-hidden="true"></span></button>
                    <button className="frame-head-button btn btn-link px-3" data-toggle="collapse"
                        aria-expanded={isExpanded} onClick={() => setIsExpanded(!isExpanded)} aria-controls={refKey}>
                        {setIconForIsExpanded(isExpanded)}</button>
                    <button className="frame-head-button btn btn-link pl-3">
                        <span className="fas fa-times fa-lg" aria-hidden="true" onClick={() => removeFrame(refKey)}></span></button>
                </div>
            </div>
            <Collapse in={isExpanded}>
                <div className="card-body collapse" id={refKey}>
                    <div className="row">
                        <div className="col-3">
                            <h3>Disconnected Succesfully</h3>
                            <p>You are successfully disconnected from Agensgraph.</p>
                        </div>
                        <div className="col-9">
                            <p>You may run <a href="/#" className="badge badge-light"><span
                                className="fa fa-play-circle-o fa-lg pr-2" aria-hidden="true"></span>:server connection</a> to establish new connection</p>
                        </div>
                    </div>
                </div>
            </Collapse>
            <div className="card-footer">

            </div>
        </div>
    );
}

export default ServerDisconnectFrame